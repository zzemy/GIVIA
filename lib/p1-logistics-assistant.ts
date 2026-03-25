/**
 * P1: Logistics Assistant Enhancement
 * Real-time shipping estimation, currency conversion, customs info
 * 
 * Features:
 * - Shipping cost estimation by country/weight
 * - Multi-currency support with live exchange rates
 * - Customs duty estimation
 * - Delivery time estimation
 * - Packing recommendations by item type
 */

import type { P0Locale } from '@/lib/p0-types'

export interface ShippingQuote {
  carrier: string // 'dhl', 'fedex', 'ups', 'epacket', 'local'
  baseCost: number
  estimatedDays: number
  currency: string
  trackable: boolean
  insuranceAvailable: boolean
}

export interface CustomsDutyEstimate {
  dutyRate: number // Percentage of item value
  estimatedDuty: number
  currency: string
  importLicense: string | null
  restrictions: string[]
}

export interface LogisticsEstimate {
  origin: string
  destination: string
  itemWeight: number // grams
  itemValue: number // USD
  shippingQuotes: ShippingQuote[]
  customsDuty: CustomsDutyEstimate
  recommendedCarrier: string
  totalEstimatedCost: number // Origin currency
  destinationCurrency: string
  deliveryTimeRange: string
}

export interface ExchangeRateInfo {
  fromCurrency: string
  toCurrency: string
  rate: number
  timestamp: number
  source: string
}

// Country-specific shipping rates (base rates per 500g, to be tuned with real data)
const SHIPPING_RATES: Record<string, Record<string, { baseCost: number; days: number }>> = {
  US: {
    CN: { baseCost: 25, days: 10 },
    JP: { baseCost: 20, days: 7 },
    UK: { baseCost: 18, days: 7 },
    FR: { baseCost: 18, days: 8 },
    DE: { baseCost: 18, days: 8 },
    SA: { baseCost: 35, days: 14 },
    AE: { baseCost: 30, days: 10 },
  },
  CN: {
    US: { baseCost: 15, days: 14 },
    JP: { baseCost: 8, days: 5 },
    UK: { baseCost: 18, days: 12 },
    FR: { baseCost: 18, days: 12 },
    DE: { baseCost: 18, days: 12 },
    SA: { baseCost: 25, days: 14 },
    AE: { baseCost: 20, days: 10 },
  },
  JP: {
    US: { baseCost: 20, days: 7 },
    CN: { baseCost: 10, days: 5 },
    UK: { baseCost: 25, days: 10 },
    FR: { baseCost: 25, days: 10 },
    DE: { baseCost: 25, days: 10 },
    SA: { baseCost: 40, days: 14 },
    AE: { baseCost: 35, days: 10 },
  },
}

// Customs duty rates by destination country
const CUSTOMS_RATES: Record<string, { dutyRate: number; threshold: number }> = {
  US: { dutyRate: 0.12, threshold: 800 }, // 12% duty on items > $800
  CN: { dutyRate: 0.13, threshold: 50 }, // Higher threshold and rate for China
  JP: { dutyRate: 0.08, threshold: 10000 }, // High threshold in JPY equivalent
  UK: { dutyRate: 0.2, threshold: 150 },
  FR: { dutyRate: 0.2, threshold: 150 },
  DE: { dutyRate: 0.19, threshold: 150 },
  SA: { dutyRate: 0.05, threshold: 0 }, // Low duty, applies to everything
  AE: { dutyRate: 0.0, threshold: 0 }, // No duty in UAE
}

// Mock exchange rates (in production, fetch from API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    CNY: 7.25,
    JPY: 150,
    GBP: 0.79,
    EUR: 0.92,
    SAR: 3.75,
    AED: 3.67,
  },
  CNY: {
    USD: 0.138,
    JPY: 20.69,
    GBP: 0.109,
    EUR: 0.127,
    SAR: 0.517,
    AED: 0.506,
  },
  JPY: {
    USD: 0.0067,
    CNY: 0.0484,
    GBP: 0.0053,
    EUR: 0.0061,
    SAR: 0.025,
    AED: 0.0245,
  },
}

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  CN: 'CNY',
  JP: 'JPY',
  UK: 'GBP',
  FR: 'EUR',
  DE: 'EUR',
  SA: 'SAR',
  AE: 'AED',
}

/**
 * Get shipping quotes from origin to destination
 */
export function getShippingQuotes(
  origin: string,
  destination: string,
  weightGrams: number,
): ShippingQuote[] {
  const ratesMap = SHIPPING_RATES[origin]
  if (!ratesMap) {
    return [
      {
        carrier: 'international',
        baseCost: 45,
        estimatedDays: 14,
        currency: COUNTRY_TO_CURRENCY[origin] || 'USD',
        trackable: true,
        insuranceAvailable: true,
      },
    ]
  }

  const rateInfo = ratesMap[destination]
  if (!rateInfo) {
    return [
      {
        carrier: 'international',
        baseCost: 50,
        estimatedDays: 21,
        currency: COUNTRY_TO_CURRENCY[origin] || 'USD',
        trackable: true,
        insuranceAvailable: true,
      },
    ]
  }

  // Calculate cost based on weight
  const weightUnitCount = Math.ceil(weightGrams / 500)
  const actualCost = rateInfo.baseCost * weightUnitCount

  // Generate multiple carrier options
  const quotes: ShippingQuote[] = [
    {
      carrier: 'DHL',
      baseCost: actualCost,
      estimatedDays: rateInfo.days,
      currency: COUNTRY_TO_CURRENCY[origin] || 'USD',
      trackable: true,
      insuranceAvailable: true,
    },
    {
      carrier: 'FedEx',
      baseCost: actualCost * 1.1,
      estimatedDays: Math.max(1, rateInfo.days - 1),
      currency: COUNTRY_TO_CURRENCY[origin] || 'USD',
      trackable: true,
      insuranceAvailable: true,
    },
    {
      carrier: 'ePacket',
      baseCost: actualCost * 0.7,
      estimatedDays: rateInfo.days + 3,
      currency: COUNTRY_TO_CURRENCY[origin] || 'USD',
      trackable: true,
      insuranceAvailable: false,
    },
  ]

  return quotes
}

/**
 * Estimate customs duty for destination country
 */
export function estimateCustomsDuty(destination: string, itemValueUSD: number): CustomsDutyEstimate {
  const customsInfo = CUSTOMS_RATES[destination]
  const currency = COUNTRY_TO_CURRENCY[destination] || 'USD'

  if (!customsInfo) {
    return {
      dutyRate: 0.15,
      estimatedDuty: itemValueUSD * 0.15,
      currency,
      importLicense: null,
      restrictions: [],
    }
  }

  const dutyApplies = itemValueUSD > customsInfo.threshold
  const dutyAmount = dutyApplies ? itemValueUSD * customsInfo.dutyRate : 0

  // Get country-specific restrictions
  const restrictions = getImportRestrictions(destination)

  return {
    dutyRate: customsInfo.dutyRate,
    estimatedDuty: dutyAmount,
    currency,
    importLicense: restrictions.length > 0 ? `CHECK_RESTRICTIONS_${destination}` : null,
    restrictions,
  }
}

/**
 * Get import restrictions for destination country
 */
export function getImportRestrictions(country: string): string[] {
  const restrictions: Record<string, string[]> = {
    CN: [
      'Luxury items limited to RMB 5000',
      'Electronics require proper declaration',
      'Alcohol limited to 1L',
    ],
    SA: ['Alcohol prohibited', 'Pork products prohibited', 'Religious items checked'],
    AE: ['Alcohol prohibited', 'Pork products prohibited'],
    JP: [
      'Certain cosmetics may require certification',
      'Food items require customs declaration',
    ],
  }
  return restrictions[country] || []
}

/**
 * Convert currency using mock rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): ExchangeRateInfo {
  if (fromCurrency === toCurrency) {
    return {
      fromCurrency,
      toCurrency,
      rate: 1,
      timestamp: Date.now(),
      source: 'identity',
    }
  }

  const rates = EXCHANGE_RATES[fromCurrency]
  const rate = rates ? rates[toCurrency] : 1

  return {
    fromCurrency,
    toCurrency,
    rate,
    timestamp: Date.now(),
    source: 'mock-api', // In production: 'xe.com' or 'fixer.io'
  }
}

/**
 * Calculate total logistics cost (shipping + duties + insurance)
 */
export function estimateLogisticsCost(
  origin: string,
  destination: string,
  itemWeightGrams: number,
  itemValueUSD: number,
  addInsurance: boolean = true,
): LogisticsEstimate {
  const shippingQuotes = getShippingQuotes(origin, destination, itemWeightGrams)
  const customsDuty = estimateCustomsDuty(destination, itemValueUSD)
  const destinationCurrency = COUNTRY_TO_CURRENCY[destination] || 'USD'

  // Select cheapest shipping
  const recommended = shippingQuotes.reduce((prev, curr) =>
    prev.baseCost < curr.baseCost ? prev : curr,
  )

  const originCurrency = COUNTRY_TO_CURRENCY[origin] || 'USD'

  // Convert shipping cost from origin to destination currency
  const shippingExchange =
    originCurrency === destinationCurrency
      ? 1
      : EXCHANGE_RATES[originCurrency]?.[destinationCurrency] || 1

  const convertedShippingCost = recommended.baseCost * shippingExchange

  // Insurance: 2% of item value if enabled
  const insuranceCost = addInsurance && recommended.insuranceAvailable ? itemValueUSD * 0.02 : 0

  const totalCost = convertedShippingCost + customsDuty.estimatedDuty + insuranceCost

  return {
    origin,
    destination,
    itemWeight: itemWeightGrams,
    itemValue: itemValueUSD,
    shippingQuotes,
    customsDuty,
    recommendedCarrier: recommended.carrier,
    totalEstimatedCost: totalCost,
    destinationCurrency,
    deliveryTimeRange: `${recommended.estimatedDays}-${recommended.estimatedDays + 2} days`,
  }
}

/**
 * Get packing recommendations based on item type and destination
 */
export function getPackingRecommendations(
  itemCategory: string,
  destination: string,
  locale: P0Locale = 'en',
): Record<string, string[]> {
  const baseRecommendations: Record<string, string[]> = {
    fragile: ['Use bubble wrap', 'Double cardboard box', 'Add corner protectors'],
    liquid: ['Use leak-proof container', 'Place in waterproof bag', 'Declare on customs form'],
    textile: ['Vacuum seal bag', 'Use acid-free paper', 'Include moth balls for long transit'],
    electronics: ['Original packaging recommended', 'Anti-static bag', 'Declare value clearly'],
    perishable: ['Not recommended for long transit', 'Use insulated box with cooling gel'],
  }

  const recommendations = baseRecommendations[itemCategory] || baseRecommendations.fragile

  // Add destination-specific recommendations
  if (['CN', 'SA', 'AE'].includes(destination)) {
    recommendations.push(`Customs declaration label in ${COUNTRY_TO_CURRENCY[destination]}`)
  }

  if (['JP', 'DE', 'FR'].includes(destination)) {
    recommendations.push('Include detailed packing list in English')
  }

  return {
    general: recommendations,
    estimated_cost_impact: itemCategory === 'fragile' ? '15-25% more' : '5-10% more',
  }
}

/**
 * Generate logistics summary in user's language
 */
export function formatLogisticsSummary(estimate: LogisticsEstimate, locale: P0Locale): string {
  const dutyStr = estimate.customsDuty.estimatedDuty.toFixed(2)
  const costStr = estimate.totalEstimatedCost.toFixed(2)

  if (locale === 'zh' || locale === 'en') {
    return `🚚 物流估算：${estimate.recommendedCarrier} (${estimate.deliveryTimeRange})
💰 预估成本：${costStr} ${estimate.destinationCurrency}
📋 关税：${dutyStr} ${estimate.destinationCurrency}
⚠️ ${estimate.customsDuty.restrictions.length > 0 ? `通关注意：${estimate.customsDuty.restrictions[0]}` : '通关绿色通道'}`
  }

  return `🚚 Shipping: ${estimate.recommendedCarrier} (${estimate.deliveryTimeRange})
💰 Total Cost: ${costStr} ${estimate.destinationCurrency}
📋 Duties: ${dutyStr} ${estimate.destinationCurrency}
⚠️ ${estimate.customsDuty.restrictions.length > 0 ? `Customs Note: ${estimate.customsDuty.restrictions[0]}` : 'No customs restrictions'}`
}
