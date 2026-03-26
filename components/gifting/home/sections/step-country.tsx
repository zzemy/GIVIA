'use client'

import { motion } from 'framer-motion'
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

const inputClassName =
  'w-full rounded-[1.55rem] border border-black/7 bg-white/72 px-5 py-4 text-[15px] leading-7 text-[#1d1a17] placeholder:text-[#9aa1af] transition focus:border-[#5b72d1]/45 focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,114,209,0.08)]'

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
  const destinationLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '尚未选择国家' : 'No country selected'
  const activeSceneLabel = activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate
  const contextSummary = [destinationLabel, selectedAudienceLabel, activeSceneLabel, budgetLabel, formalityLabel]

  const profileCards = [
    { label: isZh ? '年龄段' : 'Age band', value: ageBand, options: ageBandOptions, onChange: onAgeBandChange },
    { label: isZh ? '职业' : 'Occupation', value: occupation, options: occupationOptions, onChange: onOccupationChange },
    { label: isZh ? '关系' : 'Relationship', value: relationship, options: relationshipOptions, onChange: onRelationshipChange },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.6rem] border border-black/6 bg-[linear-gradient(155deg,rgba(255,255,255,0.96),rgba(247,244,238,0.94))] p-6 shadow-[0_36px_84px_-48px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="rounded-[2rem] border border-black/6 bg-white/66 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Context composition' : 'Context composition'}</p>
        <p className="mt-3 text-[1.95rem] font-serif leading-tight text-[#1d1a17]">
          {isZh ? '把国家、对象与分寸写成同一段文化语境。' : 'Compose country, recipient, and tact into one cultural frame.'}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-[#69707d]">
          {isZh
            ? '这里不是机械填表，而是在定义：同一份礼物，会在怎样的关系、场合和文化秩序里被理解。'
            : 'This is not mechanical form filling. It defines the relationship, occasion, and cultural order in which the same gift will be interpreted.'}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-5">
          <div className="rounded-[2.15rem] border border-black/6 bg-[linear-gradient(180deg,#fcfaf7,#f7f0e8)] p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Destination' : 'Destination'}</p>
                <p className="mt-2 text-[1.8rem] font-serif leading-tight text-[#1d1a17]">{destinationLabel}</p>
              </div>
              {selectedCountry && (
                <span className="rounded-full border border-[#5b72d1]/16 bg-[#eef2ff] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#4a5db0]">
                  {selectedCountry}
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

          <div className="rounded-[2rem] border border-black/6 bg-white/74 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Current context strip' : 'Current context strip'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {contextSummary.map(item => (
                <span key={item} className="rounded-full border border-black/8 bg-[#fcfaf7] px-4 py-2 text-sm text-[#4b5563]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="rounded-[1.95rem] border border-black/6 bg-white/74 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Scene script' : 'Scene script'}</p>
              <p className="mt-2 text-base font-serif text-[#1d1a17]">
                {isZh ? '先决定礼物将被放进什么样的社会脚本。' : 'Decide the social script in which the gift will appear.'}
              </p>
              <select value={sceneTemplate} onChange={event => onSceneTemplateChange(event.target.value)} className={`${inputClassName} mt-4 appearance-none`}>
                {sceneTemplateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {activeSceneTemplate && <p className="mt-3 text-sm leading-7 text-[#69707d]">{isZh ? activeSceneTemplate.promptZh : activeSceneTemplate.promptEn}</p>}
            </div>

            <div className="rounded-[1.95rem] border border-black/6 bg-[linear-gradient(180deg,#fff,#fcfaf7)] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Audience dossier' : 'Audience dossier'}</p>
              <select value={targetGroup} onChange={event => onTargetGroupChange(event.target.value as AudienceGroup)} className={`${inputClassName} mt-4 appearance-none`}>
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
                  className={`${inputClassName} mt-4`}
                />
              )}
              <input
                value={occasion}
                onChange={event => onOccasionChange(event.target.value)}
                placeholder={isZh ? '场景说明，例如生日、拜访、商务见面' : 'Occasion, e.g. birthday, visit, business meeting'}
                className={`${inputClassName} mt-4`}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/6 bg-white/74 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Human profile note' : 'Human profile note'}</p>
            <textarea
              value={targetProfile}
              onChange={event => onTargetProfileChange(event.target.value)}
              placeholder={isZh ? '补充目标对象画像、兴趣、职业气质或文化背景' : 'Add recipient profile, interests, professional tone, or cultural background'}
              rows={4}
              className={`${inputClassName} mt-4 resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
        <div className="grid gap-4 md:grid-cols-3">
          {profileCards.map(card => (
            <div key={card.label} className="rounded-[1.8rem] border border-black/6 bg-white/74 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{card.label}</p>
              <select value={card.value} onChange={event => card.onChange(event.target.value)} className={`${inputClassName} mt-3 appearance-none`}>
                {card.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-[#e8decd] bg-[linear-gradient(180deg,#fffdf8,#fff5e7)] p-5 shadow-[0_24px_50px_-36px_rgba(184,129,45,0.2)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b6b20]">{isZh ? 'Budget and protocol' : 'Budget and protocol'}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select value={budgetRange} onChange={event => onBudgetRangeChange(event.target.value)} className={`${inputClassName} appearance-none`}>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select value={formality} onChange={event => onFormalityChange(event.target.value)} className={`${inputClassName} appearance-none`}>
              {formalityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#6f5a35]">
            {isZh
              ? '预算决定材质与包装期待，正式度决定表达语言与送达方式。'
              : 'Budget shapes material and packaging expectations, while formality shapes language and delivery tone.'}
          </p>
        </div>
      </div>
    </motion.section>
  )
}
