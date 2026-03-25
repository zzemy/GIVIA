'use client'

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCountryName } from '@/lib/countries'
import { ResultsDetailPanels } from '@/components/gifting/home/results-detail-panels'
import { ResultsEnhancementPanels } from '@/components/gifting/home/results-enhancement-panels'
import { ResultsRecommendationsPanel } from '@/components/gifting/home/results-recommendations-panel'
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{t('results.title')}</h2>
          {analysisSource && (
            <div className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI + 规则引擎' : 'AI + Rules') : isZh ? '本地规则回退' : 'Local rules fallback'}
            </div>
          )}
        </div>
        <Button onClick={onReset} className="flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600">
          <RotateCcw size={16} />
          {isZh ? '重新开始' : 'Start Over'}
        </Button>
      </div>

      <div className="rounded-xl border border-cyan-200/20 bg-[#11263e]/70 px-4 py-3 text-sm text-slate-200">
        <p>
          {isZh ? '分析上下文：' : 'Analysis context: '}
          {selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选择国家' : 'No country'}
          {' · '}
          {selectedAudienceLabel}
          {' · '}
          {sceneLabel}
        </p>
        {!!(visionDescription.trim() || giftDescription.trim()) && (
          <p className="mt-1 text-xs text-slate-300">
            {isZh ? '礼物描述：' : 'Gift description: '}
            {visionDescription.trim() || giftDescription.trim()}
          </p>
        )}
        {targetProfile.trim() && <p className="mt-1 text-xs text-slate-300">{targetProfile.trim()}</p>}
      </div>

      {hasAnalysisEnhancementResults && (
        <ResultsEnhancementPanels
          analysis={analysis}
          analysisEnhancements={analysisEnhancements}
          locale={locale}
          formatCurrencyAmount={formatCurrencyAmount}
        />
      )}

      <ResultsRecommendationsPanel
        analysis={analysis}
        locale={locale}
        favoriteRecommendationIds={favoriteRecommendationIds}
        onToggleFavoriteRecommendation={onToggleFavoriteRecommendation}
      />

      <ResultsDetailPanels
        analysis={analysis}
        locale={locale}
        t={t}
        riskReasons={riskReasons}
        mustSendAdvice={mustSendAdvice}
        riskActionMeta={riskActionMeta}
      />
    </motion.div>
  )
}
