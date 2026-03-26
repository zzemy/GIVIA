'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton, homeControl } from '@/components/gifting/home/home-design-tokens'
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
      label: isZh ? '礼物信息' : 'Gift signal',
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
      label: isZh ? '场景' : 'Scene',
      done: Boolean(activeSceneTemplate),
      value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '未设置' : 'Unset',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.3rem] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(249,245,239,0.94))] p-6 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="rounded-[1.9rem] border border-black/6 bg-white/70 p-5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Judgment room' : 'Judgment room'}</p>
        <p className="mt-3 text-[1.85rem] font-serif leading-tight text-[#1c1a17]">
          {isZh ? '现在不是再填表，而是做最后的文化取舍。' : 'This is no longer about filling fields. It is about making the final cultural call.'}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[#667085]">
          {isZh
            ? '先确认礼物、国家和对象是否完整，再决定是否引入更深层的增强模块。'
            : 'Confirm that the gift, country, and recipient frame are complete, then decide whether deeper enhancement modules are truly necessary.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#fcfaf7,#f7f1e9)] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Readiness checklist' : 'Readiness checklist'}</p>
          <div className="mt-4 space-y-3">
            {checklist.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-black/6 bg-white/84 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-1 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1c1a17]">{item.label}</p>
                    <p className="text-xs text-[#98a2b3]">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.9rem] border border-black/6 bg-white/76 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Calibration modules' : 'Calibration modules'}</p>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  {isZh
                    ? '默认判断通常已经足够。只有需要更深层识别、物流估算或重排时，再开启增强模块。'
                    : 'The default analysis is usually enough. Turn on deeper modules only when you truly need reranking, logistics, or richer recognition.'}
                </p>
              </div>
              <button type="button" onClick={() => setShowAdvanced(current => !current)} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                <SlidersHorizontal size={14} />
                {showAdvanced ? (isZh ? '收起设置' : 'Hide settings') : isZh ? '展开设置' : 'Show settings'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.entries(analysisEnhancementSettings) as Array<[keyof EnhancementSettings, boolean]>).map(([key, enabled]) =>
                enabled ? (
                  <span key={key} className="rounded-full border border-[#efe3ce] bg-[#fff8ef] px-4 py-2 text-xs text-[#9b6b20]">
                    {key}
                  </span>
                ) : null,
              )}
              {!hasEnabledAnalysisEnhancement && (
                <span className="rounded-full border border-black/8 bg-[#f8f6f2] px-3 py-1 text-xs text-[#667085]">
                  {isZh ? '仅基础分析' : 'Core analysis only'}
                </span>
              )}
            </div>

            {showAdvanced && (
              <div className="mt-5 space-y-3">
                {(Object.keys(analysisEnhancementSettings) as Array<keyof EnhancementSettings>).map(key => (
                  <label key={key} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-black/6 bg-[#fcfaf7] px-4 py-4 text-sm text-[#1c1a17]">
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
                  <div className="rounded-[1.2rem] border border-black/6 bg-[#fcfaf7] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '物流出发地' : 'Shipping origin'}</p>
                    <select value={enhancementOriginCountry} onChange={event => onEnhancementOriginCountryChange(event.target.value)} className={`${homeControl.input} mt-3`}>
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

          <div className="rounded-[1.95rem] border border-[#eadfcb] bg-[linear-gradient(180deg,#fffdf8,#fff4e3)] p-5 shadow-[0_22px_46px_-32px_rgba(184,129,45,0.26)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9b6b20]">{isZh ? 'Editorial decision' : 'Editorial decision'}</p>
            <p className="mt-3 text-base leading-8 text-[#5f4b2c]">
              {isZh
                ? '系统将输出文化风险、包装方向、问候语语气，以及更稳妥的替代礼物。'
                : 'The system will produce cultural risk notes, packaging direction, greeting tone, and safer alternative gifts.'}
            </p>

            <Button onClick={onAnalyze} disabled={!canAnalyze || isAnalyzing} className={`mt-5 w-full rounded-full py-4 text-sm font-semibold ${homeButton.primary}`}>
              <Sparkles size={16} className="mr-2 inline" />
              {isAnalyzing
                ? isZh
                  ? `分析中... ${analyzingElapsedSeconds}s`
                  : `Analyzing... ${analyzingElapsedSeconds}s`
                : hasAnalysis
                  ? isZh
                    ? '重新分析'
                    : 'Analyze again'
                  : isZh
                    ? '开始文化分析'
                    : 'Start cultural analysis'}
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
