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

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[48rem]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Final proposal' : 'Final proposal'}</p>
          <h2 className="mt-3 text-[3.2rem] font-serif leading-[1.02] tracking-[-0.05em] text-[#1c1a17]">
            {isZh ? '一份更像品牌编辑稿的礼赠结论。' : 'A gifting conclusion written like an editorial brief.'}
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
          {isZh ? '重新开始' : 'Start over'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <div className="rounded-[2.5rem] border border-[#e5dbcf] bg-[linear-gradient(155deg,#fffdf8,#fff4e4)] p-7 shadow-[0_32px_70px_-42px_rgba(184,129,45,0.28)]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#8b6b2d]">
              {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI + 规则引擎' : 'AI + Rules') : isZh ? '本地规则回退' : 'Local fallback'}
            </span>
            <span className="rounded-full border border-[#eadfcb] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#8b6b2d]">
              {isZh ? `文化契合度 ${analysis.fitScore}` : `Fit score ${analysis.fitScore}`}
            </span>
          </div>

          <h3 className="mt-6 text-[2.6rem] font-serif leading-[1.05] tracking-[-0.04em] text-[#1c1a17]">{summaryTitle}</h3>
          <p className="mt-4 max-w-[44rem] text-base leading-8 text-[#5d6472]">{summaryBody}</p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { label: isZh ? '风险等级' : 'Risk level', value: analysis.riskLevel },
              { label: isZh ? '包装方向' : 'Packaging', value: analysis.packaging.style },
              { label: isZh ? '问候语语气' : 'Greeting tone', value: analysis.greetingCard.tone },
            ].map(item => (
              <div key={item.label} className="rounded-[1.6rem] border border-black/6 bg-white/74 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#1c1a17]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2.1rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.16)]">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[#eef6ef] p-2 text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Recommended path' : 'Recommended path'}</p>
                <p className="mt-2 text-[1.4rem] font-serif leading-tight text-[#1c1a17]">
                  {topRecommendation
                    ? isZh
                      ? topRecommendation.nameZh
                      : topRecommendation.nameEn
                    : analysis.rescueItem || (isZh ? '继续优化当前礼物' : 'Refine the current gift')}
                </p>
                <p className="mt-3 text-sm leading-8 text-[#69707d]">
                  {topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : analysis.rescueReason}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.1rem] border border-black/6 bg-white/82 p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.16)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Narrative context' : 'Narrative context'}</p>
            <p className="mt-3 text-sm leading-8 text-[#69707d]">
              {contextParagraph || (isZh ? '当前未补充更多礼物与对象背景。' : 'No additional gift or recipient context was provided.')}
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Recommendations' : 'Recommendations'}</p>
              <h3 className="mt-1 text-[2rem] font-serif text-[#1c1a17]">{isZh ? '更稳妥的替代路径' : 'Safer alternative directions'}</h3>
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
                      {saved ? (isZh ? '已收藏' : 'Saved') : isZh ? '收藏' : 'Save'}
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-8 text-[#69707d]">{isZh ? item.reasonZh : item.reasonEn}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.2rem] bg-white px-4 py-4 text-sm leading-7 text-[#5d6472]">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '包装建议' : 'Packaging'}</span>
                      <span className="mt-2 block">{isZh ? item.packagingTipZh : item.packagingTipEn}</span>
                    </div>
                    <div className="rounded-[1.2rem] bg-white px-4 py-4 text-sm leading-7 text-[#5d6472]">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '寄送提示' : 'Shipping'}</span>
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
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Risk notes' : 'Risk notes'}</p>
                <h3 className="mt-1 text-[1.8rem] font-serif text-[#1c1a17]">{isZh ? '文化摩擦点' : 'Potential frictions'}</h3>
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
                  {isZh ? '暂无明显文化风险，仍建议注意包装与表达细节。' : 'No major cultural risk was found, though packaging and phrasing still matter.'}
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
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'If you must send it' : 'If you must send it'}</p>
                <h3 className="mt-1 text-[1.8rem] font-serif text-[#1c1a17]">{isZh ? '补救与表达策略' : 'Mitigation and expression strategy'}</h3>
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
                  {isZh ? '当前没有额外的补救建议。' : 'No additional mitigation advice is required.'}
                </div>
              )}
            </div>
          </div>

          {hasAnalysisEnhancementResults && analysisEnhancements && (
            <div className="rounded-[2.2rem] border border-black/6 bg-white/88 p-6 shadow-[0_24px_54px_-36px_rgba(15,23,42,0.16)]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? 'Enhancement modules' : 'Enhancement modules'}</p>
              <p className="mt-3 text-sm leading-7 text-[#69707d]">
                {isZh ? '已启用更深层的识别、重排或物流估算模块。' : 'Deeper recognition, reranking, or logistics modules contributed to this result.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
