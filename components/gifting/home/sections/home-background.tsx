import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(217,226,248,0.32),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(248,228,214,0.24),transparent_24%),linear-gradient(180deg,rgba(252,250,246,0.96),rgba(248,244,237,0.98))]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] [background-size:1320px_auto] [background-position:center_16%] [background-repeat:no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018] [background-image:repeating-linear-gradient(90deg,rgba(71,85,105,0.12)_0_1px,transparent_1px_168px),repeating-linear-gradient(0deg,rgba(71,85,105,0.08)_0_1px,transparent_1px_148px)]" />
    </>
  )
}
