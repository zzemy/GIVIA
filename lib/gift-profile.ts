import type { GiftContextInput } from '@/lib/p0-types'

type MinimalRecognition = {
  itemKey?: string
  itemZh?: string
  itemEn?: string
  category?: string
}

export interface GiftProfile {
  displayName: string
  category: string
  materials: string[]
  styles: string[]
  colors: string[]
  numbers: number[]
  semanticTags: string[]
  brandTokens: string[]
  searchableText: string
}

const CATEGORY_KEYWORDS: Array<{ category: string; keywords: string[] }> = [
  { category: 'clock', keywords: ['clock', 'watch', '钟', '表'] },
  { category: 'umbrella', keywords: ['umbrella', '雨伞', '伞'] },
  { category: 'knife', keywords: ['knife', 'scissors', '刀', '剪刀', 'blade'] },
  { category: 'perfume', keywords: ['perfume', 'fragrance', '香水'] },
  { category: 'tea', keywords: ['tea', '茶具', '茶礼', '茶', 'teaware'] },
  { category: 'stationery', keywords: ['pen', 'fountain pen', 'notebook', 'paper', '钢笔', '笔记本', '书签'] },
  { category: 'coffee', keywords: ['coffee', '咖啡'] },
  { category: 'gourmet', keywords: ['chocolate', 'dates', 'nuts', 'snack', 'gift box', '巧克力', '坚果', '椰枣', '礼盒'] },
  { category: 'home', keywords: ['mug', 'cup', 'ceramic', 'diffuser', '马克杯', '杯子', '陶瓷', '香薰'] },
  { category: 'accessories', keywords: ['scarf', 'wallet', 'silk', '围巾', '钱包', '真丝'] },
]

const COLOR_KEYWORDS = [
  ['black', '黑色'],
  ['white', '白色'],
  ['red', '红色'],
  ['green', '绿色'],
  ['blue', '蓝色'],
  ['gold', '金色'],
  ['silver', '银色'],
  ['pink', '粉色'],
  ['grey', 'gray', '灰色'],
] as const

const MATERIAL_KEYWORDS = [
  ['metal', '金属'],
  ['ceramic', '陶瓷'],
  ['glass', '玻璃'],
  ['wood', '木', '木质'],
  ['leather', '皮', '皮质'],
  ['paper', '纸'],
  ['silk', '丝', '真丝'],
  ['fabric', '布', '织物'],
] as const

const STYLE_KEYWORDS = [
  ['business', '商务', 'professional', 'formal'],
  ['minimal', '简约', 'clean'],
  ['premium', '高端', 'premium', 'luxury', 'luxurious'],
  ['warm', '温暖', 'cozy'],
  ['traditional', '传统', 'ceremony'],
  ['romantic', 'romantic', '浪漫'],
  ['practical', 'practical', '实用'],
] as const

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function collectKeywordHits(source: string, entries: readonly (readonly string[])[]): string[] {
  const lower = source.toLowerCase()
  const hits: string[] = []

  entries.forEach(entry => {
    if (entry.some(keyword => lower.includes(keyword.toLowerCase()))) {
      hits.push(entry[0])
    }
  })

  return dedupe(hits)
}

function detectCategory(source: string, recognition?: MinimalRecognition | null): string {
  const recognitionCategory = recognition?.category?.trim().toLowerCase()

  if (recognitionCategory) {
    if (recognitionCategory === 'food') return 'gourmet'
    if (recognitionCategory === 'lifestyle') return 'accessories'
    if (recognitionCategory === 'home') return 'home'
    return recognitionCategory
  }

  const lower = source.toLowerCase()
  const matched = CATEGORY_KEYWORDS.find(entry =>
    entry.keywords.some(keyword => lower.includes(keyword.toLowerCase())),
  )

  return matched?.category ?? 'general'
}

function detectBrandTokens(source: string): string[] {
  const matches = source.match(/\b[A-Z][A-Za-z0-9-]{2,}\b/g) ?? []
  return dedupe(matches).slice(0, 4)
}

function detectNumbers(source: string): number[] {
  const matches = source.match(/\d+/g) ?? []
  return Array.from(
    new Set(
      matches
        .map(item => Number.parseInt(item, 10))
        .filter(item => Number.isFinite(item)),
    ),
  ).slice(0, 6)
}

export function buildGiftProfile(input: {
  recognition?: MinimalRecognition | null
  giftContext?: GiftContextInput | null
}): GiftProfile {
  const recognition = input.recognition ?? null
  const giftContext = input.giftContext ?? {}
  const searchableText = [
    recognition?.itemZh,
    recognition?.itemEn,
    recognition?.category,
    giftContext.name,
    giftContext.description,
    giftContext.visionLabel,
    giftContext.visionDescription,
    ...(giftContext.rawLabels ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  const displayName =
    giftContext.name?.trim() ||
    giftContext.visionLabel?.trim() ||
    recognition?.itemZh?.trim() ||
    recognition?.itemEn?.trim() ||
    '未命名礼物'

  const category = detectCategory(searchableText, recognition)
  const colors = collectKeywordHits(searchableText, COLOR_KEYWORDS)
  const materials = collectKeywordHits(searchableText, MATERIAL_KEYWORDS)
  const styles = collectKeywordHits(searchableText, STYLE_KEYWORDS)
  const numbers = detectNumbers(searchableText)
  const brandTokens = detectBrandTokens(searchableText)

  const semanticTags = dedupe([
    category,
    ...colors,
    ...materials,
    ...styles,
    ...brandTokens.map(token => `brand:${token}`),
  ]).slice(0, 10)

  return {
    displayName,
    category,
    materials,
    styles,
    colors,
    numbers,
    semanticTags,
    brandTokens,
    searchableText,
  }
}
