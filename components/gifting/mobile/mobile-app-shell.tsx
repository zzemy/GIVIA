'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MobileAppShellProps {
  locale: 'zh' | 'en'
  children: ReactNode
}

export function MobileAppShell({ locale, children }: MobileAppShellProps) {
  const pathname = usePathname()

  const homeHref = `/${locale}`
  const giftingHref = `/${locale}/gifting`

  const navItems = [
    {
      href: homeHref,
      label: locale === 'zh' ? '首页' : 'Home',
      active: pathname === homeHref,
    },
    {
      href: giftingHref,
      label: locale === 'zh' ? '流程' : 'Journey',
      active: pathname === giftingHref,
    },
  ]

  return (
    <div className="min-h-dvh bg-[#f6f1ea] text-[#181614]">
      <div className="relative min-h-dvh">{children}</div>

      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="mx-auto flex max-w-[30rem] items-center px-4 pb-[calc(0.9rem+env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto relative flex w-full items-stretch gap-2 rounded-[1.8rem] border border-black/8 bg-white/92 px-2 py-2 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.36)] backdrop-blur-2xl">
            {navItems[0] ? (
              <Link
                href={navItems[0].href}
                className={cn(
                  'flex flex-1 items-center justify-center rounded-[1.25rem] px-3 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition',
                  navItems[0].active ? 'bg-[#1c1a17] text-white shadow-[0_10px_24px_-16px_rgba(28,26,23,0.75)]' : 'text-[#707784]',
                )}
              >
                {navItems[0].label}
              </Link>
            ) : null}

            <Link
              href={giftingHref}
              className="flex min-w-[6.8rem] flex-[1.1] items-center justify-center rounded-[1.25rem] border border-[#5569ba]/15 bg-[linear-gradient(180deg,#5a6fd0,#4457aa)] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white shadow-[0_16px_28px_-20px_rgba(68,87,170,0.72)] transition active:scale-[0.98]"
            >
              {locale === 'zh' ? '开始' : 'Start'}
            </Link>

            {navItems[1] ? (
              <Link
                href={navItems[1].href}
                className={cn(
                  'flex flex-1 items-center justify-center rounded-[1.25rem] px-3 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition',
                  navItems[1].active ? 'bg-[#1c1a17] text-white shadow-[0_10px_24px_-16px_rgba(28,26,23,0.75)]' : 'text-[#707784]',
                )}
              >
                {navItems[1].label}
              </Link>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  )
}
