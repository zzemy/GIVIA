'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { withBasePath } from '@/lib/asset-path'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/p0-types'
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
  const statTileClassName = 'rounded-xl border border-slate-200/10 bg-slate-950/24 px-3 py-2.5'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -2, scale: 1.004 }}
      className="rounded-2xl border border-cyan-200/24 bg-gradient-to-br from-[#162b46]/92 to-[#0f2037]/88 p-4 shadow-[0_14px_36px_rgba(3,12,28,0.34)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/40 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between border-b border-slate-400/15 pb-4">
        <div>
          <h2 className="mb-1.5 text-lg font-bold sm:mb-2 sm:text-xl">{t('analysis.title')}</h2>
          <p className="text-xs text-gray-400 sm:text-sm">{t('analysis.description')}</p>
        </div>
        <Image src={withBasePath('/brand/step-analysis.svg')} alt="analysis step" width={36} height={36} />
      </div>

      <div className="grid gap-4 sm:gap-5">
        <div className="rounded-2xl border border-slate-200/12 bg-slate-900/34 p-3.5 sm:p-4">
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

        <div className="rounded-2xl border border-cyan-200/14 bg-cyan-400/5 p-3.5 sm:p-4">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-100/80">P1 / P2</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">
                {isZh ? '增强分析模块' : 'Enhanced analysis modules'}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                {isZh
                  ? '把多模态识别、协同过滤、物流估算、知识图谱和 Wide & Deep 排序接到同一次分析里。'
                  : 'Run multimodal recognition, collaborative filtering, logistics, knowledge graph, and Wide & Deep reranking in the same analysis.'}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full border border-cyan-200/18 bg-cyan-300/10 px-3 py-1 text-[11px] leading-none text-cyan-100">
              {hasEnabledAnalysisEnhancement ? (isZh ? '已启用增强' : 'Enhancements on') : isZh ? '仅基础分析' : 'P0 only'}
            </span>
          </div>

          <div className="mt-3 grid gap-2.5 md:grid-cols-2">
            {([
              { key: 'multimodal', label: isZh ? '多模态识别' : 'Multimodal recognition' },
              { key: 'collaborativeFiltering', label: isZh ? '协同过滤重排' : 'Collaborative reranking' },
              { key: 'logistics', label: isZh ? '物流与清关估算' : 'Logistics estimate' },
              { key: 'knowledgeGraph', label: isZh ? '知识图谱打分' : 'Knowledge graph scoring' },
              { key: 'wideDeep', label: isZh ? 'Wide & Deep 排序' : 'Wide & Deep reranking' },
            ] as Array<{ key: keyof EnhancementSettings; label: string }>).map(option => (
              <label
                key={option.key}
                className="flex min-h-[2.9rem] cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/10 bg-slate-900/38 px-3 py-2.5 text-sm text-slate-200 transition-colors hover:border-cyan-200/24"
              >
                <span className="leading-5">{option.label}</span>
                <input
                  type="checkbox"
                  checked={analysisEnhancementSettings[option.key]}
                  onChange={event => onEnhancementSettingChange(option.key, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-500 bg-slate-950 text-cyan-300 accent-cyan-300"
                />
              </label>
            ))}
          </div>

          {analysisEnhancementSettings.logistics && (
            <div className="mt-3 rounded-xl border border-slate-200/10 bg-slate-950/35 p-3.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{isZh ? '物流出发地' : 'Shipping origin'}</p>
              <select
                value={enhancementOriginCountry}
                onChange={event => onEnhancementOriginCountryChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-cyan-200/18 bg-[#0b1c31] px-3 py-2 text-sm text-slate-100 transition focus:border-cyan-200/45 focus:outline-none"
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

        {canAnalyze && !hasAnalysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-200/12 bg-slate-800/24 p-3.5 sm:p-4">
            <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              <Sparkles size={14} />
              {locale === 'zh' ? '分析准备清单' : 'Analysis Checklist'}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/42 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '礼物信息' : 'Gift info'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84 sm:max-w-[60%]">
                  {recognition ? (locale === 'zh' ? recognition.itemZh : recognition.itemEn) : giftName || (locale === 'zh' ? '已输入' : 'Entered')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/42 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '目标国家' : 'Target country'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84">{getCountryName(selectedCountry, locale)}</span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/42 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{locale === 'zh' ? '目标群体' : 'Audience'}</span>
                </div>
                <span className="truncate text-right text-xs text-slate-300/84">{selectedAudienceLabel}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl border border-slate-200/12 bg-slate-700/30 px-4 py-3.5">
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
            className={`mt-3 w-full rounded-xl py-2.5 font-semibold transition-all ${
              isAnalyzing
                ? 'bg-slate-700/70 text-slate-300'
                : !canAnalyze
                  ? 'cursor-not-allowed border border-slate-200/10 bg-slate-700 text-slate-400'
                  : 'border border-cyan-200/45 bg-cyan-300/14 text-cyan-100 hover:bg-cyan-300/24'
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
          <div className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
            {locale === 'zh' ? '分析成功，向下查看风险评估与建议。' : 'Analysis succeeded. Scroll down to view risk assessment and suggestions.'}
          </div>
        )}
      </div>
    </motion.div>
  )
}
