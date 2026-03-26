'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  ScanSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { InteractiveFlowDemo } from '@/components/gifting/interactive-flow-demo'
import { homeAccent, homeButton, homeControl, homeLayout, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
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
      desc: isZh ? '先判断礼物在当地会被如何理解，再决定是否值得送。' : 'Read how the gift is likely to be understood locally before recommending it.',
    },
    {
      id: 'risk-scan',
      icon: <ShieldCheck size={16} />,
      title: isZh ? '禁忌与风险扫描' : 'Risk and taboo scan',
      desc: isZh ? '把颜色、语义、数字与场景里的雷点先提出来。' : 'Surface risky colors, meanings, numbers, and context mismatches early.',
    },
    {
      id: 'timing-etiquette',
      icon: <Clock3 size={16} />,
      title: isZh ? '时机与礼仪建议' : 'Timing and etiquette guidance',
      desc: isZh ? '不仅判断送什么，也判断什么时候送、怎样送。' : 'Advise not only what to send, but when and how it should be presented.',
    },
  ]

  const activeCard = impactCards[activeImpactCard] ?? impactCards[0]

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[220] w-full border-b border-white/6 bg-[#071222]/78 backdrop-blur-xl">
        <div className={`mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-5 xl:px-8 2xl:px-10 ${homeLayout.section}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA logo mark" width={42} height={42} priority />
            <div className="min-w-0 leading-none">
              <p className="truncate text-[1.45rem] font-semibold tracking-[0.16em] text-slate-100">GIVIA</p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.26em] text-slate-300/58">
                Global AI Gifting System
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            {([
              { value: 'zh' as const, label: '中文' },
              { value: 'en' as const, label: 'English' },
            ]).map(languageOption => (
              <button
                key={languageOption.value}
                onClick={() => onLanguageSwitch(languageOption.value)}
                className={`${homeButton.language} ${
                  locale === languageOption.value
                    ? 'border-[#e7d2af]/30 bg-[#e7d2af]/10 text-[#f7e8cd]'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                {languageOption.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className={`mt-[5.5rem] ${homeLayout.section}`}>
        <div className="grid gap-5 xl:grid-cols-12 xl:items-start xl:gap-6 2xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden px-6 py-7 sm:px-7 sm:py-8 lg:px-9 min-w-0 xl:col-span-7 xl:px-10 xl:py-10 ${homeSurface.primary}`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(231,210,175,0.14),transparent_60%)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 bg-[radial-gradient(circle,rgba(125,211,252,0.08),transparent_72%)]" />

            <div className="relative flex flex-col gap-7">
              <div>
                <p
                  className={`inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1 text-[11px] tracking-[0.2em] ${homeAccent.premiumBorder} ${homeAccent.premiumBg} ${homeAccent.premiumLabel} ${homeAccent.premiumGlow}`}
                >
                  <Globe2 size={14} /> {t('hero.badge')}
                </p>

                <h1
                  className={`home-balance mt-5 max-w-[10.2em] text-4xl leading-[1.02] text-slate-50 sm:text-[3.4rem] md:text-[4rem] xl:text-[4.35rem] ${
                    isZh ? 'font-sans-zh font-semibold tracking-[-0.03em]' : 'font-semibold tracking-[-0.03em]'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">让每一份礼物</span>
                      <span className="block text-[#f1dbb5]">都能跨文化被理解</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Gift with cultural clarity,</span>
                      <span className="block text-[#f1dbb5]">not cross-border guesswork.</span>
                    </>
                  )}
                </h1>

                <p className={`home-measure home-pretty mt-5 text-base leading-8 md:text-[1.02rem] ${homeText.body}`}>
                  {t('hero.description')}
                </p>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                  <ShieldCheck size={14} /> {t('hero.trust1')}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                  <ShoppingBag size={14} /> {t('hero.trust2')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-200/88">
                {['Tokyo', 'Dubai', 'Paris', 'Sao Paulo', 'Singapore'].map(city => (
                  <motion.span
                    key={city}
                    whileHover={{ y: -1 }}
                    className={homeControl.pill}
                  >
                    {city}
                  </motion.span>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnterFlow}
                  className={`${homeButton.primary} w-full sm:w-auto`}
                >
                  {isZh ? '立即进入分析流程' : 'Start the flow now'} <ArrowRight size={15} />
                </motion.button>

                <button type="button" onClick={onSeeHowItWorks} className={`${homeButton.secondary} w-full sm:w-auto`}>
                  <Sparkles size={15} />
                  {isZh ? '了解流程' : 'See how it works'}
                </button>
              </div>

              <p className={`text-sm ${homeText.muted}`}>
                {isZh ? '先判断文化表达是否得体，再决定礼物如何被送出。' : 'Understand the cultural signal first, then decide how the gift should land.'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className={`relative overflow-hidden p-5 sm:p-6 min-w-0 xl:col-span-5 ${homeSurface.secondary}`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.08),transparent_62%)]" />

            <div className="relative flex flex-col gap-5">
              <div>
                <p className={`text-[11px] uppercase tracking-[0.2em] ${homeAccent.intelligenceLabel}`}>{t('hero.panelTitle')}</p>
                <h2 className={`home-balance mt-3 text-[1.85rem] leading-tight ${homeText.title} ${isZh ? 'font-sans-zh font-semibold tracking-tight' : 'font-semibold tracking-tight'}`}>
                  {isZh ? '像礼赠顾问一样，先判断再推荐' : 'Think like a gifting advisor before recommending'}
                </h2>
                <p className={`home-pretty mt-3 max-w-[36rem] text-sm leading-7 ${homeText.muted}`}>{t('hero.panelDesc')}</p>
              </div>

              <div className="grid gap-2.5">
                {credibilityItems.map(item => (
                  <div key={item.id} className={`flex items-start gap-3 px-4 py-3.5 ${homeSurface.quiet}`}>
                    <div className="mt-0.5 rounded-full border border-[#e7d2af]/18 bg-[#e7d2af]/8 p-2 text-[#f3ddba]">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                      <p className={`mt-1 text-sm leading-6 ${homeText.muted}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`rounded-[1.4rem] p-2 ${homeSurface.inset}`}>
                <InteractiveFlowDemo locale={apiLanguage} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={insightsRef} className={`${homeLayout.section}`}>
        <div className={`overflow-hidden px-5 py-5 sm:px-6 sm:py-6 xl:px-7 ${homeSurface.secondary}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-[#e7d2af]/78">CULTURAL GIFT INSIGHTS</p>
              <h3 className="home-balance mt-2 text-2xl font-semibold text-slate-100 md:text-[2rem]">
                {isZh ? '送礼判断的五个关键能力' : 'Five decision layers for gifting well'}
              </h3>
              <p className="home-pretty mt-3 max-w-3xl text-sm leading-7 text-slate-300/74">
                {isZh
                  ? '从先识别文化风险，到理解收礼人，再到包装与时机建议，系统会按真正的送礼顺序给出判断。'
                  : 'From cultural risk to recipient fit, then packaging and timing, the system follows the way real gifting decisions are actually made.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => onShiftImpactCard(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-white/20 hover:bg-white/[0.07]"
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
                    idx === activeImpactCard ? 'w-8 bg-[#e7d2af]' : 'w-2.5 bg-slate-500/52 hover:bg-slate-300/70'
                  }`}
                  aria-label={isZh ? `查看卡片 ${idx + 1}` : `View card ${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => onShiftImpactCard(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-100 transition hover:border-white/20 hover:bg-white/[0.07]"
                aria-label={isZh ? '下一张' : 'Next'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            className="relative mt-5 hidden h-[25rem] overflow-hidden md:block xl:h-[27rem]"
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
                    x: isVisibleLayer ? offset * 68 : side * 380,
                    y: depth === 0 ? 0 : depth === 1 ? 8 : isVisibleLayer ? 14 : 18,
                    scale: depth === 0 ? 1 : depth === 1 ? 0.95 : isVisibleLayer ? 0.9 : 0.86,
                    rotate: isVisibleLayer ? offset * 1.4 : side * 3.4,
                    opacity: depth === 0 ? 1 : depth === 1 ? 0.56 : isVisibleLayer ? 0.28 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  onClick={() => onJumpImpactCard(idx)}
                  className={`absolute left-1/2 top-1 h-[22.5rem] w-[74%] max-w-[820px] -translate-x-1/2 overflow-hidden rounded-[1.7rem] border border-white/10 bg-gradient-to-br ${card.skin} p-5 shadow-[0_24px_72px_rgba(4,10,24,0.38)] xl:h-[24rem] xl:p-6 ${isVisibleLayer ? 'cursor-pointer' : 'pointer-events-none'}`}
                  style={{ zIndex: depth === 0 ? 100 : depth === 1 ? 80 : isVisibleLayer ? 60 : 1 }}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-24`} />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className={`${homeControl.badge} border-[#e7d2af]/22 bg-[#e7d2af]/10 text-[#f7e8cd]`}>
                        {card.icon} <span>{card.badge}</span>
                      </span>
                      <span className="text-xs tracking-[0.16em] text-slate-300/70">0{idx + 1}</span>
                    </div>

                    <h4 className="home-balance mt-4 max-w-[18em] text-[1.55rem] font-semibold leading-[1.08] text-slate-50 xl:text-[1.8rem]">
                      {card.title}
                    </h4>
                    <p className="home-pretty mt-3 max-w-[40rem] text-sm leading-6 text-slate-200/92">{card.desc}</p>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div className="flex flex-wrap gap-2">
                        {card.chips.map(chip => (
                          <span key={chip} className={homeControl.pill}>
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className={`min-w-52 rounded-2xl px-4 py-3 text-right ${homeSurface.inset}`}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/70">{isZh ? '关键指标' : 'Key metric'}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-50 xl:text-base">{card.metric}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          {activeCard && (
            <motion.article
              key={activeCard.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`relative mt-6 overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br ${activeCard.skin} p-5 shadow-[0_22px_64px_rgba(4,10,24,0.34)] md:hidden`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeCard.glow} opacity-24`} />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`${homeControl.badge} border-[#e7d2af]/22 bg-[#e7d2af]/10 text-[#f7e8cd]`}>
                    {activeCard.icon} <span>{activeCard.badge}</span>
                  </span>
                  <span className="text-xs tracking-[0.16em] text-slate-300/72">0{activeImpactCard + 1}</span>
                </div>

                <h4 className="home-balance text-[1.85rem] font-semibold leading-[1.08] text-slate-50">{activeCard.title}</h4>
                <p className="home-pretty text-sm leading-7 text-slate-200/92">{activeCard.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {activeCard.chips.map(chip => (
                    <span key={chip} className={homeControl.pill}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className={`rounded-2xl px-4 py-3 ${homeSurface.inset}`}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/70">{isZh ? '关键指标' : 'Key metric'}</p>
                  <p className="mt-1 text-base font-semibold text-slate-50">{activeCard.metric}</p>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </section>
    </>
  )
}
