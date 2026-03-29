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

const reportPhotography = {
  lead:
    '/editorial/hero-family.jpg?v=2',
  note:
    '/editorial/result1.jpg?v=2',
  arrival:
    '/editorial/result2.jpg?v=2',
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
  riskActionMeta,
  formatCurrencyAmount,
  onReset,
  onToggleFavoriteRecommendation,
}: ResultsSectionProps) {
  const isZh = locale === 'zh'
  const topRecommendation = analysis.recommendations[0]
  const countryLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选择国家' : 'No country'
  const contextParagraph = [visionDescription.trim() || giftDescription.trim(), targetProfile.trim()].filter(Boolean).join(' ')
  const logisticsEstimate = analysisEnhancements?.p1?.logisticsEstimate
  const multimodalResults = analysisEnhancements?.p1?.multimodalResults
  const collaborativeResults = analysisEnhancements?.p1?.collaborativeResults ?? analysisEnhancements?.p2?.wideDeepResults ?? []

  

  

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
        ? '真正还需要拿捏的，是包装语气、卡片措辞，以及它会以怎样的方式落到对方手里。'
        : 'What still matters is the packaging register, the wording on the card, and the way the gesture finally lands in the other person’s hands.'
      : isZh
        ? '更合适的做法，是先整理表达方式，再考虑替代方向，让这份心意重新回到人与文化之间。'
        : 'A better route is to revise the expression first, then consider alternatives, so the centre of the gesture returns to people and culture.')

  const openingRecommendation = analysis.rescueItem || (topRecommendation ? (isZh ? topRecommendation.nameZh : topRecommendation.nameEn) : (isZh ? '继续细化当前礼物' : 'Refine the current gift further'))

  const openingRecommendationReason = analysis.rescueReason || (topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : undefined)

  const memoLines =
    riskReasons.length > 0
      ? riskReasons
      : analysis.matchedRules.length > 0
        ? analysis.matchedRules.map(rule => rule.explanation)
        : [
            isZh
              ? '暂时未见明显文化风险，但包装与表达细节依然会改变对方最终如何理解这份好意。'
              : 'No major cultural risk appears immediately, though packaging and wording still shape how the gesture will finally be understood.',
          ]

  const adviceLines =
    mustSendAdvice.length > 0
      ? mustSendAdvice
      : analysis.matchedRules.length > 0
        ? analysis.matchedRules.map(rule => rule.suggestion)
        : [
            isZh
              ? '当前没有额外补救建议，但依旧建议同步收紧表达语气与包装细节。'
              : 'No additional mitigation is required for now, though wording and packaging should still be refined together.',
          ]

  const conclusionCards = [
    { label: isZh ? '当前结论' : 'Current conclusion', value: analysis.riskLevel },
    { label: isZh ? '契合度' : 'Fit score', value: `${analysis.fitScore}` },
    { label: isZh ? '包装方向' : 'Packaging direction', value: analysis.packaging.style },
    { label: isZh ? '表达语气' : 'Message tone', value: analysis.greetingCard.tone },
  ]

  const semanticLines = [
    analysis.semanticSignals.tags.length > 0 ? analysis.semanticSignals.tags.join(', ') : null,
    analysis.semanticSignals.flowers.length > 0 ? analysis.semanticSignals.flowers.join(', ') : null,
    analysis.semanticSignals.numbers.length > 0 ? analysis.semanticSignals.numbers.join(', ') : null,
  ].filter(Boolean)

  const additionalLayers = [
    multimodalResults
      ? {
          title: isZh ? '视觉细读补充' : 'Visual verification',
          body: isZh
            ? `补充识别来源为 ${multimodalResults.enrichmentSource}，置信度约 ${(multimodalResults.confidenceScore * 100).toFixed(0)}%。`
            : `Additional reading sourced from ${multimodalResults.enrichmentSource} with roughly ${(multimodalResults.confidenceScore * 100).toFixed(0)}% confidence.`,
        }
      : null,
    logisticsEstimate
      ? {
          title: isZh ? '送达预演' : 'Delivery rehearsal',
          body: isZh
            ? `${logisticsEstimate.recommendedCarrier} 预计 ${logisticsEstimate.deliveryTimeRange}，总成本约 ${formatCurrencyAmount(logisticsEstimate.totalEstimatedCost, logisticsEstimate.destinationCurrency as never, locale)}。`
            : `${logisticsEstimate.recommendedCarrier} is estimated at ${logisticsEstimate.deliveryTimeRange}, with a total cost around ${formatCurrencyAmount(logisticsEstimate.totalEstimatedCost, logisticsEstimate.destinationCurrency as never, locale)}.`,
        }
      : null,
    collaborativeResults.length > 0
      ? {
          title: isZh ? '替代方向校准' : 'Alternative reranking',
          body: isZh
            ? '结果还吸收了更深层的替代方向重排，用来修正推荐的先后顺序。'
            : 'The dossier also incorporates deeper reranking to refine the order of alternative directions.',
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; body: string }>

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-2">
        <div className="max-w-[60rem]">
          <div className="flex items-center gap-2 mb-3">
             <span className="flex h-2 w-2 rounded-full bg-[#1c1a17] animate-pulse" />
             <p className="font-mono text-[10px] uppercase tracking-widest text-[#69707d]">{isZh ? '系统决策终稿生成完毕' : 'DECISION DOSSIER GENERATED'}</p>
          </div>
          <h2 className="text-[2.2rem] font-serif leading-[1.1] tracking-[-0.03em] text-[#1d1a17] md:text-[2.6rem]">
            {summaryTitle}
          </h2>
        </div>
        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/82 px-5 py-3 text-[#495161] shadow-sm transition hover:-translate-y-0.5"
        >
          <RotateCcw size={14} className="mr-2" />
          {isZh ? '新的一局' : 'New Session'}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.5rem] border border-[#e2ddd5] bg-white shadow-sm flex flex-col">
        
        <div className="border-b border-[#e2ddd5] bg-[#faf9f7] px-6 py-5 sm:px-10 flex flex-wrap gap-x-12 gap-y-4">
           <div>
             <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '目标区域 & 对象' : 'TARGET & AUDIENCE'}</p>
             <p className="text-sm text-[#1c1a17] font-medium">{countryLabel} · {selectedAudienceLabel} · {sceneLabel}</p>
           </div>
           {giftDescription && (
             <div>
               <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '当前识别礼物' : 'DETECTED OBJECT'}</p>
               <p className="text-sm text-[#1c1a17] font-medium max-w-[200px] truncate" title={giftDescription}>{giftDescription}</p>
             </div>
           )}
           <div>
             <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '综合风险评级' : 'RISK LEVEL'}</p>
             <p className={`text-sm font-bold font-mono uppercase ${analysis.riskLevel === 'High' ? 'text-red-500' : analysis.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-600'}`}>
               {analysis.riskLevel}
             </p>
           </div>
        </div>

        <div className="px-6 py-8 sm:px-10 lg:py-12 border-b border-[#e2ddd5]">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#1c1a17] border-b border-black pb-2 inline-block mb-6">
                {isZh ? '01. 情境推算与拦截' : '01. CULTURAL INTERCEPTION'}
              </p>
              {summaryBody.split('\n').filter(Boolean).map((paragraph, idx) => (
                      <p key={idx} className="text-[1.05rem] leading-[1.8] text-[#1c1a17] font-medium mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
              
              {/* Highlight AI Dynamic Warnings deeply */}
              {memoLines.map(line => (
                  <p key={line} className="mt-4 text-[0.95rem] leading-8 text-[#5f6672]">{line}</p>
              ))}

              {semanticLines.length > 0 && (
                <div className="mt-6 p-4 bg-[#f4f3f0] rounded-lg border border-[#e8e5df] inline-block">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#9aa3b2] mb-2">{isZh ? '特征溯源' : 'EXTRACTED SEMANTICS'}</p>
                  <p className="text-xs font-mono text-[#4a505a] leading-relaxed">{semanticLines.join(' / ')}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#9aa3b2] mb-2">{isZh ? '系统底层规则触点' : 'TRIGGERED LOCAL RULES'}</p>
              {analysis.matchedRules.length > 0 ? (
                analysis.matchedRules.map((rule, idx) => (
                  <div key={rule.id || idx} className="grid sm:grid-cols-[auto_1fr] gap-4 p-5 rounded-xl border border-red-500/20 bg-red-50/50">
                    <div className="flex flex-col items-center justify-center bg-white border border-red-200 rounded-lg w-10 h-10 flex-shrink-0">
                       <span className="font-mono text-xs text-red-500 font-bold">R{idx+1}</span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1c1a17] flex items-center gap-2">
                        {rule.ruleType}
                        <span className="px-2 py-0.5 rounded uppercase font-mono text-[9px] bg-red-100 text-red-600">Matched</span>
                      </h5>
                      <p className="mt-1 text-xs text-[#4a505a] leading-relaxed">{rule.explanation}</p>
                      <p className="mt-2 text-[10px] font-medium text-red-800 flex gap-2">
                        <span className="opacity-50">↳</span> {rule.suggestion}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 rounded-xl border border-[#e2ddd5] bg-[#faf9f7] flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm text-[#4a505a]">{isZh ? '此物未显式触发不可逾越的地方法规或硬性禁忌。当前风险分数主要来源于该对象、关系与场景下的得体度与心理预期落差，核心需通过包装与文案来提升仪式感。' : 'No hard local rules broken. Risk score primarily reflects etiquette alignment based on the relationship and occasion. Focus is on reframing through packaging and tone.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW AI ALGORITHM PIVOT SECTION (Replaces the fake generic products) */}
        {/* ========================================================================= */}
        <div className="px-6 py-8 sm:px-10 lg:py-14 border-b border-[#e2ddd5] bg-[linear-gradient(170deg,#fcfcfb,#f4f3eb)]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-indigo-700 border-b border-indigo-700 pb-2 inline-block mb-8">
             {isZh ? '02. 智能解围与降级策略' : '02. AI PIVOT & MITIGATION STRATEGY'}
          </p>
          
          <div className="grid lg:grid-cols-2 gap-10">
             
             {/* Dynamic AI Replacement Recommendation (This shows the text from the LLM!) */}
             <div className="bg-white p-8 rounded-2xl border border-indigo-500/20 shadow-[0_12px_40px_-20px_rgba(79,70,229,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-indigo-50 text-indigo-600 text-[9px] uppercase font-mono tracking-widest px-3 py-1 rounded-full border border-indigo-100">
                    {isZh ? 'AI 动态生成' : 'AI GENERATED'}
                  </span>
                </div>
                <h4 className="font-serif text-[1.4rem] text-[#1c1a17] pr-20">{isZh ? '推荐转向：' : 'Pivot to: '}{openingRecommendation}</h4>
                <div className="mt-6 pt-6 border-t border-indigo-500/10">
                   <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-3">{isZh ? '推演逻辑' : 'REASONING'}</p>
                   <p className="text-[0.95rem] leading-[1.8] text-[#4a505a]">
                     {openingRecommendationReason || (isZh ? '基于目前关系与场景，这是更为稳妥且符合心理预期的改写方向。' : 'Based on the specified relationship and scenario, this is a safer and more appropriate pivot.')}
                   </p>
                </div>
             </div>

             {/* The Expression Tweaks */}
             <div className="space-y-6">
                 {/* Card Tone */}
                 <div className="bg-white p-6 rounded-xl border border-[#e2ddd5] shadow-sm relative">
                    <p className="font-mono text-[10px] text-[#9aa3b2] uppercase mb-4">{isZh ? '卡片语气校准 (决定性)' : 'CARD TONE CALIBRATION (CRITICAL)'}</p>
                    <p className="text-sm font-medium text-[#1c1a17] mb-3">{isZh ? '基调：' : 'Tone: '} {analysis.greetingCard.tone}</p>
                    <div className="border-l-[3px] border-indigo-400 pl-4 py-1 bg-indigo-50/30 rounded-r-lg">
                       <p className="text-[0.95rem] text-[#1c1a17] italic leading-relaxed">
                         &quot;{analysis.greetingCard.opener} {analysis.greetingCard.body} {analysis.greetingCard.closing}&quot;
                       </p>
                    </div>
                 </div>

                 {/* Packaging Style */}
                 <div className="bg-white p-6 rounded-xl border border-[#e2ddd5] shadow-sm">
                    <p className="font-mono text-[10px] text-[#9aa3b2] uppercase mb-4">{isZh ? '包装视觉规范' : 'PACKAGING GUIDELINES'}</p>
                    <p className="text-sm text-[#5f6672] leading-relaxed mb-3">
                       {isZh ? '建议风格：' : 'Style: '} <strong className="text-[#1c1a17]">{analysis.packaging.style}</strong>
                    </p>
                    <div className="flex gap-2">
                       {analysis.packaging.colors.map(color => (
                          <span key={color} className="text-xs px-2 py-1 bg-[#f4f3f0] border border-[#e2ddd5] text-[#1c1a17] rounded shadow-sm">{color}</span>
                       ))}
                    </div>
                 </div>
             </div>

          </div>
        </div>

        {/* 补充信息 / 高级图层 */}
        {(additionalLayers.length > 0 || mustSendAdvice.length > 0) && (
          <div className="px-6 py-8 sm:px-10 border-b border-[#e2ddd5] bg-white grid lg:grid-cols-2 gap-8">
            {mustSendAdvice.length > 0 && (
              <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-200">
                 <p className="font-mono text-[10px] text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                   ⚠️ {isZh ? '硬送降级方案 (如不可替换)' : 'FALLBACK IF UNCHANGEABLE'}
                 </p>
                 <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-amber-900/80">
                   {mustSendAdvice.map(line => <li key={line}>{line}</li>)}
                 </ul>
              </div>
            )}
            {additionalLayers.length > 0 && (
              <div>
                 <p className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-widest mb-3">
                   {isZh ? '模型补充数据源' : 'ENRICHMENT DATA LAYERS'}
                 </p>
                 <div className="space-y-3">
                   {additionalLayers.map(layer => (
                     <div key={layer.title} className="text-xs bg-[#faf9f7] p-3 rounded border border-[#e8e5df]">
                       <span className="font-bold text-[#1c1a17] mr-2">{layer.title}:</span>
                       <span className="text-[#5f6672]">{layer.body}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.section>
  )
}
