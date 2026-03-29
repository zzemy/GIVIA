'use client'

import React from 'react'
import { Globe2, Search } from 'lucide-react'
import { COUNTRIES, COUNTRIES_BY_REGION, POPULAR_COUNTRIES } from '@/lib/countries'
import type { Locale, SelectOption } from '@/components/gifting/home/types'

type RegionKey = keyof typeof COUNTRIES_BY_REGION

export const inputClassName =
  'mt-3 w-full rounded-[1.25rem] border border-[rgba(74,63,51,0.1)] bg-[rgba(255,255,255,0.92)] px-4 py-3 text-[14px] leading-6 text-[#201a16] transition placeholder:text-[#9a9287] focus:border-[rgba(45,138,105,0.26)] focus:bg-white focus:outline-none focus:ring-0'

const sheetClassName =
  'overflow-hidden rounded-[1.8rem] border border-[rgba(74,63,51,0.09)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,245,238,0.84))] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]'

export function ChoicePills({
  options,
  value,
  onChange,
  columns = 'grid-cols-2',
}: {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  columns?: string
}) {
  return (
    <div className={`mt-4 grid gap-2 ${columns}`}>
      {options.map(option => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-w-0 rounded-full border px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.16em] transition ${
              active
                ? 'border-transparent bg-[#ebf4ef] text-[#235543] shadow-[0_16px_28px_-24px_rgba(44,109,85,0.45)]'
                : 'border-[rgba(74,63,51,0.08)] bg-white/94 text-[#6f675d] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function InlineCountrySelector({
  locale,
  value,
  onChange,
}: {
  locale: Locale
  value: string
  onChange: (value: string) => void
}) {
  const isZh = locale === 'zh'
  const selectedCountry = COUNTRIES.find(country => country.code === value)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeRegion, setActiveRegion] = React.useState<RegionKey>(selectedCountry?.region ?? 'asia')

  React.useEffect(() => {
    if (selectedCountry?.region) {
      setActiveRegion(selectedCountry.region)
    }
  }, [selectedCountry?.region])

  const regionLabels: Record<RegionKey, string> = isZh
    ? {
        asia: '亚洲',
        europe: '欧洲',
        americas: '美洲',
        africa: '非洲',
        oceania: '大洋洲',
      }
    : {
        asia: 'Asia',
        europe: 'Europe',
        americas: 'Americas',
        africa: 'Africa',
        oceania: 'Oceania',
      }

  const filteredCountries = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      return null
    }

    return COUNTRIES.filter(country => {
      const name = isZh ? country.nameZh : country.nameEn
      return name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term)
    })
  }, [isZh, searchTerm])

  const visibleCountries = (filteredCountries ?? COUNTRIES_BY_REGION[activeRegion]).slice(0, filteredCountries ? 12 : 10)

  return (
    <div className="mt-5 space-y-4">
      <div className="relative border-b border-[rgba(74,63,51,0.08)] pb-3">
        <Search size={16} className="absolute left-0 top-1 text-[#98a2b3]" />
        <input
          type="text"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder={isZh ? '搜索国家或地区代码' : 'Search country or code'}
          className="w-full bg-transparent pl-7 text-sm text-[#1b1714] placeholder:text-[#98a2b3] focus:outline-none"
        />
      </div>

      {selectedCountry ? (
        <div className="rounded-[1rem] border border-[rgba(45,138,105,0.12)] bg-[#eef6f1] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#7d8f88]">{isZh ? '当前写定' : 'Current selection'}</p>
          <p className="mt-1 text-[14px] text-[#224f3f]">{isZh ? selectedCountry.nameZh : selectedCountry.nameEn}</p>
        </div>
      ) : null}

      {!filteredCountries ? (
        <>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '常用目的地' : 'Common routes'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR_COUNTRIES.map(country => {
                const active = country.code === value

                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => onChange(country.code)}
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                      active
                        ? 'border-transparent bg-[#ebf4ef] text-[#235543]'
                        : 'border-[rgba(74,63,51,0.08)] bg-white/92 text-[#6f675d] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
                    }`}
                  >
                    {isZh ? country.nameZh : country.nameEn}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '按地区查看' : 'Browse by region'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(COUNTRIES_BY_REGION) as RegionKey[]).map(region => {
                const active = region === activeRegion

                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                    className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition ${
                      active
                        ? 'border-transparent bg-[#f1ece6] text-[#241d19]'
                        : 'border-[rgba(74,63,51,0.08)] bg-white/92 text-[#7d7469] hover:border-[rgba(74,63,51,0.16)] hover:text-[#241d19]'
                    }`}
                  >
                    {regionLabels[region]}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : null}

      <div className="rounded-[1.3rem] border border-[rgba(74,63,51,0.08)] bg-white/78 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4efe8] text-[#7d7469]">
            <Globe2 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">
              {filteredCountries ? (isZh ? '搜索结果' : 'Search results') : regionLabels[activeRegion]}
            </p>

            {visibleCountries.length > 0 ? (
              <>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {visibleCountries.map(country => {
                    const active = country.code === value

                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => onChange(country.code)}
                        className={`rounded-[1rem] border px-4 py-3 text-left transition ${
                          active
                            ? 'border-[rgba(45,138,105,0.14)] bg-[#eef6f1] text-[#224f3f]'
                            : 'border-[rgba(74,63,51,0.08)] bg-white/92 text-[#5f584f] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
                        }`}
                      >
                        <p className="truncate text-[0.96rem]">{isZh ? country.nameZh : country.nameEn}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{country.code}</p>
                      </button>
                    )
                  })}
                </div>
                {(filteredCountries ? filteredCountries.length : COUNTRIES_BY_REGION[activeRegion].length) > visibleCountries.length ? (
                  <p className="mt-3 text-[12px] leading-6 text-[#7d7469]">
                    {isZh ? '如需更多国家，直接搜索即可，不再在这里下滑。' : 'Search directly for more countries instead of scrolling inside this panel.'}
                  </p>
                ) : null}
              </>
            ) : (
              <div className="py-4 text-sm text-[#6d756c]">{isZh ? '没有找到匹配的国家。' : 'No country matched the current search.'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PromptSheet({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className={sheetClassName}>
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{label}</p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
