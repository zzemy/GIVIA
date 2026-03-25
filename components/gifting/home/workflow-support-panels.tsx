'use client'

import { Wallet, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StoredAnalysisRecord } from '@/lib/p0-storage'
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
  const isJa = locale === 'ja'
  const isFr = locale === 'fr'

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-cyan-200" />
          <h3 className="text-xl font-bold">
            {isZh
              ? '跨境物流与支付助手'
              : isJa
                ? '越境配送・決済アシスタント'
                : isFr
                  ? 'Assistant logistique et paiement'
                  : 'Cross-border Logistics & Payment Assistant'}
          </h3>
        </div>
        <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
          {assistantResult?.rateSource === 'live'
            ? isZh
              ? '实时汇率'
              : isJa
                ? 'リアルタイム為替'
                : isFr
                  ? 'Taux en direct'
                  : 'Live FX'
            : isZh
              ? '汇率回退'
              : isJa
                ? '為替フォールバック'
                : isFr
                  ? 'Taux de secours'
                  : 'Fallback FX'}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-xl border border-cyan-200/14 bg-[#0d1f35]/72 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
            {isZh ? '礼物价格' : isJa ? '商品価格' : isFr ? 'Prix du cadeau' : 'Gift price'}
          </p>
          <input
            value={assistantAmountInput}
            onChange={event => onAssistantAmountChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-cyan-200/18 bg-[#0b1c31] px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div className="rounded-xl border border-cyan-200/14 bg-[#0d1f35]/72 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
            {isZh ? '币种' : isJa ? '通貨' : isFr ? 'Devise' : 'Currency'}
          </p>
          <select
            value={assistantCurrency}
            onChange={event => onAssistantCurrencyChange(event.target.value as AssistantCurrency)}
            className="mt-2 w-full rounded-lg border border-cyan-200/18 bg-[#0b1c31] px-3 py-2 text-sm text-slate-100"
          >
            {['USD', 'CNY', 'EUR', 'JPY', 'GBP'].map(currency => (
              <option key={currency} value={currency} className="bg-[#0f1f35] text-slate-100">
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-cyan-200/14 bg-[#0d1f35]/72 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
            {isZh ? '重量(kg)' : isJa ? '重量(kg)' : isFr ? 'Poids (kg)' : 'Weight (kg)'}
          </p>
          <input
            value={assistantWeightInput}
            onChange={event => onAssistantWeightChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-cyan-200/18 bg-[#0b1c31] px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div className="rounded-xl border border-cyan-200/14 bg-[#0d1f35]/72 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
            {isZh ? '申报价值' : isJa ? '申告価格' : isFr ? 'Valeur déclarée' : 'Declared value'}
          </p>
          <input
            value={assistantDeclaredValueInput}
            onChange={event => onAssistantDeclaredValueChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-cyan-200/18 bg-[#0b1c31] px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={onRunLogisticsAssistant}
          disabled={isAssistantLoading}
          className="border border-cyan-200/45 bg-cyan-300/14 text-cyan-100 hover:bg-cyan-300/22"
        >
          <Truck size={16} className="mr-2" />
          {isAssistantLoading
            ? isZh
              ? '估算中...'
              : isJa
                ? '計算中...'
                : isFr
                  ? 'Calcul...'
                  : 'Estimating...'
            : isZh
              ? '估算物流与支付'
              : isJa
                ? '配送と決済を見積もる'
                : isFr
                  ? 'Estimer logistique & paiement'
                  : 'Estimate logistics & payment'}
        </Button>
        {assistantError && <p className="text-sm text-red-300">{assistantError}</p>}
      </div>

      {assistantResult && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {Object.entries(assistantResult.convertedAmounts).map(([currency, value]) => (
              <div key={currency} className="rounded-xl border border-slate-500/30 bg-slate-900/45 p-3">
                <p className="text-xs text-slate-400">{currency}</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">{value.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {assistantResult.shippingQuotes.map(quote => (
              <div key={`${quote.provider}-${quote.service}`} className="rounded-xl border border-cyan-300/20 bg-[#10253b]/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-cyan-100">{quote.provider}</p>
                  <span className="text-xs text-slate-300">
                    {quote.etaDays} {isZh ? '天' : isJa ? '日' : isFr ? 'jours' : 'days'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{quote.service}</p>
                <p className="mt-3 text-lg font-bold text-slate-100">
                  {quote.currency} {quote.estimatedCost.toFixed(2)}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-slate-300">
                  {quote.notes.map(note => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-300/20 bg-amber-500/8 p-3">
            <p className="text-sm font-semibold text-amber-200">
              {isZh ? '清关注意事项' : isJa ? '通関の注意点' : isFr ? 'Points de douane' : 'Customs notes'}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-100/90">
              {assistantResult.customsNotes.map(note => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-amber-100/80">{assistantResult.disclaimer}</p>
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
  const isJa = locale === 'ja'
  const isFr = locale === 'fr'

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
        <section className="rounded-2xl border border-cyan-200/20 bg-[#10243b]/70 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{isZh ? '历史记录' : 'History'}</h2>
              <p className="mt-1 text-sm text-slate-300">
                {isZh
                  ? '最近 8 次分析会保存在本地浏览器，便于复盘和继续筛选。'
                  : 'The latest 8 analyses are stored locally for review and follow-up decisions.'}
              </p>
            </div>
            <span className="rounded-full border border-cyan-200/25 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              {historyRecords.length}
            </span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {historyRecords.map(record => (
              <article
                key={record.id}
                className="rounded-2xl border border-slate-500/30 bg-slate-900/45 p-4 shadow-[0_10px_26px_rgba(2,6,23,0.18)]"
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
                        className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-100"
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
        <section className="rounded-2xl border border-emerald-200/20 bg-[#102b3d]/70 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                {isZh
                  ? '收藏礼物清单'
                  : isJa
                    ? 'お気に入りギフトリスト'
                    : isFr
                      ? 'Liste de cadeaux favoris'
                      : 'Favorite Gift List'}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {isZh
                  ? '来自你的收藏记录，可作为后续送礼候选池。'
                  : isJa
                    ? '保存済み候補を次回のギフト検討リストとして再利用できます。'
                    : isFr
                      ? 'Vos articles enregistrés pour préparer vos prochaines listes cadeaux.'
                      : 'Saved picks from your previous analyses for future gifting checklists.'}
              </p>
            </div>
            <span className="rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
              {favoriteGiftChecklist.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {favoriteGiftChecklist.map(item => (
              <div key={item.id} className="rounded-xl border border-emerald-300/20 bg-[#0f2235]/75 p-3">
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
