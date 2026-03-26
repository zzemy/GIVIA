'use client'

import { motion } from 'framer-motion'
import { homeControl } from '@/components/gifting/home/home-design-tokens'
import { CountrySelector } from '@/components/gifting/country-selector'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { AudienceGroup, Locale, RecognitionResult, SceneTemplateOption, SelectOption } from '@/components/gifting/home/types'

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
  relationship: string
  relationshipOptions: SelectOption[]
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
}

export function StepCountry({
  locale,
  apiLanguage,
  selectedCountry,
  activeSceneTemplate,
  sceneTemplate,
  sceneTemplateOptions,
  selectedAudienceLabel,
  budgetLabel,
  formalityLabel,
  audienceOptions,
  targetGroup,
  customAudienceGroup,
  occasion,
  targetProfile,
  ageBand,
  ageBandOptions,
  occupation,
  occupationOptions,
  relationship,
  relationshipOptions,
  budgetRange,
  budgetOptions,
  formality,
  formalityOptions,
  onSelectedCountryChange,
  onSceneTemplateChange,
  onTargetGroupChange,
  onCustomAudienceGroupChange,
  onOccasionChange,
  onTargetProfileChange,
  onAgeBandChange,
  onOccupationChange,
  onRelationshipChange,
  onBudgetRangeChange,
  onFormalityChange,
}: StepCountryProps) {
  const isZh = locale === 'zh'
  const selectClass = `${homeControl.input} pr-10`
  const destinationLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '尚未选择国家' : 'No country selected'
  const contextSummary = [
    destinationLabel,
    selectedAudienceLabel,
    activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate,
    budgetLabel,
    formalityLabel,
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.3rem] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(247,244,238,0.94))] p-6 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="rounded-[1.9rem] border border-black/6 bg-white/72 p-5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.16)]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Context briefing' : 'Context briefing'}</p>
        <p className="mt-3 text-[1.85rem] font-serif leading-tight text-[#1c1a17]">
          {isZh ? '让礼物进入一个真实的文化场景。' : 'Place the gift inside a real cultural situation.'}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[#667085]">
          {isZh
            ? '国家、对象、预算和正式度不再分散填写，而是共同定义这份礼物会被怎样理解。'
            : 'Country, recipient, budget, and formality do not stand alone. Together they define how the gift will be interpreted.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#fcfaf7,#f7f1e9)] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Destination' : 'Destination'}</p>
                <p className="mt-2 text-[1.7rem] font-serif leading-tight text-[#1c1a17]">{destinationLabel}</p>
              </div>
              {selectedCountry && (
                <span className="rounded-full border border-[#4a5f97]/20 bg-[#eef2ff] px-3 py-1 text-xs text-[#3c4d8d]">{selectedCountry}</span>
              )}
            </div>

            <CountrySelector
              value={selectedCountry}
              onChange={onSelectedCountryChange}
              locale={apiLanguage}
              regionLabels={{
                asia: locale === 'zh' ? '亚洲' : 'Asia',
                europe: locale === 'zh' ? '欧洲' : 'Europe',
                americas: locale === 'zh' ? '美洲' : 'Americas',
                africa: locale === 'zh' ? '非洲' : 'Africa',
                oceania: locale === 'zh' ? '大洋洲' : 'Oceania',
              }}
            />
          </div>

          <div className="rounded-[1.9rem] border border-black/6 bg-white/76 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Current edit' : 'Current edit'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {contextSummary.map(item => (
                <span key={item} className="rounded-full border border-black/8 bg-[#fcfaf7] px-4 py-2 text-sm text-[#475467]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.85rem] border border-black/6 bg-white/76 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Scene' : 'Scene'}</p>
              <p className="mt-2 text-lg font-serif text-[#1c1a17]">{isZh ? '先定义礼物被理解的社会场景。' : 'Define the social frame in which the gift will be read.'}</p>
            </div>
            <select value={sceneTemplate} onChange={event => onSceneTemplateChange(event.target.value)} className={`${selectClass} mt-4`}>
              {sceneTemplateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {activeSceneTemplate && <p className="mt-3 text-sm leading-7 text-[#667085]">{isZh ? activeSceneTemplate.hintZh : activeSceneTemplate.hintEn}</p>}
          </div>

          <div className="rounded-[1.85rem] border border-black/6 bg-[linear-gradient(180deg,#fff,#fcfaf7)] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Recipient dossier' : 'Recipient dossier'}</p>
            <select value={targetGroup} onChange={event => onTargetGroupChange(event.target.value as AudienceGroup)} className={`${selectClass} mt-4`}>
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {targetGroup === 'other' && (
              <input
                value={customAudienceGroup}
                onChange={event => onCustomAudienceGroupChange(event.target.value)}
                placeholder={isZh ? '补充对象描述' : 'Describe the audience'}
                className={`${homeControl.input} mt-4`}
              />
            )}
            <input
              value={occasion}
              onChange={event => onOccasionChange(event.target.value)}
              placeholder={isZh ? '场景说明，例如生日、拜访、商务见面' : 'Occasion, e.g. birthday, visit, business meeting'}
              className={`${homeControl.input} mt-4`}
            />
            <textarea
              value={targetProfile}
              onChange={event => onTargetProfileChange(event.target.value)}
              placeholder={isZh ? '补充目标对象画像、兴趣或文化背景' : 'Add profile details, interests, or cultural notes'}
              rows={3}
              className={`${homeControl.input} mt-4 resize-none leading-7`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.65rem] border border-black/6 bg-white/76 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '年龄段' : 'Age band'}</p>
          <select value={ageBand} onChange={event => onAgeBandChange(event.target.value)} className={`${selectClass} mt-3`}>
            {ageBandOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.65rem] border border-black/6 bg-white/76 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '职业' : 'Occupation'}</p>
          <select value={occupation} onChange={event => onOccupationChange(event.target.value)} className={`${selectClass} mt-3`}>
            {occupationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.65rem] border border-black/6 bg-white/76 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '关系' : 'Relationship'}</p>
          <select value={relationship} onChange={event => onRelationshipChange(event.target.value)} className={`${selectClass} mt-3`}>
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.65rem] border border-black/6 bg-white/76 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? '预算 / 正式度' : 'Budget / formality'}</p>
          <select value={budgetRange} onChange={event => onBudgetRangeChange(event.target.value)} className={`${selectClass} mt-3`}>
            {budgetOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={formality} onChange={event => onFormalityChange(event.target.value)} className={`${selectClass} mt-3`}>
            {formalityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.section>
  )
}
