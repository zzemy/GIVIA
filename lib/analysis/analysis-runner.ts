import { buildGiftProfile } from '@/lib/analysis/gift-profile'
import { buildRecommendations } from '@/lib/analysis/recommend-engine'
import { buildAnalysisFromRules } from '@/lib/analysis/risk-engine'
import { sanitizeStringArray, sanitizeTextValue } from '@/lib/ai/guards/input-sanitizer'
import { enhanceRiskWithLLM, mergeLLMEnhancement } from '@/lib/analysis/llm-risk-enhancement'
import type { AnalysisEngineResult, AudienceProfileInput, GiftContextInput, P0Locale } from '@/lib/types/gifting-types'

type MinimalRecognition = {
  itemKey?: string
  itemZh?: string
  itemEn?: string
  category?: string
}

export interface AnalysisRunnerInput {
  locale: P0Locale
  country?: string
  countryCode?: string
  recognition?: MinimalRecognition | null
  giftContext?: GiftContextInput | null
  audience: AudienceProfileInput
}

export interface AnalysisRunnerOutput extends AnalysisEngineResult {
  giftProfile: {
    displayName: string
    category: string
    materials: string[]
    styles: string[]
    colors: string[]
    numbers: number[]
    brandTokens: string[]
    semanticTags: string[]
  }
}

function sanitizeAnalysisRunnerInput(input: AnalysisRunnerInput): AnalysisRunnerInput {
  return {
    ...input,
    country: sanitizeTextValue(input.country, { maxLength: 64 }),
    countryCode: sanitizeTextValue(input.countryCode, { maxLength: 16 }),
    recognition: input.recognition
      ? {
          itemKey: sanitizeTextValue(input.recognition.itemKey, {
            maxLength: 64,
            fallback: 'unknown',
          }),
          itemZh: sanitizeTextValue(input.recognition.itemZh, { maxLength: 80 }),
          itemEn: sanitizeTextValue(input.recognition.itemEn, { maxLength: 80 }),
          category: sanitizeTextValue(input.recognition.category, {
            maxLength: 48,
            fallback: 'general',
          }),
        }
      : input.recognition,
    giftContext: input.giftContext
      ? {
          name: sanitizeTextValue(input.giftContext.name, { maxLength: 80 }),
          description: sanitizeTextValue(input.giftContext.description, { maxLength: 240 }),
          visionLabel: sanitizeTextValue(input.giftContext.visionLabel, { maxLength: 80 }),
          visionDescription: sanitizeTextValue(input.giftContext.visionDescription, {
            maxLength: 240,
          }),
          source: sanitizeTextValue(input.giftContext.source, { maxLength: 48 }),
          rawLabels: sanitizeStringArray(input.giftContext.rawLabels, {
            itemMaxLength: 64,
            maxItems: 6,
          }),
        }
      : input.giftContext,
    audience: {
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

export function runAnalysis(input: AnalysisRunnerInput): AnalysisRunnerOutput {
  const sanitizedInput = sanitizeAnalysisRunnerInput(input)
  const giftProfile = buildGiftProfile({
    recognition: sanitizedInput.recognition,
    giftContext: sanitizedInput.giftContext,
  })

  const recommendations = buildRecommendations({
    locale: sanitizedInput.locale,
    countryCode: sanitizedInput.countryCode ?? '',
    audience: sanitizedInput.audience,
    giftProfile,
    blockedTerms: [giftProfile.category, ...giftProfile.semanticTags],
  })

  const analysis = buildAnalysisFromRules({
    locale: sanitizedInput.locale,
    countryCode: sanitizedInput.countryCode,
    countryName: sanitizedInput.country,
    profile: giftProfile,
    audience: sanitizedInput.audience,
    recommendations,
  })

  return {
    ...analysis,
    giftProfile: {
      displayName: giftProfile.displayName,
      category: giftProfile.category,
      materials: giftProfile.materials,
      styles: giftProfile.styles,
      colors: giftProfile.colors,
      numbers: giftProfile.numbers,
      brandTokens: giftProfile.brandTokens,
      semanticTags: giftProfile.semanticTags,
    },
  }
}

/**
 * Run analysis with async LLM enhancement
 * Note: This is for server-side calls where we can await LLM responses
 */
export async function runAnalysisWithLLMEnhancement(input: AnalysisRunnerInput): Promise<AnalysisRunnerOutput> {
  const sanitizedInput = sanitizeAnalysisRunnerInput(input)
  const giftProfile = buildGiftProfile({
    recognition: sanitizedInput.recognition,
    giftContext: sanitizedInput.giftContext,
  })

  const recommendations = buildRecommendations({
    locale: sanitizedInput.locale,
    countryCode: sanitizedInput.countryCode ?? '',
    audience: sanitizedInput.audience,
    giftProfile,
    blockedTerms: [giftProfile.category, ...giftProfile.semanticTags],
  })

  const ruleAnalysis = buildAnalysisFromRules({
    locale: sanitizedInput.locale,
    countryCode: sanitizedInput.countryCode,
    countryName: sanitizedInput.country,
    profile: giftProfile,
    audience: sanitizedInput.audience,
    recommendations,
  })

  // Attempt LLM enhancement (non-blocking - graceful degradation)
  const llmEnhancement = await enhanceRiskWithLLM({
    locale: sanitizedInput.locale,
    countryCode: sanitizedInput.countryCode ?? '',
    countryName: sanitizedInput.country ?? 'Unknown',
    giftName: giftProfile.displayName,
    giftProfile,
    audience: sanitizedInput.audience,
    ruleResult: ruleAnalysis,
  }).catch(() => null)

  // Merge LLM results if successful
  const analysis = mergeLLMEnhancement(ruleAnalysis, llmEnhancement, sanitizedInput.locale)

  return {
    ...analysis,
    giftProfile: {
      displayName: giftProfile.displayName,
      category: giftProfile.category,
      materials: giftProfile.materials,
      styles: giftProfile.styles,
      colors: giftProfile.colors,
      numbers: giftProfile.numbers,
      brandTokens: giftProfile.brandTokens,
      semanticTags: giftProfile.semanticTags,
    },
  }
}
