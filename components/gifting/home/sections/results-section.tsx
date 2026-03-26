'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, ShieldCheck, Sparkles, Star } from 'lucide-react'
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
        : 'The overall gesture holds its balance well.'
      : analysis.riskLevel === 'Medium'
        ? isZh
          ? '这份心意还需要再润一润。'
          : 'Refine the gesture before sending'
        : isZh
          ? '这份心意此刻不宜直接送出。'
          : 'This gesture should not be sent as it stands.'

  const summaryBody =
    analysis.warning ||
    (analysis.riskLevel === 'Low'
      ? isZh
        ? '这份礼物的整体方向相对稳定，接下来更值得处理的是包装、表达语气，以及它最终被接住的方式。'
        : 'The broader direction is stable. What remains is refining the packaging, the tone of expression, and the way the gesture will finally be received.'
      : isZh
        ? '更适合的做法，是优先参考替代方向，并把包装与表达方式一起重新整理。'
        : 'A better route is to start with the alternative directions and reconsider packaging and wording together.')

  const resultPhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519741491041-6750297b4d0d?auto=format&fit=crop&w=1200&q=80',
  ]

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[48rem]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'The ending' : 'The ending'}</p>
          <h2 className="mt-3 text-[3.2rem] font-serif leading-[1.02] tracking-[-0.05em] text-[#1c1a17]">
            {isZh ? '故事走到这里，会留下一个更稳妥的送达方式。' : 'This is where the story settles into a more tactful way to arrive.'}
          </h2>
          <p className="mt-4 text-base leading-8 text-[#69707d]">
            {countryLabel} · {selectedAudienceLabel} · {sceneLabel}
          </p>
        </div>

        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/72 px-5 py-3 text-[#495161] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.16)] transition hover:bg-white"
        >
          <RotateCcw size={16} />
          {isZh ? '重新开启一段判断' : 'Start a new reading'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="rounded-[2.5rem] border border-[#e5dbcf] bg-[linear-gradient(155deg,#fffdf8,#fff4e4)] p-7 shadow-[0_32px_70px_-42px_rgba(184,129,45,0.28)]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#8b6b2d]">
              {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI 与文化规则共读' : 'AI with cultural rules') : isZh ? '本地判断回退' : 'Local fallback reading'}
            </span>
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#8b6b2d]">
              {isZh ? `契合度 ${analysis.fitScore}` : `Fit ${analysis.fitScore}`}
            </span>
          </div>

          <h3 className="mt-6 text-[2.6rem] font-serif leading-[1.05] tracking-[-0.04em] text-[#1c1a17]">{summaryTitle}</h3>
          <p className="mt-4 max-w-[44rem] text-base leading-8 text-[#5d6472]">{summaryBody}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { label: isZh ? '此刻的判断' : 'Current reading', value: analysis.riskLevel },
              { label: isZh ? '外在呈现' : 'Outer presentation', value: analysis.packaging.style },
              { label: isZh ? '表达语气' : 'Message tone', value: analysis.greetingCard.tone },
            ].map(item => (
              <div key={item.label} className="rounded-[1.6rem] border border-black/6 bg-white/74 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#1c1a17]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[0.92fr_1.08fr] gap-4">
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/90 shadow-[0_22px_48px_-30px_rgba(15,23,42,0.22)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.1),rgba(22,20,18,0.42)),url(${resultPhotos[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex min-h-[15rem] items-end p-5">
                <div className="rounded-full border border-white/28 bg-white/14 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/84 backdrop-blur-md">
                  {isZh ? 'After the reading' : 'After the reading'}
                </div>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-[2rem] border border-white/90 shadow-[0_22px_48px_-30px_rgba(15,23,42,0.22)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.14),rgba(22,20,18,0.34)),url(${resultPhotos[1]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex min-h-[15rem] flex-col justify-end p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/72">{isZh ? 'How it lands' : 'How it lands'}</p>
                <p className="mt-2 text-[1.2rem] font-serif leading-tight text-white">
                  {isZh ? '礼物最后落下来的，从来不只是物件，而是情绪、关系与被理解的方式。' : 'What lands in the end is never the object alone, but feeling, relationship, and the way the gesture is understood.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.1rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.16)]">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#eef6ef] p-2 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'A gentler direction' : 'A gentler direction'}</p>
                <p className="mt-2 text-[1.4rem] font-serif leading-tight text-[#1c1a17]">
                  {topRecommendation
                    ? isZh
                      ? topRecommendation.nameZh
                      : topRecommendation.nameEn
                    : analysis.rescueItem || (isZh ? '继续细化当前礼物' : 'Refine the current gift further')}
                </p>
                <p className="mt-3 text-sm leading-8 text-[#69707d]">
                  {topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.1rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.16)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'The context behind it' : 'The context behind it'}</p>
            <p className="mt-3 text-sm leading-8 text-[#69707d]">
              {contextParagraph || (isZh ? '这一次还没有补充更多背景，因此结论将主要依据礼物本身与基础关系语境展开。' : 'No further background was provided, so this reading leans mainly on the object itself and the basic relationship context.')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
        <div className="rounded-[2.3rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#eef6ef] p-2 text-emerald-600">
              <Star size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Possible rewrites' : 'Possible rewrites'}</p>
              <h3 className="mt-1 text-[2rem] font-serif text-[#1c1a17]">{isZh ? '如果要把故事改写得更好' : 'If the story needs a better rewrite'}</h3>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {analysis.recommendations.map(item => {
              const saved = favoriteRecommendationIds.includes(item.id)
              return (
                <article key={item.id} className="rounded-[1.85rem] border border-black/6 bg-[linear-gradient(180deg,#fcfaf7,#fff)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#9b6b20]">{item.category}</p>
                      <h4 className="mt-2 text-[1.35rem] font-serif leading-tight text-[#1c1a17]">{isZh ? item.nameZh : item.nameEn}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleFavoriteRecommendation(item.id)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${
                        saved ? 'border-[#d2b378] bg-[#fff4de] text-[#8b6b2d]' : 'border-black/8 bg-white text-[#667085]'
                      }`}
                    >
                      {saved ? (isZh ? '已留下' : 'Saved') : isZh ? '留下' : 'Save'}
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-8 text-[#69707d]">{isZh ? item.reasonZh : item.reasonEn}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.2rem] bg-white px-4 py-4 text-sm leading-7 text-[#5d6472]">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '外在呈现' : 'Outer presentation'}</span>
                      <span className="mt-2 block">{isZh ? item.packagingTipZh : item.packagingTipEn}</span>
                    </div>
                    <div className="rounded-[1.2rem] bg-white px-4 py-4 text-sm leading-7 text-[#5d6472]">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '送达提醒' : 'Delivery note'}</span>
                      <span className="mt-2 block">{isZh ? item.shippingNoteZh : item.shippingNoteEn}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.2rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#fdf0ec] p-2 text-rose-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Points to watch' : 'Points to watch'}</p>
                <h3 className="mt-1 text-[1.8rem] font-serif text-[#1c1a17]">{isZh ? '哪里可能失准' : 'Where it may lose balance'}</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {riskReasons.length > 0 ? (
                riskReasons.map(reason => (
                  <div key={reason} className="rounded-[1.25rem] bg-[#fff7f5] px-4 py-4 text-sm leading-7 text-[#7a5b56]">
                    {reason}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] bg-[#f5faf6] px-4 py-4 text-sm leading-7 text-[#4d6a57]">
                  {isZh ? '暂时未见明显文化风险，但包装与表达细节依然会改变这份礼物最终被如何接住。' : 'No major cultural risk appears immediately, though packaging and wording can still change how the gesture is ultimately received.'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#eef2ff] p-2 text-[#566fd1]">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'If it must still be sent' : 'If it must still be sent'}</p>
                <h3 className="mt-1 text-[1.8rem] font-serif text-[#1c1a17]">{isZh ? '如果仍要送出' : 'If it still has to go'}</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {mustSendAdvice.length > 0 ? (
                mustSendAdvice.map(item => (
                  <div key={item} className="rounded-[1.25rem] bg-[#f8f6f2] px-4 py-4 text-sm leading-7 text-[#5d6472]">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] bg-[#f8f6f2] px-4 py-4 text-sm leading-7 text-[#5d6472]">
                  {isZh ? '当前没有额外的补救建议，但依旧建议把表达语气与包装方式一起收紧。' : 'No additional mitigation is required for now, though the wording and packaging should still be handled with care.'}
                </div>
              )}
            </div>
          </div>

          {hasAnalysisEnhancementResults && analysisEnhancements && (
            <div className="rounded-[2.2rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Deeper reading' : 'Deeper reading'}</p>
              <p className="mt-3 text-sm leading-7 text-[#69707d]">
                {isZh ? '这份结论还结合了更深层的识别、重排或物流估算模块。' : 'This reading also drew on deeper recognition, reranking, or logistics estimation modules.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
