import type { ModelMessage } from '@/lib/ai/adapters/types'
import { renderPromptSections } from '@/lib/ai/prompts/shared'

function buildRecognitionSystemPrompt(args: {
  mode: 'text' | 'image'
  language: 'zh' | 'en'
}): string {
  const isEnglish = args.language === 'en'
  const role =
    args.mode === 'text'
      ? isEnglish
        ? 'You are a gift text recognition assistant.'
        : '你是礼物文本识别助手。'
      : isEnglish
        ? 'You are a gift image recognition assistant.'
        : '你是礼物图像识别助手。'

  return renderPromptSections({
    roleMission: [role],
    safetyRules: [
      isEnglish
        ? 'Do not output markdown or extra explanation.'
        : '你必须只输出 JSON，不要输出 Markdown 或额外解释。',
      isEnglish
        ? 'Do not invent a non-gift category if the object is visible from the provided input.'
        : '必须根据提供的输入识别礼物对象，不要臆造与输入无关的类别。',
    ],
    domainContext: [
      args.mode === 'text'
        ? isEnglish
          ? 'You will receive gift text describing the object.'
          : '你会收到描述礼物对象的文本信息。'
        : isEnglish
          ? 'You will receive a gift image plus a short recognition instruction.'
          : '你会收到礼物图片以及一段简短识别指令。',
    ],
    outputContract: [
      isEnglish
        ? 'Output JSON only with fields: label(string), description(string), confidence(number 0-1), synonyms(string[]).'
        : '字段: label(string), description(string), confidence(number 0-1), synonyms(string[])。',
      isEnglish
        ? 'description must be exactly one English sentence with no more than 16 words.'
        : 'description 必须是单句且不超过 30 个汉字。',
      isEnglish
        ? 'label must be a common English noun. synonyms max 3 items.'
        : 'label 使用英文通用名词，synonyms 最多 3 项。',
    ],
  })
}

export function buildTextRecognitionMessages(text: string, language: 'zh' | 'en'): ModelMessage[] {
  return [
    {
      role: 'system',
      content: buildRecognitionSystemPrompt({ mode: 'text', language }),
    },
    {
      role: 'user',
      content:
        language === 'en'
          ? `Identify the gift object from this text and provide one brief English description sentence. label must be a precise common English noun, avoid preset terms. Gift text: ${text}`
          : `根据这段礼物信息识别礼物对象，并补充一句简短的物品描述。label 请使用最贴切的英文通用名词，避免套用固定预设词。礼物信息：${text}`,
    },
  ]
}

export function buildImageRecognitionMessages(language: 'zh' | 'en'): {
  system: ModelMessage
  userText: string
} {
  return {
    system: {
      role: 'system',
      content: buildRecognitionSystemPrompt({ mode: 'image', language }),
    },
    userText:
      language === 'en'
        ? 'Identify the gift object in this image and provide one brief English description sentence. label must be a precise common English noun, avoid preset terms.'
        : '识别这张图片中的礼物对象，并补充一句礼物描述。label 请使用最贴切的英文通用名词，避免套用固定预设词。',
  }
}
