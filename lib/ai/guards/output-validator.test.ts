import {
  validateAnalysisOutput,
  validateRiskEnhancementOutput,
  validateVisionModelOutput,
} from '@/lib/ai/guards/output-validator'

describe('output validator', () => {
  it('accepts valid vision output', () => {
    const result = validateVisionModelOutput({
      label: 'ceramic mug',
      description: 'A ceramic mug for daily drinks.',
      confidence: 0.82,
      synonyms: ['coffee cup'],
    })

    expect(result.ok).toBe(true)
  })

  it('rejects unexpected keys in vision output', () => {
    const result = validateVisionModelOutput({
      label: 'ceramic mug',
      description: 'A ceramic mug for daily drinks.',
      confidence: 0.82,
      synonyms: ['coffee cup'],
      script: 'alert(1)',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors[0]).toContain('unexpected keys')
    }
  })

  it('rejects overlong analysis strings and wrong enum values', () => {
    const result = validateAnalysisOutput({
      country: 'Japan',
      recognition: {
        itemKey: 'clock',
        itemZh: '钟表',
        itemEn: 'Clock',
        category: 'Home',
        confidence: 0.91,
      },
      score: {
        phonetic: 80,
        symbol: 82,
        color: 40,
      },
      fitScore: 62,
      riskLevel: 'Extreme',
      isTaboo: true,
      warning: 'x'.repeat(3000),
      rescueItem: 'Tea Set',
      rescueReason: 'Safer replacement',
      semanticSignals: ['taboo'],
      packaging: {
        style: 'minimal',
        colors: 'navy',
        materials: 'paper',
        avoid: 'white',
      },
      card: {
        tone: 'formal',
        opener: 'Hello',
        body: 'Best wishes',
        closing: 'Regards',
      },
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join('\n')).toContain('riskLevel must be one of')
      expect(result.errors.join('\n')).toContain('warning exceeds max length')
    }
  })

  it('accepts valid llm enhancement output', () => {
    const result = validateRiskEnhancementOutput({
      semanticExplanation: 'This gift can imply countdown symbolism in the local context.',
      personalizedMitigation: 'Use warmer language and switch to neutral packaging.',
      alternativeFraming: 'Frame it as a milestone gift rather than a time marker.',
      culturalContext: 'The symbolism connects to historical mourning associations.',
      confidence: 0.84,
    })

    expect(result.ok).toBe(true)
  })
})
