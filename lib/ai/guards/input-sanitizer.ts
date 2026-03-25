const DANGEROUS_CONTROL_CHAR_REGEX = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g
const WHITESPACE_REGEX = /\s+/g

export interface SanitizeTextOptions {
  maxLength?: number
  fallback?: string
  collapseWhitespace?: boolean
}

export interface SanitizedTextResult {
  value: string
  truncated: boolean
  removedControlChars: boolean
  normalizedWhitespace: boolean
  wasEmpty: boolean
}

function toInputString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

export function sanitizeText(
  value: unknown,
  options: SanitizeTextOptions = {},
): SanitizedTextResult {
  const collapseWhitespace = options.collapseWhitespace ?? true
  const maxLength = options.maxLength ?? Number.POSITIVE_INFINITY
  const fallback = options.fallback ?? ''
  const raw = toInputString(value)
  const withoutControlChars = raw.replace(DANGEROUS_CONTROL_CHAR_REGEX, '')
  const normalized = collapseWhitespace
    ? withoutControlChars.replace(WHITESPACE_REGEX, ' ').trim()
    : withoutControlChars.trim()
  const baseValue = normalized || fallback.trim()
  const finalValue = baseValue.length > maxLength ? baseValue.slice(0, maxLength).trim() : baseValue

  return {
    value: finalValue,
    truncated: baseValue.length > maxLength,
    removedControlChars: withoutControlChars !== raw,
    normalizedWhitespace: normalized !== withoutControlChars.trim(),
    wasEmpty: finalValue.length === 0,
  }
}

export function sanitizeTextValue(
  value: unknown,
  options: SanitizeTextOptions = {},
): string {
  return sanitizeText(value, options).value
}

export function sanitizeStringArray(
  value: unknown,
  options: {
    maxItems?: number
    itemMaxLength?: number
  } = {},
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  const maxItems = options.maxItems ?? 6
  const itemMaxLength = options.itemMaxLength ?? 120

  return value
    .map(item => sanitizeTextValue(item, { maxLength: itemMaxLength }))
    .filter(Boolean)
    .slice(0, maxItems)
}
