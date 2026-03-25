/**
 * P1: Multi-modal Recognition Enhancement
 * Upgrade from basic vision recognition to rich attribute extraction
 * 
 * Supports:
 * - OCR: Extract text from product packaging (brand names, specifications)
 * - Visual attributes: Color, material, style, form factor
 * - Semantic enrichment: Brand associations, category signals
 */

import type { GiftContextInput } from '@/lib/p0-types'

export interface OCRResult {
  text: string[]
  brands: string[]
  specifications: string[] // e.g., "陶瓷", "500ml", "防水"
  confidence: number
}

export interface VisualAttributes {
  colors: Array<{ color: string; prominence: 'primary' | 'secondary' | 'accent' }>
  materials: Array<{ material: string; confidence: number }>
  styles: string[] // e.g., "business", "minimalist", "luxury"
  formFactor: string // e.g., "box", "bottle", "wearable", "desk-item"
  packaging: {
    style: string // e.g., "luxury-box", "minimal", "eco-friendly"
    colors: string[]
    hasLogo: boolean
  }
}

export interface P1EnhancedRecognition {
  baseRecognition: {
    category?: string
    itemZh?: string
    itemEn?: string
    description?: string
  }
  ocrResult?: OCRResult
  visualAttributes?: VisualAttributes
  confidenceScore: number
  enrichmentSource: 'vision-only' | 'vision+ocr' | 'vision+attributes' | 'vision+ocr+attributes'
}

/**
 * Simulate OCR extraction (in production, would use Tesseract/Google Vision API)
 */
export function extractOCRFromImage(imageDescription: string): OCRResult {
  // Pattern matching for common brand signals in description
  const brandPatterns = [
    /Apple|苹果/gi,
    /Samsung|三星/gi,
    /Starbucks|星巴克/gi,
    /Hermès|爱马仕/gi,
    /Louis Vuitton|LV|路易威登/gi,
    /Gucci|古驰/gi,
    /Prada|普拉达/gi,
    /Rolex|劳力士/gi,
    /Dior|迪奥/gi,
  ]

  const brands = brandPatterns
    .map(pattern => imageDescription.match(pattern))
    .filter(Boolean)
    .map(m => m![0])

  // Extract specifications
  const specPatterns = [/(\d+ml|\d+g|\d+cm|防水|耐摔|环保|有机|天然|手工)/gi]
  const specs = imageDescription.match(/(\d+ml|\d+g|\d+cm|防水|耐摔|环保|有机|天然|手工)/gi) || []

  return {
    text: [imageDescription],
    brands: Array.from(new Set(brands)),
    specifications: Array.from(new Set(specs)),
    confidence: 0.72,
  }
}

/**
 * Extract visual attributes from description
 */
export function extractVisualAttributes(imageDescription: string): VisualAttributes {
  const descLower = imageDescription.toLowerCase()

  // Color detection
  const colorMap: Record<string, string[]> = {
    black: ['黑色', 'black', '深色', 'dark'],
    white: ['白色', 'white', '米色', 'cream'],
    red: ['红色', 'red', '深红', 'crimson'],
    gold: ['金色', 'gold', '金黄'],
    silver: ['银色', 'silver', '灰色'],
  }

  const detectedColors: Array<{ color: string; prominence: 'primary' | 'secondary' | 'accent' }> = []
  let primaryCount = 0

  for (const [color, keywords] of Object.entries(colorMap)) {
    if (keywords.some(kw => descLower.includes(kw))) {
      const prominence = primaryCount === 0 ? 'primary' : primaryCount === 1 ? 'secondary' : 'accent'
      detectedColors.push({ color, prominence })
      primaryCount++
    }
  }

  // Material detection
  const materialPatterns: Record<string, string[]> = {
    metal: ['金属', 'metal', 'stainless steel', 'aluminum'],
    ceramic: ['陶瓷', 'ceramic', 'porcelain'],
    glass: ['玻璃', 'glass', 'crystal'],
    leather: ['皮', '皮质', 'leather'],
    wood: ['木', '木质', 'wood'],
    fabric: ['布', '纺织', 'fabric', 'textile'],
  }

  const materials = Object.entries(materialPatterns)
    .filter(([_, keywords]) => keywords.some(kw => descLower.includes(kw)))
    .map(([material]) => ({ material, confidence: 0.8 }))

  // Style detection
  const styles: string[] = []
  if (descLower.includes('business') || descLower.includes('商务') || descLower.includes('formal')) {
    styles.push('business')
  }
  if (descLower.includes('minimal') || descLower.includes('简约') || descLower.includes('clean')) {
    styles.push('minimal')
  }
  if (descLower.includes('luxury') || descLower.includes('奢华') || descLower.includes('premium')) {
    styles.push('luxury')
  }
  if (descLower.includes('eco') || descLower.includes('环保') || descLower.includes('sustainable')) {
    styles.push('eco-friendly')
  }

  // Form factor detection
  let formFactor = 'generic'
  if (
    descLower.includes('box') ||
    descLower.includes('盒') ||
    descLower.includes('礼盒')
  ) {
    formFactor = 'box'
  } else if (
    descLower.includes('bottle') ||
    descLower.includes('瓶')
  ) {
    formFactor = 'bottle'
  } else if (
    descLower.includes('cup') ||
    descLower.includes('mug') ||
    descLower.includes('杯')
  ) {
    formFactor = 'cup'
  } else if (
    descLower.includes('desk') ||
    descLower.includes('办公') ||
    descLower.includes('stationery')
  ) {
    formFactor = 'desk-item'
  } else if (
    descLower.includes('wearable') ||
    descLower.includes('scarf') ||
    descLower.includes('watch') ||
    descLower.includes('穿戴') ||
    descLower.includes('围巾')
  ) {
    formFactor = 'wearable'
  }

  return {
    colors: detectedColors,
    materials,
    styles,
    formFactor,
    packaging: {
      style: descLower.includes('luxury') ? 'luxury-box' : descLower.includes('eco') ? 'eco-friendly' : 'standard',
      colors: detectedColors.map(c => c.color),
      hasLogo: descLower.includes('logo') || descLower.includes('品牌'),
    },
  }
}

/**
 * Enhance recognition with P1 multi-modal capabilities
 */
export function enhanceWithMultiModal(input: {
  baseCategory?: string
  itemZh?: string
  itemEn?: string
  description?: string
  imageDescription?: string
}): P1EnhancedRecognition {
  const baseRecognition = {
    category: input.baseCategory,
    itemZh: input.itemZh,
    itemEn: input.itemEn,
    description: input.description,
  }

  const fullDescription = [input.description, input.imageDescription].filter(Boolean).join(' ')

  // Determine enrichment sources and extract data
  let enrichmentSource: P1EnhancedRecognition['enrichmentSource'] = 'vision-only'
  let ocrResult: OCRResult | undefined
  let visualAttributes: VisualAttributes | undefined

  if (fullDescription) {
    // Try OCR extraction
    ocrResult = extractOCRFromImage(fullDescription)

    if (ocrResult.text.length > 0 && ocrResult.brands.length > 0) {
      enrichmentSource = 'vision+ocr'
    }

    // Extract visual attributes
    visualAttributes = extractVisualAttributes(fullDescription)

    if (visualAttributes.colors.length > 0 || visualAttributes.materials.length > 0) {
      enrichmentSource =
        enrichmentSource === 'vision+ocr'
          ? 'vision+ocr+attributes'
          : 'vision+attributes'
    }
  }

  // Calculate confidence score
  const confidenceComponents: number[] = [0.5] // Base confidence

  if (input.baseCategory) {
    confidenceComponents.push(0.15) // Category match
  }

  if (ocrResult && ocrResult.brands.length > 0) {
    confidenceComponents.push(0.15) // Brand confidence
  }

  if (visualAttributes && visualAttributes.colors.length > 0) {
    confidenceComponents.push(0.1) // Color detection
  }

  if (visualAttributes && visualAttributes.materials.length > 0) {
    confidenceComponents.push(0.1) // Material detection
  }

  const confidenceScore = Math.min(0.99, confidenceComponents.reduce((a, b) => a + b, 0))

  return {
    baseRecognition,
    ocrResult,
    visualAttributes,
    confidenceScore,
    enrichmentSource,
  }
}

/**
 * Merge P1 enhanced recognition with existing gift profile
 */
export function mergeP1Enhancement(
  original: {
    displayName: string
    category: string
    materials: string[]
    styles: string[]
    colors: string[]
  },
  enhancement: P1EnhancedRecognition,
): typeof original {
  // Merge materials
  const mergedMaterials = Array.from(
    new Set([
      ...original.materials,
      ...(enhancement.visualAttributes?.materials.map(m => m.material) || []),
    ]),
  )

  // Merge styles
  const mergedStyles = Array.from(
    new Set([...original.styles, ...(enhancement.visualAttributes?.styles || [])]),
  )

  // Merge colors
  const mergedColors = Array.from(
    new Set([
      ...original.colors,
      ...(enhancement.visualAttributes?.colors.map(c => c.color) || []),
    ]),
  )

  // Update display name with brand if available
  let displayName = original.displayName
  if (enhancement.ocrResult?.brands.length) {
    displayName = `${enhancement.ocrResult.brands[0]} ${original.displayName}`.trim()
  }

  return {
    displayName,
    category: original.category,
    materials: mergedMaterials,
    styles: mergedStyles,
    colors: mergedColors,
  }
}
