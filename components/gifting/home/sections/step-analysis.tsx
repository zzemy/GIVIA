'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, SlidersHorizontal, Sparkles, Wand2, Box, Plane, LineChart, Network } from 'lucide-react'
import { getCountryName } from '@/lib/countries'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { EnhancementSettings, Locale, RecognitionResult, SelectOption } from '@/components/gifting/home/types'

export interface StepAnalysisProps {
  locale: Locale
  t: (path: string) => string
  selectedCountry: string
  recognition: RecognitionResult | null
  hasGiftInput: boolean
  selectedFile: File | null
  selectedAudienceLabel: string
  activeSceneTemplate: SceneTemplate | null
  hasEnabledAnalysisEnhancement: boolean
  analysisEnhancementSettings: EnhancementSettings
  enhancementOriginCountry: string
  enhancementOriginOptions: SelectOption[]
  canAnalyze: boolean
  hasAnalysis: boolean
  isAnalyzing: boolean
  analyzingElapsedSeconds: number
  isAudienceReady: boolean
  giftName: string
  onEnhancementSettingChange: (key: keyof EnhancementSettings, checked: boolean) => void
  onEnhancementOriginCountryChange: (value: string) => void
  onAnalyze: () => void | Promise<void>
  
  accentClass?: string
  textAccent?: string
  themeBg?: string
}

export function StepAnalysis(props: StepAnalysisProps) {
  const {
    locale, selectedCountry, selectedAudienceLabel,
    hasEnabledAnalysisEnhancement, analysisEnhancementSettings,
    canAnalyze, isAnalyzing, giftName,
    onEnhancementSettingChange, onAnalyze,
    accentClass = "bg-amber-500",
    textAccent = "text-amber-600",
    themeBg = "bg-amber-50"
  } = props

  const isZh = locale === 'zh'
  const countryName = getCountryName(selectedCountry, locale)
  
  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-[#E5E0D8]/50 text-center">
         <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${themeBg} ${textAccent} mb-6 shadow-inner`}>
           <SlidersHorizontal className="w-8 h-8" />
         </div>
         <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17] tracking-tight mb-4">
           {isZh ? '确认分析参数' : 'Confirm Analysis Matrix'}
         </h2>
         
         <div className="flex flex-wrap justify-center gap-4 text-sm mt-8">
           {giftName && (
             <div className="px-5 py-3 rounded-full bg-[#FCFAFA] border border-[#E5E0D8] text-[#5C5A55] font-medium flex items-center gap-2 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
               {giftName}
             </div>
           )}
           {countryName && (
             <div className="px-5 py-3 rounded-full bg-[#FCFAFA] border border-[#E5E0D8] text-[#5C5A55] font-medium flex items-center gap-2 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
               {countryName}
             </div>
           )}
           {selectedAudienceLabel && (
             <div className="px-5 py-3 rounded-full bg-[#FCFAFA] border border-[#E5E0D8] text-[#5C5A55] font-medium flex items-center gap-2 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-rose-400"></span>
               {selectedAudienceLabel}
             </div>
           )}
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] border border-[#E5E0D8]/50">
        <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => onEnhancementSettingChange('multimodal', !analysisEnhancementSettings.multimodal)}>
          <div>
            <h3 className="text-xl font-serif text-[#1C1A17] flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${textAccent}`} />
              {isZh ? '启用高级深度分析内核 (P1 - P3)' : 'Enable Advanced Deep Context Engine'}
            </h3>
            <p className="text-[#A09A8F] text-sm mt-1 font-light">
              {isZh ? '通过综合图谱、多模态及跨文化物流模型挖掘更多隐藏洞察' : 'Utilize comprehensive graphs, multimodal and cross-cultural logistics models for hidden insights.'}
            </p>
          </div>
          
          <div className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ease-in-out ${hasEnabledAnalysisEnhancement ? accentClass : 'bg-[#E5E0D8]'}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ease-in-out ${hasEnabledAnalysisEnhancement ? 'translate-x-8 shadow-sm' : 'translate-x-1 shadow-none'}`} />
          </div>
        </div>

        <AnimatePresence>
          {hasEnabledAnalysisEnhancement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#E5E0D8] pt-8"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'multimodal', label: isZh ? '多模态深度解析' : 'Multimodal Vision', icon: Box, desc: isZh ? '分析包装与材质隐喻' : 'Analyze packaging elements' },
                  { key: 'collaborativeFiltering', label: isZh ? '协同过滤推荐' : 'Collaborative Context', icon: Network, desc: isZh ? '匹配真实高净值案例' : 'Match real HNWI cases' },
                  { key: 'logistics', label: isZh ? '跨境运力与禁运检测' : 'Logistics Intelligence', icon: Plane, desc: isZh ? '实效与海关合规预览' : 'Customs & transport context' },
                  { key: 'knowledgeGraph', label: isZh ? '文化语义图谱' : 'Cultural Knowledge Graph', icon: LineChart, desc: isZh ? '深层符号与历史回溯' : 'Deep historical references' },
                ].map((feature) => (
                  <div 
                    key={feature.key}
                    onClick={() => onEnhancementSettingChange(feature.key as keyof EnhancementSettings, !analysisEnhancementSettings[feature.key as keyof EnhancementSettings])}
                    className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                      analysisEnhancementSettings[feature.key as keyof EnhancementSettings]
                        ? `${themeBg} border-transparent shadow-sm`
                        : 'bg-[#FCFAFA] border-[#E5E0D8] hover:border-[#D0CBC1]'
                    }`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      analysisEnhancementSettings[feature.key as keyof EnhancementSettings] ? 'bg-white shadow-sm' : 'bg-white border border-[#E5E0D8]'
                    }`}>
                      <feature.icon className={`w-5 h-5 ${analysisEnhancementSettings[feature.key as keyof EnhancementSettings] ? textAccent : 'text-[#A09A8F]'}`} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold mb-1 ${analysisEnhancementSettings[feature.key as keyof EnhancementSettings] ? textAccent : 'text-[#1C1A17]'}`}>
                        {feature.label}
                      </h4>
                      <p className={`text-xs ${analysisEnhancementSettings[feature.key as keyof EnhancementSettings] ? `${textAccent} opacity-80` : 'text-[#A09A8F]'}`}>
                        {feature.desc}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <CheckCircle2 className={`w-5 h-5 ${analysisEnhancementSettings[feature.key as keyof EnhancementSettings] ? textAccent : 'text-[#E5E0D8]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className={`group flex items-center gap-3 px-12 py-5 rounded-full text-white font-medium text-lg tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${accentClass}`}
        >
          <span className="relative z-10">{isAnalyzing ? (isZh ? '推演中...' : 'Analyzing...') : (isZh ? '开始文化推演' : 'Execute Analysis')}</span>
          {!isAnalyzing && <Wand2 className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" /> }
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        </button>
      </div>
    </div>
  )
}
