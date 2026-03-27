'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function RootPage() {
  const router = useRouter()

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/zh')
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [router])

  return (
    <div className="relative h-screen overflow-hidden bg-[#f6f1ea] text-[#181614]">
      <HomeBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.24),transparent_28%),linear-gradient(180deg,rgba(246,241,234,0.22),rgba(18,16,14,0.08))]" />

      <div className="absolute inset-y-0 right-0 hidden w-[56%] lg:block">
        <div
          className="absolute inset-[2rem_2rem_2rem_0] overflow-hidden rounded-[2.8rem] bg-cover bg-center shadow-[0_40px_90px_-50px_rgba(15,23,42,0.28)]"
          style={{
            backgroundImage:
              'linear-gradient(180deg,rgba(250,247,243,0.06),rgba(15,13,12,0.42)), url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80)',
          }}
        />
        <div className="absolute inset-[2rem_2rem_2rem_0] rounded-[2.8rem] bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.22),transparent_24%)] mix-blend-screen" />
      </div>

      <main className="relative z-10 mx-auto flex h-screen max-w-[1600px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#7e8696]">Global editorial house</p>
            <p className="mt-2 text-[2.7rem] font-serif tracking-[-0.08em] text-[#1b1714]">Givia</p>
          </div>
          <div className="hidden max-w-[14rem] text-right text-[10px] uppercase tracking-[0.22em] text-[#8e95a2] lg:block">
            礼智极意 · Cross-cultural gifting editorial
          </div>
        </motion.header>

        <div className="grid flex-1 items-end gap-8 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-0">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-w-[38rem] flex-col justify-end pb-4 lg:pb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7f89b4]">Editorial preface</p>
            <h1 className="mt-6 max-w-[12ch] text-[4.25rem] font-serif leading-[0.88] tracking-[-0.1em] text-[#1b1714] sm:text-[5.15rem] xl:text-[6.35rem]">
              Before a gesture crosses a border, it enters another life.
            </h1>
            <p className="mt-8 max-w-[32rem] text-[1.02rem] leading-9 text-[#646c79]">
              Givia reads how a gift may be understood elsewhere — through culture, tone, relationship, and memory — before it is sent.
            </p>

            <div className="mt-10 max-w-[34rem] border-t border-black/10 pt-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Brand prelude</p>
              <p className="mt-3 text-[1.12rem] font-serif leading-8 text-[#1b1714]">
                Cross-cultural gifting should feel informed, composed, and deeply human long before it feels efficient.
              </p>
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
                  <p className="mt-2 text-[1.55rem] font-serif text-[#1b1714]">Continue in 中文</p>
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
                  <p className="mt-2 text-[1.55rem] font-serif text-[#1b1714]">Enter in English</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#6478c8] transition duration-500 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.05, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden h-full min-h-0 items-end justify-end lg:flex"
          >
            <div className="mb-10 mr-6 max-w-[18rem] border-l border-white/26 pl-6 text-white/86">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/58">Gesture / Culture / Memory</p>
              <p className="mt-4 text-[1.35rem] font-serif leading-tight">
                The same gift may read as intimate, ceremonial, excessive, or perfectly poised — depending on where it lands.
              </p>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
