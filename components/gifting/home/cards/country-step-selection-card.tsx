'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CountrySelector } from '@/components/gifting/country-selector'
import { withBasePath } from '@/lib/asset-path'
import { getCountryName } from '@/lib/countries'
import type { Locale } from '@/components/gifting/home/types'

interface CountryStepSelectionCardProps {
  locale: Locale
  apiLanguage: 'zh' | 'en'
  selectedCountry: string
  title: string
  description: string
  cardBaseClassName: string
  onSelectedCountryChange: (value: string) => void
}

export function CountryStepSelectionCard({
  locale,
  apiLanguage,
  selectedCountry,
  title,
  description,
  cardBaseClassName,
  onSelectedCountryChange,
}: CountryStepSelectionCardProps) {
  const isZh = locale === 'zh'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.13 }}
      whileHover={{ y: -1 }}
      className={`${cardBaseClassName} relative z-[160]`}
    >
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-400/15 pb-4">
        <div>
          <h2 className="mb-1.5 text-lg font-bold sm:text-xl">{title}</h2>
          <p className="text-xs text-gray-400 sm:text-sm">{description}</p>
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
  )
}
