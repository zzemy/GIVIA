export const homeSurface = {
  primary:
    'rounded-3xl border border-[#1f2d3d]/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,243,236,0.92))] shadow-[0_24px_78px_-32px_rgba(15,23,42,0.34)] backdrop-blur-3xl',
  secondary:
    'rounded-3xl border border-[#1f2d3d]/8 bg-[rgba(250,247,242,0.84)] shadow-[0_22px_58px_-34px_rgba(15,23,42,0.26)] backdrop-blur-2xl',
  quiet:
    'rounded-2xl border border-[#1f2d3d]/10 bg-[rgba(255,255,255,0.72)] shadow-[0_14px_34px_-30px_rgba(15,23,42,0.26)] backdrop-blur-xl',
  inset:
    'rounded-2xl border border-[#1f2d3d]/9 bg-[rgba(244,239,231,0.76)] shadow-[inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur-lg',
  glassStrip:
    'inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-[#4a5f97]/20 bg-[#4a5f97]/8 px-4 py-1 text-xs font-medium text-[#2b3950]',
} as const

export const homeAccent = {
  premiumLabel: 'text-[#38559f]',
  premiumBorder: 'border-[#38559f]/22',
  premiumBg: 'bg-[#38559f]/9',
  premiumGlow: 'shadow-[0_0_32px_rgba(56,85,159,0.18)]',
  intelligenceLabel: 'text-[#4a5f97]',
} as const

export const homeText = {
  title: 'text-[#1f2d3d] font-serif tracking-wide',
  body: 'text-[#344054] leading-relaxed',
  muted: 'text-[#667085]',
  meta: 'text-[#98a2b3]',
} as const

export const homeControl = {
  input:
    'w-full rounded-xl border border-[#1f2d3d]/15 bg-[rgba(255,255,255,0.86)] px-4 py-4 text-sm text-[#1f2d3d] placeholder:text-[#98a2b3] transition hover:border-[#4a5f97]/42 focus:border-[#4a5f97]/62 focus:outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(74,95,151,0.08)]',
  pill:
    'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#1f2d3d]/13 bg-white/74 px-6 py-2.5 text-sm text-[#475467] transition-all hover:border-[#4a5f97]/32 hover:bg-[#4a5f97]/10 hover:text-[#2b3950] cursor-pointer',
  badge:
    'inline-flex min-h-8 items-center whitespace-nowrap rounded-full border border-[#4a5f97]/24 bg-[#4a5f97]/9 px-3 py-1 text-[11px] tracking-widest text-[#38559f] uppercase',
} as const

export const homeButton = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-[#4664b3] to-[#374f96] px-8 py-4 text-sm font-medium text-white transition-all hover:scale-[1.02] shadow-[0_10px_30px_rgba(70,100,179,0.3)] hover:shadow-[0_14px_38px_rgba(55,79,150,0.38)]',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-[#4a5f97]/24 bg-white/72 px-8 py-4 text-sm font-medium text-[#334155] transition-all hover:bg-[#4a5f97]/10 hover:border-[#4a5f97]/40 shadow-[0_8px_24px_rgba(15,23,42,0.1)]',
  language:
    'rounded-full border border-[#1f2d3d]/14 bg-white/50 px-5 py-2.5 text-sm font-medium text-[#667085] transition-all hover:text-[#334155] hover:bg-white/80 hover:border-[#4a5f97]/24',
} as const

export const homeLayout = {
  section: 'mx-auto w-full max-w-[1280px]',
  featureGrid: 'grid gap-6 xl:gap-8 gap-y-12',
  readingMeasure: 'max-w-[68ch]',
} as const
