import { getCountryName } from '@/lib/countries'
import { COUNTRY_RULES, getSceneTemplate } from '@/lib/p0-config'
import type { AnalysisEngineResult, AudienceProfileInput, CountryRule, P0Locale, RecommendationItem } from '@/lib/p0-types'
import type { GiftProfile } from '@/lib/gift-profile'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function resolveCountryCode(countryCode: string | undefined, countryName: string | undefined): string {
  if (countryCode?.trim()) {
    return countryCode.trim().toUpperCase()
  }

  if (!countryName?.trim()) {
    return 'US'
  }

  const normalized = countryName.trim().toLowerCase()
  const mapping: Record<string, string> = {
    china: 'CN',
    japan: 'JP',
    france: 'FR',
    'united kingdom': 'GB',
    'united states': 'US',
    germany: 'DE',
    'saudi arabia': 'SA',
    'united arab emirates': 'AE',
  }

  return mapping[normalized] ?? 'US'
}

function matchRule(rule: CountryRule, profile: GiftProfile, audience: AudienceProfileInput): boolean {
  const lowerText = profile.searchableText.toLowerCase()
  const triggeredByKeyword = rule.triggers.some(trigger => lowerText.includes(trigger.toLowerCase()))
  const triggeredByNumber = rule.triggers.some(trigger => profile.numbers.includes(Number.parseInt(trigger, 10)))
  const sceneTriggered =
    rule.ruleType === 'business' &&
    [audience.sceneTemplate, audience.occasion, audience.purpose, audience.group]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes('business')

  return triggeredByKeyword || triggeredByNumber || sceneTriggered
}

function localize(locale: P0Locale, zh: string, en: string): string {
  return locale === 'zh' ? zh : en
}

function buildPackagingAdvice(
  locale: P0Locale,
  countryCode: string,
  audience: AudienceProfileInput,
  colors: string[],
  styles: string[],
  matchedRules: CountryRule[],
) {
  const avoid = Array.from(
    new Set(
      matchedRules
        .filter(rule => rule.ruleType === 'color')
        .flatMap(rule => rule.triggers.filter(trigger => trigger.length <= 8)),
    ),
  )

  const recommendedColors = colors.length > 0
    ? colors.filter(color => !avoid.includes(color)).slice(0, 2)
    : []

  const palette =
    recommendedColors.length > 0
      ? recommendedColors
      : countryCode === 'CN'
        ? ['red', 'gold']
        : countryCode === 'JP'
          ? ['navy', 'ivory']
          : countryCode === 'AE' || countryCode === 'SA'
            ? ['dark green', 'gold']
            : ['teal', 'silver']

  const packagingStyle =
    styles.includes('business') || audience.formality === 'formal'
      ? localize(locale, '简洁稳重的抽屉式礼盒', 'A restrained drawer-style presentation box')
      : audience.sceneTemplate === 'festival'
        ? localize(locale, '有节日氛围但不过度张扬的礼盒包装', 'Festive packaging with controlled visual warmth')
        : localize(locale, '简约有层次的礼盒包装', 'A layered minimal gift-box presentation')

  const materials =
    audience.formality === 'formal'
      ? localize(locale, '硬盒纸板 + 细纹压印 + 缎带点缀', 'Rigid board, fine embossing, and a restrained ribbon accent')
      : localize(locale, '磨砂纸盒 + 防震内衬', 'Matte paper stock with protective inner padding')

  return {
    style: packagingStyle,
    colors: palette,
    materials,
    avoid,
  }
}

function buildCardAdvice(
  locale: P0Locale,
  profile: AudienceProfileInput,
  riskLevel: AnalysisEngineResult['riskLevel'],
  giftName: string,
) {
  const formal = profile.formality === 'formal' || profile.group === 'client' || profile.group === 'leader'
  const tone = formal
    ? localize(locale, '真诚、克制、专业', 'Sincere, measured, and professional')
    : localize(locale, '温暖、自然、轻松', 'Warm, natural, and relaxed')

  const opener = formal
    ? localize(locale, '感谢这段时间的支持与交流。', 'Thank you for your continued support and collaboration.')
    : localize(locale, '希望这份小礼物能带来一点好心情。', 'I hope this small gift brings a bit of joy.')

  const body = riskLevel === 'High'
    ? localize(
        locale,
        `这份 ${giftName} 经过了场景和文化习惯筛选，特意选择了更稳妥的表达方式。`,
        `This ${giftName} was selected with both cultural context and the occasion in mind for a safer expression.`,
      )
    : localize(
        locale,
        `选择这份 ${giftName}，是想把实用性和心意一起传达出来。`,
        `I chose this ${giftName} to balance usefulness with a thoughtful gesture.`,
      )

  const closing = formal
    ? localize(locale, '祝一切顺利。', 'Wishing you continued success.')
    : localize(locale, '愿最近一切都顺顺利利。', 'Wishing you all the best.')

  return {
    tone,
    opener,
    body,
    closing,
  }
}

export function buildRescueSuggestion(
  locale: P0Locale,
  countryCode: string,
  audience: AudienceProfileInput,
  riskLevel: AnalysisEngineResult['riskLevel'],
): { item: string; reason: string } {
  if (riskLevel === 'Low') {
    return {
      item: '',
      reason: '',
    }
  }

  if (audience.sceneTemplate === 'business_visit' || audience.group === 'client' || audience.group === 'leader') {
    return {
      item: localize(locale, '高质感签字笔礼盒', 'Executive Pen Gift Set'),
      reason: localize(locale, '正式、稳妥、跨文化误读成本低。', 'It is formal, safe, and less likely to be culturally misread.'),
    }
  }

  if (countryCode === 'AE' || countryCode === 'SA') {
    return {
      item: localize(locale, '椰枣坚果礼盒', 'Dates and Nuts Gift Box'),
      reason: localize(locale, '更贴近当地待客和节庆语境，也便于跨文化接受。', 'It aligns better with regional hospitality and festive expectations.'),
    }
  }

  return {
    item: localize(locale, '精品巧克力礼盒', 'Gourmet Chocolate Box'),
    reason: localize(locale, '大众接受度高，适合多数轻正式场景。', 'It has broad appeal and works well across many light-formal situations.'),
  }
}

export function buildAnalysisFromRules(input: {
  locale: P0Locale
  countryCode?: string
  countryName?: string
  profile: GiftProfile
  audience: AudienceProfileInput
  recommendations: RecommendationItem[]
}): AnalysisEngineResult {
  const locale = input.locale
  const countryCode = resolveCountryCode(input.countryCode, input.countryName)
  const countryNameEn = getCountryName(countryCode, 'en')
  const relevantRules = COUNTRY_RULES.filter(rule => rule.countryCode === countryCode || rule.countryCode === 'GLOBAL')
  const matchedRules = relevantRules.filter(rule => matchRule(rule, input.profile, input.audience))
  const sceneTemplate = getSceneTemplate(input.audience.sceneTemplate)

  const phoneticPenalty = matchedRules
    .filter(rule => rule.ruleType === 'phonetic')
    .reduce((sum, rule) => sum + rule.riskScore, 0)
  const symbolPenalty = matchedRules
    .filter(rule => ['symbol', 'festival', 'business', 'religion'].includes(rule.ruleType))
    .reduce((sum, rule) => sum + rule.riskScore, 0)
  const colorPenalty = matchedRules
    .filter(rule => rule.ruleType === 'color')
    .reduce((sum, rule) => sum + rule.riskScore, 0)

  const phonetic = clamp(100 - phoneticPenalty, 10, 98)
  const symbol = clamp(100 - symbolPenalty, 10, 98)
  const color = clamp(100 - colorPenalty, 10, 98)
  const fitScore = Math.round((phonetic + symbol + color) / 3)
  const maxMatched = matchedRules.length > 0 ? Math.max(...matchedRules.map(rule => rule.riskScore)) : 0
  const isTaboo = matchedRules.some(rule => rule.severity === 'high' && rule.riskScore >= 34)
  const rawRiskScore = Math.round((100 - fitScore) * 0.72 + maxMatched * 0.45 + matchedRules.length * 4)
  const riskScore = clamp(isTaboo ? Math.max(rawRiskScore, 78) : rawRiskScore, 8, 98)
  const riskLevel =
    riskScore >= 72 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low'
  const topRule = matchedRules.sort((left, right) => right.riskScore - left.riskScore)[0] ?? null
  const rescue = buildRescueSuggestion(locale, countryCode, input.audience, riskLevel)
  const packaging = buildPackagingAdvice(locale, countryCode, input.audience, input.profile.colors, input.profile.styles, matchedRules)
  const card = buildCardAdvice(locale, input.audience, riskLevel, input.profile.displayName)

  const warning = topRule
    ? localize(locale, topRule.explanationZh, topRule.explanationEn)
    : sceneTemplate
      ? localize(
          locale,
          `当前礼物在 ${sceneTemplate.nameZh} 场景下整体较稳妥，但仍建议关注包装和表达方式。`,
          `The current gift is generally safe for ${sceneTemplate.nameEn.toLowerCase()} gifting, but packaging and phrasing still matter.`,
        )
      : localize(
          locale,
          '当前礼物整体风险可控，但建议继续保持场景和包装的一致性。',
          'The overall risk is manageable, but keep the occasion and packaging aligned.',
        )

  return {
    countryCode,
    countryNameEn,
    fitScore,
    riskScore,
    score: {
      phonetic,
      symbol,
      color,
    },
    riskLevel,
    isTaboo,
    warning,
    rescueItem: rescue.item,
    rescueReason: rescue.reason,
    semanticSignals: Array.from(
      new Set([
        ...input.profile.semanticTags,
        ...matchedRules.flatMap(rule => rule.tags),
      ]),
    ).slice(0, 8),
    packaging,
    card,
    matchedRules: matchedRules.map(rule => ({
      id: rule.id,
      ruleType: rule.ruleType,
      riskScore: rule.riskScore,
      explanation: localize(locale, rule.explanationZh, rule.explanationEn),
      suggestion: localize(locale, rule.suggestionZh, rule.suggestionEn),
    })),
    recommendations: input.recommendations,
  }
}
