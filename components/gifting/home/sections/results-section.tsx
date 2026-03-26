'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton } from '@/components/gifting/home/home-design-tokens'
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
  const summaryTitle =
    analysis.riskLevel === 'Low'
      ? isZh
        ? '整体适合赠送'
        : 'Broadly suitable to give'
      : analysis.riskLevel === 'Medium'
        ? isZh
          ? '建议调整后再赠送'
          : 'Refine before gifting'
        : isZh
          ? '不建议直接赠送当前方案'
          : 'Do not send the current gift as-is'

  const summaryBody =
    analysis.warning ||
    (analysis.riskLevel === 'Low'
      ? isZh
        ? '当前礼物整体方向稳定，重点优化包装、表达和送达方式。'
        : 'The overall direction is stable. Focus on packaging, wording, and delivery details.'
      : isZh
        ? '建议优先参考替代推荐，并结合包装与表达方式一起调整。'
        : 'Prefer the alternative recommendations and adjust packaging and wording together.')

  const contextParagraph = [visionDescription.trim() || giftDescription.trim(), targetProfile.trim()].filter(Boolean).join(' ')

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
            {isZh ? 'Analysis result' : 'Analysis result'}
          </p>
          <h2 className="mt-2 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
            {isZh ? '一份可执行的礼赠编辑稿。' : 'An editorial gifting brief you can actually use.'}
          </h2>
          <p className="mt-3 text-base leading-8 text-[#667085]">
            {countryLabel} · {selectedAudienceLabel} · {sceneLabel}
          </p>
        </div>
        <Button onClick={onReset} className={`${homeButton.secondary} px-5 py-3`}>
          <RotateCcw size={16} />
          {isZh ? '重新开始' : 'Start over'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="rounded-[2.2rem] border border-[#e6ddd1] bg-[linear-gradient(160deg,#fffdf9,#fff4e6)] p-7 shadow-[0_30px_70px_-44px_rgba(184,129,45,0.28)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-3 py-1 text-xs text-[#8b6b2d]">
              {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI + 规则引擎' : 'AI + Rules') : isZh ? '本地规则回退' : 'Local fallback'}
            </span>
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-3 py-1 text-xs text-[#8b6b2d]">
              {isZh ? `文化契合度 ${analysis.fitScore}` : `Fit score ${analysis.fitScore}`}
            </span>
          </div>

          <h3 className="mt-5 text-[2.4rem] font-serif leading-[1.08] tracking-[-0.03em] text-[#1c1a17]">{summaryTitle}</h3>
          <p className="mt-4 max-w-[48rem] text-base leading-8 text-[#5d6472]">{summaryBody}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.45rem] border border-black/6 bg-white/74 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '风险等级' : 'Risk level'}</p>
              <p className="mt-2 text-lg font-semibold text-[#1c1a17]">{analysis.riskLevel}</p>
            </div>
            <div className="rounded-[1.45rem] border border-black/6 bg-white/74 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '包装方向' : 'Packaging'}</p>
              <p className="mt-2 text-lg font-semibold text-[#1c1a17]">{analysis.packaging.style}</p>
            </div>
            <div className="rounded-[1.45rem] border border-black/6 bg-white/74 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '问候语语气' : 'Greeting tone'}</p>
              <p className="mt-2 text-lg font-semibold text-[#1c1a17]">{analysis.greetingCard.tone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.9rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.18)]">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#eef6ef] p-2 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Recommended path' : 'Recommended path'}</p>
                <p className="mt-2 text-xl font-semibold text-[#1c1a17]">
                  {topRecommendation
                    ? isZh
                      ? topRecommendation.nameZh
                      : topRecommendation.nameEn
                    : analysis.rescueItem || (isZh ? '继续优化当前礼物' : 'Refine the current gift')}
                </p>
                <p className="mt-3 text-sm leading-8 text-[#667085]">
                  {topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Gift context' : 'Gift context'}</p>
            <p className="mt-3 text-sm leading-8 text-[#667085]">
              {contextParagraph || (isZh ? '当前未补充更多礼物与对象背景。' : 'No additional gift or recipient context was provided.')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[2rem] border border-black/6 bg-white/88 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#eef6ef] p-2 text-emerald-600">
              <Star size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Recommendations' : 'Recommendations'}</p>
              <h3 className="mt-1 text-2xl font-serif text-[#1c1a17]">{isZh ? '更稳妥的礼赠建议' : 'Safer gifting options'}</h3>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {analysis.recommendations.map(item => {
              const saved = favoriteRecommendationIds.includes(item.id)
              return (
                <article key={item.id} className="rounded-[1.5rem] border border-black/6 bg-[#fcfaf7] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#9b6b20]">{item.category}</p>
                      <h4 className="mt-2 text-xl font-semibold text-[#1c1a17]">{isZh ? item.nameZh : item.nameEn}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleFavoriteRecommendation(item.id)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        saved ? 'border-[#d2b378] bg-[#fff4de] text-[#8b6b2d]' : 'border-black/8 bg-white text-[#667085]'
                      }`}
                    >
                      {saved ? (isZh ? '已收藏' : 'Saved') : isZh ? '收藏' : 'Save'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-8 text-[#667085]">{isZh ? item.reasonZh : item.reasonEn}</p>
                  <div className="mt-4 grid gap-2">
                    <div className="rounded-[1rem] bg-white px-3 py-3 text-sm leading-7 text-[#5d6472]">
                      {isZh ? '包装建议：' : 'Packaging: '}
                      {isZh ? item.packagingTipZh : item.packagingTipEn}
                    </div>
                    <div className="rounded-[1rem] bg-white px-3 py-3 text-sm leading-7 text-[#5d6472]">
                      {isZh ? '寄送提示：' : 'Shipping: '}
                      {isZh ? item.shippingNoteZh : item.shippingNoteEn}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-black/6 bg-white/88 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#fdf0ec] p-2 text-rose-600">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Risk notes' : 'Risk notes'}</p>
                <h3 className="mt-1 text-2xl font-serif text-[#1c1a17]">{isZh ? '文化摩擦点' : 'Potential frictions'}</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {riskReasons.length > 0 ? (
                riskReasons.map(reason => (
                  <div key={reason} className="rounded-[1.1rem] bg-[#fff7f5] px-4 py-4 text-sm leading-7 text-[#7a5b56]">
                    {reason}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] bg-[#f5faf6] px-4 py-4 text-sm leading-7 text-[#4d6a57]">
                  {isZh ? '暂无明显文化风险，仍建议注意包装与表达细节。' : 'No major cultural risk was found, though packaging and phrasing still matter.'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/6 bg-white/88 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'If you must send it' : 'If you must send it'}</p>
            <div className="mt-4 space-y-3">
              {mustSendAdvice.length > 0 ? (
                mustSendAdvice.map(item => (
                  <div key={item} className="rounded-[1.1rem] bg-[#f8f6f2] px-4 py-4 text-sm leading-7 text-[#5d6472]">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] bg-[#f8f6f2] px-4 py-4 text-sm leading-7 text-[#5d6472]">
                  {isZh ? '当前没有额外的补救建议。' : 'No additional mitigation advice is required.'}
                </div>
              )}
            </div>
          </div>

          {hasAnalysisEnhancementResults && analysisEnhancements && (
            <div className="rounded-[2rem] border border-black/6 bg-white/88 p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Enhancement modules' : 'Enhancement modules'}</p>
              <p className="mt-3 text-sm leading-7 text-[#667085]">
                {isZh ? '已启用更深层的识别、重排或物流估算模块。' : 'Deeper recognition, reranking, or logistics modules contributed to this result.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
