'use client'

import { motion } from 'framer-motion'
import type { AnalysisResult, EnhancedAnalysisState, Locale } from '@/components/gifting/home/types'

interface ResultsEnhancementPanelsProps {
  analysis: AnalysisResult
  analysisEnhancements: EnhancedAnalysisState | null
  locale: Locale
  formatCurrencyAmount: (value: number, currency: string, locale: Locale) => string
}

export function ResultsEnhancementPanels({
  analysis,
  analysisEnhancements,
  locale,
  formatCurrencyAmount,
}: ResultsEnhancementPanelsProps) {
  const isZh = locale === 'zh'

  if (!analysisEnhancements) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-sky-300/20 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold">{isZh ? 'P1 / P2 增强结果' : 'P1 / P2 enhancement results'}</h3>
          <p className="mt-1 text-sm text-slate-300">
            {isZh
              ? '这些结果来自文档中已实现但此前未在主流程展示的增强模块。'
              : 'These panels surface enhancement modules that were implemented but previously not shown in the main workflow.'}
          </p>
        </div>
        <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-100">
          {isZh ? '增强洞察' : 'Enhanced insights'}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {analysisEnhancements.p1?.multimodalResults && (
          <div className="rounded-2xl border border-cyan-300/18 bg-[#10253b]/82 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-50">{isZh ? '多模态识别补强' : 'Multimodal recognition'}</h4>
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
                {(analysisEnhancements.p1.multimodalResults.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {isZh ? '信息源：' : 'Source: '}
              {analysisEnhancements.p1.multimodalResults.enrichmentSource}
            </p>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              {analysisEnhancements.p1.multimodalResults.ocrResult?.brands?.length ? (
                <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <span className="text-cyan-100">{isZh ? 'OCR 品牌：' : 'OCR brands: '}</span>
                  {analysisEnhancements.p1.multimodalResults.ocrResult.brands.join(isZh ? '、' : ', ')}
                </div>
              ) : null}
              {analysisEnhancements.p1.multimodalResults.ocrResult?.specifications?.length ? (
                <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <span className="text-cyan-100">{isZh ? '规格特征：' : 'Specs: '}</span>
                  {analysisEnhancements.p1.multimodalResults.ocrResult.specifications.join(isZh ? '、' : ', ')}
                </div>
              ) : null}
              {analysisEnhancements.p1.multimodalResults.visualAttributes?.colors?.length ? (
                <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <span className="text-cyan-100">{isZh ? '视觉颜色：' : 'Detected colors: '}</span>
                  {analysisEnhancements.p1.multimodalResults.visualAttributes.colors
                    .map(item => `${item.color}${item.prominence ? ` (${item.prominence})` : ''}`)
                    .join(isZh ? '、' : ', ')}
                </div>
              ) : null}
              {analysisEnhancements.p1.multimodalResults.visualAttributes?.materials?.length ? (
                <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <span className="text-cyan-100">{isZh ? '材质识别：' : 'Materials: '}</span>
                  {analysisEnhancements.p1.multimodalResults.visualAttributes.materials
                    .map(item => `${item.material} ${(item.confidence * 100).toFixed(0)}%`)
                    .join(isZh ? '、' : ', ')}
                </div>
              ) : null}
              {analysisEnhancements.p1.multimodalResults.visualAttributes?.styles?.length ? (
                <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <span className="text-cyan-100">{isZh ? '风格标签：' : 'Style tags: '}</span>
                  {analysisEnhancements.p1.multimodalResults.visualAttributes.styles.join(isZh ? '、' : ', ')}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {analysisEnhancements.p1?.logisticsEstimate && (
          <div className="rounded-2xl border border-amber-300/18 bg-[#10253b]/82 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-50">{isZh ? '物流与清关估算' : 'Logistics estimate'}</h4>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                {analysisEnhancements.p1.logisticsEstimate.recommendedCarrier || 'N/A'}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                {isZh ? '总成本：' : 'Total cost: '}
                {formatCurrencyAmount(
                  analysisEnhancements.p1.logisticsEstimate.totalEstimatedCost,
                  analysisEnhancements.p1.logisticsEstimate.destinationCurrency,
                  locale,
                )}
              </div>
              <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                {isZh ? '预计时效：' : 'ETA: '}
                {analysisEnhancements.p1.logisticsEstimate.deliveryTimeRange}
              </div>
              <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                {isZh ? '关税预估：' : 'Duties: '}
                {formatCurrencyAmount(
                  analysisEnhancements.p1.logisticsEstimate.customsDuty.estimatedDuty,
                  analysisEnhancements.p1.logisticsEstimate.customsDuty.currency,
                  locale,
                )}
              </div>
              <div className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                {isZh ? '税率：' : 'Duty rate: '}
                {(analysisEnhancements.p1.logisticsEstimate.customsDuty.dutyRate * 100).toFixed(0)}%
              </div>
            </div>
            {analysisEnhancements.p1.logisticsEstimate.shippingQuotes.length > 0 && (
              <div className="mt-3 space-y-2">
                {analysisEnhancements.p1.logisticsEstimate.shippingQuotes.map(quote => (
                  <div key={`${quote.carrier}-${quote.estimatedDays}`} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                    <span className="text-amber-100">{quote.carrier}</span>
                    {` · ${formatCurrencyAmount(quote.baseCost, quote.currency, locale)} · ${quote.estimatedDays} ${isZh ? '天' : 'days'}`}
                  </div>
                ))}
              </div>
            )}
            {analysisEnhancements.p1.packingRecommendations?.general.length ? (
              <div className="mt-3 rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2 text-xs text-slate-300">
                <span className="text-amber-100">{isZh ? '包装建议：' : 'Packing: '}</span>
                {analysisEnhancements.p1.packingRecommendations.general.join(isZh ? '；' : '; ')}
              </div>
            ) : null}
          </div>
        )}

        {analysisEnhancements.p1?.collaborativeResults?.length ? (
          <div className="rounded-2xl border border-emerald-300/18 bg-[#10253b]/82 p-4">
            <h4 className="text-lg font-semibold text-slate-50">{isZh ? '协同过滤重排结果' : 'Collaborative reranking'}</h4>
            <div className="mt-3 space-y-2">
              {analysisEnhancements.p1.collaborativeResults.map(item => (
                <div key={item.id} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-100">{isZh ? item.nameZh : item.nameEn}</span>
                    <span className="text-xs text-emerald-100">{item.score}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{isZh ? item.reasonZh : item.reasonEn}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {analysisEnhancements.p2?.wideDeepResults?.length ? (
          <div className="rounded-2xl border border-fuchsia-300/18 bg-[#10253b]/82 p-4">
            <h4 className="text-lg font-semibold text-slate-50">{isZh ? 'Wide & Deep 重排结果' : 'Wide & Deep reranking'}</h4>
            <div className="mt-3 space-y-2">
              {analysisEnhancements.p2.wideDeepResults.map(item => (
                <div key={item.id} className="rounded-lg border border-slate-600/60 bg-slate-900/45 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-100">{isZh ? item.nameZh : item.nameEn}</span>
                    <span className="text-xs text-fuchsia-100">{item.score}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{isZh ? item.reasonZh : item.reasonEn}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {analysisEnhancements.p2?.culturalImpactScores &&
        Object.keys(analysisEnhancements.p2.culturalImpactScores).length > 0 ? (
          <div className="rounded-2xl border border-violet-300/18 bg-[#10253b]/82 p-4">
            <h4 className="text-lg font-semibold text-slate-50">{isZh ? '知识图谱文化影响分' : 'Knowledge graph impact'}</h4>
            <p className="mt-2 text-xs text-slate-400">
              {isZh
                ? '当前图谱覆盖国家有限，未收录的国家会显示为 0。'
                : 'Current graph coverage is limited; unsupported countries will show as 0.'}
            </p>
            <div className="mt-3 space-y-2">
              {Object.entries(analysisEnhancements.p2.culturalImpactScores).map(([id, score]) => {
                const matchedRecommendation = analysis.recommendations.find(item => item.id === id)

                return (
                  <div key={id}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                      <span>{matchedRecommendation ? (isZh ? matchedRecommendation.nameZh : matchedRecommendation.nameEn) : id}</span>
                      <span>{Math.round(score * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700/80">
                      <div className="h-full rounded-full bg-violet-300/80" style={{ width: `${Math.round(score * 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {analysisEnhancements.localizedOutput?.formattedRecommendations && (
        <div className="mt-4 rounded-2xl border border-slate-200/12 bg-slate-950/30 p-4">
          <h4 className="text-sm font-semibold text-slate-100">{isZh ? '本地化格式化输出' : 'Localized formatted output'}</h4>
          <pre className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
            {analysisEnhancements.localizedOutput.formattedRecommendations}
          </pre>
        </div>
      )}
    </motion.div>
  )
}
