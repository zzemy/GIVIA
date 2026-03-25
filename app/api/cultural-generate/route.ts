import { NextResponse } from "next/server";
import {
  buildUnknownRecognition,
  COUNTRY_OPTIONS,
  type CulturalAnalysis,
  type RecognitionResult,
  type SupportedCountry,
} from "@/lib/analysis/cultural-analyzer";
import { calculateCulturalFitScore, type GiftScore } from "@/lib/domain/gifting";
import { requestDashScopeCompletion as requestDashScopeAdapterCompletion } from "@/lib/ai/adapters/dashscope";
import type { ModelMessage, NormalizedModelCompletionResult } from "@/lib/ai/adapters/types";

export const runtime = "nodejs";

type ChatMessage = ModelMessage;

type GenerateRequest = {
  country: string;
  recognition?: RecognitionResult;
  giftContext?: {
    name?: string;
    description?: string;
    visionLabel?: string;
    visionDescription?: string;
    source?: string;
    rawLabels?: string[];
  };
  audience?: {
    group?: string;
    customGroup?: string;
    sceneTemplate?: string;
    ageBand?: string;
    gender?: string;
    occupation?: string;
    relationship?: string;
    occasion?: string;
    purpose?: string;
    budgetRange?: string;
    formality?: string;
    notes?: string;
  };
  language?: "zh" | "en";
};

type ResolvedGenerateRequest = Omit<GenerateRequest, "country"> & {
  country: SupportedCountry;
  recognition: RecognitionResult;
  giftContext: {
    name: string;
    description: string;
    visionLabel: string;
    visionDescription: string;
    source: string;
    rawLabels: string[];
  };
};

type GenerateResponse = {
  analysis: CulturalAnalysis;
  source: string;
};

type StrictParseResult = {
  analysis: CulturalAnalysis | null;
  missingFields: string[];
};

type CompletionResult = NormalizedModelCompletionResult;

function isRiskLevel(value: unknown): value is CulturalAnalysis["riskLevel"] {
  return value === "Low" || value === "Medium" || value === "High";
}

function normalizeRiskLevel(value: unknown): CulturalAnalysis["riskLevel"] | null {
  if (isRiskLevel(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (["low", "低", "低风险"].includes(normalized)) {
    return "Low";
  }

  if (["medium", "中", "中风险"].includes(normalized)) {
    return "Medium";
  }

  if (["high", "高", "高风险"].includes(normalized)) {
    return "High";
  }

  return null;
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return {};
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (typeof item === "number" || typeof item === "boolean") {
          return String(item);
        }

        return "";
      })
      .filter(Boolean)
      .join("、");

    return normalized || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    const direct =
      toStringValue(record.text) ??
      toStringValue(record.label) ??
      toStringValue(record.name) ??
      toStringValue(record.value);

    if (direct) {
      return direct;
    }

    const flattened = Object.values(record)
      .map((item) => toStringValue(item) ?? "")
      .filter(Boolean)
      .join("、");

    return flattened || null;
  }

  return null;
}

function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "1", "是"].includes(normalized)) {
      return true;
    }

    if (["false", "no", "0", "否"].includes(normalized)) {
      return false;
    }
  }

  return null;
}

function toNumberInRange(value: unknown): number | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const nested =
      getValueByAliases(record, ["value", "score", "分数", "number"]) ?? null;

    if (nested !== null) {
      return toNumberInRange(nested);
    }
  }

  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number.parseFloat(value)
        : Number.NaN;

  if (Number.isNaN(numeric)) {
    return null;
  }

  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function toStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/[\n,，;；、|]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  const result = value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (typeof item === "number" || typeof item === "boolean") {
        return String(item);
      }

      if (typeof item === "object" && item !== null) {
        const record = item as Record<string, unknown>;
        const text =
          toStringValue(record.label) ??
          toStringValue(record.name) ??
          toStringValue(record.text) ??
          "";

        return text;
      }

      return "";
    })
    .filter(Boolean);

  return result.slice(0, 6);
}

function hasAnyKeys(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => key in source);
}

function pickLikelyRootOutput(modelOutput: Record<string, unknown>): Record<string, unknown> {
  const expectedKeys = [
    "score",
    "riskLevel",
    "risk_level",
    "isTaboo",
    "warning",
    "packaging",
    "card",
    "semanticSignals",
  ];

  if (hasAnyKeys(modelOutput, expectedKeys)) {
    return modelOutput;
  }

  const nestedCandidates = [
    toRecord(modelOutput.analysis),
    toRecord(modelOutput.result),
    toRecord(modelOutput.data),
    toRecord(modelOutput.output),
    toRecord(modelOutput.response),
  ];

  const matchedCandidate = nestedCandidates.find((candidate) =>
    hasAnyKeys(candidate, expectedKeys)
  );

  return matchedCandidate ?? modelOutput;
}

function mergeRecords(
  base: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };

  for (const [key, patchValue] of Object.entries(patch)) {
    const baseValue = result[key];

    if (
      typeof baseValue === "object" &&
      baseValue !== null &&
      !Array.isArray(baseValue) &&
      typeof patchValue === "object" &&
      patchValue !== null &&
      !Array.isArray(patchValue)
    ) {
      result[key] = mergeRecords(
        baseValue as Record<string, unknown>,
        patchValue as Record<string, unknown>
      );
      continue;
    }

    result[key] = patchValue;
  }

  return result;
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

function getValueByAliases(
  source: Record<string, unknown>,
  aliases: string[]
): unknown {
  for (const alias of aliases) {
    if (alias in source) {
      return source[alias];
    }
  }

  return undefined;
}

function isRecognitionResult(value: unknown): value is RecognitionResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const source = value as Record<string, unknown>;

  return (
    typeof source.itemKey === "string" &&
    typeof source.itemZh === "string" &&
    typeof source.itemEn === "string" &&
    typeof source.category === "string" &&
    typeof source.confidence === "number"
  );
}

function clipText(value: string | undefined, maxLength: number): string {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return trimmed.slice(0, maxLength);
}

function compactLabels(
  value: string[] | undefined,
  itemMaxLength: number,
  maxItems: number
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => clipText(item, itemMaxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function isSupportedCountry(value: string): value is SupportedCountry {
  return COUNTRY_OPTIONS.some((option) => option.value === value);
}

function resolveRequestPayload(body: GenerateRequest): ResolvedGenerateRequest | null {
  if (!body?.country) {
    return null;
  }

  if (!isSupportedCountry(body.country)) {
    return null;
  }

  const rawContext = body.giftContext ?? {};
  const name = clipText(rawContext.name, 64);
  const description = clipText(rawContext.description, 240);
  const visionLabel = clipText(rawContext.visionLabel, 64);
  const visionDescription = clipText(rawContext.visionDescription, 240);
  const source = clipText(rawContext.source, 48);
  const rawLabels = compactLabels(rawContext.rawLabels, 64, 6);

  const baseRecognition = isRecognitionResult(body.recognition) ? body.recognition : null;
  const fallbackLabel = name || visionLabel || description;
  const resolvedRecognition =
    baseRecognition ??
    buildUnknownRecognition(
      fallbackLabel || (body.language === "en" ? "Unspecified gift" : "未命名礼物")
    );

  return {
    ...body,
    country: body.country,
    recognition: resolvedRecognition,
    giftContext: {
      name,
      description,
      visionLabel,
      visionDescription,
      source,
      rawLabels,
    },
  };
}

function getOutputLanguageConstraint(language: GenerateRequest["language"]): string {
  if (language === "en") {
    return "所有文案用英文，不要输出中文。";
  }

  return "所有文案用简体中文。";
}

async function requestDashScopeCompletion(
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: ChatMessage[],
  temperature: number
): Promise<CompletionResult> {
  return requestDashScopeAdapterCompletion({
    apiKey,
    baseUrl,
    model,
    messages,
    temperature,
    responseFormat: { type: 'json_object' },
    networkErrorPrefix: 'aliyun generation network error',
    providerErrorPrefix: 'aliyun generation request failed',
  });
}

function buildMessages(request: ResolvedGenerateRequest): ChatMessage[] {
  const languageConstraint = getOutputLanguageConstraint(request.language);
  const audience = {
    group: request.audience?.group?.trim() || "peer",
    customGroup: request.audience?.customGroup?.trim() || "",
    sceneTemplate: request.audience?.sceneTemplate?.trim() || "",
    ageBand: request.audience?.ageBand?.trim() || "",
    gender: request.audience?.gender?.trim() || "",
    occupation: request.audience?.occupation?.trim() || "",
    relationship: request.audience?.relationship?.trim() || "",
    occasion: request.audience?.occasion?.trim() || "",
    purpose: request.audience?.purpose?.trim() || "",
    budgetRange: request.audience?.budgetRange?.trim() || "",
    formality: request.audience?.formality?.trim() || "",
    notes: request.audience?.notes?.trim() || "",
  };
  const system = [
    "你是跨文化礼赠顾问。",
    "国家上下文必须严格使用输入中的 country，不允许自行改写国家。",
    "必须结合 audience（目标群体）完整字段调整风险判断与建议语气，包括群体、场景、关系、预算、正式度、备注。",
    "你必须输出严格 JSON，不要输出 Markdown。",
    "输出字段必须包含：score, riskLevel, isTaboo, warning, rescueItem, rescueReason, semanticSignals, packaging, card。",
    "score 为 phonetic/symbol/color 0-100 的整数。",
    "riskLevel 只能是 Low、Medium、High。",
    "packaging 必须有 style/colors/materials/avoid。",
    "card 必须有 tone/opener/body/closing。",
    languageConstraint,
    "如果 riskLevel 为 Low，rescueItem 和 rescueReason 应为空字符串。",
    "如果 riskLevel 为 High，应给出更稳妥的替代礼物和原因。",
    "warning 必须明确说明风险触发点或为何整体安全，不能空泛。",
    "不得省略任何字段，不得输出 null。",
  ].join("\n");

  const user = JSON.stringify(
    {
      task: "请输出跨文化礼赠风险分析与建议",
      country: request.country,
      recognition: request.recognition,
      giftContext: request.giftContext,
      audience,
      constraints: {
        tabooPolicy: "若存在文化禁忌，isTaboo 必须 true，并写清风险语义。",
        actionable: "建议必须可执行，避免空泛。",
      },
    },
    null,
    2
  );

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function buildRepairMessages(
  request: ResolvedGenerateRequest,
  previousOutput: string,
  missingFields: string[]
): ChatMessage[] {
  const languageConstraint = getOutputLanguageConstraint(request.language);
  const audience = {
    group: request.audience?.group?.trim() || "peer",
    customGroup: request.audience?.customGroup?.trim() || "",
    sceneTemplate: request.audience?.sceneTemplate?.trim() || "",
    ageBand: request.audience?.ageBand?.trim() || "",
    gender: request.audience?.gender?.trim() || "",
    occupation: request.audience?.occupation?.trim() || "",
    relationship: request.audience?.relationship?.trim() || "",
    occasion: request.audience?.occasion?.trim() || "",
    purpose: request.audience?.purpose?.trim() || "",
    budgetRange: request.audience?.budgetRange?.trim() || "",
    formality: request.audience?.formality?.trim() || "",
    notes: request.audience?.notes?.trim() || "",
  };
  const system = [
    "你是 JSON 结构修复器。",
    "任务是把上一轮模型输出修复成完整 JSON。",
    "必须严格使用输入中的 country，不允许改写国家。",
    "修复时必须保持 audience（目标群体）上下文语义。",
    "输出必须是严格 JSON，不要输出解释。",
    "必须包含完整字段：score, riskLevel, isTaboo, warning, rescueItem, rescueReason, semanticSignals, packaging, card。",
    "score 里必须有 phonetic/symbol/color；packaging 必须有 style/colors/materials/avoid；card 必须有 tone/opener/body/closing。",
    "riskLevel 只能是 Low/Medium/High。",
    languageConstraint,
  ].join("\n");

  const user = JSON.stringify(
    {
      task: "修复为字段完整的 JSON",
      country: request.country,
      recognition: request.recognition,
      giftContext: request.giftContext,
      audience,
      missingFields,
      previousOutput,
    },
    null,
    2
  );

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function buildMissingFieldPatchMessages(
  request: ResolvedGenerateRequest,
  previousOutput: Record<string, unknown>,
  missingFields: string[]
): ChatMessage[] {
  const languageConstraint = getOutputLanguageConstraint(request.language);
  const audience = {
    group: request.audience?.group?.trim() || "peer",
    customGroup: request.audience?.customGroup?.trim() || "",
    sceneTemplate: request.audience?.sceneTemplate?.trim() || "",
    ageBand: request.audience?.ageBand?.trim() || "",
    gender: request.audience?.gender?.trim() || "",
    occupation: request.audience?.occupation?.trim() || "",
    relationship: request.audience?.relationship?.trim() || "",
    occasion: request.audience?.occasion?.trim() || "",
    purpose: request.audience?.purpose?.trim() || "",
    budgetRange: request.audience?.budgetRange?.trim() || "",
    formality: request.audience?.formality?.trim() || "",
    notes: request.audience?.notes?.trim() || "",
  };
  const system = [
    "你是 JSON 补全器。",
    "你的任务是只补齐缺失字段，不要改写已有字段语义。",
    "必须严格使用输入中的 country，不允许改写国家。",
    "补全时必须保持 audience（目标群体）上下文语义。",
    "输出必须是严格 JSON，不要输出解释。",
    "如果缺失 score.*，就补 score.phonetic/score.symbol/score.color（0-100 整数）。",
    "如果缺失 packaging.*，就补 packaging.style/colors/materials/avoid（非空字符串）。",
    languageConstraint,
  ].join("\n");

  const user = JSON.stringify(
    {
      task: "只补齐缺失字段",
      country: request.country,
      recognition: request.recognition,
      giftContext: request.giftContext,
      audience,
      missingFields,
      previousOutput,
      outputRequirement: "返回 JSON patch 对象，可包含 score/packaging/card 等需要补齐的字段",
    },
    null,
    2
  );

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function buildStrictTemplateMessages(
  request: ResolvedGenerateRequest,
  previousOutput: Record<string, unknown>,
  missingFields: string[]
): ChatMessage[] {
  const languageConstraint = getOutputLanguageConstraint(request.language);
  const audience = {
    group: request.audience?.group?.trim() || "peer",
    customGroup: request.audience?.customGroup?.trim() || "",
    sceneTemplate: request.audience?.sceneTemplate?.trim() || "",
    ageBand: request.audience?.ageBand?.trim() || "",
    gender: request.audience?.gender?.trim() || "",
    occupation: request.audience?.occupation?.trim() || "",
    relationship: request.audience?.relationship?.trim() || "",
    occasion: request.audience?.occasion?.trim() || "",
    purpose: request.audience?.purpose?.trim() || "",
    budgetRange: request.audience?.budgetRange?.trim() || "",
    formality: request.audience?.formality?.trim() || "",
    notes: request.audience?.notes?.trim() || "",
  };
  const system = [
    "你是严格 JSON 生成器。",
    "必须输出完整 JSON，字段一个都不能少。",
    "必须严格使用输入中的 country，不允许改写国家。",
    "必须结合 audience（目标群体）上下文给出风格和风险建议。",
    "不允许输出 null，不允许输出解释，不允许输出 Markdown。",
    "score.phonetic/symbol/color 必须是 0-100 整数。",
    "packaging.style/colors/materials/avoid 必须是非空字符串。",
    "card.tone/opener/body/closing 必须是非空字符串。",
    "semanticSignals 必须是非空字符串数组。",
    "riskLevel 只能是 Low/Medium/High。",
    languageConstraint,
  ].join("\n");

  const template = {
    score: { phonetic: 60, symbol: 60, color: 60 },
    riskLevel: "Medium",
    isTaboo: false,
    warning: "",
    rescueItem: "",
    rescueReason: "",
    semanticSignals: [""],
    packaging: {
      style: "",
      colors: "",
      materials: "",
      avoid: "",
    },
    card: {
      tone: "",
      opener: "",
      body: "",
      closing: "",
    },
  };

  const user = JSON.stringify(
    {
      task: "按模板返回完整 JSON",
      country: request.country,
      recognition: request.recognition,
      giftContext: request.giftContext,
      audience,
      missingFields,
      previousOutput,
      template,
      note: "请在保持现有语义的前提下补齐并规范化所有字段。",
    },
    null,
    2
  );

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function buildStrictModelAnalysis(
  modelOutput: Record<string, unknown>,
  country: SupportedCountry,
  recognition: RecognitionResult
): StrictParseResult {
  const normalizedOutput = pickLikelyRootOutput(modelOutput);
  const missingFields: string[] = [];
  const scoreInput = toRecord(
    getValueByAliases(normalizedOutput, [
      "score",
      "scores",
      "giftScore",
      "scoreBreakdown",
      "评分",
    ])
  );

  const phonetic = toNumberInRange(
    getValueByAliases(scoreInput, [
      "phonetic",
      "homophone",
      "pronunciation",
      "phoneticScore",
      "sound",
      "soundScore",
      "谐音",
      "语音",
      "发音",
    ]) ??
      getValueByAliases(normalizedOutput, [
        "phonetic",
        "phoneticScore",
        "scorePhonetic",
      ])
  );
  const symbol = toNumberInRange(
    getValueByAliases(scoreInput, [
      "symbol",
      "symbolic",
      "meaning",
      "symbolScore",
      "semantic",
      "象征",
      "寓意",
      "含义",
    ]) ??
      getValueByAliases(normalizedOutput, ["symbol", "symbolScore", "scoreSymbol"])
  );
  const color = toNumberInRange(
    getValueByAliases(scoreInput, [
      "color",
      "colour",
      "colorScore",
      "色彩",
      "颜色",
    ]) ??
      getValueByAliases(normalizedOutput, ["color", "colorScore", "scoreColor"])
  );

  if (phonetic === null) {
    missingFields.push("score.phonetic");
  }

  if (symbol === null) {
    missingFields.push("score.symbol");
  }

  if (color === null) {
    missingFields.push("score.color");
  }

  const riskLevel = normalizeRiskLevel(
    getValueByAliases(normalizedOutput, [
      "riskLevel",
      "risk_level",
      "risk",
      "风险等级",
    ])
  );

  if (!riskLevel) {
    missingFields.push("riskLevel");
  }

  const score: GiftScore = {
    phonetic: phonetic ?? 0,
    symbol: symbol ?? 0,
    color: color ?? 0,
  };

  const packagingInput = toRecord(
    getValueByAliases(normalizedOutput, [
      "packaging",
      "package",
      "packagingPlan",
      "包装",
      "包装建议",
    ])
  );
  const cardInput = toRecord(
    getValueByAliases(normalizedOutput, [
      "card",
      "greetingCard",
      "cardPlan",
      "贺卡",
      "贺卡文案",
    ])
  );

  const isTaboo = toBooleanValue(
    getValueByAliases(normalizedOutput, ["isTaboo", "is_taboo", "taboo", "禁忌"])
  );
  const warning = toStringValue(
    getValueByAliases(normalizedOutput, ["warning", "riskReason", "reason", "风险说明", "禁忌说明"])
  );
  const rescueItem = toStringValue(
    getValueByAliases(normalizedOutput, [
      "rescueItem",
      "rescue_item",
      "alternativeGift",
      "替代礼物",
    ])
  );
  const rescueReason = toStringValue(
    getValueByAliases(normalizedOutput, [
      "rescueReason",
      "rescue_reason",
      "alternativeReason",
      "替代原因",
    ])
  );
  const packagingStyle = toStringValue(
    getValueByAliases(packagingInput, ["style", "theme", "风格"])
  );
  const packagingColors = toStringValue(
    getValueByAliases(packagingInput, ["colors", "colour", "color", "palette", "配色", "颜色"])
  );
  const packagingMaterials = toStringValue(
    getValueByAliases(packagingInput, ["materials", "material", "材质", "材料"])
  );
  const packagingAvoid = toStringValue(
    getValueByAliases(packagingInput, ["avoid", "avoidItems", "avoid_elements", "避免", "禁忌"])
  );
  const cardTone = toStringValue(getValueByAliases(cardInput, ["tone", "语气"]));
  const cardOpener = toStringValue(getValueByAliases(cardInput, ["opener", "opening", "开头"]));
  const cardBody = toStringValue(getValueByAliases(cardInput, ["body", "content", "正文"]));
  const cardClosing = toStringValue(getValueByAliases(cardInput, ["closing", "signoff", "结尾"]));
  const semanticSignals = toStringArray(
    getValueByAliases(normalizedOutput, [
      "semanticSignals",
      "semantic_signals",
      "xray_tags",
      "tags",
      "keywords",
      "语义信号",
      "标签",
    ])
  );

  if (isTaboo === null) {
    missingFields.push("isTaboo");
  }

  if (warning === null) {
    missingFields.push("warning");
  }

  if (rescueItem === null) {
    missingFields.push("rescueItem");
  }

  if (rescueReason === null) {
    missingFields.push("rescueReason");
  }

  if (packagingStyle === null) {
    missingFields.push("packaging.style");
  }

  if (packagingColors === null) {
    missingFields.push("packaging.colors");
  }

  if (packagingMaterials === null) {
    missingFields.push("packaging.materials");
  }

  if (packagingAvoid === null) {
    missingFields.push("packaging.avoid");
  }

  if (cardTone === null) {
    missingFields.push("card.tone");
  }

  if (cardOpener === null) {
    missingFields.push("card.opener");
  }

  if (cardBody === null) {
    missingFields.push("card.body");
  }

  if (cardClosing === null) {
    missingFields.push("card.closing");
  }

  if (semanticSignals.length === 0) {
    missingFields.push("semanticSignals");
  }

  if (
    !riskLevel ||
    isTaboo === null ||
    warning === null ||
    rescueItem === null ||
    rescueReason === null ||
    packagingStyle === null ||
    packagingColors === null ||
    packagingMaterials === null ||
    packagingAvoid === null ||
    cardTone === null ||
    cardOpener === null ||
    cardBody === null ||
    cardClosing === null ||
    semanticSignals.length === 0 ||
    phonetic === null ||
    symbol === null ||
    color === null
  ) {
    return {
      analysis: null,
      missingFields,
    };
  }

  return {
    analysis: {
      country,
      recognition,
      score,
      fitScore: calculateCulturalFitScore(score),
      riskLevel,
      isTaboo,
      warning,
      rescueItem,
      rescueReason,
      semanticSignals,
      packaging: {
        style: packagingStyle,
        colors: packagingColors,
        materials: packagingMaterials,
        avoid: packagingAvoid,
      },
      card: {
        tone: cardTone,
        opener: cardOpener,
        body: cardBody,
        closing: cardClosing,
      },
    },
    missingFields: [],
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body?.country) {
      return NextResponse.json({ error: "invalid request body" }, { status: 400 });
    }

    if (!isRecognitionResult(body.recognition)) {
      return NextResponse.json(
        { error: "ai recognition is required before analysis" },
        { status: 400 }
      );
    }

    const resolvedBody = resolveRequestPayload(body);

    if (!resolvedBody) {
      return NextResponse.json({ error: "invalid request body" }, { status: 400 });
    }

    const hasGiftSignal =
      Boolean(resolvedBody.recognition?.itemKey) ||
      Boolean(resolvedBody.giftContext.name) ||
      Boolean(resolvedBody.giftContext.description) ||
      Boolean(resolvedBody.giftContext.visionDescription);

    if (!hasGiftSignal) {
      return NextResponse.json({ error: "gift info is required" }, { status: 400 });
    }

    const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY;
    const model = process.env.ALIYUN_DASHSCOPE_TEXT_MODEL ?? "qwen-plus-latest";
    const baseUrl =
      process.env.ALIYUN_DASHSCOPE_BASE_URL ??
      "https://dashscope.aliyuncs.com/compatible-mode/v1";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "missing aliyun key: cultural copy must come from LLM output, local fallback disabled",
        },
        { status: 503 }
      );
    }

    const initialCompletion = await requestDashScopeCompletion(
      apiKey,
      baseUrl,
      model,
      buildMessages(resolvedBody),
      0.4
    );

    if (!initialCompletion.ok) {
      return NextResponse.json({ error: initialCompletion.error }, { status: 502 });
    }

    const parsed = extractJsonFromText(initialCompletion.content);
    const initialParsedResult: StrictParseResult = parsed
      ? buildStrictModelAnalysis(parsed, resolvedBody.country, resolvedBody.recognition)
      : {
          analysis: null,
          missingFields: ["valid_json"],
        };

    let finalAnalysis = initialParsedResult.analysis;
    let finalMissingFields = initialParsedResult.missingFields;
    let latestStructuredOutput = parsed;

    if (!finalAnalysis) {
      const repairCompletion = await requestDashScopeCompletion(
        apiKey,
        baseUrl,
        model,
        buildRepairMessages(resolvedBody, initialCompletion.content, finalMissingFields),
        0.2
      );

      if (!repairCompletion.ok) {
        return NextResponse.json({ error: repairCompletion.error }, { status: 502 });
      }

      const repairedParsed = extractJsonFromText(repairCompletion.content);
      const repairedResult: StrictParseResult = repairedParsed
        ? buildStrictModelAnalysis(repairedParsed, resolvedBody.country, resolvedBody.recognition)
        : {
            analysis: null,
            missingFields: ["valid_json"],
          };

      finalAnalysis = repairedResult.analysis;
      finalMissingFields = repairedResult.missingFields;
      latestStructuredOutput = repairedParsed ?? latestStructuredOutput;
    }

    if (!finalAnalysis && latestStructuredOutput) {
      const patchCompletion = await requestDashScopeCompletion(
        apiKey,
        baseUrl,
        model,
        buildMissingFieldPatchMessages(
          resolvedBody,
          latestStructuredOutput,
          finalMissingFields
        ),
        0.2
      );

      if (patchCompletion.ok) {
        const patchParsed = extractJsonFromText(patchCompletion.content);

        if (patchParsed) {
          const mergedOutput = mergeRecords(latestStructuredOutput, patchParsed);
          const mergedResult = buildStrictModelAnalysis(
            mergedOutput,
            resolvedBody.country,
            resolvedBody.recognition
          );

          finalAnalysis = mergedResult.analysis;
          finalMissingFields = mergedResult.missingFields;
        }
      }
    }

    if (!finalAnalysis) {
      const strictTemplateCompletion = await requestDashScopeCompletion(
        apiKey,
        baseUrl,
        model,
        buildStrictTemplateMessages(
          resolvedBody,
          latestStructuredOutput ?? {},
          finalMissingFields
        ),
        0.1
      );

      if (strictTemplateCompletion.ok) {
        const strictTemplateParsed = extractJsonFromText(strictTemplateCompletion.content);

        if (strictTemplateParsed) {
          const strictTemplateResult = buildStrictModelAnalysis(
            strictTemplateParsed,
            resolvedBody.country,
            resolvedBody.recognition
          );

          finalAnalysis = strictTemplateResult.analysis;
          finalMissingFields = strictTemplateResult.missingFields;
        }
      }
    }

    if (!finalAnalysis) {
      return NextResponse.json(
        {
          error: `model output missing required fields: ${finalMissingFields.join(", ")}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      analysis: finalAnalysis,
      source: "aliyun-dashscope",
    } satisfies GenerateResponse);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? `failed to generate analysis: ${error.message}`
        : "failed to generate analysis";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
