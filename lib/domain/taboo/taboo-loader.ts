import coreDataset from '@/data/taboos/global/core.json'
import injectionBlacklist from '@/data/taboos/global/injection-blacklist.json'
import cnDataset from '@/data/taboos/countries/CN.json'
import frDataset from '@/data/taboos/countries/FR.json'
import jpDataset from '@/data/taboos/countries/JP.json'
import usDataset from '@/data/taboos/countries/US.json'
import type { CountryRule } from '@/lib/types/gifting-types'
import { mergeTabooDatasets } from '@/lib/domain/taboo/taboo-merge'
import type { InjectionBlacklistDataset, TabooDataset } from '@/lib/domain/taboo/taboo-types'

const RAW_TABOO_DATASETS = [
  coreDataset,
  cnDataset,
  jpDataset,
  frDataset,
  usDataset,
] as TabooDataset[]

function normalizeDataset(dataset: TabooDataset): TabooDataset {
  return {
    scope: dataset.scope,
    countryCode: dataset.countryCode.trim().toUpperCase(),
    countryNameEn: dataset.countryNameEn.trim(),
    rules: dataset.rules.map(rule => ({
      ...rule,
      id: rule.id.trim(),
      triggers: rule.triggers.map(trigger => trigger.trim()).filter(Boolean),
      tags: rule.tags.map(tag => tag.trim()).filter(Boolean),
      explanationZh: rule.explanationZh.trim(),
      explanationEn: rule.explanationEn.trim(),
      suggestionZh: rule.suggestionZh.trim(),
      suggestionEn: rule.suggestionEn.trim(),
    })),
  }
}

export function loadTabooDatasets(): TabooDataset[] {
  return RAW_TABOO_DATASETS.map(normalizeDataset)
}

export function loadTabooDatasetByCountry(countryCode: string): TabooDataset | null {
  const normalizedCountryCode = countryCode.trim().toUpperCase()

  return loadTabooDatasets().find(dataset => dataset.countryCode === normalizedCountryCode) ?? null
}

export function loadInjectionBlacklist(): string[] {
  const blacklist = injectionBlacklist as InjectionBlacklistDataset

  return blacklist.phrases.map(phrase => phrase.trim()).filter(Boolean)
}

export function loadTabooCountryRules(): CountryRule[] {
  return mergeTabooDatasets(loadTabooDatasets())
}
