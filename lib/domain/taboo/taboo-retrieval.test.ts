import { retrieveTabooHits } from '@/lib/domain/taboo/taboo-retrieval'

describe('taboo retrieval', () => {
  it('returns ranked hits from normalized corpus', () => {
    const hits = retrieveTabooHits({
      countryCode: 'JP',
      giftName: '手帕',
      giftProfile: {
        displayName: '手帕礼盒',
        searchableText: '手帕 礼物',
        category: '手帕',
        materials: ['棉'],
        styles: ['简约'],
        colors: ['白色'],
        numbers: [],
        brandTokens: [],
        semanticTags: ['礼赠'],
      },
      audience: {
        group: 'peer',
        sceneTemplate: 'social',
        relationship: 'friend',
        occasion: 'visit',
        purpose: 'greeting',
      },
      maxHits: 5,
    })

    expect(Array.isArray(hits)).toBe(true)
    expect(hits.length).toBeLessThanOrEqual(5)
    for (const hit of hits) {
      expect(hit.score).toBeGreaterThanOrEqual(6)
      expect(hit.taboo.length).toBeGreaterThan(0)
      expect(hit.reason.length).toBeGreaterThan(0)
    }
  })
})
