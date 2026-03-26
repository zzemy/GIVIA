'use client'

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'
import { getCountryName } from '@/lib/countries'
import { ResultsDetailPanels } from '@/components/gifting/home/sections/results-detail-panels'
import { ResultsEnhancementPanels } from '@/components/gifting/home/sections/results-enhancement-panels'
import { ResultsRecommendationsPanel } from '@/components/gifting/home/sections/results-recommendations-panel'
import { ResultsSummaryPanel } from '@/components/gifting/home/sections/results-summary-panel'
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
  t,
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
  const contextLabel = `${selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选择国家' : 'No country'} · ${selectedAudienceLabel} · ${sceneLabel}`

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-14 space-y-6 sm:space-y-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{t('results.title')}</h2>
          {analysisSource && (
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200">
              {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI + 规则引擎' : 'AI + Rules') : isZh ? '本地规则回退' : 'Local rules fallback'}
            </div>
          )}
        </div>
        <Button onClick={onReset} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-white hover:bg-white/[0.08]">
          <RotateCcw size={16} />
          {isZh ? '重新开始' : 'Start Over'}
        </Button>
      </div>

      <div className={`px-4 py-3 text-sm text-slate-200 ${homeSurface.quiet}`}>
        <p>
          {isZh ? '分析上下文：' : 'Analysis context: '}
          {contextLabel}
        </p>
        {!!(visionDescription.trim() || giftDescription.trim()) && (
          <p className="mt-1 text-xs text-slate-300/78">
            {isZh ? '礼物描述：' : 'Gift description: '}
            {visionDescription.trim() || giftDescription.trim()}
          </p>
        )}
        {targetProfile.trim() && <p className="mt-1 text-xs text-slate-300/78">{targetProfile.trim()}</p>}
      </div>

      <ResultsSummaryPanel analysis={analysis} locale={locale} contextLabel={contextLabel} />

      <ResultsRecommendationsPanel
        analysis={analysis}
        locale={locale}
        favoriteRecommendationIds={favoriteRecommendationIds}
        onToggleFavoriteRecommendation={onToggleFavoriteRecommendation}
      />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#e7d2af]/76">
          {isZh ? '支持分析' : 'SUPPORTING ANALYSIS'}
        </p>

        {hasAnalysisEnhancementResults && (
          <ResultsEnhancementPanels
            analysis={analysis}
            analysisEnhancements={analysisEnhancements}
            locale={locale}
            formatCurrencyAmount={formatCurrencyAmount}
          />
        )}

        <ResultsDetailPanels
          analysis={analysis}
          locale={locale}
          t={t}
          riskReasons={riskReasons}
          mustSendAdvice={mustSendAdvice}
          riskActionMeta={riskActionMeta}
        />
      </div>
    </motion.div>
  )
}
