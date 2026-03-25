import { extractSafeJsonObject } from '@/lib/ai/guards/safe-json'

describe('safe json extraction', () => {
  it('extracts valid raw json objects', () => {
    const result = extractSafeJsonObject('{"label":"pen","confidence":0.8}')

    expect(result).toEqual({
      ok: true,
      value: {
        label: 'pen',
        confidence: 0.8,
      },
    })
  })

  it('extracts json wrapped in markdown code fences', () => {
    const result = extractSafeJsonObject('```json\n{"label":"pen"}\n```')

    expect(result).toEqual({
      ok: true,
      value: {
        label: 'pen',
      },
    })
  })

  it('rejects executable or html wrappers', () => {
    const result = extractSafeJsonObject('<script>{"label":"pen"}</script>')

    expect(result).toEqual({
      ok: false,
      error: 'unsafe markup wrapper detected',
    })
  })
})
