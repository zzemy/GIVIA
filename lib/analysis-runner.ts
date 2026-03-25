import { buildGiftProfile } from '@/lib/gift-profile'
import { buildRecommendations } from '@/lib/recommend-engine'
import { buildAnalysisFromRules } from '@/lib/risk-engine'
import { enhanceRiskWithLLM, mergeLLMEnhancement } from '@/lib/llm-risk-enhancement'
import type { AnalysisEngineResult, AudienceProfileInput, GiftContextInput, P0Locale } from '@/lib/p0-types'

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

export function runAnalysis(input: AnalysisRunnerInput): AnalysisRunnerOutput {
  const giftProfile = buildGiftProfile({
    recognition: input.recognition,
    giftContext: input.giftContext,
  })

  const recommendations = buildRecommendations({
    locale: input.locale,
    countryCode: input.countryCode ?? '',
    audience: input.audience,
    giftProfile,
    blockedTerms: [giftProfile.category, ...giftProfile.semanticTags],
  })

  const analysis = buildAnalysisFromRules({
    locale: input.locale,
    countryCode: input.countryCode,
    countryName: input.country,
    profile: giftProfile,
    audience: input.audience,
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
  const giftProfile = buildGiftProfile({
    recognition: input.recognition,
    giftContext: input.giftContext,
  })

  const recommendations = buildRecommendations({
    locale: input.locale,
    countryCode: input.countryCode ?? '',
    audience: input.audience,
    giftProfile,
    blockedTerms: [giftProfile.category, ...giftProfile.semanticTags],
  })

  const ruleAnalysis = buildAnalysisFromRules({
    locale: input.locale,
    countryCode: input.countryCode,
    countryName: input.country,
    profile: giftProfile,
    audience: input.audience,
    recommendations,
  })

  // Attempt LLM enhancement (non-blocking - graceful degradation)
  const llmEnhancement = await enhanceRiskWithLLM({
    locale: input.locale,
    countryCode: input.countryCode ?? '',
    countryName: input.country ?? 'Unknown',
    giftName: giftProfile.displayName,
    giftProfile,
    audience: input.audience,
    ruleResult: ruleAnalysis,
  }).catch(() => null)

  // Merge LLM results if successful
  const analysis = mergeLLMEnhancement(ruleAnalysis, llmEnhancement, input.locale)

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
