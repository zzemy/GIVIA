import { buildCulturalAnalysisMessages, buildRiskEnhancementPrompt } from '@/lib/ai/prompts/analysis'

describe('analysis prompt builders', () => {
  it('builds cultural analysis messages with explicit prompt sections', () => {
    const messages = buildCulturalAnalysisMessages({
      language: 'zh',
      country: 'Japan',
      recognition: {
        itemKey: 'clock',
        itemZh: '钟表',
        itemEn: 'Clock',
        category: 'Home',
        confidence: 0.92,
      },
      giftContext: {
        name: '商务礼钟',
        description: '红色钟表礼盒',
        visionLabel: 'clock',
        visionDescription: 'red clock gift set',
        source: 'vision',
        rawLabels: ['clock'],
      },
      audience: {
        group: 'client',
        customGroup: '',
        sceneTemplate: 'business',
        ageBand: 'adult',
        gender: 'neutral',
        occupation: 'office',
        relationship: 'partner',
        occasion: 'visit',
        purpose: 'relationship',
        budgetRange: 'medium',
        formality: 'formal',
        notes: 'avoid vague language',
      },
    })

    expect(messages).toHaveLength(2)
    expect(messages[0].content).toContain('## Role / Mission')
    expect(messages[0].content).toContain('## Safety Rules')
    expect(messages[0].content).toContain('## Domain Context')
    expect(messages[0].content).toContain('## Output Contract')
    expect(messages[0].content).toContain('riskLevel 只能是 Low、Medium、High。')
    expect(messages[1].content).toContain('"country": "Japan"')
    expect(messages[1].content).toContain('"task": "请输出极其详尽、深度个性化、充满人文和社会心理学洞察的跨文化礼赠风险分析与建议报告（字数要充足、细节要拉满）"')
  })

  it('builds risk enhancement prompt with explicit sections and JSON contract', () => {
    const prompt = buildRiskEnhancementPrompt({
      locale: 'en',
      countryCode: 'JP',
      countryName: 'Japan',
      giftName: 'Clock',
      giftProfile: {
        displayName: 'Clock',
        searchableText: 'clock minimal red metal time',
        category: 'Home',
        materials: ['metal'],
        styles: ['minimal'],
        colors: ['red'],
        numbers: [],
        brandTokens: [],
        semanticTags: ['time'],
      },
      audience: {
        group: 'client',
        relationship: 'partner',
        ageBand: 'adult',
        occupation: 'office',
        sceneTemplate: 'business',
        formality: 'formal',
      },
      ruleResult: {
        countryCode: 'JP',
        countryNameEn: 'Japan',
        fitScore: 45,
        riskScore: 78,
        score: { phonetic: 70, symbol: 82, color: 40 },
        riskLevel: 'High',
        isTaboo: true,
        warning: 'High symbolism risk',
        rescueItem: 'Tea Set',
        rescueReason: 'Safer replacement',
        semanticSignals: ['taboo'],
        packaging: { style: 'minimal', colors: ['navy'], materials: 'paper', avoid: ['white'] },
        card: { tone: 'formal', opener: 'Hello', body: 'Best wishes', closing: 'Regards' },
        matchedRules: [
          {
            id: 'jp-clock',
            ruleType: 'symbol',
            riskScore: 40,
            explanation: 'Clocks can imply counting down time.',
            suggestion: 'Choose a neutral gift.',
          },
        ],
        recommendations: [],
      },
      retrievalHits: [
        {
          id: 'jp-1',
          countryCode: 'JP',
          category: 'gift',
          taboo: 'Avoid clocks in formal gifting.',
          reason: 'Can imply counting down remaining time.',
          alternative: 'Choose tea set instead.',
          source: 'xlsx',
          storyScore: 4,
          score: 9.2,
        },
      ],
    })

    expect(prompt).toContain('## Role / Mission')
    expect(prompt).toContain('## Safety Rules')
    expect(prompt).toContain('## Domain Context')
    expect(prompt).toContain('## Output Contract')
    expect(prompt).toContain('Return JSON with fields: semanticExplanation, personalizedMitigation, alternativeFraming, culturalContext, confidence.')
    expect(prompt).toContain('Rule-based findings: Clocks can imply counting down time.')
    expect(prompt).toContain('Retrieval-augmented hits (from normalized Excel corpus):')
    expect(prompt).toContain('Avoid clocks in formal gifting.')
  })
})
