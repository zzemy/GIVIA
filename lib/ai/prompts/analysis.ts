import type { RecognitionResult, SupportedCountry } from '@/lib/analysis/cultural-analyzer'
import type { GiftProfile } from '@/lib/analysis/gift-profile'
import type { ModelMessage } from '@/lib/ai/adapters/types'
import type { AnalysisEngineResult, AudienceProfileInput, P0Locale } from '@/lib/types/gifting-types'
import {
  type PromptAudienceContext,
  type PromptGiftContext,
  type PromptLanguage,
  buildPromptMessages,
  renderPromptSections,
} from '@/lib/ai/prompts/shared'

function getOutputLanguageConstraint(language: PromptLanguage, countryName: string): string {
  if (language === 'en') {
    return `All text must be in English. EXCEPTION: The 'card' (Greeting Card) content MUST be written in the native language spoken in ${countryName} (e.g. if country is Japan, write the card in Japanese).`
  }

  return `除 'card' (贺卡) 之外的所有文案必须使用简体中文。例外：'card' 内部的文案必须使用 ${countryName} 当地的母语（例如：如果是日本则必须用日语写贺卡，法国用法语，英国用英语等）。`
}

export function buildCulturalAnalysisMessages(input: {
  language: PromptLanguage
  country: SupportedCountry
  recognition: RecognitionResult
  giftContext: PromptGiftContext
  audience: PromptAudienceContext
}): ModelMessage[] {
  const { language, country, recognition, giftContext, audience } = input

  return buildPromptMessages({
    sections: {
      roleMission: ['你是跨文化礼赠顾问。'],
      safetyRules: [
        '国家上下文必须严格使用输入中的 country，不允许自行改写国家。',
        '必须结合 audience（目标群体）完整字段调整风险判断与建议语气，包括群体、场景、关系、预算、正式度、备注。',
        '你必须输出严格 JSON，不要输出 Markdown。',
      ],
      domainContext: [
        '你将收到 country、recognition、giftContext、audience 四类输入。',
        '必须基于输入中的礼物信息、受众上下文和国家背景完成分析。',
      ],
      outputContract: [
        '输出字段必须包含：score, riskLevel, isTaboo, warning, rescueItem, rescueReason, semanticSignals, packaging, card。',
        'score 为 phonetic/symbol/color 0-100 的整数。请严格根据送礼的不得体程度打分，如果没有禁忌但稍微不太合适，可以给 30-50 分，不要都给 0。',
        'riskLevel 只能是 Low、Medium、High。',
        'packaging 必须有 style/colors/materials/avoid。',
        'card 必须有 tone/opener/body/closing。',
        getOutputLanguageConstraint(language, country.nameZh),
        '如果 riskLevel 为 Low，rescueItem 和 rescueReason 应为空字符串。',
        '如果 riskLevel 为 High，应给出更稳妥的替代礼物和原因。',
        'warning 必须明确说明风险触发点或为何整体安全，不能空泛。',
        '不得省略任何字段，不得输出 null。',
      ],
    },
    userPayload: {
      task: '请输出跨文化礼赠风险分析与建议',
      country,
      recognition,
      giftContext,
      audience,
      constraints: {
        tabooPolicy: '若存在文化禁忌，isTaboo 必须 true，并写清风险语义。如果没有严重的文化禁忌，绝不要生搬硬套或硬扯禁忌！请将分析重点转移到：礼物是否符合两人的【关系深度】、是否适合该【场景场合】。',
        actionable: '建议必须可执行，避免空泛。',
      },
    },
  })
}

export function buildRiskEnhancementPrompt(input: {
  locale: P0Locale
  countryCode: string
  countryName: string
  giftName: string
  giftProfile: GiftProfile
  audience: AudienceProfileInput
  ruleResult: AnalysisEngineResult
}): string {
  const isZh = input.locale === 'zh'
  const ruleExplanation = input.ruleResult.matchedRules
    .slice(0, 3)
    .map(rule => rule.explanation)
    .join('; ')

  return renderPromptSections({
    roleMission: [
      isZh
        ? '你是跨文化礼物选择专家，需要提供语义级别的风险解释和个性化缓解建议。最重要的是：如果没有生硬的文化禁忌，请从收礼人的身份关系、日常体面度和实用性出发进行“得体心理学”分析，绝不要无中生有地生搬硬套鬼神禁忌。'
        : 'You are a cross-cultural gifting expert. If there are no severe cultural taboos, do not invent or force pseudo-taboos. Instead, analyze the psychological appropriateness, etiquette, relationship depth, and utility of the gift.',
    ],
    safetyRules: [
      isZh
        ? '只能根据给定礼物信息、国家和收礼场景做分析，不要臆造缺失事实。'
        : 'Only analyze from the provided gift, country, and recipient context. Do not invent missing facts.',
      isZh ? '必须只输出 JSON，不要输出额外解释。返回的所有文案必须是纯中文。' : 'Reply with JSON only and no extra explanation. ALL returned text must be strictly in English.',
    ],
    domainContext: [
      (isZh ? '礼物名称：' : 'Gift name: ') + input.giftName,
      (isZh ? '礼物类别：' : 'Gift category: ') + input.giftProfile.category,
      (isZh ? '礼物特征：' : 'Gift style: ') + input.giftProfile.styles.join(', '),
      (isZh ? '目标国家：' : 'Target country: ') + input.countryName + ' (' + input.countryCode + ')',
      (isZh ? '收礼人：' : 'Recipient: ') +
        (input.audience.relationship || 'friend') + ', ' +
        (input.audience.occupation || 'unknown') + ', ' +
        (input.audience.ageBand || 'unknown'),
      (isZh ? '场景：' : 'Occasion: ') + (input.audience.sceneTemplate || 'general'),
      (isZh ? '正式程度：' : 'Formality: ') + (input.audience.formality || 'semi-formal'),
      (isZh ? '规则层发现：' : 'Rule-based findings: ') + (ruleExplanation || (isZh ? '暂无规则命中' : 'No rules matched')),
      (isZh ? '风险等级：' : 'Risk level: ') + input.ruleResult.riskLevel,
      (isZh ? '风险分数：' : 'Risk score: ') + String(input.ruleResult.riskScore) + '/100',
    ],
    outputContract: [
      isZh
        ? '返回 JSON 字段：semanticExplanation, personalizedMitigation, alternativeFraming, culturalContext, confidence。'
        : 'Return JSON with fields: semanticExplanation, personalizedMitigation, alternativeFraming, culturalContext, confidence.',
      isZh
        ? 'semanticExplanation：从文化心理学或身份得体角度解释目前的综合评分由来（不要硬扯禁忌，关注人际关系的恰当性），2-3 句。'
        : 'semanticExplanation: explain the risk from a cultural/psychological angle in 2-3 sentences.',
      isZh
        ? 'personalizedMitigation：给出针对该收礼人和场景的具体缓解建议。'
        : 'personalizedMitigation: give specific mitigation for this recipient and scenario.',
      isZh
        ? 'alternativeFraming：说明如何通过语言或包装重新诠释礼物。'
        : 'alternativeFraming: explain how to reframe the gift through language or packaging.',
      isZh
        ? 'culturalContext：简要说明当地文化中的历史或社会背景。'
        : 'culturalContext: briefly explain the local historical or social context.',
      'confidence: 0-1 number.',
    ],
  })
}
