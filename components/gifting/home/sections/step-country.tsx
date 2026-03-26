'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { homeControl } from '@/components/gifting/home/home-design-tokens'
import { CountrySelector } from '@/components/gifting/country-selector'
import { withBasePath } from '@/lib/asset-path'
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
  t,
  apiLanguage,
  selectedCountry,
  activeSceneTemplate,
  sceneTemplate,
  sceneTemplateOptions,
  selectedAudienceLabel,
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-black/6 bg-white/92 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-black/6 pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? 'STEP 02' : 'STEP 02'}</p>
          <h2 className="mt-2 text-[1.9rem] font-serif leading-tight text-[#1c1a17]">
            {t('country.title')}
          </h2>
          <p className="mt-2 max-w-[42rem] text-sm leading-7 text-[#667085]">
            {t('country.description')}
          </p>
        </div>
        <Image src={withBasePath('/brand/step-country.svg')} alt="Country step" width={42} height={42} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.5rem] border border-black/6 bg-[#fbf7f2] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '目标国家' : 'Destination'}</p>
              <p className="mt-2 text-lg font-semibold text-[#1c1a17]">
                {selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '请选择国家' : 'Choose a country'}
              </p>
            </div>
            {selectedCountry && (
              <span className="rounded-full border border-[#4a5f97]/20 bg-[#eef2ff] px-3 py-1 text-xs text-[#3c4d8d]">
                {getCountryName(selectedCountry, locale)}
              </span>
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

        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-black/6 bg-white/88 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '场景模板' : 'Scene template'}</p>
            <select value={sceneTemplate} onChange={event => onSceneTemplateChange(event.target.value)} className={`${selectClass} mt-3`}>
              {sceneTemplateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {activeSceneTemplate && (
              <p className="mt-3 text-sm leading-7 text-[#667085]">{isZh ? activeSceneTemplate.hintZh : activeSceneTemplate.hintEn}</p>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-black/6 bg-white/88 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '收礼对象' : 'Audience'}</p>
            <select
              value={targetGroup}
              onChange={event => onTargetGroupChange(event.target.value as AudienceGroup)}
              className={`${selectClass} mt-3`}
            >
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
                className={`${homeControl.input} mt-3`}
              />
            )}
            <input
              value={occasion}
              onChange={event => onOccasionChange(event.target.value)}
              placeholder={isZh ? '场景说明，例如生日、拜访、商务见面' : 'Occasion, e.g. birthday, visit, business meeting'}
              className={`${homeControl.input} mt-3`}
            />
            <textarea
              value={targetProfile}
              onChange={event => onTargetProfileChange(event.target.value)}
              placeholder={isZh ? '补充目标对象画像、兴趣或文化背景' : 'Add profile details, interests, or cultural notes'}
              rows={3}
              className={`${homeControl.input} mt-3 resize-none leading-7`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '年龄段' : 'Age band'}</p>
          <select value={ageBand} onChange={event => onAgeBandChange(event.target.value)} className={`${selectClass} mt-3`}>
            {ageBandOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '职业' : 'Occupation'}</p>
          <select value={occupation} onChange={event => onOccupationChange(event.target.value)} className={`${selectClass} mt-3`}>
            {occupationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '关系' : 'Relationship'}</p>
          <select value={relationship} onChange={event => onRelationshipChange(event.target.value)} className={`${selectClass} mt-3`}>
            {relationshipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '预算 / 正式度' : 'Budget / formality'}</p>
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

      <div className="mt-5 rounded-[1.35rem] border border-[#e4ddd2] bg-[linear-gradient(180deg,#fff,#f9f4ed)] p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">{isZh ? '当前判断上下文' : 'Current decision context'}</p>
        <p className="mt-3 text-sm leading-7 text-[#475467]">
          {selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '未选国家' : 'No country'} · {selectedAudienceLabel} ·{' '}
          {activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate}
        </p>
      </div>
    </motion.section>
  )
}
