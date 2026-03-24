import { runAnalysis } from '@/lib/analysis-runner'

describe('runAnalysis', () => {
  it('produces high cultural risk for clocks in China', () => {
    const result = runAnalysis({
      locale: 'zh',
      countryCode: 'CN',
      country: 'China',
      recognition: {
        itemKey: 'clock',
        itemZh: '钟表',
        itemEn: 'Clock',
        category: 'clock',
      },
      giftContext: {
        name: '钟表',
        description: '商务拜访礼物，黑色礼盒',
        visionLabel: 'clock',
      },
      audience: {
        group: 'client',
        sceneTemplate: 'business_visit',
        ageBand: 'adult',
        gender: 'neutral',
        occupation: 'office',
        relationship: 'partner',
        occasion: 'business visit',
        purpose: 'business',
        budgetRange: 'high',
        formality: 'formal',
      },
    })

    expect(result.riskLevel).toBe('High')
    expect(result.isTaboo).toBe(true)
    expect(result.matchedRules.some(rule => rule.id === 'cn-clock')).toBe(true)
    expect(result.rescueItem).not.toBe('')
    expect(result.recommendations).toHaveLength(3)
  })

  it('keeps chocolate relatively safe for France birthday gifting', () => {
    const result = runAnalysis({
      locale: 'en',
      countryCode: 'FR',
      country: 'France',
      recognition: {
        itemKey: 'chocolate',
        itemZh: '巧克力礼盒',
        itemEn: 'Chocolate Box',
        category: 'gourmet',
      },
      giftContext: {
        name: 'Chocolate Box',
        description: 'Warm birthday gift with elegant packaging',
        visionLabel: 'chocolate box',
      },
      audience: {
        group: 'peer',
        sceneTemplate: 'birthday',
        ageBand: 'young_adult',
        gender: 'neutral',
        occupation: 'creative',
        relationship: 'friend',
        occasion: 'birthday dinner',
        purpose: 'birthday',
        budgetRange: 'medium',
        formality: 'casual',
      },
    })

    expect(result.riskLevel).not.toBe('High')
    expect(result.fitScore).toBeGreaterThanOrEqual(60)
    expect(result.rescueItem).toBe('')
    expect(result.card.body).toContain('Chocolate Box')
    expect(result.recommendations.length).toBeGreaterThan(0)
  })
})
