const HISTORY_KEY = 'givia-analysis-history-v1'
const FAVORITES_KEY = 'givia-favorite-recommendations-v1'

export interface StoredRecommendation {
  id: string
  name: string
  category: string
}

export interface StoredAnalysisRecord {
  id: string
  createdAt: string
  locale: 'zh' | 'en' | 'ja' | 'fr'
  countryCode: string
  countryName: string
  giftName: string
  riskScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
  audienceLabel: string
  recommendations: StoredRecommendation[]
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function loadAnalysisHistory(): StoredAnalysisRecord[] {
  return readJson<StoredAnalysisRecord[]>(HISTORY_KEY, [])
}

export function saveAnalysisRecord(record: StoredAnalysisRecord) {
  const history = loadAnalysisHistory()
  const nextHistory = [record, ...history.filter(item => item.id !== record.id)].slice(0, 8)
  writeJson(HISTORY_KEY, nextHistory)
}

export function loadFavoriteRecommendationIds(): string[] {
  return readJson<string[]>(FAVORITES_KEY, [])
}

export function toggleFavoriteRecommendation(id: string): string[] {
  const favorites = loadFavoriteRecommendationIds()
  const nextFavorites = favorites.includes(id)
    ? favorites.filter(item => item !== id)
    : [id, ...favorites]

  writeJson(FAVORITES_KEY, nextFavorites)
  return nextFavorites
}
