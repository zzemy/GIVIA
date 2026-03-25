import type { RecognitionResult, SupportedCountry } from '@/lib/analysis/cultural-analyzer'
import type { ModelMessage } from '@/lib/ai/adapters/types'
import {
  type PromptAudienceContext,
  type PromptGiftContext,
  type PromptLanguage,
  buildPromptMessages,
} from '@/lib/ai/prompts/shared'

function getOutputLanguageConstraint(language: PromptLanguage): string {
  if (language === 'en') {
    return '所有文案用英文，不要输出中文。'
  }

  return '所有文案用简体中文。'
}

interface RepairInput {
  language: PromptLanguage
  country: SupportedCountry
  recognition: RecognitionResult
  giftContext: PromptGiftContext
  audience: PromptAudienceContext
}

export function buildCulturalRepairMessages(
  input: RepairInput & {
    previousOutput: string
    missingFields: string[]
  },
): ModelMessage[] {
  return buildPromptMessages({
    sections: {
      roleMission: ['你是 JSON 结构修复器。'],
      safetyRules: [
        '任务是把上一轮模型输出修复成完整 JSON。',
        '必须严格使用输入中的 country，不允许改写国家。',
        '修复时必须保持 audience（目标群体）上下文语义。',
        '输出必须是严格 JSON，不要输出解释。',
      ],
      domainContext: [
        '你会收到 country、recognition、giftContext、audience、missingFields 和 previousOutput。',
      ],
      outputContract: [
        '必须包含完整字段：score, riskLevel, isTaboo, warning, rescueItem, rescueReason, semanticSignals, packaging, card。',
        'score 里必须有 phonetic/symbol/color；packaging 必须有 style/colors/materials/avoid；card 必须有 tone/opener/body/closing。',
        'riskLevel 只能是 Low/Medium/High。',
        getOutputLanguageConstraint(input.language),
      ],
    },
    userPayload: {
      task: '修复为字段完整的 JSON',
      country: input.country,
      recognition: input.recognition,
      giftContext: input.giftContext,
      audience: input.audience,
      missingFields: input.missingFields,
      previousOutput: input.previousOutput,
    },
  })
}

export function buildCulturalMissingFieldPatchMessages(
  input: RepairInput & {
    previousOutput: Record<string, unknown>
    missingFields: string[]
  },
): ModelMessage[] {
  return buildPromptMessages({
    sections: {
      roleMission: ['你是 JSON 补全器。'],
      safetyRules: [
        '你的任务是只补齐缺失字段，不要改写已有字段语义。',
        '必须严格使用输入中的 country，不允许改写国家。',
        '补全时必须保持 audience（目标群体）上下文语义。',
        '输出必须是严格 JSON，不要输出解释。',
      ],
      domainContext: [
        '你会收到 country、recognition、giftContext、audience、missingFields 和 previousOutput。',
      ],
      outputContract: [
        '如果缺失 score.*，就补 score.phonetic/score.symbol/score.color（0-100 整数）。',
        '如果缺失 packaging.*，就补 packaging.style/colors/materials/avoid（非空字符串）。',
        '返回 JSON patch 对象，可包含 score/packaging/card 等需要补齐的字段。',
        getOutputLanguageConstraint(input.language),
      ],
    },
    userPayload: {
      task: '只补齐缺失字段',
      country: input.country,
      recognition: input.recognition,
      giftContext: input.giftContext,
      audience: input.audience,
      missingFields: input.missingFields,
      previousOutput: input.previousOutput,
      outputRequirement: '返回 JSON patch 对象，可包含 score/packaging/card 等需要补齐的字段',
    },
  })
}

export function buildCulturalStrictTemplateMessages(
  input: RepairInput & {
    previousOutput: Record<string, unknown>
    missingFields: string[]
  },
): ModelMessage[] {
  const template = {
    score: { phonetic: 60, symbol: 60, color: 60 },
    riskLevel: 'Medium',
    isTaboo: false,
    warning: '',
    rescueItem: '',
    rescueReason: '',
    semanticSignals: [''],
    packaging: {
      style: '',
      colors: '',
      materials: '',
      avoid: '',
    },
    card: {
      tone: '',
      opener: '',
      body: '',
      closing: '',
    },
  }

  return buildPromptMessages({
    sections: {
      roleMission: ['你是严格 JSON 生成器。'],
      safetyRules: [
        '必须输出完整 JSON，字段一个都不能少。',
        '必须严格使用输入中的 country，不允许改写国家。',
        '必须结合 audience（目标群体）上下文给出风格和风险建议。',
        '不允许输出 null，不允许输出解释，不允许输出 Markdown。',
      ],
      domainContext: [
        '你会收到 country、recognition、giftContext、audience、missingFields、previousOutput 和 template。',
      ],
      outputContract: [
        'score.phonetic/symbol/color 必须是 0-100 整数。',
        'packaging.style/colors/materials/avoid 必须是非空字符串。',
        'card.tone/opener/body/closing 必须是非空字符串。',
        'semanticSignals 必须是非空字符串数组。',
        'riskLevel 只能是 Low/Medium/High。',
        getOutputLanguageConstraint(input.language),
      ],
    },
    userPayload: {
      task: '按模板返回完整 JSON',
      country: input.country,
      recognition: input.recognition,
      giftContext: input.giftContext,
      audience: input.audience,
      missingFields: input.missingFields,
      previousOutput: input.previousOutput,
      template,
      note: '请在保持现有语义的前提下补齐并规范化所有字段。',
    },
  })
}
