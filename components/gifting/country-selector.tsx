'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, Globe, Search, Star } from 'lucide-react'
import { homeControl } from '@/components/gifting/home/home-design-tokens'
import { COUNTRIES, COUNTRIES_BY_REGION, POPULAR_COUNTRIES } from '@/lib/countries'
import { cn } from '@/lib/utils'

interface CountrySelectorProps {
  value?: string
  onChange: (countryCode: string) => void
  locale?: 'en' | 'zh'
  regionLabels?: Record<string, string>
}

export function CountrySelector({
  value,
  onChange,
  locale = 'en',
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

  const selectedCountry = COUNTRIES.find(c => c.code === value)

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) {
      return null
    }

    const term = searchTerm.toLowerCase()
    return COUNTRIES.filter(c => (locale === 'en' ? c.nameEn.toLowerCase() : c.nameZh.toLowerCase()).includes(term))
  }, [searchTerm, locale])

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
          'w-full rounded-[1rem] border px-4 py-3 text-left transition-all duration-200',
          isActive
            ? 'border-[#4a5f97]/22 bg-[#eef2ff] shadow-[0_16px_30px_-24px_rgba(74,95,151,0.4)]'
            : 'border-transparent bg-transparent hover:border-black/6 hover:bg-[#faf6f0]',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#1f2937]">{locale === 'en' ? country.nameEn : country.nameZh}</span>
          <span className="text-[11px] tracking-[0.12em] text-[#98a2b3]">{country.code}</span>
        </div>
      </button>
    )
  }

  return (
    <div className={`relative w-full ${isOpen ? 'z-[180]' : 'z-20'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          `${homeControl.input} flex items-center justify-between gap-3 rounded-[1.25rem] px-4 py-3 text-left`,
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,244,238,0.94))] shadow-[0_16px_30px_-24px_rgba(15,23,42,0.16)] hover:border-[#4a5f97]/24 hover:bg-white',
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="rounded-full border border-[#4a5f97]/14 bg-[#eef2ff] p-1.5 text-[#4a5f97]">
            <Globe size={15} />
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm ${selectedCountry ? 'text-[#1f2937]' : 'text-[#667085]'}`}>
              {selectedCountry
                ? locale === 'en'
                  ? selectedCountry.nameEn
                  : selectedCountry.nameZh
                : locale === 'en'
                  ? 'Select destination country'
                  : '选择目标国家'}
            </p>
          </div>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-[#98a2b3] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-[190] w-full rounded-[1.6rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.98))] p-3 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.3)] backdrop-blur-2xl">
          <div className="rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] p-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-[#98a2b3]" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search...' : '搜索...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`${homeControl.input} py-3 pl-10 pr-3 text-sm`}
                autoFocus
              />
            </div>
          </div>

          <div className="country-selector-scroll mt-2 max-h-96 space-y-2 overflow-y-auto pr-1">
            {filteredCountries ? (
              filteredCountries.length > 0 ? (
                <div className="space-y-1 rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] p-2">
                  {filteredCountries.map(country => renderCountryRow(country))}
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] px-4 py-6 text-center text-sm text-[#667085]">
                  {locale === 'en' ? 'No results' : '未找到'}
                </div>
              )
            ) : (
              <>
                {POPULAR_COUNTRIES.length > 0 && (
                  <div className="rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b6b2d]">
                      <Star size={13} /> {locale === 'en' ? 'Popular' : '热门'}
                    </div>
                    <div className="space-y-1">{POPULAR_COUNTRIES.map(country => renderCountryRow(country))}</div>
                  </div>
                )}

                {(Object.keys(COUNTRIES_BY_REGION) as Array<keyof typeof COUNTRIES_BY_REGION>).map(region => {
                  const regionalCountries = COUNTRIES_BY_REGION[region].filter(country => !popularCountryCodes.has(country.code))

                  if (regionalCountries.length === 0) {
                    return null
                  }

                  return (
                    <div key={region} className="rounded-[1.25rem] border border-black/6 bg-[#fcfaf7] p-2">
                      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">
                        {regionLabels[region] || region}
                      </div>
                      <div className="space-y-1">{regionalCountries.map(country => renderCountryRow(country))}</div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
