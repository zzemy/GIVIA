'use client'

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCountryName } from '@/lib/countries'
import type { AnalysisResult, EnhancedAnalysisState, Locale } from '@/components/gifting/home/types'

interface RiskActionMeta {
  title: string
  tooltip: string
  panelClassName: string
  textClassName: string
}

interface ResultsSectionProps {
  analysis: AnalysisResult
  analysisEnhancements: EnhancedAnalysisState | null
  analysisSource: string
  locale: Locale
  t: (path: string) => string
  selectedCountry: string
  selectedAudienceLabel: string
  sceneLabel: string
  visionDescription: string
  giftDescription: string
  targetProfile: string
  hasAnalysisEnhancementResults: boolean
  favoriteRecommendationIds: string[]
  riskReasons: string[]
  mustSendAdvice: string[]
  riskActionMeta: RiskActionMeta | null
  formatCurrencyAmount: (value: number, currency: string, locale: Locale) => string
  onReset: () => void
  onToggleFavoriteRecommendation: (id: string) => void
}

const reportPhotography = {
  lead:
    'https://images.pexels.com/photos/35126573/pexels-photo-35126573.jpeg?cs=srgb&dl=pexels-iris-35126573.jpg&fm=jpg',
  note:
    'https://images.pexels.com/photos/20691302/pexels-photo-20691302.jpeg?cs=srgb&dl=pexels-dziana-hasanbekava-20691302.jpg&fm=jpg',
  arrival:
    'https://images.pexels.com/photos/6869042/pexels-photo-6869042.jpeg?cs=srgb&dl=pexels-kindelmedia-6869042.jpg&fm=jpg',
}

export function ResultsSection({
  analysis,
  analysisEnhancements,
  analysisSource,
  locale,
  selectedCountry,
  selectedAudienceLabel,
  sceneLabel,
  visionDescription,
  giftDescription,
  targetProfile,
  hasAnalysisEnhancementResults,
  favoriteRecommendationIds,
  riskReasons,
  mustSendAdvice,
  riskActionMeta,
  formatCurrencyAmount,
  onReset,
  onToggleFavoriteRecommendation,
}: ResultsSectionProps) {
  const isZh = locale === 'zh'
  const topRecommendation = analysis.recommendations[0]
  const countryLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选择国家' : 'No country'
  const contextParagraph = [visionDescription.trim() || giftDescription.trim(), targetProfile.trim()].filter(Boolean).join(' ')
  const logisticsEstimate = analysisEnhancements?.p1?.logisticsEstimate
  const multimodalResults = analysisEnhancements?.p1?.multimodalResults
  const collaborativeResults = analysisEnhancements?.p1?.collaborativeResults ?? analysisEnhancements?.p2?.wideDeepResults ?? []

  const summaryTitle =
    analysis.riskLevel === 'Low'
      ? isZh
        ? '这份心意的整体方向是稳的。'
        : 'The overall direction of the gesture is steady.'
      : analysis.riskLevel === 'Medium'
        ? isZh
          ? '这份心意还需要再被编辑一次。'
          : 'This gesture needs one more editorial pass.'
        : isZh
          ? '这份心意此刻不宜按原样送出。'
          : 'This gesture should not be sent as it stands.'

  const summaryBody =
    analysis.warning ||
    (analysis.riskLevel === 'Low'
      ? isZh
        ? '真正还需要拿捏的，是包装语气、卡片措辞，以及它会以怎样的方式落到对方手里。'
        : 'What still matters is the packaging register, the wording on the card, and the way the gesture finally lands in the other person’s hands.'
      : isZh
        ? '更合适的做法，是先整理表达方式，再考虑替代方向，让这份心意重新回到人与文化之间。'
        : 'A better route is to revise the expression first, then consider alternatives, so the centre of the gesture returns to people and culture.')

  const openingRecommendation =
    topRecommendation
      ? isZh
        ? topRecommendation.nameZh
        : topRecommendation.nameEn
      : analysis.rescueItem || (isZh ? '继续细化当前礼物' : 'Refine the current gift further')

  const openingRecommendationReason =
    topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason

  const memoLines =
    riskReasons.length > 0
      ? riskReasons
      : analysis.matchedRules.length > 0
        ? analysis.matchedRules.map(rule => rule.explanation)
        : [
            isZh
              ? '暂时未见明显文化风险，但包装与表达细节依然会改变对方最终如何理解这份好意。'
              : 'No major cultural risk appears immediately, though packaging and wording still shape how the gesture will finally be understood.',
          ]

  const adviceLines =
    mustSendAdvice.length > 0
      ? mustSendAdvice
      : analysis.matchedRules.length > 0
        ? analysis.matchedRules.map(rule => rule.suggestion)
        : [
            isZh
              ? '当前没有额外补救建议，但依旧建议同步收紧表达语气与包装细节。'
              : 'No additional mitigation is required for now, though wording and packaging should still be refined together.',
          ]

  const conclusionCards = [
    { label: isZh ? '当前结论' : 'Current conclusion', value: analysis.riskLevel },
    { label: isZh ? '契合度' : 'Fit score', value: `${analysis.fitScore}` },
    { label: isZh ? '包装方向' : 'Packaging direction', value: analysis.packaging.style },
    { label: isZh ? '表达语气' : 'Message tone', value: analysis.greetingCard.tone },
  ]

  const semanticLines = [
    analysis.semanticSignals.tags.length > 0 ? analysis.semanticSignals.tags.join(', ') : null,
    analysis.semanticSignals.flowers.length > 0 ? analysis.semanticSignals.flowers.join(', ') : null,
    analysis.semanticSignals.numbers.length > 0 ? analysis.semanticSignals.numbers.join(', ') : null,
  ].filter(Boolean)

  const additionalLayers = [
    multimodalResults
      ? {
          title: isZh ? '视觉细读补充' : 'Visual verification',
          body: isZh
            ? `补充识别来源为 ${multimodalResults.enrichmentSource}，置信度约 ${(multimodalResults.confidenceScore * 100).toFixed(0)}%。`
            : `Additional reading sourced from ${multimodalResults.enrichmentSource} with roughly ${(multimodalResults.confidenceScore * 100).toFixed(0)}% confidence.`,
        }
      : null,
    logisticsEstimate
      ? {
          title: isZh ? '送达预演' : 'Delivery rehearsal',
          body: isZh
            ? `${logisticsEstimate.recommendedCarrier} 预计 ${logisticsEstimate.deliveryTimeRange}，总成本约 ${formatCurrencyAmount(logisticsEstimate.totalEstimatedCost, logisticsEstimate.destinationCurrency as never, locale)}。`
            : `${logisticsEstimate.recommendedCarrier} is estimated at ${logisticsEstimate.deliveryTimeRange}, with a total cost around ${formatCurrencyAmount(logisticsEstimate.totalEstimatedCost, logisticsEstimate.destinationCurrency as never, locale)}.`,
        }
      : null,
    collaborativeResults.length > 0
      ? {
          title: isZh ? '替代方向校准' : 'Alternative reranking',
          body: isZh
            ? '结果还吸收了更深层的替代方向重排，用来修正推荐的先后顺序。'
            : 'The dossier also incorporates deeper reranking to refine the order of alternative directions.',
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; body: string }>

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[60rem]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9aa3b2]">Editorial dossier</p>
          <h2 className="mt-3 text-[3rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17] md:text-[3.4rem]">
            {isZh
              ? '这里呈现的不是判断面板，而是一份关于这份心意该如何被重新写作的终稿。'
              : 'What appears here is not a judgment panel, but a final authored dossier on how the gesture should be rewritten.'}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#69707d]">
            {countryLabel} · {selectedAudienceLabel} · {sceneLabel}
          </p>
        </div>

        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/82 px-5 py-3 text-[#495161] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_44px_-26px_rgba(15,23,42,0.18)]"
        >
          <RotateCcw size={16} />
          {isZh ? '开启下一份终稿' : 'Open a new dossier'}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-[3rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,243,237,0.96))] shadow-[0_40px_90px_-56px_rgba(15,23,42,0.16)]">
        <section
          className="relative overflow-hidden border-b border-black/6"
          style={{
            backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(18,15,13,0.36)),url(${reportPhotography.lead})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.24),transparent_28%)] mix-blend-screen" />
          <div className="relative px-6 py-10 text-white sm:px-8 xl:px-10 xl:py-12">
            <div className="max-w-[48rem]">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/82">
                  {analysisSource === 'hybrid-ai-rules' ? (isZh ? '文化线索共读' : 'Cultural reading') : isZh ? '在地文化判断' : 'Local cultural reading'}
                </span>
                {riskActionMeta && (
                  <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/82">
                    {riskActionMeta.title}
                  </span>
                )}
              </div>

              <h3 className="mt-6 max-w-[42rem] text-[2.9rem] font-serif leading-[1.01] tracking-[-0.055em] text-white md:text-[3.2rem]">
                {summaryTitle}
              </h3>
              <p className="mt-5 max-w-[38rem] text-[1.03rem] leading-8 text-white/84">{summaryBody}</p>
              <p className="mt-6 max-w-[34rem] text-[11px] uppercase tracking-[0.22em] text-white/66">
                {isZh
                  ? '这份终稿首先关心关系修辞、文化分寸与最后的送达方式。'
                  : 'This dossier is guided first by relational language, cultural tact, and the final mode of arrival.'}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-10 px-6 py-8 sm:px-8 xl:px-10 xl:py-10">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {conclusionCards.map(card => (
              <article key={card.label} className="rounded-[2rem] border border-black/6 bg-white/76 p-5 shadow-[0_24px_56px_-44px_rgba(15,23,42,0.16)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{card.label}</p>
                <p className="mt-3 text-[1.4rem] font-serif leading-tight text-[#1d1a17]">{card.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <article className="rounded-[2.4rem] border border-black/6 bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '语境纪要' : 'Context memorandum'}</p>
              <p className="mt-4 text-[1.72rem] font-serif leading-tight text-[#1c1a17]">
                {isZh
                  ? '这份判断建立在怎样的关系、场景与对象线索之上。'
                  : 'The relationship, scene, and object cues that support this reading.'}
              </p>
              <p className="mt-4 text-sm leading-8 text-[#69707d]">
                {contextParagraph ||
                  (isZh
                    ? '这一次没有补充更多背景，因此系统将主要依据礼物本身与基础关系语境做出判断。'
                    : 'No further background was provided, so the reading leans mainly on the object itself and the basic relationship context.')}
              </p>
              {semanticLines.length > 0 && (
                <div className="mt-5 border-t border-black/7 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '语义线索' : 'Semantic signals'}</p>
                  <p className="mt-2 text-sm leading-7 text-[#5f6672]">{semanticLines.join(' · ')}</p>
                </div>
              )}
            </article>

            <article className="overflow-hidden rounded-[2.4rem] border border-black/6 bg-white/72 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
              <div
                className="min-h-[15rem] border-b border-black/6 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(18,15,13,0.24)),url(${reportPhotography.note})`,
                }}
              />
              <div className="p-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '改写方向' : 'Edited direction'}</p>
                <p className="mt-4 text-[1.78rem] font-serif leading-tight text-[#1c1a17]">{openingRecommendation}</p>
                <p className="mt-4 text-sm leading-8 text-[#69707d]">{openingRecommendationReason}</p>
              </div>
            </article>
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            <article className="rounded-[2.4rem] border border-black/6 bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '为什么是这个结论' : 'Why this conclusion'}</p>
              <div className="mt-5 space-y-4">
                {memoLines.map(line => (
                  <p key={line} className="border-t border-black/8 pt-4 text-sm leading-8 text-[#69707d] first:border-t-0 first:pt-0">
                    {line}
                  </p>
                ))}
              </div>

              {analysis.matchedRules.length > 0 && (
                <div className="mt-6 border-t border-black/7 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '规则触点' : 'Matched rules'}</p>
                  <div className="mt-3 space-y-3">
                    {analysis.matchedRules.slice(0, 3).map(rule => (
                      <div key={rule.id} className="text-sm leading-7 text-[#5f6672]">
                        <span className="font-medium text-[#1d1a17]">{rule.ruleType}</span> · {rule.suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <article className="rounded-[2.4rem] border border-black/6 bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '如何改写它' : 'How to rewrite it'}</p>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '包装方向' : 'Packaging direction'}</p>
                  <p className="mt-2 text-sm leading-8 text-[#69707d]">
                    {topRecommendation ? (isZh ? topRecommendation.packagingTipZh : topRecommendation.packagingTipEn) : analysis.packaging.colors.join(', ')}
                  </p>
                </div>
                <div className="border-t border-black/8 pt-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '送达提醒' : 'Delivery note'}</p>
                  <p className="mt-2 text-sm leading-8 text-[#69707d]">
                    {topRecommendation ? (isZh ? topRecommendation.shippingNoteZh : topRecommendation.shippingNoteEn) : summaryBody}
                  </p>
                </div>
                <div className="border-t border-black/8 pt-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '卡片语气' : 'Card tone'}</p>
                  <p className="mt-2 text-sm leading-8 text-[#69707d]">
                    {analysis.greetingCard.opener} {analysis.greetingCard.body} {analysis.greetingCard.closing}
                  </p>
                </div>
              </div>
            </article>
          </section>

          <section className="overflow-hidden rounded-[2.4rem] border border-black/6 bg-white/72 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div
                className="min-h-[16rem] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(18,15,13,0.28)),url(${reportPhotography.arrival})`,
                }}
              />
              <div className="p-6 sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '必须送出时' : 'If it must be sent'}</p>
                <p className="mt-4 max-w-[30rem] text-[1.72rem] font-serif leading-tight text-[#1c1a17]">
                  {isZh ? '如果无法更换礼物，至少要把送达方式和表达方式一起改写。' : 'If the object cannot be changed, rewrite the delivery and the wording together.'}
                </p>
                <div className="mt-5 space-y-4">
                  {adviceLines.map(line => (
                    <p key={line} className="border-t border-black/8 pt-4 text-sm leading-8 text-[#69707d] first:border-t-0 first:pt-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2.4rem] border border-black/6 bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
            <h3 className="text-[2.1rem] font-serif leading-[1.03] tracking-[-0.04em] text-[#1c1a17]">
              {isZh ? '如果要把这份心意改写得更克制、更高级、更妥帖。' : 'If the gesture were to be rewritten with greater restraint, tact, and elegance.'}
            </h3>
            <p className="mt-4 max-w-[34rem] text-sm leading-8 text-[#69707d]">
              {isZh
                ? '下面这些方向不是简单的商品候选，而是更适合被写进这段关系的送达方式。'
                : 'These are not merely alternate products, but more authored ways for the gesture to belong to the relationship.'}
            </p>

            <div className="mt-7 grid gap-5 xl:grid-cols-2">
              {analysis.recommendations.map((item, index) => {
                const saved = favoriteRecommendationIds.includes(item.id)
                return (
                  <article key={item.id} className="rounded-[2rem] border border-black/6 bg-white/78 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
                          0{index + 1} · {item.category}
                        </p>
                        <h4 className="mt-3 text-[1.5rem] font-serif leading-tight text-[#1c1a17]">{isZh ? item.nameZh : item.nameEn}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleFavoriteRecommendation(item.id)}
                        className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition ${
                          saved ? 'border-[#6c78ab]/16 bg-[#eef1fb] text-[#5b67aa]' : 'border-black/8 bg-white/70 text-[#5f6672] hover:bg-white'
                        }`}
                      >
                        {saved ? (isZh ? '已归档' : 'Archived') : isZh ? '归档' : 'Archive'}
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-8 text-[#69707d]">{isZh ? item.reasonZh : item.reasonEn}</p>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? item.pitchZh : item.pitchEn}</p>
                  </article>
                )
              })}
            </div>
          </section>

          {(hasAnalysisEnhancementResults || additionalLayers.length > 0) && (
            <section className="rounded-[2.4rem] border border-black/6 bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '附加图层' : 'Additional layers'}</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {additionalLayers.map(layer => (
                  <article key={layer.title} className="rounded-[1.8rem] border border-black/6 bg-white/78 p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{layer.title}</p>
                    <p className="mt-3 text-sm leading-8 text-[#69707d]">{layer.body}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.section>
  )
}
