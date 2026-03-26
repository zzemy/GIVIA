import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(231,210,175,0.08),transparent_26%),radial-gradient(circle_at_82%_9%,rgba(125,211,252,0.06),transparent_28%),radial-gradient(circle_at_50%_88%,rgba(148,163,184,0.04),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,21,0.1)_0%,rgba(3,10,21,0)_34%,rgba(3,10,21,0.16)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-size:1240px_auto,920px_auto] [background-position:center_8%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.06)_0_1px,transparent_1px_132px),repeating-linear-gradient(0deg,rgba(148,163,184,0.04)_0_1px,transparent_1px_108px)]" />
    </>
  )
}
