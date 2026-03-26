import { buildVisionRecognitionResponse, sanitizeDescription, sanitizeLabel } from '@/lib/ai/transformers/vision-recognition'

describe('vision recognition transformer', () => {
  it('builds a normalized recognition response from validated output', () => {
    const response = buildVisionRecognitionResponse({
      modelOutput: {
        label: 'ceramic mug',
        description: 'A ceramic mug for daily drinks.',
        confidence: 0.82,
        synonyms: ['coffee cup'],
      },
      source: 'aliyun-dashscope-text',
      fallbackConfidence: 0.72,
    })

    expect(response?.source).toBe('aliyun-dashscope-text')
    expect(response?.recognition.itemEn).toBe('ceramic mug')
    expect(response?.rawLabels).toContain('coffee cup')
  })

  it('sanitizes structured text labels and descriptions', () => {
    expect(sanitizeLabel('{"label":"gift box"}', 'fallback')).toBe('gift box')
    expect(
      sanitizeDescription('{"gift":{"description":"A polished gift box."}}', 'fallback'),
    ).toBe('A polished gift box.')
  })
})
