'use client'

import { motion } from 'framer-motion'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'
import type { AnalysisResult, Locale } from '@/components/gifting/home/types'

interface ResultsRecommendationsPanelProps {
  analysis: AnalysisResult
  locale: Locale
  favoriteRecommendationIds: string[]
  onToggleFavoriteRecommendation: (id: string) => void
}

export function ResultsRecommendationsPanel({
  analysis,
  locale,
  favoriteRecommendationIds,
  onToggleFavoriteRecommendation,
}: ResultsRecommendationsPanelProps) {
  if (analysis.recommendations.length === 0) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 ${homeSurface.secondary}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#e7d2af]/78">
            {locale === 'zh' ? '推荐方案' : 'Recommended options'}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-100">
            {analysis.riskLevel === 'Low'
              ? locale === 'zh'
                ? '可选升级推荐'
                : 'Optional upgrades'
              : locale === 'zh'
                ? '更稳妥的替代推荐'
                : 'Safer alternatives'}
          </h3>
          <p className="mt-1 text-sm text-slate-300/78">
            {analysis.riskLevel === 'Low'
              ? locale === 'zh'
                ? '当前礼物整体可送，以下是更稳、更匹配当前场景的升级选项。'
                : 'The current gift is broadly safe. These are stronger upgrades for the same context.'
              : locale === 'zh'
                ? '当前方案存在风险，以下是结合国家规则、场景模板、预算和目标群体筛出的更稳妥替代项。'
                : 'The current option carries risk. These safer replacements are ranked by country rules, scene template, budget, and recipient profile.'}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
          {analysis.riskLevel === 'Low'
            ? locale === 'zh'
              ? '升级参考'
              : 'Upgrade options'
            : locale === 'zh'
              ? '替代参考'
              : 'Replacement options'}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {analysis.recommendations.map(item => {
          const isFavorite = favoriteRecommendationIds.includes(item.id)
          const name = locale === 'zh' ? item.nameZh : item.nameEn

          return (
            <div key={item.id} className={`p-4 ${homeSurface.quiet}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#e7d2af]/78">{item.category}</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-50">{name}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleFavoriteRecommendation(item.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    isFavorite
                      ? 'border-[#e7d2af]/35 bg-[#e7d2af]/12 text-[#f5e6cd]'
                      : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/22'
                  }`}
                >
                  {isFavorite ? (locale === 'zh' ? '已收藏' : 'Saved') : locale === 'zh' ? '收藏' : 'Save'}
                </button>
              </div>

              <div className="mt-3 text-3xl font-bold text-[#f3ddba]">{item.score}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300/82">{locale === 'zh' ? item.reasonZh : item.reasonEn}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="rounded-lg border border-white/8 bg-[#091426]/45 px-3 py-2">
                  <span className="text-[#f3ddba]">{locale === 'zh' ? '送礼话术：' : 'Pitch: '}</span>
                  {locale === 'zh' ? item.pitchZh : item.pitchEn}
                </div>
                <div className="rounded-lg border border-white/8 bg-[#091426]/45 px-3 py-2">
                  <span className="text-[#f3ddba]">{locale === 'zh' ? '包装建议：' : 'Packaging: '}</span>
                  {locale === 'zh' ? item.packagingTipZh : item.packagingTipEn}
                </div>
                <div className="rounded-lg border border-white/8 bg-[#091426]/45 px-3 py-2">
                  <span className="text-[#f3ddba]">{locale === 'zh' ? '寄送提示：' : 'Shipping: '}</span>
                  {locale === 'zh' ? item.shippingNoteZh : item.shippingNoteEn}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
