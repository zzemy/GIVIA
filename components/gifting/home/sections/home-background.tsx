import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(231,210,175,0.075),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(147,197,253,0.075),transparent_34%),radial-gradient(circle_at_48%_86%,rgba(99,102,241,0.035),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,24,0.22)_0%,rgba(4,12,24,0.06)_28%,rgba(4,12,24,0.2)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.105] [background-size:1320px_auto,980px_auto] [background-position:center_8%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.024] [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_112px),repeating-linear-gradient(0deg,rgba(148,163,184,0.055)_0_1px,transparent_1px_96px)]" />
    </>
  )
}
