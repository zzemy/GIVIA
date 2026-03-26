'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle, Zap, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton, homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import { withBasePath } from '@/lib/asset-path'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { EnhancementSettings, Locale, RecognitionResult, SelectOption } from '@/components/gifting/home/types'

interface StepAnalysisProps {
  locale: Locale
  t: (path: string) => string
  selectedCountry: string
  recognition: RecognitionResult | null
  hasGiftInput: boolean
  selectedFile: File | null
  selectedAudienceLabel: string
  activeSceneTemplate: SceneTemplate | null
  hasEnabledAnalysisEnhancement: boolean
  analysisEnhancementSettings: EnhancementSettings
  enhancementOriginCountry: string
  enhancementOriginOptions: SelectOption[]
  canAnalyze: boolean
  hasAnalysis: boolean
  isAnalyzing: boolean
  analyzingElapsedSeconds: number
  isAudienceReady: boolean
  giftName: string
  onEnhancementSettingChange: (key: keyof EnhancementSettings, checked: boolean) => void
  onEnhancementOriginCountryChange: (value: string) => void
  onAnalyze: () => void | Promise<void>
}

export function StepAnalysis({
  locale,
  t,
  selectedCountry,
  recognition,
  hasGiftInput,
  selectedFile,
  selectedAudienceLabel,
  activeSceneTemplate,
  hasEnabledAnalysisEnhancement,
  analysisEnhancementSettings,
  enhancementOriginCountry,
  enhancementOriginOptions,
  canAnalyze,
  hasAnalysis,
  isAnalyzing,
  analyzingElapsedSeconds,
  isAudienceReady,
  giftName,
  onEnhancementSettingChange,
  onEnhancementOriginCountryChange,
  onAnalyze,
}: StepAnalysisProps) {
  const isZh = locale === 'zh'
  const statTileClassName = `px-3 py-2.5 ${homeSurface.quiet}`
  const [showAdvancedModules, setShowAdvancedModules] = React.useState(false)
  const enabledEnhancementCount = Object.values(analysisEnhancementSettings).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -1 }}
      className={`rounded-[1.75rem] p-4 shadow-[0_12px_32px_rgba(3,12,28,0.24)] transition-all duration-300 hover:border-white/14 sm:p-6 ${homeSurface.secondary}`}
    >
      <div className="mb-5 flex items-start justify-between border-b border-white/8 pb-4">
        <div>
          <h2 className="mb-1.5 text-lg font-semibold text-slate-100 sm:mb-2 sm:text-xl">{t('analysis.title')}</h2>
          <p className={`home-pretty text-xs sm:text-sm ${homeText.muted}`}>{t('analysis.description')}</p>
        </div>
        <Image src={withBasePath('/brand/step-analysis.svg')} alt="analysis step" width={36} height={36} />
      </div>

      <div className="grid gap-4 sm:gap-5">
        <div className={`rounded-2xl p-3.5 sm:p-4 ${homeSurface.inset}`}>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{isZh ? '分析摘要' : 'Analysis summary'}</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {[
              {
                label: isZh ? '国家' : 'Country',
                value: selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '待选择' : 'Pending',
              },
              {
                label: isZh ? '场景' : 'Scene',
                value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '未设置' : 'Unset',
              },
              {
                label: isZh ? '识别' : 'Recognition',
                value: recognition || hasGiftInput || selectedFile ? (isZh ? '已准备' : 'Ready') : isZh ? '待输入' : 'Waiting',
              },
              {
                label: isZh ? '画像' : 'Audience',
                value: selectedAudienceLabel,
              },
            ].map(item => (
              <div key={item.label} className={statTileClassName}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-3.5 sm:p-4 ${homeSurface.inset}`}>
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#e7d2af]/76">
                {isZh ? '可选增强' : 'Optional enhancements'}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">
                {isZh ? '高级判断补充项' : 'Advanced analysis add-ons'}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-300/86">
                {isZh
                  ? '默认主流程已经够用；只有在你需要更细的识别、物流或重排判断时，再展开这些设置。'
                  : 'The core flow is enough by default. Open these settings only when you need finer recognition, logistics, or reranking support.'}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="home-pill-nowrap inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] leading-none text-slate-200">
                {hasEnabledAnalysisEnhancement
                  ? isZh
                    ? `已启用 ${enabledEnhancementCount} 项`
                    : `${enabledEnhancementCount} enabled`
                  : isZh
                    ? '仅基础分析'
                    : 'Core only'}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {([
              { key: 'multimodal', label: isZh ? '多模态识别' : 'Multimodal recognition' },
              { key: 'collaborativeFiltering', label: isZh ? '协同过滤重排' : 'Collaborative reranking' },
              { key: 'logistics', label: isZh ? '物流与清关估算' : 'Logistics estimate' },
              { key: 'knowledgeGraph', label: isZh ? '知识图谱打分' : 'Knowledge graph scoring' },
              { key: 'wideDeep', label: isZh ? 'Wide & Deep 排序' : 'Wide & Deep reranking' },
            ] as Array<{ key: keyof EnhancementSettings; label: string }>).map(option =>
              analysisEnhancementSettings[option.key] ? (
                <span key={option.key} className={homeControl.pill}>
                  {option.label}
                </span>
              ) : null,
            )}

            <button
              type="button"
              onClick={() => setShowAdvancedModules(current => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/[0.06]"
            >
              <SlidersHorizontal size={14} />
              {showAdvancedModules
                ? isZh
                  ? '收起高级设置'
                  : 'Hide advanced settings'
                : isZh
                  ? '展开高级设置'
                  : 'Show advanced settings'}
            </button>
          </div>

          {showAdvancedModules && (
            <div className="mt-3 space-y-3">
              <div className="grid gap-2.5 md:grid-cols-2">
                {([
                  { key: 'multimodal', label: isZh ? '多模态识别' : 'Multimodal recognition' },
                  { key: 'collaborativeFiltering', label: isZh ? '协同过滤重排' : 'Collaborative reranking' },
                  { key: 'logistics', label: isZh ? '物流与清关估算' : 'Logistics estimate' },
                  { key: 'knowledgeGraph', label: isZh ? '知识图谱打分' : 'Knowledge graph scoring' },
                  { key: 'wideDeep', label: isZh ? 'Wide & Deep 排序' : 'Wide & Deep reranking' },
                ] as Array<{ key: keyof EnhancementSettings; label: string }>).map(option => (
                  <label
                    key={option.key}
                    className="flex min-h-[2.9rem] cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-200 transition-colors hover:border-white/16"
                  >
                    <span className="leading-5">{option.label}</span>
                    <input
                      type="checkbox"
                      checked={analysisEnhancementSettings[option.key]}
                      onChange={event => onEnhancementSettingChange(option.key, event.target.checked)}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-950 text-[#e7d2af] accent-[#e7d2af]"
                    />
                  </label>
                ))}
              </div>

              {analysisEnhancementSettings.logistics && (
                <div className={`p-3.5 ${homeSurface.quiet}`}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{isZh ? '物流出发地' : 'Shipping origin'}</p>
                  <select
                    value={enhancementOriginCountry}
                    onChange={event => onEnhancementOriginCountryChange(event.target.value)}
                    className={`${homeControl.input} mt-2`}
                  >
                    {enhancementOriginOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-400">
                    {isZh
                      ? '主流程中的物流估算会按“发货地 → 目标国家”计算；详细报价仍可在下方物流助手继续核算。'
                      : 'The main analysis estimates shipping from the selected origin to the target country; use the logistics assistant below for a more detailed quote.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {canAnalyze && !hasAnalysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-2xl p-3.5 sm:p-4 ${homeSurface.inset}`}>
            <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              <Sparkles size={14} />
              {locale === 'zh' ? '分析准备清单' : 'Analysis Checklist'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#081526]/78 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '礼物信息' : 'Gift info'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84 sm:max-w-[60%]">
                  {recognition ? (locale === 'zh' ? recognition.itemZh : recognition.itemEn) : giftName || (locale === 'zh' ? '已输入' : 'Entered')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#081526]/78 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '目标国家' : 'Target country'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84">{getCountryName(selectedCountry, locale)}</span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#081526]/78 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '目标群体' : 'Audience'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84">{selectedAudienceLabel}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className={`rounded-2xl px-4 py-3.5 ${homeSurface.inset}`}>
          <p className="text-sm text-gray-300">
            {hasAnalysis
              ? locale === 'zh'
                ? '分析已完成。结果已在下方更新，可向下查看详细内容。'
                : 'Analysis completed. Results are updated below. Scroll down for details.'
              : !selectedCountry
                ? locale === 'zh'
                  ? '请先选择目标国家'
                  : 'Please select a country first'
                : !isAudienceReady
                  ? locale === 'zh'
                    ? '请补充目标群体描述后再分析'
                    : 'Add audience profile details before analyzing'
                  : recognition
                    ? locale === 'zh'
                      ? '准备就绪，点击分析'
                      : 'Ready to analyze'
                    : hasGiftInput || selectedFile
                      ? locale === 'zh'
                        ? '已输入礼物信息，点击开始分析将自动补全识别'
                        : 'Gift info entered. Analyze will auto-complete recognition first.'
                      : locale === 'zh'
                        ? '请先完成第一步'
                        : 'Please complete step 1 first'}
          </p>
          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className={`mt-3 w-full rounded-full py-3 font-semibold transition-all ${
              isAnalyzing
                ? 'bg-slate-700/70 text-slate-300'
                : !canAnalyze
                  ? 'cursor-not-allowed border border-slate-200/10 bg-slate-700 text-slate-400'
                  : homeButton.primary
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={16} className="mr-2 inline animate-spin" />
                {locale === 'zh' ? `分析中... ${analyzingElapsedSeconds}s` : `Analyzing... ${analyzingElapsedSeconds}s`}
              </>
            ) : (
              <>
                <Zap size={16} className="mr-2 inline" />
                {hasAnalysis ? (locale === 'zh' ? '重新分析' : 'Analyze again') : t('analysis.analyze')}
              </>
            )}
          </Button>
        </div>

        {hasAnalysis && !isAnalyzing && (
          <div className="rounded-xl border border-[#e7d2af]/20 bg-[#e7d2af]/8 px-3 py-2 text-xs text-[#f6e5c8]">
            {locale === 'zh' ? '分析成功，向下查看风险评估与建议。' : 'Analysis succeeded. Scroll down to view risk assessment and suggestions.'}
          </div>
        )}
      </div>
    </motion.div>
  )
}
