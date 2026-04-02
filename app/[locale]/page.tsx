'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

const routePhotography = {
  wrapped:
    '/editorial/hero-family.jpg?v=2',
  tea:
    '/editorial/hero-festival.jpg?v=2',
  meeting:
    '/editorial/hero.jpg?v=2',
}

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#f6f1ea] text-[#181614] lg:h-[100dvh] lg:overflow-hidden ${isZh ? 'font-sans-zh' : ''}`}>
      <HomeBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.76),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(206,217,242,0.2),transparent_24%),linear-gradient(180deg,rgba(246,241,234,0.82),rgba(249,246,241,0.96))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1580px] flex-col px-4 py-4 sm:px-8 xl:px-12 lg:h-full lg:min-h-0">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-none flex-wrap items-start justify-between gap-3 sm:gap-4"
        >
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#7e8696]">The Art of Gifting</p>
            <p className={`mt-2 text-[2.2rem] tracking-[-0.08em] text-[#1b1714] sm:text-[2.8rem] ${isZh ? 'font-display-zh' : 'font-serif'}`}>{isZh ? '礼智极意' : 'Givia'}</p>
            <p className="mt-3 text-[0.78rem] tracking-[0.16em] text-[#8a919e] uppercase">
              {isZh ? '智联全球文化，礼赠每一份心意' : 'Human tact, cultural intelligence, considered arrival'}
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
            className="mt-2 border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#8e95a2] transition hover:text-[#1b1714] sm:mt-3"
          >
            {isZh ? 'EN Edition' : 'ZH Edition'}
          </button>
        </motion.header>

        <div className="grid min-h-0 flex-1 items-start gap-6 py-4 lg:items-center lg:gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:gap-16">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center min-h-0 lg:pb-8"
          >
            <div className="xl:pl-4">
              <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#7f89b4]">
                <span className="h-[1px] w-6 bg-[#7f89b4]/50" />
                {isZh ? '文化·人情·叙事' : 'Editorial preface'}
              </p>
              <h1 className={`mt-5 text-[2.35rem] leading-[1.05] tracking-[-0.04em] text-[#1b1714] sm:mt-6 sm:text-[3.6rem] xl:text-[5.2rem] ${isZh ? 'font-display-zh' : 'font-serif'}`}>
                {isZh ? (
                  <>
                    <span className="inline-block whitespace-nowrap">
                      在<em className="font-light italic text-[#7282c6] px-1.5 opacity-90">跨越国界</em>之前
                    </span>
                    <br />
                    <span className="relative inline-block mt-2">
                      <span className="relative z-10">让心意得体着陆</span>
                      <span className="absolute bottom-2 left-0 -z-10 h-4 w-full rounded-sm bg-[#e1e7f5]" />
                    </span>
                  </>
                ) : (
                  <>
                    Before a <em className="pr-1.5 font-light italic text-[#7282c6]">gesture</em><br />
                    crosses a border,<br />
                    it enters <span className="relative inline-block"><span className="relative z-10">another</span><span className="absolute bottom-2 left-0 -z-10 h-3.5 w-full rounded-full bg-[#e1e7f5]" /></span> life.
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-[32rem] text-[0.98rem] leading-relaxed text-[#646c79] sm:mt-6 sm:text-[1.05rem]">
                {isZh
                  ? '我们不制造礼品，而是为您提供一份富有温度的「礼赠纪要」。从禁忌排雷、赠言润色，到递送的呼吸感，让跨国心意不再由于文化折射而产生偏差。'
                  : 'We prepare an AI-authored gifting dossier. Enter a considered editorial workflow built entirely around cultural tact, relationship, and the manner of arrival.'}
              </p>

              <div className="mt-8 grid gap-4 border-t border-black/10 pt-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '风尚理念' : 'Brand note'}</p>
                  <p className={`mt-2 text-[1rem] leading-[1.6] text-[#1b1714] ${isZh ? 'font-display-zh' : 'font-serif'}`}>
                    {isZh
                      ? '真正高级的礼物，不只被看见。它需被一种懂分寸的智慧轻轻托起。'
                      : 'A refined gift is not merely seen. It is gently calibrated against cultural tact.'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '典藏终稿' : 'Final output'}</p>
                  <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#646c79]">
                    {isZh
                      ? '详尽的文化适配评估、包装仪式感建议与替代方案。'
                      : 'A structured dossier on cultural fit, wording, packaging, and alternative directions.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-5 sm:mt-8 sm:pt-6">
                <motion.button
                  type="button"
                  onClick={() => router.push(`/${locale}/gifting`)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full flex-col items-start justify-between rounded-[1.5rem] bg-transparent p-6 transition-all duration-500 hover:bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-black/[0.08] hover:border-transparent sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-black/10 transition-colors duration-500 group-hover:bg-[#7282c6]" />
                      <p className="text-[10px] font-medium tracking-[0.28em] text-[#8e95a2] uppercase">{isZh ? '进入主叙事' : 'Enter the editorial'}</p>
                    </div>
                    <p className="mt-4 text-[1.5rem] font-medium font-sans tracking-[0.1em] text-[#1b1714] sm:mt-2">
                      {isZh ? '定制礼赠纪要' : 'Begin the gifting journey'}
                    </p>
                  </div>
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-transparent transition-all duration-500 group-hover:border-transparent group-hover:bg-[#1b1714] sm:mt-0">
                    <ArrowRight className="h-4 w-4 text-[#8e95a2] transition-colors duration-500 group-hover:text-white" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 }
              }
            }}
            className="grid min-h-[20rem] gap-3 pb-2 lg:h-[85%] lg:max-h-[44rem] lg:min-h-[22rem] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.82fr)]"
          >
            <motion.article variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="relative overflow-hidden rounded-[2.75rem] shadow-[0_36px_84px_-48px_rgba(15,23,42,0.22)] lg:row-span-2"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(16,13,10,0.34)),url(${routePhotography.wrapped})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.22),transparent_28%)] mix-blend-screen" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/64">
                  {isZh ? '视觉与分寸' : 'Packaging & tact'}
                </p>
                <div className="max-w-[18rem]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/64">
                    {isZh ? '第一眼感官' : 'The first glance'}
                  </p>
                  <p className={`mt-3 text-[1.4rem] leading-snug drop-shadow-sm ${isZh ? 'font-display-zh' : 'font-serif'}`}>
                    {isZh
                      ? '不仅仅是包裹之物，更是它呈现在异国眼前的全部仪态与修养。'
                      : 'More than the object itself—it is the posture and grace with which it arrives.'}
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(22,18,16,0.28)),url(${routePhotography.tea})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className={`max-w-[15rem] text-[1.12rem] leading-tight text-white drop-shadow-sm ${isZh ? 'font-display-zh' : 'font-serif'}`}>
                  {isZh
                    ? '附赠的只言片语，往往比礼物本身更考验跨文化的共情。'
                    : 'Tone and wording carry the weight of translation far beyond the gift itself.'}
                </p>
              </div>
            </motion.article>

            <motion.article variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(18,14,12,0.26)),url(${routePhotography.meeting})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className={`max-w-[15rem] text-[1.12rem] leading-tight text-white drop-shadow-sm ${isZh ? 'font-display-zh' : 'font-serif'}`}>
                  {isZh
                    ? '递送的方式与距离，决定了这份善意将以何种姿态被温柔接纳。'
                    : 'Delivery timing and ceremony determine exactly how your goodwill is received.'}
                </p>
              </div>
            </motion.article>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
