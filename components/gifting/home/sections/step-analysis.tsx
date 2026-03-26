'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CheckCircle2, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton, homeControl } from '@/components/gifting/home/home-design-tokens'
import { withBasePath } from '@/lib/asset-path'
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
      className="rounded-[2rem] border border-black/6 bg-white/92 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-black/6 pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? 'STEP 03' : 'STEP 03'}</p>
          <h2 className="mt-2 text-[1.9rem] font-serif leading-tight text-[#1c1a17]">
            {isZh ? '第三步：获取文化分析' : 'Step 3: Generate cultural analysis'}
          </h2>
          <p className="mt-2 max-w-[42rem] text-sm leading-7 text-[#667085]">
            {isZh
              ? '最后一步会综合礼物属性、国家语境、对象画像和高级模块，为你输出送礼风险与替代建议。'
              : 'The final step combines gift attributes, country context, recipient profile, and optional modules into a recommendation with risk guidance.'}
          </p>
        </div>
        <Image src={withBasePath('/brand/step-analysis.svg')} alt="Analysis step" width={42} height={42} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[1.5rem] border border-black/6 bg-[#fbf7f2] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '分析准备清单' : 'Readiness checklist'}</p>
          <div className="mt-4 space-y-3">
            {checklist.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-[1rem] bg-white/88 px-4 py-3">
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
          <div className="rounded-[1.5rem] border border-black/6 bg-white/88 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '高级判断补充项' : 'Advanced add-ons'}</p>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  {isZh
                    ? '默认分析已经可用。只有在你需要更深入识别、物流估算或重排判断时，再打开高级模块。'
                    : 'The default analysis is already sufficient. Turn on advanced modules only when you need deeper recognition, logistics, or reranking.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(current => !current)}
                className={`${homeButton.secondary} px-4 py-2 text-sm`}
              >
                <SlidersHorizontal size={14} />
                {showAdvanced ? (isZh ? '收起高级设置' : 'Hide advanced settings') : isZh ? '展开高级设置' : 'Show advanced settings'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.entries(analysisEnhancementSettings) as Array<[keyof EnhancementSettings, boolean]>).map(([key, enabled]) =>
                enabled ? (
                  <span key={key} className="rounded-full border border-[#efe3ce] bg-[#fff8ef] px-3 py-1 text-xs text-[#9b6b20]">
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
              <div className="mt-4 space-y-3">
                {(Object.keys(analysisEnhancementSettings) as Array<keyof EnhancementSettings>).map(key => (
                  <label key={key} className="flex items-center justify-between gap-3 rounded-[1rem] border border-black/6 bg-[#fcfaf7] px-4 py-3 text-sm text-[#1c1a17]">
                    <span>{key}</span>
                    <input
                      type="checkbox"
                      checked={analysisEnhancementSettings[key]}
                      onChange={event => onEnhancementSettingChange(key, event.target.checked)}
                      className="h-4 w-4 accent-[#b8812d]"
                    />
                  </label>
                ))}

                {analysisEnhancementSettings.logistics && (
                  <div className="rounded-[1rem] border border-black/6 bg-[#fcfaf7] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '物流出发地' : 'Shipping origin'}</p>
                    <select
                      value={enhancementOriginCountry}
                      onChange={event => onEnhancementOriginCountryChange(event.target.value)}
                      className={`${homeControl.input} mt-3`}
                    >
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

          <div className="rounded-[1.5rem] border border-[#eadfcb] bg-[linear-gradient(180deg,#fffdf8,#fff7eb)] p-5 shadow-[0_18px_44px_-30px_rgba(184,129,45,0.32)]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#9b6b20]">{isZh ? '准备完成后' : 'When ready'}</p>
            <p className="mt-3 text-base leading-7 text-[#5f4b2c]">
              {isZh
                ? '系统会输出文化风险、包装建议、问候语语气和更稳妥的替代礼物。'
                : 'The system will return cultural risk notes, packaging guidance, greeting tone, and safer alternative gifts.'}
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
