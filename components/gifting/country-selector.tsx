'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, Globe, Search, Star } from 'lucide-react'
import { homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
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
          'w-full rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200',
          isActive
            ? 'border-[#e7d2af]/24 bg-[#e7d2af]/10 shadow-[0_10px_24px_rgba(10,16,28,0.16)]'
            : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.04]',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-slate-100">{locale === 'en' ? country.nameEn : country.nameZh}</span>
          <span className="text-[11px] tracking-[0.12em] text-slate-400">{country.code}</span>
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
          `${homeControl.input} flex items-center justify-between gap-3 px-4 py-3 text-left`,
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] hover:border-[#e7d2af]/22 hover:bg-white/[0.045] focus:ring-2 focus:ring-[#e7d2af]/20',
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="rounded-full border border-[#e7d2af]/16 bg-[#e7d2af]/8 p-1.5 text-[#e7d2af]">
            <Globe size={15} />
          </div>
          <div className="min-w-0">
            <p className={`truncate text-sm ${selectedCountry ? 'text-slate-50' : homeText.muted}`}>
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
        <ChevronDown size={18} className={`shrink-0 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 top-[calc(100%+0.5rem)] z-[190] w-full p-2 shadow-[0_28px_80px_rgba(1,6,18,0.42)] ${homeSurface.secondary}`}>
          <div className={`p-3 ${homeSurface.inset}`}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-[#e7d2af]/72" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search...' : '搜索...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`${homeControl.input} py-2 pl-10 pr-3 text-sm`}
                autoFocus
              />
            </div>
          </div>

          <div className="country-selector-scroll mt-2 max-h-96 space-y-2 overflow-y-auto pr-1">
            {filteredCountries ? (
              filteredCountries.length > 0 ? (
                <div className={`space-y-1 p-1 ${homeSurface.inset}`}>
                  {filteredCountries.map(country => renderCountryRow(country))}
                </div>
              ) : (
                <div className={`px-4 py-6 text-center text-sm ${homeText.muted} ${homeSurface.inset}`}>
                  {locale === 'en' ? 'No results' : '未找到'}
                </div>
              )
            ) : (
              <>
                {POPULAR_COUNTRIES.length > 0 && (
                  <div className={`p-1 ${homeSurface.inset}`}>
                    <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f3ddba]">
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
                    <div key={region} className={`p-1 ${homeSurface.inset}`}>
                      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300/72">
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
