import { Canvas } from '@/components/experience/canvas'
import { Unboxing } from '@/components/experience/unboxing'
import { XRayDetail } from '@/components/experience/x-ray-detail'

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#1d1a17]">
      <section className="relative overflow-hidden border-b border-black/6 bg-[radial-gradient(circle_at_14%_18%,rgba(255,232,210,0.42),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(210,223,251,0.32),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,241,233,0.92))]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8 lg:px-12">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Brand lab</p>
          <h1 className="mt-4 max-w-[12ch] text-[4rem] font-serif leading-[0.94] tracking-[-0.07em] text-[#1d1a17] sm:text-[5rem]">
            Spatial studies for the editorial brand world.
          </h1>
          <p className="mt-6 max-w-[42rem] text-lg leading-9 text-[#69707d]">
            Experimental 3D and object narratives still sit inside the same light luxury system. Even the lab should feel authored, not detached.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-8 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-[2.8rem] border border-black/6 bg-[#0f1117] text-slate-50 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.42)]">
          <Canvas className="h-screen" />
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] space-y-8 px-6 pb-16 sm:px-8 lg:px-12">
        <div className="rounded-[2.2rem] border border-black/6 bg-white/76 p-6 shadow-[0_20px_48px_-34px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">Immersive components</p>
          <p className="mt-3 max-w-[44rem] text-base leading-8 text-[#69707d]">
            The lab remains experimental, but its framing, pacing, and surrounding whitespace are now aligned with the broader 礼智极意 / Givia editorial system.
          </p>
        </div>
        <XRayDetail />
        <Unboxing className="pb-4" />
      </section>
    </main>
  )
}
