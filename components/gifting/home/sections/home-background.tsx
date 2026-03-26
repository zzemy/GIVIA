import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(255,234,211,0.36),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(201,219,248,0.3),transparent_32%),radial-gradient(circle_at_52%_88%,rgba(216,232,223,0.28),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.58)_0%,rgba(248,244,238,0.34)_38%,rgba(244,239,233,0.72)_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055] [background-size:1280px_auto,1120px_auto] [background-position:center_11%,center_95%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[-6%] h-[58%] opacity-[0.16] [background-position:center_bottom] [background-repeat:no-repeat] [background-size:min(1180px,92vw)_auto]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/ambient-ribbon.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:repeating-linear-gradient(90deg,rgba(71,85,105,0.12)_0_1px,transparent_1px_148px),repeating-linear-gradient(0deg,rgba(71,85,105,0.08)_0_1px,transparent_1px_128px)]" />
    </>
  )
}
