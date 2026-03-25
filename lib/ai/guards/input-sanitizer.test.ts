import { sanitizeStringArray, sanitizeText, sanitizeTextValue } from '@/lib/ai/guards/input-sanitizer'

describe('input sanitizer', () => {
  it('normalizes whitespace, removes control characters, and caps length', () => {
    const result = sanitizeText('  hello\u0000 \n   world  ', { maxLength: 10 })

    expect(result.value).toBe('hello worl')
    expect(result.removedControlChars).toBe(true)
    expect(result.normalizedWhitespace).toBe(true)
    expect(result.truncated).toBe(true)
  })

  it('normalizes missing values with fallback text', () => {
    expect(sanitizeTextValue(undefined, { fallback: 'unknown' })).toBe('unknown')
    expect(sanitizeTextValue('   ', { fallback: 'unknown' })).toBe('unknown')
  })

  it('sanitizes string arrays and drops empty members', () => {
    const result = sanitizeStringArray(['  silk ', '\u0000', 'very long label that should be clipped'], {
      maxItems: 2,
      itemMaxLength: 12,
    })

    expect(result).toEqual(['silk', 'very long la'])
  })
})
