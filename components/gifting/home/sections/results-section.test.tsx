import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResultsSection } from './results-section'
import type { AnalysisResult } from '@/components/gifting/home/types'

const analysis: AnalysisResult = {
  fitScore: 62,
  riskScore: 78,
  scoreBreakdown: {
    phonetic: 40,
    symbol: 70,
    color: 55,
  },
  riskLevel: 'High',
  isTaboo: true,
  warning: 'Avoid direct gifting without changes',
  rescueItem: 'Neutral leather notebook',
  rescueReason: 'Safer and still premium for formal gifting',
  packaging: {
    style: 'Minimal',
    colors: ['navy', 'champagne'],
    materials: 'paper',
    avoid: ['white chrysanthemums'],
  },
  greetingCard: {
    tone: 'Warm and formal',
    opener: 'Thank you for your partnership.',
    body: 'Wishing you continued success.',
    closing: 'With respect',
  },
  semanticSignals: {
    tags: ['luxury', 'formal'],
    flowers: [],
    numbers: [8],
  },
  matchedRules: [],
  recommendations: [
    {
      id: 'alt-1',
      nameZh: '中性皮质笔记本',
      nameEn: 'Neutral leather notebook',
      category: 'Business',
      score: 92,
      reasonZh: '更稳妥且保留高级感。',
      reasonEn: 'Safer while keeping a premium tone.',
      packagingTipZh: '使用海军蓝和香槟金包装。',
      packagingTipEn: 'Use navy and champagne packaging.',
      shippingNoteZh: '避免节日前最后一刻寄送。',
      shippingNoteEn: 'Avoid last-minute holiday shipping.',
      pitchZh: '这是一份兼顾得体与高级感的礼物。',
      pitchEn: 'This keeps the gift polished and appropriate.',
    },
  ],
  giftProfile: {
    displayName: 'Silk scarf',
    category: 'Accessory',
    materials: ['silk'],
    styles: ['formal'],
    colors: ['red'],
    numbers: [],
    brandTokens: ['luxury'],
    semanticTags: ['luxury'],
  },
}

describe('ResultsSection', () => {
  it('reserves a recommendation-first advisor summary area for results', () => {
    render(
      <ResultsSection
        analysis={analysis}
        analysisEnhancements={null}
        analysisSource="hybrid-ai-rules"
        locale="zh"
        t={(path: string) => path}
        selectedCountry="JP"
        selectedAudienceLabel="商务客户"
        sceneLabel="节日拜访"
        visionDescription=""
        giftDescription="真丝围巾"
        targetProfile="高管，重视礼仪"
        hasAnalysisEnhancementResults={false}
        favoriteRecommendationIds={[]}
        riskReasons={['红色在该场景下容易造成误读']}
        mustSendAdvice={['如必须赠送，请改用中性色包装并调整表达方式']}
        riskActionMeta={{
          title: '高风险处理建议',
          tooltip: '避免直接按原方案送出',
          panelClassName: 'border-red-500/30 bg-red-500/10',
          textClassName: 'text-red-100',
        }}
        formatCurrencyAmount={(value: number) => String(value)}
        onReset={() => {}}
        onToggleFavoriteRecommendation={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: /开启下一份终稿/i })).toBeInTheDocument()
    const summaryHeading = screen.getByRole('heading', { name: /这份心意此刻不宜按原样送出/i })
    const recommendationsHeading = screen.getByRole('heading', { name: /如果要把这份心意改写得更克制、更高级、更妥帖/i })
    const supportingAnalysisLabel = screen.getByText(/语境纪要|context memorandum/i)

    expect(summaryHeading.compareDocumentPosition(recommendationsHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(summaryHeading.compareDocumentPosition(supportingAnalysisLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText(/当前结论/i)).toBeInTheDocument()
    expect(screen.getByText(/High/i)).toBeInTheDocument()
  })
})
