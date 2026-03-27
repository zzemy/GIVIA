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
  'w-full appearance-none border-0 border-b border-black/10 bg-transparent px-0 py-3 text-[15px] leading-7 text-[#1d1a17] transition duration-500 focus:border-[#6175ca]/45 focus:outline-none focus:ring-0'

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
  const destinationLabel = selectedCountry ? getCountryName(selectedCountry, locale) : isZh ? '尚未选择目的地' : 'Destination not selected'
  const activeSceneLabel = activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate
  const contextSummary = [destinationLabel, selectedAudienceLabel, activeSceneLabel, budgetLabel, formalityLabel]
  const destinationPrompt = isZh ? '这份心意将进入哪一个国家与生活语境？' : 'Into which country and lived context will the gesture arrive?'
  const scenePrompt = isZh ? '它更像会出现在哪一种时刻与社会脚本里？' : 'In what kind of moment or social script is it likely to appear?'
  const recipientPrompt = isZh ? '谁会接住它？这段关系更接近怎样的边界与礼貌？' : 'Who will receive it, and what kind of boundary or courtesy defines the relationship?'
  const profilePrompt = isZh ? '如果为对方写一段人物侧写，你会补充什么背景？' : 'If you were to write a short profile of the recipient, what background would you add?'

  const profileCards = [
    { label: isZh ? '年龄段' : 'Age band', value: ageBand, options: ageBandOptions, onChange: onAgeBandChange },
    { label: isZh ? '职业' : 'Occupation', value: occupation, options: occupationOptions, onChange: onOccupationChange },
    { label: isZh ? '关系' : 'Relationship', value: relationship, options: relationshipOptions, onChange: onRelationshipChange },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-8 overflow-hidden xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]"
    >
      <div className="flex min-h-0 flex-col overflow-hidden border-r border-black/6 pr-0 xl:pr-10">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Destination frame' : 'Destination frame'}</p>
        <h3 className="mt-4 max-w-[31rem] text-[2.6rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
          {isZh ? '让国家、对象与场景站进同一段关系里。' : 'Place country, person, and occasion inside one relationship frame.'}
        </h3>
        <p className="mt-4 text-sm leading-8 text-[#69707d]">
          {isZh
            ? '礼物的分寸，取决于它会进入怎样的生活秩序、社交语气与关系边界。'
            : 'The tact of a gift depends on the social order, tone, and relational boundary into which it will enter.'}
        </p>
        <p className="mt-4 text-[1.04rem] font-serif leading-8 text-[#1d1a17]">{destinationPrompt}</p>

        <div className="mt-6 rounded-[2.4rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,241,235,0.9))] p-5 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.14)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Selected destination' : 'Selected destination'}</p>
          <p className="mt-3 text-[2rem] font-serif leading-tight text-[#1d1a17]">{destinationLabel}</p>
          {selectedCountry && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#6c78ab]">{selectedCountry}</p>}

          <div className="mt-5 min-h-0 overflow-auto">
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
        </div>

        <div className="mt-6 border-t border-black/6 pt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Context line' : 'Context line'}</p>
          <p className="mt-3 text-[1.08rem] font-serif leading-8 text-[#1d1a17]">{contextSummary.filter(Boolean).join(' · ')}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden pt-1 xl:pl-2">
        <div className="border-b border-black/8 pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Human context sheet' : 'Human context sheet'}</p>
          <h3 className="mt-4 max-w-[36rem] text-[2.7rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
            {isZh ? '礼物会被谁接住，也要写得足够具体。' : 'The receiver and the situation must be written with equal precision.'}
          </h3>
          <p className="mt-4 max-w-[42rem] text-sm leading-8 text-[#69707d]">
            {isZh
              ? '请把人物、场合与关系写具体，让系统判断同一份礼物会被怎样理解。'
              : 'Write the person, occasion, and relationship with precision so the system can judge how the same object will be understood.'}
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-8 overflow-hidden pt-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="space-y-8 overflow-auto pr-1">
            <article className="border-b border-black/8 pb-6">
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Scene script' : 'Scene script'}</label>
              <p className="mt-2 text-[1.08rem] font-serif leading-8 text-[#1d1a17]">{scenePrompt}</p>
              <div className="mt-2 px-1">
                <select value={sceneTemplate} onChange={event => onSceneTemplateChange(event.target.value)} className={inputClassName}>
                  {sceneTemplateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {activeSceneTemplate && <p className="mt-3 text-sm leading-7 text-[#7b808c]">{isZh ? activeSceneTemplate.promptZh : activeSceneTemplate.promptEn}</p>}
            </article>

            <article className="border-b border-black/8 pb-6">
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Recipient / 关系对象' : 'Recipient'}</label>
              <p className="mt-2 text-[1.08rem] font-serif leading-8 text-[#1d1a17]">{recipientPrompt}</p>
              <div className="mt-2 px-1">
                <select value={targetGroup} onChange={event => onTargetGroupChange(event.target.value as AudienceGroup)} className={inputClassName}>
                  {audienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {targetGroup === 'other' && (
                <input
                  value={customAudienceGroup}
                  onChange={event => onCustomAudienceGroupChange(event.target.value)}
                  placeholder={isZh ? '补充对象描述' : 'Add a finer note on the recipient'}
                  className={`${inputClassName} mt-3`}
                />
              )}
              <input
                value={occasion}
                onChange={event => onOccasionChange(event.target.value)}
                placeholder={isZh ? '例如：生日、拜访、合作初见、节庆问候' : 'e.g. birthday, first visit, opening meeting, festive greeting'}
                className={`${inputClassName} mt-3`}
              />
            </article>

            <article>
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Human profile note / 人物侧写' : 'Human profile note'}</label>
              <p className="mt-2 text-[1.08rem] font-serif leading-8 text-[#1d1a17]">{profilePrompt}</p>
              <textarea
                value={targetProfile}
                onChange={event => onTargetProfileChange(event.target.value)}
                placeholder={isZh ? '补充兴趣、职业语气、文化背景、生活方式与关系边界。' : 'Add interests, professional tone, cultural background, lifestyle, and relational boundary.'}
                rows={5}
                className={`${inputClassName} mt-2 min-h-[9rem] resize-none`}
              />
            </article>
          </div>

          <div className="space-y-8 overflow-auto pr-1">
            <div className="grid gap-5 sm:grid-cols-3">
              {profileCards.map(card => (
                <div key={card.label} className="border-b border-black/8 pb-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{card.label}</p>
                  <div className="mt-2 px-1">
                    <select value={card.value} onChange={event => card.onChange(event.target.value)} className={inputClassName}>
                      {card.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="border-b border-black/8 pb-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Budget' : 'Budget'}</p>
                <div className="mt-2 px-1">
                  <select value={budgetRange} onChange={event => onBudgetRangeChange(event.target.value)} className={inputClassName}>
                    {budgetOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-b border-black/8 pb-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Formality' : 'Formality'}</p>
                <div className="mt-2 px-1">
                  <select value={formality} onChange={event => onFormalityChange(event.target.value)} className={inputClassName}>
                    {formalityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-black/8 pt-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Editorial note' : 'Editorial note'}</p>
              <p className="mt-3 text-sm leading-8 text-[#69707d]">
                {isZh
                  ? '预算会改变材质与期待，正式度会改变语言与送达方式；但真正决定高级与否的，始终是你对关系边界的理解。'
                  : 'Budget changes material expectation, formality changes language and delivery, but what ultimately determines tact is your grasp of the relational boundary.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
