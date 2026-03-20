'use client'

import React, { useState, useMemo } from 'react'
import { Search, Globe, ChevronDown, Star } from 'lucide-react'
import { COUNTRIES, POPULAR_COUNTRIES, COUNTRIES_BY_REGION } from '@/lib/countries'

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

  const selectedCountry = COUNTRIES.find(c => c.code === value)

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) {
      return null
    }

    const term = searchTerm.toLowerCase()
    return COUNTRIES.filter(c =>
      (locale === 'en'
        ? c.nameEn.toLowerCase()
        : c.nameZh.toLowerCase()
      ).includes(term)
    )
  }, [searchTerm, locale])

  const handleSelect = (countryCode: string) => {
    onChange(countryCode)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-sky-300/35 bg-slate-900/40 px-4 py-3 text-left transition-colors hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-sky-300" />
            <span className="text-white">
              {selectedCountry
                ? locale === 'en'
                  ? selectedCountry.nameEn
                  : selectedCountry.nameZh
                : locale === 'en'
                  ? 'Select destination country'
                  : '选择目标国家'}
            </span>
          </div>
          <ChevronDown size={18} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-sky-300/30 bg-[#0f1a2f] shadow-2xl">
          {/* Search bar */}
          <div className="border-b border-sky-300/20 p-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-sky-300" />
              <input
                type="text"
                placeholder={locale === 'en' ? 'Search...' : '搜索...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-sky-300/20 bg-white/5 py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                autoFocus
              />
            </div>
          </div>

          {/* Search results or grouped countries */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCountries ? (
              // Search results
              filteredCountries.length > 0 ? (
                filteredCountries.map(country => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country.code)}
                    className={`w-full px-4 py-2 text-left transition-colors hover:bg-sky-500/20 ${
                      value === country.code ? 'border-l-2 border-sky-300 bg-sky-500/25' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        {locale === 'en' ? country.nameEn : country.nameZh}
                      </span>
                      <span className="text-gray-400 text-sm">{country.code}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-400">
                  {locale === 'en' ? 'No results' : '未找到'}
                </div>
              )
            ) : (
              // Grouped countries
              <>
                {/* Popular section */}
                {POPULAR_COUNTRIES.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 border-b border-sky-300/20 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200">
                      <Star size={14} /> {locale === 'en' ? 'Popular' : '热门'}
                    </div>
                    {POPULAR_COUNTRIES.map(country => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleSelect(country.code)}
                        className={`w-full px-4 py-2 text-left transition-colors hover:bg-sky-500/20 ${
                          value === country.code ? 'border-l-2 border-sky-300 bg-sky-500/25' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white">
                            {locale === 'en' ? country.nameEn : country.nameZh}
                          </span>
                          <span className="text-gray-400 text-sm">{country.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Regions */}
                {(Object.keys(COUNTRIES_BY_REGION) as Array<keyof typeof COUNTRIES_BY_REGION>).map(
                  region => (
                    COUNTRIES_BY_REGION[region].length > 0 && (
                      <div key={region}>
                        <div className="mt-2 border-b border-sky-300/20 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200">
                          {regionLabels[region] || region}
                        </div>
                        {COUNTRIES_BY_REGION[region].map(country => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleSelect(country.code)}
                            className={`w-full px-4 py-2 text-left transition-colors hover:bg-sky-500/20 ${
                              value === country.code ? 'border-l-2 border-sky-300 bg-sky-500/25' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-white">
                                {locale === 'en' ? country.nameEn : country.nameZh}
                              </span>
                              <span className="text-gray-400 text-sm">{country.code}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  )
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
