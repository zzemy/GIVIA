import { NextResponse } from "next/server";
import {
  buildUnknownRecognition,
  type RecognitionResult,
} from "@/lib/analysis/cultural-analyzer";
import { buildGiftProfile } from "@/lib/analysis/gift-profile";

export const runtime = "nodejs";

type DashScopeMessageContent =
  | string
  | Array<{
      type?: string;
      text?: string;
    }>;

type DashScopeResponse = {
  choices?: Array<{
    message?: {
      content?: DashScopeMessageContent;
    };
  }>;
};

type VisionResponse = {
  recognition: RecognitionResult;
  source: string;
  rawLabels?: string[];
  description?: string;
  detectedLabel?: string;
};

type ProviderErrorPayload = {
  error?: {
    message?: string;
    code?: string;
  };
};

type IncomingImagePayload = {
  image?: string;
  text?: string;
  name?: string;
  description?: string;
  language?: "zh" | "en";
};

type UILanguage = "zh" | "en";

type IncomingRecognitionPayload =
  | {
      kind: "image";
      mimeType: string;
      imageDataUrl: string;
      language: UILanguage;
    }
  | {
      kind: "text";
      text: string;
      name: string;
      description: string;
      language: UILanguage;
    };

function categoryToTitle(category: string): string {
  switch (category) {
    case "stationery":
      return "Stationery Gift";
    case "tea":
      return "Tea Gift";
    case "coffee":
      return "Coffee Gift";
    case "gourmet":
      return "Gourmet Gift";
    case "home":
      return "Home Gift";
    case "accessories":
      return "Accessory Gift";
    case "umbrella":
      return "Umbrella";
    case "clock":
      return "Clock";
    case "knife":
      return "Knife Set";
    case "perfume":
      return "Perfume";
    default:
      return "Gift Item";
  }
}

function buildLocalFallbackResponse(input: {
  language: UILanguage;
  text: string;
  name?: string;
  description?: string;
  imageName?: string;
  kind: "text" | "image";
}): VisionResponse {
  const profile = buildGiftProfile({
    giftContext: {
      name: input.name ?? input.imageName ?? "",
      description: input.description ?? input.text,
      visionLabel: input.imageName ?? "",
      rawLabels: input.text ? [input.text] : [],
    },
    recognition: null,
  });

  const label = input.name?.trim() || profile.displayName || categoryToTitle(profile.category);
  const normalizedLabel = shortenText(label || categoryToTitle(profile.category), 60);
  const recognition = buildUnknownRecognition(normalizedLabel);
  const descriptionParts = [
    profile.category !== "general" ? categoryToTitle(profile.category) : "",
    profile.materials.length > 0 ? profile.materials.join(", ") : "",
    profile.styles.length > 0 ? profile.styles.join(", ") : "",
    profile.colors.length > 0 ? profile.colors.join(", ") : "",
  ].filter(Boolean);

  return {
    recognition: {
      ...recognition,
      itemZh: normalizedLabel,
      itemEn: normalizedLabel,
      category: profile.category === "general" ? "General" : categoryToTitle(profile.category),
      confidence: input.kind === "text" ? 0.66 : 0.52,
    },
    source: input.kind === "text" ? "local-fallback-text" : "local-fallback",
    rawLabels: sanitizeRawLabels([
      normalizedLabel,
      ...profile.semanticTags,
      ...(profile.brandTokens ?? []),
    ]),
    description: sanitizeDescription(
      descriptionParts.join(input.language === "en" ? ", " : "，"),
      input.language === "en"
        ? "Structured from local fallback parsing."
        : "已通过本地规则完成结构化识别。",
    ),
    detectedLabel: sanitizeLabel(normalizedLabel, normalizedLabel),
  };
}

async function readProviderError(response: Response): Promise<string> {
  const raw = await response.text();

  try {
    const parsed = JSON.parse(raw) as ProviderErrorPayload;
    const message = parsed.error?.message?.trim();
    const code = parsed.error?.code?.trim();

    if (message && code) {
      return `${code}: ${message}`;
    }

    if (message) {
      return message;
    }
  } catch {
    if (raw.trim()) {
      return raw.slice(0, 500);
    }
  }

  return `provider request failed with status ${response.status}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
}

function toString(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toConfidence(value: unknown, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return clamp(value, 0.3, 0.98);
}

function shortenText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function isLikelyStructuredText(text: string): boolean {
  const compact = text.trim();

  if (!compact) {
    return false;
  }

  if (
    (compact.startsWith("{") && compact.endsWith("}")) ||
    (compact.startsWith("[") && compact.endsWith("]"))
  ) {
    return true;
  }

  return compact.includes("\"label\"") || compact.includes("\"description\"");
}

function pickFirstStringField(
  source: Record<string, unknown>,
  fieldNames: string[]
): string {
  for (const fieldName of fieldNames) {
    const value = toString(source[fieldName]);

    if (value) {
      return value;
    }
  }

  return "";
}

function sanitizeLabel(rawLabel: string, fallback: string): string {
  const raw = rawLabel.trim();
  const parsed = raw ? extractJsonFromText(raw) : null;

  if (parsed) {
    const extracted = pickFirstStringField(toRecord(parsed), [
      "label",
      "name",
      "item",
      "item_name",
    ]);

    if (extracted) {
      return shortenText(extracted, 60);
    }
  }

  if (raw && !isLikelyStructuredText(raw)) {
    return shortenText(raw, 60);
  }

  return shortenText(fallback.trim(), 60);
}

function sanitizeDescription(rawDescription: string, fallback: string): string {
  const raw = rawDescription.trim();
  const fallbackText = fallback.trim();

  if (!raw) {
    return shortenText(fallbackText, 240);
  }

  const parsed = extractJsonFromText(raw);

  if (parsed) {
    const parsedRecord = toRecord(parsed);
    const direct = pickFirstStringField(parsedRecord, [
      "description",
      "gift_description",
      "item_description",
      "summary",
      "desc",
    ]);

    if (direct) {
      return shortenText(direct, 240);
    }

    const nestedGift = toRecord(parsedRecord.gift);
    const nested = pickFirstStringField(nestedGift, [
      "description",
      "gift_description",
      "item_description",
      "summary",
      "desc",
    ]);

    if (nested) {
      return shortenText(nested, 240);
    }
  }

  if (isLikelyStructuredText(raw)) {
    return shortenText(fallbackText, 240);
  }

  return shortenText(raw, 240);
}

function sanitizeRawLabels(labels: string[]): string[] {
  return labels
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !isLikelyStructuredText(item))
    .map((item) => shortenText(item, 60))
    .slice(0, 6);
}

function extractTextContent(content: DashScopeMessageContent | undefined): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .filter((item) => item.type === "text" && typeof item.text === "string")
    .map((item) => item.text ?? "")
    .join("\n");
}

function extractJsonFromText(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

function buildRecognitionFromModelLabel(
  label: string,
  confidence: number
): RecognitionResult {
  const normalizedLabel = shortenText(label.trim() || "Unknown Gift Item", 60);
  const unknown = buildUnknownRecognition(normalizedLabel);

  return {
    ...unknown,
    itemZh: normalizedLabel,
    itemEn: normalizedLabel,
    confidence: clamp(confidence, 0.3, 0.98),
  };
}

function normalizeLanguage(value: unknown): UILanguage {
  return value === "en" ? "en" : "zh";
}

function buildTextRecognitionSystemPrompt(language: UILanguage): string {
  if (language === "en") {
    return "You are a gift text recognition assistant. Output JSON only with fields: label(string), description(string), confidence(number 0-1), synonyms(string[]). description must be exactly one English sentence with no more than 16 words. label must be a common English noun. synonyms max 3 items.";
  }

  return "你是礼物文本识别助手。你必须只输出 JSON。字段: label(string), description(string), confidence(number 0-1), synonyms(string[])。description 必须是单句且不超过 30 个汉字，label 使用英文通用名词，synonyms 最多 3 项。";
}

function buildTextRecognitionUserPrompt(text: string, language: UILanguage): string {
  if (language === "en") {
    return `Identify the gift object from this text and provide one brief English description sentence. label must be a precise common English noun, avoid preset terms. Gift text: ${text}`;
  }

  return `根据这段礼物信息识别礼物对象，并补充一句简短的物品描述。label 请使用最贴切的英文通用名词，避免套用固定预设词。礼物信息：${text}`;
}

function buildImageRecognitionSystemPrompt(language: UILanguage): string {
  if (language === "en") {
    return "You are a gift image recognition assistant. Output JSON only with fields: label(string), description(string), confidence(number 0-1), synonyms(string[]). description must be exactly one English sentence with no more than 16 words. label must be a common English noun. synonyms max 3 items.";
  }

  return "你是礼物图像识别助手。你必须只输出 JSON。字段: label(string), description(string), confidence(number 0-1), synonyms(string[])。description 必须是单句且不超过 30 个汉字，label 使用英文通用名词，synonyms 最多 3 项。";
}

function buildImageRecognitionUserPrompt(language: UILanguage): string {
  if (language === "en") {
    return "Identify the gift object in this image and provide one brief English description sentence. label must be a precise common English noun, avoid preset terms.";
  }

  return "识别这张图片中的礼物对象，并补充一句礼物描述。label 请使用最贴切的英文通用名词，避免套用固定预设词。";
}

function isUnsupportedVisionModel(model: string): boolean {
  const normalized = model.toLowerCase();

  return (
    normalized.startsWith("wanx") ||
    normalized.startsWith("wan2") ||
    normalized.includes("image-edit")
  );
}

function parseDataUrl(value: string): { mimeType: string; base64: string } | null {
  const matched = value.match(/^data:([^;]+);base64,(.+)$/);

  if (!matched) {
    return null;
  }

  return {
    mimeType: matched[1] || "image/jpeg",
    base64: matched[2] || "",
  };
}

async function readIncomingRecognitionPayload(
  request: Request
): Promise<IncomingRecognitionPayload | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const image = formData.get("image");
    const language = normalizeLanguage(formData.get("language"));

    if (!(image instanceof File)) {
      return null;
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageMimeType = image.type || "image/jpeg";

    return {
      kind: "image",
      mimeType: imageMimeType,
      imageDataUrl: `data:${imageMimeType};base64,${imageBuffer.toString("base64")}`,
      language,
    };
  }

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as IncomingImagePayload;
    const language = normalizeLanguage(payload.language);
    const text = typeof payload.text === "string" ? payload.text.trim() : "";
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const description =
      typeof payload.description === "string" ? payload.description.trim() : "";
    const composedText = text || [name, description].filter(Boolean).join(" ").trim();

    if (composedText) {
      return {
        kind: "text",
        text: composedText,
        name,
        description,
        language,
      };
    }

    const rawImage = typeof payload.image === "string" ? payload.image : "";
    const parsed = parseDataUrl(rawImage.trim());

    if (!parsed) {
      return null;
    }

    return {
      kind: "image",
      mimeType: parsed.mimeType,
      imageDataUrl: `data:${parsed.mimeType};base64,${parsed.base64}`,
      language,
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const incomingPayload = await readIncomingRecognitionPayload(request);

    if (!incomingPayload) {
      return NextResponse.json({ error: "missing image or text" }, { status: 400 });
    }

    if (incomingPayload.kind === "text") {
      const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY;
      const model =
        process.env.ALIYUN_DASHSCOPE_TEXT_MODEL ??
        "qwen-plus-latest";
      const baseUrl =
        process.env.ALIYUN_DASHSCOPE_BASE_URL ??
        "https://dashscope.aliyuncs.com/compatible-mode/v1";

      if (!apiKey) {
        return NextResponse.json(
          buildLocalFallbackResponse({
            kind: "text",
            language: incomingPayload.language,
            text: incomingPayload.text,
            name: incomingPayload.name,
            description: incomingPayload.description,
          })
        );
      }

      const textResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_tokens: 120,
          messages: [
            {
              role: "system",
              content: buildTextRecognitionSystemPrompt(incomingPayload.language),
            },
            {
              role: "user",
              content: buildTextRecognitionUserPrompt(
                incomingPayload.text,
                incomingPayload.language
              ),
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!textResponse.ok) {
        const providerError = await readProviderError(textResponse);

        return NextResponse.json(
          {
            error: `aliyun text recognition request failed: ${providerError}`,
          },
          { status: 502 }
        );
      }

      const textPayload = (await textResponse.json()) as DashScopeResponse;
      const textContent = extractTextContent(textPayload.choices?.[0]?.message?.content);
      const textParsed = extractJsonFromText(textContent);

      if (!textParsed) {
        return NextResponse.json(
          {
            error: "invalid model output: expected JSON object for text recognition",
          },
          { status: 502 }
        );
      }

      const parsedRecord = toRecord(textParsed);
      const primaryLabel = toString(parsedRecord.label);
      const modelDescription = toString(parsedRecord.description);
      const synonyms = toStringArray(parsedRecord.synonyms);
      const labels = [primaryLabel, ...synonyms].filter(Boolean);
      const confidence = toConfidence(parsedRecord.confidence, 0.72);

      if (!primaryLabel) {
        return NextResponse.json(
          {
            error: "invalid model output: missing label in text recognition",
          },
          { status: 502 }
        );
      }

      const responseRecognition = buildRecognitionFromModelLabel(primaryLabel, confidence);

      const response: VisionResponse = {
        recognition: responseRecognition,
        source: "aliyun-dashscope-text",
        rawLabels: sanitizeRawLabels(labels.slice(0, 5)),
        description: sanitizeDescription(modelDescription, ""),
        detectedLabel: sanitizeLabel(primaryLabel, responseRecognition.itemEn),
      };

      return NextResponse.json(response);
    }

    const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY;
    const model =
      process.env.ALIYUN_DASHSCOPE_VISION_MODEL ??
      "qwen-vl-plus-latest";
    const baseUrl =
      process.env.ALIYUN_DASHSCOPE_BASE_URL ??
      "https://dashscope.aliyuncs.com/compatible-mode/v1";

    if (isUnsupportedVisionModel(model)) {
      return NextResponse.json(
        {
          error:
            `unsupported vision model for recognition: ${model}. Please use a VL chat model such as qwen-vl-plus-latest.`,
        },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        buildLocalFallbackResponse({
          kind: "image",
          language: incomingPayload.language,
          text: "",
          imageName: "uploaded-image",
        })
      );
    }

    const imageDataUrl = incomingPayload.imageDataUrl;

    const dashScopeResponse = await fetch(
      `${baseUrl}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_tokens: 120,
          messages: [
            {
              role: "system",
              content: buildImageRecognitionSystemPrompt(incomingPayload.language),
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: buildImageRecognitionUserPrompt(incomingPayload.language),
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageDataUrl,
                  },
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!dashScopeResponse.ok) {
      const providerError = await readProviderError(dashScopeResponse);

      return NextResponse.json(
        {
          error: `aliyun vision request failed: ${providerError}`,
        },
        { status: 502 }
      );
    }

    const payload = (await dashScopeResponse.json()) as DashScopeResponse;
    const content = extractTextContent(payload.choices?.[0]?.message?.content);
    const parsed = extractJsonFromText(content);

    if (!parsed) {
      return NextResponse.json(
        {
          error: "invalid model output: expected JSON object for image recognition",
        },
        { status: 502 }
      );
    }

    const parsedRecord = toRecord(parsed);
    const primaryLabel = toString(parsedRecord.label);
    const modelDescription = toString(parsedRecord.description);
    const synonyms = toStringArray(parsedRecord.synonyms);
    const labels = [primaryLabel, ...synonyms].filter(Boolean);
    const confidence = toConfidence(parsedRecord.confidence, 0.78);

    if (!primaryLabel) {
      return NextResponse.json(
        {
          error: "invalid model output: missing label in image recognition",
        },
        { status: 502 }
      );
    }

    const responseRecognition = buildRecognitionFromModelLabel(primaryLabel, confidence);

    const response: VisionResponse = {
      recognition: responseRecognition,
      source: "aliyun-dashscope",
      rawLabels: sanitizeRawLabels(labels.slice(0, 5)),
      description: sanitizeDescription(modelDescription, ""),
      detectedLabel: sanitizeLabel(primaryLabel, responseRecognition.itemEn),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "failed to recognize gift" }, { status: 500 });
  }
}
