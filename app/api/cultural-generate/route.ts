import { NextResponse } from "next/server";
import {
  buildUnknownRecognition,
  COUNTRY_OPTIONS,
  type CulturalAnalysis,
  type RecognitionResult,
  type SupportedCountry,
} from "@/lib/analysis/cultural-analyzer";
import { requestDashScopeCompletion as requestDashScopeAdapterCompletion } from "@/lib/ai/adapters/dashscope";
import type { ModelMessage, NormalizedModelCompletionResult } from "@/lib/ai/adapters/types";
import { buildCulturalAnalysisMessages } from "@/lib/ai/prompts/analysis";
import {
  buildCulturalMissingFieldPatchMessages,
  buildCulturalRepairMessages,
  buildCulturalStrictTemplateMessages,
} from "@/lib/ai/prompts/repair";
import {
  mergeModelOutputRecords,
  parseStrictCulturalAnalysis,
  type StrictParseResult,
} from "@/lib/ai/transformers/cultural-analysis";
import {
  sanitizeStringArray,
  sanitizeTextValue,
} from "@/lib/ai/guards/input-sanitizer";
import { validateAnalysisOutput } from "@/lib/ai/guards/output-validator";
import {
  detectPromptInjectionInFields,
  prependPromptInjectionGuard,
} from "@/lib/ai/guards/prompt-injection";
import { extractSafeJsonObject } from "@/lib/ai/guards/safe-json";
import type { PromptAudienceContext } from "@/lib/ai/prompts/shared";

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

type CompletionResult = NormalizedModelCompletionResult;

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

function isSupportedCountry(value: string): value is SupportedCountry {
  return COUNTRY_OPTIONS.some((option) => option.value === value);
}

function resolveRequestPayload(body: GenerateRequest): ResolvedGenerateRequest | null {
  const country = sanitizeTextValue(body?.country, { maxLength: 64 });

  if (!country) {
    return null;
  }

  if (!isSupportedCountry(country)) {
    return null;
  }

  const rawContext = body.giftContext ?? {};
  const name = sanitizeTextValue(rawContext.name, { maxLength: 64 });
  const description = sanitizeTextValue(rawContext.description, { maxLength: 240 });
  const visionLabel = sanitizeTextValue(rawContext.visionLabel, { maxLength: 64 });
  const visionDescription = sanitizeTextValue(rawContext.visionDescription, {
    maxLength: 240,
  });
  const source = sanitizeTextValue(rawContext.source, { maxLength: 48 });
  const rawLabels = sanitizeStringArray(rawContext.rawLabels, {
    itemMaxLength: 64,
    maxItems: 6,
  });

  const baseRecognition = isRecognitionResult(body.recognition) ? body.recognition : null;
  const fallbackLabel = name || visionLabel || description;
  const resolvedRecognition =
    baseRecognition ??
    buildUnknownRecognition(
      fallbackLabel || (body.language === "en" ? "Unspecified gift" : "未命名礼物")
    );

  return {
    ...body,
    country,
    recognition: {
      ...resolvedRecognition,
      itemKey: sanitizeTextValue(resolvedRecognition.itemKey, {
        maxLength: 64,
        fallback: "unknown",
      }),
      itemZh: sanitizeTextValue(resolvedRecognition.itemZh, {
        maxLength: 80,
        fallback: fallbackLabel || "未命名礼物",
      }),
      itemEn: sanitizeTextValue(resolvedRecognition.itemEn, {
        maxLength: 80,
        fallback: fallbackLabel || "Unnamed gift",
      }),
      category: sanitizeTextValue(resolvedRecognition.category, {
        maxLength: 48,
        fallback: "general",
      }),
      confidence:
        typeof resolvedRecognition.confidence === "number"
          ? Math.min(Math.max(resolvedRecognition.confidence, 0), 1)
          : 0.5,
    },
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

function buildPromptAudience(audience: GenerateRequest["audience"]): PromptAudienceContext {
  return {
    group: sanitizeTextValue(audience?.group, { maxLength: 40, fallback: "peer" }),
    customGroup: sanitizeTextValue(audience?.customGroup, { maxLength: 60 }),
    sceneTemplate: sanitizeTextValue(audience?.sceneTemplate, { maxLength: 60 }),
    ageBand: sanitizeTextValue(audience?.ageBand, { maxLength: 40 }),
    gender: sanitizeTextValue(audience?.gender, { maxLength: 40 }),
    occupation: sanitizeTextValue(audience?.occupation, { maxLength: 60 }),
    relationship: sanitizeTextValue(audience?.relationship, { maxLength: 60 }),
    occasion: sanitizeTextValue(audience?.occasion, { maxLength: 60 }),
    purpose: sanitizeTextValue(audience?.purpose, { maxLength: 80 }),
    budgetRange: sanitizeTextValue(audience?.budgetRange, { maxLength: 40 }),
    formality: sanitizeTextValue(audience?.formality, { maxLength: 40 }),
    notes: sanitizeTextValue(audience?.notes, { maxLength: 240 }),
  };
}

function buildPromptInjectionAssessment(
  request: ResolvedGenerateRequest
) {
  return detectPromptInjectionInFields([
    request.country,
    request.recognition.itemKey,
    request.recognition.itemZh,
    request.recognition.itemEn,
    request.recognition.category,
    request.giftContext.name,
    request.giftContext.description,
    request.giftContext.visionLabel,
    request.giftContext.visionDescription,
    request.giftContext.source,
    request.giftContext.rawLabels,
    ...Object.values(buildPromptAudience(request.audience)),
  ]);
}

function buildMessages(request: ResolvedGenerateRequest): ChatMessage[] {
  return prependPromptInjectionGuard(buildCulturalAnalysisMessages({
    language: request.language,
    country: request.country,
    recognition: request.recognition,
    giftContext: request.giftContext,
    audience: buildPromptAudience(request.audience),
  }), buildPromptInjectionAssessment(request));
}

function buildRepairMessages(
  request: ResolvedGenerateRequest,
  previousOutput: string,
  missingFields: string[]
): ChatMessage[] {
  return prependPromptInjectionGuard(buildCulturalRepairMessages({
    language: request.language,
    country: request.country,
    recognition: request.recognition,
    giftContext: request.giftContext,
    audience: buildPromptAudience(request.audience),
    missingFields,
    previousOutput,
  }), buildPromptInjectionAssessment(request));
}

function buildMissingFieldPatchMessages(
  request: ResolvedGenerateRequest,
  previousOutput: Record<string, unknown>,
  missingFields: string[]
): ChatMessage[] {
  return prependPromptInjectionGuard(buildCulturalMissingFieldPatchMessages({
    language: request.language,
    country: request.country,
    recognition: request.recognition,
    giftContext: request.giftContext,
    audience: buildPromptAudience(request.audience),
    missingFields,
    previousOutput,
  }), buildPromptInjectionAssessment(request));
}

function buildStrictTemplateMessages(
  request: ResolvedGenerateRequest,
  previousOutput: Record<string, unknown>,
  missingFields: string[]
): ChatMessage[] {
  return prependPromptInjectionGuard(buildCulturalStrictTemplateMessages({
    language: request.language,
    country: request.country,
    recognition: request.recognition,
    giftContext: request.giftContext,
    audience: buildPromptAudience(request.audience),
    missingFields,
    previousOutput,
  }), buildPromptInjectionAssessment(request));
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

    const initialParsed = extractSafeJsonObject(initialCompletion.content);
    const initialParsedResult: StrictParseResult = initialParsed.ok
      ? parseStrictCulturalAnalysis(
          initialParsed.value,
          resolvedBody.country,
          resolvedBody.recognition
        )
      : {
          analysis: null,
          missingFields: [initialParsed.error],
        };

    let finalAnalysis = initialParsedResult.analysis;
    let finalMissingFields = initialParsedResult.missingFields;
    let latestStructuredOutput = initialParsed.ok ? initialParsed.value : null;

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

      const repairedParsed = extractSafeJsonObject(repairCompletion.content);
      const repairedResult: StrictParseResult = repairedParsed.ok
        ? parseStrictCulturalAnalysis(
            repairedParsed.value,
            resolvedBody.country,
            resolvedBody.recognition
          )
        : {
            analysis: null,
            missingFields: [repairedParsed.error],
          };

      finalAnalysis = repairedResult.analysis;
      finalMissingFields = repairedResult.missingFields;
      latestStructuredOutput = repairedParsed.ok ? repairedParsed.value : latestStructuredOutput;
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
        const patchParsed = extractSafeJsonObject(patchCompletion.content);

        if (patchParsed.ok) {
          const mergedOutput = mergeModelOutputRecords(latestStructuredOutput, patchParsed.value);
          const mergedResult = parseStrictCulturalAnalysis(
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
        const strictTemplateParsed = extractSafeJsonObject(
          strictTemplateCompletion.content
        );

        if (strictTemplateParsed.ok) {
          const strictTemplateResult = parseStrictCulturalAnalysis(
            strictTemplateParsed.value,
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

    const validatedAnalysis = validateAnalysisOutput(finalAnalysis);

    if (!validatedAnalysis.ok) {
      return NextResponse.json(
        {
          error: `model output failed validation: ${validatedAnalysis.errors.join(", ")}`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      analysis: validatedAnalysis.value,
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
