import { parseStrictCulturalAnalysis, mergeModelOutputRecords } from '@/lib/ai/transformers/cultural-analysis'

describe('cultural analysis transformer', () => {
  it('parses nested model output into strict cultural analysis', () => {
    const result = parseStrictCulturalAnalysis(
      {
        analysis: {
          score: { phonetic: 88, symbol: 76, color: 64 },
          riskLevel: 'Medium',
          isTaboo: false,
          warning: 'Mostly safe in this context.',
          rescueItem: 'Tea Set',
          rescueReason: 'Use a safer alternative if needed.',
          semanticSignals: ['safe'],
          packaging: {
            style: 'minimal',
            colors: 'navy',
            materials: 'paper',
            avoid: 'white',
          },
          card: {
            tone: 'warm',
            opener: 'Hello',
            body: 'Best wishes',
            closing: 'Regards',
          },
        },
      },
      'Japan',
      {
        itemKey: 'tea',
        itemZh: '茶礼',
        itemEn: 'Tea Set',
        category: 'tea',
        confidence: 0.9,
      },
    )

    expect(result.analysis?.country).toBe('Japan')
    expect(result.analysis?.score.phonetic).toBe(88)
    expect(result.missingFields).toEqual([])
  })

  it('merges nested patch records recursively', () => {
    const merged = mergeModelOutputRecords(
      {
        score: { phonetic: 88, symbol: 76 },
        card: { tone: 'warm', opener: 'Hello' },
      },
      {
        score: { color: 64 },
        card: { body: 'Best wishes' },
      },
    )

    expect(merged).toEqual({
      score: { phonetic: 88, symbol: 76, color: 64 },
      card: { tone: 'warm', opener: 'Hello', body: 'Best wishes' },
    })
  })
})
