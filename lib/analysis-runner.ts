import { buildGiftProfile } from '@/lib/gift-profile'
import { buildRecommendations } from '@/lib/recommend-engine'
import { buildAnalysisFromRules } from '@/lib/risk-engine'
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
