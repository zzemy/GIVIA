'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Globe2, ShieldCheck, ShoppingBag, Sparkles, ScanSearch, Clock3 } from 'lucide-react'
import { InteractiveFlowDemo } from '@/components/gifting/interactive-flow-demo'
import { homeAccent, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
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
  onSeeHowItWorks: () => void
  impactCards: ImpactCard[]
  activeImpactCard: number
  onShiftImpactCard: (delta: 1 | -1) => void
  onJumpImpactCard: (index: number) => void
  getImpactCardOffset: (index: number) => number
  onImpactPauseChange: (paused: boolean) => void
  insightsRef: React.RefObject<HTMLElement | null>
}

export function HomeHeroSection({
  locale,
  isZh,
  apiLanguage,
  t,
  onLanguageSwitch,
  onEnterFlow,
  onSeeHowItWorks,
  impactCards,
  activeImpactCard,
  onShiftImpactCard,
  onJumpImpactCard,
  getImpactCardOffset,
  onImpactPauseChange,
  insightsRef,
}: HomeHeroSectionProps) {
  const credibilityItems = [
    {
      id: 'culture-lens',
      icon: <ScanSearch size={16} />,
      title: isZh ? '收礼人文化视角' : 'Recipient culture lens',
      desc: isZh ? '先判断这个礼物在当地会被怎样理解。' : 'Read how the gift is likely to be understood locally.',
    },
    {
      id: 'risk-scan',
      icon: <ShieldCheck size={16} />,
      title: isZh ? '禁忌与风险扫描' : 'Risk and taboo scan',
      desc: isZh ? '把可能踩雷的颜色、语义和场景先拎出来。' : 'Surface risky colors, meanings, and context mismatches early.',
    },
    {
      id: 'timing-etiquette',
      icon: <Clock3 size={16} />,
      title: isZh ? '时机与礼仪建议' : 'Timing and etiquette guidance',
      desc: isZh ? '不仅建议送什么，也建议什么时候、怎么送。' : 'Advise not just what to send, but when and how to present it.',
    },
  ]

  return (
    <>
      <header className="sticky top-0 z-[220] ml-[calc(50%-50vw)] w-screen border-b border-white/8 bg-[#091426]/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 xl:px-8">
          <div className="flex items-center gap-3">
            <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA logo mark" width={44} height={44} priority />
            <div className="leading-none">
              <p className="text-[1.55rem] font-semibold tracking-[0.18em] text-slate-100">GIVIA</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-300/70">
                {isZh ? 'Global AI Gifting System' : 'Global AI Gifting System'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { value: 'zh' as const, label: '中文' },
              { value: 'en' as const, label: 'English' },
            ]).map(languageOption => (
              <button
                key={languageOption.value}
                onClick={() => onLanguageSwitch(languageOption.value)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  locale === languageOption.value
                    ? 'border border-[#e7d2af]/35 bg-[#e7d2af]/10 text-[#f7e8cd]'
                    : 'border border-white/8 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                {languageOption.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mb-12 mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative flex h-full flex-col overflow-hidden px-7 py-8 md:px-9 md:py-10 ${homeSurface.primary}`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(231,210,175,0.18),transparent_58%)]" />

          <div className="relative">
            <p className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] tracking-[0.2em] ${homeAccent.premiumBorder} ${homeAccent.premiumBg} ${homeAccent.premiumLabel}`}>
              <Globe2 size={14} /> {t('hero.badge')}
            </p>

            <h1
              className={`max-w-[10.8em] bg-gradient-to-r from-white via-slate-100 to-[#f3ddba] bg-clip-text text-4xl leading-[1.02] text-transparent md:text-[4rem] md:leading-[1.01] ${
                isZh
                  ? 'font-sans-zh font-semibold tracking-[-0.02em]'
                  : 'font-semibold tracking-[-0.02em] [font-family:var(--app-font-sans)]'
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">让每一份礼物</span>
                  <span className="block text-[#f3ddba]">都能跨文化被理解</span>
                </>
              ) : (
                <>
                  <span className="block">Gift with cultural clarity,</span>
                  <span className="block text-[#f3ddba]">not cross-border guesswork.</span>
                </>
              )}
            </h1>

            <p className={`mt-6 max-w-2xl text-base leading-8 md:text-[1.05rem] ${homeText.body}`}>{t('hero.description')}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                <ShieldCheck size={14} /> {t('hero.trust1')}
              </span>
              <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                <ShoppingBag size={14} /> {t('hero.trust2')}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-200/90">
              {['Tokyo', 'Dubai', 'Paris', 'Sao Paulo', 'Singapore'].map(city => (
                <motion.span
                  key={city}
                  whileHover={{ y: -1 }}
                  className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-slate-300/78"
                >
                  {city}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-9">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterFlow}
              className="inline-flex items-center gap-2 rounded-full border border-[#e7d2af]/35 bg-[#e7d2af]/12 px-5 py-3 text-sm font-semibold text-[#f9ead2] hover:bg-[#e7d2af]/18"
            >
              {isZh ? '立即进入分析流程' : 'Start the flow now'} <ArrowRight size={15} />
            </motion.button>

            <button
              type="button"
              onClick={onSeeHowItWorks}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
            >
              <Sparkles size={15} />
              {isZh ? '了解流程' : 'See how it works'}
            </button>

            <p className={`w-full text-sm ${homeText.muted}`}>
              {isZh ? '先判断文化表达是否得体，再决定礼物如何被送出。' : 'Understand the cultural signal first, then decide how the gift should land.'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={`relative flex h-full flex-col overflow-hidden p-6 md:p-7 ${homeSurface.secondary}`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.16),transparent_58%)]" />

          <div className="relative">
            <p className={`text-xs uppercase tracking-[0.22em] ${homeAccent.intelligenceLabel}`}>{t('hero.panelTitle')}</p>
            <h2 className={`mt-3 text-2xl ${homeText.title} ${isZh ? 'font-sans-zh font-semibold tracking-tight' : 'font-semibold tracking-tight [font-family:var(--app-font-sans)]'}`}>
              {isZh ? '像礼赠顾问一样，先判断再推荐' : 'Think like a gifting advisor before recommending'}
            </h2>
            <p className={`mt-3 text-sm leading-7 ${homeText.body}`}>{t('hero.panelDesc')}</p>

            <div className="mt-6 grid gap-3">
              {credibilityItems.map(item => (
                <div key={item.id} className={`flex items-start gap-3 px-4 py-4 ${homeSurface.quiet}`}>
                  <div className="mt-0.5 rounded-full border border-[#e7d2af]/20 bg-[#e7d2af]/10 p-2 text-[#f3ddba]">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className={`mt-1 text-sm leading-6 ${homeText.muted}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-6 rounded-[1.5rem] border border-white/8 bg-[#0d1a2d]/55 p-2">
            <InteractiveFlowDemo locale={apiLanguage} />
          </div>
        </motion.div>
      </section>

      <section ref={insightsRef} className="mb-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#e7d2af]/80">CULTURAL GIFT INSIGHTS</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100 md:text-3xl">
              {isZh ? '送礼判断的五个关键能力' : 'Five decision layers for gifting well'}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300/76">
              {isZh
                ? '从先识别文化风险，到理解收礼人，再到包装与时机建议，系统会按真正的送礼顺序给出判断。'
                : 'From cultural risk to recipient fit, then packaging and timing, the system follows the way real gifting decisions are actually made.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShiftImpactCard(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-slate-100 transition hover:border-white/22 hover:bg-white/[0.08]"
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
                  idx === activeImpactCard ? 'w-9 bg-[#e7d2af]' : 'w-2.5 bg-slate-500/55 hover:bg-slate-300/70'
                }`}
                aria-label={isZh ? `查看卡片 ${idx + 1}` : `View card ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => onShiftImpactCard(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-slate-100 transition hover:border-white/22 hover:bg-white/[0.08]"
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
                className={`absolute left-1/2 top-2 h-[22.2rem] w-[88%] -translate-x-1/2 overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br ${card.skin} p-6 shadow-[0_24px_80px_rgba(4,10,24,0.34)] md:top-3 md:h-[23.8rem] md:w-[76%] md:p-8 ${isVisibleLayer ? 'cursor-pointer' : 'pointer-events-none'}`}
                style={{ zIndex: depth === 0 ? 100 : depth === 1 ? 80 : isVisibleLayer ? 60 : 1 }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-45`} />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#e7d2af]/22 bg-[#e7d2af]/10 px-3 py-1 text-[11px] tracking-[0.18em] text-[#f7e8cd]">
                      {card.icon} {card.badge}
                    </span>
                    <span className="text-xs tracking-[0.16em] text-slate-300/72">0{idx + 1}</span>
                  </div>

                  <h4 className="mt-5 max-w-[18em] text-[2rem] font-semibold leading-[1.08] text-slate-50 md:text-[2.25rem]">
                    {card.title}
                  </h4>
                  <p className="mt-4 max-w-[44rem] text-sm leading-7 text-slate-200/95 md:text-base">{card.desc}</p>

                  <div className="mt-auto flex flex-col gap-4 pt-8 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {card.chips.map(chip => (
                        <span key={chip} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-100">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="rounded-xl border border-white/10 bg-[#0d1a30]/45 px-4 py-2 text-right md:min-w-52">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/72">{isZh ? '关键指标' : 'Key metric'}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-50 md:text-base">{card.metric}</p>
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
