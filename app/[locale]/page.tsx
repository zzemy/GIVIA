'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'

  const heroPhotos = {
    gift: 'https://unsplash.com/photos/IsOQu4nML-Y/download?force=true&w=1600',
    hands: 'https://unsplash.com/photos/EVeqqKNCzRo/download?force=true&w=1200',
    market: 'https://unsplash.com/photos/74bXIcqEa20/download?force=true&w=1200',
  }

  return (
    <div className={`home-editorial-shell relative min-h-screen overflow-hidden ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[2.2rem] font-serif font-semibold tracking-[-0.07em] text-[#231f1a]">Givia</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#566fd1]" />
            <span className="hidden text-[11px] uppercase tracking-[0.28em] text-[#98a2b3] md:inline-block">
              {isZh ? 'Editorial gifting intelligence' : 'Editorial gifting intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
              className="rounded-full border border-black/6 bg-white/56 px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#7e8593] transition hover:bg-white/80 hover:text-[#1f2d3d]"
            >
              {isZh ? 'EN' : '中文'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              className="rounded-full bg-[#191814] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-[#24221e]"
            >
              {isZh ? '进入体验' : 'Enter the experience'}
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-w-[34rem] flex-col justify-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d9dded] bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#6c78ab] shadow-[0_14px_34px_-26px_rgba(15,23,42,0.12)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6c78ab]" />
                  {isZh ? '每一份跨文化礼物，都会先被阅读' : 'Every cross-cultural gift is read first'}
                </div>

                <h1
                  className={`mt-8 max-w-[10ch] text-[4.1rem] leading-[0.9] tracking-[-0.08em] text-[#1d1915] sm:text-[5.1rem] xl:text-[6.2rem] ${
                    isZh ? 'font-display-zh font-semibold' : 'font-serif font-semibold'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">让心意，</span>
                      <span className="block text-[#5f73d7]">跨越山海，</span>
                      <span className="block">也不失分寸。</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Let the gesture</span>
                      <span className="block text-[#5f73d7]">cross borders</span>
                      <span className="block">without losing tact.</span>
                    </>
                  )}
                </h1>

                <p className="mt-8 max-w-[31rem] text-lg font-light leading-9 text-[#676d79]">
                  {isZh
                    ? '融合全球文化图谱与 AI 洞察，在送出之前先判断这份礼物会如何被理解。Givia 帮你避开文化误读、关系失分与表达失准，让好意更自然地被接住。'
                    : 'Blending cultural knowledge with AI reading, Givia helps you judge how a gift may be understood before it leaves you, so the gesture can arrive with more grace and less risk of misreading.'}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/gifting`)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-[#5f73d7] px-8 py-4 text-base font-medium text-white shadow-[0_24px_48px_-28px_rgba(95,115,215,0.48)] transition hover:-translate-y-0.5 hover:bg-[#5668c7]"
                  >
                    {isZh ? '开始心意之旅' : 'Begin the gifting story'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-6 text-sm leading-7 text-[#8b909b]">
                  {isZh
                    ? '物件 → 语境 → 判断 → 提案'
                    : 'Object → Context → Judgment → Proposal'}
                </p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="mx-auto max-w-[860px]">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
                  <article className="relative overflow-hidden rounded-[2.8rem] border border-white/92 bg-[#efe8de] shadow-[0_40px_80px_-48px_rgba(15,23,42,0.28)]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${heroPhotos.gift})` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(33,26,22,0.24))]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.3),transparent_30%)] mix-blend-screen" />
                    <div className="relative flex aspect-[4/5] flex-col justify-between p-6 sm:p-8">
                      <div className="inline-flex w-fit items-center rounded-full border border-white/50 bg-white/34 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
                        {isZh ? 'Cultural connection' : 'Cultural connection'}
                      </div>

                      <div className="max-w-[24rem]">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/76">
                          {isZh ? '礼物不只是一件物品' : 'A gift is never just an object'}
                        </p>
                        <p className="mt-4 text-[2rem] font-serif leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.5rem]">
                          {isZh
                            ? '它会连同包装、气氛与关系，一起被对方阅读。'
                            : 'It arrives with packaging, atmosphere, and relationship already attached to it.'}
                        </p>
                      </div>
                    </div>
                  </article>

                  <div className="flex flex-col justify-between gap-5">
                    <article className="relative overflow-hidden rounded-[2.25rem] border border-white/92 shadow-[0_28px_56px_-36px_rgba(15,23,42,0.22)]">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroPhotos.hands})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(31,24,20,0.44))]" />
                      <div className="relative flex aspect-[3/4] items-end p-5">
                        <p className="max-w-[10rem] text-[1.35rem] font-serif leading-tight text-white">
                          {isZh ? '关系，决定礼物被读成什么。' : 'Relationship shapes how the gift is read.'}
                        </p>
                      </div>
                    </article>

                    <article className="relative overflow-hidden rounded-[2.25rem] border border-white/92 shadow-[0_28px_56px_-36px_rgba(15,23,42,0.22)]">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroPhotos.market})` }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(20,18,16,0.52))]" />
                      <div className="relative flex aspect-[3/4] items-end p-5">
                        <p className="max-w-[10rem] text-sm leading-7 text-white/88">
                          {isZh
                            ? '换一个地方，同样的礼物，也会被另一套文化经验重新解释。'
                            : 'In another place, the same gift is re-read through another cultural memory.'}
                        </p>
                      </div>
                    </article>
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
