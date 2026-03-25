import type { CountryRule } from '@/lib/types/gifting-types'
import { mergeCountryRuleSources, mergeTabooDatasets } from '@/lib/domain/taboo/taboo-merge'
import { loadTabooDatasets } from '@/lib/domain/taboo/taboo-loader'

describe('taboo merge', () => {
  it('normalizes taboo datasets into rule-engine shape', () => {
    const rules = mergeTabooDatasets(loadTabooDatasets())

    expect(rules.some(rule => rule.id === 'global-business-romantic')).toBe(true)
    expect(rules.some(rule => rule.id === 'cn-clock' && rule.countryCode === 'CN')).toBe(true)
    expect(rules.some(rule => rule.id === 'us-overpersonal-business' && rule.countryCode === 'US')).toBe(
      true,
    )
  })

  it('merges taboo and legacy rules without duplicate ids', () => {
    const tabooRules = mergeTabooDatasets(loadTabooDatasets())
    const legacyRules: CountryRule[] = [
      {
        id: 'cn-clock',
        countryCode: 'CN',
        countryNameEn: 'China',
        ruleType: 'phonetic',
        severity: 'low',
        riskScore: 1,
        triggers: ['clock'],
        explanationZh: 'old',
        explanationEn: 'old',
        suggestionZh: 'old',
        suggestionEn: 'old',
        tags: ['old'],
      },
      {
        id: 'legacy-extra',
        countryCode: 'GB',
        countryNameEn: 'United Kingdom',
        ruleType: 'symbol',
        severity: 'medium',
        riskScore: 18,
        triggers: ['umbrella'],
        explanationZh: 'legacy',
        explanationEn: 'legacy',
        suggestionZh: 'legacy',
        suggestionEn: 'legacy',
        tags: ['legacy'],
      },
    ]

    const merged = mergeCountryRuleSources({
      tabooRules,
      legacyRules,
    })

    expect(merged.filter(rule => rule.id === 'cn-clock')).toHaveLength(1)
    expect(merged.some(rule => rule.id === 'legacy-extra')).toBe(true)
  })
})
