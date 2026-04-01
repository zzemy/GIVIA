// lib/dev/mock-data.ts
/**
 * Mock数据用于开发和测试
 * 可以在 use-home-page-controller 中注入这些数据来快速跳到各个步骤
 */

export const mockGiftData = {
  step1: {
    giftName: '小米手机 14 Ultra',
    giftDescription: '高端专业拍照手机，具有1英寸传感器和焦距可变设计，2024年旗舰产品',
  },
}

export const mockCountryData = {
  step2: {
    selectedCountry: 'JP',
    targetGroup: 'colleague',
    customAudienceGroup: '',
  },
}

export const mockAnalysisResult = {
  step5: {
    scoreBreakdown: {
      culturalRelevance: 78,
      appropriateness: 85,
      purchaseFeasibility: 92,
      overallScore: 85,
    },
    conclusionCards: [
      {
        type: 'primary',
        title: '推荐结果',
        content: '适合作为礼物送给日本同事',
        confidence: 'high',
      },
    ],
    riskAssessment: {
      level: 'low',
      warning: null,
      guidelines: ['准备日文说明书', '注意颜色禁忌'],
    },
    recommendations: [
      {
        type: 'primary',
        title: '首选方案',
        description: '直接购买并包装送达',
        reasoning: '日本职场文化接受高端电子产品作为礼物',
        actionItems: ['在日本Amazon购买', '使用礼仪包装'],
        channels: ['amazon.co.jp', '楽天'],
      },
    ],
  },
}

/**
 * 使用方式：
 * 
 * // 在 use-home-page-controller.tsx 中
 * const [giftInputProps, setGiftInputProps] = useState({
 *   giftName: isDev ? mockGiftData.step1.giftName : '',
 *   giftDescription: isDev ? mockGiftData.step1.giftDescription : '',
 *   onGiftNameChange: (name) => {...},
 *   onGiftDescriptionChange: (desc) => {...},
 * })
 * 
 * // 切换开发模式
 * const isDev = process.env.NODE_ENV === 'development' && localStorage.getItem('dev_mock') === '1'
 * 
 * // 在浏览器控制台执行，启用mock数据
 * localStorage.setItem('dev_mock', '1')
 * 
 * // 禁用mock数据
 * localStorage.removeItem('dev_mock')
 */
