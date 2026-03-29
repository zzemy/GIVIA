import type { AnalysisEngineResult, AudienceProfileInput, P0Locale } from '@/lib/types/gifting-types'
import type { GiftProfile } from '@/lib/analysis/gift-profile'
import { sanitizeStringArray, sanitizeTextValue } from '@/lib/ai/guards/input-sanitizer'
import { validateRiskEnhancementOutput } from '@/lib/ai/guards/output-validator'
import {
  buildPromptInjectionGuardText,
  detectPromptInjectionInFields,
} from '@/lib/ai/guards/prompt-injection'
import { extractSafeJsonObject } from '@/lib/ai/guards/safe-json'
import { buildRiskEnhancementPrompt } from '@/lib/ai/prompts/analysis'
import { requestDashScopeCompletion } from '@/lib/ai/adapters/dashscope'

/**
 * LLM-enhanced risk assessment: Add semantic explanations and personalized mitigation suggestions
 * This supplements the rule-based engine with LLM-generated contextual insights
 */

export interface LLMEnhancementInput {
  locale: P0Locale
  countryCode: string
  countryName: string
  giftName: string
  giftProfile: GiftProfile
  audience: AudienceProfileInput
  ruleResult: AnalysisEngineResult // Output from rule-based engine
}

export interface LLMEnhancedRiskResult {
  semanticExplanation: string // LLM-generated explanation of why it's risky
  personalizedMitigation: string // Personalized suggestion for this specific context
  alternativeFraming: string // How to reframe the gift narrative
  culturalContext: string // Cultural background of the risk
  confidence: number // 0-1 confidence in the LLM output
}

/**
 * Enhance rule-based risk assessment with LLM semantic understanding
 * Falls back to rule-based explanations if LLM is unavailable
 */
export async function enhanceRiskWithLLM(
  input: LLMEnhancementInput,
): Promise<LLMEnhancedRiskResult | null> {
  try {
    // Build context prompt for LLM
    const prompt = buildEnhancementPrompt(input)

    // Call LLM service (e.g., Claude/GPT via Anthropic/OpenAI)
    const llmResponse = await callLLMForRiskEnhancement(prompt, input.locale)

    if (!llmResponse) {
      return null
    }

    return parseEnhancementResponse(llmResponse, input.locale)
  } catch (error) {
    // LLM enhancement is optional; gracefully degrade
    console.warn('[LLM Enhancement] Failed to enhance risk assessment:', error)
    return null
  }
}

function buildEnhancementPrompt(input: LLMEnhancementInput): string {
  const sanitizedInput = sanitizeEnhancementInput(input)
  const injectionAssessment = detectPromptInjectionInFields([
    sanitizedInput.countryCode,
    sanitizedInput.countryName,
    sanitizedInput.giftName,
    sanitizedInput.giftProfile.category,
    sanitizedInput.giftProfile.materials,
    sanitizedInput.giftProfile.styles,
    sanitizedInput.giftProfile.colors,
    sanitizedInput.giftProfile.brandTokens,
    sanitizedInput.giftProfile.semanticTags,
    sanitizedInput.audience.group,
    sanitizedInput.audience.customGroup,
    sanitizedInput.audience.sceneTemplate,
    sanitizedInput.audience.ageBand,
    sanitizedInput.audience.gender,
    sanitizedInput.audience.occupation,
    sanitizedInput.audience.relationship,
    sanitizedInput.audience.occasion,
    sanitizedInput.audience.purpose,
    sanitizedInput.audience.budgetRange,
    sanitizedInput.audience.formality,
    sanitizedInput.audience.notes,
  ])

  return `${buildPromptInjectionGuardText(injectionAssessment)}\n\n${buildRiskEnhancementPrompt(
    sanitizedInput,
  )}`
}

function sanitizeEnhancementInput(input: LLMEnhancementInput): LLMEnhancementInput {
  return {
    ...input,
    countryCode: sanitizeTextValue(input.countryCode, { maxLength: 16 }),
    countryName: sanitizeTextValue(input.countryName, { maxLength: 64, fallback: 'Unknown' }),
    giftName: sanitizeTextValue(input.giftName, { maxLength: 80, fallback: 'Gift' }),
    giftProfile: {
      ...input.giftProfile,
      displayName: sanitizeTextValue(input.giftProfile.displayName, {
        maxLength: 80,
        fallback: 'Gift',
      }),
      category: sanitizeTextValue(input.giftProfile.category, {
        maxLength: 48,
        fallback: 'general',
      }),
      materials: sanitizeStringArray(input.giftProfile.materials, {
        itemMaxLength: 40,
        maxItems: 6,
      }),
      styles: sanitizeStringArray(input.giftProfile.styles, {
        itemMaxLength: 40,
        maxItems: 6,
      }),
      colors: sanitizeStringArray(input.giftProfile.colors, {
        itemMaxLength: 40,
        maxItems: 6,
      }),
      brandTokens: sanitizeStringArray(input.giftProfile.brandTokens, {
        itemMaxLength: 40,
        maxItems: 6,
      }),
      semanticTags: sanitizeStringArray(input.giftProfile.semanticTags, {
        itemMaxLength: 40,
        maxItems: 8,
      }),
    },
    audience: {
      ...input.audience,
      group: sanitizeTextValue(input.audience.group, { maxLength: 40, fallback: 'peer' }),
      customGroup: sanitizeTextValue(input.audience.customGroup, { maxLength: 60 }),
      sceneTemplate: sanitizeTextValue(input.audience.sceneTemplate, { maxLength: 60 }),
      ageBand: sanitizeTextValue(input.audience.ageBand, { maxLength: 40 }),
      gender: sanitizeTextValue(input.audience.gender, { maxLength: 40 }),
      occupation: sanitizeTextValue(input.audience.occupation, { maxLength: 60 }),
      relationship: sanitizeTextValue(input.audience.relationship, { maxLength: 60 }),
      occasion: sanitizeTextValue(input.audience.occasion, { maxLength: 60 }),
      purpose: sanitizeTextValue(input.audience.purpose, { maxLength: 80 }),
      budgetRange: sanitizeTextValue(input.audience.budgetRange, { maxLength: 40 }),
      formality: sanitizeTextValue(input.audience.formality, { maxLength: 40 }),
      notes: sanitizeTextValue(input.audience.notes, { maxLength: 240 }),
    },
  }
}

async function callLLMForRiskEnhancement(prompt: string, locale: P0Locale): Promise<string | null> {
  try {
    void locale

    const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY
    if (!apiKey) {
      console.warn('[LLM] ALIYUN_DASHSCOPE_API_KEY is missing')
      return null
    }

    const completion = await requestDashScopeCompletion({
      apiKey,
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: 'qwen-max',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      networkErrorPrefix: '[network error]',
      providerErrorPrefix: '[provider error]',
      temperature: 0.7,
      responseFormat: { type: 'json_object' }
    })

    if (!completion.ok) {
      console.warn('[LLM]', completion.error)
      return null
    }

    return completion.content
  } catch (error) {
    console.warn('[LLM] Request failed:', error)
    return null
  }
}

function parseEnhancementResponse(response: string, locale: P0Locale): LLMEnhancedRiskResult | null {
  try {
    void locale

    const parsedJson = extractSafeJsonObject(response)

    if (!parsedJson.ok) {
      return null
    }

    const validated = validateRiskEnhancementOutput(parsedJson.value)

    if (!validated.ok) {
      return null
    }

    return {
      semanticExplanation: validated.value.semanticExplanation.trim(),
      personalizedMitigation: validated.value.personalizedMitigation.trim(),
      alternativeFraming: validated.value.alternativeFraming.trim(),
      culturalContext: validated.value.culturalContext.trim(),
      confidence: Math.max(0, Math.min(1, validated.value.confidence ?? 0.75)),
    }
  } catch (error) {
    console.warn('[LLM] Parse error:', error)
    return null
  }
}

/**
 * Merge LLM enhancement with rule-based result
 */
export function mergeLLMEnhancement(
  ruleResult: AnalysisEngineResult,
  llmEnhancement: LLMEnhancedRiskResult | null,
  locale: P0Locale,
): AnalysisEngineResult {
  void locale

  if (!llmEnhancement) {
    return ruleResult // Keep original if LLM confidence is low
  }

  // Enhance the rule result with LLM insights
  return {
    ...ruleResult,
    warning:
      (llmEnhancement.culturalContext && llmEnhancement.semanticExplanation)
        ? `${llmEnhancement.culturalContext}\n\n${llmEnhancement.semanticExplanation}`
        : (llmEnhancement.semanticExplanation || ruleResult.warning),
    rescueItem:
      llmEnhancement.personalizedMitigation ||
      ruleResult.rescueItem,
    rescueReason:
      llmEnhancement.alternativeFraming ||
      ruleResult.rescueReason,
    semanticSignals: [...(ruleResult.semanticSignals || [])].filter(Boolean) as string[],
  }
}
