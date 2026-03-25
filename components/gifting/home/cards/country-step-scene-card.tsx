'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SceneTemplate } from '@/lib/types/gifting-types'
import type { Locale, SceneTemplateOption } from '@/components/gifting/home/types'

interface CountryStepSceneCardProps {
  locale: Locale
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  sceneTemplateOptions: SceneTemplateOption[]
  selectedAudienceLabel: string
  budgetLabel: string
  formalityLabel: string
  templateHasAudienceOverride: boolean
  templateHasBudgetOverride: boolean
  templateHasFormalityOverride: boolean
  cardBaseClassName: string
  onSceneTemplateChange: (value: string) => void
}

export function CountryStepSceneCard({
  locale,
  activeSceneTemplate,
  sceneTemplate,
  sceneTemplateOptions,
  selectedAudienceLabel,
  budgetLabel,
  formalityLabel,
  templateHasAudienceOverride,
  templateHasBudgetOverride,
  templateHasFormalityOverride,
  cardBaseClassName,
  onSceneTemplateChange,
}: CountryStepSceneCardProps) {
  const isZh = locale === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      whileHover={{ y: -1 }}
      className={`${cardBaseClassName} flex h-full flex-col`}
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

      <div className="mt-4 grid gap-2.5 md:grid-cols-2">
        {sceneTemplateOptions.map((option, index) => {
          const isActive = sceneTemplate === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSceneTemplateChange(option.value)}
              className={cn(
                'rounded-2xl border px-3 py-3 text-left transition-all duration-200',
                isActive
                  ? 'border-cyan-200/44 bg-cyan-300/14 shadow-[0_14px_32px_rgba(34,211,238,0.10)]'
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
        <div className="mt-4 rounded-2xl border border-cyan-200/12 bg-[#0d1f35]/74 p-3.5">
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
  )
}
