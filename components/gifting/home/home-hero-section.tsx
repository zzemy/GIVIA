'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Globe2, ShieldCheck, ShoppingBag } from 'lucide-react'
import { InteractiveFlowDemo } from '@/components/gifting/interactive-flow-demo'
import { withBasePath } from '@/lib/asset-path'
import type { Locale } from '@/components/gifting/home/types'

interface ImpactCard {
  id: string
  icon: React.ReactNode
  badge: string
  title: string
  desc: string
  metric: string
  chips: string[]
  skin: string
  glow: string
}

interface HomeHeroSectionProps {
  locale: Locale
  isZh: boolean
  apiLanguage: 'zh' | 'en'
  t: (path: string) => string
  onLanguageSwitch: (locale: Locale) => void
  onEnterFlow: () => void
  impactCards: ImpactCard[]
  activeImpactCard: number
  onShiftImpactCard: (delta: 1 | -1) => void
  onJumpImpactCard: (index: number) => void
  getImpactCardOffset: (index: number) => number
  onImpactPauseChange: (paused: boolean) => void
}

export function HomeHeroSection({
  locale,
  isZh,
  apiLanguage,
  t,
  onLanguageSwitch,
  onEnterFlow,
  impactCards,
  activeImpactCard,
  onShiftImpactCard,
  onJumpImpactCard,
  getImpactCardOffset,
  onImpactPauseChange,
}: HomeHeroSectionProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-cyan-200/15 bg-[#0c1b33]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 xl:px-8">
          <div className="flex items-center gap-3">
            <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA logo mark" width={44} height={44} priority />
            <div className="leading-none">
              <p className="text-[1.55rem] font-semibold tracking-[0.18em] text-slate-100">GIVIA</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-300/90">
                {isZh ? 'Global AI Gifting System' : 'Global AI Gifting System'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { value: 'zh' as const, label: '中文' },
              { value: 'en' as const, label: 'English' },
              { value: 'ja' as const, label: '日本語' },
              { value: 'fr' as const, label: 'Français' },
            ]).map(languageOption => (
              <button
                key={languageOption.value}
                onClick={() => onLanguageSwitch(languageOption.value)}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-all ${
                  locale === languageOption.value
                    ? 'border border-amber-200/45 bg-amber-100/12 text-amber-100'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                }`}
              >
                {languageOption.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mb-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] border border-cyan-100/18 bg-gradient-to-br from-[#10233f]/90 via-[#11253f]/84 to-[#182a43]/80 p-8 shadow-[0_30px_90px_rgba(6,14,28,0.52)] backdrop-blur-xl"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100/25 bg-cyan-100/8 px-3 py-1 text-xs tracking-[0.14em] text-cyan-50/95">
            <Globe2 size={14} /> {t('hero.badge')}
          </p>

          <h1
            className={`max-w-[11.5em] bg-gradient-to-r from-slate-50 via-slate-100 to-cyan-100 bg-clip-text text-3xl leading-[1.08] text-transparent md:text-[3.35rem] md:leading-[1.06] ${
              isZh
                ? 'font-sans-zh font-semibold tracking-[-0.02em]'
                : 'font-semibold tracking-[-0.02em] [font-family:var(--app-font-sans)]'
            }`}
          >
            {isZh ? (
              <>
                <span className="block">让每一份礼物</span>
                <span className="block text-cyan-100">都能跨文化被理解</span>
              </>
            ) : (
              <>
                <span className="block">Gift with cultural clarity,</span>
                <span className="block text-cyan-100">not cross-border guesswork.</span>
              </>
            )}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/95">{t('hero.description')}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-200">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-500/14 px-3 py-1">
              <ShieldCheck size={14} /> {t('hero.trust1')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/40 bg-sky-500/14 px-3 py-1">
              <ShoppingBag size={14} /> {t('hero.trust2')}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-200/90">
            {['Tokyo', 'Dubai', 'Paris', 'Sao Paulo', 'Singapore'].map(city => (
              <motion.span
                key={city}
                whileHover={{ y: -2, scale: 1.04 }}
                className="rounded-full border border-slate-300/18 bg-slate-100/8 px-3 py-1"
              >
                {city}
              </motion.span>
            ))}
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -2, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnterFlow}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-cyan-300/12 px-5 py-2.5 text-sm font-semibold text-cyan-50 hover:bg-cyan-300/20"
          >
            {isZh ? '立即进入分析流程' : 'Start the flow now'} <ArrowRight size={15} />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="relative overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-gradient-to-br from-[#10233f]/90 via-[#11263f]/84 to-[#162a44]/82 p-6 shadow-[0_28px_70px_rgba(6,14,28,0.56)]"
        >
          <p className="relative text-xs uppercase tracking-[0.22em] text-sky-100/80">{t('hero.panelTitle')}</p>
          <h2 className={`relative mt-3 text-2xl text-slate-100 ${isZh ? 'font-sans-zh font-semibold tracking-tight' : 'font-semibold tracking-tight [font-family:var(--app-font-sans)]'}`}>
            {t('hero.panelHeadline')}
          </h2>
          <p className="relative mt-3 text-sm leading-7 text-slate-300">{t('hero.panelDesc')}</p>

          <InteractiveFlowDemo locale={apiLanguage} />
        </motion.div>
      </section>

      <section className="mb-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">CULTURAL GIFT INSIGHTS</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100 md:text-3xl">
              {isZh ? '送礼的四个关键能力' : 'Four core capabilities for gifting'}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
              {isZh
                ? '从风险识别、受礼人理解、到落地方案和时机把控，每个环节都决定了礼物的表达效果。'
                : 'From identifying cultural risks and understanding your recipient, to crafting the right gift and timing it perfectly—every step matters.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShiftImpactCard(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/28 bg-slate-800/55 text-cyan-100 transition hover:border-cyan-100/50 hover:bg-slate-700/65"
              aria-label={isZh ? '上一张' : 'Previous'}
            >
              <ChevronLeft size={18} />
            </button>
            {impactCards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onJumpImpactCard(idx)}
                onFocus={() => onJumpImpactCard(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === activeImpactCard ? 'w-9 bg-cyan-200' : 'w-2.5 bg-slate-500/70 hover:bg-slate-300/80'
                }`}
                aria-label={isZh ? `查看卡片 ${idx + 1}` : `View card ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => onShiftImpactCard(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-100/28 bg-slate-800/55 text-cyan-100 transition hover:border-cyan-100/50 hover:bg-slate-700/65"
              aria-label={isZh ? '下一张' : 'Next'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          className="relative h-[24.8rem] overflow-visible md:h-[26.4rem]"
          onMouseEnter={() => onImpactPauseChange(true)}
          onMouseLeave={() => onImpactPauseChange(false)}
        >
          {impactCards.map((card, idx) => {
            const offset = getImpactCardOffset(idx)
            const depth = Math.abs(offset)
            const isVisibleLayer = depth <= 2
            const side = offset < 0 ? -1 : 1

            return (
              <motion.article
                key={card.id}
                initial={false}
                animate={{
                  x: isVisibleLayer ? offset * 110 : side * 620,
                  y: depth === 0 ? 0 : depth === 1 ? 14 : isVisibleLayer ? 26 : 38,
                  scale: depth === 0 ? 1 : depth === 1 ? 0.9 : isVisibleLayer ? 0.82 : 0.76,
                  rotate: isVisibleLayer ? offset * 2.2 : side * 6,
                  opacity: depth === 0 ? 1 : depth === 1 ? 0.62 : isVisibleLayer ? 0.36 : 0,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                onClick={() => onJumpImpactCard(idx)}
                className={`absolute left-1/2 top-2 h-[22.2rem] w-[88%] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-cyan-100/18 bg-gradient-to-br ${card.skin} p-6 md:top-3 md:h-[23.8rem] md:w-[76%] md:p-8 ${isVisibleLayer ? 'cursor-pointer' : 'pointer-events-none'}`}
                style={{ zIndex: depth === 0 ? 100 : depth === 1 ? 80 : isVisibleLayer ? 60 : 1 }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-70`} />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100/30 bg-cyan-100/10 px-3 py-1 text-[11px] tracking-[0.18em] text-cyan-50/95">
                      {card.icon} {card.badge}
                    </span>
                    <span className="text-xs tracking-[0.16em] text-slate-300/85">0{idx + 1}</span>
                  </div>

                  <h4 className="mt-5 max-w-[18em] text-[2rem] font-semibold leading-[1.08] text-slate-50 md:text-[2.25rem]">
                    {card.title}
                  </h4>
                  <p className="mt-4 max-w-[44rem] text-sm leading-7 text-slate-200/95 md:text-base">{card.desc}</p>

                  <div className="mt-auto flex flex-col gap-4 pt-8 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {card.chips.map(chip => (
                        <span key={chip} className="rounded-full border border-slate-100/24 bg-slate-100/10 px-3 py-1 text-xs text-slate-100">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-xl border border-cyan-100/25 bg-[#0d1a30]/55 px-4 py-2 text-right md:min-w-52">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/75">{isZh ? '关键指标' : 'Key metric'}</p>
                      <p className="mt-1 text-sm font-semibold text-cyan-50 md:text-base">{card.metric}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>
    </>
  )
}
