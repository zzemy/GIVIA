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
  'w-full border-0 border-b border-black/10 bg-transparent px-0 py-3 text-[15px] leading-7 text-[#1d1a17] transition focus:border-[#6175ca]/45 focus:outline-none focus:ring-0'

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
      label: isZh ? '礼物线索' : 'Gift signal',
      done: Boolean(recognition || hasGiftInput || selectedFile),
      value: recognition ? (isZh ? recognition.itemZh : recognition.itemEn) : giftName || (isZh ? '已准备' : 'Ready'),
    },
    {
      label: isZh ? '目的地' : 'Destination',
      done: Boolean(selectedCountry),
      value: selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '待补充' : 'Pending',
    },
    {
      label: isZh ? '对象关系' : 'Recipient',
      done: isAudienceReady,
      value: selectedAudienceLabel,
    },
    {
      label: isZh ? '场景脚本' : 'Scene',
      done: Boolean(activeSceneTemplate),
      value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '未设置' : 'Unset',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-8 overflow-hidden xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"
    >
      <div className="flex min-h-0 flex-col overflow-hidden border-r border-black/6 pr-0 xl:pr-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Editorial readiness' : 'Editorial readiness'}</p>
        <h3 className="mt-4 max-w-[31rem] text-[2.6rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
          {isZh ? '判断之前，先确认这份心意是否已具备被阅读的条件。' : 'Before judgment, confirm the gesture is ready to be read.'}
        </h3>
        <p className="mt-4 text-sm leading-8 text-[#69707d]">
          {isZh
            ? '这一章会确认对象、关系、国家与场景是否已经成立，再把它们写进最终判断。'
            : 'This chapter confirms whether the object, relationship, destination, and scene are ready to be composed into the final reading.'}
        </p>

        <div className="mt-6 rounded-[2.4rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,241,235,0.92))] p-5 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.14)]">
          <div className="grid min-h-0 gap-1 overflow-auto">
            {checklist.map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4 border-b border-black/8 py-4 last:border-b-0 last:pb-0 first:pt-0">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1d1a17]">{item.label}</p>
                    <p className="mt-1 text-xs leading-6 text-[#98a2b3]">{item.value}</p>
                  </div>
                </div>
                <span className={`px-0 py-1 text-[10px] uppercase tracking-[0.16em] ${item.done ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {item.done ? (isZh ? '已就绪' : 'Ready') : isZh ? '待补充' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-[22rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
          {isZh ? '真正高级的判断，不靠堆选项，而靠信息是否已经足够成熟。' : 'A refined judgment depends less on toggles than on the maturity of the information.'}
        </p>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden pt-1 xl:pl-2">
        <div className="border-b border-black/8 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[36rem]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? '判断图层' : 'Judgment layers'}</p>
              <h3 className="mt-4 max-w-[35rem] text-[2.7rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
                {isZh ? '基础判断通常已经足够，增强模块只在必要时打开。' : 'Core judgment is usually enough. Enhancement modules open only when necessary.'}
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#69707d]">
                {isZh
                  ? '如果你确实需要更深层识别、物流估算或替代方案重排，再谨慎开启这些模块，让判断保持得体而清晰。'
                  : 'If deeper recognition, logistics estimation, or reranking is genuinely needed, open these modules with restraint so the judgment stays tactful and clear.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(current => !current)}
              className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-xs uppercase tracking-[0.14em] text-[#556070] transition duration-500 hover:text-[#1d1a17]"
            >
              <SlidersHorizontal size={14} />
              {showAdvanced ? (isZh ? '收起增强模块' : 'Close modules') : isZh ? '展开增强模块' : 'Open modules'}
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-8 overflow-hidden pt-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <div className="space-y-5 overflow-auto pr-1">
            <div className="border-b border-black/8 pb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '当前判断范围' : 'Current reading scope'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.entries(analysisEnhancementSettings) as Array<[keyof EnhancementSettings, boolean]>).map(([key, enabled]) =>
                  enabled ? (
                    <span key={key} className="rounded-full border border-[#e8dcce] bg-white/84 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#7a6856]">
                      {key}
                    </span>
                  ) : null,
                )}
                {!hasEnabledAnalysisEnhancement && (
                  <span className="rounded-full border border-black/8 bg-white/84 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#667085]">
                    {isZh ? '仅基础判断' : 'Editorial core only'}
                  </span>
                )}
              </div>
            </div>

            {showAdvanced && (
              <div className="rounded-[2.2rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,242,236,0.9))] p-5 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.14)]">
                <div className="space-y-3">
                  {(Object.keys(analysisEnhancementSettings) as Array<keyof EnhancementSettings>).map(key => (
                    <label key={key} className="flex items-center justify-between gap-3 border-b border-black/8 pb-4 text-sm text-[#1d1a17] last:border-b-0 last:pb-0">
                      <span className="font-medium">{key}</span>
                      <input
                        type="checkbox"
                        checked={analysisEnhancementSettings[key]}
                        onChange={event => onEnhancementSettingChange(key, event.target.checked)}
                        className="h-4 w-4 accent-[#6175ca]"
                      />
                    </label>
                  ))}

                  {analysisEnhancementSettings.logistics && (
                    <div className="border-t border-black/8 pt-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '物流出发地' : 'Shipping origin'}</p>
                      <select value={enhancementOriginCountry} onChange={event => onEnhancementOriginCountryChange(event.target.value)} className={`${inputClassName} mt-2 appearance-none`}>
                        {enhancementOriginOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-col justify-between border-l border-black/8 pl-0 xl:pl-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Editorial decision' : 'Editorial decision'}</p>
              <p className="mt-4 text-[1.62rem] font-serif leading-tight text-[#1d1a17]">
                {isZh ? '系统将把文化风险、表达语气、包装方向与替代提案写成同一份结论。' : 'The system will compose cultural risk, wording, packaging direction, and alternatives into one coherent conclusion.'}
              </p>
              <p className="mt-4 max-w-[28rem] text-sm leading-8 text-[#69707d]">
                {isZh ? '这里会生成一份更适合真正送达场景的礼赠判断。' : 'This section generates a gifting judgment shaped for an actual moment of arrival.'}
              </p>
            </div>

            <div className="mt-8 border-t border-black/8 pt-6">
              <Button
                onClick={onAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="w-full rounded-full bg-[#5569bc] py-4 text-sm uppercase tracking-[0.14em] text-white shadow-[0_22px_44px_-26px_rgba(85,105,188,0.44)] transition hover:-translate-y-0.5 hover:bg-[#4b5fae] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles size={16} className="mr-2 inline" />
                {isAnalyzing
                  ? isZh
                    ? `判断生成中 ${analyzingElapsedSeconds}s`
                    : `Composing ${analyzingElapsedSeconds}s`
                  : hasAnalysis
                    ? isZh
                      ? '重新编排这份结论'
                      : 'Compose the judgment again'
                    : isZh
                      ? '生成礼赠判断'
                      : 'Compose the gifting judgment'}
              </Button>

              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
                {isZh ? '文化、关系、场景与措辞将在这里汇合。' : 'Culture, relationship, scene, and wording converge here.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
