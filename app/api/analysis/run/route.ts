import { NextResponse } from 'next/server'
import { buildUnknownRecognition } from '@/lib/analysis/cultural-analyzer'
import { runAnalysisWithLLMEnhancement } from '@/lib/analysis/analysis-runner'
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
          locale: (body.locale || 'zh') as 'en' | 'zh' | 'ja' | 'fr',
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
          analysis?: {
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
          source?: string
        }

        if (aiPayload.analysis) {
          mergedAnalysis = {
            ...analysis,
            score: aiPayload.analysis.score ?? analysis.score,
            fitScore: typeof aiPayload.analysis.fitScore === 'number' ? aiPayload.analysis.fitScore : analysis.fitScore,
            riskLevel: aiPayload.analysis.riskLevel ?? analysis.riskLevel,
            isTaboo: typeof aiPayload.analysis.isTaboo === 'boolean' ? aiPayload.analysis.isTaboo : analysis.isTaboo,
            warning: aiPayload.analysis.warning ?? analysis.warning,
            rescueItem: aiPayload.analysis.rescueItem ?? analysis.rescueItem,
            rescueReason: aiPayload.analysis.rescueReason ?? analysis.rescueReason,
            semanticSignals: Array.isArray(aiPayload.analysis.semanticSignals)
              ? aiPayload.analysis.semanticSignals
              : analysis.semanticSignals,
            packaging: aiPayload.analysis.packaging
              ? {
                  style: aiPayload.analysis.packaging.style ?? analysis.packaging.style,
                  colors: aiPayload.analysis.packaging.colors ?? analysis.packaging.colors,
                  materials: aiPayload.analysis.packaging.materials ?? analysis.packaging.materials,
                  avoid: aiPayload.analysis.packaging.avoid ?? analysis.packaging.avoid,
                }
              : analysis.packaging,
            card: aiPayload.analysis.card
              ? {
                  tone: aiPayload.analysis.card.tone ?? analysis.card.tone,
                  opener: aiPayload.analysis.card.opener ?? analysis.card.opener,
                  body: aiPayload.analysis.card.body ?? analysis.card.body,
                  closing: aiPayload.analysis.card.closing ?? analysis.card.closing,
                }
              : analysis.card,
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
