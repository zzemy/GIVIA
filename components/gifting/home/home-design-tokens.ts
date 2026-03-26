export const homeSurface = {
  primary:
    'rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(231,210,175,0.04)_38%,rgba(147,197,253,0.05)_100%)] shadow-[0_32px_90px_rgba(4,10,24,0.48)] backdrop-blur-xl',
  secondary:
    'rounded-[1.75rem] border border-white/9 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] shadow-[0_24px_70px_rgba(4,10,24,0.36)] backdrop-blur-xl',
  quiet: 'rounded-[1.25rem] border border-white/7 bg-white/[0.035] backdrop-blur-md',
} as const

export const homeAccent = {
  premiumLabel: 'text-[#e7d2af]',
  premiumBorder: 'border-[#e7d2af]/20',
  premiumBg: 'bg-[#e7d2af]/10',
  intelligenceLabel: 'text-sky-100/82',
} as const

export const homeText = {
  title: 'text-slate-50',
  body: 'text-slate-200/88',
  muted: 'text-slate-300/72',
  meta: 'text-slate-300/58',
} as const
