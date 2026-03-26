'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { withBasePath } from '@/lib/asset-path'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

export default function RootPage() {
  const router = useRouter()
  const heroPhotos = {
    gift: 'https://unsplash.com/photos/IsOQu4nML-Y/download?force=true&w=1600',
    hands: 'https://unsplash.com/photos/EVeqqKNCzRo/download?force=true&w=1200',
    market: 'https://unsplash.com/photos/74bXIcqEa20/download?force=true&w=1200',
  }

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/zh')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf6ef]">
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-[1.3rem] border border-white/90 bg-white/82 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.14)]">
              <Image src={withBasePath('/brand/logo-mark.svg')} alt="GIVIA" fill priority className="object-contain p-3" />
            </div>
            <div>
              <p className="text-[2.1rem] font-serif font-semibold tracking-[-0.08em] text-[#1e1a16]">Givia</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#98a2b3]">Light editorial high-end</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/zh')}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#171611] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_36px_-26px_rgba(0,0,0,0.36)] transition hover:-translate-y-0.5 hover:bg-[#25231f]"
            >
              中文进入
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push('/en')}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-black/8 bg-white/78 px-6 py-3 text-sm font-medium text-[#394150] shadow-[0_16px_32px_-28px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Enter in English
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="grid flex-1 w-full items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <section className="flex max-w-[34rem] flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9dded] bg-white/82 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#6c78ab] shadow-[0_14px_34px_-26px_rgba(15,23,42,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6c78ab]" />
              A quiet beginning
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

            <h1 className="mt-8 max-w-[10ch] text-[4.1rem] font-serif leading-[0.9] tracking-[-0.08em] text-[#1d1915] sm:text-[5.1rem] xl:text-[6.2rem]">
              Before a gesture
              <span className="block text-[#5f73d7]">crosses a border,</span>
              it is already being read.
            </h1>

            <p className="mt-8 max-w-[31rem] text-lg font-light leading-9 text-[#676d79]">
              Some gifts arrive as warmth. Some arrive as misunderstanding. Choose a language and step into a calmer way of judging what a gift may mean before it lands.
            </p>

            <p className="mt-6 text-sm leading-7 text-[#8b909b]">
              Chinese and English editorial entry
            </p>
          </section>

          <section className="relative">
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
                      Private editorial entry
                    </div>

                    <div className="max-w-[24rem]">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/76">Read before sending</p>
                      <p className="mt-4 text-[2rem] font-serif leading-[1.06] tracking-[-0.04em] text-white sm:text-[2.5rem]">
                        The same gift can feel thoughtful in one place and inappropriate in another.
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
                      <p className="max-w-[10rem] text-[1.3rem] font-serif leading-tight text-white">
                        Relationship changes the meaning of the object.
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
                        Another city, another set of cultural associations.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
