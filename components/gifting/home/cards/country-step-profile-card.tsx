'use client'

import { motion } from 'framer-motion'
import type { Locale, SelectOption } from '@/components/gifting/home/types'

interface CountryStepProfileCardProps {
  locale: Locale
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
  profileFieldClassName: string
  profileControlClassName: string
  cardBaseClassName: string
  onAgeBandChange: (value: string) => void
  onGenderChange: (value: string) => void
  onOccupationChange: (value: string) => void
  onRelationshipChange: (value: string) => void
  onBudgetRangeChange: (value: string) => void
  onFormalityChange: (value: string) => void
}

function SelectField({
  label,
  value,
  options,
  className,
  controlClassName,
  onChange,
}: {
  label: string
  value: string
  options: SelectOption[]
  className: string
  controlClassName: string
  onChange: (value: string) => void
}) {
  return (
    <div className={className}>
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <select value={value} onChange={event => onChange(event.target.value)} className={controlClassName}>
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-[#0f1f35] text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function CountryStepProfileCard({
  locale,
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
  profileFieldClassName,
  profileControlClassName,
  cardBaseClassName,
  onAgeBandChange,
  onGenderChange,
  onOccupationChange,
  onRelationshipChange,
  onBudgetRangeChange,
  onFormalityChange,
}: CountryStepProfileCardProps) {
  const isZh = locale === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      whileHover={{ y: -1 }}
      className={`${cardBaseClassName} flex h-full flex-col`}
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
        <SelectField
          label={isZh ? '年龄' : 'Age'}
          value={ageBand}
          options={ageBandOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onAgeBandChange}
        />
        <SelectField
          label={isZh ? '性别偏向' : 'Gender tone'}
          value={gender}
          options={genderOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onGenderChange}
        />
        <SelectField
          label={isZh ? '职业' : 'Occupation'}
          value={occupation}
          options={occupationOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onOccupationChange}
        />
        <SelectField
          label={isZh ? '关系' : 'Relationship'}
          value={relationship}
          options={relationshipOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onRelationshipChange}
        />
        <SelectField
          label={isZh ? '预算' : 'Budget'}
          value={budgetRange}
          options={budgetOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onBudgetRangeChange}
        />
        <SelectField
          label={isZh ? '正式程度' : 'Formality'}
          value={formality}
          options={formalityOptions}
          className={profileFieldClassName}
          controlClassName={profileControlClassName}
          onChange={onFormalityChange}
        />
      </div>
    </motion.div>
  )
}
