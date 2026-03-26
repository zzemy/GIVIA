'use client'

import { homeSurface } from '@/components/gifting/home/home-design-tokens'
import type { AnalysisResult, Locale } from '@/components/gifting/home/types'

interface ResultsSummaryPanelProps {
  analysis: AnalysisResult
  locale: Locale
  contextLabel: string
}

export function ResultsSummaryPanel({
  analysis,
  locale,
  contextLabel,
}: ResultsSummaryPanelProps) {
  const isZh = locale === 'zh'
  const topRecommendation = analysis.recommendations[0]
  const localizedRiskLevel =
    analysis.riskLevel === 'Low'
      ? isZh
        ? '低风险'
        : 'Low'
      : analysis.riskLevel === 'Medium'
        ? isZh
          ? '中风险'
          : 'Medium'
        : isZh
          ? '高风险'
          : 'High'

  const summaryHeadline =
    analysis.isTaboo || analysis.riskLevel === 'High'
      ? isZh
        ? '不建议直接赠送当前方案'
        : 'Do not send the current gift as-is'
      : analysis.riskLevel === 'Medium'
        ? isZh
          ? '建议调整后再赠送'
          : 'Refine the gift before sending'
        : isZh
          ? '当前礼物整体可送'
          : 'The current gift is broadly suitable'

  const summaryBody =
    analysis.warning ||
    (analysis.riskLevel === 'Low'
      ? isZh
        ? '当前礼物整体方向稳定，重点优化包装、表达和落地细节。'
        : 'The overall direction is stable; focus on packaging, phrasing, and delivery details.'
      : analysis.rescueReason ||
        (isZh
          ? '建议优先参考更稳妥的替代方案，并结合包装与表达方式一起调整。'
          : 'Prefer the safer alternative path and adjust packaging and wording together.'))

  return (
    <section className={`overflow-hidden p-6 md:p-8 ${homeSurface.primary}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-xs uppercase tracking-[0.22em] text-[#e7d2af]/80">
            {isZh ? '赠礼顾问结论' : 'Advisor summary'}
          </h3>
          <p className="mt-3 text-3xl font-semibold leading-tight text-slate-50 md:text-[2.2rem]">
            {summaryHeadline}
          </p>
          <p className="mt-5 max-w-[46rem] text-sm leading-7 text-slate-200/82 md:text-base">
            {summaryBody}
          </p>
        </div>

        <div className="grid gap-3 lg:min-w-72">
          <div className={`px-4 py-3 ${homeSurface.quiet}`}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/70">
              {isZh ? '判断结论' : 'Decision'}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {analysis.riskLevel === 'Low'
                ? isZh
                  ? '可直接优化后赠送'
                  : 'Safe with light refinement'
                : analysis.riskLevel === 'Medium'
                  ? isZh
                    ? '需先调整包装与表达'
                    : 'Adjust packaging and message first'
                  : isZh
                    ? '建议直接改用替代方案'
                    : 'Prefer a replacement option'}
            </p>
          </div>
          <div className={`px-4 py-3 ${homeSurface.quiet}`}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-100/72">
              {isZh ? '推荐方向' : 'Recommended path'}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {topRecommendation
                ? locale === 'zh'
                  ? topRecommendation.nameZh
                  : topRecommendation.nameEn
                : analysis.rescueItem || (isZh ? '继续优化当前礼物' : 'Continue refining the current gift')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
          {contextLabel}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
          {isZh ? `文化契合度 ${analysis.fitScore}` : `Fit score ${analysis.fitScore}`}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            analysis.riskLevel === 'Low'
              ? 'border border-emerald-400/25 bg-emerald-500/12 text-emerald-100'
              : analysis.riskLevel === 'Medium'
                ? 'border border-amber-400/25 bg-amber-500/12 text-amber-100'
              : 'border border-red-400/25 bg-red-500/12 text-red-100'
          }`}
        >
          {isZh ? `风险等级 ${localizedRiskLevel}` : `Risk level ${localizedRiskLevel}`}
        </span>
      </div>
    </section>
  )
}
