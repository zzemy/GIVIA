export const homeSurface = {
  primary:
    'rounded-[2rem] border border-white/9 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),rgba(231,210,175,0.05)_38%,rgba(147,197,253,0.045)_100%)] shadow-[0_30px_82px_rgba(4,10,24,0.42)] backdrop-blur-xl',
  secondary:
    'rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] shadow-[0_20px_56px_rgba(4,10,24,0.28)] backdrop-blur-xl',
  quiet: 'rounded-[1.25rem] border border-white/6 bg-white/[0.03] backdrop-blur-md',
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
