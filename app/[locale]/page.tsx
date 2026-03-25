'use client'

import React, { useMemo, useState, useRef } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ChevronLeft, ChevronRight, RotateCcw, Zap, ShieldCheck, Brain, ShoppingBag, ArrowRight, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WorkflowProgress } from '@/components/gifting/workflow-progress'
import { StepGiftInput } from '@/components/gifting/home/step-gift-input'
import { StepAnalysis } from '@/components/gifting/home/step-analysis'
import { StepCountry } from '@/components/gifting/home/step-country'
import { WorkflowSupportPanels } from '@/components/gifting/home/workflow-support-panels'
import { InteractiveFlowDemo } from '@/components/gifting/interactive-flow-demo'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { getCountryName } from '@/lib/countries'
import { withBasePath } from '@/lib/asset-path'
import {
  AGE_BAND_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  FORMALITY_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SCENE_TEMPLATES,
  getSceneTemplate,
} from '@/lib/p0-config'
import {
  loadAnalysisHistory,
  loadFavoriteRecommendationIds,
  saveAnalysisRecord,
  toggleFavoriteRecommendation,
  type StoredAnalysisRecord,
} from '@/lib/p0-storage'
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'
import jaMessages from '@/messages/ja.json'
import frMessages from '@/messages/fr.json'
import { cn } from '@/lib/utils'
import type {
  AssistantCurrency,
  AudienceGroup,
  EnhancementSettings,
  Locale,
  LogisticsAssistantResult,
  RecognitionResult,
  RecognitionSource,
} from '@/components/gifting/home/types'

interface RecognitionResponsePayload {
  source?: string
  recognition?: RecognitionResult
  description?: string
  detectedLabel?: string
  rawLabels?: string[]
  error?: string
}

interface AnalysisResult {
  fitScore: number
  riskScore: number
  scoreBreakdown: {
    phonetic: number
    symbol: number
    color: number
  }
  riskLevel: 'Low' | 'Medium' | 'High'
  isTaboo: boolean
  warning: string
  rescueItem: string
  rescueReason: string
  packaging: {
    style: string
    colors: string[]
    materials: string
    avoid: string[]
  }
  greetingCard: {
    tone: string
    opener: string
    body: string
    closing: string
  }
  semanticSignals: {
    tags: string[]
    flowers: string[]
    numbers: number[]
  }
  matchedRules: Array<{
    id: string
    ruleType: string
    riskScore: number
    explanation: string
    suggestion: string
  }>
  recommendations: Array<{
    id: string
    nameZh: string
    nameEn: string
    category: string
    score: number
    reasonZh: string
    reasonEn: string
    packagingTipZh: string
    packagingTipEn: string
    shippingNoteZh: string
    shippingNoteEn: string
    pitchZh: string
    pitchEn: string
  }>
  giftProfile: {
    displayName: string
    category: string
    materials: string[]
    styles: string[]
    colors: string[]
    numbers: number[]
    brandTokens: string[]
    semanticTags: string[]
  }
}

type EnhancementRecommendation = AnalysisResult['recommendations'][number]

type EnhancedAnalysisState = {
  p1?: {
    multimodalResults?: {
      confidenceScore: number
      enrichmentSource: string
      ocrResult?: {
        brands: string[]
        specifications: string[]
      }
      visualAttributes?: {
        colors: Array<{ color: string; prominence: string }>
        materials: Array<{ material: string; confidence: number }>
        styles: string[]
        formFactor: string
        packaging?: {
          style: string
          colors: string[]
          hasLogo: boolean
        }
      }
    }
    collaborativeResults?: EnhancementRecommendation[]
    logisticsEstimate?: {
      recommendedCarrier: string
      totalEstimatedCost: number
      destinationCurrency: string
      deliveryTimeRange: string
      shippingQuotes: Array<{
        carrier: string
        baseCost: number
        estimatedDays: number
        currency: string
        trackable: boolean
        insuranceAvailable: boolean
      }>
      customsDuty: {
        dutyRate: number
        estimatedDuty: number
        currency: string
        importLicense: string | null
        restrictions: string[]
      }
    }
    packingRecommendations?: {
      general: string[]
      estimated_cost_impact: string
    }
  }
  p2?: {
    wideDeepResults?: EnhancementRecommendation[]
    culturalImpactScores?: Record<string, number>
  }
  localizedOutput?: {
    formattedRecommendations: string
  }
}

function normalizeAnalysisResult(raw: unknown): AnalysisResult {
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

  const risk = source.riskLevel === 'Low' || source.riskLevel === 'Medium' || source.riskLevel === 'High'
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

function normalizeAnalysisEnhancements(raw: unknown): EnhancedAnalysisState | null {
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
                    .filter(
                      (item): item is { color: string; prominence: string } => Boolean(item),
                    )
                : [],
              materials: Array.isArray(visualAttributes.materials)
                ? visualAttributes.materials
                    .map(item => {
                      const material = toRecord(item)
                      const value = toText(material.material)
                      return value ? { material: value, confidence: toNumber(material.confidence, 0) } : null
                    })
                    .filter(
                      (item): item is { material: string; confidence: number } => Boolean(item),
                    )
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

function budgetRangeToAmount(value: string): number {
  if (value === 'low') return 60
  if (value === 'high') return 240
  return 120
}

function normalizeEnhancementCountryCode(value: string): string {
  const upper = value.trim().toUpperCase()
  if (upper === 'GB') return 'UK'
  return upper
}

function formatCurrencyAmount(amount: number, currency: string, locale: Locale): string {
  const intlLocale =
    locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : locale === 'fr' ? 'fr-FR' : 'en-US'

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

function buildRiskReasons(analysis: AnalysisResult, locale: Locale): string[] {
  const reasons: string[] = []

  if (analysis.warning) {
    reasons.push(analysis.warning)
  }

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

function buildMustSendAdvice(analysis: AnalysisResult, locale: Locale): string[] {
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
        : 'Focus on packaging quality and timing rather than replacing the gift.',
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

    if (analysis.rescueReason) {
      tips.push(
        locale === 'zh'
          ? `如无法更换，请主动解释选择理由：${analysis.rescueReason}`
          : `If replacement is impossible, proactively explain the intent: ${analysis.rescueReason}`,
      )
    }
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

function getRiskActionMeta(riskLevel: AnalysisResult['riskLevel'], locale: Locale) {
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

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const routeLocale: Locale =
    params?.locale === 'zh' || params?.locale === 'en' || params?.locale === 'ja' || params?.locale === 'fr'
      ? params.locale
      : 'zh'
  const [locale, setLocale] = React.useState<Locale>(routeLocale)
  const apiLanguage: 'zh' | 'en' = locale === 'zh' ? 'zh' : 'en'

  React.useEffect(() => {
    setLocale(routeLocale)
  }, [routeLocale])

  React.useEffect(() => {
    setHistoryRecords(loadAnalysisHistory())
    setFavoriteRecommendationIds(loadFavoriteRecommendationIds())
  }, [])

  const t = React.useCallback(
    (path: string): string => {
      const source =
        locale === 'zh'
          ? zhMessages
          : locale === 'ja'
            ? jaMessages
            : locale === 'fr'
              ? frMessages
              : enMessages
      const value = path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[key]
        }
        return path
      }, source as unknown)

      return typeof value === 'string' ? value : path
    },
    [locale]
  )

  // Workflow state
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null)
  const [recognitionSource, setRecognitionSource] = useState<RecognitionSource | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [targetGroup, setTargetGroup] = useState<AudienceGroup>('peer')
  const [customAudienceGroup, setCustomAudienceGroup] = useState('')
  const [sceneTemplate, setSceneTemplate] = useState('birthday')
  const [ageBand, setAgeBand] = useState('adult')
  const [gender, setGender] = useState('neutral')
  const [occupation, setOccupation] = useState('office')
  const [relationship, setRelationship] = useState('friend')
  const [budgetRange, setBudgetRange] = useState('medium')
  const [formality, setFormality] = useState('semi-formal')
  const [occasion, setOccasion] = useState('')
  const [targetProfile, setTargetProfile] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisEnhancements, setAnalysisEnhancements] = useState<EnhancedAnalysisState | null>(null)
  const [analysisSource, setAnalysisSource] = useState('')
  const [historyRecords, setHistoryRecords] = useState<StoredAnalysisRecord[]>([])
  const [favoriteRecommendationIds, setFavoriteRecommendationIds] = useState<string[]>([])
  const [assistantCurrency, setAssistantCurrency] = useState<AssistantCurrency>('USD')
  const [assistantAmountInput, setAssistantAmountInput] = useState('120')
  const [assistantWeightInput, setAssistantWeightInput] = useState('1')
  const [assistantDeclaredValueInput, setAssistantDeclaredValueInput] = useState('120')
  const [assistantResult, setAssistantResult] = useState<LogisticsAssistantResult | null>(null)
  const [assistantError, setAssistantError] = useState('')
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [analysisEnhancementSettings, setAnalysisEnhancementSettings] = useState<EnhancementSettings>({
    multimodal: true,
    collaborativeFiltering: true,
    logistics: true,
    wideDeep: true,
    knowledgeGraph: true,
  })
  const [enhancementOriginCountry, setEnhancementOriginCountry] = useState('CN')

  // Loading state
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>('')

  // File input
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [giftName, setGiftName] = useState('')
  const [giftDescription, setGiftDescription] = useState('')
  const [visionDescription, setVisionDescription] = useState('')
  const giftDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const visionDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const [visionLabel, setVisionLabel] = useState('')
  const [recognitionRawLabels, setRecognitionRawLabels] = useState<string[]>([])
  const [showGiftInputsAfterImageRecognition, setShowGiftInputsAfterImageRecognition] = useState(false)
  const [showAdvancedAudienceFields, setShowAdvancedAudienceFields] = useState(false)
  const [activeImpactCard, setActiveImpactCard] = useState(0)
  const [isImpactPaused, setIsImpactPaused] = useState(false)
  const [recognizingElapsedSeconds, setRecognizingElapsedSeconds] = useState(0)
  const [analyzingElapsedSeconds, setAnalyzingElapsedSeconds] = useState(0)

  const isLoading = isRecognizing || isAnalyzing
  const isLoadingRecognition = isRecognizing
  const isZh = locale === 'zh'
  const hasGiftInput = Boolean(giftName.trim() || giftDescription.trim())
  const canRecognize = Boolean(selectedFile || hasGiftInput)
  const isAudienceReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0
  const canAnalyze = Boolean(selectedCountry && (recognition || hasGiftInput || selectedFile) && isAudienceReady)
  const isTextOnlyRecognition = Boolean(hasGiftInput && !selectedFile)
  const shouldHideGiftInputs = Boolean(selectedFile && recognition && !showGiftInputsAfterImageRecognition)

  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) {
      return
    }

    element.style.height = 'auto'
    element.style.height = `${Math.max(element.scrollHeight, 72)}px`
  }

  React.useEffect(() => {
    if (!isRecognizing) {
      setRecognizingElapsedSeconds(0)
      return
    }

    const startTime = Date.now()
    const timer = window.setInterval(() => {
      setRecognizingElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRecognizing])

  React.useEffect(() => {
    if (!isAnalyzing) {
      setAnalyzingElapsedSeconds(0)
      return
    }

    const startTime = Date.now()
    const timer = window.setInterval(() => {
      setAnalyzingElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isAnalyzing])

  React.useEffect(() => {
    autoResizeTextarea(giftDescriptionRef.current)
  }, [giftDescription, shouldHideGiftInputs])

  React.useEffect(() => {
    autoResizeTextarea(visionDescriptionRef.current)
  }, [visionDescription, recognition])

  const riskReasons = useMemo(() => (analysis ? buildRiskReasons(analysis, locale) : []), [analysis, locale])
  const mustSendAdvice = useMemo(() => (analysis ? buildMustSendAdvice(analysis, locale) : []), [analysis, locale])

  const audienceOptions = useMemo(
    () =>
      isZh
        ? [
            { value: 'peer' as const, label: '同学 / 同事' },
            { value: 'client' as const, label: '客户 / 合作方' },
            { value: 'leader' as const, label: '上级 / 导师' },
            { value: 'family' as const, label: '家人 / 伴侣' },
            { value: 'elder' as const, label: '长辈' },
            { value: 'other' as const, label: '其他（自定义）' },
          ]
        : [
            { value: 'peer' as const, label: 'Peer / Colleague' },
            { value: 'client' as const, label: 'Client / Partner' },
            { value: 'leader' as const, label: 'Leader / Mentor' },
            { value: 'family' as const, label: 'Family / Partner' },
            { value: 'elder' as const, label: 'Elder' },
            { value: 'other' as const, label: 'Other (custom)' },
          ],
    [isZh],
  )

  const selectedAudienceLabel = useMemo(
    () =>
      targetGroup === 'other'
        ? customAudienceGroup.trim() || (isZh ? '其他（待填写）' : 'Other (pending)')
        : audienceOptions.find(option => option.value === targetGroup)?.label ?? targetGroup,
    [audienceOptions, customAudienceGroup, isZh, targetGroup],
  )

  const activeSceneTemplate = useMemo(() => getSceneTemplate(sceneTemplate), [sceneTemplate])
  const sceneTemplateOptions = useMemo(
    () =>
      SCENE_TEMPLATES.map(template => ({
        value: template.code,
        label: isZh ? template.nameZh : template.nameEn,
        hint: isZh ? template.promptZh : template.promptEn,
      })),
    [isZh],
  )
  const ageBandOptions = useMemo(
    () => AGE_BAND_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const genderOptions = useMemo(
    () => GENDER_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const occupationOptions = useMemo(
    () => OCCUPATION_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const relationshipOptions = useMemo(
    () => RELATIONSHIP_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const budgetOptions = useMemo(
    () => BUDGET_RANGE_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const formalityOptions = useMemo(
    () => FORMALITY_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const ageBandLabel = ageBandOptions.find(option => option.value === ageBand)?.label ?? ageBand
  const occupationLabel = occupationOptions.find(option => option.value === occupation)?.label ?? occupation
  const relationshipLabel = relationshipOptions.find(option => option.value === relationship)?.label ?? relationship
  const budgetLabel = budgetOptions.find(option => option.value === budgetRange)?.label ?? budgetRange
  const formalityLabel = formalityOptions.find(option => option.value === formality)?.label ?? formality
  const templateAudienceLabel =
    audienceOptions.find(option => option.value === activeSceneTemplate?.audienceGroup)?.label ??
    activeSceneTemplate?.audienceGroup ??
    ''
  const templateBudgetLabel =
    budgetOptions.find(option => option.value === activeSceneTemplate?.defaultBudgetRange)?.label ??
    activeSceneTemplate?.defaultBudgetRange ??
    ''
  const templateFormalityLabel =
    formalityOptions.find(option => option.value === activeSceneTemplate?.defaultFormality)?.label ??
    activeSceneTemplate?.defaultFormality ??
    ''
  const templateHasAudienceOverride = Boolean(activeSceneTemplate && selectedAudienceLabel !== templateAudienceLabel)
  const templateHasBudgetOverride = Boolean(activeSceneTemplate && budgetLabel !== templateBudgetLabel)
  const templateHasFormalityOverride = Boolean(activeSceneTemplate && formalityLabel !== templateFormalityLabel)
  const advancedAudienceFacts = useMemo(
    () =>
      [
        isZh ? `年龄 ${ageBandLabel}` : `Age ${ageBandLabel}`,
        isZh ? `职业 ${occupationLabel}` : `Occupation ${occupationLabel}`,
        isZh ? `关系 ${relationshipLabel}` : `Relationship ${relationshipLabel}`,
        isZh ? `预算 ${budgetLabel}` : `Budget ${budgetLabel}`,
        isZh ? `正式度 ${formalityLabel}` : `Formality ${formalityLabel}`,
      ],
    [ageBandLabel, budgetLabel, formalityLabel, isZh, occupationLabel, relationshipLabel],
  )
  const favoriteGiftChecklist = useMemo(() => {
    const latestById = new Map<string, { id: string; name: string; category: string }>()

    for (const record of historyRecords) {
      for (const item of record.recommendations) {
        if (!latestById.has(item.id)) {
          latestById.set(item.id, item)
        }
      }
    }

    return favoriteRecommendationIds
      .map(id => latestById.get(id))
      .filter((item): item is { id: string; name: string; category: string } => Boolean(item))
  }, [favoriteRecommendationIds, historyRecords])
  const enhancementOriginOptions = useMemo(
    () => [
      { value: 'CN', label: isZh ? '中国大陆发货' : 'Ship from China' },
      { value: 'US', label: isZh ? '美国发货' : 'Ship from United States' },
      { value: 'JP', label: isZh ? '日本发货' : 'Ship from Japan' },
    ],
    [isZh],
  )
  const hasEnabledAnalysisEnhancement = useMemo(
    () => Object.values(analysisEnhancementSettings).some(Boolean),
    [analysisEnhancementSettings],
  )
  const hasAnalysisEnhancementResults = useMemo(
    () =>
      Boolean(
        analysisEnhancements?.p1?.multimodalResults ||
          (analysisEnhancements?.p1?.collaborativeResults?.length ?? 0) > 0 ||
          analysisEnhancements?.p1?.logisticsEstimate ||
          (analysisEnhancements?.p1?.packingRecommendations?.general.length ?? 0) > 0 ||
          (analysisEnhancements?.p2?.wideDeepResults?.length ?? 0) > 0 ||
          (analysisEnhancements?.p2?.culturalImpactScores &&
            Object.keys(analysisEnhancements.p2.culturalImpactScores).length > 0) ||
          analysisEnhancements?.localizedOutput?.formattedRecommendations,
      ),
    [analysisEnhancements],
  )
  const riskActionMeta = useMemo(() => (analysis ? getRiskActionMeta(analysis.riskLevel, locale) : null), [analysis, locale])
  const profileFieldClassName =
    'rounded-2xl border border-cyan-200/14 bg-[#10253f]/62 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]'
  const profileLabelClassName = 'text-[11px] uppercase tracking-[0.14em] text-slate-400'
  const profileControlClassName =
    'mt-3 w-full rounded-xl border border-cyan-200/18 bg-[#0b1c31] px-3 py-3 text-sm text-slate-100 transition focus:border-cyan-200/45 focus:outline-none'

  const impactCards = useMemo(
    () =>
      isZh
        ? [
            {
              id: 'risk-first',
              icon: <ShieldCheck size={18} />,
              badge: 'RISK INTELLIGENCE',
              title: '先看风险再出手',
              desc: '把高敏感语义、颜色禁忌、数字禁忌做成可视化层叠洞察，第一眼就知道哪里会踩雷。',
              metric: '128+ 风险语义样本',
              chips: ['颜色禁忌', '语义联想', '数字避雷'],
              skin: 'from-[#19344f] via-[#153149] to-[#10263e]',
              glow: 'from-cyan-300/45 via-sky-300/20 to-transparent',
            },
            {
              id: 'audience-tuned',
              icon: <Brain size={18} />,
              badge: 'CONTEXT ENGINE',
              title: '面向真实收礼人画像',
              desc: '同样是礼物，给客户、同事、长辈的语气和包装逻辑完全不同，系统会按对象重排建议优先级。',
              metric: '3 层画像上下文联动',
              chips: ['对象语气', '场景正式度', '预算层级'],
              skin: 'from-[#1d2f53] via-[#1b2b4a] to-[#15223d]',
              glow: 'from-emerald-300/40 via-cyan-300/15 to-transparent',
            },
            {
              id: 'delivery-ready',
              icon: <ShoppingBag size={18} />,
              badge: 'DELIVERY READY',
              title: '建议可直接落地交付',
              desc: '不是抽象建议，而是可执行的包装色、材质、贺卡语句组合，拿到就能直接用在实际赠礼流程。',
              metric: '1 次输出覆盖全流程',
              chips: ['包装方向', '贺卡文案', '替代方案'],
              skin: 'from-[#202f57] via-[#1a2f4e] to-[#132842]',
              glow: 'from-amber-300/40 via-cyan-300/18 to-transparent',
            },
            {
              id: 'execution-timing',
              icon: <Zap size={18} />,
              badge: 'EXECUTION TIMING',
              title: '时机与表达同样关键',
              desc: '同一礼物在不同节日、不同商务阶段的体感差异很大，建议会同步给出更稳妥的送礼窗口与表达方式。',
              metric: '节日与场景双维建议',
              chips: ['送礼时机', '表达分寸', '场景匹配'],
              skin: 'from-[#1f345d] via-[#1c2f53] to-[#152744]',
              glow: 'from-sky-300/35 via-cyan-300/16 to-transparent',
            },
            {
              id: 'global-tone',
              icon: <Globe2 size={18} />,
              badge: 'GLOBAL EXPRESSION',
              title: '跨文化表达有温度',
              desc: '在尊重本地文化边界的前提下，保留品牌风格，让“专业感”和“人情味”同时在线。',
              metric: '5 大区域文化语境',
              chips: ['品牌一致性', '本地化表达', '文化边界'],
              skin: 'from-[#24335d] via-[#1b3553] to-[#152a46]',
              glow: 'from-violet-300/35 via-cyan-300/14 to-transparent',
            },
          ]
        : [
            {
              id: 'risk-first',
              icon: <ShieldCheck size={18} />,
              badge: 'RISK INTELLIGENCE',
              title: 'See risk before you send',
              desc: 'Surface semantic, color, and number sensitivities as layered visual signals so risky choices stand out instantly.',
              metric: '128+ semantic risk patterns',
              chips: ['Color taboo', 'Semantic cues', 'Number risk'],
              skin: 'from-[#19344f] via-[#153149] to-[#10263e]',
              glow: 'from-cyan-300/45 via-sky-300/20 to-transparent',
            },
            {
              id: 'audience-tuned',
              icon: <Brain size={18} />,
              badge: 'CONTEXT ENGINE',
              title: 'Tune to real recipient context',
              desc: 'Client, colleague, or family requires different tone and packaging logic. The system reprioritizes recommendations by profile.',
              metric: '3-layer audience context',
              chips: ['Tone strategy', 'Formality level', 'Budget tier'],
              skin: 'from-[#1d2f53] via-[#1b2b4a] to-[#15223d]',
              glow: 'from-emerald-300/40 via-cyan-300/15 to-transparent',
            },
            {
              id: 'delivery-ready',
              icon: <ShoppingBag size={18} />,
              badge: 'DELIVERY READY',
              title: 'Advice that ships immediately',
              desc: 'Outputs are execution-ready combinations of packaging palette, material direction, and card wording for real delivery workflows.',
              metric: 'One output, full workflow',
              chips: ['Packaging direction', 'Card copy', 'Rescue option'],
              skin: 'from-[#202f57] via-[#1a2f4e] to-[#132842]',
              glow: 'from-amber-300/40 via-cyan-300/18 to-transparent',
            },
            {
              id: 'execution-timing',
              icon: <Zap size={18} />,
              badge: 'EXECUTION TIMING',
              title: 'Timing matters as much as the gift',
              desc: 'The same item can land very differently by occasion or relationship stage, so guidance includes safer timing and delivery tone.',
              metric: 'Holiday + context timing guide',
              chips: ['Send timing', 'Delivery tone', 'Occasion fit'],
              skin: 'from-[#1f345d] via-[#1c2f53] to-[#152744]',
              glow: 'from-sky-300/35 via-cyan-300/16 to-transparent',
            },
            {
              id: 'global-tone',
              icon: <Globe2 size={18} />,
              badge: 'GLOBAL EXPRESSION',
              title: 'Premium tone across cultures',
              desc: 'Keep brand consistency while adapting to local cultural boundaries so professional intent still feels warm and human.',
              metric: '5 regional cultural contexts',
              chips: ['Brand consistency', 'Local expression', 'Cultural boundary'],
              skin: 'from-[#24335d] via-[#1b3553] to-[#152a46]',
              glow: 'from-violet-300/35 via-cyan-300/14 to-transparent',
            },
          ],
    [isZh],
  )

  const shiftImpactCard = (delta: 1 | -1) => {
    setActiveImpactCard(prev => (prev + delta + impactCards.length) % impactCards.length)
  }

  const jumpImpactCard = (index: number) => {
    if (index === activeImpactCard) {
      return
    }

    setActiveImpactCard(index)
  }

  const getImpactCardOffset = (index: number) => {
    const total = impactCards.length
    const half = Math.floor(total / 2)

    return ((index - activeImpactCard + total + half) % total) - half
  }

  React.useEffect(() => {
    setActiveImpactCard(0)
  }, [locale])

  React.useEffect(() => {
    if (isImpactPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveImpactCard(prev => (prev + 1) % impactCards.length)
    }, 4600)

    return () => window.clearInterval(timer)
  }, [impactCards.length, isImpactPaused])

  const handleEnterFlow = () => {
    workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  // Workflow progress
  const workflowSteps = [
    {
      id: 1,
      label: t('workflow.steps.recognize'),
      icon: <Image src={withBasePath('/brand/step-vision.svg')} alt="vision" width={22} height={22} />,
      status: (recognition || hasGiftInput ? 'completed' : 'current') as 'completed' | 'current' | 'pending',
    },
    {
      id: 2,
      label: t('workflow.steps.country'),
      icon: <Image src={withBasePath('/brand/step-country.svg')} alt="country" width={22} height={22} />,
      status: (selectedCountry ? 'completed' : recognition || hasGiftInput ? 'current' : 'pending') as
        | 'completed'
        | 'current'
        | 'pending',
    },
    {
      id: 3,
      label: t('workflow.steps.analyze'),
      icon: <Image src={withBasePath('/brand/step-analysis.svg')} alt="analysis" width={22} height={22} />,
      status: (analysis ? 'completed' : selectedCountry ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
    },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setRecognition(null)
    setRecognitionSource(null)
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setAnalysis(null)

    const reader = new FileReader()
    reader.onload = e => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearSelectedImage = () => {
    setSelectedFile(null)
    setImagePreview('')
    setRecognition(null)
    setRecognitionSource(null)
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setAnalysis(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSceneTemplateChange = (nextScene: string) => {
    const template = getSceneTemplate(nextScene)
    setSceneTemplate(nextScene)

    if (template) {
      setTargetGroup(template.audienceGroup as AudienceGroup)
      if (template.audienceGroup !== 'other') {
        setCustomAudienceGroup('')
      }
      setBudgetRange(template.defaultBudgetRange)
      setFormality(template.defaultFormality)
      setOccasion(template.defaultOccasion)
    }

    setAnalysis(null)
  }

  const isSupportedRecognitionSource = (value: unknown): value is RecognitionSource =>
    value === 'aliyun-dashscope' ||
    value === 'aliyun-dashscope-text' ||
    value === 'local-fallback' ||
    value === 'local-fallback-text'

  const shortenText = (value: string, maxLength: number) => {
    if (value.length <= maxLength) {
      return value
    }

    return `${value.slice(0, Math.max(0, maxLength - 3))}...`
  }

  const isLikelyStructuredText = (value: string) => {
    const compact = value.trim()

    if (!compact) {
      return false
    }

    if ((compact.startsWith('{') && compact.endsWith('}')) || (compact.startsWith('[') && compact.endsWith(']'))) {
      return true
    }

    return compact.includes('"label"') || compact.includes('"description"')
  }

  const extractJsonRecord = (value: string): Record<string, unknown> | null => {
    const compact = value.trim()

    if (!compact) {
      return null
    }

    try {
      const direct = JSON.parse(compact)
      return typeof direct === 'object' && direct !== null ? (direct as Record<string, unknown>) : null
    } catch {
      const start = compact.indexOf('{')
      const end = compact.lastIndexOf('}')

      if (start === -1 || end === -1 || end <= start) {
        return null
      }

      try {
        const sliced = JSON.parse(compact.slice(start, end + 1))
        return typeof sliced === 'object' && sliced !== null ? (sliced as Record<string, unknown>) : null
      } catch {
        return null
      }
    }
  }

  const pickStringField = (record: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
      const value = record[key]

      if (typeof value === 'string' && value.trim()) {
        return value.trim()
      }
    }

    return ''
  }

  const normalizeDetectedLabel = (raw: string, fallback: string) => {
    const compact = raw.trim()
    const parsed = extractJsonRecord(compact)

    if (parsed) {
      const parsedLabel = pickStringField(parsed, ['label', 'name', 'item', 'item_name'])
      if (parsedLabel) {
        return shortenText(parsedLabel, 60)
      }
    }

    if (compact && !isLikelyStructuredText(compact)) {
      return shortenText(compact, 60)
    }

    return shortenText(fallback.trim(), 60)
  }

  const normalizeDescription = (raw: string, fallback: string) => {
    const compact = raw.trim()
    const fallbackText = fallback.trim()

    if (!compact) {
      return shortenText(fallbackText, 240)
    }

    const parsed = extractJsonRecord(compact)
    if (parsed) {
      const direct = pickStringField(parsed, ['description', 'gift_description', 'item_description', 'summary', 'desc'])
      if (direct) {
        return shortenText(direct, 240)
      }

      const giftNode = parsed.gift
      if (typeof giftNode === 'object' && giftNode !== null) {
        const nested = pickStringField(giftNode as Record<string, unknown>, [
          'description',
          'gift_description',
          'item_description',
          'summary',
          'desc',
        ])

        if (nested) {
          return shortenText(nested, 240)
        }
      }
    }

    if (isLikelyStructuredText(compact)) {
      return shortenText(fallbackText, 240)
    }

    return shortenText(compact, 240)
  }

  const normalizeForCompare = (value: string) =>
    value
      .toLowerCase()
      .replace(/[\s,，。.!！?？;；:：、'"“”‘’\-_/\\()[\]{}<>《》]/g, '')
      .trim()

  const isDuplicateDescription = (primary: string, secondary: string) => {
    const normalizedPrimary = normalizeForCompare(primary)
    const normalizedSecondary = normalizeForCompare(secondary)

    if (!normalizedPrimary || !normalizedSecondary) {
      return false
    }

    if (normalizedPrimary === normalizedSecondary) {
      return true
    }

    const longer =
      normalizedPrimary.length >= normalizedSecondary.length ? normalizedPrimary : normalizedSecondary
    const shorter = longer === normalizedPrimary ? normalizedSecondary : normalizedPrimary

    return shorter.length >= 8 && longer.includes(shorter)
  }

  const beautifyDescriptionText = (raw: string) => {
    const compact = normalizeDescription(raw, '')

    if (!compact) {
      return ''
    }

    const chunks = compact
      .split(/[，,。.!！?？;；、\n]+/)
      .map(item => item.trim())
      .filter(Boolean)

    if (chunks.length === 0) {
      return ''
    }

    const dedupedChunks: string[] = []
    chunks.forEach(chunk => {
      const duplicated = dedupedChunks.some(existing => isDuplicateDescription(existing, chunk))
      if (!duplicated) {
        dedupedChunks.push(chunk)
      }
    })

    const merged = isZh ? dedupedChunks.join('，') : dedupedChunks.join(', ')
    const punctuated = /[。.!！?？]$/.test(merged) ? merged : `${merged}${isZh ? '。' : '.'}`

    return shortenText(punctuated, 240)
  }

  const normalizeRawLabels = (labels: string[]) =>
    labels
      .map(item => item.trim())
      .filter(item => item.length > 0 && !isLikelyStructuredText(item))
      .map(item => shortenText(item, 60))
      .slice(0, 6)

  const handleBeautifyGiftDescription = () => {
    const polished = beautifyDescriptionText(giftDescription)

    if (!polished || polished === giftDescription.trim()) {
      return
    }

    setGiftDescription(polished)
    setAnalysis(null)
  }

  const handleBeautifyVisionDescription = () => {
    const polished = beautifyDescriptionText(visionDescription)

    if (polished === visionDescription.trim()) {
      return
    }

    setVisionDescription(polished)
    setAnalysis(null)
  }

  const parseRecognitionPayload = async (response: Response): Promise<{
    recognition: RecognitionResult
    source: RecognitionSource
    description: string
    detectedLabel: string
    rawLabels: string[]
  }> => {
    const data = (await response.json().catch(() => ({}))) as RecognitionResponsePayload

    if (!response.ok) {
      throw new Error(
        typeof data.error === 'string'
          ? data.error
          : isZh
            ? '识别失败，请稍后再试。'
            : 'Recognition failed. Please try again.',
      )
    }

    if (!isSupportedRecognitionSource(data.source) || !data.recognition) {
      throw new Error(isZh ? '识别结果格式异常' : 'Invalid recognition response')
    }

    const fallbackLabel = isZh ? data.recognition.itemZh : data.recognition.itemEn
    const normalizedDescription = normalizeDescription(
      typeof data.description === 'string' ? data.description : '',
      '',
    )
    const normalizedDetectedLabel = normalizeDetectedLabel(
      typeof data.detectedLabel === 'string' ? data.detectedLabel : '',
      fallbackLabel,
    )

    const sourceRawLabels = Array.isArray(data.rawLabels)
      ? data.rawLabels.filter((item): item is string => typeof item === 'string')
      : []
    const normalizedRawLabels = normalizeRawLabels(sourceRawLabels)
    const mergedRawLabels = normalizedRawLabels.length > 0 ? normalizedRawLabels : normalizeRawLabels([normalizedDetectedLabel])

    return {
      recognition: data.recognition,
      source: data.source,
      description: normalizedDescription,
      detectedLabel: normalizedDetectedLabel,
      rawLabels: mergedRawLabels,
    }
  }

  const applyRecognitionPayload = (payload: {
    recognition: RecognitionResult
    source: RecognitionSource
    description: string
    detectedLabel: string
    rawLabels: string[]
  }) => {
    const polishedDescription = beautifyDescriptionText(payload.description)

    setRecognition(payload.recognition)
    setRecognitionSource(payload.source)
    if (!giftDescription.trim() && polishedDescription) {
      setGiftDescription(polishedDescription)
    }
    setVisionDescription(polishedDescription)
    setVisionLabel(payload.detectedLabel)
    setRecognitionRawLabels(payload.rawLabels)

    if (!giftName.trim()) {
      setGiftName(isZh ? payload.recognition.itemZh : payload.recognition.itemEn)
    }
  }

  const recognizeByText = async (): Promise<{
    recognition: RecognitionResult
    source: RecognitionSource
    description: string
    detectedLabel: string
    rawLabels: string[]
  }> => {
    const text = [giftName.trim(), giftDescription.trim()].filter(Boolean).join(' ').trim()

    const response = await fetch('/api/vision-recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        name: giftName.trim(),
        description: giftDescription.trim(),
        language: apiLanguage,
      }),
    })

    return parseRecognitionPayload(response)
  }

  const recognizeByImage = async (): Promise<{
    recognition: RecognitionResult
    source: RecognitionSource
    description: string
    detectedLabel: string
    rawLabels: string[]
  }> => {
    if (!selectedFile) {
      throw new Error(isZh ? '请先上传礼物图片' : 'Please upload a gift image first')
    }

    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('language', apiLanguage)

    const response = await fetch('/api/vision-recognize', {
      method: 'POST',
      body: formData,
    })

    return parseRecognitionPayload(response)
  }

  const handleRecognize = async () => {
    if (!selectedFile && !hasGiftInput) {
      setError(isZh ? '请上传图片或输入礼物名称后再识别' : 'Upload an image or enter gift info first')
      return
    }

    setIsRecognizing(true)
    setError('')

    try {
      const payload = selectedFile ? await recognizeByImage() : await recognizeByText()
      applyRecognitionPayload(payload)
      if (selectedFile) {
        setShowGiftInputsAfterImageRecognition(false)
      }
      setAnalysis(null)
    } catch (err) {
      setError((err as Error).message || t('errors.recognitionFailed'))
    } finally {
      setIsRecognizing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedCountry) {
      setError(isZh ? '请先选择目标国家' : 'Please select a target country first')
      return
    }

    if (!recognition && !hasGiftInput && !selectedFile) {
      setError(isZh ? '请先上传图片或输入礼物信息' : 'Upload an image or enter gift info first')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysisEnhancements(null)

    try {
      let recognitionForAnalysis = recognition
      let recognitionDescription = visionDescription
      let detectedLabel = visionLabel
      let rawLabels = recognitionRawLabels
      let source = recognitionSource

      if (!recognitionForAnalysis && selectedFile) {
        try {
          const imageRecognition = await recognizeByImage()
          applyRecognitionPayload(imageRecognition)
          recognitionForAnalysis = imageRecognition.recognition
          recognitionDescription = imageRecognition.description
          detectedLabel = imageRecognition.detectedLabel
          rawLabels = imageRecognition.rawLabels
          source = imageRecognition.source
        } catch (imageError) {
          if (!hasGiftInput) {
            throw imageError
          }
        }
      }

      if (!recognitionForAnalysis && hasGiftInput) {
        const textRecognition = await recognizeByText()
        applyRecognitionPayload(textRecognition)
        recognitionForAnalysis = textRecognition.recognition
        recognitionDescription = textRecognition.description
        detectedLabel = textRecognition.detectedLabel
        rawLabels = textRecognition.rawLabels
        source = textRecognition.source
      }

      const polishedGiftDescription = beautifyDescriptionText(giftDescription)
      const polishedVisionDescription = beautifyDescriptionText(recognitionDescription)
      const mergedDescription = polishedVisionDescription || polishedGiftDescription

      if (giftDescription.trim() !== polishedGiftDescription && polishedGiftDescription) {
        setGiftDescription(polishedGiftDescription)
      }

      if (visionDescription.trim() !== polishedVisionDescription) {
        setVisionDescription(polishedVisionDescription)
      }

      const response = await fetch('/api/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: normalizeEnhancementCountryCode(selectedCountry),
          recognition: recognitionForAnalysis,
          giftContext: {
            name: giftName.trim(),
            description: mergedDescription,
            visionDescription: polishedVisionDescription,
            visionLabel: detectedLabel,
            source,
            rawLabels,
          },
          country: getCountryName(selectedCountry, 'en'),
          audience: {
            group: targetGroup === 'other' ? customAudienceGroup.trim() || 'other' : targetGroup,
            customGroup: customAudienceGroup.trim(),
            sceneTemplate,
            ageBand,
            gender,
            occupation,
            relationship,
            occasion: occasion.trim(),
            purpose: getSceneTemplate(sceneTemplate)?.defaultPurpose ?? '',
            budgetRange,
            formality,
            notes: targetProfile.trim(),
          },
          locale: apiLanguage,
          enhancements: hasEnabledAnalysisEnhancement
            ? {
                multimodal: analysisEnhancementSettings.multimodal,
                collaborativeFiltering: analysisEnhancementSettings.collaborativeFiltering,
                logistics: analysisEnhancementSettings.logistics,
                wideDeep: analysisEnhancementSettings.wideDeep,
                knowledgeGraph: analysisEnhancementSettings.knowledgeGraph,
                shippingCountry: enhancementOriginCountry,
                budget: budgetRangeToAmount(budgetRange),
              }
            : undefined,
        }),
      })

      const data = await response.json().catch(() => ({ error: t('errors.analysisFailed') }))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : t('errors.analysisFailed'))
      }

      if (typeof data.source !== 'string' || !data.source.trim()) {
        throw new Error(typeof data.error === 'string' ? data.error : t('errors.analysisFailed'))
      }

      const normalizedAnalysis = normalizeAnalysisResult(data.analysis)
      setAnalysis(normalizedAnalysis)
      setAnalysisEnhancements(normalizeAnalysisEnhancements(data.enhancements))
      setAnalysisSource(typeof data.source === 'string' ? data.source : '')

      const record: StoredAnalysisRecord = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        locale,
        countryCode: selectedCountry,
        countryName: getCountryName(selectedCountry, locale),
        giftName: giftName.trim() || normalizedAnalysis.giftProfile.displayName || (locale === 'zh' ? '未命名礼物' : 'Unnamed gift'),
        riskScore: normalizedAnalysis.riskScore,
        riskLevel: normalizedAnalysis.riskLevel,
        audienceLabel: selectedAudienceLabel,
        recommendations: normalizedAnalysis.recommendations.map(item => ({
          id: item.id,
          name: locale === 'zh' ? item.nameZh : item.nameEn,
          category: item.category,
        })),
      }
      saveAnalysisRecord(record)
      setHistoryRecords(loadAnalysisHistory())
    } catch (err) {
      setError((err as Error).message || t('errors.analysisFailed'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setRecognition(null)
    setRecognitionSource(null)
    setSelectedCountry('')
    setTargetGroup('peer')
    setCustomAudienceGroup('')
    setSceneTemplate('birthday')
    setAgeBand('adult')
    setGender('neutral')
    setOccupation('office')
    setRelationship('friend')
    setBudgetRange('medium')
    setFormality('semi-formal')
    setOccasion('')
    setTargetProfile('')
    setAnalysis(null)
    setAnalysisEnhancements(null)
    setAnalysisSource('')
    setSelectedFile(null)
    setImagePreview('')
    setGiftName('')
    setGiftDescription('')
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setShowAdvancedAudienceFields(false)
    setAssistantResult(null)
    setAssistantError('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLanguageSwitch = (newLocale: Locale) => {
    setLocale(newLocale)
    router.push(`/${newLocale}`)
  }

  const handleToggleFavoriteRecommendation = (id: string) => {
    setFavoriteRecommendationIds(toggleFavoriteRecommendation(id))
  }

  const handleRunLogisticsAssistant = async () => {
    if (!selectedCountry) {
      setAssistantError(isZh ? '请先选择目标国家后再估算物流。' : 'Select a target country before estimating shipping.')
      return
    }

    const amount = Number.parseFloat(assistantAmountInput)
    const weight = Number.parseFloat(assistantWeightInput)
    const declared = Number.parseFloat(assistantDeclaredValueInput)

    if (!Number.isFinite(amount) || amount <= 0) {
      setAssistantError(isZh ? '请输入有效的礼物价格。' : 'Please enter a valid gift price.')
      return
    }

    setIsAssistantLoading(true)
    setAssistantError('')

    try {
      const response = await fetch('/api/logistics-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          fromCurrency: assistantCurrency,
          targetCurrencies: ['USD', 'CNY', 'EUR', 'JPY', 'GBP'],
          destinationCountry: getCountryName(selectedCountry, 'en'),
          weightKg: Number.isFinite(weight) ? weight : 1,
          declaredValue: Number.isFinite(declared) ? declared : amount,
        }),
      })

      const data = (await response.json().catch(() => null)) as LogisticsAssistantResult | { error?: string } | null

      if (!response.ok || !data || !('shippingQuotes' in data)) {
        const fallbackMessage = isZh ? '物流助手请求失败，请稍后重试。' : 'Failed to load logistics assistant data.'
        throw new Error(data && 'error' in data && typeof data.error === 'string' ? data.error : fallbackMessage)
      }

      setAssistantResult(data)
    } catch (assistantRequestError) {
      setAssistantError((assistantRequestError as Error).message)
    } finally {
      setIsAssistantLoading(false)
    }
  }

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-[#061225] text-white ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_84%_22%,rgba(45,212,191,0.12),transparent_34%),radial-gradient(circle_at_50%_84%,rgba(14,165,233,0.08),transparent_44%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-size:1320px_auto,980px_auto] [background-position:center_6%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-12 [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.11)_0_1px,transparent_1px_58px),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_52px)]" />

      <header className="sticky top-0 z-40 border-b border-cyan-200/15 bg-[#0c1b33]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 xl:px-8">
          <div className="flex items-center gap-3">
            <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA logo mark" width={44} height={44} priority />
            <div className="leading-none">
              <p className="text-[1.55rem] font-semibold tracking-[0.18em] text-slate-100">GIVIA</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-300/90">
                {isZh ? 'Global AI Gifting System' : 'Global AI Gifting System'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { value: 'zh' as const, label: '中文' },
              { value: 'en' as const, label: 'English' },
              { value: 'ja' as const, label: '日本語' },
              { value: 'fr' as const, label: 'Français' },
            ]).map(languageOption => (
              <button
                key={languageOption.value}
                onClick={() => handleLanguageSwitch(languageOption.value)}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${
                  locale === languageOption.value
                    ? 'border border-amber-200/45 bg-amber-100/12 text-amber-100'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                {languageOption.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1480px] px-5 py-12 xl:px-8">
        <section className="mb-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[2rem] border border-cyan-100/18 bg-gradient-to-br from-[#10233f]/90 via-[#11253f]/84 to-[#182a43]/80 p-8 shadow-[0_30px_90px_rgba(6,14,28,0.52)] backdrop-blur-xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100/25 bg-cyan-100/8 px-3 py-1 text-xs tracking-[0.14em] text-cyan-50/95">
              <Globe2 size={14} /> {t('hero.badge')}
            </p>

            <h1
              className={`max-w-[11.5em] bg-gradient-to-r from-slate-50 via-slate-100 to-cyan-100 bg-clip-text text-3xl leading-[1.08] text-transparent md:text-[3.35rem] md:leading-[1.06] ${
                isZh
                  ? 'font-sans-zh font-semibold tracking-[-0.02em]'
                  : 'font-semibold tracking-[-0.02em] [font-family:var(--app-font-sans)]'
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">让每一份礼物</span>
                  <span className="block text-cyan-100">都能跨文化被理解</span>
                </>
              ) : (
                <>
                  <span className="block">Gift with cultural clarity,</span>
                  <span className="block text-cyan-100">not cross-border guesswork.</span>
                </>
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/95">{t('hero.description')}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-200">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-500/14 px-3 py-1">
                <ShieldCheck size={14} /> {t('hero.trust1')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/40 bg-sky-500/14 px-3 py-1">
                <ShoppingBag size={14} /> {t('hero.trust2')}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-200/90">
              {['Tokyo', 'Dubai', 'Paris', 'Sao Paulo', 'Singapore'].map(city => (
                <motion.span
                  key={city}
                  whileHover={{ y: -2, scale: 1.04 }}
                  className="rounded-full border border-slate-300/18 bg-slate-100/8 px-3 py-1"
                >
                  {city}
                </motion.span>
              ))}
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterFlow}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-cyan-300/12 px-5 py-2.5 text-sm font-semibold text-cyan-50 hover:bg-cyan-300/20"
            >
              {isZh ? '立即进入分析流程' : 'Start the flow now'} <ArrowRight size={15} />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-[#10233f]/90 via-[#11263f]/84 to-[#162a44]/82 p-6 shadow-[0_28px_70px_rgba(6,14,28,0.56)]"
          >
            <p className="relative text-xs uppercase tracking-[0.22em] text-sky-100/80">{t('hero.panelTitle')}</p>
            <h2 className={`relative mt-3 text-2xl text-slate-100 ${isZh ? 'font-sans-zh font-semibold tracking-tight' : 'font-semibold tracking-tight [font-family:var(--app-font-sans)]'}`}>{t('hero.panelHeadline')}</h2>
            <p className="relative mt-3 text-sm leading-7 text-slate-300">{t('hero.panelDesc')}</p>

            <InteractiveFlowDemo locale={apiLanguage} />
          </motion.div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">CULTURAL GIFT INSIGHTS</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100 md:text-3xl">
                {isZh ? '送礼的四个关键能力' : 'Four core capabilities for gifting'}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                {isZh
                  ? '从风险识别、受礼人理解、到落地方案和时机把控，每个环节都决定了礼物的表达效果。'
                  : 'From identifying cultural risks and understanding your recipient, to crafting the right gift and timing it perfectly—every step matters.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftImpactCard(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/28 bg-slate-800/55 text-cyan-100 transition hover:border-cyan-100/50 hover:bg-slate-700/65"
                aria-label={isZh ? '上一张' : 'Previous'}
              >
                <ChevronLeft size={18} />
              </button>
              {impactCards.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => jumpImpactCard(idx)}
                  onFocus={() => jumpImpactCard(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeImpactCard ? 'w-9 bg-cyan-200' : 'w-2.5 bg-slate-500/70 hover:bg-slate-300/80'
                  }`}
                  aria-label={isZh ? `查看卡片 ${idx + 1}` : `View card ${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => shiftImpactCard(1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/28 bg-slate-800/55 text-cyan-100 transition hover:border-cyan-100/50 hover:bg-slate-700/65"
                aria-label={isZh ? '下一张' : 'Next'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            className="relative h-[24.8rem] overflow-visible md:h-[26.4rem]"
            onMouseEnter={() => setIsImpactPaused(true)}
            onMouseLeave={() => setIsImpactPaused(false)}
          >
            {impactCards.map((card, idx) => {
              const offset = getImpactCardOffset(idx)
              const depth = Math.abs(offset)
              const isVisibleLayer = depth <= 2
              const side = offset < 0 ? -1 : 1

              return (
                <motion.article
                  key={card.id}
                  initial={false}
                  animate={{
                    x: isVisibleLayer ? offset * 110 : side * 620,
                    y: depth === 0 ? 0 : depth === 1 ? 14 : isVisibleLayer ? 26 : 38,
                    scale: depth === 0 ? 1 : depth === 1 ? 0.9 : isVisibleLayer ? 0.82 : 0.76,
                    rotate: isVisibleLayer ? offset * 2.2 : side * 6,
                    opacity: depth === 0 ? 1 : depth === 1 ? 0.62 : isVisibleLayer ? 0.36 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                  onClick={() => jumpImpactCard(idx)}
                  className={`absolute left-1/2 top-2 h-[22.2rem] w-[88%] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-cyan-100/18 bg-gradient-to-br ${card.skin} p-6 md:top-3 md:h-[23.8rem] md:w-[76%] md:p-8 ${isVisibleLayer ? 'cursor-pointer' : 'pointer-events-none'}`}
                  style={{ zIndex: depth === 0 ? 100 : depth === 1 ? 80 : isVisibleLayer ? 60 : 1 }}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-70`} />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100/30 bg-cyan-100/10 px-3 py-1 text-[11px] tracking-[0.18em] text-cyan-50/95">
                        {card.icon} {card.badge}
                      </span>
                      <span className="text-xs tracking-[0.16em] text-slate-300/85">0{idx + 1}</span>
                    </div>

                    <h4 className="mt-5 max-w-[18em] text-[2rem] font-semibold leading-[1.08] text-slate-50 md:text-[2.25rem]">
                      {card.title}
                    </h4>
                    <p className="mt-4 max-w-[44rem] text-sm leading-7 text-slate-200/95 md:text-base">
                      {card.desc}
                    </p>

                    <div className="mt-auto flex flex-col gap-4 pt-8 md:flex-row md:items-end md:justify-between">
                      <div className="flex flex-wrap gap-2">
                        {card.chips.map(chip => (
                          <span
                            key={chip}
                            className="rounded-full border border-slate-100/24 bg-slate-100/10 px-3 py-1 text-xs text-slate-100"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div className="rounded-xl border border-cyan-100/25 bg-[#0d1a30]/55 px-4 py-2 text-right md:min-w-52">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/75">
                          {isZh ? '关键指标' : 'Key metric'}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-cyan-50 md:text-base">{card.metric}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </section>

        {/* Workflow progress */}
        <div ref={workflowRef} className="mb-12 rounded-2xl">
          <WorkflowProgress steps={workflowSteps} />
        </div>

        {/* Three-step workflow panels */}
        <div className="mb-8 grid gap-4 sm:gap-6 lg:mb-10 xl:grid-cols-12 xl:items-start">
          <div className="space-y-4 sm:space-y-6 xl:col-span-5">
          <StepGiftInput
            locale={locale}
            recognition={recognition}
            recognitionSource={recognitionSource}
            imagePreview={imagePreview}
            selectedFile={selectedFile}
            fileInputRef={fileInputRef}
            shouldHideGiftInputs={shouldHideGiftInputs}
            giftName={giftName}
            giftDescription={giftDescription}
            giftDescriptionRef={giftDescriptionRef}
            visionLabel={visionLabel}
            visionDescription={visionDescription}
            visionDescriptionRef={visionDescriptionRef}
            canRecognize={canRecognize}
            isRecognizing={isRecognizing}
            isTextOnlyRecognition={isTextOnlyRecognition}
            recognizingElapsedSeconds={recognizingElapsedSeconds}
            onFileSelect={handleFileSelect}
            onClearSelectedImage={clearSelectedImage}
            onToggleTextEditor={() => setShowGiftInputsAfterImageRecognition(prev => !prev)}
            onGiftNameChange={value => {
              setGiftName(value)
              setAnalysis(null)
            }}
            onGiftDescriptionChange={value => {
              setGiftDescription(value)
              setAnalysis(null)
            }}
            onVisionLabelChange={value => {
              setVisionLabel(value)
              setAnalysis(null)
            }}
            onVisionDescriptionChange={value => {
              setVisionDescription(value)
              setAnalysis(null)
            }}
            onBeautifyGiftDescription={handleBeautifyGiftDescription}
            onBeautifyVisionDescription={handleBeautifyVisionDescription}
            onRecognize={handleRecognize}
            autoResizeTextarea={autoResizeTextarea}
          />

          <StepAnalysis
            locale={locale}
            t={t}
            selectedCountry={selectedCountry}
            recognition={recognition}
            hasGiftInput={hasGiftInput}
            selectedFile={selectedFile}
            selectedAudienceLabel={selectedAudienceLabel}
            activeSceneTemplate={activeSceneTemplate}
            hasEnabledAnalysisEnhancement={hasEnabledAnalysisEnhancement}
            analysisEnhancementSettings={analysisEnhancementSettings}
            enhancementOriginCountry={enhancementOriginCountry}
            enhancementOriginOptions={enhancementOriginOptions}
            canAnalyze={canAnalyze}
            hasAnalysis={Boolean(analysis)}
            isAnalyzing={isAnalyzing}
            analyzingElapsedSeconds={analyzingElapsedSeconds}
            isAudienceReady={isAudienceReady}
            giftName={giftName}
            onEnhancementSettingChange={(key, checked) =>
              setAnalysisEnhancementSettings(current => ({
                ...current,
                [key]: checked,
              }))
            }
            onEnhancementOriginCountryChange={setEnhancementOriginCountry}
            onAnalyze={handleAnalyze}
          />

          </div>

          <div className="space-y-4 sm:space-y-6 xl:col-span-7">
          <StepCountry
            locale={locale}
            t={t}
            apiLanguage={apiLanguage}
            selectedCountry={selectedCountry}
            recognition={recognition}
            hasGiftInput={hasGiftInput}
            selectedFile={selectedFile}
            activeSceneTemplate={activeSceneTemplate}
            sceneTemplate={sceneTemplate}
            sceneTemplateOptions={sceneTemplateOptions}
            selectedAudienceLabel={selectedAudienceLabel}
            budgetLabel={budgetLabel}
            formalityLabel={formalityLabel}
            templateHasAudienceOverride={templateHasAudienceOverride}
            templateHasBudgetOverride={templateHasBudgetOverride}
            templateHasFormalityOverride={templateHasFormalityOverride}
            audienceOptions={audienceOptions}
            targetGroup={targetGroup}
            customAudienceGroup={customAudienceGroup}
            occasion={occasion}
            targetProfile={targetProfile}
            profileFieldClassName={profileFieldClassName}
            profileLabelClassName={profileLabelClassName}
            profileControlClassName={profileControlClassName}
            showAdvancedAudienceFields={showAdvancedAudienceFields}
            advancedAudienceFacts={advancedAudienceFacts}
            ageBand={ageBand}
            ageBandOptions={ageBandOptions}
            gender={gender}
            genderOptions={genderOptions}
            occupation={occupation}
            occupationOptions={occupationOptions}
            relationship={relationship}
            relationshipOptions={relationshipOptions}
            budgetRange={budgetRange}
            budgetOptions={budgetOptions}
            formality={formality}
            formalityOptions={formalityOptions}
            relationshipLabel={relationshipLabel}
            occupationLabel={occupationLabel}
            onSelectedCountryChange={value => {
              setSelectedCountry(value)
              setAnalysis(null)
            }}
            onSceneTemplateChange={handleSceneTemplateChange}
            onTargetGroupChange={value => {
              setTargetGroup(value)
              if (value !== 'other') {
                setCustomAudienceGroup('')
              }
              setAnalysis(null)
            }}
            onCustomAudienceGroupChange={value => {
              setCustomAudienceGroup(value)
              setAnalysis(null)
            }}
            onOccasionChange={value => {
              setOccasion(value)
              setAnalysis(null)
            }}
            onTargetProfileChange={value => {
              setTargetProfile(value)
              setAnalysis(null)
            }}
            onToggleAdvancedAudienceFields={() => setShowAdvancedAudienceFields(prev => !prev)}
            onAgeBandChange={value => {
              setAgeBand(value)
              setAnalysis(null)
            }}
            onGenderChange={value => {
              setGender(value)
              setAnalysis(null)
            }}
            onOccupationChange={value => {
              setOccupation(value)
              setAnalysis(null)
            }}
            onRelationshipChange={value => {
              setRelationship(value)
              setAnalysis(null)
            }}
            onBudgetRangeChange={value => {
              setBudgetRange(value)
              setAnalysis(null)
            }}
            onFormalityChange={value => {
              setFormality(value)
              setAnalysis(null)
            }}
          />
          </div>
        </div>

        <WorkflowSupportPanels
          locale={locale}
          historyRecords={historyRecords}
          favoriteGiftChecklist={favoriteGiftChecklist}
          assistantAmountInput={assistantAmountInput}
          assistantCurrency={assistantCurrency}
          assistantWeightInput={assistantWeightInput}
          assistantDeclaredValueInput={assistantDeclaredValueInput}
          assistantResult={assistantResult}
          assistantError={assistantError}
          isAssistantLoading={isAssistantLoading}
          onAssistantAmountChange={setAssistantAmountInput}
          onAssistantCurrencyChange={setAssistantCurrency}
          onAssistantWeightChange={setAssistantWeightInput}
          onAssistantDeclaredValueChange={setAssistantDeclaredValueInput}
          onRunLogisticsAssistant={handleRunLogisticsAssistant}
        />

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <div className="h-2 w-full max-w-md mx-auto rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-100"
                  animate={{ x: ['-120%', '320%'] }}
                  transition={{ duration: 1.15, ease: 'linear', repeat: Infinity }}
                />
              </div>
              <p className="mt-3 text-sm text-cyan-100/80">
                {isLoadingRecognition
                  ? locale === 'zh'
                    ? `正在识别礼物信息，请稍候...（已等待 ${recognizingElapsedSeconds}s）`
                    : `Recognizing gift information... (${recognizingElapsedSeconds}s)`
                  : locale === 'zh'
                    ? `正在生成文化分析，网络波动时可能稍有延迟...（已等待 ${analyzingElapsedSeconds}s）`
                    : `Generating cultural analysis... (${analyzingElapsedSeconds}s)`}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {isLoadingRecognition
                  ? locale === 'zh'
                    ? recognizingElapsedSeconds >= 12
                      ? '等待时间较长：模型可能返回非结构化内容，系统会自动兜底处理。'
                      : '通常需要 3-12 秒。'
                    : recognizingElapsedSeconds >= 12
                      ? 'Longer wait detected: fallback handling may be triggered for non-structured output.'
                      : 'Typical wait is 3-12 seconds.'
                  : locale === 'zh'
                    ? analyzingElapsedSeconds >= 20
                      ? '等待时间较长：请保持页面不关闭，分析仍在继续。'
                      : '通常需要 20-25 秒。'
                    : analyzingElapsedSeconds >= 20
                      ? 'Longer wait detected: keep this page open while analysis continues.'
                      : 'Typical wait is 20-25 seconds.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results section */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-6"
            >
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold">{t('results.title')}</h2>
                  {analysisSource && (
                    <div className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                      {analysisSource === 'hybrid-ai-rules'
                        ? locale === 'zh'
                          ? 'AI + 规则引擎'
                          : 'AI + Rules'
                        : locale === 'zh'
                          ? '本地规则回退'
                          : 'Local rules fallback'}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleReset}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  {locale === 'zh' ? '重新开始' : 'Start Over'}
                </Button>
              </div>

              <div className="rounded-xl border border-cyan-200/20 bg-[#11263e]/70 px-4 py-3 text-sm text-slate-200">
                <p>
                  {locale === 'zh' ? '分析上下文：' : 'Analysis context: '}
                  {selectedCountry ? getCountryName(selectedCountry, locale) : locale === 'zh' ? '未选择国家' : 'No country'}
                  {' · '}
                  {selectedAudienceLabel}
                </p>
                {giftName.trim() && (
                  <p className="mt-1 text-xs text-slate-300">
                    {locale === 'zh' ? '礼物名称：' : 'Gift name: '}
                    {giftName.trim()}
                  </p>
                )}
                {(visionDescription.trim() || giftDescription.trim()) && (
                  <p className="mt-1 text-xs text-slate-300">
                    {locale === 'zh' ? '礼物描述：' : 'Gift description: '}
                    {visionDescription.trim() || giftDescription.trim()}
                  </p>
                )}
                {targetProfile.trim() && <p className="mt-1 text-xs text-slate-300">{targetProfile.trim()}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{locale === 'zh' ? '综合风险分' : 'Risk Score'}</h3>
                    <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">
                      0-100
                    </span>
                  </div>
                  <div className="mt-4 text-5xl font-bold text-fuchsia-200">{analysis.riskScore}</div>
                  <div className="mt-3 h-2 rounded-full bg-slate-700/80">
                    <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-rose-300" style={{ width: `${analysis.riskScore}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    {analysis.riskScore >= 72
                      ? locale === 'zh'
                        ? '当前礼物存在明显文化误读风险，建议优先考虑替代方案。'
                        : 'This gift shows significant cultural risk. Prefer a replacement option first.'
                      : analysis.riskScore >= 40
                        ? locale === 'zh'
                          ? '存在一定文化风险，建议配合包装和表达方式降风险。'
                          : 'There is moderate cultural risk. Use packaging and wording to reduce it.'
                        : locale === 'zh'
                          ? '当前礼物整体较稳妥，可继续优化包装与话术。'
                          : 'The gift is relatively safe. Focus on polishing packaging and messaging.'}
                  </p>
                </motion.div>

                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">{locale === 'zh' ? '结构化识别画像' : 'Structured gift profile'}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.giftProfile.semanticTags.length > 0 ? (
                      analysis.giftProfile.semanticTags.map(tag => (
                        <span key={tag} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-300">
                        {locale === 'zh' ? '当前未提取到更多结构化标签。' : 'No additional structured tags were extracted.'}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
                      {locale === 'zh' ? '类别' : 'Category'}: {analysis.giftProfile.category || '-'}
                    </div>
                    <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
                      {locale === 'zh' ? '颜色' : 'Colors'}: {analysis.giftProfile.colors.join(isZh ? '、' : ', ') || '-'}
                    </div>
                    <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
                      {locale === 'zh' ? '材质' : 'Materials'}: {analysis.giftProfile.materials.join(isZh ? '、' : ', ') || '-'}
                    </div>
                    <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
                      {locale === 'zh' ? '风格' : 'Styles'}: {analysis.giftProfile.styles.join(isZh ? '、' : ', ') || '-'}
                    </div>
                  </div>
                </motion.div>
              </div>

              {hasAnalysisEnhancementResults && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-sky-300/20 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {isZh ? 'P1 / P2 增强结果' : 'P1 / P2 enhancement results'}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {isZh
                          ? '这些结果来自文档中已实现但此前未在主流程展示的增强模块。'
                          : 'These panels surface enhancement modules that were implemented but previously not shown in the main workflow.'}
                      </p>
                    </div>
                    <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-100">
                      {isZh ? '增强洞察' : 'Enhanced insights'}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {analysisEnhancements?.p1?.multimodalResults && (
                      <div className="rounded-2xl border border-cyan-300/18 bg-[#10253b]/82 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-lg font-semibold text-slate-50">
                            {isZh ? '多模态识别补强' : 'Multimodal recognition'}
                          </h4>
                          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                            {(analysisEnhancements.p1.multimodalResults.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          {isZh ? '信息源：' : 'Source: '}
                          {analysisEnhancements.p1.multimodalResults.enrichmentSource}
                        </p>
                        <div className="mt-3 space-y-2 text-xs text-slate-300">
                          {analysisEnhancements.p1.multimodalResults.ocrResult?.brands?.length ? (
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <span className="text-cyan-100">{isZh ? 'OCR 品牌：' : 'OCR brands: '}</span>
                              {analysisEnhancements.p1.multimodalResults.ocrResult.brands.join(isZh ? '、' : ', ')}
                            </div>
                          ) : null}
                          {analysisEnhancements.p1.multimodalResults.ocrResult?.specifications?.length ? (
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <span className="text-cyan-100">{isZh ? '规格特征：' : 'Specs: '}</span>
                              {analysisEnhancements.p1.multimodalResults.ocrResult.specifications.join(isZh ? '、' : ', ')}
                            </div>
                          ) : null}
                          {analysisEnhancements.p1.multimodalResults.visualAttributes?.colors?.length ? (
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <span className="text-cyan-100">{isZh ? '视觉颜色：' : 'Detected colors: '}</span>
                              {analysisEnhancements.p1.multimodalResults.visualAttributes.colors
                                .map(item => `${item.color}${item.prominence ? ` (${item.prominence})` : ''}`)
                                .join(isZh ? '、' : ', ')}
                            </div>
                          ) : null}
                          {analysisEnhancements.p1.multimodalResults.visualAttributes?.materials?.length ? (
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <span className="text-cyan-100">{isZh ? '材质识别：' : 'Materials: '}</span>
                              {analysisEnhancements.p1.multimodalResults.visualAttributes.materials
                                .map(item => `${item.material} ${(item.confidence * 100).toFixed(0)}%`)
                                .join(isZh ? '、' : ', ')}
                            </div>
                          ) : null}
                          {analysisEnhancements.p1.multimodalResults.visualAttributes?.styles?.length ? (
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <span className="text-cyan-100">{isZh ? '风格标签：' : 'Style tags: '}</span>
                              {analysisEnhancements.p1.multimodalResults.visualAttributes.styles.join(isZh ? '、' : ', ')}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}

                    {analysisEnhancements?.p1?.logisticsEstimate && (
                      <div className="rounded-2xl border border-amber-300/18 bg-[#10253b]/82 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-lg font-semibold text-slate-50">
                            {isZh ? '物流与清关估算' : 'Logistics estimate'}
                          </h4>
                          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                            {analysisEnhancements.p1.logisticsEstimate.recommendedCarrier || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                          <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                            {isZh ? '总成本：' : 'Total cost: '}
                            {formatCurrencyAmount(
                              analysisEnhancements.p1.logisticsEstimate.totalEstimatedCost,
                              analysisEnhancements.p1.logisticsEstimate.destinationCurrency,
                              locale,
                            )}
                          </div>
                          <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                            {isZh ? '预计时效：' : 'ETA: '}
                            {analysisEnhancements.p1.logisticsEstimate.deliveryTimeRange}
                          </div>
                          <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                            {isZh ? '关税预估：' : 'Duties: '}
                            {formatCurrencyAmount(
                              analysisEnhancements.p1.logisticsEstimate.customsDuty.estimatedDuty,
                              analysisEnhancements.p1.logisticsEstimate.customsDuty.currency,
                              locale,
                            )}
                          </div>
                          <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                            {isZh ? '税率：' : 'Duty rate: '}
                            {(analysisEnhancements.p1.logisticsEstimate.customsDuty.dutyRate * 100).toFixed(0)}%
                          </div>
                        </div>
                        {analysisEnhancements.p1.logisticsEstimate.shippingQuotes.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {analysisEnhancements.p1.logisticsEstimate.shippingQuotes.map(quote => (
                              <div key={`${quote.carrier}-${quote.estimatedDays}`} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                                <span className="text-amber-100">{quote.carrier}</span>
                                {` · ${formatCurrencyAmount(quote.baseCost, quote.currency, locale)} · ${quote.estimatedDays} ${isZh ? '天' : 'days'}`}
                              </div>
                            ))}
                          </div>
                        )}
                        {analysisEnhancements.p1.packingRecommendations?.general.length ? (
                          <div className="mt-3 rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                            <span className="text-amber-100">{isZh ? '包装建议：' : 'Packing: '}</span>
                            {analysisEnhancements.p1.packingRecommendations.general.join(isZh ? '；' : '; ')}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {analysisEnhancements?.p1?.collaborativeResults?.length ? (
                      <div className="rounded-2xl border border-emerald-300/18 bg-[#10253b]/82 p-4">
                        <h4 className="text-lg font-semibold text-slate-50">
                          {isZh ? '协同过滤重排结果' : 'Collaborative reranking'}
                        </h4>
                        <div className="mt-3 space-y-2">
                          {analysisEnhancements.p1.collaborativeResults.map(item => (
                            <div key={item.id} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-slate-100">{locale === 'zh' ? item.nameZh : item.nameEn}</span>
                                <span className="text-xs text-emerald-100">{item.score}</span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-300">
                                {locale === 'zh' ? item.reasonZh : item.reasonEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {analysisEnhancements?.p2?.wideDeepResults?.length ? (
                      <div className="rounded-2xl border border-fuchsia-300/18 bg-[#10253b]/82 p-4">
                        <h4 className="text-lg font-semibold text-slate-50">
                          {isZh ? 'Wide & Deep 重排结果' : 'Wide & Deep reranking'}
                        </h4>
                        <div className="mt-3 space-y-2">
                          {analysisEnhancements.p2.wideDeepResults.map(item => (
                            <div key={item.id} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-slate-100">{locale === 'zh' ? item.nameZh : item.nameEn}</span>
                                <span className="text-xs text-fuchsia-100">{item.score}</span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-300">
                                {locale === 'zh' ? item.reasonZh : item.reasonEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {analysisEnhancements?.p2?.culturalImpactScores &&
                    Object.keys(analysisEnhancements.p2.culturalImpactScores).length > 0 ? (
                      <div className="rounded-2xl border border-violet-300/18 bg-[#10253b]/82 p-4">
                        <h4 className="text-lg font-semibold text-slate-50">
                          {isZh ? '知识图谱文化影响分' : 'Knowledge graph impact'}
                        </h4>
                        <p className="mt-2 text-xs text-slate-400">
                          {isZh
                            ? '当前图谱覆盖国家有限，未收录的国家会显示为 0。'
                            : 'Current graph coverage is limited; unsupported countries will show as 0.'}
                        </p>
                        <div className="mt-3 space-y-2">
                          {Object.entries(analysisEnhancements.p2.culturalImpactScores).map(([id, score]) => {
                            const matchedRecommendation = analysis.recommendations.find(item => item.id === id)
                            return (
                              <div key={id}>
                                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                                  <span>{matchedRecommendation ? (locale === 'zh' ? matchedRecommendation.nameZh : matchedRecommendation.nameEn) : id}</span>
                                  <span>{Math.round(score * 100)}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-700/80">
                                  <div className="h-full rounded-full bg-violet-300/80" style={{ width: `${Math.round(score * 100)}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {analysisEnhancements?.localizedOutput?.formattedRecommendations && (
                    <div className="mt-4 rounded-2xl border border-slate-200/12 bg-slate-950/30 p-4">
                      <h4 className="text-sm font-semibold text-slate-100">
                        {isZh ? '本地化格式化输出' : 'Localized formatted output'}
                      </h4>
                      <pre className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                        {analysisEnhancements.localizedOutput.formattedRecommendations}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}

              {analysis.recommendations.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-emerald-400/20 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {analysis.riskLevel === 'Low'
                          ? locale === 'zh'
                            ? '可选升级推荐'
                            : 'Optional upgrades'
                          : locale === 'zh'
                            ? '更稳妥的替代推荐'
                            : 'Safer alternatives'}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {analysis.riskLevel === 'Low'
                          ? locale === 'zh'
                            ? '当前礼物整体可送，以下是更稳、更匹配当前场景的升级选项。'
                            : 'The current gift is broadly safe. These are stronger upgrades for the same context.'
                          : locale === 'zh'
                            ? '当前方案存在风险，以下是结合国家规则、场景模板、预算和目标群体筛出的更稳妥替代项。'
                            : 'The current option carries risk. These safer replacements are ranked by country rules, scene template, budget, and recipient profile.'}
                      </p>
                    </div>
                    <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                      {analysis.riskLevel === 'Low'
                        ? locale === 'zh'
                          ? '升级参考'
                          : 'Upgrade options'
                        : locale === 'zh'
                          ? '替代参考'
                          : 'Replacement options'}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    {analysis.recommendations.map(item => {
                      const isFavorite = favoriteRecommendationIds.includes(item.id)
                      const name = locale === 'zh' ? item.nameZh : item.nameEn
                      return (
                        <div key={item.id} className="rounded-2xl border border-emerald-300/20 bg-[#10253b]/85 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/80">{item.category}</p>
                              <h4 className="mt-2 text-lg font-semibold text-slate-50">{name}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleFavoriteRecommendation(item.id)}
                              className={`rounded-full border px-3 py-1 text-xs transition ${
                                isFavorite
                                  ? 'border-amber-300/40 bg-amber-400/12 text-amber-100'
                                  : 'border-slate-500/40 bg-slate-800/70 text-slate-200 hover:border-slate-300/60'
                              }`}
                            >
                              {isFavorite ? (locale === 'zh' ? '已收藏' : 'Saved') : locale === 'zh' ? '收藏' : 'Save'}
                            </button>
                          </div>

                          <div className="mt-3 text-3xl font-bold text-emerald-200">{item.score}</div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {locale === 'zh' ? item.reasonZh : item.reasonEn}
                          </p>

                          <div className="mt-4 space-y-2 text-xs text-slate-300">
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/50 px-3 py-2">
                              <span className="text-emerald-200">{locale === 'zh' ? '送礼话术：' : 'Pitch: '}</span>
                              {locale === 'zh' ? item.pitchZh : item.pitchEn}
                            </div>
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/50 px-3 py-2">
                              <span className="text-emerald-200">{locale === 'zh' ? '包装建议：' : 'Packaging: '}</span>
                              {locale === 'zh' ? item.packagingTipZh : item.packagingTipEn}
                            </div>
                            <div className="rounded-lg border border-slate-600/60 bg-slate-900/50 px-3 py-2">
                              <span className="text-emerald-200">{locale === 'zh' ? '寄送提示：' : 'Shipping: '}</span>
                              {locale === 'zh' ? item.shippingNoteZh : item.shippingNoteEn}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {analysis.matchedRules.length > 0 && (
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-amber-400/20 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold">{locale === 'zh' ? '命中的文化规则' : 'Matched Cultural Rules'}</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {analysis.matchedRules.map(rule => (
                      <div key={rule.id} className="rounded-xl border border-amber-300/20 bg-[#11263c]/80 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs uppercase tracking-[0.14em] text-amber-200/80">{rule.ruleType}</span>
                          <span className="rounded-full border border-amber-300/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-100">
                            +{rule.riskScore}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-200">{rule.explanation}</p>
                        {rule.suggestion && <p className="mt-2 text-xs leading-5 text-slate-400">{rule.suggestion}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Score and risk summary */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cultural Fit Score */}
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{t('results.culturalFit')}</h3>
                      <InfoTooltip content={t('tooltip.culturalFit')} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300">
                      {analysis.fitScore}
                    </div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full transition-all"
                        style={{ width: `${analysis.fitScore}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {analysis.fitScore >= 75
                      ? locale === 'zh'
                        ? '优秀的文化契合度'
                        : 'Excellent cultural fit'
                      : analysis.fitScore >= 50
                        ? locale === 'zh'
                          ? '良好的文化契合度'
                          : 'Good cultural fit'
                        : locale === 'zh'
                          ? '需要谨慎选择'
                          : 'Needs careful consideration'}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {locale === 'zh'
                      ? '评分依据：谐音语义 + 象征寓意 + 色彩习俗（等权重）'
                      : 'Score basis: phonetic cues + symbolic meaning + color conventions (equal weight)'}
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        label: locale === 'zh' ? '谐音语义' : 'Phonetic',
                        value: analysis.scoreBreakdown.phonetic,
                      },
                      {
                        label: locale === 'zh' ? '象征寓意' : 'Symbolic',
                        value: analysis.scoreBreakdown.symbol,
                      },
                      {
                        label: locale === 'zh' ? '色彩习俗' : 'Color',
                        value: analysis.scoreBreakdown.color,
                      },
                    ].map(metric => (
                      <div key={metric.label}>
                        <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                          <span>{metric.label}</span>
                          <span>{metric.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-700/80">
                          <div className="h-full rounded-full bg-cyan-300/80" style={{ width: `${metric.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Risk Level */}
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{t('results.riskLevel')}</h3>
                      <InfoTooltip content={t('tooltip.riskLevel')} />
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold ${
                      analysis.riskLevel === 'Low'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : analysis.riskLevel === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                          : 'bg-red-500/20 text-red-300 border border-red-500/50'
                    }`}
                  >
                    {analysis.riskLevel === 'Low' ? '✓' : analysis.riskLevel === 'Medium' ? '⚠' : '✕'}
                    <span>
                      {analysis.riskLevel === 'Low'
                        ? t('results.low')
                        : analysis.riskLevel === 'Medium'
                          ? t('results.medium')
                          : t('results.high')}
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-600/70 bg-slate-800/60 p-3">
                    <p className="text-sm text-slate-200">
                      {analysis.warning ||
                        (locale === 'zh'
                          ? '当前未返回明确风险说明，建议结合语义信号与禁忌元素谨慎判断。'
                          : 'No explicit warning was returned, so review semantic signals and taboo elements carefully.')}
                    </p>
                  </div>

                  {analysis.isTaboo && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-sm text-red-200">
                        {locale === 'zh'
                          ? '⚠️ 已触发禁忌风险，不建议直接赠送原方案。'
                          : '⚠️ Taboo-level risk detected. Direct gifting is not recommended.'}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold">
                      {analysis.riskLevel === 'Low'
                        ? locale === 'zh'
                          ? '还需要注意什么'
                          : 'What to keep an eye on'
                        : locale === 'zh'
                          ? '为什么有风险'
                          : 'Why this is risky'}
                    </h3>
                    <InfoTooltip
                      content={
                        analysis.riskLevel === 'Low'
                          ? locale === 'zh'
                            ? '即使整体风险较低，也会列出仍需注意的表达或包装细节。'
                            : 'Even with low overall risk, this section surfaces details still worth watching.'
                          : locale === 'zh'
                            ? '这里会列出风险触发点，告诉你问题来自哪里。'
                            : 'This section lists concrete triggers behind the current risk level.'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    {riskReasons.length > 0 ? (
                      riskReasons.map(reason => (
                        <div key={reason} className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-2 text-sm text-slate-200">
                          {reason}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-300">
                        {locale === 'zh' ? '当前暂无明确风险触发点。' : 'No specific risk trigger was returned.'}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold">{riskActionMeta?.title}</h3>
                    <InfoTooltip content={riskActionMeta?.tooltip ?? ''} />
                  </div>

                  <div className="space-y-2">
                    {mustSendAdvice.map(tip => (
                      <div
                        key={tip}
                        className={cn(
                          'rounded-lg px-3 py-2 text-sm',
                          riskActionMeta?.panelClassName ?? 'border-cyan-500/30 bg-cyan-500/10',
                          riskActionMeta?.textClassName ?? 'text-cyan-100',
                        )}
                      >
                        {tip}
                      </div>
                    ))}
                  </div>

                  {(analysis.riskLevel !== 'Low') && (analysis.rescueItem || analysis.rescueReason) && (
                    <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                      {analysis.rescueItem && (
                        <p className="text-sm text-emerald-200">
                          {locale === 'zh' ? '更稳妥的替代礼物：' : 'Safer replacement: '}
                          {analysis.rescueItem}
                        </p>
                      )}
                      {analysis.rescueReason && (
                        <p className="mt-1 text-xs text-emerald-100/90">
                          {locale === 'zh' ? '替代理由：' : 'Why it helps: '}
                          {analysis.rescueReason}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Packaging and Greeting Card */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Packaging */}
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold">{t('results.packaging')}</h3>
                    <InfoTooltip content={t('tooltip.packaging')} />
                  </div>

                  <div className="space-y-3">
                    {analysis.packaging.style && (
                      <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-2">{locale === 'zh' ? '包装风格' : 'Style'}</p>
                        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                          {analysis.packaging.style}
                        </div>
                      </div>
                    )}

                    {analysis.packaging.colors.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-2">{t('results.colors')}</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.packaging.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200"
                            >
                              {color}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.packaging.materials && (
                      <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-2">{locale === 'zh' ? '材质建议' : 'Materials'}</p>
                        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                          {analysis.packaging.materials}
                        </div>
                      </div>
                    )}

                    {analysis.packaging.avoid.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-red-300 mb-2">{locale === 'zh' ? '避免元素' : 'Avoid'}</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.packaging.avoid.map((avoidItem, idx) => (
                            <div key={idx} className="px-3 py-1 bg-red-500/15 border border-red-500/35 rounded-full text-sm text-red-200">
                              {avoidItem}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Greeting Card */}
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold">{t('results.greetingCard')}</h3>
                    <InfoTooltip content={t('tooltip.greetingCard')} />
                  </div>

                  <div className="space-y-3">
                    {analysis.greetingCard.tone && (
                      <div>
                        <p className="text-sm font-semibold text-cyan-300 mb-2">{locale === 'zh' ? '语气建议' : 'Tone'}</p>
                        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                          {analysis.greetingCard.tone}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg space-y-1">
                      {analysis.greetingCard.opener && <p className="text-sm text-cyan-100">{analysis.greetingCard.opener}</p>}
                      {analysis.greetingCard.body && <p className="text-sm text-cyan-100">{analysis.greetingCard.body}</p>}
                      {analysis.greetingCard.closing && <p className="text-sm text-cyan-100">{analysis.greetingCard.closing}</p>}
                      {!analysis.greetingCard.opener && !analysis.greetingCard.body && !analysis.greetingCard.closing && (
                        <p className="text-sm text-cyan-100/80">
                          {locale === 'zh' ? '当前未返回完整贺卡文案。' : 'No full card copy was returned.'}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Semantic Signals */}
              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold">{t('results.semanticSignals')}</h3>
                  <InfoTooltip content={t('tooltip.semanticSignals')} />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {analysis.semanticSignals.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-cyan-300 mb-2">{locale === 'zh' ? '风险标签' : 'Risk tags'}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.semanticSignals.tags.map((tag, idx) => (
                          <div key={idx} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200">
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.semanticSignals.flowers.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-cyan-300 mb-2">{t('results.flowers')}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.semanticSignals.flowers.map((flower, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200"
                          >
                            {flower}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.semanticSignals.numbers.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-cyan-300 mb-2">{t('results.numbers')}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.semanticSignals.numbers.map((num, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.semanticSignals.tags.length === 0 &&
                    analysis.semanticSignals.flowers.length === 0 &&
                    analysis.semanticSignals.numbers.length === 0 && (
                      <p className="text-sm text-slate-300">
                        {locale === 'zh' ? '当前未返回可解析语义信号。' : 'No semantic signals were returned.'}
                      </p>
                    )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
