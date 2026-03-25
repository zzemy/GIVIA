import { withBasePath } from '@/lib/asset-path'

export function HomeBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_84%_22%,rgba(45,212,191,0.12),transparent_34%),radial-gradient(circle_at_50%_84%,rgba(14,165,233,0.08),transparent_44%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-size:1320px_auto,980px_auto] [background-position:center_6%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-12 [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.11)_0_1px,transparent_1px_58px),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_52px)]" />
    </>
  )
}
