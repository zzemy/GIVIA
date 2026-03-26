/**
 * Lightweight locale helpers for the active product languages.
 */

export type SupportedLocale = 'en' | 'zh'

export interface LocaleMessages {
  common: Record<string, string>
  analysis: Record<string, string>
  recommendations: Record<string, string>
  logistics: Record<string, string>
  errors: Record<string, string>
}

/**
 * Get messages for a specific locale
 */
export function getMessages(locale: SupportedLocale): LocaleMessages {
  switch (locale) {
    case 'zh':
      // Import from actual zh.json in production
      return {
        common: {
          welcome: '欢迎来到跨境礼品助手',
          selectRecipient: '选择收件人',
          selectOccasion: '选择礼品场合',
          selectCountry: '选择礼品配送国家',
          continue: '继续',
          back: '返回',
          cancel: '取消',
          loading: '加载中...',
          error: '发生错误',
          success: '成功',
        },
        analysis: {
          riskAnalysis: '风险分析',
          analyzing: '正在分析礼品的可配送性...',
          culturalRisk: '文化风险',
          customsRisk: '海关风险',
          prohibited: '禁止',
          acceptable: '可接受',
          caution: '小心',
          contextSensitivity: '上下文敏感性',
          detailsLabel: '详细信息',
        },
        recommendations: {
          topRecommendations: '顶级推荐',
          bestMatch: '最佳匹配',
          whyRecommended: '为什么推荐这个',
          riskLevel: '风险等级',
          budget: '预算',
          occasion: '礼品场合',
          viewDetails: '查看详情',
        },
        logistics: {
          shippingOptions: '运输选项',
          estimatedCost: '预估成本',
          estimatedDays: '预估天数',
          carrier: '运输商',
          customsDuties: '关税',
          importRestrictions: '进口限制',
        },
        errors: {
          invalidCountry: '无效的国家代码',
          invalidOccasion: '无效的礼品场合',
          apiError: 'API错误',
          networkError: '网络错误',
        },
      }
    default:
      // English
      return {
        common: {
          welcome: 'Welcome to Cross-Border Gift Assistant',
          selectRecipient: 'Select Recipient',
          selectOccasion: 'Select Gift Occasion',
          selectCountry: 'Select Gift Delivery Country',
          continue: 'Continue',
          back: 'Back',
          cancel: 'Cancel',
          loading: 'Loading...',
          error: 'An error occurred',
          success: 'Success',
        },
        analysis: {
          riskAnalysis: 'Risk Analysis',
          analyzing: 'Analyzing gift compatibility...',
          culturalRisk: 'Cultural Risk',
          customsRisk: 'Customs Risk',
          prohibited: 'Prohibited',
          acceptable: 'Acceptable',
          caution: 'Caution',
          contextSensitivity: 'Context Sensitivity',
          detailsLabel: 'Details',
        },
        recommendations: {
          topRecommendations: 'Top Recommendations',
          bestMatch: 'Best Match',
          whyRecommended: 'Why This Is Recommended',
          riskLevel: 'Risk Level',
          budget: 'Budget',
          occasion: 'Gift Occasion',
          viewDetails: 'View Details',
        },
        logistics: {
          shippingOptions: 'Shipping Options',
          estimatedCost: 'Estimated Cost',
          estimatedDays: 'Estimated Days',
          carrier: 'Carrier',
          customsDuties: 'Customs Duties',
          importRestrictions: 'Import Restrictions',
        },
        errors: {
          invalidCountry: 'Invalid country code',
          invalidOccasion: 'Invalid gift occasion',
          apiError: 'API Error',
          networkError: 'Network Error',
        },
      }
  }
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale: SupportedLocale): string {
  if (locale === 'zh') {
    return new Intl.NumberFormat('zh-CN').format(value)
  }
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format currency according to locale and currency code
 */
export function formatCurrency(
  value: number,
  currencyCode: string,
  locale: SupportedLocale,
): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    zh: 'zh-CN',
  }

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale: SupportedLocale, style: 'short' | 'long' = 'short'): string {
  const localeMap: Record<SupportedLocale, string> = {
    en: 'en-US',
    zh: 'zh-CN',
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: style === 'long' ? 'numeric' : '2-digit',
    month: style === 'long' ? 'long' : '2-digit',
    day: 'numeric',
  }).format(date)
}

/**
 * Translate analysis result based on locale
 */
export function translateAnalysisResult(
  riskLevel: string,
  riskFactors: string[],
  locale: SupportedLocale,
): { level: string; summary: string; factors: string[] } {
  const messages = getMessages(locale)

  const levelMap: Record<string, Record<SupportedLocale, string>> = {
    prohibited: {
      en: 'Prohibited',
      zh: '禁止',
    },
    caution: {
      en: 'Caution',
      zh: '小心',
    },
    acceptable: {
      en: 'Acceptable',
      zh: '可接受',
    },
  }

  return {
    level: levelMap[riskLevel]?.[locale] || riskLevel,
    summary: messages.analysis.riskAnalysis,
    factors: riskFactors.map(factor => {
      // In production, map risk factor codes to localized strings
      return factor
    }),
  }
}

/**
 * Get locale-aware date range for delivery
 */
export function getLocalizedDeliveryRange(minDays: number, maxDays: number, locale: SupportedLocale): string {
  const labels: Record<SupportedLocale, { day: string; to: string }> = {
    en: { day: 'day', to: 'to' },
    zh: { day: '天', to: '至' },
  }

  const label = labels[locale]
  return `${minDays} ${label.day} ${label.to} ${maxDays} ${label.day}`
}

/**
 * Get supported locales list
 */
export function getSupportedLocales(): SupportedLocale[] {
  return ['en', 'zh']
}

/**
 * Check if locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return ['en', 'zh'].includes(locale)
}
