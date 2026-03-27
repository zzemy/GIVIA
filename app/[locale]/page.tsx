'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

const homepagePhotography = {
  wrapped:
    'https://images.pexels.com/photos/35126573/pexels-photo-35126573.jpeg?cs=srgb&dl=pexels-iris-35126573.jpg&fm=jpg',
  letter:
    'https://images.pexels.com/photos/10479673/pexels-photo-10479673.jpeg?cs=srgb&dl=pexels-jonathanborba-10479673.jpg&fm=jpg',
  parcel:
    'https://images.pexels.com/photos/6869042/pexels-photo-6869042.jpeg?cs=srgb&dl=pexels-kindelmedia-6869042.jpg&fm=jpg',
}

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'

  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#f7f2ea] ${isZh ? 'font-sans-zh' : ''}`}>
      <HomeBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.82),transparent_26%),radial-gradient(circle_at_86%_22%,rgba(202,214,242,0.22),transparent_24%),linear-gradient(180deg,rgba(247,242,234,0.82),rgba(250,247,242,0.96))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1580px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            {isZh ? (
              <>
                <p className="text-[0.78rem] tracking-[0.18em] text-[#7c8490]">礼智极意</p>
                <p className="mt-2 text-[2.3rem] font-serif tracking-[-0.08em] text-[#191614]">Givia</p>
                <p className="mt-3 text-[0.78rem] tracking-[0.16em] text-[#8a919e]">智连全球文化，礼赠每一份心意</p>
              </>
            ) : (
              <>
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#7c8490]">Givia</p>
                <p className="mt-2 text-[2.5rem] font-serif tracking-[-0.08em] text-[#191614]">Cross-cultural gifting editorial</p>
                <p className="mt-3 text-[0.78rem] uppercase tracking-[0.18em] text-[#8a919e]">Human tact, cultural intelligence, considered arrival</p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
            className="border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
          >
            {isZh ? 'Switch to English' : '切换中文'}
          </button>
        </motion.header>

        <div className="grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:py-4">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[42rem] flex-col justify-end pb-6 lg:pb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7182cd]">{isZh ? '礼赠叙事' : 'Editorial gifting'}</p>
            <h1
              className={`mt-6 text-[4.2rem] leading-[0.88] tracking-[-0.1em] text-[#1a1715] sm:text-[5.2rem] xl:text-[6.55rem] ${
                isZh ? 'font-display-zh font-semibold' : 'font-serif'
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">让一份心意，</span>
                  <span className="block text-[#5f72c8]">以更得体的方式</span>
                  <span className="block">进入另一种文化。</span>
                </>
              ) : (
                <>
                  <span className="block">Let a gesture</span>
                  <span className="block text-[#5f72c8]">enter another culture</span>
                  <span className="block">with tact and grace.</span>
                </>
              )}
            </h1>

            <p className="mt-8 max-w-[33rem] text-[1.04rem] leading-9 text-[#626a77]">
              {isZh
                ? 'Givia 是一位 AI 礼赠编辑，会把礼物、关系、国家与送达语气放进同一份叙事里，让跨文化送礼不再只靠直觉。'
                : 'Givia is an AI gifting editor that reads a gesture through relationship, place, ritual, and delivery tone before it is sent.'}
            </p>

            <div className="mt-10 grid gap-4 border-t border-black/10 pt-5 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? '品牌注脚' : 'Brand note'}</p>
                <p className="mt-3 text-[1.16rem] font-serif leading-8 text-[#1a1715]">
                  {isZh
                    ? '真正高级的礼物，不只被看见，更要经过 AI 对文化分寸与人情语气的温和校准。'
                    : 'A refined gift is not merely seen. It is gently calibrated by AI against cultural tact and human tone.'}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? '终稿输出' : 'Final output'}</p>
                <p className="mt-3 text-[1rem] leading-8 text-[#626a77]">
                  {isZh
                    ? '你会获得一份由 AI 生成的礼赠终稿，包含文化风险、表达方式、包装语气与替代方向。'
                    : 'You receive an AI-authored gifting dossier covering cultural risk, message tone, packaging direction, and better alternatives.'}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.985 }}
              className="group mt-12 flex items-center justify-between border-t border-black/10 py-5 text-left"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? '进入主叙事' : 'Enter the editorial'}</p>
                <p className="mt-2 text-[1.72rem] font-serif text-[#1a1715]">{isZh ? '开始这次礼赠编辑' : 'Begin the gifting editorial'}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#5f72c8] transition duration-500 group-hover:translate-x-1" />
            </motion.button>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid min-h-[34rem] gap-4 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.78fr)]"
          >
            <article
              className="relative overflow-hidden rounded-[2.75rem] shadow-[0_36px_84px_-48px_rgba(15,23,42,0.22)] lg:row-span-2"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(16,13,10,0.34)),url(${homepagePhotography.wrapped})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.22),transparent_26%)] mix-blend-screen" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/64">{isZh ? '包装与分寸' : 'Packaging and tact'}</p>
                <div className="max-w-[18rem] rounded-[2rem] border border-white/14 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/62">{isZh ? '礼赠终稿' : 'Final dossier'}</p>
                  <p className="mt-3 text-[1.35rem] font-serif leading-tight">
                    {isZh
                      ? '从礼物本身，到它最后被怎样递出去。'
                      : 'From the object itself to the manner in which it is finally handed over.'}
                  </p>
                </div>
              </div>
            </article>

            <article
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(22,18,16,0.28)),url(${homepagePhotography.letter})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className="max-w-[14rem] text-[1.12rem] font-serif leading-tight text-white">
                  {isZh ? '语气、卡片与措辞，也属于礼物的一部分。' : 'Tone, card, and wording belong to the gift as much as the object does.'}
                </p>
              </div>
            </article>

            <article
              className="relative overflow-hidden rounded-[2.35rem] shadow-[0_30px_72px_-50px_rgba(15,23,42,0.2)]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.02),rgba(18,14,12,0.26)),url(${homepagePhotography.parcel})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative flex h-full items-end p-6">
                <p className="max-w-[15rem] text-[1.12rem] font-serif leading-tight text-white">
                  {isZh ? '送达方式、节奏与距离，会改变好意如何被接住。' : 'Delivery timing, distance, and ceremony change how goodwill is received.'}
                </p>
              </div>
            </article>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
