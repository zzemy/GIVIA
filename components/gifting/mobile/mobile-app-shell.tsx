'use client'

import type { ReactNode } from 'react'

interface MobileAppShellProps {
  children: ReactNode
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="min-h-dvh bg-[#f5f0e8] text-[#181614]">
      <div className="relative min-h-dvh">{children}</div>
    </div>
  )
}
