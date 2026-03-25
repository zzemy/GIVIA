'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CountrySelector } from '@/components/gifting/country-selector'
import { withBasePath } from '@/lib/asset-path'
import { getCountryName } from '@/lib/countries'
import { cn } from '@/lib/utils'
import type { SceneTemplate } from '@/lib/p0-types'
import type {
  AudienceGroup,
  Locale,
  RecognitionResult,
  SceneTemplateOption,
  SelectOption,
} from '@/components/gifting/home/types'

interface StepCountryProps {
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
  relationshipLabel: string
  occupationLabel: string
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
  recognition,
  hasGiftInput,
  selectedFile,
  activeSceneTemplate,
  sceneTemplate,
  sceneTemplateOptions,
  selectedAudienceLabel,
  budgetLabel,
  formalityLabel,
  templateHasAudienceOverride,
  templateHasBudgetOverride,
  templateHasFormalityOverride,
  audienceOptions,
  targetGroup,
  customAudienceGroup,
  occasion,
  targetProfile,
  profileFieldClassName,
  profileLabelClassName,
  profileControlClassName,
  ageBand,
  ageBandOptions,
  gender,
  genderOptions,
  occupation,
  occupationOptions,
  relationship,
  relationshipOptions,
  budgetRange,
  budgetOptions,
  formality,
  formalityOptions,
  relationshipLabel,
  occupationLabel,
  onSelectedCountryChange,
  onSceneTemplateChange,
  onTargetGroupChange,
  onCustomAudienceGroupChange,
  onOccasionChange,
  onTargetProfileChange,
  onAgeBandChange,
  onGenderChange,
  onOccupationChange,
  onRelationshipChange,
  onBudgetRangeChange,
  onFormalityChange,
}: StepCountryProps) {
  const isZh = locale === 'zh'

  return (
    <div className="grid gap-4 sm:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13 }}
        whileHover={{ y: -4, scale: 1.005 }}
        className="rounded-2xl border border-cyan-200/18 bg-[#13253e]/88 p-4 backdrop-blur-md transition-colors hover:border-cyan-200/34 sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-400/15 pb-4">
          <div>
            <h2 className="mb-1.5 text-lg font-bold sm:text-xl">{t('country.title')}</h2>
            <p className="text-xs text-gray-400 sm:text-sm">{t('country.description')}</p>
          </div>
          <Image src={withBasePath('/brand/step-country.svg')} alt="country step" width={36} height={36} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/80">
              {isZh ? '国家选择' : 'Country selection'}
            </p>
            <p className="mt-1 text-sm text-slate-300/88">
              {isZh ? '先锁定目标国家，下面的场景与画像会围绕这个国家输出。' : 'Lock the destination first, then refine the scenario and audience around it.'}
            </p>
          </div>
          {selectedCountry && (
            <span className="rounded-full border border-cyan-200/22 bg-cyan-300/10 px-3 py-1 text-[11px] text-cyan-50/90">
              {getCountryName(selectedCountry, locale)}
            </span>
          )}
        </div>

        <div className="mt-4">
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
      </motion.div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          whileHover={{ y: -4, scale: 1.005 }}
          className="rounded-2xl border border-cyan-200/18 bg-[#13253e]/82 p-4 backdrop-blur-md transition-colors hover:border-cyan-200/34 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '送礼场景模板' : 'Scene template'}</p>
              <p className="mt-1 text-sm text-slate-300/88">
                {isZh ? '先选场景，再微调对象、预算和正式程度。' : 'Pick the scene first, then fine-tune audience, budget, and tone.'}
              </p>
            </div>
            {activeSceneTemplate && (
              <div className="shrink-0 whitespace-nowrap rounded-full border border-cyan-200/18 bg-cyan-300/10 px-3 py-1 text-[11px] text-cyan-50/88">
                {isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn}
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {sceneTemplateOptions.map((option, index) => {
              const isActive = sceneTemplate === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSceneTemplateChange(option.value)}
                  className={cn(
                    'rounded-2xl border px-3 py-3 text-left transition-all',
                    isActive
                      ? 'border-cyan-200/42 bg-cyan-300/12 shadow-[0_12px_30px_rgba(34,211,238,0.08)]'
                      : 'border-cyan-200/12 bg-[#0d1f35]/72 hover:border-cyan-200/28 hover:bg-[#102740]',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{option.label}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{option.hint}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex size-6 items-center justify-center rounded-full border text-[10px] font-medium',
                        isActive
                          ? 'border-cyan-100/30 bg-cyan-100/12 text-cyan-50'
                          : 'border-slate-200/10 bg-slate-200/5 text-slate-400',
                      )}
                    >
                      {isActive ? <CheckCircle size={12} /> : `0${index + 1}`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {activeSceneTemplate && (
            <div className="mt-4 rounded-xl border border-cyan-200/12 bg-[#0d1f35]/72 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '当前生效值' : 'Active values'}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300/84">
                <span className="rounded-full border border-cyan-200/12 bg-cyan-100/6 px-3 py-1">{isZh ? '对象：' : 'Audience: '}{selectedAudienceLabel}</span>
                <span className="rounded-full border border-cyan-200/12 bg-cyan-100/6 px-3 py-1">{isZh ? '预算：' : 'Budget: '}{budgetLabel}</span>
                <span className="rounded-full border border-cyan-200/12 bg-cyan-100/6 px-3 py-1">{isZh ? '正式度：' : 'Formality: '}{formalityLabel}</span>
                {(templateHasAudienceOverride || templateHasBudgetOverride || templateHasFormalityOverride) && (
                  <span className="rounded-full border border-amber-200/18 bg-amber-100/8 px-3 py-1 text-amber-100">
                    {isZh ? '已覆盖模板默认值' : 'Preset overridden'}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          whileHover={{ y: -4, scale: 1.005 }}
          className="rounded-2xl border border-cyan-200/18 bg-[#13253e]/82 p-4 backdrop-blur-md transition-colors hover:border-cyan-200/34 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '对象与场景备注' : 'Audience and notes'}</p>
              <p className="mt-1 text-sm text-slate-300/88">
                {isZh ? '先锁定对象，再补充场合和个性偏好。' : 'Lock the recipient type first, then add scenario notes and personal preferences.'}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full border border-cyan-200/18 bg-cyan-100/6 px-3 py-1 text-[11px] text-cyan-50/88">
              {selectedAudienceLabel}
            </span>
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-200/12 bg-[#0d1f35]/72 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '群体标签' : 'Audience tags'}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300/84">
                  {isZh
                    ? '先锁定收礼人类型，再补充场景备注与个性需求。'
                    : 'Lock the recipient type first, then add scenario notes and personal preferences.'}
                </p>
              </div>
              <div className="shrink-0 whitespace-nowrap rounded-full border border-slate-200/10 bg-slate-100/5 px-3 py-1 text-[11px] text-slate-300/78">
                {isZh ? '可继续自定义' : 'Fully customizable'}
              </div>
            </div>

            <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {audienceOptions.map(option => {
                const isActive = targetGroup === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onTargetGroupChange(option.value as AudienceGroup)}
                    className={cn(
                      'shrink-0 rounded-full border px-3 py-2 text-left text-xs font-medium transition-all sm:shrink',
                      isActive
                        ? 'border-cyan-200/42 bg-cyan-300/12 text-cyan-50'
                        : 'border-cyan-200/12 bg-[#0d1f35]/72 text-slate-200 hover:border-cyan-200/28 hover:bg-[#102740]',
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>

            {targetGroup === 'other' && (
              <div className="mt-3 rounded-2xl border border-cyan-200/12 bg-[#10253f]/62 p-3">
                <p className={profileLabelClassName}>{isZh ? '自定义群体' : 'Custom audience'}</p>
                <input
                  value={customAudienceGroup}
                  onChange={event => onCustomAudienceGroupChange(event.target.value)}
                  placeholder={isZh ? '请输入自定义目标群体，如：新婚夫妇、海外导师' : 'Custom audience, e.g. newlyweds, overseas mentor'}
                  className={profileControlClassName}
                />
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className={`${profileFieldClassName} min-h-[10rem]`}>
              <p className={profileLabelClassName}>{isZh ? '场合关键词' : 'Occasion keywords'}</p>
              <input
                value={occasion}
                onChange={event => onOccasionChange(event.target.value)}
                placeholder={isZh ? '如：生日晚宴、客户来访、节日问候' : 'e.g. birthday dinner, client visit, festive note'}
                className={profileControlClassName}
              />
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {isZh ? '建议写成一句真实场景，方便分析送礼时机与表达方式。' : 'A short real-world moment helps the analysis adjust timing and phrasing.'}
              </p>
            </div>

            <div className={`${profileFieldClassName} min-h-[10rem]`}>
              <p className={profileLabelClassName}>{isZh ? '补充备注' : 'Additional notes'}</p>
              <textarea
                value={targetProfile}
                onChange={event => onTargetProfileChange(event.target.value)}
                rows={3}
                placeholder={
                  isZh ? '例如品牌偏好、禁忌颜色、收礼人近期需求' : 'Brand preferences, colors to avoid, recipient needs'
                }
                className="mt-2 w-full resize-none rounded-xl border border-cyan-200/18 bg-[#0b1c31] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-cyan-200/45 focus:outline-none"
              />
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {isZh ? '这些备注会同步影响替代礼物、包装和贺卡语气建议。' : 'These notes also flow into safer alternatives, packaging, and card tone.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          whileHover={{ y: -4, scale: 1.005 }}
        className="rounded-2xl border border-cyan-200/18 bg-[#13253e]/82 p-4 backdrop-blur-md transition-colors hover:border-cyan-200/34 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="w-full">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '高级画像' : 'Advanced profile'}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300/82">
              {isZh ? '年龄、职业、预算和正式度会影响推荐语气与替代方案。' : 'Age, occupation, budget, and formality refine tone and fallback suggestions.'}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '年龄' : 'Age'}</p>
            <select value={ageBand} onChange={event => onAgeBandChange(event.target.value)} className={profileControlClassName}>
              {ageBandOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '性别偏向' : 'Gender tone'}</p>
            <select value={gender} onChange={event => onGenderChange(event.target.value)} className={profileControlClassName}>
              {genderOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '职业' : 'Occupation'}</p>
            <select value={occupation} onChange={event => onOccupationChange(event.target.value)} className={profileControlClassName}>
              {occupationOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '关系' : 'Relationship'}</p>
            <select value={relationship} onChange={event => onRelationshipChange(event.target.value)} className={profileControlClassName}>
              {relationshipOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '预算' : 'Budget'}</p>
            <select value={budgetRange} onChange={event => onBudgetRangeChange(event.target.value)} className={profileControlClassName}>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={profileFieldClassName}>
            <p className={profileLabelClassName}>{isZh ? '正式程度' : 'Formality'}</p>
            <select value={formality} onChange={event => onFormalityChange(event.target.value)} className={profileControlClassName}>
              {formalityOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -4, scale: 1.005 }}
          className="flex h-full flex-col rounded-2xl border border-sky-200/18 bg-[#13253e]/82 p-4 backdrop-blur-md transition-colors hover:border-sky-200/34 sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '当前确认信息' : 'Current confirmation'}</p>
              <p className="mt-1 text-sm text-slate-300/88">
                {isZh ? '这里集中看最终生效信息，不把所有字段继续堆回表单里。' : 'Final active values live here so the form stays readable instead of collapsing into one long wall.'}
              </p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full border border-cyan-200/18 bg-cyan-100/6 px-3 py-1 text-[11px] text-cyan-50/88">
              {isZh ? '实时生效' : 'Live values'}
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              {
                label: isZh ? '场景' : 'Scene',
                value: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate,
              },
              { label: isZh ? '对象' : 'Audience', value: selectedAudienceLabel },
              { label: isZh ? '关系' : 'Relationship', value: relationshipLabel },
              { label: isZh ? '预算' : 'Budget', value: budgetLabel },
              { label: isZh ? '职业' : 'Occupation', value: occupationLabel },
              { label: isZh ? '正式度' : 'Formality', value: formalityLabel },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-slate-200/10 bg-slate-950/28 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedCountry && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl border border-sky-300/24 bg-sky-500/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-sky-300" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-sky-100/85">{locale === 'zh' ? '已确认信息' : 'Confirmed details'}</p>
                    <div className="mt-2 space-y-1.5 text-sm">
                      <p className="text-gray-300">{locale === 'zh' ? '国家:' : 'Country:'} <span className="font-semibold text-sky-200">{getCountryName(selectedCountry, locale)}</span></p>
                      <p className="text-gray-300">{locale === 'zh' ? '目标群体:' : 'Audience:'} <span className="font-semibold text-sky-200">{selectedAudienceLabel}</span></p>
                      <p className="text-gray-300">
                        {locale === 'zh' ? '场景模板:' : 'Scene:'}{' '}
                        <span className="font-semibold text-sky-200">{activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate}</span>
                      </p>
                      <p className="text-xs text-slate-300/95">
                        {locale === 'zh' ? '结构化画像:' : 'Structured profile:'}{' '}
                        <span className="text-slate-200">
                          {[
                            ageBandOptions.find(option => option.value === ageBand)?.label,
                            occupationOptions.find(option => option.value === occupation)?.label,
                            relationshipOptions.find(option => option.value === relationship)?.label,
                            budgetOptions.find(option => option.value === budgetRange)?.label,
                            formalityOptions.find(option => option.value === formality)?.label,
                          ]
                            .filter(Boolean)
                            .join(' / ')}
                        </span>
                      </p>
                      {occasion.trim() && (
                        <p className="text-xs text-slate-300/95">{locale === 'zh' ? '场合说明:' : 'Occasion:'} <span className="text-slate-200">{occasion.trim()}</span></p>
                      )}
                      {targetProfile.trim() && (
                        <p className="text-xs text-slate-300/95">{locale === 'zh' ? '补充备注:' : 'Notes:'} <span className="text-slate-200">{targetProfile}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button disabled className="mt-auto w-full cursor-default rounded-lg bg-gray-700 py-2 font-semibold text-gray-400">
            {!recognition && !hasGiftInput && !selectedFile
              ? locale === 'zh'
                ? '等待第一步...'
                : 'Waiting for step 1...'
              : targetGroup === 'other' && !customAudienceGroup.trim()
                ? locale === 'zh'
                  ? '请补充自定义群体描述'
                  : 'Add custom audience details'
                : !recognition && hasGiftInput
                  ? locale === 'zh'
                    ? '已输入礼物信息，可直接开始分析'
                    : 'Gift info entered, ready for analysis'
                  : selectedCountry
                    ? locale === 'zh'
                      ? '国家已选择'
                      : 'Country selected'
                    : locale === 'zh'
                      ? '请选择目标国家'
                      : 'Please choose a country'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
