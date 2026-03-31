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

export interface TabooRetrievalRecord {
  id: string
  countryCode: string
  countryNameEn: string
  category: string
  taboo: string
  reason: string
  alternative: string
  source: string
  storyScore: number
  provenance?: {
    file: string
    sheet: string
  }
}

export interface TabooRetrievalCorpus {
  version: number
  generatedAt: string
  sourceDirectory: string
  sourceFiles: string[]
  records: TabooRetrievalRecord[]
}

export interface TabooRetrievalHit {
  id: string
  countryCode: string
  category: string
  taboo: string
  reason: string
  alternative: string
  source: string
  storyScore: number
  score: number
}
