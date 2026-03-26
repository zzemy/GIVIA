'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { Locale, SelectOption } from '@/components/gifting/home/types'

interface CountryStepSummaryCardProps {
  locale: Locale
  selectedCountry: string
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  selectedAudienceLabel: string
  budgetLabel: string
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
  budgetLabel,
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
  const statTileClassName = `px-3 py-2.5 ${homeSurface.quiet}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      whileHover={{ y: -1 }}
      className={`flex h-full flex-col p-4 transition-all duration-300 sm:p-6 ${homeSurface.inset}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '当前确认信息' : 'Current confirmation'}</p>
          <p className={`mt-1 text-sm ${homeText.body}`}>
            {isZh ? '这里只保留真正影响判断的关键信息，避免把表单内容重复堆叠。' : 'Keep only the values that truly shape the recommendation instead of repeating the full form.'}
          </p>
        </div>
        <span className={homeSurface.glassStrip}>
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
          { label: isZh ? '预算' : 'Budget', value: budgetLabel },
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`mt-4 p-4 ${homeSurface.quiet}`}>
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-[#e7d2af]" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.16em] text-[#e7d2af]/78">{isZh ? '已确认信息' : 'Confirmed details'}</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <p className="text-gray-300">{isZh ? '国家:' : 'Country:'} <span className="font-semibold text-[#f3ddba]">{getCountryName(selectedCountry, locale)}</span></p>
                  <p className="text-gray-300">{isZh ? '目标群体:' : 'Audience:'} <span className="font-semibold text-[#f3ddba]">{selectedAudienceLabel}</span></p>
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

      <div className={`mt-4 px-4 py-3 text-sm ${homeSurface.quiet}`}>
        {!recognitionReady
          ? locale === 'zh'
            ? '等待第一步完成后，这里的判断摘要会继续补全。'
            : 'Complete step 1 first, then this summary will fill in automatically.'
          : needsCustomAudience
            ? locale === 'zh'
              ? '还差“自定义群体描述”，补上后分析会更准确。'
              : 'Add the custom audience detail to make the recommendation more accurate.'
            : selectedCountry
              ? locale === 'zh'
                ? `当前已锁定 ${getCountryName(selectedCountry, locale)} 的送礼语境。`
                : `The gifting context is now locked to ${getCountryName(selectedCountry, locale)}.`
              : locale === 'zh'
                ? '请选择目标国家后继续。'
                : 'Choose a target country to continue.'}
      </div>
    </motion.div>
  )
}
