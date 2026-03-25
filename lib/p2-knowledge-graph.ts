/**
 * P2: Cultural Knowledge Graph
 * Cross-cultural entity relationships for enhanced insights
 * 
 * Features:
 * - Entity types: Countries, Holidays, Cultures, Taboos, Gifts, Occasions
 * - Relationships: celebrates, avoids, prefers, associated_with, suitable_for
 * - Graph queries for context-aware recommendations
 * - Impact scoring for cultural factors
 */

type GraphLocale = 'en' | 'zh' | 'ja' | 'fr'

export type EntityType = 'country' | 'holiday' | 'culture' | 'taboo' | 'gift' | 'occasion' | 'tradition'

export type RelationType =
  | 'celebrates'
  | 'avoids'
  | 'prefers'
  | 'associated_with'
  | 'suitable_for'
  | 'conflicts_with'
  | 'requires'
  | 'contradicts'

export interface KnowledgeEntity {
  id: string
  type: EntityType
  label: Record<GraphLocale, string>
  description: Record<GraphLocale, string>
  tags: string[]
  metadata: Record<string, unknown>
}

export interface KnowledgeRelation {
  source: string // Entity ID
  target: string // Entity ID
  type: RelationType
  strength: number // 0-1, importance/confidence
  context?: string
  metadata?: Record<string, unknown>
}

export interface GraphQuery {
  sourceEntity: string
  relationTypes: RelationType[]
  depth: number // How many hops to traverse
}

export interface GraphQueryResult {
  paths: Array<{
    entities: KnowledgeEntity[]
    relations: KnowledgeRelation[]
    totalStrength: number
  }>
  summary: string
}

// Cultural knowledge base (partial)
export const culturalEntities: KnowledgeEntity[] = [
  {
    id: 'country_cn',
    type: 'country',
    label: {
      en: 'China',
      zh: '中国',
      ja: '中国',
      fr: '中国',
    },
    description: {
      en: 'People\'s Republic of China',
      zh: '中华人民共和国',
      ja: '中华人民共和国',
      fr: 'République Populaire de Chine',
    },
    tags: ['asian', 'developing', 'collectivist'],
    metadata: { gdp: '17.7T', population: '1.4B' },
  },
  {
    id: 'country_jp',
    type: 'country',
    label: { en: 'Japan', zh: '日本', ja: '日本', fr: 'Japon' },
    description: {
      en: 'Japan',
      zh: '日本',
      ja: '日本',
      fr: 'Japon',
    },
    tags: ['asian', 'developed', 'hierarchical'],
    metadata: { gdp: '4.2T', population: '125M' },
  },
  {
    id: 'country_us',
    type: 'country',
    label: { en: 'United States', zh: '美国', ja: 'アメリカ', fr: 'États-Unis' },
    description: {
      en: 'United States',
      zh: '美国',
      ja: 'アメリカ',
      fr: 'États-Unis',
    },
    tags: ['north-american', 'developed', 'individualist'],
    metadata: { gdp: '26.7T', population: '338M' },
  },
  {
    id: 'holiday_lunar',
    type: 'holiday',
    label: {
      en: 'Lunar New Year',
      zh: '农历新年',
      ja: '旧正月',
      fr: 'Nouvel an lunaire',
    },
    description: {
      en: 'Lunar New Year celebration',
      zh: '农历新年庆祝',
      ja: '旧正月祝い',
      fr: 'Célébration du Nouvel an lunaire',
    },
    tags: ['asian', 'east-asian', 'family-oriented'],
    metadata: { season: 'winter-spring', duration_days: 15 },
  },
  {
    id: 'holiday_christmas',
    type: 'holiday',
    label: {
      en: 'Christmas',
      zh: '圣诞节',
      ja: 'クリスマス',
      fr: 'Noël',
    },
    description: {
      en: 'Christmas celebration',
      zh: '圣诞节庆祝',
      ja: 'クリスマスの祝い',
      fr: 'Célébration de Noël',
    },
    tags: ['western', 'christian', 'commercial'],
    metadata: { season: 'winter', date: 'dec-25' },
  },
  {
    id: 'taboo_clock',
    type: 'taboo',
    label: {
      en: 'Clocks (gifting)',
      zh: '钟表',
      ja: '時計',
      fr: 'Horloges',
    },
    description: {
      en: 'Giving clocks is taboo (sounds like death in Chinese)',
      zh: '送钟谐音不好',
      ja: '時計を贈ることは避ける',
      fr: 'Offrir des horloges est un tabou',
    },
    tags: ['asian', 'linguistic-taboo'],
    metadata: { severity: 'high', regions: ['CN', 'JP', 'SG', 'TW'] },
  },
  {
    id: 'taboo_knife',
    type: 'taboo',
    label: {
      en: 'Sharp objects',
      zh: '刀具',
      ja: 'ナイフ',
      fr: 'Objets tranchants',
    },
    description: {
      en: 'Knives symbolize cutting ties',
      zh: '刀子象征割裂关系',
      ja: 'ナイフは関係を切ることを象徴する',
      fr: 'Les couteaux symbolisent la rupture des liens',
    },
    tags: ['asian', 'symbolic-taboo'],
    metadata: { severity: 'medium', regions: ['CN', 'JP', 'VN'] },
  },
  {
    id: 'gift_tea',
    type: 'gift',
    label: { en: 'Tea', zh: '茶', ja: 'お茶', fr: 'Thé' },
    description: {
      en: 'Premium tea set',
      zh: '高级茶叶',
      ja: '高級茶',
      fr: 'Thé haut de gamme',
    },
    tags: ['asian', 'expensive', 'cultural'],
    metadata: { price_range: [50, 500], category: 'beverage' },
  },
  {
    id: 'occasion_business',
    type: 'occasion',
    label: {
      en: 'Business',
      zh: '商务',
      ja: 'ビジネス',
      fr: 'Affaires',
    },
    description: {
      en: 'Business gift for colleagues/clients',
      zh: '给同事/客户的商务礼物',
      ja: '同僚/クライアントへのビジネスギフト',
      fr: 'Cadeau commercial pour collègues/clients',
    },
    tags: ['professional', 'formal'],
    metadata: { formality: 'high', budget_avg: 100 },
  },
  {
    id: 'culture_confucian',
    type: 'culture',
    label: {
      en: 'Confucian',
      zh: '儒家',
      ja: '儒教',
      fr: 'Confucéen',
    },
    description: {
      en: 'Confucian values and ethics',
      zh: '儒家价值观和伦理',
      ja: '儒教の価値観と倫理',
      fr: 'Valeurs et éthique confucéennes',
    },
    tags: ['asian', 'east-asian', 'hierarchical', 'family-oriented'],
    metadata: { regions: ['CN', 'JP', 'KR', 'VN'] },
  },
]

// Relationships between entities
export const culturalRelations: KnowledgeRelation[] = [
  {
    source: 'country_cn',
    target: 'holiday_lunar',
    type: 'celebrates',
    strength: 0.95,
    context: 'Most important holiday',
  },
  {
    source: 'country_jp',
    target: 'holiday_lunar',
    type: 'celebrates',
    strength: 0.7,
    context: 'Also celebrated but less prominent',
  },
  {
    source: 'country_cn',
    target: 'taboo_clock',
    type: 'avoids',
    strength: 0.9,
    context: 'Strong cultural taboo',
  },
  {
    source: 'country_jp',
    target: 'taboo_clock',
    type: 'avoids',
    strength: 0.8,
    context: 'Observed but slightly less strict',
  },
  {
    source: 'country_cn',
    target: 'culture_confucian',
    type: 'associated_with',
    strength: 0.95,
    context: 'Deep cultural influence',
  },
  {
    source: 'holiday_lunar',
    target: 'gift_tea',
    type: 'suitable_for',
    strength: 0.8,
    context: 'Traditional gift for the occasion',
  },
  {
    source: 'occasion_business',
    target: 'gift_tea',
    type: 'suitable_for',
    strength: 0.9,
    context: 'Premium gift for clients',
  },
  {
    source: 'taboo_clock',
    target: 'country_us',
    type: 'conflicts_with',
    strength: 0.1,
    context: 'Not a taboo in Western cultures',
  },
]

function normalizeCountryEntityId(countryId: string): string {
  const normalized = countryId.trim().toLowerCase()
  const mapped: Record<string, string> = {
    cn: 'country_cn',
    jp: 'country_jp',
    us: 'country_us',
    country_cn: 'country_cn',
    country_jp: 'country_jp',
    country_us: 'country_us',
  }
  return mapped[normalized] ?? countryId
}

/**
 * Query knowledge graph for related entities
 */
export function queryKnowledgeGraph(query: GraphQuery, relations: KnowledgeRelation[] = culturalRelations): GraphQueryResult {
  const paths: GraphQueryResult['paths'] = []

  // Find direct relations
  const matchingRelations = relations.filter(
    rel => rel.source === query.sourceEntity && query.relationTypes.includes(rel.type),
  )

  for (const rel of matchingRelations) {
    const targetEntity = culturalEntities.find(e => e.id === rel.target)
    if (targetEntity) {
      paths.push({
        entities: [
          culturalEntities.find(e => e.id === query.sourceEntity)!,
          targetEntity,
        ],
        relations: [rel],
        totalStrength: rel.strength,
      })
    }
  }

  // Sort by strength
  paths.sort((a, b) => b.totalStrength - a.totalStrength)

  const summary = `Found ${paths.length} ${query.relationTypes.join('/')} relationships for ${query.sourceEntity}`

  return { paths, summary }
}

/**
 * Get cultural impact score for a gift-country combination
 */
export function assessCulturalImpact(giftId: string, countryId: string): { score: number; factors: string[] } {
  const normalizedCountryId = normalizeCountryEntityId(countryId)

  const positiveRelations = culturalRelations.filter(
    rel =>
      ((rel.source === normalizedCountryId && rel.target === giftId) ||
        (rel.source === giftId && rel.target === normalizedCountryId)) &&
      ['suitable_for', 'prefers', 'associated_with'].includes(rel.type),
  )

  const negativeRelations = culturalRelations.filter(
    rel =>
      ((rel.source === normalizedCountryId && rel.target === giftId) ||
        (rel.source === giftId && rel.target === normalizedCountryId)) &&
      ['avoids', 'conflicts_with'].includes(rel.type),
  )

  const positiveScore = positiveRelations.reduce((sum, rel) => sum + rel.strength, 0)
  const negativeScore = negativeRelations.reduce((sum, rel) => sum + rel.strength, 0)

  const factors: string[] = [
    ...positiveRelations.map(rel => `✓ ${rel.type}: ${rel.strength * 100}%`),
    ...negativeRelations.map(rel => `✗ ${rel.type}: ${rel.strength * 100}%`),
  ]

  // Score: 0-1, where 1 is perfect fit and 0 is forbidden
  const score = (positiveScore - negativeScore * 2) / 2 // Negative counts more
  return { score: Math.max(0, Math.min(1, score)), factors }
}

/**
 * Find alternative gifts that don't conflict with cultural taboos
 */
export function findCulturallyCompatibleAlternatives(
  problematicGiftId: string,
  countryId: string,
  allCandidates: string[],
): Array<{ giftId: string; compatibilityScore: number }> {
  return allCandidates
    .map(candidateId => {
      const { score } = assessCulturalImpact(candidateId, countryId)
      return { giftId: candidateId, compatibilityScore: score }
    })
    .filter(candidate => candidate.compatibilityScore > 0.5) // Only good matches
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 3)
}

/**
 * Get localized cultural explanation for a relation
 */
export function getLocalizedException(
  relation: KnowledgeRelation,
  locale: GraphLocale,
): string {
  const explanations: Record<RelationType, Record<GraphLocale, string>> = {
    celebrates: {
      en: 'is celebrated in',
      zh: '在...中庆祝',
      ja: 'で祝われます',
      fr: 'est célébré en',
    },
    avoids: {
      en: 'is avoided in',
      zh: '在...中避免',
      ja: 'で避けられます',
      fr: 'est évité en',
    },
    prefers: {
      en: 'is preferred in',
      zh: '在...中受欢迎',
      ja: 'で好まれます',
      fr: 'est préféré en',
    },
    associated_with: {
      en: 'is associated with',
      zh: '与...有关',
      ja: 'と関連があります',
      fr: 'est associé à',
    },
    suitable_for: {
      en: 'is suitable for',
      zh: '适合...',
      ja: 'に適しています',
      fr: 'est approprié pour',
    },
    conflicts_with: {
      en: 'conflicts with',
      zh: '与...冲突',
      ja: 'と矛盾します',
      fr: 'entre en conflit avec',
    },
    requires: {
      en: 'requires',
      zh: '需要',
      ja: '必要です',
      fr: 'exige',
    },
    contradicts: {
      en: 'contradicts',
      zh: '与...矛盾',
      ja: 'に矛盾します',
      fr: 'contredit',
    },
  }

  return explanations[relation.type]?.[locale] || relation.type
}
