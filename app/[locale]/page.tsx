'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'
  const editorialCards = [
    {
      title: isZh ? '文化语境' : 'Cultural context',
      copy: isZh
        ? '不再只判断能不能送，而是理解这份礼物在不同关系和礼仪里会被怎样阅读。'
        : 'Not just whether a gift works, but how it will be interpreted across relationships and etiquette.',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: isZh ? '情绪与场景' : 'Emotion and occasion',
      copy: isZh
        ? '把对象、场合、距离感和表达语气一起纳入判断，让礼物更像一段被精心编辑的叙事。'
        : 'Recipient, occasion, distance, and tone are edited together so the gift reads like a deliberate gesture.',
      image:
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: isZh ? '全球礼赠编辑' : 'Global gifting edit',
      copy: isZh
        ? '从识别物件到生成替代方案，整个流程都围绕国际化审美与人文体验重构。'
        : 'From object recognition to safer alternatives, the full journey is rebuilt around international taste and human insight.',
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    },
  ]
  const editorialPrinciples = [
    isZh ? 'Culture-first' : 'Culture-first',
    isZh ? 'Narrative-led' : 'Narrative-led',
    isZh ? 'Soft luxury' : 'Soft luxury',
  ]

  return (
    <div className={`home-editorial-shell relative min-h-screen overflow-hidden ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1220px] flex-col px-6 pb-12 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-[2rem] font-serif font-semibold tracking-[-0.06em] text-[#292a31]">Givia</span>
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#5f76cf]"></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
              className="rounded-full px-3 py-2 text-sm font-medium uppercase tracking-[0.18em] text-[#7e8593] transition hover:bg-white/70 hover:text-[#1f2d3d]"
            >
              {isZh ? 'EN' : '中文'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              className="rounded-full bg-[#1f1c19] px-6 py-3 text-sm font-medium text-white shadow-[0_14px_34px_-24px_rgba(0,0,0,0.55)] transition hover:-translate-y-0.5 hover:bg-[#2d2a26]"
            >
              {isZh ? '开始体验' : 'Start Gifting'}
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center py-10 lg:py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[34rem]"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6f7fd7]/12 bg-[#eef2ff]/70 px-4 py-2 text-sm font-medium text-[#5b6dc4]">
                <Sparkles className="h-4 w-4" />
                {isZh ? '重塑跨越国界的心意' : 'The new era of gifting'}
              </div>

              <h1
                className={`mt-7 text-[3.2rem] leading-[0.96] tracking-[-0.06em] text-[#1f2027] sm:text-[4.5rem] xl:text-[5rem] ${
                  isZh ? 'font-display-zh font-semibold' : 'font-serif font-semibold'
                }`}
              >
                {isZh ? (
                  <>
                    <span className="block">让心意，</span>
                    <span className="block italic text-[#5f76cf]">跨越山海</span>
                    <span className="block">毫无阻碍。</span>
                  </>
                ) : (
                  <>
                    <span className="block">Gifting,</span>
                    <span className="block italic text-[#5f76cf]">across borders</span>
                    <span className="block">without friction.</span>
                  </>
                )}
              </h1>

              <p className="mt-8 max-w-[36rem] text-lg font-light leading-9 text-[#6b7280]">
                {isZh
                  ? '融合全球文化图谱与 AI 洞察，为您避开文化雷区，找到真正打动人心的情感表达。'
                  : 'Blending global cultural graphs with AI insight to avoid gifting missteps and uncover the expression that truly resonates.'}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/gifting`)}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5f76cf] to-[#4a60b4] px-8 py-4 text-base font-medium text-white shadow-[0_18px_40px_-24px_rgba(95,118,207,0.65)] transition hover:-translate-y-1"
                >
                  {isZh ? '开启心意之旅' : 'Begin Your Journey'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[480px] lg:min-h-[620px]"
            >
              <div className="absolute left-[-8%] top-[-10%] z-0 hidden h-56 w-56 rounded-full bg-[#dce7fb] blur-3xl lg:block" />
              <div className="absolute bottom-[-6%] right-[6%] z-0 hidden h-64 w-64 rounded-full bg-[#f9dccb] blur-3xl lg:block" />

              <div className="relative z-10 overflow-hidden rounded-[2.8rem] border border-white/95 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(248,243,236,0.78))] p-5 shadow-[0_38px_90px_-50px_rgba(15,23,42,0.3)] backdrop-blur-2xl sm:p-6 lg:p-7">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                  <div className="flex h-full flex-col gap-4">
                    <div className="rounded-[2.1rem] border border-black/6 bg-white/72 p-6 shadow-[0_20px_44px_-34px_rgba(15,23,42,0.18)]">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#7e8593]">
                        {isZh ? 'Editorial intelligence' : 'Editorial intelligence'}
                      </p>
                      <h2 className="mt-4 text-[2rem] font-serif leading-tight tracking-[-0.04em] text-[#1f2027] sm:text-[2.35rem]">
                        {isZh ? '为全球关系编辑送礼语言。' : 'Editing the language of gifting for global relationships.'}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-[#6b7280]">
                        {isZh
                          ? '不是翻译式工具，而是一套把文化分寸、情绪表达与礼物语义整合在一起的现代礼赠编辑系统。'
                          : 'Not a translation utility, but a modern editorial system for cultural nuance, emotional intent, and gift semantics.'}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                      {editorialPrinciples.map(item => (
                        <div
                          key={item}
                          className="rounded-[1.6rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,244,238,0.92))] px-5 py-4 text-sm text-[#4b5563] shadow-[0_16px_32px_-28px_rgba(15,23,42,0.18)]"
                        >
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#97a0af]">
                            {isZh ? '原则' : 'Principle'}
                          </p>
                          <p className="mt-2 font-medium text-[#1f2027]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid min-h-[29rem] gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="grid gap-4">
                      {editorialCards.slice(0, 2).map((card, index) => (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.12 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          className="relative overflow-hidden rounded-[2.1rem] border border-white/90 bg-[#f4efe7] shadow-[0_22px_46px_-34px_rgba(15,23,42,0.22)]"
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center saturate-[0.86]"
                            style={{ backgroundImage: `url(${card.image})` }}
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,243,236,0.06),rgba(28,26,23,0.54))]" />
                          <div className="relative flex min-h-[13rem] flex-col justify-end p-5">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                              {isZh ? `章节 0${index + 1}` : `Chapter 0${index + 1}`}
                            </p>
                            <h3 className="mt-2 text-[1.45rem] font-serif text-white">{card.title}</h3>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">{card.copy}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="relative overflow-hidden rounded-[2.3rem] border border-white/90 bg-[#efe7dd] shadow-[0_24px_52px_-34px_rgba(15,23,42,0.22)]"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center saturate-[0.78]"
                        style={{ backgroundImage: `url(${editorialCards[2]?.image})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(19,20,25,0.52))]" />
                      <div className="absolute inset-x-4 top-4 rounded-full border border-white/30 bg-white/18 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/86 backdrop-blur-md">
                        {isZh ? 'Light Editorial High-End' : 'Light Editorial High-End'}
                      </div>
                      <div className="relative flex h-full min-h-[29rem] flex-col justify-between p-6">
                        <div />
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/14 px-3 py-1.5 text-xs text-white/86 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            {isZh ? '人文叙事驱动' : 'Human narrative driven'}
                          </div>
                          <div className="rounded-[1.9rem] border border-white/28 bg-white/16 p-5 backdrop-blur-xl">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                              {isZh ? '品牌视角' : 'Brand perspective'}
                            </p>
                            <p className="mt-3 text-[1.45rem] font-serif leading-tight text-white">
                              {isZh ? '把送礼从“避免出错”，提升到“表达得体、被真实感知”。' : 'Move gifting beyond avoiding mistakes and toward being felt with tact and clarity.'}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-white/76">
                              {isZh
                                ? '首页不再展示工具化卡片，而是用统一的摄影、留白和叙事层次去建立品牌信任。'
                                : 'The homepage now builds trust through photography, whitespace, and narrative hierarchy instead of stacked utility cards.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}
