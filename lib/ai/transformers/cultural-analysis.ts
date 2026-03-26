import type {
  CulturalAnalysis,
  RecognitionResult,
  SupportedCountry,
} from '@/lib/analysis/cultural-analyzer'
import { calculateCulturalFitScore, type GiftScore } from '@/lib/domain/gifting'

export interface StrictParseResult {
  analysis: CulturalAnalysis | null
  missingFields: string[]
}

function isRiskLevel(value: unknown): value is CulturalAnalysis['riskLevel'] {
  return value === 'Low' || value === 'Medium' || value === 'High'
}

function normalizeRiskLevel(value: unknown): CulturalAnalysis['riskLevel'] | null {
  if (isRiskLevel(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()

  if (['low', '低', '低风险'].includes(normalized)) {
    return 'Low'
  }

  if (['medium', '中', '中风险'].includes(normalized)) {
    return 'Medium'
  }

  if (['high', '高', '高风险'].includes(normalized)) {
    return 'High'
  }

  return null
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return {}
}

function toStringValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  if (Array.isArray(value)) {
    const normalized = value
      .map(item => {
        if (typeof item === 'string') {
          return item.trim()
        }

        if (typeof item === 'number' || typeof item === 'boolean') {
          return String(item)
        }

        return ''
      })
      .filter(Boolean)
      .join('、')

    return normalized || null
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const direct =
      toStringValue(record.text) ??
      toStringValue(record.label) ??
      toStringValue(record.name) ??
      toStringValue(record.value)

    if (direct) {
      return direct
    }

    const flattened = Object.values(record)
      .map(item => toStringValue(item) ?? '')
      .filter(Boolean)
      .join('、')

    return flattened || null
  }

  return null
}

function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (value === 1) {
      return true
    }

    if (value === 0) {
      return false
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (['true', 'yes', '1', '是'].includes(normalized)) {
      return true
    }

    if (['false', 'no', '0', '否'].includes(normalized)) {
      return false
    }
  }

  return null
}

function toNumberInRange(value: unknown): number | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    const nested = getValueByAliases(record, ['value', 'score', '分数', 'number']) ?? null

    if (nested !== null) {
      return toNumberInRange(nested)
    }
  }

  const numeric =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number.parseFloat(value)
        : Number.NaN

  if (Number.isNaN(numeric)) {
    return null
  }

  return Math.min(100, Math.max(0, Math.round(numeric)))
}

function toStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return value
      .split(/[\n,，;；、|]/)
      .map(item => item.trim())
      .filter(Boolean)
      .slice(0, 6)
  }

  if (!Array.isArray(value)) {
    return []
  }

  const result = value
    .map(item => {
      if (typeof item === 'string') {
        return item.trim()
      }

      if (typeof item === 'number' || typeof item === 'boolean') {
        return String(item)
      }

      if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>
        const text =
          toStringValue(record.label) ??
          toStringValue(record.name) ??
          toStringValue(record.text) ??
          ''

        return text
      }

      return ''
    })
    .filter(Boolean)

  return result.slice(0, 6)
}

function hasAnyKeys(source: Record<string, unknown>, keys: string[]): boolean {
  return keys.some(key => key in source)
}

function pickLikelyRootOutput(modelOutput: Record<string, unknown>): Record<string, unknown> {
  const expectedKeys = [
    'score',
    'riskLevel',
    'risk_level',
    'isTaboo',
    'warning',
    'packaging',
    'card',
    'semanticSignals',
  ]

  if (hasAnyKeys(modelOutput, expectedKeys)) {
    return modelOutput
  }

  const nestedCandidates = [
    toRecord(modelOutput.analysis),
    toRecord(modelOutput.result),
    toRecord(modelOutput.data),
    toRecord(modelOutput.output),
    toRecord(modelOutput.response),
  ]

  const matchedCandidate = nestedCandidates.find(candidate => hasAnyKeys(candidate, expectedKeys))

  return matchedCandidate ?? modelOutput
}

function getValueByAliases(source: Record<string, unknown>, aliases: string[]): unknown {
  for (const alias of aliases) {
    if (alias in source) {
      return source[alias]
    }
  }

  return undefined
}

export function mergeModelOutputRecords(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }

  for (const [key, patchValue] of Object.entries(patch)) {
    const baseValue = result[key]

    if (
      typeof baseValue === 'object' &&
      baseValue !== null &&
      !Array.isArray(baseValue) &&
      typeof patchValue === 'object' &&
      patchValue !== null &&
      !Array.isArray(patchValue)
    ) {
      result[key] = mergeModelOutputRecords(
        baseValue as Record<string, unknown>,
        patchValue as Record<string, unknown>,
      )
      continue
    }

    result[key] = patchValue
  }

  return result
}

export function parseStrictCulturalAnalysis(
  modelOutput: Record<string, unknown>,
  country: SupportedCountry,
  recognition: RecognitionResult,
): StrictParseResult {
  const normalizedOutput = pickLikelyRootOutput(modelOutput)
  const missingFields: string[] = []
  const scoreInput = toRecord(
    getValueByAliases(normalizedOutput, ['score', 'scores', 'giftScore', 'scoreBreakdown', '评分']),
  )

  const phonetic = toNumberInRange(
    getValueByAliases(scoreInput, [
      'phonetic',
      'homophone',
      'pronunciation',
      'phoneticScore',
      'sound',
      'soundScore',
      '谐音',
      '语音',
      '发音',
    ]) ?? getValueByAliases(normalizedOutput, ['phonetic', 'phoneticScore', 'scorePhonetic']),
  )
  const symbol = toNumberInRange(
    getValueByAliases(scoreInput, [
      'symbol',
      'symbolic',
      'meaning',
      'symbolScore',
      'semantic',
      '象征',
      '寓意',
      '含义',
    ]) ?? getValueByAliases(normalizedOutput, ['symbol', 'symbolScore', 'scoreSymbol']),
  )
  const color = toNumberInRange(
    getValueByAliases(scoreInput, ['color', 'colour', 'colorScore', '色彩', '颜色']) ??
      getValueByAliases(normalizedOutput, ['color', 'colorScore', 'scoreColor']),
  )

  if (phonetic === null) {
    missingFields.push('score.phonetic')
  }

  if (symbol === null) {
    missingFields.push('score.symbol')
  }

  if (color === null) {
    missingFields.push('score.color')
  }

  const riskLevel = normalizeRiskLevel(
    getValueByAliases(normalizedOutput, ['riskLevel', 'risk_level', 'risk', '风险等级']),
  )

  if (!riskLevel) {
    missingFields.push('riskLevel')
  }

  const score: GiftScore = {
    phonetic: phonetic ?? 0,
    symbol: symbol ?? 0,
    color: color ?? 0,
  }

  const packagingInput = toRecord(
    getValueByAliases(normalizedOutput, ['packaging', 'package', 'packagingPlan', '包装', '包装建议']),
  )
  const cardInput = toRecord(
    getValueByAliases(normalizedOutput, ['card', 'greetingCard', 'cardPlan', '贺卡', '贺卡文案']),
  )

  const isTaboo = toBooleanValue(
    getValueByAliases(normalizedOutput, ['isTaboo', 'is_taboo', 'taboo', '禁忌']),
  )
  const warning = toStringValue(
    getValueByAliases(normalizedOutput, ['warning', 'riskReason', 'reason', '风险说明', '禁忌说明']),
  )
  const rescueItem = toStringValue(
    getValueByAliases(normalizedOutput, ['rescueItem', 'rescue_item', 'alternativeGift', '替代礼物']),
  )
  const rescueReason = toStringValue(
    getValueByAliases(normalizedOutput, [
      'rescueReason',
      'rescue_reason',
      'alternativeReason',
      '替代原因',
    ]),
  )
  const packagingStyle = toStringValue(getValueByAliases(packagingInput, ['style', 'theme', '风格']))
  const packagingColors = toStringValue(
    getValueByAliases(packagingInput, ['colors', 'colour', 'color', 'palette', '配色', '颜色']),
  )
  const packagingMaterials = toStringValue(
    getValueByAliases(packagingInput, ['materials', 'material', '材质', '材料']),
  )
  const packagingAvoid = toStringValue(
    getValueByAliases(packagingInput, ['avoid', 'avoidItems', 'avoid_elements', '避免', '禁忌']),
  )
  const cardTone = toStringValue(getValueByAliases(cardInput, ['tone', '语气']))
  const cardOpener = toStringValue(getValueByAliases(cardInput, ['opener', 'opening', '开头']))
  const cardBody = toStringValue(getValueByAliases(cardInput, ['body', 'content', '正文']))
  const cardClosing = toStringValue(getValueByAliases(cardInput, ['closing', 'signoff', '结尾']))
  const semanticSignals = toStringArray(
    getValueByAliases(normalizedOutput, [
      'semanticSignals',
      'semantic_signals',
      'xray_tags',
      'tags',
      'keywords',
      '语义信号',
      '标签',
    ]),
  )

  if (isTaboo === null) {
    missingFields.push('isTaboo')
  }

  if (warning === null) {
    missingFields.push('warning')
  }

  if (rescueItem === null) {
    missingFields.push('rescueItem')
  }

  if (rescueReason === null) {
    missingFields.push('rescueReason')
  }

  if (packagingStyle === null) {
    missingFields.push('packaging.style')
  }

  if (packagingColors === null) {
    missingFields.push('packaging.colors')
  }

  if (packagingMaterials === null) {
    missingFields.push('packaging.materials')
  }

  if (packagingAvoid === null) {
    missingFields.push('packaging.avoid')
  }

  if (cardTone === null) {
    missingFields.push('card.tone')
  }

  if (cardOpener === null) {
    missingFields.push('card.opener')
  }

  if (cardBody === null) {
    missingFields.push('card.body')
  }

  if (cardClosing === null) {
    missingFields.push('card.closing')
  }

  if (semanticSignals.length === 0) {
    missingFields.push('semanticSignals')
  }

  if (
    !riskLevel ||
    isTaboo === null ||
    warning === null ||
    rescueItem === null ||
    rescueReason === null ||
    packagingStyle === null ||
    packagingColors === null ||
    packagingMaterials === null ||
    packagingAvoid === null ||
    cardTone === null ||
    cardOpener === null ||
    cardBody === null ||
    cardClosing === null ||
    semanticSignals.length === 0 ||
    phonetic === null ||
    symbol === null ||
    color === null
  ) {
    return {
      analysis: null,
      missingFields,
    }
  }

  return {
    analysis: {
      country,
      recognition,
      score,
      fitScore: calculateCulturalFitScore(score),
      riskLevel,
      isTaboo,
      warning,
      rescueItem,
      rescueReason,
      semanticSignals,
      packaging: {
        style: packagingStyle,
        colors: packagingColors,
        materials: packagingMaterials,
        avoid: packagingAvoid,
      },
      card: {
        tone: cardTone,
        opener: cardOpener,
        body: cardBody,
        closing: cardClosing,
      },
    },
    missingFields: [],
  }
}
