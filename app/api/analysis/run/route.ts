import { NextResponse } from 'next/server'
import { buildUnknownRecognition } from '@/lib/analysis/cultural-analyzer'
import {
  runAnalysisWithLLMEnhancement,
  type AnalysisRunnerOutput,
} from '@/lib/analysis/analysis-runner'
import { sanitizeStringArray, sanitizeTextValue } from '@/lib/ai/guards/input-sanitizer'
import type { AudienceProfileInput, GiftContextInput, P0Locale } from '@/lib/types/gifting-types'
import { runEnhancedAnalysis } from '@/lib/enhancements/enhancement-integration'

export const runtime = 'nodejs'

type RequestPayload = {
  locale?: P0Locale
  country?: string
  countryCode?: string
  recognition?: {
    itemKey?: string
    itemZh?: string
    itemEn?: string
    category?: string
    confidence?: number
  }
  giftContext?: GiftContextInput
  audience?: AudienceProfileInput
  enhancements?: {
    multimodal?: boolean
    collaborativeFiltering?: boolean
    logistics?: boolean
    wideDeep?: boolean
    knowledgeGraph?: boolean
    shippingCountry?: string
    budget?: number
  }
}

type AIAnalysisOverlay = {
  score?: { phonetic?: number; symbol?: number; color?: number }
  fitScore?: number
  riskLevel?: string
  isTaboo?: boolean
  warning?: string
  rescueItem?: string
  rescueReason?: string
  semanticSignals?: string[]
  packaging?: {
    style?: string
    colors?: string | string[]
    materials?: string
    avoid?: string | string[]
  }
  card?: {
    tone?: string
    opener?: string
    body?: string
    closing?: string
  }
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
}

function isRiskLevel(value: unknown): value is AnalysisRunnerOutput['riskLevel'] {
  return value === 'Low' || value === 'Medium' || value === 'High'
}

function normalizeArrayField(value: string | string[] | undefined, fallback: string[]): string[] | null {
  if (value === undefined) {
    return fallback
  }

  const normalized = Array.isArray(value)
    ? sanitizeStringArray(value, { itemMaxLength: 40, maxItems: 6 })
    : sanitizeStringArray(String(value).split(/[,，;；、|]/), { itemMaxLength: 40, maxItems: 6 })

  return normalized.length > 0 ? normalized : null
}

function buildValidatedAIOverlay(
  base: AnalysisRunnerOutput,
  overlay: AIAnalysisOverlay | undefined,
): Partial<AnalysisRunnerOutput> | null {
  if (!overlay) {
    return null
  }

  const score = overlay.score
  if (
    !score ||
    !isIntegerInRange(score.phonetic, 0, 100) ||
    !isIntegerInRange(score.symbol, 0, 100) ||
    !isIntegerInRange(score.color, 0, 100)
  ) {
    return null
  }

  const normalizedScore = {
    phonetic: score.phonetic,
    symbol: score.symbol,
    color: score.color,
  }

  if (!isIntegerInRange(overlay.fitScore, 0, 100) || !isRiskLevel(overlay.riskLevel)) {
    return null
  }

  if (typeof overlay.isTaboo !== 'boolean') {
    return null
  }

  const warning = sanitizeTextValue(overlay.warning, { maxLength: 320 })
  const rescueItem = sanitizeTextValue(overlay.rescueItem, { maxLength: 120 })
  const rescueReason = sanitizeTextValue(overlay.rescueReason, { maxLength: 320 })
  const semanticSignals = sanitizeStringArray(overlay.semanticSignals, {
    itemMaxLength: 80,
    maxItems: 8,
  })
  const packagingStyle = sanitizeTextValue(overlay.packaging?.style, { maxLength: 120 })
  const packagingColors = normalizeArrayField(overlay.packaging?.colors, base.packaging.colors)
  const packagingMaterials = sanitizeTextValue(overlay.packaging?.materials, { maxLength: 120 })
  const packagingAvoid = normalizeArrayField(overlay.packaging?.avoid, base.packaging.avoid)
  const cardTone = sanitizeTextValue(overlay.card?.tone, { maxLength: 120 })
  const cardOpener = sanitizeTextValue(overlay.card?.opener, { maxLength: 160 })
  const cardBody = sanitizeTextValue(overlay.card?.body, { maxLength: 320 })
  const cardClosing = sanitizeTextValue(overlay.card?.closing, { maxLength: 160 })

  if (
    !warning ||
    semanticSignals.length === 0 ||
    !packagingStyle ||
    !packagingColors ||
    !packagingMaterials ||
    !packagingAvoid ||
    !cardTone ||
    !cardOpener ||
    !cardBody ||
    !cardClosing
  ) {
    return null
  }

  return {
    score: normalizedScore,
    fitScore: overlay.fitScore,
    riskLevel: overlay.riskLevel,
    isTaboo: overlay.isTaboo,
    warning,
    rescueItem,
    rescueReason,
    semanticSignals,
    packaging: {
      style: packagingStyle,
      colors: packagingColors,
      materials: packagingMaterials,
      avoid: packagingAvoid,
    },
    card: {
      tone: cardTone,
      opener: cardOpener,
      body: cardBody,
      closing: cardClosing,
    },
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload
    const locale = body.locale === 'zh' ? 'zh' : 'en'
    const country = sanitizeTextValue(body.country, { maxLength: 64 })
    const countryCode = sanitizeTextValue(body.countryCode, { maxLength: 16 })
    const giftContext: GiftContextInput = {
      name: sanitizeTextValue(body.giftContext?.name, { maxLength: 80 }),
      description: sanitizeTextValue(body.giftContext?.description, { maxLength: 240 }),
      visionLabel: sanitizeTextValue(body.giftContext?.visionLabel, { maxLength: 80 }),
      visionDescription: sanitizeTextValue(body.giftContext?.visionDescription, {
        maxLength: 240,
      }),
      source: sanitizeTextValue(body.giftContext?.source, { maxLength: 48 }),
      rawLabels: sanitizeStringArray(body.giftContext?.rawLabels, {
        itemMaxLength: 64,
        maxItems: 6,
      }),
    }
    const audience: AudienceProfileInput = {
      group: sanitizeTextValue(body.audience?.group, { maxLength: 40, fallback: 'peer' }),
      customGroup: sanitizeTextValue(body.audience?.customGroup, { maxLength: 60 }),
      sceneTemplate: sanitizeTextValue(body.audience?.sceneTemplate, {
        maxLength: 60,
        fallback: 'birthday',
      }),
      ageBand: sanitizeTextValue(body.audience?.ageBand, { maxLength: 40, fallback: 'adult' }),
      gender: sanitizeTextValue(body.audience?.gender, { maxLength: 40, fallback: 'neutral' }),
      occupation: sanitizeTextValue(body.audience?.occupation, {
        maxLength: 60,
        fallback: 'office',
      }),
      relationship: sanitizeTextValue(body.audience?.relationship, {
        maxLength: 60,
        fallback: 'friend',
      }),
      occasion: sanitizeTextValue(body.audience?.occasion, { maxLength: 60 }),
      purpose: sanitizeTextValue(body.audience?.purpose, { maxLength: 80 }),
      budgetRange: sanitizeTextValue(body.audience?.budgetRange, {
        maxLength: 40,
        fallback: 'medium',
      }),
      formality: sanitizeTextValue(body.audience?.formality, {
        maxLength: 40,
        fallback: 'semi-formal',
      }),
      notes: sanitizeTextValue(body.audience?.notes, { maxLength: 240 }),
    }

    const recognition = body.recognition?.itemZh || body.recognition?.itemEn || giftContext.name
      ? {
          itemKey: sanitizeTextValue(body.recognition?.itemKey, {
            maxLength: 64,
            fallback: 'unknown',
          }),
          itemZh: sanitizeTextValue(body.recognition?.itemZh, {
            maxLength: 80,
            fallback: giftContext.name || '未命名礼物',
          }),
          itemEn: sanitizeTextValue(body.recognition?.itemEn, {
            maxLength: 80,
            fallback: giftContext.name || 'Unnamed gift',
          }),
          category: sanitizeTextValue(body.recognition?.category, {
            maxLength: 48,
            fallback: 'general',
          }),
          confidence: typeof body.recognition?.confidence === 'number' ? body.recognition.confidence : 0.5,
        }
      : buildUnknownRecognition(giftContext.name)

    const analysis = await runAnalysisWithLLMEnhancement({
      locale,
      country,
      countryCode,
      recognition,
      giftContext,
      audience,
    })

    const hasEnhancements = Boolean(
      body.enhancements?.multimodal ||
        body.enhancements?.collaborativeFiltering ||
        body.enhancements?.logistics ||
        body.enhancements?.wideDeep ||
        body.enhancements?.knowledgeGraph,
    )

    const enhanced = hasEnhancements
      ? await runEnhancedAnalysis({
          recipientProfile: audience,
          country: countryCode || country || 'US',
          shippingCountry:
            sanitizeTextValue(body.enhancements?.shippingCountry, { maxLength: 16 }) ||
            countryCode ||
            country ||
            'US',
          locale: ((body.locale || 'zh') === 'en' ? 'en' : 'zh') as 'en' | 'zh',
          budget: body.enhancements?.budget,
          includeLLM: true,
          includeMultimodal: body.enhancements?.multimodal,
          includeCollaborativeFiltering: body.enhancements?.collaborativeFiltering,
          includeLogistics: body.enhancements?.logistics,
          includeWideDeep: body.enhancements?.wideDeep,
          includeKnowledgeGraph: body.enhancements?.knowledgeGraph,
        })
      : null

    let source = 'local-p0-engine'
    let mergedAnalysis: Record<string, unknown> = analysis as unknown as Record<string, unknown>

    try {
      const aiResponse = await fetch(new URL('/api/cultural-generate', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: country || countryCode || 'Unknown',
          recognition,
          giftContext,
          audience,
          language: locale,
        }),
      })

      if (aiResponse.ok) {
        const aiPayload = (await aiResponse.json()) as {
          analysis?: AIAnalysisOverlay
          source?: string
        }

        const validatedOverlay = buildValidatedAIOverlay(analysis, aiPayload.analysis)

        if (validatedOverlay) {
          mergedAnalysis = {
            ...analysis,
            ...validatedOverlay,
          }
          source = aiPayload.source === 'aliyun-dashscope' ? 'hybrid-ai-rules' : source
        }
      }
    } catch {
      // Local rules remain as the guaranteed fallback when AI generation is unavailable.
    }

    return NextResponse.json({
      source,
      analysis: mergedAnalysis,
      enhancements: enhanced
        ? {
            p1: enhanced.p1Enhancements,
            p2: enhanced.p2Enhancements,
            localizedOutput: enhanced.localizedOutput,
          }
        : undefined,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'failed to run analysis',
      },
      { status: 500 },
    )
  }
}
