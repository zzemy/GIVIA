import { NextResponse } from 'next/server'
import { buildUnknownRecognition } from '@/lib/cultural-analyzer'
import { runAnalysisWithLLMEnhancement } from '@/lib/analysis-runner'
import type { AudienceProfileInput, GiftContextInput, P0Locale } from '@/lib/p0-types'
import { runEnhancedAnalysis } from '@/lib/p1p2-integration'

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
    const locale = body.locale === 'en' ? 'en' : 'zh'
    const audience: AudienceProfileInput = {
      group: body.audience?.group?.trim() || 'peer',
      customGroup: body.audience?.customGroup?.trim() || '',
      sceneTemplate: body.audience?.sceneTemplate?.trim() || 'birthday',
      ageBand: body.audience?.ageBand?.trim() || 'adult',
      gender: body.audience?.gender?.trim() || 'neutral',
      occupation: body.audience?.occupation?.trim() || 'office',
      relationship: body.audience?.relationship?.trim() || 'friend',
      occasion: body.audience?.occasion?.trim() || '',
      purpose: body.audience?.purpose?.trim() || '',
      budgetRange: body.audience?.budgetRange?.trim() || 'medium',
      formality: body.audience?.formality?.trim() || 'semi-formal',
      notes: body.audience?.notes?.trim() || '',
    }

    const recognition = body.recognition?.itemZh || body.recognition?.itemEn || body.giftContext?.name
      ? {
          itemKey: body.recognition?.itemKey || 'unknown',
          itemZh: body.recognition?.itemZh || body.giftContext?.name || '未命名礼物',
          itemEn: body.recognition?.itemEn || body.giftContext?.name || 'Unnamed gift',
          category: body.recognition?.category || 'general',
          confidence: typeof body.recognition?.confidence === 'number' ? body.recognition.confidence : 0.5,
        }
      : buildUnknownRecognition(body.giftContext?.name)

    const analysis = await runAnalysisWithLLMEnhancement({
      locale,
      country: body.country,
      countryCode: body.countryCode,
      recognition,
      giftContext: body.giftContext,
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
          country: body.countryCode || body.country || 'US',
          shippingCountry: body.enhancements?.shippingCountry || body.countryCode || body.country || 'US',
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
          country: body.country || body.countryCode || 'Unknown',
          recognition,
          giftContext: body.giftContext,
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
