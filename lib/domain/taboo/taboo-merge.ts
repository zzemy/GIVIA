import type { CountryRule } from '@/lib/types/gifting-types'
import type { TabooDataset } from '@/lib/domain/taboo/taboo-types'

export function tabooDatasetToCountryRules(dataset: TabooDataset): CountryRule[] {
  return dataset.rules.map(rule => ({
    id: rule.id,
    countryCode: dataset.countryCode,
    countryNameEn: dataset.countryNameEn,
    ruleType: rule.ruleType,
    severity: rule.severity,
    riskScore: rule.riskScore,
    triggers: [...rule.triggers],
    explanationZh: rule.explanationZh,
    explanationEn: rule.explanationEn,
    suggestionZh: rule.suggestionZh,
    suggestionEn: rule.suggestionEn,
    tags: [...rule.tags],
  }))
}

export function mergeTabooDatasets(datasets: TabooDataset[]): CountryRule[] {
  return datasets.flatMap(tabooDatasetToCountryRules)
}

export function mergeCountryRuleSources(input: {
  tabooRules: CountryRule[]
  legacyRules: CountryRule[]
}): CountryRule[] {
  const merged = new Map<string, CountryRule>()

  for (const rule of [...input.tabooRules, ...input.legacyRules]) {
    if (!merged.has(rule.id)) {
      merged.set(rule.id, rule)
    }
  }

  return Array.from(merged.values())
}
