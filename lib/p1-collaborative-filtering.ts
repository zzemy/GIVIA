/**
 * P1: Recommendation Engine V2
 * Upgrade from simple rule-based to collaborative filtering + similarity matching
 * 
 * Features:
 * - Collaborative filtering: Learn from similar user profiles and past decisions
 * - Tag-based similarity: Recommend gifts similar to previously liked items
 * - Multi-factor scoring: Budget + occasion + recipient + cultural fit + similarity
 */

import type { AudienceProfileInput, RecommendationItem } from '@/lib/p0-types'
import type { GiftProfile } from '@/lib/gift-profile'

export interface UserPreference {
  userId: string
  giftId: string
  rating: number // 1-5
  context: {
    recipientGroup: string
    occasion: string
    country: string
  }
  timestamp: number
}

export interface GiftEmbedding {
  giftId: string
  category: string
  tags: string[]
  styles: string[]
  colors: string[]
  priceRange: [number, number]
  vector: number[] // Simplified embedding representation
}

export interface CollaborativeFilteringScore {
  similarUsersRating: number
  similarItemsRating: number
  contextAlignment: number
  overallScore: number
}

/**
 * Compute similarity between two sets of tags (Jaccard similarity)
 */
// Compute similarity between two sets of tags using Jaccard similarity coefficient
function computeTagSimilarity(tags1: string[], tags2: string[]): number {
  const set1 = new Set(tags1)
  const set2 = new Set(tags2)

  const intersection = [...set1].filter(tag => set2.has(tag)).length
  const union = new Set([...set1, ...set2]).size

  return union === 0 ? 0 : intersection / union
}

/**
 * Find similar recommendations based on tag similarity
 */
export function findSimilarItems(
  targetGift: GiftEmbedding,
  allGifts: GiftEmbedding[],
  limit: number = 5,
): Array<{ giftId: string; similarity: number }> {
  return allGifts
    .filter(gift => gift.giftId !== targetGift.giftId)
    .map(gift => ({
      giftId: gift.giftId,
      similarity: computeTagSimilarity([...targetGift.tags, ...targetGift.styles], [
        ...gift.tags,
        ...gift.styles,
      ]),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

/**
 * Compute collaborative filtering score based on similar users' preferences
 */
export function computeCollaborativeScore(
  userProfile: AudienceProfileInput,
  giftProfile: GiftProfile,
  userPreferences: UserPreference[],
  allGifts: GiftEmbedding[],
): CollaborativeFilteringScore {
  // Find users with similar context
  const similarContextPrefs = userPreferences.filter(
    pref =>
      (pref.context.recipientGroup === userProfile.group ||
        pref.context.occasion === userProfile.occasion ||
        pref.context.country === giftProfile.category) &&
      pref.rating >= 4, // Only look at positive ratings
  )

  // Average rating from similar users
  const similarUsersRating =
    similarContextPrefs.length > 0
      ? similarContextPrefs.reduce((sum, pref) => sum + pref.rating, 0) / similarContextPrefs.length / 5 // Normalize to 0-1
      : 0.5

  // Find items similar to high-rated items from similar users
  const highRatedGifts = userPreferences
    .filter(pref => pref.rating >= 4)
    .map(pref => allGifts.find(g => g.giftId === pref.giftId))
    .filter(Boolean) as GiftEmbedding[]

  const similarGiftScores = highRatedGifts
    .map(
      highRatedGift =>
        computeTagSimilarity([...highRatedGift.tags, ...highRatedGift.styles], [
          ...giftProfile.semanticTags,
          ...giftProfile.styles,
        ]),
    )
    .slice(0, 5)

  const similarItemsRating =
    similarGiftScores.length > 0 ? similarGiftScores.reduce((a, b) => a + b, 0) / similarGiftScores.length : 0.5

  // Context alignment: how well does this gift match the user's stated preferences
  const contextAlignment = 0.6 // Placeholder: would be computed from explicit preferences

  return {
    similarUsersRating,
    similarItemsRating,
    contextAlignment,
    overallScore: (similarUsersRating * 0.4 + similarItemsRating * 0.35 + contextAlignment * 0.25) * 100,
  }
}

/**
 * Re-score recommendations using collaborative filtering (upgrades P0 Top3)
 */
export function rerankWithCollaborativeFiltering(
  p0Recommendations: RecommendationItem[],
  userProfile: AudienceProfileInput,
  giftProfile: GiftProfile,
  userPreferences: UserPreference[] = [], // In production, loaded from user history
  allGifts: GiftEmbedding[] = [], // In production, loaded from gift catalog
): RecommendationItem[] {
  return p0Recommendations.map((rec) => {

    const collabScore = computeCollaborativeScore(userProfile, giftProfile, userPreferences, allGifts)

    // Blend original P0 score with collaborative score
    const blendedScore = Math.round(rec.score * 0.6 + collabScore.overallScore * 0.4)

    return {
      ...rec,
      score: blendedScore,
      reasonZh: `${rec.reasonZh}（与相似用户的选择相符度 ${Math.round(collabScore.similarUsersRating * 100)}%）`,
      reasonEn: `${rec.reasonEn} (${Math.round(collabScore.similarUsersRating * 100)}% match with similar users)`,
    }
  })
}

/**
 * Suggest gifts based on collaborative filtering (new feature for P1)
 */
export function suggestByCollaborativeFiltering(
  userProfile: AudienceProfileInput,
  userPreferences: UserPreference[] = [],
  candidateGifts: RecommendationItem[] = [],
): RecommendationItem[] {
  // Group preferences by recipient group and occasion
  const preferenceGroups = userPreferences.reduce(
    (groups, pref) => {
      const key = `${pref.context.recipientGroup}:${pref.context.occasion}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(pref)
      return groups
    },
    {} as Record<string, UserPreference[]>,
  )

  // Find the most similar group to current user
  const currentKey = `${userProfile.group}:${userProfile.occasion || 'general'}`
  const similarGroups = Object.entries(preferenceGroups)
    .filter(([key]) => key === currentKey || key.startsWith(userProfile.group + ':'))
    .map(([_, prefs]) => prefs)
    .flat()

  if (similarGroups.length === 0) {
    return [] // No collaborative data yet
  }

  // Get high-rated gifts from similar contexts
  const highRatedGiftIds = new Set(
    similarGroups.filter(pref => pref.rating >= 4).map(pref => pref.giftId),
  )

  // Return candidate gifts that were rated high by similar users
  return candidateGifts
    .filter(gift => highRatedGiftIds.has(gift.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

/**
 * Store user's gift evaluation for future collaborative filtering
 */
export function recordUserFeedback(
  userId: string,
  giftId: string,
  rating: number,
  context: AudienceProfileInput,
  country: string,
): UserPreference {
  return {
    userId,
    giftId,
    rating: Math.max(1, Math.min(5, rating)),
    context: {
      recipientGroup: context.group || 'peer',
      occasion: context.occasion || 'general',
      country,
    },
    timestamp: Date.now(),
  }
}
