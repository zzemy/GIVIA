import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(220,228,246,0.24),transparent_28%),radial-gradient(circle_at_84%_14%,rgba(230,234,244,0.18),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(228,219,210,0.12),transparent_34%),linear-gradient(180deg,rgba(250,248,244,0.98),rgba(245,241,235,0.99))]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.01] [background-size:1320px_auto] [background-position:center_16%] [background-repeat:no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.01] [background-image:repeating-linear-gradient(90deg,rgba(71,85,105,0.1)_0_1px,transparent_1px_168px),repeating-linear-gradient(0deg,rgba(71,85,105,0.06)_0_1px,transparent_1px_148px)]" />
    </>
  )
}
