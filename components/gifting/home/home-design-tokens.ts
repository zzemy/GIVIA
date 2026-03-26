export const homeSurface = {
  primary:
    'rounded-[2rem] border border-black/7 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(248,243,236,0.92))] shadow-[0_28px_74px_-42px_rgba(15,23,42,0.24)] backdrop-blur-3xl',
  secondary:
    'rounded-[1.85rem] border border-black/7 bg-[rgba(251,247,242,0.84)] shadow-[0_22px_58px_-36px_rgba(15,23,42,0.22)] backdrop-blur-2xl',
  quiet:
    'rounded-[1.45rem] border border-black/7 bg-[rgba(255,255,255,0.72)] shadow-[0_16px_34px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl',
  inset:
    'rounded-[1.45rem] border border-black/7 bg-[rgba(244,239,231,0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-lg',
  glassStrip:
    'inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-[#5b72d1]/16 bg-[#eef2ff] px-4 py-1 text-xs font-medium text-[#4d62b4]',
} as const

export const homeAccent = {
  premiumLabel: 'text-[#4d62b4]',
  premiumBorder: 'border-[#4d62b4]/18',
  premiumBg: 'bg-[#eef2ff]',
  premiumGlow: 'shadow-[0_0_28px_rgba(91,114,209,0.12)]',
  intelligenceLabel: 'text-[#5b72d1]',
} as const

export const homeText = {
  title: 'text-[#1d1a17] font-serif tracking-wide',
  body: 'text-[#495161] leading-relaxed',
  muted: 'text-[#69707d]',
  meta: 'text-[#98a2b3]',
} as const

export const homeControl = {
  input:
    'w-full rounded-[1.35rem] border border-black/8 bg-[rgba(255,255,255,0.84)] px-4 py-4 text-sm text-[#1d1a17] placeholder:text-[#98a2b3] transition hover:border-[#5b72d1]/24 focus:border-[#5b72d1]/45 focus:outline-none focus:bg-white focus:shadow-[0_0_0_4px_rgba(91,114,209,0.08)]',
  pill:
    'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black/8 bg-white/74 px-6 py-2.5 text-sm text-[#495161] transition-all hover:border-[#5b72d1]/24 hover:bg-[#eef2ff] hover:text-[#4d62b4] cursor-pointer',
  badge:
    'inline-flex min-h-8 items-center whitespace-nowrap rounded-full border border-[#5b72d1]/16 bg-[#eef2ff] px-3 py-1 text-[11px] tracking-widest text-[#4d62b4] uppercase',
} as const

export const homeButton = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-[#5b72d1] to-[#4355a9] px-8 py-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 shadow-[0_18px_40px_-24px_rgba(91,114,209,0.42)] hover:shadow-[0_22px_46px_-22px_rgba(67,85,169,0.46)]',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/72 px-8 py-4 text-sm font-medium text-[#495161] transition-all hover:bg-white hover:border-[#5b72d1]/22 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)]',
  language:
    'rounded-full border border-black/8 bg-white/56 px-5 py-2.5 text-sm font-medium text-[#69707d] transition-all hover:text-[#495161] hover:bg-white/84 hover:border-[#5b72d1]/18',
} as const

export const homeLayout = {
  section: 'mx-auto w-full max-w-[1280px]',
  featureGrid: 'grid gap-6 xl:gap-8 gap-y-12',
  readingMeasure: 'max-w-[68ch]',
} as const
