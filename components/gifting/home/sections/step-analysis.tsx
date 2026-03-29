'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, CheckCircle2, Network, Plane, Sparkles, Wand2 } from 'lucide-react'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { EnhancementSettings, Locale, RecognitionResult, SceneTemplateOption, SelectOption } from '@/components/gifting/home/types'

export interface StepAnalysisProps {
  onBack?: () => void
  locale: Locale
  t: (path: string) => string
  selectedCountry: string
  recognition: RecognitionResult | null
  hasGiftInput: boolean
  selectedFile: File | null
  selectedAudienceLabel: string
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  sceneTemplateOptions: SceneTemplateOption[]
  occasion: string
  targetProfile: string
  deliverySetting: 'private' | 'shared' | 'public'
  deliveryNarrative: string
  budgetRange: string
  budgetLabel: string
  formality: string
  formalityLabel: string
  ageBandLabel: string
  occupationLabel: string
  relationshipLabel: string
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
  onSceneTemplateChange: (value: string) => void
  onOccasionChange: (value: string) => void
  onTargetProfileChange: (value: string) => void
  onDeliverySettingChange: (value: 'private' | 'shared' | 'public') => void
  onDeliveryNarrativeChange: (value: string) => void
  onBudgetRangeChange: (value: string) => void
  onFormalityChange: (value: string) => void
  onAnalyze: () => void | Promise<void>
  accentClass?: string
  textAccent?: string
  themeBg?: string
}

const fieldClassName =
  'mt-2.5 w-full rounded-[1.15rem] border border-[rgba(74,63,51,0.12)] bg-[rgba(255,255,255,0.86)] px-4 py-3 text-sm text-[#201a16] transition placeholder:text-[#968f85] focus:border-[rgba(123,93,103,0.28)] focus:bg-white focus:outline-none focus:ring-0'

const selectClassName = `${fieldClassName} appearance-none bg-[rgba(255,255,255,0.82)]`

function getOptionLabel(options: SelectOption[], value: string): string {
  return options.find(option => option.value === value)?.label ?? value
}

function getDeliverySettingLabel(locale: Locale, value: 'private' | 'shared' | 'public'): string {
  const labels = {
    zh: {
      private: '私下递达',
      shared: '小范围共享',
      public: '公开场合',
    },
    en: {
      private: 'Private arrival',
      shared: 'Shared setting',
      public: 'Public setting',
    },
  }

  return labels[locale][value]
}

function buildArrivalDraft({
  isZh,
  countryName,
  audienceLabel,
  relationshipLabel,
  ageBandLabel,
  occupationLabel,
  sceneLabel,
  occasion,
  deliverySettingLabel,
  budgetLabel,
  formalityLabel,
  targetProfile,
  deliveryNarrative,
}: {
  isZh: boolean
  countryName: string
  audienceLabel: string
  relationshipLabel: string
  ageBandLabel: string
  occupationLabel: string
  sceneLabel: string
  occasion: string
  deliverySettingLabel: string
  budgetLabel: string
  formalityLabel: string
  targetProfile: string
  deliveryNarrative: string
}): string {
  if (isZh) {
    return [
      countryName ? `这份礼物将于 ${countryName} 的语境中，面向 ${audienceLabel} 这样的对象抵达。` : '礼物的目的地语境仍未完全落定。',
      `当前关系更接近 ${relationshipLabel}，人物侧写暂时落在 ${ageBandLabel}、${occupationLabel} 的轮廓上。`,
      `场景设定偏向 ${sceneLabel}，递达方式是 ${deliverySettingLabel}。`,
      occasion.trim() ? `你补充的关键时刻是：${occasion.trim()}` : '还缺一句准确的场合说明，用来判断这份礼物为何在此刻出现。',
      `预算语气为 ${budgetLabel}，表达分寸为 ${formalityLabel}。`,
      deliveryNarrative.trim()
        ? `你希望它抵达时呈现的方式是：${deliveryNarrative.trim()}`
        : targetProfile.trim()
          ? `人物侧写里已有补充：${targetProfile.trim()}`
          : '再补一条关于递送方式或气氛的描述，AI 才能真正判断这份礼物该如何落地。',
    ].join('')
  }

  return [
    countryName ? `The gesture is being composed for reception in ${countryName}, addressed to ${audienceLabel}.` : 'The destination context is still incomplete.',
    `The relationship reads as ${relationshipLabel}, with the recipient profile leaning toward ${ageBandLabel} and ${occupationLabel}.`,
    `The working scene is ${sceneLabel}, and the arrival mode is ${deliverySettingLabel}.`,
    occasion.trim()
      ? `The defining moment is described as: ${occasion.trim()}`
      : 'The exact occasion is still missing, which makes it harder to judge why the gift appears at this moment.',
    `The register sits at ${budgetLabel}, with a ${formalityLabel} tone.`,
    deliveryNarrative.trim()
      ? `Desired arrival feeling: ${deliveryNarrative.trim()}`
      : targetProfile.trim()
        ? `Recipient note carried forward: ${targetProfile.trim()}`
        : 'Add one line about the intended manner of arrival so the AI can reason about proportional tone.',
  ].join(' ')
}

function buildProportionCheck({
  isZh,
  deliverySetting,
  budgetRange,
  formality,
  selectedAudienceLabel,
}: {
  isZh: boolean
  deliverySetting: 'private' | 'shared' | 'public'
  budgetRange: string
  formality: string
  selectedAudienceLabel: string
}): string[] {
  const notes: string[] = []

  if (deliverySetting === 'public' && budgetRange === 'high') {
    notes.push(
      isZh
        ? '高预算加公开递达会显著放大礼物的社会意义，要确保这不是在替对方制造压力。'
        : 'A high-budget gift delivered publicly magnifies its social meaning. Make sure it does not place pressure on the recipient.',
    )
  }

  if (deliverySetting === 'private' && formality === 'formal') {
    notes.push(
      isZh
        ? '私下递达配高度正式语气时，可能会显得过冷；如果关系并不疏远，可以在措辞里保留一点温度。'
        : 'A private delivery with a highly formal tone can read colder than intended; leave some warmth in the wording if the relationship allows it.',
    )
  }

  if (selectedAudienceLabel) {
    notes.push(
      isZh
        ? `当前对象是 ${selectedAudienceLabel}，送达方式要让体面和亲近之间保持可被接受的比例。`
        : `The recipient reads as ${selectedAudienceLabel}, so the arrival should balance dignity and closeness in a proportion that still feels natural.`,
    )
  }

  return notes
}

function buildRiskWatch({
  isZh,
  occasion,
  deliveryNarrative,
  selectedCountry,
}: {
  isZh: boolean
  occasion: string
  deliveryNarrative: string
  selectedCountry: string
}): string[] {
  const notes: string[] = []

  if (!occasion.trim()) {
    notes.push(
      isZh
        ? '还没有写清送礼发生的时刻，AI 目前无法判断这是祝贺、建立关系、感谢还是修复气氛。'
        : 'The occasion is still unclear, so the AI cannot yet judge whether this is celebration, relationship-building, gratitude, or repair.',
    )
  }

  if (!deliveryNarrative.trim()) {
    notes.push(
      isZh
        ? '再补一句你希望它如何被打开、被看见、被接住，这会直接影响包装与附言判断。'
        : 'Add one line about how you want the gift to be opened, seen, or received. It directly affects packaging and note guidance.',
    )
  }

  if (selectedCountry) {
    notes.push(
      isZh
        ? '国家已经明确后，真正需要避免的是场景语气与文化礼貌层级不匹配。'
        : 'Once the country is known, the main risk shifts to mismatches between scene tone and cultural expectations of politeness or hierarchy.',
    )
  }

  return notes
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)} className={selectClassName}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function StepAnalysis(props: StepAnalysisProps) {
  const {
    onBack,
    locale,
    selectedCountry,
    selectedAudienceLabel,
    activeSceneTemplate,
    sceneTemplate,
    sceneTemplateOptions,
    occasion,
    targetProfile,
    deliverySetting,
    deliveryNarrative,
    budgetRange,
    budgetLabel,
    formality,
    formalityLabel,
    ageBandLabel,
    occupationLabel,
    relationshipLabel,
    hasEnabledAnalysisEnhancement,
    analysisEnhancementSettings,
    canAnalyze,
    isAnalyzing,
    analyzingElapsedSeconds,
    onEnhancementSettingChange,
    onSceneTemplateChange,
    onOccasionChange,
    onDeliverySettingChange,
    onDeliveryNarrativeChange,
    onBudgetRangeChange,
    onFormalityChange,
    onAnalyze,
  } = props

  const isZh = locale === 'zh'
  const countryName = getCountryName(selectedCountry, locale)
  const sceneLabel = activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : getOptionLabel(sceneTemplateOptions, sceneTemplate)
  const deliverySettingLabel = getDeliverySettingLabel(locale, deliverySetting)
  const arrivalDraft = buildArrivalDraft({
    isZh,
    countryName,
    audienceLabel: selectedAudienceLabel,
    relationshipLabel,
    ageBandLabel,
    occupationLabel,
    sceneLabel,
    occasion,
    deliverySettingLabel,
    budgetLabel,
    formalityLabel,
    targetProfile,
    deliveryNarrative,
  })
  const proportionCheck = buildProportionCheck({
    isZh,
    deliverySetting,
    budgetRange,
    formality,
    selectedAudienceLabel,
  })
  const riskWatch = buildRiskWatch({
    isZh,
    occasion,
    deliveryNarrative,
    selectedCountry,
  })
  const deliverySettingOptions: Array<{ value: 'private' | 'shared' | 'public'; label: string; hint: string }> = [
    {
      value: 'private',
      label: getDeliverySettingLabel(locale, 'private'),
      hint: isZh ? '更克制，只让当事人感受到这份礼数。' : 'Restrained and intimate, felt mainly by the recipient.',
    },
    {
      value: 'shared',
      label: getDeliverySettingLabel(locale, 'shared'),
      hint: isZh ? '在有限的旁观者中被看见，但不把仪式推到过度公开。' : 'Visible within a small circle, without becoming performative.',
    },
    {
      value: 'public',
      label: getDeliverySettingLabel(locale, 'public'),
      hint: isZh ? '带有明显体面与场合感，需要更稳的分寸控制。' : 'Carries ceremony and visibility, demanding steadier proportion.',
    },
  ]

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-0 w-full flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.35rem] border border-[rgba(74,63,51,0.12)] bg-[linear-gradient(160deg,rgba(255,252,247,0.94),rgba(247,241,236,0.9))] shadow-[0_32px_86px_-62px_rgba(36,24,18,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,152,166,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(205,179,151,0.18),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),transparent)]" />

        <div className="relative flex flex-col xl:flex-row min-h-0 flex-1">
          <div className="relative flex flex-1 xl:flex-[1.04] min-w-0 min-h-[18rem] flex-col border-b border-[rgba(74,63,51,0.1)] px-5 py-4 sm:px-6 sm:py-4 xl:border-r xl:border-b-0 xl:px-7 xl:py-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a6a72]">{isZh ? 'Arrival composition' : 'Arrival composition'}</p>
                <p className="mt-2 max-w-[30rem] text-[1.55rem] leading-[1.04] tracking-[-0.04em] text-[#201915] sm:text-[1.85rem]">
                  {isZh ? '把人物侧写放进真实场景里，判断这份礼物该怎样抵达。' : 'Place the recipient sketch into a real scene and decide how the gesture should arrive.'}
                </p>
              </div>

              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">
                <p>03</p>
                <p className="mt-2">{isZh ? '送达编排' : 'Arrival draft'}</p>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Scene index' : 'Scene index'}</p>
              <div className="grid mt-3 gap-2 md:grid-cols-3">
                {sceneTemplateOptions.map(option => {
                  const active = option.value === sceneTemplate

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onSceneTemplateChange(option.value)}
                      className={`rounded-[1rem] border px-3 py-1.5 text-left transition ${active ? 'border-transparent bg-[#f4ecef] shadow-[0_16px_30px_-22px_rgba(138,93,103,0.34)]' : 'border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.62)] hover:border-[rgba(74,63,51,0.18)]'}`}
                    >
                      <p className={`text-[13px] leading-tight ${active ? 'text-[#6d4650]' : 'text-[#201915]'}`}>{option.label}</p>
                      <p className={`mt-1 text-[12px] leading-[1.3] ${active ? 'text-[#8a5d67]' : 'text-[#877d74]'}`}>{option.hint}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="mt-2 flex flex-1 flex-col">
              <span className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Occasion note' : 'Occasion note'}</span>
              <textarea
                value={occasion}
                onChange={event => onOccasionChange(event.target.value)}
                rows={2}
                placeholder={
                  isZh
                    ? '写清楚这份礼物出现的时刻：是首次拜访、项目收尾、节庆问候、私下感谢，还是一次需要拿捏分寸的修复性表达？'
                    : 'Describe the precise moment of gifting: a first visit, project close, holiday courtesy, private thanks, or a tactful attempt to repair atmosphere.'
                }
                className={`${fieldClassName} flex-1 min-h-[3.2rem] mt-1 resize-none overflow-y-auto`}
              />
            </label>

            <div className="mt-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Visibility of arrival' : 'Visibility of arrival'}</p>
              <div className="mt-1.5 grid gap-2 md:grid-cols-3">
                {deliverySettingOptions.map(option => {
                  const active = option.value === deliverySetting

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onDeliverySettingChange(option.value)}
                      className={`rounded-[1rem] border px-3 py-1.5 text-left transition ${active ? 'border-transparent bg-[#f4ecef] shadow-[0_16px_30px_-22px_rgba(138,93,103,0.34)]' : 'border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.62)] hover:border-[rgba(74,63,51,0.18)]'}`}
                    >
                      <p className={`text-[13px] leading-tight ${active ? 'text-[#6d4650]' : 'text-[#201915]'}`}>{option.label}</p>
                      <p className={`mt-1 text-[12px] leading-[1.3] ${active ? 'text-[#8a5d67]' : 'text-[#877d74]'}`}>{option.hint}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <label className="mt-3 flex flex-1 flex-col">
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Arrival note' : 'Arrival note'}</span>
              <textarea
                value={deliveryNarrative}
                onChange={event => onDeliveryNarrativeChange(event.target.value)}
                rows={2}
                placeholder={
                  isZh
                    ? '写一句你希望它怎样被打开、被看到、被接住。比如更体面、更温和、更低调，或更像一次正式致意。'
                    : 'Write one line about how you want it to be opened, seen, and received: more gracious, softer, quieter, or more ceremonially formal.'
                }
                className={`${fieldClassName} flex-1 min-h-[3.2rem] mt-1 resize-none overflow-y-auto`}
              />
            </label>
          </div>

          <div className="relative flex flex-1 xl:flex-[0.96] min-w-0 xl:min-w-[24rem] min-h-0 flex-col px-5 py-4 sm:px-6 sm:py-4 xl:px-7 xl:py-5">
            <div className="max-w-[42rem]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f877b]">{isZh ? 'Scene notes' : 'Scene notes'}</p>
              <h2 className="mt-2 max-w-[28rem] text-[1.55rem] leading-[1.02] tracking-[-0.05em] text-[#221c17] sm:text-[1.65rem]">
                {isZh ? '让 AI 把人物、场景和分寸写成一段真正可推演的送达稿。' : 'Let the AI turn person, setting, and tact into an arrival draft that can actually be judged.'}
              </h2>
            </div>

            <div className="mt-1.5 grid gap-1.5 md:grid-cols-2">
              <SelectField label={isZh ? 'Budget register' : 'Budget register'} value={budgetRange} onChange={onBudgetRangeChange} options={[
                { value: 'low', label: isZh ? '预算语气 · 低预算' : 'Budget tone · Low Budget' },
                { value: 'medium', label: isZh ? '预算语气 · 中预算' : 'Budget tone · Mid Budget' },
                { value: 'high', label: isZh ? '预算语气 · 高预算' : 'Budget tone · High Budget' },
              ]} />
              <SelectField label={isZh ? 'Tone discipline' : 'Tone discipline'} value={formality} onChange={onFormalityChange} options={[
                { value: 'casual', label: isZh ? '关系分寸 · 轻松' : 'Relational tone · Casual' },
                { value: 'semi-formal', label: isZh ? '关系分寸 · 半正式' : 'Relational tone · Semi-formal' },
                { value: 'formal', label: isZh ? '关系分寸 · 正式' : 'Relational tone · Formal' },
              ]} />
            </div>

            <div className="mt-4 flex flex-1 flex-col rounded-[1rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.54)] p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8a5d67]" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a72]">{isZh ? 'AI arrival draft' : 'AI arrival draft'}</p>
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#4f473f] overflow-y-auto">{arrivalDraft}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[countryName || (isZh ? '目的地待定' : 'Destination pending'), selectedAudienceLabel, sceneLabel, deliverySettingLabel, budgetLabel, formalityLabel].map(item => (
                  <span key={item} className="rounded-full border border-[rgba(74,63,51,0.08)] bg-white/74 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#6b645b]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.54)] p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Reading lenses' : 'Reading lenses'}</p>
                  <p className="hidden">
                    {isZh ? '这些不是参数面板，而是 AI 在推演时优先查看的分析角度。' : 'These are not raw settings panels, but the reading lenses the AI will prioritize during analysis.'}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${hasEnabledAnalysisEnhancement ? 'bg-[#f2e6e9] text-[#8a5d67]' : 'bg-[#efe9e2] text-[#8f877b]'}`}>
                  {hasEnabledAnalysisEnhancement ? (isZh ? '已启用' : 'Enabled') : isZh ? '已关闭' : 'Off'}
                </span>
              </div>

              <div className="mt-4 grid gap-1.5 md:grid-cols-2">
                {[
                  { key: 'multimodal', label: isZh ? '物象细读' : 'Object close reading', icon: Sparkles },
                  { key: 'collaborativeFiltering', label: isZh ? '关系参照' : 'Relational matching', icon: Network },
                  { key: 'logistics', label: isZh ? '送达约束' : 'Delivery constraints', icon: Plane },
                  { key: 'knowledgeGraph', label: isZh ? '文化图谱' : 'Cultural graph', icon: CheckCircle2 },
                ].map(lens => {
                  const active = analysisEnhancementSettings[lens.key as keyof EnhancementSettings]

                  return (
                    <button
                      key={lens.key}
                      type="button"
                      onClick={() => onEnhancementSettingChange(lens.key as keyof EnhancementSettings, !active)}
                      className={`flex items-start gap-2 rounded-[1.2rem] border px-3 py-1.5 text-left transition ${active ? 'border-transparent bg-[#f4ecef]' : 'border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.7)]'}`}
                    >
                      <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-white text-[#8a5d67]' : 'bg-[#f3efe8] text-[#8f877b]'}`}>
                        <lens.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm ${active ? 'text-[#6d4650]' : 'text-[#201915]'}`}>{lens.label}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-[rgba(74,63,51,0.1)] bg-[linear-gradient(90deg,rgba(245,237,239,0.88),rgba(250,245,238,0.88))] px-5 py-3 sm:px-7 sm:py-4">
          <div className="grid gap-2 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
              <div className="mt-2 space-y-0">
                {proportionCheck.map(item => (
                  <div key={item} className="flex items-start gap-2 text-[13px] leading-tight text-[#5a544b] text-[#5a544b]">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#8a5d67]" />
                    <span>{item}</span>
                  </div>
                ))}
                {riskWatch.map(item => (
                  <div key={item} className="flex items-start gap-2 text-[13px] leading-tight text-[#5a544b] text-[#5a544b]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#8a5d67]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l border-[rgba(74,63,51,0.08)] pl-0 xl:pl-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? "Editor's handoff" : "Editor's handoff"}</p>
              
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(36,32,27,0.12)] bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#24201b] transition hover:-translate-y-0.5 hover:bg-[rgba(36,32,27,0.04)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isZh ? '返回上一步' : 'Back'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onAnalyze}
                    disabled={!canAnalyze || isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-full bg-[#24201b] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <Wand2 className="h-4 w-4" />
                    {isAnalyzing ? (isZh ? `开始推演 ${analyzingElapsedSeconds}s` : `Composing ${analyzingElapsedSeconds}s`) : isZh ? '开始文化推演' : 'Begin cultural judgment'}
                  </button>
                </div>            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
