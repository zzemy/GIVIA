'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

const routePhotography = {
  wrapped:
    'https://images.pexels.com/photos/35126573/pexels-photo-35126573.jpeg?cs=srgb&dl=pexels-iris-35126573.jpg&fm=jpg',
  tea:
    'https://images.pexels.com/photos/5976086/pexels-photo-5976086.jpeg?cs=srgb&dl=pexels-roman-odintsov-5976086.jpg&fm=jpg',
  meeting:
    'https://images.pexels.com/photos/7937690/pexels-photo-7937690.jpeg?cs=srgb&dl=pexels-pavel-danilyuk-7937690.jpg&fm=jpg',
}

export default function RootPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f1ea] text-[#181614]">
      <HomeBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.76),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(206,217,242,0.2),transparent_24%),linear-gradient(180deg,rgba(246,241,234,0.82),rgba(249,246,241,0.96))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1580px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#7e8696]">Givia</p>
            <p className="mt-2 text-[2.8rem] font-serif tracking-[-0.08em] text-[#1b1714]">礼智极意</p>
            <p className="mt-3 text-[0.78rem] tracking-[0.16em] text-[#8a919e]">智连全球文化，礼赠每一份心意</p>
          </div>
          <div className="hidden max-w-[16rem] text-right text-[10px] uppercase tracking-[0.22em] text-[#8e95a2] lg:block">
            Cross-cultural gifting, composed as a bright editorial journey
          </div>
        </motion.header>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-end lg:py-4">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[40rem] flex-col justify-end pb-4 lg:pb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7f89b4]">Editorial preface</p>
            <h1 className="mt-6 max-w-[13ch] text-[4.25rem] font-serif leading-[0.88] tracking-[-0.1em] text-[#1b1714] sm:text-[5.15rem] xl:text-[6.35rem]">
              Before a gesture crosses a border, it enters another life.
            </h1>
            <p className="mt-8 max-w-[32rem] text-[1.04rem] leading-9 text-[#646c79]">
              Choose a language edition and enter a brighter editorial workflow built around culture, tact, relationship, and arrival.
            </p>

            <div className="mt-10 grid gap-4 border-t border-black/10 pt-5 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">What this is</p>
                <p className="mt-3 text-[1.12rem] font-serif leading-8 text-[#1b1714]">
                  A narrative gifting system that reads what a present means before it is sent.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">What you receive</p>
                <p className="mt-3 text-[1rem] leading-8 text-[#646c79]">
                  A report on cultural fit, wording, packaging, alternatives, and the right way for a gesture to land.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <motion.button
                type="button"
                onClick={() => router.push('/zh')}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group flex w-full items-center justify-between border-t border-black/10 py-5 text-left"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">进入中文语境</p>
                  <p className="mt-2 text-[1.58rem] font-serif text-[#1b1714]">Continue in 中文</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#6478c8] transition duration-500 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push('/en')}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group flex w-full items-center justify-between border-t border-black/10 py-5 text-left"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Enter the English edition</p>
                  <p className="mt-2 text-[1.58rem] font-serif text-[#1b1714]">Enter in English</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#6478c8] transition duration-500 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.05, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid min-h-[34rem] gap-4 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.82fr)]"
          >
            <article
              className="relative overflow-hidden rounded-[2.75rem] shadow-[0_36px_84px_-48px_rgba(15,23,42,0.22)] lg:row-span-2"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(16,13,10,0.34)),url(${routePhotography.wrapped})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.22),transparent_28%)] mix-blend-screen" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/64">Gift / Context / Arrival</p>
                <div className="max-w-[18rem] rounded-[2rem] border border-white/14 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">Bright editorial system</p>
                  <p className="mt-3 text-[1.35rem] font-serif leading-tight">
                    Build the gift around people, culture, and the way it should be received.
                  </p>
                </div>
              </div>
            </article>

            <article
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(22,18,16,0.28)),url(${routePhotography.tea})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className="max-w-[15rem] text-[1.12rem] font-serif leading-tight text-white">
                  Ritual, hospitality, and the mood of receiving are part of the gift.
                </p>
              </div>
            </article>

            <article
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(18,14,12,0.26)),url(${routePhotography.meeting})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className="max-w-[15rem] text-[1.12rem] font-serif leading-tight text-white">
                  Every destination carries its own codes of courtesy, intimacy, and timing.
                </p>
              </div>
            </article>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
