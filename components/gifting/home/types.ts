export type Locale = 'zh' | 'en' | 'ja' | 'fr'

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
