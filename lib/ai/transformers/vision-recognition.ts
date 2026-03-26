import {
  buildUnknownRecognition,
  type RecognitionResult,
} from '@/lib/analysis/cultural-analyzer'
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

export function buildRecognitionFromModelLabel(label: string, confidence: number): RecognitionResult {
  const normalizedLabel = shortenText(label.trim() || 'Unknown Gift Item', 60)
  const unknown = buildUnknownRecognition(normalizedLabel)

  return {
    ...unknown,
    itemZh: normalizedLabel,
    itemEn: normalizedLabel,
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
