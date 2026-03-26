'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { EnhancementSettings, Locale, RecognitionResult, SelectOption } from '@/components/gifting/home/types'

export interface StepAnalysisProps {
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

const inputClassName =
  'w-full rounded-[1.5rem] border border-black/7 bg-white/72 px-5 py-4 text-[15px] leading-7 text-[#1d1a17] placeholder:text-[#9aa1af] transition focus:border-[#5b72d1]/45 focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,114,209,0.08)]'

export function StepAnalysis({
  locale,
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
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const checklist = [
    {
      label: isZh ? '礼物语义' : 'Gift signal',
      done: Boolean(recognition || hasGiftInput || selectedFile),
      value: recognition ? (isZh ? recognition.itemZh : recognition.itemEn) : giftName || (isZh ? '已准备' : 'Ready'),
    },
    {
      label: isZh ? '目标国家' : 'Target country',
      done: Boolean(selectedCountry),
      value: selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '待选择' : 'Pending',
    },
    {
      label: isZh ? '目标对象' : 'Audience',
      done: isAudienceReady,
      value: selectedAudienceLabel,
    },
    {
      label: isZh ? '社会场景' : 'Scene',
      done: Boolean(activeSceneTemplate),
      value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '未设置' : 'Unset',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.6rem] border border-black/6 bg-[linear-gradient(155deg,rgba(255,255,255,0.96),rgba(249,245,239,0.94))] p-6 shadow-[0_36px_84px_-48px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="rounded-[2rem] border border-black/6 bg-white/66 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Editorial judgment room' : 'Editorial judgment room'}</p>
        <p className="mt-3 text-[1.95rem] font-serif leading-tight text-[#1d1a17]">
          {isZh ? '现在进入最后的文化判断与提案编排。' : 'Now the final cultural judgment and proposal composition begins.'}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[#69707d]">
          {isZh
            ? '这一章不再收集素材，而是确认信息是否成熟，再决定是否启用更深层增强模块。'
            : 'This chapter no longer collects raw material. It confirms readiness and decides whether deeper enhancement modules are truly needed.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="rounded-[2.15rem] border border-black/6 bg-[linear-gradient(180deg,#fcfaf7,#f7f0e8)] p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Readiness grid' : 'Readiness grid'}</p>
          <div className="mt-4 space-y-3">
            {checklist.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-black/6 bg-white/84 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-1.5 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1d1a17]">{item.label}</p>
                    <p className="text-xs text-[#98a2b3]">{item.value}</p>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${item.done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {item.done ? (isZh ? 'ready' : 'ready') : isZh ? 'pending' : 'pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-black/6 bg-white/74 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-[34rem]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Enhancement curation' : 'Enhancement curation'}</p>
                <p className="mt-2 text-sm leading-8 text-[#69707d]">
                  {isZh
                    ? '基础分析通常已经足够。只有当你需要更深层识别、物流估算或重排时，才值得开启增强。'
                    : 'Core analysis is usually enough. Turn on deeper modules only when richer recognition, logistics, or reranking is genuinely required.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(current => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-4 py-2.5 text-sm text-[#495161] shadow-[0_12px_28px_-24px_rgba(15,23,42,0.2)] transition hover:bg-white"
              >
                <SlidersHorizontal size={14} />
                {showAdvanced ? (isZh ? '收起增强' : 'Hide modules') : isZh ? '展开增强' : 'Show modules'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.entries(analysisEnhancementSettings) as Array<[keyof EnhancementSettings, boolean]>).map(([key, enabled]) =>
                enabled ? (
                  <span key={key} className="rounded-full border border-[#efe3ce] bg-[#fff8ef] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#9b6b20]">
                    {key}
                  </span>
                ) : null,
              )}
              {!hasEnabledAnalysisEnhancement && (
                <span className="rounded-full border border-black/8 bg-[#f8f6f2] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#667085]">
                  {isZh ? '仅基础分析' : 'Core analysis only'}
                </span>
              )}
            </div>

            {showAdvanced && (
              <div className="mt-5 space-y-3">
                {(Object.keys(analysisEnhancementSettings) as Array<keyof EnhancementSettings>).map(key => (
                  <label key={key} className="flex items-center justify-between gap-3 rounded-[1.3rem] border border-black/6 bg-[#fcfaf7] px-4 py-4 text-sm text-[#1d1a17]">
                    <span className="font-medium">{key}</span>
                    <input
                      type="checkbox"
                      checked={analysisEnhancementSettings[key]}
                      onChange={event => onEnhancementSettingChange(key, event.target.checked)}
                      className="h-4 w-4 accent-[#b8812d]"
                    />
                  </label>
                ))}

                {analysisEnhancementSettings.logistics && (
                  <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '物流出发地' : 'Shipping origin'}</p>
                    <select value={enhancementOriginCountry} onChange={event => onEnhancementOriginCountryChange(event.target.value)} className={`${inputClassName} mt-3 appearance-none`}>
                      {enhancementOriginOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2.15rem] border border-[#e8decd] bg-[linear-gradient(180deg,#fffdf8,#fff5e7)] p-5 shadow-[0_24px_50px_-36px_rgba(184,129,45,0.2)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b6b20]">{isZh ? 'Editorial decision' : 'Editorial decision'}</p>
            <p className="mt-3 text-base leading-8 text-[#5f4b2c]">
              {isZh
                ? '系统将编排文化风险、包装方向、问候语语气，以及更稳妥的替代礼物提案。'
                : 'The system will compose cultural risk, packaging direction, greeting tone, and safer alternative proposals.'}
            </p>

            <Button
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-[#5b72d1] via-[#4f65bd] to-[#4355a9] py-4 text-sm font-semibold text-white shadow-[0_20px_42px_-24px_rgba(91,114,209,0.48)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={16} className="mr-2 inline" />
              {isAnalyzing
                ? isZh
                  ? `分析中... ${analyzingElapsedSeconds}s`
                  : `Analyzing... ${analyzingElapsedSeconds}s`
                : hasAnalysis
                  ? isZh
                    ? '重新编排提案'
                    : 'Compose again'
                  : isZh
                    ? '生成文化提案'
                    : 'Generate the proposal'}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
