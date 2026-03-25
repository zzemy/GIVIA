'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { Locale, SelectOption } from '@/components/gifting/home/types'

interface CountryStepSummaryCardProps {
  locale: Locale
  selectedCountry: string
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  selectedAudienceLabel: string
  relationshipLabel: string
  budgetLabel: string
  occupationLabel: string
  formalityLabel: string
  ageBand: string
  ageBandOptions: SelectOption[]
  occupation: string
  occupationOptions: SelectOption[]
  relationship: string
  relationshipOptions: SelectOption[]
  budgetRange: string
  budgetOptions: SelectOption[]
  formality: string
  formalityOptions: SelectOption[]
  occasion: string
  targetProfile: string
  recognitionReady: boolean
  needsCustomAudience: boolean
}

export function CountryStepSummaryCard({
  locale,
  selectedCountry,
  activeSceneTemplate,
  sceneTemplate,
  selectedAudienceLabel,
  relationshipLabel,
  budgetLabel,
  occupationLabel,
  formalityLabel,
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
  occasion,
  targetProfile,
  recognitionReady,
  needsCustomAudience,
}: CountryStepSummaryCardProps) {
  const isZh = locale === 'zh'
  const statTileClassName = 'rounded-xl border border-slate-200/10 bg-slate-950/28 px-3 py-2.5'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      whileHover={{ y: -1 }}
      className="flex h-full flex-col rounded-2xl border border-sky-200/18 bg-gradient-to-br from-[#132842]/88 to-[#0f2239]/82 p-4 shadow-[0_10px_28px_rgba(3,12,28,0.22)] backdrop-blur-md transition-all duration-300 hover:border-sky-200/34 sm:p-6"
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

      <div className="mt-4 grid auto-rows-fr gap-2.5 sm:grid-cols-2">
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
          <div key={item.label} className={`${statTileClassName} flex min-h-[4.6rem] flex-col justify-center`}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCountry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl border border-sky-300/24 bg-sky-500/10 p-4 shadow-[inset_0_1px_0_rgba(186,230,253,0.1)]">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-sky-300" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.16em] text-sky-100/85">{isZh ? '已确认信息' : 'Confirmed details'}</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <p className="text-gray-300">{isZh ? '国家:' : 'Country:'} <span className="font-semibold text-sky-200">{getCountryName(selectedCountry, locale)}</span></p>
                  <p className="text-gray-300">{isZh ? '目标群体:' : 'Audience:'} <span className="font-semibold text-sky-200">{selectedAudienceLabel}</span></p>
                  <p className="text-gray-300">
                    {isZh ? '场景模板:' : 'Scene:'}{' '}
                    <span className="font-semibold text-sky-200">{activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate}</span>
                  </p>
                  <p className="text-xs text-slate-300/95">
                    {isZh ? '结构化画像:' : 'Structured profile:'}{' '}
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
                    <p className="text-xs text-slate-300/95">{isZh ? '场合说明:' : 'Occasion:'} <span className="text-slate-200">{occasion.trim()}</span></p>
                  )}
                  {targetProfile.trim() && (
                    <p className="text-xs text-slate-300/95">{isZh ? '补充备注:' : 'Notes:'} <span className="text-slate-200">{targetProfile}</span></p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button disabled className="mt-5 w-full cursor-default rounded-xl border border-slate-200/10 bg-slate-700/70 py-2.5 font-semibold text-slate-300/75">
        {!recognitionReady
          ? locale === 'zh'
            ? '等待第一步...'
            : 'Waiting for step 1...'
          : needsCustomAudience
            ? locale === 'zh'
              ? '请补充自定义群体描述'
              : 'Add custom audience details'
            : selectedCountry
              ? locale === 'zh'
                ? '国家已选择'
                : 'Country selected'
              : locale === 'zh'
                ? '请选择目标国家'
                : 'Please choose a country'}
      </Button>
    </motion.div>
  )
}
