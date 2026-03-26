'use client'

import { ArrowLeft, Compass } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7f1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,232,210,0.38),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(210,223,251,0.32),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,241,233,0.92))]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[980px] items-center px-6 py-10 sm:px-8">
        <section className="w-full rounded-[2.8rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(248,242,234,0.78))] p-8 shadow-[0_42px_96px_-52px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:p-12">
          <div className="mx-auto max-w-[38rem] text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#5b72d1]/16 bg-[#eef2ff] text-[#5b72d1]">
              <Compass className="h-7 w-7" />
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Page not found</p>
            <h1 className="mt-4 text-[3.4rem] font-serif leading-[1.02] tracking-[-0.06em] text-[#1d1a17]">The route lost the editorial thread.</h1>
            <p className="mt-5 text-base leading-8 text-[#69707d]">
              This page does not exist, but the brand experience should still feel composed, calm, and intentional.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/zh')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171611] px-7 py-4 text-sm font-medium text-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-[#25231f]"
              >
                返回首页
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/72 px-7 py-4 text-sm font-medium text-[#495161] shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)] transition hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
