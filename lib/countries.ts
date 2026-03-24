export interface Country {
  code: string
  nameEn: string
  nameZh: string
  region: 'asia' | 'europe' | 'americas' | 'africa' | 'oceania'
  isPopular?: boolean
}

export const COUNTRIES: Country[] = [
  // Popular
  { code: 'CN', nameEn: 'China', nameZh: '中国', region: 'asia', isPopular: true },
  { code: 'JP', nameEn: 'Japan', nameZh: '日本', region: 'asia', isPopular: true },
  { code: 'US', nameEn: 'United States', nameZh: '美国', region: 'americas', isPopular: true },
  { code: 'GB', nameEn: 'United Kingdom', nameZh: '英国', region: 'europe', isPopular: true },
  { code: 'IN', nameEn: 'India', nameZh: '印度', region: 'asia', isPopular: true },

  // Asia
  { code: 'KR', nameEn: 'South Korea', nameZh: '韩国', region: 'asia' },
  { code: 'TH', nameEn: 'Thailand', nameZh: '泰国', region: 'asia' },
  { code: 'VN', nameEn: 'Vietnam', nameZh: '越南', region: 'asia' },
  { code: 'MY', nameEn: 'Malaysia', nameZh: '马来西亚', region: 'asia' },
  { code: 'SG', nameEn: 'Singapore', nameZh: '新加坡', region: 'asia' },
  { code: 'PH', nameEn: 'Philippines', nameZh: '菲律宾', region: 'asia' },
  { code: 'ID', nameEn: 'Indonesia', nameZh: '印度尼西亚', region: 'asia' },
  { code: 'BD', nameEn: 'Bangladesh', nameZh: '孟加拉国', region: 'asia' },
  { code: 'PK', nameEn: 'Pakistan', nameZh: '巴基斯坦', region: 'asia' },
  { code: 'LK', nameEn: 'Sri Lanka', nameZh: '斯里兰卡', region: 'asia' },
  { code: 'NP', nameEn: 'Nepal', nameZh: '尼泊尔', region: 'asia' },
  { code: 'BT', nameEn: 'Bhutan', nameZh: '不丹', region: 'asia' },
  { code: 'MM', nameEn: 'Myanmar', nameZh: '缅甸', region: 'asia' },
  { code: 'LA', nameEn: 'Laos', nameZh: '老挝', region: 'asia' },
  { code: 'KH', nameEn: 'Cambodia', nameZh: '柬埔寨', region: 'asia' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameZh: '沙特阿拉伯', region: 'asia' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameZh: '阿联酋', region: 'asia' },
  { code: 'QA', nameEn: 'Qatar', nameZh: '卡塔尔', region: 'asia' },
  { code: 'KW', nameEn: 'Kuwait', nameZh: '科威特', region: 'asia' },
  { code: 'BH', nameEn: 'Bahrain', nameZh: '巴林', region: 'asia' },
  { code: 'OM', nameEn: 'Oman', nameZh: '阿曼', region: 'asia' },
  { code: 'YE', nameEn: 'Yemen', nameZh: '也门', region: 'asia' },
  { code: 'IR', nameEn: 'Iran', nameZh: '伊朗', region: 'asia' },
  { code: 'IQ', nameEn: 'Iraq', nameZh: '伊拉克', region: 'asia' },
  { code: 'IL', nameEn: 'Israel', nameZh: '以色列', region: 'asia' },
  { code: 'JO', nameEn: 'Jordan', nameZh: '约旦', region: 'asia' },
  { code: 'LB', nameEn: 'Lebanon', nameZh: '黎巴嫩', region: 'asia' },
  { code: 'SY', nameEn: 'Syria', nameZh: '叙利亚', region: 'asia' },
  { code: 'TR', nameEn: 'Turkey', nameZh: '土耳其', region: 'europe' },

  // Europe
  { code: 'DE', nameEn: 'Germany', nameZh: '德国', region: 'europe' },
  { code: 'FR', nameEn: 'France', nameZh: '法国', region: 'europe' },
  { code: 'IT', nameEn: 'Italy', nameZh: '意大利', region: 'europe' },
  { code: 'ES', nameEn: 'Spain', nameZh: '西班牙', region: 'europe' },
  { code: 'RU', nameEn: 'Russia', nameZh: '俄罗斯', region: 'europe' },
  { code: 'PL', nameEn: 'Poland', nameZh: '波兰', region: 'europe' },
  { code: 'NL', nameEn: 'Netherlands', nameZh: '荷兰', region: 'europe' },
  { code: 'BE', nameEn: 'Belgium', nameZh: '比利时', region: 'europe' },
  { code: 'CH', nameEn: 'Switzerland', nameZh: '瑞士', region: 'europe' },
  { code: 'AT', nameEn: 'Austria', nameZh: '奥地利', region: 'europe' },
  { code: 'SE', nameEn: 'Sweden', nameZh: '瑞典', region: 'europe' },
  { code: 'NO', nameEn: 'Norway', nameZh: '挪威', region: 'europe' },
  { code: 'DK', nameEn: 'Denmark', nameZh: '丹麦', region: 'europe' },
  { code: 'FI', nameEn: 'Finland', nameZh: '芬兰', region: 'europe' },
  { code: 'IE', nameEn: 'Ireland', nameZh: '爱尔兰', region: 'europe' },
  { code: 'CZ', nameEn: 'Czech Republic', nameZh: '捷克共和国', region: 'europe' },
  { code: 'HU', nameEn: 'Hungary', nameZh: '匈牙利', region: 'europe' },
  { code: 'RO', nameEn: 'Romania', nameZh: '罗马尼亚', region: 'europe' },
  { code: 'BG', nameEn: 'Bulgaria', nameZh: '保加利亚', region: 'europe' },
  { code: 'GR', nameEn: 'Greece', nameZh: '希腊', region: 'europe' },
  { code: 'PT', nameEn: 'Portugal', nameZh: '葡萄牙', region: 'europe' },
  { code: 'HR', nameEn: 'Croatia', nameZh: '克罗地亚', region: 'europe' },
  { code: 'SI', nameEn: 'Slovenia', nameZh: '斯洛文尼亚', region: 'europe' },
  { code: 'SK', nameEn: 'Slovakia', nameZh: '斯洛伐克', region: 'europe' },
  { code: 'LT', nameEn: 'Lithuania', nameZh: '立陶宛', region: 'europe' },
  { code: 'LV', nameEn: 'Latvia', nameZh: '拉脱维亚', region: 'europe' },
  { code: 'EE', nameEn: 'Estonia', nameZh: '爱沙尼亚', region: 'europe' },
  { code: 'UA', nameEn: 'Ukraine', nameZh: '乌克兰', region: 'europe' },
  { code: 'BY', nameEn: 'Belarus', nameZh: '白俄罗斯', region: 'europe' },

  // Americas
  { code: 'CA', nameEn: 'Canada', nameZh: '加拿大', region: 'americas' },
  { code: 'MX', nameEn: 'Mexico', nameZh: '墨西哥', region: 'americas' },
  { code: 'BR', nameEn: 'Brazil', nameZh: '巴西', region: 'americas' },
  { code: 'AR', nameEn: 'Argentina', nameZh: '阿根廷', region: 'americas' },
  { code: 'CL', nameEn: 'Chile', nameZh: '智利', region: 'americas' },
  { code: 'CO', nameEn: 'Colombia', nameZh: '哥伦比亚', region: 'americas' },
  { code: 'PE', nameEn: 'Peru', nameZh: '秘鲁', region: 'americas' },
  { code: 'VE', nameEn: 'Venezuela', nameZh: '委内瑞拉', region: 'americas' },
  { code: 'EC', nameEn: 'Ecuador', nameZh: '厄瓜多尔', region: 'americas' },
  { code: 'BO', nameEn: 'Bolivia', nameZh: '玻利维亚', region: 'americas' },
  { code: 'PY', nameEn: 'Paraguay', nameZh: '巴拉圭', region: 'americas' },
  { code: 'UY', nameEn: 'Uruguay', nameZh: '乌拉圭', region: 'americas' },
  { code: 'CU', nameEn: 'Cuba', nameZh: '古巴', region: 'americas' },

  // Africa
  { code: 'ZA', nameEn: 'South Africa', nameZh: '南非', region: 'africa' },
  { code: 'EG', nameEn: 'Egypt', nameZh: '埃及', region: 'africa' },
  { code: 'NG', nameEn: 'Nigeria', nameZh: '尼日利亚', region: 'africa' },
  { code: 'KE', nameEn: 'Kenya', nameZh: '肯尼亚', region: 'africa' },
  { code: 'TZ', nameEn: 'Tanzania', nameZh: '坦桑尼亚', region: 'africa' },
  { code: 'UG', nameEn: 'Uganda', nameZh: '乌干达', region: 'africa' },
  { code: 'ET', nameEn: 'Ethiopia', nameZh: '埃塞俄比亚', region: 'africa' },
  { code: 'GH', nameEn: 'Ghana', nameZh: '加纳', region: 'africa' },

  // Oceania
  { code: 'AU', nameEn: 'Australia', nameZh: '澳大利亚', region: 'oceania' },
  { code: 'NZ', nameEn: 'New Zealand', nameZh: '新西兰', region: 'oceania' },
  { code: 'FJ', nameEn: 'Fiji', nameZh: '斐济', region: 'oceania' },
]

export const POPULAR_COUNTRIES = COUNTRIES.filter(c => c.isPopular)

export const COUNTRIES_BY_REGION = {
  asia: COUNTRIES.filter(c => c.region === 'asia'),
  europe: COUNTRIES.filter(c => c.region === 'europe'),
  americas: COUNTRIES.filter(c => c.region === 'americas'),
  africa: COUNTRIES.filter(c => c.region === 'africa'),
  oceania: COUNTRIES.filter(c => c.region === 'oceania'),
}

export function getCountryName(code: string, locale: 'en' | 'zh' | 'ja' | 'fr'): string {
  const country = COUNTRIES.find(c => c.code === code)
  if (!country) return code
  return locale === 'zh' ? country.nameZh : country.nameEn
}
