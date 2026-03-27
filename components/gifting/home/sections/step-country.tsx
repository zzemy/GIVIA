'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CountrySelector } from '@/components/gifting/country-selector'
import { getCountryName } from '@/lib/countries'
import { MapPin, Target, Sparkles, Globe2, Layers, BookA } from 'lucide-react'
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
  accentClass?: string
  textAccent?: string
  themeBg?: string
}

export function StepCountry(props: StepCountryProps) {
  const {
    locale, t, selectedCountry, sceneTemplate, sceneTemplateOptions,
    onSelectedCountryChange, onSceneTemplateChange, occasion, onOccasionChange,
    accentClass = "bg-emerald-500", textAccent = "text-emerald-600", themeBg = "bg-emerald-50"
  } = props
  const isZh = locale === 'zh'
  const isCustomScene = sceneTemplate === 'custom'

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-[#E5E0D8]/50">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-full ${themeBg} ${textAccent} flex items-center justify-center`}>
            <Globe2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#1C1A17] tracking-tight">{isZh ? '选择文化语境' : 'Cultural Context'}</h2>
            <p className="text-[#A09A8F] mt-1">{isZh ? '定位礼物抵达的真实地标' : 'Select the destination landmark'}</p>
          </div>
        </div>
        <div className="pt-4">
          <CountrySelector
            value={selectedCountry}
            onChange={onSelectedCountryChange}
            locale={locale}
            
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-[#E5E0D8]/50">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 rounded-full ${themeBg} ${textAccent} flex items-center justify-center`}>
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-[#1C1A17] tracking-tight">{isZh ? '定义送礼场景' : 'Define Scene'}</h2>
            <p className="text-[#A09A8F] mt-1">{isZh ? '准确的受众映射与背景' : 'Audience mapping and background'}</p>
          </div>
        </div>

        <div className="pt-4 space-y-8">
          <div>
            <label className="block text-sm font-medium text-[#1C1A17] mb-4">
              {isZh ? '选择场景模板' : 'Scene Template'}
            </label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sceneTemplateOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSceneTemplateChange(opt.value)}
                  className={`flex flex-col items-start p-5 rounded-2xl border transition-all text-left group
                    ${sceneTemplate === opt.value
                      ? `${themeBg} border-transparent shadow-sm`
                      : 'bg-[#FCFAFA] border-[#E5E0D8] hover:border-[#D0CBC1]'
                    }`}
                >
                  <span className={`text-base font-medium mb-1 ${sceneTemplate === opt.value ? textAccent : 'text-[#1C1A17] group-hover:text-[#5C5A55]'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-sm ${sceneTemplate === opt.value ? `${textAccent} opacity-80` : 'text-[#A09A8F]'}`}>
                    {opt.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isCustomScene && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-4 border-t border-[#E5E0D8]"
              >
                <div>
                  <label className="block text-sm font-medium text-[#1C1A17] mb-2">{isZh ? '场合 / 目的' : 'Occasion / Core Objective'}</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => onOccasionChange(e.target.value)}
                    placeholder={isZh ? '例如：初次拜访高潜力渠道商...' : 'e.g., First visit to a high-potential distributor...'}
                    className="w-full bg-[#FCFAFA] border border-[#E5E0D8] text-[#1C1A17] placeholder:text-[#A09A8F] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
