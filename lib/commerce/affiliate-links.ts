import type { P0Locale } from '@/lib/types/gifting-types'

type AffiliateMarketConfig = {
  baseUrl: string
  affiliateTagEnv?: string
}

const AFFILIATE_MARKET_MAP: Record<string, AffiliateMarketConfig> = {
  US: {
    baseUrl: 'https://www.amazon.com/s',
    affiliateTagEnv: 'AFFILIATE_AMAZON_TAG_US',
  },
  JP: {
    baseUrl: 'https://www.amazon.co.jp/s',
    affiliateTagEnv: 'AFFILIATE_AMAZON_TAG_JP',
  },
  FR: {
    baseUrl: 'https://www.amazon.fr/s',
    affiliateTagEnv: 'AFFILIATE_AMAZON_TAG_FR',
  },
  DE: {
    baseUrl: 'https://www.amazon.de/s',
    affiliateTagEnv: 'AFFILIATE_AMAZON_TAG_DE',
  },
  UK: {
    baseUrl: 'https://www.amazon.co.uk/s',
    affiliateTagEnv: 'AFFILIATE_AMAZON_TAG_UK',
  },
  CN: {
    baseUrl: 'https://search.jd.com/Search',
  },
}

function normalizeQuery(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

export function buildAffiliatePurchaseUrl(input: {
  countryCode: string
  locale: P0Locale
  keywords: string[]
}): {
  purchaseUrl: string
  purchaseChannel: string
} | null {
  const countryCode = input.countryCode.trim().toUpperCase() || 'US'
  const market = AFFILIATE_MARKET_MAP[countryCode] ?? AFFILIATE_MARKET_MAP.US
  const joinedKeywords = normalizeQuery(input.keywords.filter(Boolean).join(' '))

  if (!joinedKeywords) {
    return null
  }

  const params = new URLSearchParams()
  params.set('k', joinedKeywords)
  params.set('utm_source', 'cross-border-ai-engine')
  params.set('utm_medium', 'recommendation')
  params.set('utm_campaign', input.locale === 'zh' ? 'gift-zh' : 'gift-en')

  if (market.affiliateTagEnv) {
    const affiliateTag = process.env[market.affiliateTagEnv]?.trim()
    if (affiliateTag) {
      params.set('tag', affiliateTag)
    }
  }

  const purchaseUrl = `${market.baseUrl}?${params.toString()}`
  const purchaseChannel = countryCode === 'CN' ? 'jd-search' : 'amazon-search'

  return {
    purchaseUrl,
    purchaseChannel,
  }
}