import corpus from '@/data/taboos/retrieval/corpus.json'
import type { GiftProfile } from '@/lib/analysis/gift-profile'
import type { AudienceProfileInput } from '@/lib/types/gifting-types'
import type {
  TabooRetrievalCorpus,
  TabooRetrievalHit,
  TabooRetrievalRecord,
} from '@/lib/domain/taboo/taboo-types'

const retrievalCorpus = corpus as TabooRetrievalCorpus

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function splitTerms(input: string): string[] {
  const normalized = normalizeText(input)
  if (!normalized) {
    return []
  }

  const asciiTerms = normalized
    .split(/[^a-z0-9]+/)
    .map(term => term.trim())
    .filter(term => term.length >= 2)

  const cjkTerms = (normalized.match(/[\u4e00-\u9fff]{2,}/g) || []).map(term => term.trim())

  return Array.from(new Set([...asciiTerms, ...cjkTerms]))
}

function buildQueryTerms(input: {
  giftName: string
  giftProfile: GiftProfile
  audience: AudienceProfileInput
}): string[] {
  const queryText = [
    input.giftName,
    input.giftProfile.displayName,
    input.giftProfile.category,
    ...input.giftProfile.materials,
    ...input.giftProfile.styles,
    ...input.giftProfile.colors,
    ...input.giftProfile.semanticTags,
    input.audience.sceneTemplate ?? '',
    input.audience.occasion ?? '',
    input.audience.relationship ?? '',
    input.audience.purpose ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return splitTerms(queryText)
}

function computeHitScore(args: {
  record: TabooRetrievalRecord
  countryCode: string
  giftName: string
  giftCategory: string
  queryTerms: string[]
}): number {
  const normalizedCountry = args.countryCode.trim().toUpperCase()
  const recordCountry = args.record.countryCode.trim().toUpperCase()
  const haystack = normalizeText(
    [args.record.category, args.record.taboo, args.record.reason, args.record.alternative].join(' '),
  )

  let score = 0

  if (recordCountry === normalizedCountry) {
    score += 6
  } else if (recordCountry === 'GLOBAL') {
    score += 2
  }

  const normalizedGiftName = normalizeText(args.giftName)
  if (normalizedGiftName && (haystack.includes(normalizedGiftName) || normalizedGiftName.includes(haystack))) {
    score += 5
  }

  const normalizedCategory = normalizeText(args.giftCategory)
  if (normalizedCategory && haystack.includes(normalizedCategory)) {
    score += 3
  }

  const tokenMatches = args.queryTerms.filter(term => haystack.includes(term)).length
  score += Math.min(tokenMatches, 10)

  score += Math.min(args.record.storyScore, 5) * 0.2

  return score
}

export function retrieveTabooHits(input: {
  countryCode: string
  giftName: string
  giftProfile: GiftProfile
  audience: AudienceProfileInput
  maxHits?: number
}): TabooRetrievalHit[] {
  const maxHits = input.maxHits ?? 4
  const queryTerms = buildQueryTerms(input)

  const scored = retrievalCorpus.records
    .map(record => {
      const score = computeHitScore({
        record,
        countryCode: input.countryCode,
        giftName: input.giftName,
        giftCategory: input.giftProfile.category,
        queryTerms,
      })

      return {
        record,
        score,
      }
    })
    .filter(candidate => candidate.score >= 6)
    .sort((left, right) => right.score - left.score)
    .slice(0, maxHits)

  return scored.map(({ record, score }) => ({
    id: record.id,
    countryCode: record.countryCode,
    category: record.category,
    taboo: record.taboo,
    reason: record.reason,
    alternative: record.alternative,
    source: record.source,
    storyScore: record.storyScore,
    score,
  }))
}