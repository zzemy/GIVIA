export const homeSurface = {
  primary:
    'rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,28,49,0.96),rgba(10,20,37,0.98))] shadow-[0_34px_100px_rgba(2,8,21,0.52)] backdrop-blur-xl',
  secondary:
    'rounded-[1.75rem] border border-white/9 bg-[linear-gradient(180deg,rgba(13,25,43,0.94),rgba(10,19,34,0.96))] shadow-[0_22px_64px_rgba(2,8,21,0.34)] backdrop-blur-xl',
  quiet: 'rounded-[1.25rem] border border-white/8 bg-[rgba(255,255,255,0.03)] backdrop-blur-md',
  inset: 'rounded-[1.1rem] border border-white/9 bg-[rgba(8,19,34,0.82)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-md',
  glassStrip:
    'inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1 text-xs font-medium backdrop-blur',
} as const

export const homeAccent = {
  premiumLabel: 'text-[#e7d2af]',
  premiumBorder: 'border-[#e7d2af]/22',
  premiumBg: 'bg-[#e7d2af]/9',
  premiumGlow: 'shadow-[0_12px_30px_rgba(231,210,175,0.12)]',
  intelligenceLabel: 'text-sky-100/76',
} as const

export const homeText = {
  title: 'text-slate-50',
  body: 'text-slate-200/85',
  muted: 'text-slate-300/70',
  meta: 'text-slate-300/56',
} as const

export const homeControl = {
  input:
    'w-full rounded-xl border border-white/10 bg-[#091629] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-[#e7d2af]/32 focus:outline-none focus:ring-2 focus:ring-[#e7d2af]/10',
  pill:
    'inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-slate-200',
  badge:
    'inline-flex min-h-8 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] tracking-[0.14em] text-slate-200',
} as const

export const homeButton = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-[#e7d2af]/30 bg-[#e7d2af]/11 px-5 py-3 text-sm font-semibold text-[#f9ead2] transition hover:bg-[#e7d2af]/16',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.024] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.045]',
  language:
    'rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.05]',
} as const

export const homeLayout = {
  section: 'mx-auto w-full max-w-[1520px]',
  featureGrid: 'grid gap-5 xl:gap-6 2xl:gap-8',
  readingMeasure: 'max-w-[42rem] 2xl:max-w-[46rem]',
} as const
