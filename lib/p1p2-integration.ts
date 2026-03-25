/**
 * Integration: P1/P2 Features into Analysis Pipeline
 * Bridges new P1/P2 modules into existing P0 analysis engine
 */

import type { AudienceProfileInput, RecommendationItem } from '@/lib/p0-types'
import { runAnalysisWithLLMEnhancement } from '@/lib/analysis-runner'
import { enhanceWithMultiModal } from '@/lib/p1-multi-modal-enhancement'
import { rerankWithCollaborativeFiltering } from '@/lib/p1-collaborative-filtering'
import { estimateLogisticsCost, getPackingRecommendations } from '@/lib/p1-logistics-assistant'
import { getMessages, formatCurrency } from '@/lib/p1-multi-language'
import { assessCulturalImpact } from '@/lib/p2-knowledge-graph'
import type { GiftProfile } from '@/lib/gift-profile'

export interface EnhancedAnalysisRequest {
  recipientProfile: AudienceProfileInput
  country: string
  shippingCountry: string
  locale: 'en' | 'zh' | 'ja' | 'fr'
  budget?: number
  includeLLM?: boolean // P0 feature
  includeMultimodal?: boolean // P1 feature
  includeCollaborativeFiltering?: boolean // P1 feature
  includeLogistics?: boolean // P1 feature
  includeWideDeep?: boolean // P2 feature
  includeKnowledgeGraph?: boolean // P2 feature
}

export interface P1Enhancements {
  multimodalResults?: Record<string, unknown>
  collaborativeResults?: RecommendationItem[]
  logisticsEstimate?: Record<string, unknown>
  packingRecommendations?: Record<string, unknown>
}

export interface P2Enhancements {
  wideDeepResults?: RecommendationItem[]
  culturalImpactScores?: Record<string, number>
}

export interface LocalizedOutput {
  messages: Record<string, unknown>
  formattedRecommendations: string
}

export interface EnhancedAnalysisResult {
  p0Results: Awaited<ReturnType<typeof runAnalysisWithLLMEnhancement>>
  p1Enhancements?: P1Enhancements
  p2Enhancements?: P2Enhancements
  localizedOutput?: LocalizedOutput
}

/**
 * Run complete enhanced analysis with P0/P1/P2 features
 */
export async function runEnhancedAnalysis(request: EnhancedAnalysisRequest): Promise<EnhancedAnalysisResult> {
  // Step 1: Run P0 analysis (always)
  const p0Results = await runAnalysisWithLLMEnhancement(request.recipientProfile, request.country, {
    useLLM: request.includeLLM !== false,
  })

  const result: EnhancedAnalysisResult = {
    p0Results,
    p1Enhancements: {},
    p2Enhancements: {},
  }

  // Step 2: P1 Enhancements (optional)
  if (request.includeMultimodal || request.includeCollaborativeFiltering || request.includeLogistics) {
    const p1Enhancements = result.p1Enhancements || {}

    // P1.1: Multi-modal enhancement
    if (request.includeMultimodal) {
      const multimodalResult = await enhanceWithMultiModal({
        description: `Gift for ${request.recipientProfile.group}`,
        occasion: request.recipientProfile.occasion || 'general',
        budget: request.budget || 100,
      })

      p1Enhancements.multimodalResults = multimodalResult
    }

    // P1.2: Collaborative filtering
    if (request.includeCollaborativeFiltering && p0Results.recommendations) {
      const mockGiftProfile: GiftProfile = {
        name: 'Mock Gift',
        category: 'general',
        priceRange: [0, 1000],
        semanticTags: [],
        styles: [],
        colors: [],
        tabooCountries: [],
        description: '',
        imagePath: '',
      }
      const collabFiltered = rerankWithCollaborativeFiltering(
        p0Results.recommendations,
        request.recipientProfile,
        mockGiftProfile,
      )
      p1Enhancements.collaborativeResults = collabFiltered
    }

    // P1.3: Logistics estimation
    if (request.includeLogistics && request.shippingCountry) {
      const logistics = estimateLogisticsCost(request.country, request.shippingCountry, 500, // Mock weight
        request.budget || 100,
      )
      p1Enhancements.logisticsEstimate = logistics

      // Add packing recommendations
      p1Enhancements.packingRecommendations = getPackingRecommendations('fragile', request.shippingCountry)
    }

    result.p1Enhancements = p1Enhancements
  }

  // Step 3: P2 Enhancements (optional)
  if (request.includeWideDeep || request.includeKnowledgeGraph) {
    const p2Enhancements = result.p2Enhancements || {}

    // P2.1: Knowledge graph cultural impact
    if (request.includeKnowledgeGraph && p0Results.recommendations) {
      const culturalImpactScores: Record<string, number> = {}
      for (const rec of p0Results.recommendations) {
        const impact = assessCulturalImpact(rec.id, request.country)
        culturalImpactScores[rec.id] = impact.score
      }
      p2Enhancements.culturalImpactScores = culturalImpactScores
    }

    result.p2Enhancements = p2Enhancements
  }

  // Step 4: Localization (optional)
  if (request.locale && request.locale !== 'en') {
    const localeKey = request.locale as 'en' | 'zh' | 'ja' | 'fr'
    const messages = getMessages(localeKey)
    let formattedRecommendations = ''

    if (p0Results.recommendations && p0Results.recommendations.length > 0) {
      for (const rec of p0Results.recommendations) {
        const reason = request.locale === 'zh' ? rec.reasonZh : rec.reasonEn
        const formattedScore = formatCurrency(rec.score, 'USD', localeKey)
        formattedRecommendations += `\n- ${rec.id}: ${reason} (${formattedScore})`
      }
    }

    result.localizedOutput = {
      messages,
      formattedRecommendations,
    }
  }

  return result
}

/**
 * Format enhanced analysis results for user display
 */
export function formatEnhancedAnalysisForDisplay(
  analysisResult: EnhancedAnalysisResult,
  locale: 'en' | 'zh' | 'ja' | 'fr' = 'en',
): string {
  const messages = getMessages(locale)
  let output = `## ${messages.analysis.riskAnalysis}\n\n`

  // P0 Results
  if (analysisResult.p0Results) {
    output += `### Risk Assessment\n`
    output += `- ${messages.analysis.culturalRisk}: ${analysisResult.p0Results.riskLevel}\n`
    output += `- Recommendations: ${analysisResult.p0Results.recommendations?.length || 0} options\n\n`
  }

  // P1 Results
  if (analysisResult.p1Enhancements) {
    if (analysisResult.p1Enhancements.logisticsEstimate) {
      const logistics = analysisResult.p1Enhancements.logisticsEstimate
      output += `### Logistics\n`
      output += `- ${messages.logistics.shippingOptions}: ${logistics.recommendedCarrier}\n`
      output += `- ${messages.logistics.estimatedDays}: ${logistics.deliveryTimeRange}\n`
      output += `- ${messages.logistics.estimatedCost}: ${formatCurrency(logistics.totalEstimatedCost, logistics.destinationCurrency, locale)}\n\n`
    }

    if (analysisResult.p1Enhancements.packingRecommendations) {
      const packing = analysisResult.p1Enhancements.packingRecommendations
      output += `### Packing Recommendations\n`
      for (const rec of packing.general) {
        output += `- ${rec}\n`
      }
      output += '\n'
    }
  }

  // P2 Results
  if (analysisResult.p2Enhancements?.culturalImpactScores) {
    output += `### Cultural Impact Analysis\n`
    for (const [giftId, score] of Object.entries(analysisResult.p2Enhancements.culturalImpactScores)) {
      output += `- ${giftId}: ${(score * 100).toFixed(0)}%\n`
    }
  }

  return output
}

/**
 * Create sample enhanced analysis request for testing
 */
export function createSampleEnhancedRequest(): EnhancedAnalysisRequest {
  return {
    recipientProfile: {
      group: 'peer',
      gender: 'female',
      age: 30,
      country: 'US',
      relationship: 'colleague',
      budget: 150,
      occupation: 'engineer',
      interests: ['tech', 'design'],
      occasion: 'birthday',
    },
    country: 'US',
    shippingCountry: 'CN',
    locale: 'zh',
    budget: 150,
    includeLLM: true,
    includeMultimodal: true,
    includeCollaborativeFiltering: true,
    includeLogistics: true,
    includeWideDeep: true,
    includeKnowledgeGraph: true,
  }
}
