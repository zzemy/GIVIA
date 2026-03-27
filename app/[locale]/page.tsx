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
    lead: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1800&q=80',
    relation: 'https://images.unsplash.com/photo-1519741491041-6750297b4d0d?auto=format&fit=crop&w=1200&q=80',
    city: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80',
  }

  return (
    <div className={`relative h-screen overflow-hidden bg-[#f7f4ef] ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <div className="relative z-10 mx-auto flex h-screen w-full max-w-[1540px] flex-col overflow-hidden px-6 pb-8 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4">
            {isZh ? (
              <>
                <div className="flex flex-col leading-none">
                  <span className="text-[1.2rem] font-display-zh font-semibold tracking-[0.02em] text-[#211d18]">礼智极意</span>
                  <span className="mt-1 text-[0.72rem] uppercase tracking-[0.22em] text-[#7f8696]">Givia</span>
                </div>
                <div className="h-10 w-px bg-black/8" />
                <p className="max-w-[8rem] text-[10px] tracking-[0.18em] text-[#8a90a0]">跨文化礼赠编辑</p>
              </>
            ) : (
              <>
                <span className="text-[2.3rem] font-serif tracking-[-0.08em] text-[#211d18]">Givia</span>
                <div className="h-10 w-px bg-black/8" />
                <p className="max-w-[10rem] text-[10px] uppercase tracking-[0.22em] text-[#8a90a0]">Cross-cultural gifting editorial</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/6 bg-white/64 p-1.5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
              className="rounded-full px-4 py-2.5 text-sm uppercase tracking-[0.18em] text-[#626977] transition hover:text-[#1a2233]"
            >
              {isZh ? 'EN' : '中文'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              className="rounded-full bg-[#171513] px-5 py-2.5 text-sm text-white transition hover:bg-[#23201d]"
            >
              {isZh ? '进入礼赠编辑' : 'Enter the editorial'}
            </button>
          </div>
        </header>

        <main className="grid h-full flex-1 items-center gap-10 overflow-hidden py-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[35rem] flex-col justify-center"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6c78ab]">
              {isZh ? '礼智极意' : 'Givia'}
            </p>

            <h1
              className={`mt-6 text-[4.2rem] leading-[0.88] tracking-[-0.09em] text-[#1d1916] sm:text-[5.1rem] xl:text-[6.3rem] ${
                isZh ? 'font-display-zh font-semibold' : 'font-serif'
              }`}
            >
              {isZh ? (
                <>
                  <span className="block">智连全球文化，</span>
                  <span className="block text-[#6678c8]">礼赠每一份心意</span>
                </>
              ) : (
                <>
                  <span className="block">Find the right language</span>
                  <span className="block text-[#6678c8]">for a thoughtful gesture,</span>
                  <span className="block">so it arrives gently across cultures.</span>
                </>
              )}
            </h1>

            <p className="mt-8 max-w-[31rem] text-[1.04rem] leading-9 text-[#666d79]">
              {isZh
                ? '礼智极意会先陪你看清关系、场景与文化语气，再把这份好意整理成更得体、更国际化的送达方式。'
                : 'Givia reads relationship, setting, and cultural tone first, then shapes the gesture into a more tactful way to arrive across cultures.'}
            </p>

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={() => router.push(`/${locale}/gifting`)}
                className="inline-flex items-center gap-3 rounded-full bg-[#6678c8] px-7 py-4 text-sm uppercase tracking-[0.12em] text-white shadow-[0_24px_44px_-26px_rgba(102,120,200,0.44)] transition hover:-translate-y-0.5 hover:bg-[#5c6eba]"
              >
                {isZh ? '开始这次礼赠编辑' : 'Begin the gifting editorial'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="max-w-[11rem] text-sm leading-7 text-[#8b9099]">
                {isZh ? '从物件到关系，再到文化判断，整段送达会被慢慢写清。' : 'From object to relationship to cultural reading, the full gesture is edited with care.'}
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full min-h-0"
          >
            <div className="grid h-full max-h-[780px] min-h-0 gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <article className="group relative min-h-0 overflow-hidden rounded-[3.2rem] shadow-[0_40px_90px_-48px_rgba(15,23,42,0.28)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${heroPhotos.lead})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(18,17,15,0.5))]" />
                <div className="relative flex h-full min-h-[30rem] flex-col justify-between p-8 sm:p-10 xl:p-12">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/72">Gift / Relation / Atmosphere</p>
                  <p className="max-w-[26rem] text-[2.4rem] font-serif leading-[1.03] tracking-[-0.05em] text-white sm:text-[3rem]">
                    {isZh
                      ? '礼物从来不只是一个物件，它总会连同关系、气氛与记忆一起抵达。'
                      : 'A gift is never received as an object alone; it arrives with memory, atmosphere, and relationship already attached.'}
                  </p>
                </div>
              </article>

              <div className="grid min-h-0 grid-rows-[0.94fr_1.06fr] gap-5">
                <article className="group relative overflow-hidden rounded-[2.35rem] shadow-[0_28px_60px_-34px_rgba(15,23,42,0.22)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${heroPhotos.relation})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(22,20,18,0.42))]" />
                  <div className="relative flex h-full min-h-[16rem] items-end p-6">
                    <p className="max-w-[12rem] text-[1.18rem] font-serif leading-tight text-white">
                      {isZh ? '人与人的距离，往往比礼物本身更先被读懂。' : 'Distance between people is often read before the object itself.'}
                    </p>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-[2.35rem] bg-[rgba(255,255,255,0.52)] p-5 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                  <div className="grid h-full gap-5 sm:grid-cols-[0.94fr_1.06fr]">
                    <div className="relative overflow-hidden rounded-[1.9rem]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                        style={{ backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.06),rgba(24,22,21,0.34)),url(${heroPhotos.city})` }}
                      />
                    </div>
                    <div className="flex flex-col justify-between rounded-[1.9rem] bg-[rgba(255,255,255,0.62)] p-6">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#6f7480]">{isZh ? '跨文化阅读' : 'Cross-cultural reading'}</p>
                      <p className="mt-4 text-[1.5rem] font-serif leading-tight text-[#1d1916]">
                        {isZh
                          ? '同一份礼物，换一座城市，就会落入另一套生活经验、礼仪秩序与文化联想。'
                          : 'In another city, the same gift falls into another set of lived memory, etiquette, and cultural association.'}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}
