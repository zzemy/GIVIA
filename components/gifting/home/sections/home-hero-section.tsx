'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe2,
  HeartHandshake,
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
  const activeCard = impactCards[activeImpactCard] ?? impactCards[0]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[220] w-full">
        <div className="mx-auto max-w-[1600px] px-4 pt-4 sm:px-5 xl:px-8 2xl:px-10">
          <div className={`mx-auto flex items-center justify-between gap-3 rounded-full border border-black/6 bg-[rgba(255,252,248,0.74)] px-4 py-3 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:px-5 ${homeLayout.section}`}>
            <div className="flex min-w-0 items-center gap-3">
              <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA logo mark" width={42} height={42} priority />
              <div className="min-w-0 leading-none">
                <p className="truncate text-[1.45rem] font-semibold tracking-[-0.04em] text-[#2a2b32]">Givia</p>
                <p className="mt-1 truncate text-[10px] uppercase tracking-[0.26em] text-[#98a2b3]">{isZh ? 'Global Gifting Intelligence' : 'Global Gifting Intelligence'}</p>
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
                      ? 'border-[#4664b3]/20 bg-white/90 text-[#2d3f73]'
                      : 'text-[#667085] hover:text-[#344054]'
                  }`}
                >
                  {languageOption.label}
                </button>
              ))}
              <button type="button" onClick={onEnterFlow} className={`${homeButton.primary} px-6 py-2.5 text-sm`}>
                {isZh ? '开始体验' : 'Start Gifting'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className={`mt-[5.75rem] ${homeLayout.section}`}>
        <div className="grid gap-10 px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pb-10 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative min-w-0 lg:col-span-6 xl:col-span-5"
          >
            <div className="relative flex flex-col gap-8 lg:max-w-[34rem]">
              <div>
                <p
                  className={`inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1 text-[11px] tracking-[0.2em] ${homeAccent.premiumBorder} ${homeAccent.premiumBg} ${homeAccent.premiumLabel} ${homeAccent.premiumGlow}`}
                >
                  <Globe2 size={14} /> {t('hero.badge')}
                </p>

                <h1
                  className={`home-balance mt-6 max-w-[9.2em] text-[3rem] leading-[0.98] text-[#202127] sm:text-[4rem] md:text-[4.5rem] xl:text-[5.3rem] ${
                    isZh ? 'font-display-zh font-semibold tracking-[-0.05em]' : 'font-serif font-semibold tracking-[-0.05em]'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">让心意，</span>
                      <span className="block italic text-[#4a5f97]">跨越山海</span>
                      <span className="block">毫无阻碍。</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Gifting,</span>
                      <span className="block italic text-[#4a5f97]">across borders</span>
                      <span className="block">without friction.</span>
                    </>
                  )}
                </h1>

                <p className={`home-measure home-pretty mt-7 text-[1.02rem] leading-8 md:text-[1.08rem] ${homeText.body}`}>
                  {isZh
                    ? '融合全球文化图谱与 AI 洞察，为你避开文化雷区，找到真正贴合收礼人语境的送礼表达。'
                    : 'Blend global cultural context with AI insight to avoid gifting missteps and find the expression that truly fits the recipient.'}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEnterFlow}
                  className={`${homeButton.primary} w-full sm:w-auto`}
                >
                  {isZh ? '开启心意之旅' : 'Begin Your Journey'} <ArrowRight size={15} />
                </motion.button>

                <button type="button" onClick={onSeeHowItWorks} className={`${homeButton.secondary} w-full sm:w-auto`}>
                  <Sparkles size={15} />
                  {isZh ? '了解流程' : 'See how it works'}
                </button>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                  <ShieldCheck size={14} /> {t('hero.trust1')}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${homeSurface.quiet} ${homeText.body}`}>
                  <ShoppingBag size={14} /> {t('hero.trust2')}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="relative min-h-[480px] min-w-0 lg:col-span-6 xl:col-span-7 xl:min-h-[620px]"
          >
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_22%_20%,rgba(201,219,248,0.42),transparent_34%),radial-gradient(circle_at_80%_68%,rgba(255,227,198,0.46),transparent_36%)] blur-3xl" />

            <div className="relative h-full">
              <div className="absolute left-[6%] top-[28%] z-10 hidden w-[34%] rounded-[2rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(236,237,240,0.84))] p-5 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.32)] backdrop-blur-xl lg:block">
                <p className="text-sm font-medium text-[#5d6472]">{isZh ? 'Cultural Connection' : 'Cultural Connection'}</p>
                <div className="mt-24 flex items-center gap-2 text-sm text-[#7c8596]">
                  <Globe2 size={15} />
                  <span>Tokyo, Japan</span>
                </div>
              </div>

              <div className="absolute right-[7%] top-[3%] z-20 mx-auto w-full max-w-[18rem] overflow-hidden rounded-[2.35rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,219,214,0.92),rgba(250,217,206,0.86))] p-4 shadow-[0_40px_90px_-46px_rgba(15,23,42,0.42)] sm:max-w-[20rem] lg:max-w-[21.5rem] xl:max-w-[24rem]">
                <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#f8d8ce_0%,#f7cabc_28%,#f027a6_28.5%,#f027a6_72%,#d1157f_100%)] px-6 py-8">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.32),transparent_28%),radial-gradient(circle_at_80%_78%,rgba(255,211,104,0.24),transparent_28%)]" />
                  <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(84,39,16,0.75)_1.7px,transparent_1.7px)] [background-size:22px_22px]" />
                  <div className="relative mx-auto mt-10 h-[13rem] w-[12rem] rounded-[1.65rem] border border-white/22 bg-[linear-gradient(180deg,#ff40bd_0%,#e80f8b_100%)] shadow-[0_34px_50px_-26px_rgba(136,6,82,0.55)] sm:h-[14rem] sm:w-[12.75rem] xl:h-[15rem] xl:w-[13.4rem]">
                    <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-[linear-gradient(180deg,#f9d991_0%,#c7932e_100%)] shadow-[0_0_18px_rgba(244,194,74,0.55)]" />
                    <div className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 bg-[linear-gradient(90deg,#f9d991_0%,#c7932e_100%)] shadow-[0_0_18px_rgba(244,194,74,0.55)]" />
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#c7932e] border-t-transparent border-l-transparent rotate-45" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[12%] right-[20%] z-30 rounded-[1.55rem] border border-white/80 bg-white/82 px-5 py-4 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
                <p className="text-sm font-medium text-[#4b5261]">{isZh ? '心意解析完成' : 'Intention Decoded'}</p>
                <div className="mt-3 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 rounded-full bg-[#6178c8]" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                </div>
              </div>

              <motion.div
                initial={{ y: 8 }}
                animate={{ y: -12 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3.8, ease: 'easeInOut' }}
                className="absolute bottom-[8%] right-[6%] z-40 flex w-[7.8rem] flex-col items-center rounded-[1.85rem] border border-white/85 bg-white/84 px-4 py-5 text-center shadow-[0_24px_56px_-32px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:w-[8.8rem]"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <HeartHandshake size={20} />
                </div>
                <p className="text-[2rem] font-semibold leading-none text-[#262830]">99%</p>
                <p className="mt-2 text-xs tracking-[0.16em] text-[#7c8596]">{isZh ? '文化契合度' : 'Cultural fit'}</p>
              </motion.div>

              <div className="absolute left-0 top-[8%] z-0 hidden h-[17rem] w-[17rem] rounded-full bg-[#d8e5fb] blur-3xl lg:block" />
              <div className="absolute bottom-[6%] right-[8%] z-0 hidden h-[15rem] w-[15rem] rounded-full bg-[#f8dfc5] blur-3xl lg:block" />
              <div className="absolute left-[6%] bottom-[3%] z-10 hidden max-w-[16rem] rounded-[1.7rem] border border-black/6 bg-[rgba(255,255,255,0.52)] p-3 backdrop-blur-md lg:block">
                <div className={`rounded-[1.25rem] p-3 ${homeSurface.inset}`}>
                  <InteractiveFlowDemo locale={apiLanguage} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={insightsRef} className={`${homeLayout.section}`}>
        <div className={`overflow-hidden px-5 py-5 sm:px-6 sm:py-6 xl:px-7 ${homeSurface.secondary}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-[#4a5f97]/72">CULTURAL GIFT INSIGHTS</p>
              <h3 className="home-balance mt-2 text-2xl font-semibold text-[#1f2d3d] md:text-[2rem]">
                {isZh ? '送礼判断的五个关键能力' : 'Five decision layers for gifting well'}
              </h3>
              <p className="home-pretty mt-3 max-w-3xl text-sm leading-7 text-[#667085]">
                {isZh
                  ? '从先识别文化风险，到理解收礼人，再到包装与时机建议，系统会按真正的送礼顺序给出判断。'
                  : 'From cultural risk to recipient fit, then packaging and timing, the system follows the way real gifting decisions are actually made.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => onShiftImpactCard(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/80 text-[#1f2d3d] transition hover:border-black/12 hover:bg-white"
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
                    idx === activeImpactCard ? 'w-8 bg-[#4a5f97]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={isZh ? `查看卡片 ${idx + 1}` : `View card ${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => onShiftImpactCard(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/80 text-[#1f2d3d] transition hover:border-black/12 hover:bg-white"
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
                  className={`absolute left-1/2 top-1 h-[22.5rem] w-[74%] max-w-[820px] -translate-x-1/2 overflow-hidden rounded-[1.7rem] border border-black/6 bg-gradient-to-br ${card.skin} p-5 shadow-[0_24px_72px_-40px_rgba(4,10,24,0.3)] xl:h-[24rem] xl:p-6 ${isVisibleLayer ? 'cursor-pointer' : 'pointer-events-none'}`}
                  style={{ zIndex: depth === 0 ? 100 : depth === 1 ? 80 : isVisibleLayer ? 60 : 1 }}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-24`} />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className={homeControl.badge}>
                        {card.icon} <span>{card.badge}</span>
                      </span>
                      <span className="text-xs tracking-[0.16em] text-[#667085]">0{idx + 1}</span>
                    </div>

                    <h4 className="home-balance mt-4 max-w-[18em] text-[1.55rem] font-semibold leading-[1.08] text-[#1f2d3d] xl:text-[1.8rem]">
                      {card.title}
                    </h4>
                    <p className="home-pretty mt-3 max-w-[40rem] text-sm leading-6 text-[#344054]">{card.desc}</p>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div className="flex flex-wrap gap-2">
                        {card.chips.map(chip => (
                          <span key={chip} className={homeControl.pill}>
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className={`min-w-52 rounded-2xl px-4 py-3 text-right ${homeSurface.inset}`}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#4a5f97]/70">{isZh ? '关键指标' : 'Key metric'}</p>
                        <p className="mt-1 text-sm font-semibold text-[#1f2d3d] xl:text-base">{card.metric}</p>
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
              className={`relative mt-6 overflow-hidden rounded-[1.6rem] border border-black/6 bg-gradient-to-br ${activeCard.skin} p-5 shadow-[0_22px_64px_-34px_rgba(4,10,24,0.3)] md:hidden`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeCard.glow} opacity-24`} />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={homeControl.badge}>
                    {activeCard.icon} <span>{activeCard.badge}</span>
                  </span>
                  <span className="text-xs tracking-[0.16em] text-[#667085]">0{activeImpactCard + 1}</span>
                </div>

                <h4 className="home-balance text-[1.85rem] font-semibold leading-[1.08] text-[#1f2d3d]">{activeCard.title}</h4>
                <p className="home-pretty text-sm leading-7 text-[#344054]">{activeCard.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {activeCard.chips.map(chip => (
                    <span key={chip} className={homeControl.pill}>
                      {chip}
                    </span>
                  ))}
                </div>

                <div className={`rounded-2xl px-4 py-3 ${homeSurface.inset}`}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#4a5f97]/70">{isZh ? '关键指标' : 'Key metric'}</p>
                  <p className="mt-1 text-base font-semibold text-[#1f2d3d]">{activeCard.metric}</p>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </section>
    </>
  )
}
