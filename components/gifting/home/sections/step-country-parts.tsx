'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { COUNTRIES, POPULAR_COUNTRIES } from '@/lib/countries'
import type { Locale, SelectOption } from '@/components/gifting/home/types'

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
    <div className={`mt-3 grid gap-2 ${columns}`}>
      {options.map(option => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-w-0 rounded-full border px-3 py-2 text-left text-[10px] uppercase tracking-[0.16em] transition sm:px-4 sm:py-2.5 sm:text-[11px] ${
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

  const filteredCountries = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return POPULAR_COUNTRIES.slice(0, 6)

    return COUNTRIES.filter(country => {
      const name = isZh ? country.nameZh : country.nameEn
      return name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term)
    }).slice(0, 6)
  }, [isZh, searchTerm])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredCountries.length > 0) {
      onChange(filteredCountries[0].code)
      setSearchTerm('')
      e.preventDefault()
    }
  }

  return (
    <div className="mt-3 space-y-4">
      <div className="relative border-b border-[rgba(74,63,51,0.08)] pb-3 transition-colors focus-within:border-[rgba(45,138,105,0.4)]">
        <Search size={16} className="absolute left-0 top-1 text-[#98a2b3] transition-colors focus-within:text-[#2d8a69]" />
        <input
          type="text"
          value={searchTerm}
          onChange={event => {
            setSearchTerm(event.target.value)
            if (value) onChange('')
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedCountry && !searchTerm ? (isZh ? selectedCountry.nameZh : selectedCountry.nameEn) : (isZh ? '输入国家名称或代码' : 'Type country name or code')}
          className={`w-full bg-transparent pl-7 pr-12 text-sm placeholder:text-[#98a2b3] focus:outline-none ${selectedCountry && !searchTerm ? 'text-[#224f3f] font-medium' : 'text-[#1b1714]'}`}
        />
        {selectedCountry && !searchTerm && (
          <div className="absolute right-0 top-0.5 rounded bg-[#eef6f1] px-2 py-0.5 text-[10px] font-medium tracking-wider text-[#224f3f]">
            {selectedCountry.code}
          </div>
        )}
      </div>

      {!selectedCountry || searchTerm.trim() ? (
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">
            {searchTerm.trim() ? (isZh ? '按回车直接选择' : 'Press Enter to select') : (isZh ? '常用目的地' : 'Common routes')}
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredCountries.map(country => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code)
                  setSearchTerm('')
                }}
                className="rounded-full border border-[rgba(74,63,51,0.08)] bg-white/92 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#6f675d] transition hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915] sm:px-4 sm:text-[11px]"
              >
                {isZh ? country.nameZh : country.nameEn}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <span className="py-1 text-[12px] text-[#98a2b3]">
                {isZh ? '未找到相关国家' : 'No countries found'}
              </span>
            )}
          </div>
        </div>
      ) : null}
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
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{label}</p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  )
}
