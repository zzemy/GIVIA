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
          'group w-full rounded-[1.35rem] border px-4 py-3 text-left transition-all duration-300',
          isActive
            ? 'border-[#6478cf]/18 bg-[#eef2ff] shadow-[0_18px_34px_-26px_rgba(100,120,207,0.28)]'
            : 'border-transparent bg-transparent hover:border-black/6 hover:bg-white',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[#1d1a17]">{locale === 'en' ? country.nameEn : country.nameZh}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#98a2b3] group-hover:text-[#6b7280]">{country.code}</p>
          </div>
          {isActive && <span className="text-[10px] uppercase tracking-[0.16em] text-[#6478cf]">Selected</span>}
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
          `${homeControl.input} flex items-center justify-between gap-3 rounded-[1.7rem] px-4 py-4 text-left`,
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,242,236,0.94))] shadow-[0_18px_34px_-26px_rgba(15,23,42,0.14)] hover:border-[#5b72d1]/18 hover:bg-white',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-full border border-[#5b72d1]/14 bg-[#eef2ff] p-2 text-[#5b72d1]">
            <Globe size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#98a2b3]">{locale === 'en' ? 'Destination' : '目的地'}</p>
            <p className={`mt-1 truncate text-sm ${selectedCountry ? 'text-[#1d1a17]' : 'text-[#69707d]'}`}>
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
        <ChevronDown size={18} className={`shrink-0 text-[#98a2b3] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+0.9rem)] z-[190] w-full overflow-hidden rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,238,0.98))] shadow-[0_36px_90px_-46px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
          <div className="border-b border-black/6 px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">{locale === 'en' ? 'Editorial selection' : '编辑选址'}</p>
                <p className="mt-2 text-[1.2rem] font-serif text-[#1d1a17]">
                  {locale === 'en' ? 'Choose the cultural destination' : '选择这份心意将抵达的文化目的地'}
                </p>
              </div>
              {selectedCountry && <p className="text-[10px] uppercase tracking-[0.18em] text-[#6478cf]">{selectedCountry.code}</p>}
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-black/6 bg-[#fcfaf7] p-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-[#98a2b3]" />
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'Search country or region mood...' : '搜索国家或文化目的地...'}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`${homeControl.input} py-3 pl-10 pr-3 text-sm`}
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="country-selector-scroll max-h-[32rem] overflow-y-auto px-4 py-4">
            {filteredCountries ? (
              filteredCountries.length > 0 ? (
                <div className="rounded-[1.5rem] border border-black/6 bg-[#fcfaf7] p-2">
                  <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#98a2b3]">
                    {locale === 'en' ? 'Search results' : '搜索结果'}
                  </div>
                  <div className="space-y-1">{filteredCountries.map(country => renderCountryRow(country))}</div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-black/6 bg-[#fcfaf7] px-5 py-8 text-center text-sm text-[#69707d]">
                  {locale === 'en' ? 'No country matched the current search.' : '没有找到匹配的国家。'}
                </div>
              )
            ) : (
              <div className="space-y-3">
                {POPULAR_COUNTRIES.length > 0 && (
                  <div className="rounded-[1.5rem] border border-black/6 bg-[#fcfaf7] p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#9b6b20]">
                      <Star size={12} /> {locale === 'en' ? 'Frequently chosen' : '常选目的地'}
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
                    <div key={region} className="rounded-[1.5rem] border border-black/6 bg-[#fcfaf7] p-2">
                      <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#98a2b3]">{regionLabels[region] || region}</div>
                      <div className="space-y-1">{regionalCountries.map(country => renderCountryRow(country))}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
