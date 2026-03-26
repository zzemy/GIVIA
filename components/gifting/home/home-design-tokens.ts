export const homeSurface = {
  primary:
    'rounded-[2rem] border border-white/9 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(231,210,175,0.06)_38%,rgba(147,197,253,0.04)_100%)] shadow-[0_34px_90px_rgba(4,10,24,0.44)] backdrop-blur-xl',
  secondary:
    'rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.038),rgba(255,255,255,0.016))] shadow-[0_22px_60px_rgba(4,10,24,0.3)] backdrop-blur-xl',
  quiet: 'rounded-[1.25rem] border border-white/7 bg-white/[0.032] backdrop-blur-md',
  inset: 'rounded-[1.1rem] border border-white/8 bg-[#0b1b2f]/68 backdrop-blur-md',
  glassStrip: 'rounded-full border border-white/10 bg-white/[0.035] backdrop-blur',
} as const

export const homeAccent = {
  premiumLabel: 'text-[#e7d2af]',
  premiumBorder: 'border-[#e7d2af]/20',
  premiumBg: 'bg-[#e7d2af]/10',
  premiumGlow: 'shadow-[0_10px_32px_rgba(231,210,175,0.16)]',
  intelligenceLabel: 'text-sky-100/82',
} as const

export const homeText = {
  title: 'text-slate-50',
  body: 'text-slate-200/88',
  muted: 'text-slate-300/72',
  meta: 'text-slate-300/58',
} as const

export const homeControl = {
  input:
    'w-full rounded-xl border border-cyan-200/18 bg-[#0b1c31] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-cyan-200/45 focus:outline-none',
  pill:
    'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200',
} as const

export const homeButton = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-[#e7d2af]/35 bg-[#e7d2af]/12 px-5 py-3 text-sm font-semibold text-[#f9ead2] transition hover:bg-[#e7d2af]/18',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]',
  language:
    'rounded-full px-3 py-1 text-sm font-medium transition-all border border-white/8 bg-white/[0.02] text-slate-300 hover:bg-white/[0.055]',
} as const
