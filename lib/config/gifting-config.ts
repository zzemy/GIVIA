import countryRulesData from '@/data/country-rules.json'
import giftCatalogData from '@/data/gift-catalog.json'
import sceneTemplatesData from '@/data/scene-templates.json'
import { loadTabooCountryRules } from '@/lib/domain/taboo/taboo-loader'
import { mergeCountryRuleSources } from '@/lib/domain/taboo/taboo-merge'
import type { CountryRule, GiftCatalogItem, SceneTemplate } from '@/lib/types/gifting-types'

export const COUNTRY_RULES = mergeCountryRuleSources({
  tabooRules: loadTabooCountryRules(),
  legacyRules: countryRulesData.rules as CountryRule[],
})
export const GIFT_CATALOG = giftCatalogData.items as GiftCatalogItem[]
export const SCENE_TEMPLATES = sceneTemplatesData.templates as SceneTemplate[]

export const AGE_BAND_OPTIONS = [
  { value: 'teen', labelZh: '18 岁以下', labelEn: 'Under 18' },
  { value: 'young_adult', labelZh: '18-30 岁', labelEn: '18-30' },
  { value: 'adult', labelZh: '31-50 岁', labelEn: '31-50' },
  { value: 'senior', labelZh: '50+ 岁', labelEn: '50+' },
]

export const GENDER_OPTIONS = [
  { value: 'neutral', labelZh: '不特别区分', labelEn: 'No preference' },
  { value: 'female', labelZh: '女性', labelEn: 'Female' },
  { value: 'male', labelZh: '男性', labelEn: 'Male' },
]

export const OCCUPATION_OPTIONS = [
  { value: 'student', labelZh: '学生', labelEn: 'Student' },
  { value: 'office', labelZh: '职场人士', labelEn: 'Office Professional' },
  { value: 'teacher', labelZh: '教师 / 导师', labelEn: 'Teacher / Mentor' },
  { value: 'executive', labelZh: '管理层', labelEn: 'Executive' },
  { value: 'creative', labelZh: '创意从业者', labelEn: 'Creative Professional' },
  { value: 'other', labelZh: '其他', labelEn: 'Other' },
]

export const RELATIONSHIP_OPTIONS = [
  { value: 'colleague', labelZh: '同事', labelEn: 'Colleague' },
  { value: 'partner', labelZh: '合作伙伴', labelEn: 'Partner' },
  { value: 'mentor', labelZh: '导师 / 上级', labelEn: 'Mentor / Leader' },
  { value: 'friend', labelZh: '朋友', labelEn: 'Friend' },
  { value: 'family', labelZh: '家人', labelEn: 'Family' },
]

export const BUDGET_RANGE_OPTIONS = [
  { value: 'low', labelZh: '低预算', labelEn: 'Low Budget' },
  { value: 'medium', labelZh: '中预算', labelEn: 'Mid Budget' },
  { value: 'high', labelZh: '高预算', labelEn: 'High Budget' },
]

export const FORMALITY_OPTIONS = [
  { value: 'casual', labelZh: '轻松', labelEn: 'Casual' },
  { value: 'semi-formal', labelZh: '半正式', labelEn: 'Semi-formal' },
  { value: 'formal', labelZh: '正式', labelEn: 'Formal' },
]

export function getSceneTemplate(code: string | undefined): SceneTemplate | null {
  if (!code) {
    return null
  }

  return SCENE_TEMPLATES.find(template => template.code === code) ?? null
}
