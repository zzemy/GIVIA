export interface SafeJsonSuccess<T> {
  ok: true
  value: T
}

export interface SafeJsonFailure {
  ok: false
  error: string
}

export type SafeJsonResult<T> = SafeJsonSuccess<T> | SafeJsonFailure

const UNSAFE_MARKUP_REGEX =
  /<\s*(script|style|iframe|html|body|img|svg|object|embed|meta|link)\b|<!doctype/i

function stripMarkdownCodeFence(text: string): string {
  const fencedMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fencedMatch ? fencedMatch[1].trim() : text
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function extractSafeJsonObject(text: string): SafeJsonResult<Record<string, unknown>> {
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      ok: false,
      error: 'empty model output',
    }
  }

  if (UNSAFE_MARKUP_REGEX.test(trimmed)) {
    return {
      ok: false,
      error: 'unsafe markup wrapper detected',
    }
  }

  const normalized = stripMarkdownCodeFence(trimmed)
  const start = normalized.indexOf('{')
  const end = normalized.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    return {
      ok: false,
      error: 'no json object found in model output',
    }
  }

  try {
    const parsed = JSON.parse(normalized.slice(start, end + 1)) as unknown

    if (!isPlainRecord(parsed)) {
      return {
        ok: false,
        error: 'model output must be a json object',
      }
    }

    return {
      ok: true,
      value: parsed,
    }
  } catch {
    return {
      ok: false,
      error: 'invalid json object in model output',
    }
  }
}
