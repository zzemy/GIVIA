'use client'

import { motion } from 'framer-motion'
import { homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import { cn } from '@/lib/utils'
import type { AudienceGroup, Locale, SelectOption } from '@/components/gifting/home/types'

interface CountryStepAudienceCardProps {
  locale: Locale
  selectedAudienceLabel: string
  audienceOptions: SelectOption[]
  targetGroup: AudienceGroup
  customAudienceGroup: string
  occasion: string
  targetProfile: string
  profileFieldClassName: string
  profileLabelClassName: string
  profileControlClassName: string
  cardBaseClassName: string
  onTargetGroupChange: (value: AudienceGroup) => void
  onCustomAudienceGroupChange: (value: string) => void
  onOccasionChange: (value: string) => void
  onTargetProfileChange: (value: string) => void
}

export function CountryStepAudienceCard({
  locale,
  selectedAudienceLabel,
  audienceOptions,
  targetGroup,
  customAudienceGroup,
  occasion,
  targetProfile,
  profileFieldClassName,
  profileLabelClassName,
  profileControlClassName,
  cardBaseClassName,
  onTargetGroupChange,
  onCustomAudienceGroupChange,
  onOccasionChange,
  onTargetProfileChange,
}: CountryStepAudienceCardProps) {
  const isZh = locale === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.19 }}
      whileHover={{ y: -1 }}
      className={`${cardBaseClassName} flex h-full flex-col`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '对象与场景备注' : 'Audience and notes'}</p>
          <p className={`mt-1 text-sm ${homeText.body}`}>
            {isZh ? '先锁定对象，再补充场合和个性偏好。' : 'Lock the recipient type first, then add scenario notes and personal preferences.'}
          </p>
        </div>
        <span className={homeSurface.glassStrip}>{selectedAudienceLabel}</span>
      </div>

      <div className={`mt-4 p-3.5 sm:p-4 ${homeSurface.quiet}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{isZh ? '群体标签' : 'Audience tags'}</p>
            <p className="mt-1 text-xs leading-5 text-slate-300/84">
              {isZh
                ? '先锁定收礼人类型，再补充场景备注与个性需求。'
                : 'Lock the recipient type first, then add scenario notes and personal preferences.'}
            </p>
          </div>
          <div className={homeSurface.glassStrip}>{isZh ? '可继续自定义' : 'Fully customizable'}</div>
        </div>

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {audienceOptions.map(option => {
            const isActive = targetGroup === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onTargetGroupChange(option.value as AudienceGroup)}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-2 text-left text-xs font-medium transition-all duration-200 sm:shrink',
                  isActive
                    ? 'border-[#e7d2af]/24 bg-[#e7d2af]/10 text-[#f7e8cd] shadow-[0_8px_20px_rgba(12,16,30,0.14)]'
                    : 'border-white/9 bg-white/[0.03] text-slate-200 hover:border-white/16 hover:bg-white/[0.045]',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {targetGroup === 'other' && (
          <div className={`mt-3 p-3 ${homeSurface.inset}`}>
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

      <div className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <div className={`${profileFieldClassName} flex min-h-[10.5rem] flex-col`}>
          <p className={profileLabelClassName}>{isZh ? '场合关键词' : 'Occasion keywords'}</p>
          <input
            value={occasion}
            onChange={event => onOccasionChange(event.target.value)}
            placeholder={isZh ? '如：生日晚宴、客户来访、节日问候' : 'e.g. birthday dinner, client visit, festive note'}
            className={`${profileControlClassName} h-11`}
          />
          <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">
            {isZh ? '建议写成一句真实场景，方便分析送礼时机与表达方式。' : 'A short real-world moment helps the analysis adjust timing and phrasing.'}
          </p>
        </div>

        <div className={`${profileFieldClassName} flex min-h-[10.5rem] flex-col`}>
          <p className={profileLabelClassName}>{isZh ? '补充备注' : 'Additional notes'}</p>
          <textarea
            value={targetProfile}
            onChange={event => onTargetProfileChange(event.target.value)}
            rows={1}
            placeholder={
              isZh ? '例如品牌偏好、禁忌颜色、收礼人近期需求' : 'Brand preferences, colors to avoid, recipient needs'
            }
            className={`${homeControl.input} mt-3 h-11 resize-none overflow-hidden`}
          />
          <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">
            {isZh ? '这些备注会同步影响替代礼物、包装和贺卡语气建议。' : 'These notes also flow into safer alternatives, packaging, and card tone.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
