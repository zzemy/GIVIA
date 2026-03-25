import type { CountryRule } from '@/lib/types/gifting-types'

export type TabooDatasetScope = 'global' | 'country'

export interface TabooRuleRecord {
  id: string
  ruleType: CountryRule['ruleType']
  severity: CountryRule['severity']
  riskScore: number
  triggers: string[]
  explanationZh: string
  explanationEn: string
  suggestionZh: string
  suggestionEn: string
  tags: string[]
}

export interface TabooDataset {
  scope: TabooDatasetScope
  countryCode: string
  countryNameEn: string
  rules: TabooRuleRecord[]
}

export interface InjectionBlacklistDataset {
  phrases: string[]
}
