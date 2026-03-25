import type { AnalysisEngineResult, AudienceProfileInput, P0Locale } from '@/lib/types/gifting-types'
import type { GiftProfile } from '@/lib/analysis/gift-profile'

/**
 * LLM-enhanced risk assessment: Add semantic explanations and personalized mitigation suggestions
 * This supplements the rule-based engine with LLM-generated contextual insights
 */

export interface LLMEnhancementInput {
  locale: P0Locale
  countryCode: string
  countryName: string
  giftName: string
  giftProfile: GiftProfile
  audience: AudienceProfileInput
  ruleResult: AnalysisEngineResult // Output from rule-based engine
}

export interface LLMEnhancedRiskResult {
  semanticExplanation: string // LLM-generated explanation of why it's risky
  personalizedMitigation: string // Personalized suggestion for this specific context
  alternativeFraming: string // How to reframe the gift narrative
  culturalContext: string // Cultural background of the risk
  confidence: number // 0-1 confidence in the LLM output
}

/**
 * Enhance rule-based risk assessment with LLM semantic understanding
 * Falls back to rule-based explanations if LLM is unavailable
 */
export async function enhanceRiskWithLLM(
  input: LLMEnhancementInput,
): Promise<LLMEnhancedRiskResult | null> {
  try {
    // Build context prompt for LLM
    const prompt = buildEnhancementPrompt(input)

    // Call LLM service (e.g., Claude/GPT via Anthropic/OpenAI)
    const llmResponse = await callLLMForRiskEnhancement(prompt, input.locale)

    if (!llmResponse) {
      return null
    }

    return parseEnhancementResponse(llmResponse, input.locale)
  } catch (error) {
    // LLM enhancement is optional; gracefully degrade
    console.warn('[LLM Enhancement] Failed to enhance risk assessment:', error)
    return null
  }
}

function buildEnhancementPrompt(input: LLMEnhancementInput): string {
  const isZh = input.locale === 'zh'
  const ruleExplanation = input.ruleResult.matchedRules
    .slice(0, 3)
    .map(r => (isZh ? r.explanation : r.explanation))
    .join('; ')

  if (isZh) {
    return `你是跨文化礼物选择专家。我需要你为以下情境提供语义级别的解释和个性化缓解建议：

【礼物信息】
- 名称：${input.giftName}
- 类别：${input.giftProfile.category}
- 特征：${input.giftProfile.styles.join(', ')}

【赠礼情景】
- 目标国家：${input.countryName} (${input.countryCode})
- 收礼人：${input.audience.relationship || 'friend'}, ${input.audience.occupation || 'unknown'}, ${input.audience.ageBand || 'unknown'}
- 场景：${input.audience.sceneTemplate || 'general'}
- 正式程度：${input.audience.formality || 'semi-formal'}

【规则层发现的风险】
${ruleExplanation || '暂无规则命中'}
风险等级：${input.ruleResult.riskLevel}
风险分数：${input.ruleResult.riskScore}/100

请按以下JSON格式回复（仅返回JSON，不要其他内容）：
{
  "semanticExplanation": "从文化心理学角度解释为什么这个礼物在此国家/情景中有风险（2-3句，深层解释而非规则重述）",
  "personalizedMitigation": "针对这个特定收礼人和场景的个性化缓解建议（具体、可执行、不冗余）",
  "alternativeFraming": "如何用语言或包装重新诠释这个礼物以降低风险（策略性建议）",
  "culturalContext": "这类风险在当地文化中的历史或社会背景（简要、教育性）",
  "confidence": 0.85
}`
  }

  return `You are a cross-cultural gifting expert. Provide semantic-level explanation and personalized mitigation for:

【Gift Info】
- Name: ${input.giftName}
- Category: ${input.giftProfile.category}
- Style: ${input.giftProfile.styles.join(', ')}

【Gifting Context】
- Target country: ${input.countryName} (${input.countryCode})
- Recipient: ${input.audience.relationship || 'friend'}, ${input.audience.occupation || 'unknown'}, ${input.audience.ageBand || 'unknown'}
- Occasion: ${input.audience.sceneTemplate || 'general'}
- Formality: ${input.audience.formality || 'semi-formal'}

【Rule-Based Findings】
${ruleExplanation || 'No rules matched'}
Risk Level: ${input.ruleResult.riskLevel}
Risk Score: ${input.ruleResult.riskScore}/100

Reply with JSON only (no other text):
{
  "semanticExplanation": "Cultural/psychological explanation of why this gift is risky in this context (2-3 sentences, deeper than rule-based)",
  "personalizedMitigation": "Specific, actionable mitigation for this recipient and scenario (not generic)",
  "alternativeFraming": "How to reframe this gift through language or packaging narrative",
  "culturalContext": "Historical or social background of this risk in local culture (brief, educational)",
  "confidence": 0.85
}`
}

async function callLLMForRiskEnhancement(prompt: string, locale: P0Locale): Promise<string | null> {
  try {
    void locale

    // Try to use Claude API if available
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return null
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.warn('[LLM] API error:', response.status, error)
      return null
    }

    const data = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>
    }
    const textContent = data.content?.find(c => c.type === 'text')
    return textContent?.text ?? null
  } catch (error) {
    console.warn('[LLM] Request failed:', error)
    return null
  }
}

function parseEnhancementResponse(response: string, locale: P0Locale): LLMEnhancedRiskResult | null {
  try {
    void locale

    // Extract JSON from response (LLM might include markdown formatting)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return null
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      semanticExplanation?: string
      personalizedMitigation?: string
      alternativeFraming?: string
      culturalContext?: string
      confidence?: number
    }

    return {
      semanticExplanation: parsed.semanticExplanation?.trim() || '',
      personalizedMitigation: parsed.personalizedMitigation?.trim() || '',
      alternativeFraming: parsed.alternativeFraming?.trim() || '',
      culturalContext: parsed.culturalContext?.trim() || '',
      confidence: Math.max(0, Math.min(1, parsed.confidence ?? 0.75)),
    }
  } catch (error) {
    console.warn('[LLM] Parse error:', error)
    return null
  }
}

/**
 * Merge LLM enhancement with rule-based result
 */
export function mergeLLMEnhancement(
  ruleResult: AnalysisEngineResult,
  llmEnhancement: LLMEnhancedRiskResult | null,
  locale: P0Locale,
): AnalysisEngineResult {
  void locale

  if (!llmEnhancement || llmEnhancement.confidence < 0.5) {
    return ruleResult // Keep original if LLM confidence is low
  }

  // Enhance the rule result with LLM insights
  return {
    ...ruleResult,
    warning:
      llmEnhancement.semanticExplanation ||
      ruleResult.warning,
    rescueItem:
      llmEnhancement.personalizedMitigation ||
      ruleResult.rescueItem,
    rescueReason:
      llmEnhancement.alternativeFraming ||
      ruleResult.rescueReason,
    semanticSignals: [
      ...ruleResult.semanticSignals,
      llmEnhancement.culturalContext,
    ].filter(Boolean),
  }
}
