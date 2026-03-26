'use client'

import { Wallet, Truck } from 'lucide-react'
import { homeButton, homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StoredAnalysisRecord } from '@/lib/storage/analysis-storage'
import type {
  AssistantCurrency,
  FavoriteGiftChecklistItem,
  Locale,
  LogisticsAssistantResult,
} from '@/components/gifting/home/types'

interface WorkflowSupportPanelsProps {
  locale: Locale
  historyRecords: StoredAnalysisRecord[]
  favoriteGiftChecklist: FavoriteGiftChecklistItem[]
  assistantAmountInput: string
  assistantCurrency: AssistantCurrency
  assistantWeightInput: string
  assistantDeclaredValueInput: string
  assistantResult: LogisticsAssistantResult | null
  assistantError: string
  isAssistantLoading: boolean
  onAssistantAmountChange: (value: string) => void
  onAssistantCurrencyChange: (value: AssistantCurrency) => void
  onAssistantWeightChange: (value: string) => void
  onAssistantDeclaredValueChange: (value: string) => void
  onRunLogisticsAssistant: () => void | Promise<void>
}

interface HistoryPanelsProps {
  locale: Locale
  historyRecords: StoredAnalysisRecord[]
  favoriteGiftChecklist: FavoriteGiftChecklistItem[]
}

interface AssistantPanelProps {
  locale: Locale
  assistantAmountInput: string
  assistantCurrency: AssistantCurrency
  assistantWeightInput: string
  assistantDeclaredValueInput: string
  assistantResult: LogisticsAssistantResult | null
  assistantError: string
  isAssistantLoading: boolean
  onAssistantAmountChange: (value: string) => void
  onAssistantCurrencyChange: (value: AssistantCurrency) => void
  onAssistantWeightChange: (value: string) => void
  onAssistantDeclaredValueChange: (value: string) => void
  onRunLogisticsAssistant: () => void | Promise<void>
}

export function WorkflowSupportAssistantPanel({
  locale,
  assistantAmountInput,
  assistantCurrency,
  assistantWeightInput,
  assistantDeclaredValueInput,
  assistantResult,
  assistantError,
  isAssistantLoading,
  onAssistantAmountChange,
  onAssistantCurrencyChange,
  onAssistantWeightChange,
  onAssistantDeclaredValueChange,
  onRunLogisticsAssistant,
}: AssistantPanelProps) {
  const isZh = locale === 'zh'
  const helperInputClassName = `${homeControl.input} mt-2`

  return (
    <section className={`p-5 sm:p-6 ${homeSurface.inset}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-[#e7d2af]/18 bg-[#e7d2af]/8 p-2 text-[#f0ddb9]">
            <Wallet size={16} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/68">
              {isZh ? '辅助模块' : 'Support module'}
            </p>
            <h3 className="text-lg font-semibold text-slate-100 sm:text-xl">
              {isZh ? '跨境物流与支付助手' : 'Cross-border Logistics & Payment Assistant'}
            </h3>
          </div>
        </div>
        <span className={homeSurface.glassStrip}>
          {assistantResult?.rateSource === 'live' ? (isZh ? '实时汇率' : 'Live FX') : isZh ? '汇率回退' : 'Fallback FX'}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <div className={`p-3 ${homeSurface.quiet}`}>
          <p className={`text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
            {isZh ? '礼物价格' : 'Gift price'}
          </p>
          <input
            value={assistantAmountInput}
            onChange={event => onAssistantAmountChange(event.target.value)}
            className={helperInputClassName}
          />
        </div>

        <div className={`p-3 ${homeSurface.quiet}`}>
          <p className={`text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
            {isZh ? '币种' : 'Currency'}
          </p>
          <select
            value={assistantCurrency}
            onChange={event => onAssistantCurrencyChange(event.target.value as AssistantCurrency)}
            className={helperInputClassName}
          >
            {['USD', 'CNY', 'EUR', 'JPY', 'GBP'].map(currency => (
              <option key={currency} value={currency} className="bg-[#0f1f35] text-slate-100">
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className={`p-3 ${homeSurface.quiet}`}>
          <p className={`text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
            {isZh ? '重量(kg)' : 'Weight (kg)'}
          </p>
          <input
            value={assistantWeightInput}
            onChange={event => onAssistantWeightChange(event.target.value)}
            className={helperInputClassName}
          />
        </div>

        <div className={`p-3 ${homeSurface.quiet}`}>
          <p className={`text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
            {isZh ? '申报价值' : 'Declared value'}
          </p>
          <input
            value={assistantDeclaredValueInput}
            onChange={event => onAssistantDeclaredValueChange(event.target.value)}
            className={helperInputClassName}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={onRunLogisticsAssistant}
          disabled={isAssistantLoading}
          className={homeButton.primary}
        >
          <Truck size={16} className="mr-2" />
          {isAssistantLoading ? (isZh ? '估算中...' : 'Estimating...') : isZh ? '估算物流与支付' : 'Estimate logistics & payment'}
        </Button>
        {assistantError && <p className="text-sm text-red-300/90">{assistantError}</p>}
      </div>

      {assistantResult && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {Object.entries(assistantResult.convertedAmounts).map(([currency, value]) => (
              <div key={currency} className={`p-3 ${homeSurface.quiet}`}>
                <p className={`text-xs ${homeText.meta}`}>{currency}</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">{value.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {assistantResult.shippingQuotes.map(quote => (
              <div key={`${quote.provider}-${quote.service}`} className={`p-4 ${homeSurface.quiet}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{quote.provider}</p>
                  <span className="text-xs text-slate-300">
                    {quote.etaDays} {isZh ? '天' : 'days'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{quote.service}</p>
                <p className="mt-3 text-lg font-bold text-slate-100">
                  {quote.currency} {quote.estimatedCost.toFixed(2)}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-300/86">
                  {quote.notes.map(note => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`${homeSurface.quiet} border-[#e7d2af]/16 bg-[#e7d2af]/6 p-3`}>
            <p className="text-sm font-semibold text-amber-100/90">
              {isZh ? '清关注意事项' : 'Customs notes'}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-100/82">
              {assistantResult.customsNotes.map(note => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-amber-100/72">{assistantResult.disclaimer}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export function WorkflowSupportHistoryPanels({
  locale,
  historyRecords,
  favoriteGiftChecklist,
}: HistoryPanelsProps) {
  const isZh = locale === 'zh'

  if (historyRecords.length === 0 && favoriteGiftChecklist.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-6',
        historyRecords.length > 0 && favoriteGiftChecklist.length > 0 && '2xl:grid-cols-2',
      )}
    >
      {historyRecords.length > 0 && (
        <section className={`p-4 sm:p-6 ${homeSurface.inset}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/66">{isZh ? '辅助回顾' : 'Support history'}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-100">{isZh ? '历史记录' : 'History'}</h2>
              <p className={`mt-1 text-sm ${homeText.muted}`}>
                {isZh
                  ? '最近 8 次分析会保存在本地浏览器，便于复盘和继续筛选。'
                  : 'The latest 8 analyses are stored locally for review and follow-up decisions.'}
              </p>
            </div>
            <span className={homeSurface.glassStrip}>{historyRecords.length}</span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {historyRecords.map(record => (
              <article
                key={record.id}
                className={`p-4 shadow-[0_8px_22px_rgba(2,6,23,0.14)] ${homeSurface.quiet}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-slate-100">{record.giftName}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {record.countryName} · {record.audienceLabel}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] ${
                      record.riskLevel === 'High'
                        ? 'bg-red-500/15 text-red-200'
                        : record.riskLevel === 'Medium'
                          ? 'bg-amber-500/15 text-amber-200'
                          : 'bg-emerald-500/15 text-emerald-200'
                    }`}
                  >
                    {record.riskLevel} · {record.riskScore}
                  </span>
                </div>
                {record.recommendations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.recommendations.map(item => (
                      <span
                        key={`${record.id}-${item.id}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-100"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-[11px] text-slate-500">{new Date(record.createdAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {favoriteGiftChecklist.length > 0 && (
        <section className={`p-4 sm:p-6 ${homeSurface.inset}`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/66">{isZh ? '后续候选池' : 'Saved shortlist'}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-100">
                {isZh ? '收藏礼物清单' : 'Favorite Gift List'}
              </h2>
              <p className={`mt-1 text-sm ${homeText.muted}`}>
                {isZh ? '来自你的收藏记录，可作为后续送礼候选池。' : 'Saved picks from your previous analyses for future gifting checklists.'}
              </p>
            </div>
            <span className={homeSurface.glassStrip}>{favoriteGiftChecklist.length}</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {favoriteGiftChecklist.map(item => (
              <div key={item.id} className={`p-3 ${homeSurface.quiet}`}>
                <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                <p className="mt-1 text-xs text-slate-400">{item.category}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export function WorkflowSupportPanels(props: WorkflowSupportPanelsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkflowSupportAssistantPanel {...props} />
      <WorkflowSupportHistoryPanels
        locale={props.locale}
        historyRecords={props.historyRecords}
        favoriteGiftChecklist={props.favoriteGiftChecklist}
      />
    </div>
  )
}
