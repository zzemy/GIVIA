import { NextResponse } from 'next/server'
import type { ModelMessage } from '@/lib/ai/adapters/types'
import { requestDashScopeCompletion } from '@/lib/ai/adapters/dashscope'
import { sanitizeTextValue } from '@/lib/ai/guards/input-sanitizer'
import { detectPromptInjectionInFields, prependPromptInjectionGuard } from '@/lib/ai/guards/prompt-injection'
import { beautifyDescriptionText } from '@/components/gifting/home/utils/recognition-helpers'

type RefinePayload = {
  text?: string
  language?: 'zh' | 'en'
}

function buildMessages(text: string, language: 'zh' | 'en'): ModelMessage[] {
  const system =
    language === 'zh'
      ? '你是礼物编辑助手。请把用户提供的礼物描述润色成更自然、得体、简洁的对象文字。只输出润色后的最终文本，不要解释，不要加引号，不要分点。保留原意，不新增虚构事实，长度控制在 80 字以内。'
      : 'You are a gifting editorial assistant. Rewrite the user provided gift description into concise, polished object prose. Output only the rewritten text, with no explanation, quotes, or bullets. Preserve the original meaning, invent no new facts, and keep it within 80 words.'

  const user =
    language === 'zh'
      ? `请润色这段礼物描述：${text}`
      : `Refine this gift description: ${text}`

  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as RefinePayload
    const language = payload.language === 'en' ? 'en' : 'zh'
    const text = sanitizeTextValue(payload.text, { maxLength: 320 })

    if (!text) {
      return NextResponse.json({ error: language === 'zh' ? '缺少待润色文本' : 'Missing text to refine' }, { status: 400 })
    }

    const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY
    const model = process.env.ALIYUN_DASHSCOPE_TEXT_MODEL ?? 'qwen-plus-latest'
    const baseUrl = process.env.ALIYUN_DASHSCOPE_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1'

    const fallback = beautifyDescriptionText(text, language === 'zh')

    if (!apiKey) {
      return NextResponse.json({ text: fallback, source: 'local-fallback' })
    }

    const assessment = detectPromptInjectionInFields([text])
    const messages = prependPromptInjectionGuard(buildMessages(text, language), assessment)

    const completion = await requestDashScopeCompletion({
      apiKey,
      baseUrl,
      model,
      messages,
      temperature: 0.35,
      maxTokens: 140,
      networkErrorPrefix: 'dashscope text refine network error',
      providerErrorPrefix: 'dashscope text refine request failed',
    })

    if (!completion.ok) {
      return NextResponse.json({ text: fallback, source: 'local-fallback', warning: completion.error })
    }

    const refined = sanitizeTextValue(completion.content, { maxLength: 320 })
    return NextResponse.json({
      text: beautifyDescriptionText(refined || text, language === 'zh'),
      source: 'aliyun-dashscope-text',
    })
  } catch {
    return NextResponse.json({ error: 'failed to refine text' }, { status: 500 })
  }
}
