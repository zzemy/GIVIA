'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { withBasePath } from '@/lib/asset-path'

export default function RootPage() {
  const router = useRouter()

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/zh')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbf7f1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,232,210,0.42),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(210,223,251,0.36),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,241,233,0.92))]" />
      <div
        className="absolute inset-0 opacity-[0.08] [background-position:center_center] [background-repeat:no-repeat] [background-size:min(980px,82vw)_auto]"
        style={{ backgroundImage: `url('${withBasePath('/brand/world-map.svg')}')` }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1240px] items-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <section className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#5d72cc]/14 bg-white/66 px-4 py-2 text-sm text-[#5d72cc] shadow-[0_14px_34px_-26px_rgba(93,114,204,0.45)] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#5d72cc]" />
              Editorial routing
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/80 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.18)]">
                <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA" fill priority className="object-contain p-3" />
              </div>
              <div>
                <p className="text-[2.4rem] font-serif font-semibold tracking-[-0.08em] text-[#1e1a16]">Givia</p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#98a2b3]">Light editorial high-end</p>
              </div>
            </div>

            <h1 className="mt-8 max-w-[10ch] text-[4.2rem] font-serif leading-[0.92] tracking-[-0.08em] text-[#1e1a16] sm:text-[5.2rem]">
              Enter the
              <span className="block text-[#5d72cc]">editorial flow.</span>
            </h1>

            <p className="mt-6 max-w-[34rem] text-lg font-light leading-9 text-[#69707d]">
              Choose your language and enter a brighter, more human route into the gifting experience. You will be redirected automatically in a moment.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/zh')}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#171611] px-8 py-4 text-base font-medium text-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-[#25231f]"
              >
                中文进入
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/en')}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-black/8 bg-white/72 px-8 py-4 text-base font-medium text-[#394150] shadow-[0_18px_36px_-28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Enter in English
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </section>

          <section className="relative min-h-[36rem]">
            <div className="absolute left-0 top-6 h-44 w-44 rounded-full bg-[#dfe7fe] blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#f4dfcf] blur-3xl" />

            <div className="relative grid h-full gap-4 rounded-[3rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(248,242,234,0.76))] p-5 shadow-[0_44px_96px_-52px_rgba(15,23,42,0.3)] backdrop-blur-2xl md:grid-cols-[0.88fr_1.12fr]">
              <div className="grid gap-4">
                <article className="relative overflow-hidden rounded-[2.1rem] border border-white/90 shadow-[0_24px_52px_-34px_rgba(15,23,42,0.24)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.12),rgba(24,22,18,0.44)),url(${withBasePath('/brand/gift-ceremony.svg')})` }}
                  />
                  <div className="relative flex h-full min-h-[15rem] flex-col justify-end p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">Chapter opening</p>
                    <p className="mt-2 text-[1.5rem] font-serif leading-tight text-white">A softer route into cross-cultural gifting.</p>
                  </div>
                </article>

                <article className="rounded-[2rem] border border-black/6 bg-white/68 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.16)]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">Redirect note</p>
                  <p className="mt-3 text-sm leading-8 text-[#69707d]">
                    No hard loading screen. No dark technical waiting page. The routing entry should already feel like part of the brand system.
                  </p>
                </article>
              </div>

              <article className="relative overflow-hidden rounded-[2.5rem] border border-white/90 shadow-[0_24px_56px_-34px_rgba(15,23,42,0.24)]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.08),rgba(20,19,16,0.46)),url(${withBasePath('/brand/hero-global-gift.svg')})` }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28),transparent_26%)] mix-blend-screen" />
                <div className="relative flex h-full min-h-[36rem] flex-col justify-between p-6">
                  <div className="inline-flex w-fit items-center rounded-full border border-white/28 bg-white/14 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/84 backdrop-blur-md">
                    Brand-led transition
                  </div>
                  <div className="rounded-[2rem] border border-white/24 bg-white/14 p-5 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">Preview</p>
                    <p className="mt-3 text-[1.8rem] font-serif leading-tight text-white">
                      From route guidance to result brief, the experience should feel authored—not assembled.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
