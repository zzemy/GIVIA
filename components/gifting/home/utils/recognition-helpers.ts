import type { RecognitionResult, RecognitionSource } from '@/components/gifting/home/types'

export interface RecognitionResponsePayload {
  source?: string
  recognition?: RecognitionResult
  description?: string
  detectedLabel?: string
  rawLabels?: string[]
  error?: string
}

export interface ParsedRecognitionPayload {
  recognition: RecognitionResult
  source: RecognitionSource
  description: string
  detectedLabel: string
  rawLabels: string[]
}

function isSupportedRecognitionSource(value: unknown): value is RecognitionSource {
  return (
    value === 'aliyun-dashscope' ||
    value === 'aliyun-dashscope-text' ||
    value === 'local-fallback' ||
    value === 'local-fallback-text'
  )
}

function shortenText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`
}

function isLikelyStructuredText(value: string): boolean {
  const compact = value.trim()

  if (!compact) {
    return false
  }

  if ((compact.startsWith('{') && compact.endsWith('}')) || (compact.startsWith('[') && compact.endsWith(']'))) {
    return true
  }

  return compact.includes('"label"') || compact.includes('"description"')
}

function extractJsonRecord(value: string): Record<string, unknown> | null {
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

function pickStringField(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function normalizeDetectedLabel(raw: string, fallback: string): string {
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

function normalizeDescription(raw: string, fallback: string): string {
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

function normalizeForCompare(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s,，。.!！?？;；:：、'"“”‘’\-_/\\()[\]{}<>《》]/g, '')
    .trim()
}

function isDuplicateDescription(primary: string, secondary: string): boolean {
  const normalizedPrimary = normalizeForCompare(primary)
  const normalizedSecondary = normalizeForCompare(secondary)

  if (!normalizedPrimary || !normalizedSecondary) {
    return false
  }

  if (normalizedPrimary === normalizedSecondary) {
    return true
  }

  const longer = normalizedPrimary.length >= normalizedSecondary.length ? normalizedPrimary : normalizedSecondary
  const shorter = longer === normalizedPrimary ? normalizedSecondary : normalizedPrimary

  return shorter.length >= 8 && longer.includes(shorter)
}

function refineChineseProse(text: string): string {
  return text
    .replace(/\s+/g, '')
    .replace(/装饰有/g, '点缀')
    .replace(/搭配有/g, '配有')
    .replace(/和/g, '与')
    .replace(/非常/g, '')
    .replace(/看起来/g, '呈现出')
    .replace(/有一种/g, '带有')
    .replace(/给人一种/g, '带来')
    .replace(/，+/g, '，')
    .replace(/。+/g, '。')
}

function refineEnglishProse(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\band\b/gi, 'with')
    .replace(/\blooks\b/gi, 'feels')
    .replace(/\bvery\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function shouldUseChinesePeriod(text: string): boolean {
  const compact = text.replace(/[，、；：,\s]/g, '')
  return compact.length >= 18
}

export function beautifyDescriptionText(raw: string, isZh: boolean): string {
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
      dedupedChunks.push(isZh ? refineChineseProse(chunk) : refineEnglishProse(chunk))
    }
  })

  const merged = isZh ? dedupedChunks.join('，') : dedupedChunks.join(', ')
  const punctuated = /[。.!！?？]$/.test(merged)
    ? merged
    : isZh
      ? shouldUseChinesePeriod(merged)
        ? `${merged}。`
        : merged
      : `${merged}.`

  return shortenText(punctuated, 240)
}

function normalizeRawLabels(labels: string[]): string[] {
  return labels
    .map(item => item.trim())
    .filter(item => item.length > 0 && !isLikelyStructuredText(item))
    .map(item => shortenText(item, 60))
    .slice(0, 6)
}

export async function parseRecognitionPayload(response: Response, isZh: boolean): Promise<ParsedRecognitionPayload> {
  const data = (await response.json().catch(() => ({}))) as RecognitionResponsePayload

  if (!response.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : isZh ? '识别失败，请稍后再试。' : 'Recognition failed. Please try again.')
  }

  if (!isSupportedRecognitionSource(data.source) || !data.recognition) {
    throw new Error(isZh ? '识别结果格式异常' : 'Invalid recognition response')
  }

  const fallbackLabel = isZh ? data.recognition.itemZh : data.recognition.itemEn
  const normalizedDescription = normalizeDescription(typeof data.description === 'string' ? data.description : '', '')
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
