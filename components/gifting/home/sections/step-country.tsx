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

const controlClassName =
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
  const activeSceneLabel = activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : isZh ? '尚未设定场景' : 'Scene not set'

  const contextRibbon = [destinationLabel, selectedAudienceLabel, activeSceneLabel, budgetLabel, formalityLabel].filter(Boolean)

  const profileSelectors = [
    { label: isZh ? '年龄段' : 'Age band', value: ageBand, options: ageBandOptions, onChange: onAgeBandChange },
    { label: isZh ? '职业' : 'Occupation', value: occupation, options: occupationOptions, onChange: onOccupationChange },
    { label: isZh ? '关系边界' : 'Relationship', value: relationship, options: relationshipOptions, onChange: onRelationshipChange },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-8 overflow-hidden xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
    >
      <div className="grid min-h-0 gap-5 xl:grid-rows-[auto_minmax(0,1fr)_auto]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Destination chapter' : 'Destination chapter'}</p>
          <h3 className="mt-4 max-w-[28rem] text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
            {isZh ? '让人物、国家与场景站进同一页。' : 'Place person, country, and occasion on the same page.'}
          </h3>
          <p className="mt-4 max-w-[32rem] text-sm leading-8 text-[#69707d]">
            {isZh
              ? '国家只是背景。真正决定分寸的，是谁会接住这份礼物、在什么时刻接住它，以及关系里存在怎样的边界。'
              : 'Country is only the backdrop. Tact is really shaped by who receives the gift, at what moment, and within what kind of boundary.'}
          </p>
        </div>

        <div className="rounded-[2.8rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,240,234,0.9))] p-6 shadow-[0_34px_82px_-56px_rgba(15,23,42,0.16)] sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '文化落点' : 'Cultural destination'}</p>
          <p className="mt-4 text-[2.35rem] font-serif leading-tight text-[#1d1a17]">{destinationLabel}</p>
          {selectedCountry && <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#6c78ab]">{selectedCountry}</p>}

          <div className="mt-8">
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

          <div className="mt-8 grid gap-4 border-t border-black/8 pt-5">
            {[
              isZh ? '不要只想国家名，要想当地生活里“得体”的样子。' : 'Think beyond the country name and imagine what “appropriate” looks like there.',
              isZh ? '同一份礼物，换一个场合、换一种关系，文化读法也会立刻改变。' : 'The same gift is read differently as soon as the occasion or relationship changes.',
            ].map(line => (
              <p key={line} className="text-sm leading-7 text-[#69707d]">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-black/8 pt-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Context ribbon' : 'Context ribbon'}</p>
          <p className="mt-3 text-[1.08rem] font-serif leading-8 text-[#1d1a17]">{contextRibbon.join(' · ')}</p>
        </div>
      </div>

      <div className="min-h-0 overflow-auto pr-1">
        <div className="border-b border-black/8 pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Human context sheet' : 'Human context sheet'}</p>
          <h3 className="mt-4 max-w-[34rem] text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
            {isZh ? '把接收者、场合与关系写得更具体。' : 'Write the recipient, occasion, and relationship with more precision.'}
          </h3>
          <p className="mt-4 max-w-[36rem] text-sm leading-8 text-[#69707d]">
            {isZh
              ? '越具体，系统越能判断同一份礼物在不同文化里会显得亲切、正式、冒犯还是过度。'
              : 'The more specific this chapter becomes, the better the system can tell whether the same gift will feel warm, formal, excessive, or tone-deaf.'}
          </p>
        </div>

        <div className="space-y-8 pt-6">
          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Scene script' : 'Scene script'}</p>
            <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
              {isZh ? '它更像会出现在哪一种时刻与社会脚本里？' : 'What kind of moment or social script is this gesture entering?'}
            </p>
            <select value={sceneTemplate} onChange={event => onSceneTemplateChange(event.target.value)} className={`${controlClassName} mt-3`}>
              {sceneTemplateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {activeSceneTemplate && <p className="mt-3 text-sm leading-7 text-[#7b808c]">{isZh ? activeSceneTemplate.promptZh : activeSceneTemplate.promptEn}</p>}
          </article>

          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Recipient' : 'Recipient'}</p>
            <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
              {isZh ? '谁会接住它？这段关系更接近怎样的边界与礼貌？' : 'Who receives it, and what kind of boundary or courtesy defines the relationship?'}
            </p>

            <select value={targetGroup} onChange={event => onTargetGroupChange(event.target.value as AudienceGroup)} className={`${controlClassName} mt-3`}>
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
                placeholder={isZh ? '补充对象描述' : 'Add a finer note on the recipient'}
                className={`${controlClassName} mt-3`}
              />
            )}

            <input
              value={occasion}
              onChange={event => onOccasionChange(event.target.value)}
              placeholder={isZh ? '例如：到访、生日、合作初见、节庆问候' : 'e.g. first visit, birthday, opening meeting, festive greeting'}
              className={`${controlClassName} mt-3`}
            />
          </article>

          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Profile selectors' : 'Profile selectors'}</p>
            <div className="mt-3 grid gap-5 md:grid-cols-3">
              {profileSelectors.map(selector => (
                <div key={selector.label}>
                  <p className="text-sm font-medium text-[#1d1a17]">{selector.label}</p>
                  <select value={selector.value} onChange={event => selector.onChange(event.target.value)} className={`${controlClassName} mt-2`}>
                    {selector.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </article>

          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Budget and register' : 'Budget and register'}</p>
            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[#1d1a17]">{isZh ? '预算范围' : 'Budget'}</p>
                <select value={budgetRange} onChange={event => onBudgetRangeChange(event.target.value)} className={`${controlClassName} mt-2`}>
                  {budgetOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1d1a17]">{isZh ? '正式程度' : 'Formality'}</p>
                <select value={formality} onChange={event => onFormalityChange(event.target.value)} className={`${controlClassName} mt-2`}>
                  {formalityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </article>

          <article>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Human profile note' : 'Human profile note'}</p>
            <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
              {isZh ? '如果要为对方写一段人物侧写，你会补充什么背景？' : 'If you were writing a brief profile of the recipient, what would you add?'}
            </p>
            <textarea
              value={targetProfile}
              onChange={event => onTargetProfileChange(event.target.value)}
              placeholder={isZh ? '补充兴趣、生活方式、职业语气、文化背景和你们之间的距离。' : 'Add interests, lifestyle, professional tone, cultural background, and the distance between you.'}
              rows={6}
              className={`${controlClassName} mt-3 min-h-[10rem] resize-none`}
            />
            <p className="mt-3 text-sm leading-7 text-[#7b808c]">
              {isZh
                ? '真正高级的跨文化礼赠，首先来自对人的理解，而不是对商品的堆砌。'
                : 'Refined cross-cultural gifting begins with understanding the person, not with piling up products.'}
            </p>
          </article>
        </div>
      </div>
    </motion.section>
  )
}
