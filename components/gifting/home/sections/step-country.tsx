'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, FileText, Globe2, Sparkles, UserRound } from 'lucide-react'
import { CountrySelector } from '@/components/gifting/country-selector'
import { getCountryName } from '@/lib/countries'
import type { AudienceGroup, Locale, RecognitionResult, SceneTemplateOption, SelectOption } from '@/components/gifting/home/types'
import type { SceneTemplate } from '@/lib/types/gifting-types'

export interface StepCountryProps {
  locale: Locale
  t: (path: string) => string
  apiLanguage: 'zh' | 'en'
  selectedCountry: string
  recognition: RecognitionResult | null
  hasGiftInput: boolean
  selectedFile: File | null
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  sceneTemplateOptions: SceneTemplateOption[]
  selectedAudienceLabel: string
  budgetLabel: string
  formalityLabel: string
  templateHasAudienceOverride: boolean
  templateHasBudgetOverride: boolean
  templateHasFormalityOverride: boolean
  audienceOptions: SelectOption[]
  targetGroup: AudienceGroup
  customAudienceGroup: string
  occasion: string
  targetProfile: string
  profileFieldClassName: string
  profileLabelClassName: string
  profileControlClassName: string
  ageBand: string
  ageBandOptions: SelectOption[]
  gender: string
  genderOptions: SelectOption[]
  occupation: string
  occupationOptions: SelectOption[]
  ageBandLabel: string
  occupationLabel: string
  relationship: string
  relationshipOptions: SelectOption[]
  relationshipLabel: string
  budgetRange: string
  budgetOptions: SelectOption[]
  formality: string
  formalityOptions: SelectOption[]
  onSelectedCountryChange: (value: string) => void
  onSceneTemplateChange: (value: string) => void
  onTargetGroupChange: (value: AudienceGroup) => void
  onCustomAudienceGroupChange: (value: string) => void
  onOccasionChange: (value: string) => void
  onTargetProfileChange: (value: string) => void
  onAgeBandChange: (value: string) => void
  onGenderChange: (value: string) => void
  onOccupationChange: (value: string) => void
  onRelationshipChange: (value: string) => void
  onBudgetRangeChange: (value: string) => void
  onFormalityChange: (value: string) => void
  accentClass?: string
  textAccent?: string
  themeBg?: string
}

const fieldClassName =
  'mt-2 w-full rounded-[1.05rem] border border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[#201a16] transition placeholder:text-[#968f85] focus:border-[rgba(62,118,93,0.24)] focus:bg-white focus:outline-none focus:ring-0'

function getOptionLabel(options: SelectOption[], value: string): string {
  return options.find(option => option.value === value)?.label ?? value
}

function buildRecipientSketch({
  isZh,
  countryName,
  selectedAudienceLabel,
  relationshipLabel,
  ageBandLabel,
  genderLabel,
  occupationLabel,
  budgetLabel,
  formalityLabel,
  targetProfile,
}: {
  isZh: boolean
  countryName: string
  selectedAudienceLabel: string
  relationshipLabel: string
  ageBandLabel: string
  genderLabel: string
  occupationLabel: string
  budgetLabel: string
  formalityLabel: string
  targetProfile: string
}): string {
  if (isZh) {
    return [
      countryName ? `这份礼物将进入 ${countryName} 的接收语境。` : '这份礼物还没有明确的文化目的地。',
      `当前对象更接近 ${selectedAudienceLabel}，关系上可先按 ${relationshipLabel} 来理解。`,
      `人物轮廓暂时落在 ${ageBandLabel}、${genderLabel}、${occupationLabel} 的组合上。`,
      `预算语气是 ${budgetLabel}，表达分寸偏向 ${formalityLabel}。`,
      targetProfile.trim() ? `补充侧写提到：${targetProfile.trim()}` : '如果你补充对方性格、边界或过往互动，后续判断会更细。',
    ].join('')
  }

  return [
    countryName ? `This gesture is being framed for reception in ${countryName}.` : 'The cultural destination is still undefined.',
    `The recipient currently reads as ${selectedAudienceLabel}, with the relationship leaning toward ${relationshipLabel}.`,
    `The profile is being drafted around ${ageBandLabel}, ${genderLabel}, and ${occupationLabel}.`,
    `The budget register sits at ${budgetLabel}, with a ${formalityLabel} delivery tone.`,
    targetProfile.trim()
      ? `Added note: ${targetProfile.trim()}`
      : 'A short note about personality, hierarchy, or prior interactions would sharpen the next chapter.'
  ].join(' ')
}

function buildMissingContext({
  isZh,
  selectedCountry,
  targetGroup,
  customAudienceGroup,
  targetProfile,
}: {
  isZh: boolean
  selectedCountry: string
  targetGroup: AudienceGroup
  customAudienceGroup: string
  targetProfile: string
}): string[] {
  const notes: string[] = []

  if (!selectedCountry) {
    notes.push(isZh ? '先确认礼物最终会抵达哪个国家，文化判断才有坐标。' : 'Set the destination country first so the cultural reading has a frame.')
  }

  if (targetGroup === 'other' && !customAudienceGroup.trim()) {
    notes.push(isZh ? '你把关系设成了自定义，但还没写清这个人对你来说是什么角色。' : 'You chose a custom relationship, but the recipient role is still not described.')
  }

  if (!targetProfile.trim()) {
    notes.push(
      isZh
        ? '还缺一条人物侧写，例如对方的性格、边界感、审美偏好或过往互动。'
        : 'Add one short recipient note such as temperament, boundaries, taste, or prior interaction context.',
    )
  }

  return notes
}

function buildTactNotes({
  isZh,
  targetGroup,
  relationship,
  budgetRange,
  formality,
  selectedCountry,
}: {
  isZh: boolean
  targetGroup: AudienceGroup
  relationship: string
  budgetRange: string
  formality: string
  selectedCountry: string
}): string[] {
  const notes: string[] = []

  if (budgetRange === 'high' && (targetGroup === 'peer' || relationship === 'friend' || relationship === 'colleague')) {
    notes.push(
      isZh
        ? '高预算配平辈或朋友关系时，要注意不要让礼物显得超过关系现阶段的自然分寸。'
        : 'A high budget paired with peer or friend dynamics can feel disproportionate if the relationship is still light.',
    )
  }

  if (formality === 'formal' && (targetGroup === 'family' || relationship === 'friend')) {
    notes.push(
      isZh
        ? '正式语气配亲近关系时，容易显得太疏离，后续场景编排里要补回温度。'
        : 'A formal register can read as overly distant in a close relationship unless the arrival scene adds warmth back in.',
    )
  }

  if (selectedCountry) {
    notes.push(
      isZh
        ? '目的地已确定后，后续第三步会重点判断这份礼物应更公开体面，还是更克制私密地抵达。'
        : 'With the destination set, the next chapter should decide whether the gift should arrive publicly with ceremony or privately with restraint.',
    )
  }

  return notes
}

function ChoiceField({
  label,
  value,
  onChange,
  options,
  columns = 'grid-cols-3',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  columns?: string
}) {
  return (
    <div className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{label}</span>
      <div className={`mt-2 grid gap-2 ${columns}`}>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-w-0 rounded-full border px-3 py-2 text-left text-[11px] uppercase tracking-[0.14em] transition ${
              option.value === value
                ? 'border-transparent bg-[#edf5f1] text-[#224f3f] shadow-[0_12px_24px_-20px_rgba(44,109,85,0.4)]'
                : 'border-[rgba(74,63,51,0.08)] bg-white/72 text-[#70685f] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function StepCountry(props: StepCountryProps) {
  const {
    locale,
    selectedCountry,
    selectedAudienceLabel,
    audienceOptions,
    targetGroup,
    customAudienceGroup,
    targetProfile,
    ageBand,
    ageBandOptions,
    gender,
    genderOptions,
    occupation,
    occupationOptions,
    ageBandLabel,
    occupationLabel,
    relationship,
    relationshipOptions,
    relationshipLabel,
    budgetRange,
    budgetOptions,
    budgetLabel,
    formality,
    formalityOptions,
    formalityLabel,
    onSelectedCountryChange,
    onTargetGroupChange,
    onCustomAudienceGroupChange,
    onTargetProfileChange,
    onAgeBandChange,
    onGenderChange,
    onOccupationChange,
    onRelationshipChange,
    onBudgetRangeChange,
    onFormalityChange,
  } = props

  const isZh = locale === 'zh'
  const countryName = getCountryName(selectedCountry, locale)
  const genderLabel = getOptionLabel(genderOptions, gender)
  const recipientSketch = buildRecipientSketch({
    isZh,
    countryName,
    selectedAudienceLabel,
    relationshipLabel,
    ageBandLabel,
    genderLabel,
    occupationLabel,
    budgetLabel,
    formalityLabel,
    targetProfile,
  })
  const missingContext = buildMissingContext({
    isZh,
    selectedCountry,
    targetGroup,
    customAudienceGroup,
    targetProfile,
  })
  const tactNotes = buildTactNotes({
    isZh,
    targetGroup,
    relationship,
    budgetRange,
    formality,
    selectedCountry,
  })
  const profileFacts = [ageBandLabel, occupationLabel, relationshipLabel, budgetLabel, formalityLabel]

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="h-full w-full">
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2.35rem] border border-[rgba(74,63,51,0.12)] bg-[linear-gradient(160deg,rgba(255,252,247,0.94),rgba(246,241,234,0.9))] shadow-[0_32px_86px_-62px_rgba(36,24,18,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,198,183,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(204,181,150,0.18),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),transparent)]" />

        <div className="relative grid min-h-0 flex-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="relative flex min-h-[18rem] flex-col border-b border-[rgba(74,63,51,0.1)] px-5 py-5 sm:px-6 sm:py-6 xl:border-r xl:border-b-0 xl:px-6 xl:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#7d8f88]">{isZh ? 'Recipient dossier' : 'Recipient dossier'}</p>
                <p className="mt-3 max-w-[23rem] text-[1.5rem] leading-[1.04] tracking-[-0.04em] text-[#201915] sm:text-[1.78rem]">
                  {isZh ? '先把收礼人写清楚，再谈这份礼物该如何抵达。' : 'Clarify the recipient first, then decide how the gesture should arrive.'}
                </p>
              </div>

              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">
                <p>02</p>
                <p className="mt-2">{isZh ? '人物侧写' : 'Recipient notes'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.8rem] border border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.55)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1ec] text-[#2c6d55]">
                  <Globe2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Destination frame' : 'Destination frame'}</p>
                  <p className="mt-1 text-[13px] leading-5 text-[#5f584f]">
                    {countryName
                      ? isZh
                        ? `这份礼物将被 ${countryName} 的文化语境重新解释。`
                        : `This gift will be reinterpreted through the cultural lens of ${countryName}.`
                      : isZh
                        ? '先确认目的地，AI 才能开始判断这份礼物会被怎样理解。'
                        : 'Choose the destination first so the AI can start reading how this gift may be interpreted.'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <CountrySelector value={selectedCountry} onChange={onSelectedCountryChange} locale={locale} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0ece5] text-[#6b5b49]">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Relationship frame' : 'Relationship frame'}</p>
                  <p className="mt-1 text-[13px] leading-5 text-[#5f584f]">
                    {isZh ? '不要把对象写成抽象的“用户”。这里要写的是关系、身份和边界。' : 'Do not reduce the recipient to a generic user. Write the relation, role, and boundary.'}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {audienceOptions.map(option => {
                  const active = option.value === targetGroup

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onTargetGroupChange(option.value as AudienceGroup)}
                      className={`rounded-[1.1rem] border px-3 py-3 text-left transition ${active ? 'border-transparent bg-[#edf5f1] shadow-[0_14px_24px_-20px_rgba(44,109,85,0.34)]' : 'border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.62)] hover:border-[rgba(74,63,51,0.16)]'}`}
                    >
                      <p className={`text-[12px] leading-5 ${active ? 'text-[#224f3f]' : 'text-[#201915]'}`}>{option.label}</p>
                    </button>
                  )
                })}
              </div>

              {targetGroup === 'other' && (
                <label className="mt-3 block">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#978f84]">{isZh ? 'Custom relation' : 'Custom relation'}</span>
                  <input
                    type="text"
                    value={customAudienceGroup}
                    onChange={event => onCustomAudienceGroupChange(event.target.value)}
                    placeholder={isZh ? '例如：长期照顾你的寄宿家庭、重要引荐人、研究合作对象' : 'e.g. host family, introducer, research collaborator'}
                    className={fieldClassName}
                  />
                </label>
              )}

              <div className="mt-4 rounded-[1.45rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.58)] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#3f7a65]" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d8f88]">{isZh ? 'AI recipient sketch' : 'AI recipient sketch'}</p>
                </div>
                <p className="mt-2 text-[13px] leading-6 text-[#4f473f]">{recipientSketch}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profileFacts.map(item => (
                    <span key={item} className="rounded-full border border-[rgba(74,63,51,0.08)] bg-white/74 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#6b645b]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col px-5 py-5 sm:px-6 sm:py-6 xl:px-6 xl:py-6">
            <div className="max-w-[42rem]">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8f877b]">{isZh ? 'Profile notes' : 'Profile notes'}</p>
              <h2 className="mt-3 max-w-[28rem] text-[1.52rem] leading-[1.04] tracking-[-0.04em] text-[#221c17] sm:text-[1.72rem]">
                {isZh ? '让 AI 先读到这个人的角色、分寸和被理解的方式。' : 'Let the AI read the recipient’s role, tact, and likely mode of reception first.'}
              </h2>
              <p className="mt-3 max-w-[34rem] text-[13px] leading-6 text-[#6b645b]">
                {isZh
                  ? '真正改变礼赠判断的，往往不是礼物本身，而是对方是谁、你们处在怎样的关系里，以及这份礼物会被如何理解。'
                  : 'What most changes the reading is often not the gift itself, but who the recipient is, what the relationship carries, and how the gesture will be interpreted.'}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <ChoiceField label={isZh ? 'Age band' : 'Age band'} value={ageBand} onChange={onAgeBandChange} options={ageBandOptions} columns="grid-cols-4" />
              <ChoiceField label={isZh ? 'Occupation context' : 'Occupation context'} value={occupation} onChange={onOccupationChange} options={occupationOptions} columns="grid-cols-3" />
              <div className="grid gap-3 md:grid-cols-2">
                <ChoiceField label={isZh ? 'Relationship distance' : 'Relationship distance'} value={relationship} onChange={onRelationshipChange} options={relationshipOptions} columns="grid-cols-2" />
                <ChoiceField label={isZh ? 'Tone discipline' : 'Tone discipline'} value={formality} onChange={onFormalityChange} options={formalityOptions} columns="grid-cols-3" />
              </div>
              <div className="grid gap-3 md:grid-cols-[0.84fr_1.16fr]">
                <ChoiceField label={isZh ? 'Budget register' : 'Budget register'} value={budgetRange} onChange={onBudgetRangeChange} options={budgetOptions} columns="grid-cols-3" />
                <ChoiceField label={isZh ? 'Gender cue' : 'Gender cue'} value={gender} onChange={onGenderChange} options={genderOptions} columns="grid-cols-3" />
              </div>
            </div>

            <label className="mt-4 block">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#978f84]">
                <FileText className="h-3.5 w-3.5" />
                {isZh ? 'Recipient note' : 'Recipient note'}
              </span>
              <textarea
                value={targetProfile}
                onChange={event => onTargetProfileChange(event.target.value)}
                rows={5}
                placeholder={
                  isZh
                    ? '写一点只有你知道的收礼人细节：他更看重体面还是亲近？是否在意身份、辈分、公开场合、审美偏好或某些禁忌？'
                    : 'Add the details only you know: does the recipient value reserve or warmth, hierarchy or ease, public dignity, taste cues, or specific sensitivities?'
                }
                className={`${fieldClassName} min-h-[6.8rem] resize-none overflow-hidden`}
              />
            </label>
          </div>
        </div>

        <div className="relative border-t border-[rgba(74,63,51,0.1)] bg-[linear-gradient(90deg,rgba(238,245,241,0.88),rgba(250,245,238,0.88))] px-5 py-3 sm:px-6">
          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
              <p className="mt-1.5 text-[15px] leading-tight text-[#201a16]">
                {isZh ? 'AI 已经开始把这个人读成一段关系，而不是一组静态字段。' : 'The AI is now reading this person as a relationship, not as a flat set of fields.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                {(missingContext.length > 0 ? missingContext : [isZh ? '当前人物信息已经足够进入下一章。' : 'The recipient profile is now sufficient for the next chapter.']).map(item => (
                  <div key={item} className="flex max-w-[34rem] items-start gap-2 text-[12px] leading-5 text-[#5a544b]">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3f7a65]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l border-[rgba(74,63,51,0.08)] pl-0 xl:pl-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? "Editor's margin" : "Editor's margin"}</p>
              <div className="mt-2 space-y-1.5">
                {tactNotes.slice(0, 2).map(item => (
                  <div key={item} className="flex items-start gap-2 text-[12px] leading-5 text-[#5a544b]">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3f7a65]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
