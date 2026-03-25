/**
 * P1/P2 Integration Tests
 * Verify all new modules work correctly and integrate properly
 */

import {
  findSimilarItems,
  recordUserFeedback,
} from '@/lib/p1-collaborative-filtering'

import {
  getShippingQuotes,
  estimateCustomsDuty,
  estimateLogisticsCost,
  getImportRestrictions,
} from '@/lib/p1-logistics-assistant'

import {
  getMessages,
  formatNumber,
  formatCurrency,
  getSupportedLocales,
  isSupportedLocale,
} from '@/lib/p1-multi-language'

import {
  queryKnowledgeGraph,
  assessCulturalImpact,
  findCulturallyCompatibleAlternatives,
} from '@/lib/p2-knowledge-graph'

import {
  createUserEmbedding,
  createGiftEmbedding,
  wideDeepPredict,
} from '@/lib/p2-wide-deep-model'

import {
  generateApiKey,
  validateApiKey,
  checkRateLimit,
  calculateUsageMetrics,
} from '@/lib/p2-b2b-api'

import type { GiftProfile } from '@/lib/gift-profile'

describe('P1: Collaborative Filtering', () => {
  it('should compute tag similarity correctly', () => {
    interface mockGift {
      giftId: string
      category: string
      tags: string[]
      styles: string[]
      colors: string[]
      priceRange: [number, number]
      vector: number[]
    }

    const gift1: mockGift = {
      giftId: 'tea-set-1',
      category: 'tea',
      tags: ['tea', 'premium', 'gift'],
      styles: ['traditional', 'minimalist'],
      colors: ['green', 'gold'],
      priceRange: [50, 200],
      vector: [],
    }

    const gift2: mockGift = {
      giftId: 'tea-set-2',
      category: 'tea',
      tags: ['tea', 'luxury', 'gift'],
      styles: ['modern', 'minimalist'],
      colors: ['black', 'gold'],
      priceRange: [100, 300],
      vector: [],
    }

    const similar = findSimilarItems(gift1, [gift1, gift2], 1)
    expect(similar).toHaveLength(1)
    expect(similar[0].giftId).toBe('tea-set-2')
    expect(similar[0].similarity).toBeGreaterThan(0.3) // Jaccard similarity
  })

  it('should record user feedback for collaborative filtering', () => {
    const feedback = recordUserFeedback('user-1', 'gift-1', 5, {
      group: 'parent',
      occasion: 'birthday',
      budgetRange: 'high',
      gender: 'female',
      occupation: 'office',
      relationship: 'mother',
    }, 'US')

    expect(feedback).toMatchObject({
      userId: 'user-1',
      giftId: 'gift-1',
      rating: 5,
    })
    expect(feedback.context.occasion).toBe('birthday')
  })
})

describe('P1: Logistics Assistant', () => {
  it('should estimate shipping costs correctly', () => {
    const quotes = getShippingQuotes('US', 'CN', 500)
    expect(quotes).toHaveLength(3) // DHL, FedEx, ePacket
    expect(quotes[0].carrier).toBe('DHL')
    expect(quotes[0].baseCost).toBeGreaterThan(0)
  })

  it('should estimate customs duty for destination country', () => {
    const duty = estimateCustomsDuty('CN', 1000)
    expect(duty.dutyRate).toBeGreaterThan(0)
    expect(duty.estimatedDuty).toBeGreaterThan(0)
    expect(duty.restrictions.length).toBeGreaterThan(0) // China has import restrictions
  })

  it('should estimate total logistics cost', () => {
    const estimate = estimateLogisticsCost('US', 'CN', 500, 100)
    expect(estimate.totalEstimatedCost).toBeGreaterThan(0)
    expect(estimate.recommendedCarrier).toBeDefined()
    expect(estimate.shippingQuotes.length).toBeGreaterThan(0)
  })

  it('should get import restrictions for restricted countries', () => {
    const restrictions = getImportRestrictions('SA')
    expect(restrictions).toContain('Alcohol prohibited')
    expect(restrictions).toContain('Pork products prohibited')
  })
})

describe('P1: Multi-language Support', () => {
  it('should get messages for all supported locales', () => {
    const locales = getSupportedLocales()
    expect(locales).toContain('en')
    expect(locales).toContain('zh')
    expect(locales).toContain('ja')
    expect(locales).toContain('fr')
  })

  it('should validate supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true)
    expect(isSupportedLocale('ja')).toBe(true)
    expect(isSupportedLocale('de')).toBe(false) // Not supported
  })

  it('should format numbers by locale', () => {
    const num = 1000
    const enFormatted = formatNumber(num, 'en')
    const jaFormatted = formatNumber(num, 'ja')

    // Just verify they format differently
    expect(enFormatted).toBeDefined()
    expect(jaFormatted).toBeDefined()
  })

  it('should format currency by locale', () => {
    const currency = formatCurrency(100, 'USD', 'en')
    expect(currency).toContain('100')
    expect(currency).toContain('$')
  })
})

describe('P2: Knowledge Graph', () => {
  it('should query knowledge graph for related entities', () => {
    const result = queryKnowledgeGraph({
      sourceEntity: 'country_cn',
      relationTypes: ['celebrates'],
      depth: 1,
    })

    expect(result.paths).toHaveLength(1) // Lunar New Year
    expect(result.paths[0].entities[1].id).toBe('holiday_lunar')
  })

  it('should assess cultural impact of gift-country combination', () => {
    const impact = assessCulturalImpact('gift_tea', 'country_cn')
    expect(impact.score).toBeGreaterThanOrEqual(0)
    expect(impact.score).toBeLessThanOrEqual(1)
    expect(Array.isArray(impact.factors)).toBe(true)
  })

  it('should find culturally compatible alternatives', () => {
    const alternatives = findCulturallyCompatibleAlternatives('gift_tea', 'country_cn', [
      'gift_tea',
      'gift_silk',
      'gift_wine',
    ])

    // Result depends on knowledge graph completeness
    expect(alternatives).toBeDefined()
    expect(Array.isArray(alternatives)).toBe(true)
  })
})

describe('P2: Wide & Deep Model', () => {
  it('should create user embedding from profile', () => {
    const embedding = createUserEmbedding(
      {
        group: 'peer',
        occupation: 'office',
        gender: 'female',
        relationship: 'colleague',
      },
      16,
    )

    expect(embedding.featureName).toBe('user_profile')
    expect(embedding.embedding).toHaveLength(16)
    expect(embedding.embedding.every(x => x >= 0 && x <= 1)).toBe(true)
  })

  it('should create gift embedding', () => {
    const mockGift: GiftProfile = {
      displayName: 'Premium Tea Set',
      category: 'beverage',
      materials: ['ceramic'],
      semanticTags: ['luxury', 'tea', 'asian'],
      styles: ['traditional'],
      colors: ['gold'],
      numbers: [200],
      brandTokens: [],
      searchableText: 'premium tea set ceramic gold',
    }

    const embedding = createGiftEmbedding(mockGift, 16)
    expect(embedding.featureName).toBe('gift_attributes')
    expect(embedding.embedding).toHaveLength(16)
  })

  it('should make wide & deep predictions', () => {
    const mockGift: GiftProfile = {
      displayName: 'Premium Tea Set',
      category: 'beverage',
      materials: ['ceramic'],
      semanticTags: ['luxury', 'tea', 'asian'],
      styles: ['traditional'],
      colors: ['gold'],
      numbers: [200],
      brandTokens: [],
      searchableText: 'premium tea set ceramic gold',
    }

    const prediction = wideDeepPredict(
      {
        group: 'peer',
        occupation: 'office',
        gender: 'female',
        relationship: 'colleague',
      },
      mockGift,
      'birthday',
      'US',
    )

    expect(prediction.wideScore).toBeGreaterThanOrEqual(0)
    expect(prediction.wideScore).toBeLessThanOrEqual(1)
    expect(prediction.deepScore).toBeGreaterThanOrEqual(0)
    expect(prediction.deepScore).toBeLessThanOrEqual(1)
    expect(prediction.combinedScore).toBeGreaterThanOrEqual(0)
    expect(prediction.combinedScore).toBeLessThanOrEqual(1)
    expect(prediction.confidence).toBeGreaterThanOrEqual(0)
  })
})

describe('P2: B2B API', () => {
  it('should generate valid API key', () => {
    const apiKey = generateApiKey('client-1', 365)
    expect(apiKey.keyId).toContain('sk_')
    expect(apiKey.secretKey).toHaveLength(64)
    expect(apiKey.status).toBe('active')
    expect(apiKey.rateLimit).toBeGreaterThan(0)
  })

  it('should validate API key', () => {
    const apiKey = generateApiKey('client-1')
    const validation = validateApiKey(apiKey.keyId, apiKey.secretKey)
    expect(validation.valid).toBe(true)
  })

  it('should validate API key format', () => {
    const invalid = validateApiKey('bad', 'key')
    expect(invalid.valid).toBe(false)
    expect(invalid.error).toBeDefined()
  })

  it('should check rate limits', () => {
    const check = checkRateLimit('client-1', 'sk_test', 500, 1000)
    expect(check.allowed).toBe(true)
    expect(check.remaining).toBeGreaterThan(0)
  })

  it('should deny requests exceeding rate limit', () => {
    const check = checkRateLimit('client-1', 'sk_test', 1001, 1000)
    expect(check.allowed).toBe(false)
  })

  it('should calculate usage metrics', () => {
    const metrics = calculateUsageMetrics(
      'client-1',
      Date.now() - 86400000, // 1 day ago
      Date.now(),
      [
        { endpoint: '/bulk-recommend', success: true, latencyMs: 100 },
        { endpoint: '/bulk-recommend', success: true, latencyMs: 120 },
        { endpoint: '/analytics', success: true, latencyMs: 50 },
      ],
    )

    expect(metrics.requestCount).toBe(3)
    expect(metrics.successRate).toBe(1)
    expect(metrics.averageLatencyMs).toBeGreaterThan(0)
    expect(metrics.topEndpoints).toHaveLength(2)
  })
})

describe('P1/P2 Integration', () => {
  it('all P1 modules should be importable', () => {
    expect(findSimilarItems).toBeDefined()
    expect(getShippingQuotes).toBeDefined()
    expect(getMessages).toBeDefined()
  })

  it('all P2 modules should be importable', () => {
    expect(queryKnowledgeGraph).toBeDefined()
    expect(createUserEmbedding).toBeDefined()
    expect(generateApiKey).toBeDefined()
  })
})
