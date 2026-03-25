/**
 * P2: Wide & Deep Recommendation Model
 * Combines memorization (wide component) and generalization (deep component)
 * for hybrid recommendation system
 * 
 * Based on: "Wide & Deep Learning for Recommender Systems" (Google, 2016)
 * 
 * Features:
 * - Wide component: captures item-user interactions directly
 * - Deep component: learns embeddings for cross-feature interactions
 * - Cross-feature processing: user profile + gift attributes + context
 * - Model serving infrastructure
 */

import type { AudienceProfileInput, RecommendationItem } from '@/lib/p0-types'
import type { GiftProfile } from '@/lib/gift-profile'

export interface FeatureEmbedding {
  featureName: string
  embedding: number[] // Dimension typically 8-64
  metadata?: Record<string, unknown>
}

export interface DeepModelInput {
  userEmbedding: number[]
  contextEmbedding: number[]
  giftEmbedding: number[]
  crossFeatures: number[][]
}

export interface WideModelInput {
  userId: string
  giftId: string
  contextId: string
  historicalInteractions: Array<{
    giftId: string
    rating: number
  }>
}

export interface WideDeepPrediction {
  wideScore: number // Direct memorization
  deepScore: number // Generalization
  combinedScore: number // Final recommendation score
  confidence: number // 0-1
  featureImportance: Record<string, number>
}

export interface ModelConfig {
  embeddingDim: number
  deepLayers: number[]
  learningRate: number
  wideWeight: number
  deepWeight: number
}

/**
 * Wide component: learns direct item-user interactions (memorization)
 * Maps (user_id, gift_id, context) -> recommendation score
 */
export function wideComponentScore(input: WideModelInput, _config: ModelConfig): number {
  // In production: use trained model weights stored in database
  // For now: simulated scoring based on historical patterns

  let score = 0.5 // Base score

  // Boost if gift was liked before
  const recentPositive = input.historicalInteractions
    .filter(interaction => interaction.rating >= 4)
    .slice(-5) // Last 5 interactions

  if (recentPositive.some(i => i.giftId === input.giftId)) {
    score += 0.2 // Strong signal if exact match
  }

  // Similar category boost
  if (recentPositive.length > 0) {
    // Would compare gift categories in production
    score += 0.1
  }

  return Math.min(1, score)
}

/**
 * Create feature embeddings from user profile
 * Maps categorical/continuous features to dense vectors
 */
export function createUserEmbedding(
  userProfile: AudienceProfileInput,
  embeddingDim: number,
): FeatureEmbedding {
  // Simplified: deterministic hash-based embedding
  // In production: load pre-trained embeddings from model
  const embedding: number[] = []

  const features = `${userProfile.group}:${userProfile.occupation || 'unknown'}:${userProfile.relationship || 'general'}`
  let hash = 0
  for (let i = 0; i < features.length; i++) {
    hash = (hash << 5) - hash + features.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit
  }

  for (let i = 0; i < embeddingDim; i++) {
    // Generate deterministic but varied embedding values
    const seed = (hash ^ i) >>> 0
    embedding.push((((seed * 214013 + 2531011) >>> 0) % 32768) / 32768)
  }

  return {
    featureName: 'user_profile',
    embedding,
    metadata: { profile_hash: hash },
  }
}

/**
 * Create feature embeddings from gift attributes
 */
export function createGiftEmbedding(gift: GiftProfile, embeddingDim: number): FeatureEmbedding {
  const embedding: number[] = []

  const features = `${gift.category}:${gift.styles.join(',')}:${gift.colors.join(',')}`
  let hash = 0
  for (let i = 0; i < features.length; i++) {
    hash = (hash << 5) - hash + features.charCodeAt(i)
    hash = hash & hash
  }

  for (let i = 0; i < embeddingDim; i++) {
    const seed = (hash ^ i) >>> 0
    embedding.push((((seed * 214013 + 2531011) >>> 0) % 32768) / 32768)
  }

  return {
    featureName: 'gift_attributes',
    embedding,
    metadata: {
      category: gift.category,
      materialCount: gift.materials.length,
      styleCount: gift.styles.length,
      tagCount: gift.semanticTags.length,
    },
  }
}

/**
 * Create context embedding (occasion, country, season, etc.)
 */
export function createContextEmbedding(
  occasion: string,
  country: string,
  season: string,
  embeddingDim: number,
): FeatureEmbedding {
  const embedding: number[] = []

  const features = `${occasion}:${country}:${season}`
  let hash = 0
  for (let i = 0; i < features.length; i++) {
    hash = (hash << 5) - hash + features.charCodeAt(i)
    hash = hash & hash
  }

  for (let i = 0; i < embeddingDim; i++) {
    const seed = (hash ^ i) >>> 0
    embedding.push((((seed * 214013 + 2531011) >>> 0) % 32768) / 32768)
  }

  return {
    featureName: 'context',
    embedding,
    metadata: { occasion, country, season },
  }
}

/**
 * Compute cross-feature interactions using element-wise multiplication
 */
export function computeCrossFeatures(
  userEmb: number[],
  giftEmb: number[],
  contextEmb: number[],
): number[][] {
  const crossFeatures: number[][] = []

  // User-Gift interaction
  const userGiftCross: number[] = []
  for (let i = 0; i < userEmb.length; i++) {
    userGiftCross.push(userEmb[i] * giftEmb[i])
  }
  crossFeatures.push(userGiftCross)

  // User-Context interaction
  const userContextCross: number[] = []
  for (let i = 0; i < userEmb.length; i++) {
    userContextCross.push(userEmb[i] * contextEmb[i])
  }
  crossFeatures.push(userContextCross)

  // Gift-Context interaction
  const giftContextCross: number[] = []
  for (let i = 0; i < giftEmb.length; i++) {
    giftContextCross.push(giftEmb[i] * contextEmb[i])
  }
  crossFeatures.push(giftContextCross)

  return crossFeatures
}

/**
 * Deep component: neural network that learns feature interactions
 * Input: concatenated embeddings -> Hidden layers -> Output score
 */
export function deepComponentScore(input: DeepModelInput, config: ModelConfig): number {
  // Flatten inputs
  let featureVector: number[] = [
    ...input.userEmbedding,
    ...input.contextEmbedding,
    ...input.giftEmbedding,
  ]

  // Add cross-features
  for (const cross of input.crossFeatures) {
    featureVector = [...featureVector, ...cross]
  }

  // Simplified forward pass through deep layers
  // In production: use actual trained weights
  let hidden = featureVector

  for (const layerSize of config.deepLayers) {
    // Simulate hidden layer transformation with ReLU activation
    const nextHidden: number[] = []

    for (let i = 0; i < layerSize; i++) {
      const sum = hidden.reduce((acc, val, idx) => {
        // Deterministic "weight" based on indices
        const weight = Math.sin((idx + 1) * (i + 1) * 0.1) * 0.5
        return acc + val * weight
      }, 0.1) // Bias term
      // ReLU activation
      nextHidden.push(Math.max(0, sum))
    }

    hidden = nextHidden
  }

  // Output layer: sigmoid for probability
  const logits = hidden.reduce((sum, val) => sum + val, 0) / Math.max(1, hidden.length)
  const score = 1 / (1 + Math.exp(-logits)) // Sigmoid

  return score
}

/**
 * Combine wide and deep scores
 */
export function wideDeepPredict(
  userProfile: AudienceProfileInput,
  gift: GiftProfile,
  occasion: string,
  country: string,
  historicalInteractions: Array<{ giftId: string; rating: number }> = [],
  config: ModelConfig = {
    embeddingDim: 16,
    deepLayers: [32, 16, 8],
    learningRate: 0.001,
    wideWeight: 0.3,
    deepWeight: 0.7,
  },
): WideDeepPrediction {
  // Wide component
  const wideScore = wideComponentScore(
    {
      userId: userProfile.group,
      giftId: gift.displayName,
      contextId: `${occasion}:${country}`,
      historicalInteractions,
    },
    config,
  )

  // Deep component
  const userEmbedding = createUserEmbedding(userProfile, config.embeddingDim)
  const giftEmbedding = createGiftEmbedding(gift, config.embeddingDim)
  const contextEmbedding = createContextEmbedding(occasion, country, 'general', config.embeddingDim)

  const crossFeatures = computeCrossFeatures(userEmbedding.embedding, giftEmbedding.embedding, contextEmbedding.embedding)

  const deepScore = deepComponentScore(
    {
      userEmbedding: userEmbedding.embedding,
      contextEmbedding: contextEmbedding.embedding,
      giftEmbedding: giftEmbedding.embedding,
      crossFeatures,
    },
    config,
  )

  // Combine scores
  const combinedScore = wideScore * config.wideWeight + deepScore * config.deepWeight

  // Feature importance (simplified)
  const featureImportance: Record<string, number> = {
    user_profile: 0.3,
    gift_category: 0.25,
    occasion: 0.2,
    cultural_fit: 0.15,
    price_range: 0.1,
  }

  return {
    wideScore,
    deepScore,
    combinedScore,
    confidence: Math.min(0.95, 0.5 + (combinedScore * 0.4)), // Higher scores = higher confidence
    featureImportance,
  }
}

/**
 * Re-rank recommendations using wide & deep model
 */
export function rerankWithWideDeep(
  p1Recommendations: RecommendationItem[],
  userProfile: AudienceProfileInput,
  giftProfiles: Record<string, GiftProfile>,
  occasion: string,
  country: string,
  historicalInteractions: Array<{ giftId: string; rating: number }> = [],
): RecommendationItem[] {
  return p1Recommendations
    .map(rec => {
      const gift = giftProfiles[rec.id]
      if (!gift) return rec

      const prediction = wideDeepPredict(
        userProfile,
        gift,
        occasion,
        country,
        historicalInteractions,
      )

      return {
        ...rec,
        score: Math.round(prediction.combinedScore * 100),
        reasonZh: `${rec.reasonZh}（深度学习排名: ${prediction.combinedScore.toFixed(2)}）`,
        reasonEn: `${rec.reasonEn} (Deep ranking: ${prediction.combinedScore.toFixed(2)})`,
      }
    })
    .sort((a, b) => b.score - a.score)
}

/**
 * Model serving endpoint (mock)
 */
export function serveWideDeepModel(
  userProfile: AudienceProfileInput,
  candidates: GiftProfile[],
  occasion: string,
  country: string,
): Array<{ giftId: string; score: number }> {
  return candidates
    .map((gift) => {
      const prediction = wideDeepPredict(userProfile, gift, occasion, country)
      return {
        giftId: gift.displayName,
        score: prediction.combinedScore,
      }
    })
    .sort((a, b) => b.score - a.score)
}
