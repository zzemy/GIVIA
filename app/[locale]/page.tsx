'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe2, HeartHandshake, Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'

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
              className="relative min-h-[420px] lg:min-h-[600px]"
            >
              <div className="absolute left-[2%] top-[28%] z-10 hidden w-[32%] rounded-[2rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(234,237,241,0.86))] p-5 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.28)] backdrop-blur-xl lg:block">
                <p className="text-sm font-medium text-[#5e6572]">Cultural Connection</p>
                <div className="mt-24 flex items-center gap-2 text-sm text-[#7f8795]">
                  <Globe2 className="h-4 w-4" />
                  <span>Tokyo, Japan</span>
                </div>
              </div>

              <div className="absolute right-[5%] top-[2%] z-20 w-full max-w-[21rem] overflow-hidden rounded-[2.4rem] border border-white/95 bg-[linear-gradient(180deg,rgba(255,220,214,0.9),rgba(249,216,206,0.88))] p-4 shadow-[0_38px_90px_-48px_rgba(15,23,42,0.42)] sm:max-w-[23rem] xl:max-w-[25rem]">
                <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#f5d3ca_0%,#f7cabd_26%,#eb2fa0_26.5%,#f52dac_72%,#cf0f79_100%)] px-6 py-8">
                  <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:radial-gradient(rgba(84,39,16,0.75)_1.6px,transparent_1.6px)] [background-size:22px_22px]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(255,255,255,0.32),transparent_26%),radial-gradient(circle_at_78%_78%,rgba(255,219,120,0.22),transparent_28%)]" />
                  <div className="relative mx-auto mt-10 h-[14rem] w-[12.5rem] rounded-[1.6rem] border border-white/18 bg-[linear-gradient(180deg,#ff41bf_0%,#eb118a_100%)] shadow-[0_34px_54px_-30px_rgba(136,6,82,0.62)]">
                    <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-[linear-gradient(180deg,#f9d992_0%,#c7932e_100%)] shadow-[0_0_18px_rgba(244,194,74,0.52)]" />
                    <div className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 bg-[linear-gradient(90deg,#f9d992_0%,#c7932e_100%)] shadow-[0_0_18px_rgba(244,194,74,0.52)]" />
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full border-[10px] border-[#c7932e] border-l-transparent border-t-transparent" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[15%] right-[23%] z-30 rounded-[1.55rem] border border-white/88 bg-white/86 px-5 py-4 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl">
                <p className="text-sm font-medium text-[#4d5564]">{isZh ? '心意解析完成' : 'Intention Decoded'}</p>
                <div className="mt-3 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 rounded-full bg-[#6c7fd2]" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                </div>
              </div>

              <motion.div
                initial={{ y: 10 }}
                animate={{ y: -12 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute bottom-[8%] right-[8%] z-40 flex w-[8.8rem] flex-col items-center rounded-[1.9rem] border border-white/88 bg-white/86 px-4 py-5 text-center shadow-[0_28px_54px_-34px_rgba(15,23,42,0.28)] backdrop-blur-xl"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <p className="text-[2rem] font-semibold leading-none text-[#262830]">99%</p>
                <p className="mt-2 text-xs tracking-[0.16em] text-[#7c8596]">{isZh ? '文化契合度' : 'Cultural fit'}</p>
              </motion.div>

              <div className="absolute left-0 top-[8%] z-0 hidden h-[16rem] w-[16rem] rounded-full bg-[#dce7fb] blur-3xl lg:block" />
              <div className="absolute bottom-[5%] right-[10%] z-0 hidden h-[15rem] w-[15rem] rounded-full bg-[#f8dfc5] blur-3xl lg:block" />
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}
