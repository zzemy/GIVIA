export type P0Locale = 'zh' | 'en'

export type RiskLevel = 'Low' | 'Medium' | 'High'

export type RuleType = 'phonetic' | 'symbol' | 'color' | 'festival' | 'business' | 'religion'

export interface AudienceProfileInput {
  group: string
  customGroup?: string
  sceneTemplate?: string
  ageBand?: string
  gender?: string
  occupation?: string
  relationship?: string
  occasion?: string
  purpose?: string
  budgetRange?: string
  formality?: string
  notes?: string
}

export interface GiftContextInput {
  name?: string
  description?: string
  visionLabel?: string
  visionDescription?: string
  source?: string
  rawLabels?: string[]
}

export interface CountryRule {
  id: string
  countryCode: string
  countryNameEn: string
  ruleType: RuleType
  severity: 'low' | 'medium' | 'high'
  riskScore: number
  triggers: string[]
  explanationZh: string
  explanationEn: string
  suggestionZh: string
  suggestionEn: string
  tags: string[]
}

export interface SceneTemplate {
  id: string
  code: string
  nameZh: string
  nameEn: string
  audienceGroup: string
  defaultFormality: string
  defaultBudgetRange: string
  defaultPurpose: string
  defaultOccasion: string
  recommendedCategories: string[]
  avoidCategories: string[]
  promptZh: string
  promptEn: string
}

export interface GiftCatalogItem {
  id: string
  category: string
  nameZh: string
  nameEn: string
  priceMin: number
  priceMax: number
  audienceGroups: string[]
  occasionTags: string[]
  purposeTags: string[]
  keywordTags: string[]
  styleTags: string[]
  recommendedCountries: string[]
  avoidCountries: string[]
  packagingTipZh: string
  packagingTipEn: string
  shippingNoteZh: string
  shippingNoteEn: string
  pitchZh: string
  pitchEn: string
}

export interface RecommendationItem {
  id: string
  category: string
  nameZh: string
  nameEn: string
  score: number
  reasonZh: string
  reasonEn: string
  packagingTipZh: string
  packagingTipEn: string
  shippingNoteZh: string
  shippingNoteEn: string
  pitchZh: string
  pitchEn: string
}

export interface AnalysisEngineResult {
  countryCode: string
  countryNameEn: string
  fitScore: number
  riskScore: number
  score: {
    phonetic: number
    symbol: number
    color: number
  }
  riskLevel: RiskLevel
  isTaboo: boolean
  warning: string
  rescueItem: string
  rescueReason: string
  semanticSignals: string[]
  packaging: {
    style: string
    colors: string[]
    materials: string
    avoid: string[]
  }
  card: {
    tone: string
    opener: string
    body: string
    closing: string
  }
  matchedRules: Array<{
    id: string
    ruleType: RuleType
    riskScore: number
    explanation: string
    suggestion: string
  }>
  recommendations: RecommendationItem[]
}
