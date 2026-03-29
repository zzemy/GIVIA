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
      roleMission: ['你是顶尖的跨文化礼赠顾问、心理学家与社交专家。你需要提供极其专业、富有洞察力、充满人情味并且详尽入微的分析报告。'],
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
        getOutputLanguageConstraint(language, String(country)),
        '如果 riskLevel 为 Low，rescueItem 和 rescueReason 应为空字符串。',
        '如果 riskLevel 为 High，应给出更稳妥的替代礼物和原因。',
        'warning 必须详细说明风险触发点或为何整体安全，结合具体的社会心理学、当地文化潜规则与收礼人的身份背景，字数尽量丰富详实，拒绝空泛和套话。',
        'rescueReason 和 rescueItem 必须极具个性化，结合受众的年龄、职业、身份和具体场景给出极度贴心的替代方案和充满人情味的推荐理由，字数要充足。',
        'packaging 建议必须包含非常具体的材质、色号、风格描述，甚至提到系带、内衬等细节。',
        'card 内容必须充分展现情感厚度，根据收礼人的身份关系和场合，写出真挚、不落俗套、充满巧思的外语（收礼人母语）贺词，篇幅要长，像一封真实的微型信件。',
        '不得省略任何字段，不得输出 null。',
      ],
    },
    userPayload: {
      task: '请输出极其详尽、深度个性化、充满人文和社会心理学洞察的跨文化礼赠风险分析与建议报告（字数要充足、细节要拉满）',
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
        ? '你是世界顶级的社会心理学家与跨文化礼赠顾问。你需要提供极其专业、富有洞察力、充满人情味并且详尽入微的“得体心理学”分析，深入收礼人内心。不要简短，要详细阐述、极具说服力。'
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
        ? 'semanticExplanation：从文化心理学或身份得体角度极其详尽地解释评分由来，深度剖析人际关系与社会潜规则，字数必须充足丰富。'
        : 'semanticExplanation: explain the risk from a cultural/psychological angle in 2-3 sentences.',
      isZh
        ? 'personalizedMitigation：提供极度细节的具体降级、缓解与补救策略（包含包装、动作、时机等极具体的微操），必须充满人情味。'
        : 'personalizedMitigation: give specific mitigation for this recipient and scenario.',
      isZh
        ? 'alternativeFraming：说明如何通过极为高情商的叙事语言或极具巧思的包装设计重新赋予礼物正面的意义，并提供一套完整的话术模板。'
        : 'alternativeFraming: explain how to reframe the gift through language or packaging.',
      isZh
        ? 'culturalContext：深度补充当地社会文化、阶层审美或人际交往的隐含规则背景，字数要详实丰富。'
        : 'culturalContext: briefly explain the local historical or social context.',
      'confidence: 0-1 number.',
    ],
  })
}
