import { GIFT_CATALOG, getSceneTemplate } from '@/lib/config/gifting-config'
import type { AudienceProfileInput, P0Locale, RecommendationItem } from '@/lib/types/gifting-types'
import type { GiftProfile } from '@/lib/analysis/gift-profile'

function localize(locale: P0Locale, zh: string, en: string): string {
  return locale === 'zh' ? zh : en
}

function toBudgetRank(value: string | undefined): number {
  switch (value) {
    case 'high':
      return 3
    case 'medium':
      return 2
    case 'low':
      return 1
    default:
      return 2
  }
}

function scoreBudget(audienceBudget: string | undefined, itemMin: number, itemMax: number): number {
  const budgetRank = toBudgetRank(audienceBudget)
  const priceRank = itemMax > 100 ? 3 : itemMax > 60 ? 2 : 1

  return budgetRank === priceRank ? 16 : Math.abs(budgetRank - priceRank) === 1 ? 8 : -10
}

export function buildRecommendations(input: {
  locale: P0Locale
  countryCode: string
  audience: AudienceProfileInput
  giftProfile: GiftProfile
  blockedTerms: string[]
}): RecommendationItem[] {
  const sceneTemplate = getSceneTemplate(input.audience.sceneTemplate)
  const blocked = new Set(input.blockedTerms.map(item => item.toLowerCase()))

  return GIFT_CATALOG
    .filter(item => !item.avoidCountries.includes(input.countryCode))
    .filter(item => !blocked.has(item.category.toLowerCase()))
    .map(item => {
      let score = 40

      if (sceneTemplate?.recommendedCategories.includes(item.category)) {
        score += 20
      }

      if (sceneTemplate?.avoidCategories.includes(item.category)) {
        score -= 22
      }

      if (item.audienceGroups.includes(input.audience.group)) {
        score += 14
      }

      const occasionSignals = [input.audience.occasion, input.audience.purpose, input.audience.sceneTemplate]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (item.occasionTags.some(tag => occasionSignals.includes(tag))) {
        score += 16
      }

      if (item.purposeTags.some(tag => occasionSignals.includes(tag))) {
        score += 12
      }

      if (item.keywordTags.includes(input.giftProfile.category)) {
        score += 10
      }

      if (item.styleTags.some(tag => input.giftProfile.styles.includes(tag))) {
        score += 8
      }

      if (item.recommendedCountries.includes(input.countryCode)) {
        score += 12
      }

      score += scoreBudget(input.audience.budgetRange, item.priceMin, item.priceMax)

      return {
        id: item.id,
        category: item.category,
        nameZh: item.nameZh,
        nameEn: item.nameEn,
        score,
        reasonZh: `${item.nameZh} 与当前场景、预算和对象画像匹配度较高，且跨文化误读成本较低。`,
        reasonEn: `${item.nameEn} fits the current occasion, budget, and recipient profile with relatively low cultural risk.`,
        packagingTipZh: item.packagingTipZh,
        packagingTipEn: item.packagingTipEn,
        shippingNoteZh: item.shippingNoteZh,
        shippingNoteEn: item.shippingNoteEn,
        pitchZh: item.pitchZh,
        pitchEn: item.pitchEn,
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(item => ({
      ...item,
      reasonZh: item.reasonZh,
      reasonEn: item.reasonEn,
      packagingTipZh: item.packagingTipZh,
      packagingTipEn: item.packagingTipEn,
      shippingNoteZh: item.shippingNoteZh,
      shippingNoteEn: item.shippingNoteEn,
      pitchZh: item.pitchZh,
      pitchEn: item.pitchEn,
      nameZh: item.nameZh,
      nameEn: item.nameEn,
      category: item.category,
      score: item.score,
      id: item.id,
    }))
}

export function buildLocalizedRecommendationSummary(locale: P0Locale, recommendation: RecommendationItem): string {
  return localize(locale, recommendation.reasonZh, recommendation.reasonEn)
}
