import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(231,210,175,0.09),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(147,197,253,0.10),transparent_32%),radial-gradient(circle_at_50%_84%,rgba(99,102,241,0.05),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,24,0.15)_0%,rgba(4,12,24,0.02)_24%,rgba(4,12,24,0.16)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-size:1320px_auto,980px_auto] [background-position:center_6%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.11)_0_1px,transparent_1px_96px),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_84px)]" />
    </>
  )
}
