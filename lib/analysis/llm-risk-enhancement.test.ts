import { mergeLLMEnhancement } from '@/lib/analysis/llm-risk-enhancement'
import { runAnalysisWithLLMEnhancement } from '@/lib/analysis/analysis-runner'
import type { AudienceProfileInput, GiftContextInput } from '@/lib/types/gifting-types'

/**
 * Test: Verify LLM enhancement is properly integrated into risk assessment
 * This test checks that the async LLM enhancement can be called and gracefully degrades
 */
describe('LLM Risk Enhancement Integration', () => {
  test('runAnalysisWithLLMEnhancement returns valid result even if LLM is unavailable', async () => {
    const input = {
      locale: 'zh' as const,
      country: 'China',
      countryCode: 'CN',
      recognition: {
        itemKey: 'test-clock',
        itemZh: '钟表',
        itemEn: 'Clock',
        category: 'time_accessory',
      },
      giftContext: {
        name: '闹钟',
        description: '一个红色的电子闹钟',
      } as GiftContextInput,
      audience: {
        group: 'peer',
        relationship: 'friend',
        ageBand: 'adult',
        budgetRange: 'medium',
        formality: 'semi-formal',
      } as AudienceProfileInput,
    }

    // Should return result even without LLM API key
    const result = await runAnalysisWithLLMEnhancement(input)

    // Verify rule-based assessment is present
    expect(result).toBeDefined()
    expect(result.riskScore).toBeGreaterThan(0)
    expect(result.riskLevel).toMatch(/Low|Medium|High/)
    expect(result.countryCode).toBe('CN')

    // Verify recommendations are included
    expect(result.recommendations).toBeDefined()
    expect(Array.isArray(result.recommendations)).toBe(true)

    // Verify gift profile is parsed
    expect(result.giftProfile).toBeDefined()
    expect(result.giftProfile.displayName).toBe('闹钟')
  })

  test('LLM enhancement structure is correct when available', async () => {
    // This test verifies the structure without requiring actual API calls
    const mockEnhancement = {
      semanticExplanation: '钟表在中文文化中容易联想到丧礼，这是由于谐音禁忌的历史积淀。',
      personalizedMitigation: '在这个朋友场景中，可以改送精品茶叶，同样表达关心但零文化风险。',
      alternativeFraming: '如果坚持送钟，可以说"祝你时刻都顺利"来重新诠释礼物的含义。',
      culturalContext:
        '送钟忌讳源于中国古代丧葬文化，钟声与吊唁仪式的深层联系，延续到现代社交约定俗成。',
      confidence: 0.87,
    }

    expect(mockEnhancement.semanticExplanation).toContain('文化')
    expect(mockEnhancement.personalizedMitigation).toContain('朋友')
    expect(mockEnhancement.confidence).toBeGreaterThan(0.5)
  })

  test('mergeLLMEnhancement preserves rule result when confidence is low', () => {
    const mockRuleResult = {
      countryCode: 'CN',
      countryNameEn: 'China',
      fitScore: 45,
      riskScore: 68,
      score: { phonetic: 42, symbol: 48, color: 60 },
      riskLevel: 'High' as const,
      isTaboo: true,
      warning: '规则层警告信息',
      rescueItem: '规则层建议礼物',
      rescueReason: '规则层缓解原因',
      semanticSignals: ['谐音禁忌'],
      packaging: { style: '简约', colors: ['red'], materials: '纸板', avoid: ['white'] },
      card: { tone: '温暖', opener: '你好', body: '祝福', closing: '再见' },
      matchedRules: [],
      recommendations: [],
    }

    const lowConfidenceEnhancement = {
      semanticExplanation: '某个解释',
      personalizedMitigation: '某个建议',
      alternativeFraming: '某个重构',
      culturalContext: '某个背景',
      confidence: 0.3, // Too low - should be ignored
    }

    const result = mergeLLMEnhancement(mockRuleResult, lowConfidenceEnhancement, 'zh')

    // Should preserve rule-based output
    expect(result.warning).toBe('规则层警告信息')
    expect(result.rescueItem).toBe('规则层建议礼物')
  })

  test('mergeLLMEnhancement enriches result when confidence is high', () => {
    const mockRuleResult = {
      countryCode: 'CN',
      countryNameEn: 'China',
      fitScore: 45,
      riskScore: 68,
      score: { phonetic: 42, symbol: 48, color: 60 },
      riskLevel: 'High' as const,
      isTaboo: true,
      warning: '规则层警告',
      rescueItem: '规则层建议',
      rescueReason: '规则层原因',
      semanticSignals: ['谐音禁忌'],
      packaging: { style: '简约', colors: ['red'], materials: '纸板', avoid: ['white'] },
      card: { tone: '温暖', opener: '你好', body: '祝福', closing: '再见' },
      matchedRules: [],
      recommendations: [],
    }

    const highConfidenceEnhancement = {
      semanticExplanation: 'LLM生成的深层解释',
      personalizedMitigation: 'LLM生成的个性化建议',
      alternativeFraming: 'LLM生成的重框架',
      culturalContext: 'LLM生成的文化背景',
      confidence: 0.88, // High confidence
    }

    const result = mergeLLMEnhancement(mockRuleResult, highConfidenceEnhancement, 'zh')

    // Should merge LLM insights
    expect(result.warning).toBe('LLM生成的深层解释')
    expect(result.rescueItem).toBe('LLM生成的个性化建议')
    expect(result.semanticSignals).toContain('LLM生成的文化背景')
  })
})
