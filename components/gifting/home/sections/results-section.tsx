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
    detail: 'https://images.unsplash.com/photo-1519741491041-6750297b4d0d?auto=format&fit=crop&w=1200&q=80',
  }

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col gap-6 overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[56rem]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Editorial report</p>
          <h2 className="mt-3 text-[3rem] font-serif leading-[1.02] tracking-[-0.05em] text-[#1c1a17] md:text-[3.35rem]">
            {isZh ? '这里呈现的是一份关于心意如何被理解、修订与送达的编辑稿。' : 'What you see here is an editorial dossier on how the gesture is understood, revised, and delivered.'}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#69707d]">
            {countryLabel} · {selectedAudienceLabel} · {sceneLabel}
          </p>
          <p className="mt-4 max-w-[34rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
            {isZh ? '终稿版 · 用于判断一份心意是否能在另一种文化中被妥帖接住。' : 'Final draft · For judging whether a gesture can be received with tact in another culture.'}
          </p>
        </div>

        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/76 px-5 py-3 text-[#495161] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_40px_-24px_rgba(15,23,42,0.2)]"
        >
          <RotateCcw size={16} />
          {isZh ? '重新开启新的礼赠叙事' : 'Begin a new editorial story'}
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
        <div className="grid min-h-0 gap-6 grid-rows-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
          <article className="grid min-h-0 overflow-hidden rounded-[2.9rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,242,236,0.92))] shadow-[0_30px_72px_-46px_rgba(15,23,42,0.16)] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="flex min-h-0 flex-col justify-between p-7 lg:p-8">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-black/6 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#6f7480]">
                    {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI 与文化规则共读' : 'AI with cultural rules') : isZh ? '本地判断回退' : 'Local fallback reading'}
                  </span>
                  <span className="rounded-full border border-black/6 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#6f7480]">
                    {isZh ? `契合度 ${analysis.fitScore}` : `Fit ${analysis.fitScore}`}
                  </span>
                </div>
                <h3 className="mt-6 text-[2.6rem] font-serif leading-[1.03] tracking-[-0.05em] text-[#1c1a17]">{summaryTitle}</h3>
                <p className="mt-4 max-w-[39rem] text-base leading-8 text-[#5f6672]">{summaryBody}</p>
                <p className="mt-5 max-w-[34rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '它首先是一份关系修辞与文化分寸的编辑判断。' : 'It is first an editorial judgment on relational language and cultural tact.'}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: isZh ? '此刻的判断' : 'Current reading', value: analysis.riskLevel },
                  { label: isZh ? '包装方向' : 'Packaging direction', value: analysis.packaging.style },
                  { label: isZh ? '表达语气' : 'Message tone', value: analysis.greetingCard.tone },
                ].map(item => (
                  <div key={item.label} className="border-t border-black/8 pt-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{item.label}</p>
                    <p className="mt-2 text-lg font-medium text-[#1c1a17]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid min-h-[18rem] gap-4 p-4 lg:grid-rows-[1fr_0.94fr] lg:p-5">
              <div
                className="relative overflow-hidden rounded-[2.1rem]"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.08),rgba(21,19,18,0.48)),url(${resultPhotos.lead})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.24),transparent_28%)] mix-blend-screen" />
                <div className="relative flex h-full items-end p-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/72">{isZh ? 'Human trace' : 'Human trace'}</p>
                    <p className="mt-2 max-w-[18rem] text-[1.2rem] font-serif leading-tight text-white">
                      {isZh ? '礼物最后落到对方心里的，往往是它被理解的方式。' : 'What often stays in the other person’s heart is the way the gesture is understood.'}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-[2.1rem]"
                style={{
                  backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.08),rgba(21,19,18,0.38)),url(${resultPhotos.detail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative flex h-full items-end p-5">
                  <div className="max-w-[18rem] rounded-[1.6rem] border border-white/18 bg-white/12 px-4 py-4 backdrop-blur-md">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/72">{isZh ? 'Edited direction' : 'Edited direction'}</p>
                    <p className="mt-2 text-[1.2rem] font-serif leading-tight text-white">
                      {topRecommendation
                        ? isZh
                          ? topRecommendation.nameZh
                          : topRecommendation.nameEn
                        : analysis.rescueItem || (isZh ? '继续细化当前礼物' : 'Refine the current gift further')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="grid min-h-0 overflow-hidden rounded-[2.9rem] border border-black/6 bg-white/86 shadow-[0_28px_64px_-44px_rgba(15,23,42,0.12)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            <div className="border-b border-black/6 p-7 lg:border-b-0 lg:border-r lg:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Context memorandum' : 'Context memorandum'}</p>
              <p className="mt-4 text-[1.55rem] font-serif leading-tight text-[#1c1a17]">
                {isZh ? '这次判断所依赖的背景，不该被藏在技术字段里。' : 'The background behind this reading should not be hidden in technical fields.'}
              </p>
              <p className="mt-4 text-sm leading-8 text-[#69707d]">
                {contextParagraph || (isZh ? '这一次没有补充更多背景，因此系统将主要依据礼物本身与基本关系语境做出判断。' : 'No further background was provided, so the reading leans mainly on the object itself and the basic relationship context.')}
              </p>
            </div>

            <div className="p-7 lg:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Edited proposal' : 'Edited proposal'}</p>
              <p className="mt-4 text-[1.7rem] font-serif leading-tight text-[#1c1a17]">
                {topRecommendation
                  ? isZh
                    ? topRecommendation.nameZh
                    : topRecommendation.nameEn
                  : analysis.rescueItem || (isZh ? '继续细化当前礼物' : 'Refine the current gift further')}
              </p>
              <p className="mt-4 text-sm leading-8 text-[#69707d]">
                {topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason}
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                {isZh ? '这里提供的是更适合这段关系与文化语境的改写方向。' : 'This offers a rewritten direction that better fits the relationship and cultural context.'}
              </p>
            </div>
          </article>
        </div>

        <div className="grid min-h-0 gap-6 grid-rows-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <article className="min-h-0 overflow-auto rounded-[2.9rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,245,240,0.92))] p-7 shadow-[0_28px_64px_-44px_rgba(15,23,42,0.12)] lg:p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Editorial alternatives' : 'Editorial alternatives'}</p>
            <h3 className="mt-3 text-[2rem] font-serif leading-tight text-[#1c1a17]">
              {isZh ? '如果要把这份心意改写得更克制、更高级、更妥帖。' : 'If the gesture were to be rewritten with greater restraint, tact, and elegance.'}
            </h3>
            <p className="mt-4 max-w-[34rem] text-sm leading-8 text-[#69707d]">
              {isZh ? '下面这些送达方案，会让这份心意更适合写进这段关系。' : 'The delivery directions below help the gesture fit more gracefully into this relationship.'}
            </p>

            <div className="mt-6 space-y-5">
              {analysis.recommendations.map((item, index) => {
                const saved = favoriteRecommendationIds.includes(item.id)
                return (
                  <article key={item.id} className="border-t border-black/8 pt-5 first:border-t-0 first:pt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">0{index + 1} · {item.category}</p>
                        <h4 className="mt-2 text-[1.4rem] font-serif leading-tight text-[#1c1a17]">{isZh ? item.nameZh : item.nameEn}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleFavoriteRecommendation(item.id)}
                        className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition duration-500 hover:-translate-y-0.5 ${
                          saved ? 'border-[#6c78ab]/18 bg-[#eef2ff] text-[#5b67aa]' : 'border-black/8 bg-white/84 text-[#5f6672] hover:bg-white'
                        }`}
                      >
                        {saved ? (isZh ? '已归档' : 'Archived') : isZh ? '归档' : 'Archive'}
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-8 text-[#69707d]">{isZh ? item.reasonZh : item.reasonEn}</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="border-t border-black/8 pt-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '包装呈现' : 'Packaging direction'}</p>
                        <p className="mt-2 text-sm leading-7 text-[#5f6672]">{isZh ? item.packagingTipZh : item.packagingTipEn}</p>
                      </div>
                      <div className="border-t border-black/8 pt-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '送达提醒' : 'Delivery note'}</p>
                        <p className="mt-2 text-sm leading-7 text-[#5f6672]">{isZh ? item.shippingNoteZh : item.shippingNoteEn}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </article>

          <div className="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <article className="min-h-0 overflow-auto rounded-[2.5rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Cultural margins' : 'Cultural margins'}</p>
              <div className="mt-4 space-y-3">
                {riskReasons.length > 0 ? (
                  riskReasons.map(reason => (
                    <p key={reason} className="border-t border-black/8 pt-3 text-sm leading-7 text-[#6d625e] first:border-t-0 first:pt-0">
                      {reason}
                    </p>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-[#5f6672]">
                    {isZh ? '暂时未见明显文化风险，但包装与表达细节依然会改变对方最终如何理解这份好意。' : 'No major cultural risk appears immediately, though packaging and wording still shape how the gesture will finally be understood.'}
                  </p>
                )}
              </div>
            </article>

            <article className="min-h-0 overflow-auto rounded-[2.5rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Final editorial notes' : 'Final editorial notes'}</p>
              <div className="mt-4 space-y-3">
                {mustSendAdvice.length > 0 ? (
                  mustSendAdvice.map(item => (
                    <p key={item} className="border-t border-black/8 pt-3 text-sm leading-7 text-[#5f6672] first:border-t-0 first:pt-0">
                      {item}
                    </p>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-[#5f6672]">
                    {isZh ? '当前没有额外补救建议，但依旧建议同步收紧表达语气与包装细节。' : 'No additional mitigation is required for now, though the wording and packaging should still be refined together.'}
                  </p>
                )}
              </div>

              {hasAnalysisEnhancementResults && analysisEnhancements && (
                <div className="mt-5 border-t border-black/8 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Additional layers' : 'Additional layers'}</p>
                  <p className="mt-2 text-sm leading-7 text-[#69707d]">
                    {isZh ? '这份结论还结合了更深层的识别、重排或物流估算模块。' : 'This reading also drew on deeper recognition, reranking, or logistics estimation modules.'}
                  </p>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
