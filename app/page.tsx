'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function RootPage() {
  const router = useRouter()

  const heroPhotos = {
    lead: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1800&q=80',
    relation: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    city: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  }

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/zh')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [router])

  return (
    <div className="relative h-screen overflow-hidden bg-[#f7f4ef] text-[#1b1917]">
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <main className="relative z-10 mx-auto flex h-screen max-w-[1540px] flex-col overflow-hidden px-6 pb-8 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-none">
              <span className="text-[0.75rem] font-medium tracking-[0.22em] text-[#8a90a0]">礼智极意</span>
              <span className="mt-1 text-[2.35rem] font-serif tracking-[-0.08em] text-[#211d18]">Givia</span>
            </div>
            <div className="h-10 w-px bg-black/8" />
            <p className="max-w-[10rem] text-[10px] uppercase tracking-[0.22em] text-[#8a90a0]">Cross-cultural gifting editorial</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/6 bg-white/64 p-1.5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => router.push('/zh')}
              className="rounded-full bg-[#181614] px-5 py-2.5 text-sm text-white transition hover:bg-[#25211e]"
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => router.push('/en')}
              className="rounded-full px-4 py-2.5 text-sm text-[#5f6672] transition hover:text-[#1b2230]"
            >
              English
            </button>
          </div>
        </header>

        <section className="grid h-full flex-1 items-center gap-10 overflow-hidden lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
          <div className="flex max-w-[34rem] flex-col justify-center pb-6 lg:pb-0">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6c78ab]">Editorial preface</p>
            <h1 className="mt-6 text-[4.1rem] font-serif leading-[0.88] tracking-[-0.09em] text-[#1e1a17] sm:text-[5.1rem] xl:text-[6.3rem]">
              Before a gesture
              <span className="block text-[#6678c8]">crosses a border</span>
              it enters another life
            </h1>
            <p className="mt-8 max-w-[32rem] text-[1.04rem] leading-9 text-[#666d79]">
              Givia helps you read how a gesture may be felt, interpreted, and remembered elsewhere — before it leaves your hands, crosses a border, and enters another social world.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <button
                type="button"
                onClick={() => router.push('/zh')}
                className="inline-flex items-center gap-3 rounded-full bg-[#6678c8] px-7 py-4 text-sm uppercase tracking-[0.12em] text-white shadow-[0_24px_44px_-26px_rgba(102,120,200,0.44)] transition hover:-translate-y-0.5 hover:bg-[#5c6eba]"
              >
                Enter the house
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="max-w-[13rem] text-sm leading-7 text-[#8b9099]">Chinese and English editions live inside the same editorial brand world.</p>
            </div>
          </div>

          <div className="relative h-full min-h-0">
            <div className="grid h-full max-h-[780px] min-h-0 gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
              <article className="group relative min-h-0 overflow-hidden rounded-[3.2rem] shadow-[0_40px_90px_-48px_rgba(15,23,42,0.28)]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${heroPhotos.lead})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(20,18,17,0.48))]" />
                <div className="relative flex h-full min-h-[30rem] flex-col justify-between p-8 sm:p-10 xl:p-12">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/72">Gesture / Culture / Memory</p>
                  <div className="max-w-[26rem]">
                    <p className="text-[2.45rem] font-serif leading-[1.02] tracking-[-0.05em] text-white sm:text-[3rem]">
                      The same object can feel intimate, ceremonial, excessive, or misplaced — depending on where, and to whom, it arrives.
                    </p>
                  </div>
                </div>
              </article>

              <div className="grid min-h-0 grid-rows-[0.95fr_1.05fr] gap-5">
                <article className="group relative overflow-hidden rounded-[2.35rem] shadow-[0_28px_60px_-34px_rgba(15,23,42,0.22)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${heroPhotos.relation})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(22,20,18,0.42))]" />
                  <div className="relative flex h-full min-h-[16rem] items-end p-6">
                    <p className="max-w-[12rem] text-[1.18rem] font-serif leading-tight text-white">A gesture is first received through relationship, tone, and timing.</p>
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-[2.35rem] bg-[rgba(255,255,255,0.52)] p-5 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                  <div className="grid h-full gap-5 sm:grid-cols-[0.94fr_1.06fr]">
                    <div className="relative overflow-hidden rounded-[1.9rem]">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]"
                        style={{ backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.06),rgba(24,22,21,0.36)),url(${heroPhotos.city})` }}
                      />
                    </div>
                    <div className="flex flex-col justify-between rounded-[1.9rem] bg-[rgba(255,255,255,0.62)] p-6">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#6f7480]">Cross-cultural reading</p>
                      <p className="mt-4 text-[1.5rem] font-serif leading-tight text-[#1d1916]">
                        A quieter reading of atmosphere, etiquette, and the form your intention may take abroad.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
