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

  return (
    <div className={`relative h-screen overflow-hidden bg-[#f7f2eb] ${isZh ? 'font-sans-zh' : ''}`}>
      <HomeBackground />

      <div
        className="absolute inset-y-0 right-0 w-full bg-cover bg-center lg:w-[54%]"
        style={{
          backgroundImage: isZh
            ? 'linear-gradient(180deg,rgba(250,247,243,0.04),rgba(17,15,14,0.48)), url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80)'
            : 'linear-gradient(180deg,rgba(250,247,243,0.04),rgba(17,15,14,0.48)), url(https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1800&q=80)',
        }}
      />
      <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,rgba(247,242,235,0.98)_0%,rgba(247,242,235,0.86)_30%,rgba(247,242,235,0.16)_62%,rgba(247,242,235,0)_100%)] lg:w-[54%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.18),transparent_26%)]" />

      <main className="relative z-10 mx-auto flex h-screen max-w-[1600px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            {isZh ? (
              <>
                <p className="text-[0.78rem] tracking-[0.16em] text-[#6d7481]">礼智极意</p>
                <p className="mt-1 text-[2.2rem] font-serif tracking-[-0.08em] text-[#1c1815]">Givia</p>
              </>
            ) : (
              <>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#7e8696]">Givia</p>
                <p className="mt-1 text-[2.45rem] font-serif tracking-[-0.08em] text-[#1c1815]">Editorial house</p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
            className="border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#1c1815]"
          >
            {isZh ? 'Switch to English' : '切换中文'}
          </button>
        </motion.header>

        <div className="grid flex-1 items-end py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:py-0">
          <motion.section
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.92, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-w-[38rem] flex-col justify-end pb-6 lg:pb-14"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7485d4]">{isZh ? '礼赠前言' : 'Editorial preface'}</p>
            <h1
              className={`mt-6 text-[4.15rem] leading-[0.88] tracking-[-0.1em] text-[#1c1815] sm:text-[5.05rem] xl:text-[6.15rem] ${
                isZh ? 'font-display-zh font-semibold' : 'font-serif'
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">让一份心意，</span>
                  <span className="block text-[#6577c8]">以更得体的方式</span>
                  <span className="block">进入另一种文化。</span>
                </>
              ) : (
                <>
                  <span className="block">Let a gesture</span>
                  <span className="block text-[#6577c8]">enter another culture</span>
                  <span className="block">with more tact.</span>
                </>
              )}
            </h1>

            <p className="mt-8 max-w-[31rem] text-[1.02rem] leading-9 text-[#636b79]">
              {isZh
                ? '这不是一次普通的送礼填写，而是一段关于关系、文化、语气与送达方式的礼赠编辑。'
                : 'This is not a generic gifting form, but an editorial passage through relationship, culture, tone, and delivery.'}
            </p>

            <motion.button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.985 }}
              className="group mt-12 flex items-center justify-between border-t border-black/10 py-5 text-left"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? '进入主叙事' : 'Enter the main narrative'}</p>
                <p className="mt-2 text-[1.7rem] font-serif text-[#1c1815]">{isZh ? '开始这次礼赠编辑' : 'Enter the editorial'}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#6577c8] transition duration-500 group-hover:translate-x-1" />
            </motion.button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden items-end justify-end lg:flex"
          >
            <div className="mb-12 mr-5 max-w-[20rem] rounded-[2rem] border border-white/18 bg-white/12 px-5 py-5 text-white/88 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/58">{isZh ? 'Culture / Relation / Tone' : 'Culture / Relation / Tone'}</p>
              <p className="mt-4 text-[1.35rem] font-serif leading-tight">
                {isZh
                  ? '真正决定礼物是否得体的，往往不是价格，而是它如何被对方理解。'
                  : 'What decides whether a gift feels right is rarely price alone, but how the other person is likely to read it.'}
              </p>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
