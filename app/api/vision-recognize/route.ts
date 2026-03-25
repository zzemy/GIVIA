import { NextResponse } from "next/server";
import {
  buildUnknownRecognition,
  type RecognitionResult,
} from "@/lib/analysis/cultural-analyzer";
import { buildGiftProfile } from "@/lib/analysis/gift-profile";
import { requestDashScopeCompletion } from "@/lib/ai/adapters/dashscope";
import type { ModelMessage } from "@/lib/ai/adapters/types";
import { sanitizeTextValue } from "@/lib/ai/guards/input-sanitizer";
import { extractSafeJsonObject } from "@/lib/ai/guards/safe-json";
import { validateVisionModelOutput } from "@/lib/ai/guards/output-validator";
import {
  detectPromptInjectionInFields,
  prependPromptInjectionGuard,
} from "@/lib/ai/guards/prompt-injection";
import {
  buildImageRecognitionMessages,
  buildTextRecognitionMessages,
} from "@/lib/ai/prompts/vision";

export const runtime = "nodejs";


type VisionResponse = {
  recognition: RecognitionResult;
  source: string;
  rawLabels?: string[];
  description?: string;
  detectedLabel?: string;
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
    const text = sanitizeTextValue(payload.text, { maxLength: 600 });
    const name = sanitizeTextValue(payload.name, { maxLength: 80 });
    const description = sanitizeTextValue(payload.description, { maxLength: 240 });
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

      const injectionAssessment = detectPromptInjectionInFields([
        incomingPayload.text,
        incomingPayload.name,
        incomingPayload.description,
      ]);
      const promptMessages = prependPromptInjectionGuard(
        buildTextRecognitionMessages(
          incomingPayload.text,
          incomingPayload.language,
        ) as ModelMessage[],
        injectionAssessment,
      );

      const textCompletion = await requestDashScopeCompletion({
        apiKey,
        baseUrl,
        model,
        temperature: 0.1,
        maxTokens: 120,
        responseFormat: { type: "json_object" },
        networkErrorPrefix: "aliyun text recognition network error",
        providerErrorPrefix: "aliyun text recognition request failed",
        messages: promptMessages,
      });

      if (!textCompletion.ok) {
        return NextResponse.json(
          {
            error: textCompletion.error,
          },
          { status: 502 }
        );
      }

      const textParsed = extractSafeJsonObject(textCompletion.content);

      if (!textParsed.ok) {
        return NextResponse.json(
          {
            error: `invalid model output: ${textParsed.error}`,
          },
          { status: 502 }
        );
      }

      const validatedOutput = validateVisionModelOutput(textParsed.value);

      if (!validatedOutput.ok) {
        return NextResponse.json(
          {
            error: `invalid model output: ${validatedOutput.errors.join("; ")}`,
          },
          { status: 502 }
        );
      }

      const primaryLabel = toString(validatedOutput.value.label);
      const modelDescription = toString(validatedOutput.value.description);
      const synonyms = toStringArray(validatedOutput.value.synonyms);
      const labels = [primaryLabel, ...synonyms].filter(Boolean);
      const confidence = toConfidence(validatedOutput.value.confidence, 0.72);

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
    const imagePrompt = buildImageRecognitionMessages(incomingPayload.language);
    const guardedVisionMessages = prependPromptInjectionGuard(
      [
        imagePrompt.system,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: imagePrompt.userText,
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
              },
            },
          ],
        },
      ] as ModelMessage[],
      detectPromptInjectionInFields([])
    );

    const visionCompletion = await requestDashScopeCompletion({
      apiKey,
      baseUrl,
      model,
      temperature: 0.1,
      maxTokens: 120,
      responseFormat: { type: "json_object" },
      networkErrorPrefix: "aliyun vision network error",
      providerErrorPrefix: "aliyun vision request failed",
      messages: guardedVisionMessages,
    });

    if (!visionCompletion.ok) {
      return NextResponse.json(
        {
          error: visionCompletion.error,
        },
        { status: 502 }
      );
    }

    const parsed = extractSafeJsonObject(visionCompletion.content);

    if (!parsed.ok) {
      return NextResponse.json(
        {
          error: `invalid model output: ${parsed.error}`,
        },
        { status: 502 }
      );
    }

    const validatedOutput = validateVisionModelOutput(parsed.value);

    if (!validatedOutput.ok) {
      return NextResponse.json(
        {
          error: `invalid model output: ${validatedOutput.errors.join("; ")}`,
        },
        { status: 502 }
      );
    }

    const primaryLabel = toString(validatedOutput.value.label);
    const modelDescription = toString(validatedOutput.value.description);
    const synonyms = toStringArray(validatedOutput.value.synonyms);
    const labels = [primaryLabel, ...synonyms].filter(Boolean);
    const confidence = toConfidence(validatedOutput.value.confidence, 0.78);

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
