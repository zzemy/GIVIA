import {
  buildUnknownRecognition,
  type RecognitionResult,
} from '@/lib/analysis/cultural-analyzer'
import { buildGiftProfile } from '@/lib/analysis/gift-profile'
import type { VisionModelOutput } from '@/lib/ai/guards/output-validator'

export interface VisionRecognitionResponse {
  recognition: RecognitionResult
  source: string
  rawLabels?: string[]
  description?: string
  detectedLabel?: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return {}
}

function toString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  return ''
}

function shortenText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, Math.max(0, maxLength - 3))}...`
}

function isLikelyStructuredText(text: string): boolean {
  const compact = text.trim()

  if (!compact) {
    return false
  }

  if ((compact.startsWith('{') && compact.endsWith('}')) || (compact.startsWith('[') && compact.endsWith(']'))) {
    return true
  }

  return compact.includes('"label"') || compact.includes('"description"')
}

function pickFirstStringField(source: Record<string, unknown>, fieldNames: string[]): string {
  for (const fieldName of fieldNames) {
    const value = toString(source[fieldName])

    if (value) {
      return value
    }
  }

  return ''
}

function extractJsonFromText(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')

    if (start === -1 || end === -1 || end <= start) {
      return null
    }

    try {
      return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>
    } catch {
      return null
    }
  }
}

export function sanitizeLabel(rawLabel: string, fallback: string): string {
  const raw = rawLabel.trim()
  const parsed = raw ? extractJsonFromText(raw) : null

  if (parsed) {
    const extracted = pickFirstStringField(toRecord(parsed), ['label', 'name', 'item', 'item_name'])

    if (extracted) {
      return shortenText(extracted, 60)
    }
  }

  if (raw && !isLikelyStructuredText(raw)) {
    return shortenText(raw, 60)
  }

  return shortenText(fallback.trim(), 60)
}

export function sanitizeDescription(rawDescription: string, fallback: string): string {
  const raw = rawDescription.trim()
  const fallbackText = fallback.trim()

  if (!raw) {
    return shortenText(fallbackText, 240)
  }

  const parsed = extractJsonFromText(raw)

  if (parsed) {
    const parsedRecord = toRecord(parsed)
    const direct = pickFirstStringField(parsedRecord, [
      'description',
      'gift_description',
      'item_description',
      'summary',
      'desc',
    ])

    if (direct) {
      return shortenText(direct, 240)
    }

    const nestedGift = toRecord(parsedRecord.gift)
    const nested = pickFirstStringField(nestedGift, [
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

  if (isLikelyStructuredText(raw)) {
    return shortenText(fallbackText, 240)
  }

  return shortenText(raw, 240)
}

export function sanitizeRawLabels(labels: string[]): string[] {
  return labels
    .map(item => item.trim())
    .filter(item => item.length > 0 && !isLikelyStructuredText(item))
    .map(item => shortenText(item, 60))
    .slice(0, 6)
}

const LOCALIZED_LABEL_PATTERNS: Array<{ match: RegExp; itemZh: string; itemEn: string; itemKey: string; category: string }> = [
  { match: /\bchocolate|truffle|cocoa\b/i, itemZh: '巧克力礼盒', itemEn: 'Chocolate Box', itemKey: 'chocolate', category: 'Food' },
  { match: /\bpen|fountain pen|signature pen\b/i, itemZh: '签字钢笔', itemEn: 'Signature Pen', itemKey: 'pen', category: 'Stationery' },
  { match: /\btea|teaware|tea set\b/i, itemZh: '茶礼', itemEn: 'Tea Gift', itemKey: 'tea', category: 'Tea' },
  { match: /\bperfume|fragrance\b/i, itemZh: '香水', itemEn: 'Perfume', itemKey: 'perfume', category: 'Lifestyle' },
  { match: /\bwallet\b/i, itemZh: '钱包', itemEn: 'Wallet', itemKey: 'wallet', category: 'Lifestyle' },
  { match: /\bumbrella\b/i, itemZh: '雨伞', itemEn: 'Umbrella', itemKey: 'umbrella', category: 'Lifestyle' },
  { match: /\bclock|watch\b/i, itemZh: '钟表', itemEn: 'Clock', itemKey: 'clock', category: 'Home' },
  { match: /\bknife|scissors|blade\b/i, itemZh: '刀具', itemEn: 'Knife Set', itemKey: 'knife', category: 'Home' },
  { match: /\bmug|cup|ceramic mug\b/i, itemZh: '陶瓷杯', itemEn: 'Ceramic Mug', itemKey: 'mug', category: 'Home' },
  { match: /\bscarf|silk scarf\b/i, itemZh: '真丝围巾', itemEn: 'Silk Scarf', itemKey: 'scarf', category: 'Lifestyle' },
]

const CATEGORY_LABELS: Record<string, { zh: string; en: string; itemKey: string; category: string }> = {
  stationery: { zh: '文具礼物', en: 'Stationery Gift', itemKey: 'stationery', category: 'Stationery' },
  tea: { zh: '茶礼', en: 'Tea Gift', itemKey: 'tea', category: 'Tea' },
  coffee: { zh: '咖啡礼盒', en: 'Coffee Gift', itemKey: 'coffee', category: 'Coffee' },
  gourmet: { zh: '美食礼盒', en: 'Gourmet Gift', itemKey: 'gourmet', category: 'Food' },
  home: { zh: '家居礼物', en: 'Home Gift', itemKey: 'home', category: 'Home' },
  accessories: { zh: '配饰礼物', en: 'Accessory Gift', itemKey: 'accessory', category: 'Lifestyle' },
  umbrella: { zh: '雨伞', en: 'Umbrella', itemKey: 'umbrella', category: 'Lifestyle' },
  clock: { zh: '钟表', en: 'Clock', itemKey: 'clock', category: 'Home' },
  knife: { zh: '刀具', en: 'Knife Set', itemKey: 'knife', category: 'Home' },
  perfume: { zh: '香水', en: 'Perfume', itemKey: 'perfume', category: 'Lifestyle' },
  general: { zh: '礼物对象', en: 'Gift Item', itemKey: 'gift', category: 'General' },
}

function containsChinese(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text)
}

function titleCaseLabel(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function localizeRecognitionLabel(label: string): { itemZh: string; itemEn: string; itemKey: string; category: string } {
  const compact = shortenText(label.trim() || 'Unknown Gift Item', 60)
  const keywordMatch = LOCALIZED_LABEL_PATTERNS.find(entry => entry.match.test(compact))

  if (keywordMatch) {
    return {
      itemZh: keywordMatch.itemZh,
      itemEn: keywordMatch.itemEn,
      itemKey: keywordMatch.itemKey,
      category: keywordMatch.category,
    }
  }

  const profile = buildGiftProfile({
    recognition: null,
    giftContext: {
      name: compact,
      description: '',
      visionLabel: '',
      visionDescription: '',
      rawLabels: [compact],
    },
  })

  const categoryLabel = CATEGORY_LABELS[profile.category] ?? CATEGORY_LABELS.general

  return {
    itemZh: containsChinese(compact) ? compact : (categoryLabel.zh === '礼物对象' ? compact : categoryLabel.zh),
    itemEn: containsChinese(compact) ? categoryLabel.en : titleCaseLabel(compact),
    itemKey: categoryLabel.itemKey,
    category: categoryLabel.category,
  }
}

export function buildRecognitionFromModelLabel(label: string, confidence: number): RecognitionResult {
  const normalizedLabel = shortenText(label.trim() || 'Unknown Gift Item', 60)
  const unknown = buildUnknownRecognition(normalizedLabel)
  const localized = localizeRecognitionLabel(normalizedLabel)

  return {
    ...unknown,
    itemKey: localized.itemKey,
    itemZh: localized.itemZh,
    itemEn: localized.itemEn,
    category: localized.category,
    confidence: clamp(confidence, 0.3, 0.98),
  }
}

export function buildVisionRecognitionResponse(input: {
  modelOutput: VisionModelOutput
  source: string
  fallbackConfidence: number
}): VisionRecognitionResponse | null {
  const primaryLabel = toString(input.modelOutput.label)

  if (!primaryLabel) {
    return null
  }

  const modelDescription = toString(input.modelOutput.description)
  const synonyms = input.modelOutput.synonyms.map(item => item.trim()).filter(Boolean)
  const labels = [primaryLabel, ...synonyms].filter(Boolean)
  const confidence =
    typeof input.modelOutput.confidence === 'number' && !Number.isNaN(input.modelOutput.confidence)
      ? clamp(input.modelOutput.confidence, 0.3, 0.98)
      : input.fallbackConfidence

  const responseRecognition = buildRecognitionFromModelLabel(primaryLabel, confidence)

  return {
    recognition: responseRecognition,
    source: input.source,
    rawLabels: sanitizeRawLabels(labels.slice(0, 5)),
    description: sanitizeDescription(modelDescription, ''),
    detectedLabel: sanitizeLabel(primaryLabel, responseRecognition.itemEn),
  }
}
