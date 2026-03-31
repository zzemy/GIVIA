export type Locale = 'zh' | 'en'

export type AssistantCurrency = 'USD' | 'CNY' | 'EUR' | 'JPY' | 'GBP'

export interface LogisticsAssistantResult {
  baseAmount: number
  baseCurrency: AssistantCurrency
  rateSource: 'live' | 'fallback'
  convertedAmounts: Record<string, number>
  shippingQuotes: Array<{
    provider: 'DHL' | 'SF Express'
    service: string
    currency: AssistantCurrency
    estimatedCost: number
    etaDays: string
    notes: string[]
    source: 'api' | 'fallback'
  }>
  customsNotes: string[]
  disclaimer: string
}

export interface RecognitionResult {
  itemKey: string
  itemZh: string
  itemEn: string
  category: string
  confidence: number
}

export interface AnalysisResult {
  fitScore: number
  riskScore: number
  scoreBreakdown: {
    phonetic: number
    symbol: number
    color: number
  }
  riskLevel: 'Low' | 'Medium' | 'High'
  isTaboo: boolean
  warning: string
  rescueItem: string
  rescueReason: string
  rescuePurchaseUrl?: string
  rescuePurchaseChannel?: string
  packaging: {
    style: string
    colors: string[]
    materials: string
    avoid: string[]
  }
  greetingCard: {
    tone: string
    opener: string
    body: string
    closing: string
  }
  semanticSignals: {
    tags: string[]
    flowers: string[]
    numbers: number[]
  }
  matchedRules: Array<{
    id: string
    ruleType: string
    riskScore: number
    explanation: string
    suggestion: string
  }>
  recommendations: Array<{
    id: string
    nameZh: string
    nameEn: string
    category: string
    score: number
    reasonZh: string
    reasonEn: string
    packagingTipZh: string
    packagingTipEn: string
    shippingNoteZh: string
    shippingNoteEn: string
    pitchZh: string
    pitchEn: string
    purchaseUrl?: string
    purchaseChannel?: string
  }>
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

export type EnhancementRecommendation = AnalysisResult['recommendations'][number]

export type EnhancedAnalysisState = {
  p1?: {
    multimodalResults?: {
      confidenceScore: number
      enrichmentSource: string
      ocrResult?: {
        brands: string[]
        specifications: string[]
      }
      visualAttributes?: {
        colors: Array<{ color: string; prominence: string }>
        materials: Array<{ material: string; confidence: number }>
        styles: string[]
        formFactor: string
        packaging?: {
          style: string
          colors: string[]
          hasLogo: boolean
        }
      }
    }
    collaborativeResults?: EnhancementRecommendation[]
    logisticsEstimate?: {
      recommendedCarrier: string
      totalEstimatedCost: number
      destinationCurrency: string
      deliveryTimeRange: string
      shippingQuotes: Array<{
        carrier: string
        baseCost: number
        estimatedDays: number
        currency: string
        trackable: boolean
        insuranceAvailable: boolean
      }>
      customsDuty: {
        dutyRate: number
        estimatedDuty: number
        currency: string
        importLicense: string | null
        restrictions: string[]
      }
    }
    packingRecommendations?: {
      general: string[]
      estimated_cost_impact: string
    }
  }
  p2?: {
    wideDeepResults?: EnhancementRecommendation[]
    culturalImpactScores?: Record<string, number>
  }
  localizedOutput?: {
    formattedRecommendations: string
  }
}

export type RecognitionSource =
  | 'aliyun-dashscope'
  | 'aliyun-dashscope-text'
  | 'local-fallback'
  | 'local-fallback-text'

export type AudienceGroup = 'peer' | 'client' | 'leader' | 'family' | 'elder' | 'other'

export type EnhancementSettings = {
  multimodal: boolean
  collaborativeFiltering: boolean
  logistics: boolean
  wideDeep: boolean
  knowledgeGraph: boolean
}

export type SelectOption = {
  value: string
  label: string
}

export type SceneTemplateOption = SelectOption & {
  hint: string
}

export type FavoriteGiftChecklistItem = {
  id: string
  name: string
  category: string
}
