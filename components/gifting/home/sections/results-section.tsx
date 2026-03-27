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
  onReset,
  onToggleFavoriteRecommendation,
}: ResultsSectionProps) {
  const isZh = locale === 'zh'
  const topRecommendation = analysis.recommendations[0]
  const countryLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选择国家' : 'No country'
  const contextParagraph = [visionDescription.trim() || giftDescription.trim(), targetProfile.trim()].filter(Boolean).join(' ')

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
        ? '真正还需要拿捏的，是包装的语气、语言的温度，以及它会以怎样的方式落到对方手里。'
        : 'What still matters most is the tone of packaging, the warmth of wording, and the way the gesture finally arrives in the other person’s hands.'
      : isZh
        ? '更合适的做法，是先重新整理表达方式，再考虑替代方向，让这份心意的重心重新回到人与文化之间。'
        : 'A better route is to revise the expression first, then consider alternatives, so the centre of the gesture can return to people and culture.')

  const resultPhotos = {
    lead: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80',
    portrait: 'https://images.unsplash.com/photo-1519741491041-6750297b4d0d?auto=format&fit=crop&w=1200&q=80',
    detail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
  }

  const memoLines = riskReasons.length > 0 ? riskReasons : [
    isZh
      ? '暂时未见明显文化风险，但包装与表达细节依然会改变对方最终如何理解这份好意。'
      : 'No major cultural risk appears immediately, though packaging and wording still shape how the gesture will finally be understood.',
  ]

  const adviceLines = mustSendAdvice.length > 0 ? mustSendAdvice : [
    isZh
      ? '当前没有额外补救建议，但依旧建议同步收紧表达语气与包装细节。'
      : 'No additional mitigation is required for now, though the wording and packaging should still be refined together.',
  ]

  const openingRecommendation =
    topRecommendation
      ? isZh
        ? topRecommendation.nameZh
        : topRecommendation.nameEn
      : analysis.rescueItem || (isZh ? '继续细化当前礼物' : 'Refine the current gift further')

  const openingRecommendationReason =
    topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 min-h-0 flex-col gap-5 overflow-hidden"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[58rem]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9aa3b2]">Editorial dossier</p>
          <h2 className="mt-3 text-[3rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17] md:text-[3.4rem]">
            {isZh
              ? '这里呈现的，不是判断面板，而是一份关于这份心意该如何被重新写作的终稿。'
              : 'What appears here is not a judgment panel, but a final authored dossier on how the gesture should be rewritten.'}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#69707d]">
            {countryLabel} · {selectedAudienceLabel} · {sceneLabel}
          </p>
          <p className="mt-4 max-w-[38rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
            {isZh
              ? '终稿版 · 从关系修辞、文化分寸到最后送达方式，统一写进同一页。'
              : 'Final draft · Relationship rhetoric, cultural tact, and final delivery are composed onto one page.'}
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

      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-0 flex-1 overflow-hidden rounded-[3rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,243,237,0.96))] shadow-[0_40px_90px_-56px_rgba(15,23,42,0.16)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_100%_0%,rgba(218,205,194,0.16),transparent_22%),linear-gradient(180deg,transparent,rgba(117,98,82,0.04))]" />

        <div className="relative grid h-full min-h-0 xl:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)]">
          <div className="grid min-h-0 border-b border-black/6 xl:border-b-0 xl:border-r xl:grid-rows-[minmax(0,1.05fr)_auto]">
            <div className="grid min-h-0 lg:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)]">
              <div className="flex min-h-0 flex-col justify-between p-7 lg:p-8 xl:p-9">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-black/6 bg-white/84 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#6f7480]">
                      {analysisSource === 'hybrid-ai-rules' ? (isZh ? '文化线索共读' : 'Cultural reading') : isZh ? '在地文化判断' : 'Local cultural reading'}
                    </span>
                    <span className="rounded-full border border-black/6 bg-white/84 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#6f7480]">
                      {isZh ? `契合度 ${analysis.fitScore}` : `Fit ${analysis.fitScore}`}
                    </span>
                  </div>

                  <h3 className="mt-6 max-w-[42rem] text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1c1a17] md:text-[3.15rem]">
                    {summaryTitle}
                  </h3>
                  <p className="mt-5 max-w-[38rem] text-[1.03rem] leading-8 text-[#5e6571]">{summaryBody}</p>
                  <p className="mt-6 max-w-[34rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                    {isZh
                      ? '这份终稿首先关心关系修辞、文化分寸与送达语气。'
                      : 'This final reading is guided first by relational language, cultural tact, and delivery tone.'}
                  </p>
                </div>

                <div className="mt-8 grid gap-5 border-t border-black/7 pt-5 sm:grid-cols-3">
                  {[
                    { label: isZh ? '当前结论' : 'Current conclusion', value: analysis.riskLevel },
                    { label: isZh ? '包装方向' : 'Packaging direction', value: analysis.packaging.style },
                    { label: isZh ? '表达语气' : 'Message tone', value: analysis.greetingCard.tone },
                  ].map(item => (
                    <div key={item.label} className="space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{item.label}</p>
                      <p className="text-[1.05rem] font-medium text-[#1c1a17]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid min-h-[24rem] grid-rows-[1.28fr_0.92fr] gap-3 border-t border-black/6 p-3 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-4 xl:p-5">
                <div
                  className="relative overflow-hidden rounded-[2.4rem]"
                  style={{
                    backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.06),rgba(18,16,15,0.54)),url(${resultPhotos.lead})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.28),transparent_30%)] mix-blend-screen" />
                  <div className="relative flex h-full items-end p-5 xl:p-6">
                    <div className="max-w-[18rem]">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">Human trace</p>
                      <p className="mt-2 text-[1.32rem] font-serif leading-tight text-white">
                        {isZh
                          ? '礼物最终留下来的，不是物本身，而是它被怎样理解、怎样抵达。'
                          : 'What stays is rarely the object alone, but how it is understood and how it arrives.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                  <div
                    className="relative overflow-hidden rounded-[2rem]"
                    style={{
                      backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.1),rgba(22,18,18,0.3)),url(${resultPhotos.portrait})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div
                    className="relative overflow-hidden rounded-[2rem]"
                    style={{
                      backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.08),rgba(26,21,19,0.42)),url(${resultPhotos.detail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="relative flex h-full items-end p-4">
                      <div className="max-w-[16rem] rounded-[1.5rem] border border-white/16 bg-white/12 px-4 py-4 backdrop-blur-md">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">{isZh ? 'Edited direction' : 'Edited direction'}</p>
                        <p className="mt-2 text-[1.1rem] font-serif leading-tight text-white">{openingRecommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid border-t border-black/6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="p-7 lg:border-r lg:p-8 xl:p-9">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '语境纪要' : 'Context memorandum'}</p>
                <p className="mt-4 text-[1.62rem] font-serif leading-tight text-[#1c1a17]">
                  {isZh
                    ? '支撑这次终稿的背景，需要被完整写进阅读现场。'
                    : 'The background supporting this reading deserves to remain visible inside the final dossier.'}
                </p>
                <p className="mt-4 text-sm leading-8 text-[#69707d]">
                  {contextParagraph ||
                    (isZh
                      ? '这一次没有补充更多背景，因此系统将主要依据礼物本身与基本关系语境做出判断。'
                      : 'No further background was provided, so the reading leans mainly on the object itself and the basic relationship context.')}
                </p>
              </div>

              <div className="p-7 lg:p-8 xl:p-9">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '改写提案' : 'Edited proposal'}</p>
                <p className="mt-4 text-[1.78rem] font-serif leading-tight text-[#1c1a17]">{openingRecommendation}</p>
                <p className="mt-4 text-sm leading-8 text-[#69707d]">{openingRecommendationReason}</p>
                <div className="mt-5 grid gap-4 border-t border-black/7 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '包装呈现' : 'Packaging direction'}</p>
                    <p className="mt-2 text-sm leading-7 text-[#5f6672]">
                      {topRecommendation ? (isZh ? topRecommendation.packagingTipZh : topRecommendation.packagingTipEn) : analysis.packaging.colors.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '送达提醒' : 'Delivery note'}</p>
                    <p className="mt-2 text-sm leading-7 text-[#5f6672]">
                      {topRecommendation ? (isZh ? topRecommendation.shippingNoteZh : topRecommendation.shippingNoteEn) : summaryBody}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto]">
            <div className="min-h-0 overflow-auto p-7 xl:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '改写方向' : 'Edited directions'}</p>
              <h3 className="mt-3 text-[2.15rem] font-serif leading-[1.03] tracking-[-0.04em] text-[#1c1a17]">
                {isZh ? '如果要把这份心意改写得更克制、更高级、更妥帖。' : 'If the gesture were to be rewritten with greater restraint, tact, and elegance.'}
              </h3>
              <p className="mt-4 max-w-[24rem] text-sm leading-8 text-[#69707d]">
                {isZh
                  ? '下面这些方向不是备选商品列表，而是几种更适合被写进这段关系的送达方式。'
                  : 'These are not merely alternate products, but authored ways for the gesture to belong more gracefully to the relationship.'}
              </p>

              <div className="mt-7 space-y-6">
                {analysis.recommendations.map((item, index) => {
                  const saved = favoriteRecommendationIds.includes(item.id)
                  return (
                    <article key={item.id} className="border-t border-black/8 pt-5 first:border-t-0 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
                            0{index + 1} · {item.category}
                          </p>
                          <h4 className="mt-2 text-[1.45rem] font-serif leading-tight text-[#1c1a17]">{isZh ? item.nameZh : item.nameEn}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleFavoriteRecommendation(item.id)}
                          className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition duration-500 hover:-translate-y-0.5 ${
                            saved ? 'border-[#6c78ab]/16 bg-[#eef1fb] text-[#5b67aa]' : 'border-black/8 bg-white/70 text-[#5f6672] hover:bg-white'
                          }`}
                        >
                          {saved ? (isZh ? '已归档' : 'Archived') : isZh ? '归档' : 'Archive'}
                        </button>
                      </div>

                      <p className="mt-4 text-sm leading-8 text-[#69707d]">{isZh ? item.reasonZh : item.reasonEn}</p>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
                        {isZh ? item.pitchZh : item.pitchEn}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>

            <div className="grid border-t border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.14))] lg:grid-cols-2">
              <div className="p-6 xl:p-7 lg:border-r border-black/6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '文化边注' : 'Cultural margins'}</p>
                <div className="mt-4 space-y-3">
                  {memoLines.map(line => (
                    <p key={line} className="border-t border-black/8 pt-3 text-sm leading-7 text-[#6c625d] first:border-t-0 first:pt-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-6 xl:p-7">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '终稿边注' : 'Final editorial notes'}</p>
                <div className="mt-4 space-y-3">
                  {adviceLines.map(line => (
                    <p key={line} className="border-t border-black/8 pt-3 text-sm leading-7 text-[#5f6672] first:border-t-0 first:pt-0">
                      {line}
                    </p>
                  ))}
                </div>

                {hasAnalysisEnhancementResults && analysisEnhancements && (
                  <div className="mt-5 border-t border-black/8 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '附加图层' : 'Additional layers'}</p>
                    <p className="mt-2 text-sm leading-7 text-[#69707d]">
                      {isZh
                        ? '这份终稿还吸收了更深层的识别、重排或物流估算结果。'
                        : 'This dossier also drew on deeper recognition, reranking, or logistics estimation layers.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </motion.article>
    </motion.section>
  )
}
