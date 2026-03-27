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

const enhancementMeta = {
  multimodal: {
    labelZh: '视觉细读',
    labelEn: 'Visual verification',
    descZh: '补充图像中的材质、包装和视觉细节，让对象判断更稳。',
    descEn: 'Adds visual detail on material, packaging, and form for a steadier object reading.',
  },
  collaborativeFiltering: {
    labelZh: '替代方向重排',
    labelEn: 'Alternative reranking',
    descZh: '重新排序更合适的替代方案，减少直觉型推荐。',
    descEn: 'Reranks alternatives so recommendations feel less arbitrary and more context-aware.',
  },
  logistics: {
    labelZh: '送达预演',
    labelEn: 'Delivery rehearsal',
    descZh: '补充运输成本、时效与目的地限制，让结果更接近真实送达场景。',
    descEn: 'Adds cost, timing, and destination constraints to bring the report closer to a real shipment.',
  },
  wideDeep: {
    labelZh: '关系深描',
    labelEn: 'Relationship depth scan',
    descZh: '扩展关系相似案例，增强礼物与对象之间的匹配判断。',
    descEn: 'Expands similar relationship patterns to sharpen the match between gift and recipient.',
  },
  knowledgeGraph: {
    labelZh: '文化语义联想',
    labelEn: 'Cultural semantic memory',
    descZh: '联动更广泛的文化符号与礼仪线索，提升语境判断的细腻度。',
    descEn: 'Connects wider cultural symbols and etiquette cues for a finer context reading.',
  },
} satisfies Record<keyof EnhancementSettings, { labelZh: string; labelEn: string; descZh: string; descEn: string }>

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

  const readinessChecklist = [
    {
      label: isZh ? '礼物对象稿' : 'Object sheet',
      done: Boolean(recognition || hasGiftInput || selectedFile),
      value: recognition ? (isZh ? recognition.itemZh : recognition.itemEn) : giftName || (isZh ? '已准备' : 'Ready'),
    },
    {
      label: isZh ? '目的地国家' : 'Destination',
      done: Boolean(selectedCountry),
      value: selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '待补充' : 'Pending',
    },
    {
      label: isZh ? '关系对象' : 'Recipient',
      done: isAudienceReady,
      value: selectedAudienceLabel,
    },
    {
      label: isZh ? '场景脚本' : 'Scene script',
      done: Boolean(activeSceneTemplate),
      value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '未设置' : 'Unset',
    },
  ]

  const activeEnhancements = (Object.entries(analysisEnhancementSettings) as Array<[keyof EnhancementSettings, boolean]>)
    .filter(([, enabled]) => enabled)
    .map(([key]) => enhancementMeta[key])

  const reportItems = isZh
    ? ['总体结论与风险级别', '文化误读与礼仪风险', '更合适的替代方向', '包装、卡片与送达建议']
    : ['Overall conclusion and risk level', 'Cultural misreadings and etiquette risks', 'More suitable alternative directions', 'Packaging, card, and delivery guidance']

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-8 overflow-hidden xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
    >
      <div className="grid min-h-0 gap-5 xl:grid-rows-[auto_minmax(0,1fr)_auto]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Readiness review' : 'Readiness review'}</p>
          <h3 className="mt-4 max-w-[29rem] text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
            {isZh ? '先确认，这份心意已经具备被判断的条件。' : 'First confirm the gesture is ready to be judged.'}
          </h3>
          <p className="mt-4 max-w-[31rem] text-sm leading-8 text-[#69707d]">
            {isZh
              ? '真正高级的判断，不靠堆选项，而靠礼物、对象、场景与目的地是否已经足够清楚。'
              : 'A refined judgment depends less on piled-up options and more on whether the gift, recipient, scene, and destination are already clear enough.'}
          </p>
        </div>

        <div className="rounded-[2.8rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,240,234,0.9))] p-6 shadow-[0_34px_82px_-56px_rgba(15,23,42,0.16)] sm:p-8">
          <div className="space-y-5">
            {readinessChecklist.map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4 border-t border-black/8 pt-5 first:border-t-0 first:pt-0">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1d1a17]">{item.label}</p>
                    <p className="mt-1 text-xs leading-6 text-[#98a2b3]">{item.value}</p>
                  </div>
                </div>
                <span className={`pt-1 text-[10px] uppercase tracking-[0.16em] ${item.done ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {item.done ? (isZh ? '已就绪' : 'Ready') : isZh ? '待补充' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/8 pt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '终稿将包含' : 'The dossier will include'}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {reportItems.map(item => (
              <p key={item} className="text-sm leading-7 text-[#667085]">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-0 overflow-auto pr-1">
        <div className="border-b border-black/8 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[36rem]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Judgment layers' : 'Judgment layers'}</p>
              <h3 className="mt-4 text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
                {isZh ? '基础判断先完成，增强图层只在必要时打开。' : 'Complete the core judgment first. Open deeper layers only when needed.'}
              </h3>
              <p className="mt-4 text-sm leading-8 text-[#69707d]">
                {isZh
                  ? '这一步不是技术配置，而是在决定这份报告是否需要更深的视觉、物流或替代方向信息。'
                  : 'This step is not a technical console, but a decision about whether the dossier needs deeper visual, logistics, or alternative-direction information.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(current => !current)}
              className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-xs uppercase tracking-[0.14em] text-[#556070] transition duration-500 hover:text-[#1d1a17]"
            >
              <SlidersHorizontal size={14} />
              {showAdvanced ? (isZh ? '收起增强图层' : 'Hide deeper layers') : isZh ? '展开增强图层' : 'Open deeper layers'}
            </button>
          </div>
        </div>

        <div className="space-y-8 pt-6">
          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '当前报告范围' : 'Current report scope'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeEnhancements.map(item => (
                <span key={item.labelEn} className="rounded-full border border-black/8 bg-white/78 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#6a7280]">
                  {isZh ? item.labelZh : item.labelEn}
                </span>
              ))}
              {!hasEnabledAnalysisEnhancement && (
                <span className="rounded-full border border-black/8 bg-white/78 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#6a7280]">
                  {isZh ? '仅基础判断' : 'Editorial core only'}
                </span>
              )}
            </div>
          </article>

          {showAdvanced && (
            <article className="rounded-[2.4rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,242,236,0.9))] p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.14)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '增强图层' : 'Deeper layers'}</p>
              <div className="mt-4 space-y-5">
                {(Object.keys(analysisEnhancementSettings) as Array<keyof EnhancementSettings>).map(key => {
                  const item = enhancementMeta[key]
                  return (
                    <label key={key} className="flex items-start justify-between gap-4 border-t border-black/8 pt-5 first:border-t-0 first:pt-0">
                      <div className="max-w-[28rem]">
                        <p className="text-sm font-medium text-[#1d1a17]">{isZh ? item.labelZh : item.labelEn}</p>
                        <p className="mt-2 text-sm leading-7 text-[#69707d]">{isZh ? item.descZh : item.descEn}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={analysisEnhancementSettings[key]}
                        onChange={event => onEnhancementSettingChange(key, event.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#6175ca]"
                      />
                    </label>
                  )
                })}

                {analysisEnhancementSettings.logistics && (
                  <div className="border-t border-black/8 pt-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? '送达出发地' : 'Shipping origin'}</p>
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
            </article>
          )}

          <article className="border-t border-black/8 pt-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Generate dossier' : 'Generate dossier'}</p>
            <p className="mt-4 max-w-[30rem] text-[1.4rem] font-serif leading-tight text-[#1d1a17]">
              {isZh ? '系统会把文化风险、关系语气、包装建议与替代方向整理成终稿。' : 'The system will compose cultural risk, relational tone, packaging guidance, and alternative directions into one authored dossier.'}
            </p>

            <Button
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="mt-8 w-full rounded-full bg-[#5569bc] py-4 text-sm uppercase tracking-[0.14em] text-white shadow-[0_22px_44px_-26px_rgba(85,105,188,0.44)] transition hover:-translate-y-0.5 hover:bg-[#4b5fae] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={16} className="mr-2 inline" />
              {isAnalyzing
                ? isZh
                  ? `判断生成中 ${analyzingElapsedSeconds}s`
                  : `Composing ${analyzingElapsedSeconds}s`
                : hasAnalysis
                  ? isZh
                    ? '重新编排这份终稿'
                    : 'Compose the dossier again'
                  : isZh
                    ? '生成礼赠终稿'
                    : 'Compose the gifting dossier'}
            </Button>

            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">
              {isZh ? '文化、关系、场景与措辞将在这里汇合。' : 'Culture, relationship, scene, and wording converge here.'}
            </p>
          </article>
        </div>
      </div>
    </motion.section>
  )
}
