import type {
  AnalysisResult,
  EnhancedAnalysisState,
  EnhancementRecommendation,
  Locale,
} from '@/components/gifting/home/types'

export interface RiskActionMeta {
  title: string
  tooltip: string
  panelClassName: string
  textClassName: string
}

export function normalizeAnalysisResult(raw: unknown): AnalysisResult {
  const toRecord = (value: unknown): Record<string, unknown> =>
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}

  const toBoundedScore = (value: unknown, fallback: number): number => {
    const numeric =
      typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number.parseFloat(value) : Number.NaN

    if (!Number.isFinite(numeric)) {
      return fallback
    }

    return Math.max(0, Math.min(100, Math.round(numeric)))
  }

  const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

  const toStringArray = (value: unknown): string[] => {
    if (typeof value === 'string') {
      return value
        .split(/[\n,，;；、|]/)
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 8)
    }

    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map(item => {
        if (typeof item === 'string') return item.trim()
        if (typeof item === 'number' || typeof item === 'boolean') return String(item)
        return ''
      })
      .filter(Boolean)
      .slice(0, 8)
  }

  const toNumberArray = (value: unknown): number[] => {
    if (typeof value === 'string') {
      const matches = value.match(/\d+/g) ?? []
      return matches.map(item => Number.parseInt(item, 10)).filter(num => Number.isFinite(num))
    }

    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map(item => (typeof item === 'number' ? item : typeof item === 'string' ? Number.parseInt(item, 10) : Number.NaN))
      .filter(item => Number.isFinite(item))
      .slice(0, 8)
  }

  const source = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
  const score = toRecord(source.score)
  const packaging = toRecord(source.packaging)
  const card = Object.keys(toRecord(source.card)).length > 0 ? toRecord(source.card) : toRecord(source.greetingCard)
  const semanticSignals = toRecord(source.semanticSignals)

  const phonetic = toBoundedScore(score.phonetic, 50)
  const symbol = toBoundedScore(score.symbol, 50)
  const color = toBoundedScore(score.color, 50)

  const fitScore =
    typeof source.fitScore === 'number' && Number.isFinite(source.fitScore)
      ? toBoundedScore(source.fitScore, 50)
      : typeof source.score === 'number' && Number.isFinite(source.score)
        ? toBoundedScore(source.score, 50)
        : Math.round((phonetic + symbol + color) / 3)
  const riskScore =
    typeof source.riskScore === 'number' && Number.isFinite(source.riskScore)
      ? toBoundedScore(source.riskScore, 50)
      : Math.max(0, 100 - fitScore)

  const risk =
    source.riskLevel === 'Low' || source.riskLevel === 'Medium' || source.riskLevel === 'High'
      ? source.riskLevel
      : 'Medium'
  const matchedRules = Array.isArray(source.matchedRules)
    ? source.matchedRules
        .map(item => {
          const rule = toRecord(item)
          return {
            id: toText(rule.id) || 'rule',
            ruleType: toText(rule.ruleType),
            riskScore: toBoundedScore(rule.riskScore, 0),
            explanation: toText(rule.explanation),
            suggestion: toText(rule.suggestion),
          }
        })
        .filter(item => item.explanation || item.suggestion)
        .slice(0, 6)
    : []
  const recommendations = Array.isArray(source.recommendations)
    ? source.recommendations
        .map(item => {
          const rec = toRecord(item)
          return {
            id: toText(rec.id) || `rec-${Math.random()}`,
            nameZh: toText(rec.nameZh),
            nameEn: toText(rec.nameEn),
            category: toText(rec.category),
            score: toBoundedScore(rec.score, 50),
            reasonZh: toText(rec.reasonZh),
            reasonEn: toText(rec.reasonEn),
            packagingTipZh: toText(rec.packagingTipZh),
            packagingTipEn: toText(rec.packagingTipEn),
            shippingNoteZh: toText(rec.shippingNoteZh),
            shippingNoteEn: toText(rec.shippingNoteEn),
            pitchZh: toText(rec.pitchZh),
            pitchEn: toText(rec.pitchEn),
            purchaseUrl: toText(rec.purchaseUrl),
            purchaseChannel: toText(rec.purchaseChannel),
          }
        })
        .filter(item => item.nameZh || item.nameEn)
        .slice(0, 3)
    : []
  const giftProfile = toRecord(source.giftProfile)

  return {
    fitScore,
    riskScore,
    scoreBreakdown: {
      phonetic,
      symbol,
      color,
    },
    riskLevel: risk,
    isTaboo: Boolean(source.isTaboo),
    warning: toText(source.warning) || toText(source.riskReason),
    rescueItem: toText(source.rescueItem),
    rescueReason: toText(source.rescueReason),
    rescuePurchaseUrl: toText(source.rescuePurchaseUrl),
    rescuePurchaseChannel: toText(source.rescuePurchaseChannel),
    packaging: {
      style: toText(packaging.style),
      colors: toStringArray(packaging.colors),
      materials: toText(packaging.materials),
      avoid: toStringArray(packaging.avoid),
    },
    greetingCard: {
      tone: toText(card.tone),
      opener: toText(card.opener),
      body: toText(card.body) || toText(card.text),
      closing: toText(card.closing),
    },
    semanticSignals: {
      tags: toStringArray(Array.isArray(source.semanticSignals) ? source.semanticSignals : semanticSignals.tags),
      flowers: toStringArray(semanticSignals.flowers),
      numbers: toNumberArray(semanticSignals.numbers),
    },
    matchedRules,
    recommendations,
    giftProfile: {
      displayName: toText(giftProfile.displayName),
      category: toText(giftProfile.category),
      materials: toStringArray(giftProfile.materials),
      styles: toStringArray(giftProfile.styles),
      colors: toStringArray(giftProfile.colors),
      numbers: toNumberArray(giftProfile.numbers),
      brandTokens: toStringArray(giftProfile.brandTokens),
      semanticTags: toStringArray(giftProfile.semanticTags),
    },
  }
}

export function normalizeAnalysisEnhancements(raw: unknown): EnhancedAnalysisState | null {
  const toRecord = (value: unknown): Record<string, unknown> =>
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}

  const toText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

  const toNumber = (value: unknown, fallback = 0): number => {
    const numeric =
      typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number.parseFloat(value) : Number.NaN

    return Number.isFinite(numeric) ? numeric : fallback
  }

  const toStringArray = (value: unknown): string[] => {
    if (typeof value === 'string') {
      return value
        .split(/[\n,，;；、|]/)
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 10)
    }

    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
      .slice(0, 10)
  }

  const toRecommendationList = (value: unknown): EnhancementRecommendation[] => {
    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map(item => {
        const rec = toRecord(item)
        const id = toText(rec.id)
        const nameZh = toText(rec.nameZh)
        const nameEn = toText(rec.nameEn)

        if (!id || (!nameZh && !nameEn)) {
          return null
        }

        return {
          id,
          nameZh: nameZh || nameEn,
          nameEn: nameEn || nameZh,
          category: toText(rec.category) || 'general',
          score: Math.round(toNumber(rec.score, 0)),
          reasonZh: toText(rec.reasonZh),
          reasonEn: toText(rec.reasonEn),
          packagingTipZh: toText(rec.packagingTipZh),
          packagingTipEn: toText(rec.packagingTipEn),
          shippingNoteZh: toText(rec.shippingNoteZh),
          shippingNoteEn: toText(rec.shippingNoteEn),
          pitchZh: toText(rec.pitchZh),
          pitchEn: toText(rec.pitchEn),
        }
      })
      .filter((item): item is EnhancementRecommendation => Boolean(item))
      .slice(0, 3)
  }

  const source = toRecord(raw)
  const p1 = toRecord(source.p1)
  const p2 = toRecord(source.p2)
  const multimodal = toRecord(p1.multimodalResults)
  const logistics = toRecord(p1.logisticsEstimate)
  const customsDuty = toRecord(logistics.customsDuty)
  const packing = toRecord(p1.packingRecommendations)
  const localizedOutput = toRecord(source.localizedOutput)

  const normalized: EnhancedAnalysisState = {}

  if (Object.keys(p1).length > 0) {
    normalized.p1 = {}

    if (Object.keys(multimodal).length > 0) {
      const ocrResult = toRecord(multimodal.ocrResult)
      const visualAttributes = toRecord(multimodal.visualAttributes)
      const packaging = toRecord(visualAttributes.packaging)

      normalized.p1.multimodalResults = {
        confidenceScore: toNumber(multimodal.confidenceScore, 0),
        enrichmentSource: toText(multimodal.enrichmentSource) || 'vision-only',
        ocrResult: Object.keys(ocrResult).length
          ? {
              brands: toStringArray(ocrResult.brands),
              specifications: toStringArray(ocrResult.specifications),
            }
          : undefined,
        visualAttributes: Object.keys(visualAttributes).length
          ? {
              colors: Array.isArray(visualAttributes.colors)
                ? visualAttributes.colors
                    .map(item => {
                      const color = toRecord(item)
                      const value = toText(color.color)
                      return value ? { color: value, prominence: toText(color.prominence) || 'accent' } : null
                    })
                    .filter((item): item is { color: string; prominence: string } => Boolean(item))
                : [],
              materials: Array.isArray(visualAttributes.materials)
                ? visualAttributes.materials
                    .map(item => {
                      const material = toRecord(item)
                      const value = toText(material.material)
                      return value ? { material: value, confidence: toNumber(material.confidence, 0) } : null
                    })
                    .filter((item): item is { material: string; confidence: number } => Boolean(item))
                : [],
              styles: toStringArray(visualAttributes.styles),
              formFactor: toText(visualAttributes.formFactor),
              packaging: Object.keys(packaging).length
                ? {
                    style: toText(packaging.style),
                    colors: toStringArray(packaging.colors),
                    hasLogo: Boolean(packaging.hasLogo),
                  }
                : undefined,
            }
          : undefined,
      }
    }

    const collaborativeResults = toRecommendationList(p1.collaborativeResults)
    if (collaborativeResults.length > 0) {
      normalized.p1.collaborativeResults = collaborativeResults
    }

    if (Object.keys(logistics).length > 0) {
      normalized.p1.logisticsEstimate = {
        recommendedCarrier: toText(logistics.recommendedCarrier),
        totalEstimatedCost: toNumber(logistics.totalEstimatedCost, 0),
        destinationCurrency: toText(logistics.destinationCurrency) || 'USD',
        deliveryTimeRange: toText(logistics.deliveryTimeRange),
        shippingQuotes: Array.isArray(logistics.shippingQuotes)
          ? logistics.shippingQuotes
              .map(item => {
                const quote = toRecord(item)
                const carrier = toText(quote.carrier)
                return carrier
                  ? {
                      carrier,
                      baseCost: toNumber(quote.baseCost, 0),
                      estimatedDays: Math.round(toNumber(quote.estimatedDays, 0)),
                      currency: toText(quote.currency) || 'USD',
                      trackable: Boolean(quote.trackable),
                      insuranceAvailable: Boolean(quote.insuranceAvailable),
                    }
                  : null
              })
              .filter(
                (item): item is {
                  carrier: string
                  baseCost: number
                  estimatedDays: number
                  currency: string
                  trackable: boolean
                  insuranceAvailable: boolean
                } => Boolean(item),
              )
          : [],
        customsDuty: {
          dutyRate: toNumber(customsDuty.dutyRate, 0),
          estimatedDuty: toNumber(customsDuty.estimatedDuty, 0),
          currency: toText(customsDuty.currency) || 'USD',
          importLicense: toText(customsDuty.importLicense) || null,
          restrictions: toStringArray(customsDuty.restrictions),
        },
      }
    }

    if (Object.keys(packing).length > 0) {
      normalized.p1.packingRecommendations = {
        general: toStringArray(packing.general),
        estimated_cost_impact: toText(packing.estimated_cost_impact),
      }
    }
  }

  if (Object.keys(p2).length > 0) {
    normalized.p2 = {}

    const wideDeepResults = toRecommendationList(p2.wideDeepResults)
    if (wideDeepResults.length > 0) {
      normalized.p2.wideDeepResults = wideDeepResults
    }

    if (p2.culturalImpactScores && typeof p2.culturalImpactScores === 'object') {
      normalized.p2.culturalImpactScores = Object.fromEntries(
        Object.entries(p2.culturalImpactScores as Record<string, unknown>)
          .map(([key, value]) => [key, Math.max(0, Math.min(1, toNumber(value, 0)))])
          .filter(([, value]) => Number.isFinite(value)),
      )
    }
  }

  if (toText(localizedOutput.formattedRecommendations)) {
    normalized.localizedOutput = {
      formattedRecommendations: toText(localizedOutput.formattedRecommendations),
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null
}

export function budgetRangeToAmount(value: string): number {
  if (value === 'low') return 60
  if (value === 'high') return 240
  return 120
}

export function normalizeEnhancementCountryCode(value: string): string {
  const upper = value.trim().toUpperCase()
  if (upper === 'GB') return 'UK'
  return upper
}

export function formatCurrencyAmount(amount: number, currency: string, locale: Locale): string {
  const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US'

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function buildRiskReasons(analysis: AnalysisResult, locale: Locale): string[] {
  const reasons: string[] = []

  // Warning is already displayed in summaryBody directly in UI

  analysis.matchedRules.forEach(rule => {
    if (rule.explanation) {
      reasons.push(rule.explanation)
    }
  })

  if (analysis.semanticSignals.tags.length > 0) {
    reasons.push(
      locale === 'zh'
        ? `高敏感语义信号：${analysis.semanticSignals.tags.slice(0, 3).join('、')}`
        : `Sensitive semantic signals: ${analysis.semanticSignals.tags.slice(0, 3).join(', ')}`,
    )
  }

  if (analysis.packaging.avoid.length > 0) {
    reasons.push(
      locale === 'zh'
        ? `应避免元素：${analysis.packaging.avoid.slice(0, 3).join('、')}`
        : `Elements to avoid: ${analysis.packaging.avoid.slice(0, 3).join(', ')}`,
    )
  }

  return Array.from(new Set(reasons)).slice(0, 4)
}

export function buildMustSendAdvice(analysis: AnalysisResult, locale: Locale): string[] {
  const tips: string[] = []

  if (analysis.riskLevel === 'Low') {
    if (analysis.packaging.colors.length > 0) {
      tips.push(
        locale === 'zh'
          ? `延续当前安全方向，包装优先用：${analysis.packaging.colors.slice(0, 3).join('、')}`
          : `Keep the current safe direction and favor: ${analysis.packaging.colors.slice(0, 3).join(', ')}`,
      )
    }

    if (analysis.greetingCard.tone) {
      tips.push(
        locale === 'zh'
          ? `贺卡保持 ${analysis.greetingCard.tone} 的语气即可。`
          : `Keep the card tone ${analysis.greetingCard.tone.toLowerCase()}.`,
      )
    }

    tips.push(
      locale === 'zh'
        ? '重点优化包装质感和送礼时机，不需要大幅改动原礼物。'
        : 'Focus on packaging quality and timing before changing the gift itself.',
    )
  } else if (analysis.riskLevel === 'Medium') {
    if (analysis.packaging.avoid.length > 0) {
      tips.push(
        locale === 'zh'
          ? `先避开这些包装/表达元素：${analysis.packaging.avoid.slice(0, 3).join('、')}`
          : `First remove these risky packaging cues: ${analysis.packaging.avoid.slice(0, 3).join(', ')}`,
      )
    }

    if (analysis.packaging.colors.length > 0) {
      tips.push(
        locale === 'zh'
          ? `包装替换成更稳妥的颜色：${analysis.packaging.colors.slice(0, 3).join('、')}`
          : `Switch to safer packaging colors: ${analysis.packaging.colors.slice(0, 3).join(', ')}`,
      )
    }

    tips.push(
      locale === 'zh'
        ? '送出前补一句送礼动机，降低被误读为失礼或不合时宜的概率。'
        : 'Add one sentence explaining your gifting intent before delivery to reduce misinterpretation.',
    )
  } else {
    if (analysis.packaging.avoid.length > 0) {
      tips.push(
        locale === 'zh'
          ? `高风险触发点先全部避开：${analysis.packaging.avoid.slice(0, 3).join('、')}`
          : `Remove every high-risk cue first: ${analysis.packaging.avoid.slice(0, 3).join(', ')}`,
      )
    }

    tips.push(
      locale === 'zh'
        ? '务必弱化原礼物寓意，把重点放在正式致意或感谢场景上。'
        : 'De-emphasize the original symbolism and frame it around formal appreciation or gratitude.',
    )

    // rescueReason is rendered in openingRecommendationReason directly
  }

  analysis.matchedRules.forEach(rule => {
    if (rule.suggestion) {
      tips.push(rule.suggestion)
    }
  })

  if (tips.length === 0) {
    tips.push(
      locale === 'zh'
        ? '建议提前说明祝福场景，避免收礼人误解礼物含义。'
        : 'Clarify your intent and gifting context in advance to reduce misinterpretation.',
    )
  }

  return tips.slice(0, 4)
}

export function getRiskActionMeta(riskLevel: AnalysisResult['riskLevel'], locale: Locale): RiskActionMeta {
  if (riskLevel === 'Low') {
    return {
      title: locale === 'zh' ? '怎么把它送得更好' : 'How to send it well',
      tooltip:
        locale === 'zh'
          ? '当前礼物整体可送，重点是优化表达、包装和送礼时机。'
          : 'The gift is broadly safe. Focus on delivery quality, packaging, and timing.',
      panelClassName: 'border-emerald-500/30 bg-emerald-500/10',
      textClassName: 'text-emerald-100',
    }
  }

  if (riskLevel === 'Medium') {
    return {
      title: locale === 'zh' ? '怎么把风险降下来' : 'How to lower the risk',
      tooltip:
        locale === 'zh'
          ? '当前礼物还能修正，优先处理包装、颜色和表达方式。'
          : 'This gift can still be salvaged. Prioritize packaging, colors, and delivery tone.',
      panelClassName: 'border-amber-500/30 bg-amber-500/10',
      textClassName: 'text-amber-100',
    }
  }

  return {
    title: locale === 'zh' ? '如果必须送，怎么降风险' : 'If you must send it',
    tooltip:
      locale === 'zh'
        ? '当前方案高风险，以下是最低限度的补救动作。'
        : 'The current option is high risk. These are minimum mitigation steps if you must still send it.',
    panelClassName: 'border-red-500/30 bg-red-500/10',
    textClassName: 'text-red-100',
  }
}
