'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { COUNTRIES, COUNTRIES_BY_REGION, POPULAR_COUNTRIES } from '@/lib/countries'
import { cn } from '@/lib/utils'

interface CountrySelectorProps {
  value?: string
  onChange: (countryCode: string) => void
  locale?: 'en' | 'zh'
  regionLabels?: Record<string, string>
  compact?: boolean
}

export function CountrySelector({
  value,
  onChange,
  locale = 'en',
  compact = false,
  regionLabels = {
    asia: 'Asia',
    europe: 'Europe',
    americas: 'Americas',
    africa: 'Africa',
    oceania: 'Oceania',
  },
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const popularCountryCodes = useMemo(() => new Set(POPULAR_COUNTRIES.map(country => country.code)), [])

  const selectedCountry = COUNTRIES.find(country => country.code === value)

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) {
      return null
    }

    const term = searchTerm.toLowerCase()

    return COUNTRIES.filter(country => {
      const name = locale === 'en' ? country.nameEn : country.nameZh
      return name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term)
    })
  }, [locale, searchTerm])

  const handleSelect = (countryCode: string) => {
    onChange(countryCode)
    setIsOpen(false)
    setSearchTerm('')
  }

  const renderCountryRow = (country: (typeof COUNTRIES)[number]) => {
    const isActive = value === country.code

    return (
      <button
        key={country.code}
        type="button"
        onClick={() => handleSelect(country.code)}
        className={cn(
          'group flex w-full items-center justify-between gap-4 border-t border-[#E5E0D8]/80 py-3 text-left transition first:border-t-0',
          isActive ? 'text-[#1b1714]' : 'text-[#5d6572] hover:text-[#1b1714]',
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[1rem]">{locale === 'en' ? country.nameEn : country.nameZh}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{country.code}</p>
        </div>
        <span
          className={cn(
            'text-[10px] uppercase tracking-[0.2em] transition',
            isActive ? 'text-[#6175ca]' : 'text-transparent group-hover:text-[#98a2b3]',
          )}
        >
          {locale === 'en' ? 'Selected' : '已选'}
        </span>
      </button>
    )
  }

  return (
    <div className={`relative w-full ${isOpen ? 'z-[180]' : 'z-20'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className={`flex w-full items-center justify-between gap-4 text-left ${compact ? 'border border-[rgba(74,63,51,0.1)] rounded-[1.05rem] bg-white/74 px-4 py-3' : 'border-b border-[#E5E0D8]/80 pb-4'}`}
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{locale === 'en' ? 'Destination' : '目的地'}</p>
          <p className={`mt-2 truncate ${compact ? 'text-[1rem]' : 'text-[1.18rem] font-serif'} ${selectedCountry ? 'text-[#1b1714]' : 'text-[#69707d]'}`}>
            {selectedCountry
              ? locale === 'en'
                ? selectedCountry.nameEn
                : selectedCountry.nameZh
              : locale === 'en'
                ? 'Choose destination country'
                : '选择礼物将抵达的国家'}
          </p>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-[#98a2b3] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className={`absolute left-0 top-[calc(100%+0.85rem)] z-[190] w-full overflow-hidden border border-[#E5E0D8]/80 bg-white/95 shadow-[0_36px_90px_-46px_rgba(0,0,0,0.06)] backdrop-blur-2xl ${compact ? 'rounded-[1.6rem]' : 'rounded-[2.5rem]'}`}>
            <div className={`border-b border-[#E5E0D8]/80 ${compact ? 'px-4 py-4' : 'px-5 py-5'}`}>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#98a2b3]">{locale === 'en' ? 'Cultural destination' : '文化目的地'}</p>
              <p className={`mt-3 max-w-[28rem] leading-tight text-[#1b1714] ${compact ? 'text-[1.08rem]' : 'text-[1.4rem] font-serif'}`}>
                {locale === 'en' ? 'Choose where this gesture will be interpreted.' : '选择这份心意将被怎样的文化语境所理解。'}
              </p>

              <div className="relative mt-5 border-b border-[#E5E0D8]/80 pb-3">
                <Search size={16} className="absolute left-0 top-1 text-[#98a2b3]" />
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'Search country or code' : '搜索国家或地区代码'}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent pl-7 text-sm text-[#1b1714] placeholder:text-[#98a2b3] focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className={`country-selector-scroll overflow-y-auto ${compact ? 'max-h-[18rem] px-4 pb-4 pt-3' : 'max-h-[31rem] px-5 pb-5 pt-4'}`}>
              {filteredCountries ? (
                filteredCountries.length > 0 ? (
                  <section>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{locale === 'en' ? 'Search results' : '搜索结果'}</p>
                    <div className="mt-3">{filteredCountries.map(country => renderCountryRow(country))}</div>
                  </section>
                ) : (
                  <div className="py-10 text-center text-sm text-[#69707d]">
                    {locale === 'en' ? 'No country matched the current search.' : '没有找到匹配的国家。'}
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <section>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{locale === 'en' ? 'Common routes' : '常用目的地'}</p>
                    <div className="mt-3 grid gap-x-6 md:grid-cols-2">
                      {POPULAR_COUNTRIES.map(country => renderCountryRow(country))}
                    </div>
                  </section>

                  {(Object.keys(COUNTRIES_BY_REGION) as Array<keyof typeof COUNTRIES_BY_REGION>).map(region => {
                    const regionalCountries = COUNTRIES_BY_REGION[region].filter(country => !popularCountryCodes.has(country.code))

                    if (regionalCountries.length === 0) {
                      return null
                    }

                    return (
                      <section key={region}>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{regionLabels[region] || region}</p>
                        <div className="mt-3 grid gap-x-6 md:grid-cols-2">
                          {regionalCountries.map(country => renderCountryRow(country))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  )
}
