'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  React.useEffect(() => {
    router.push('/zh')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-cyan-300/30 animate-ping" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900/70 ring-1 ring-cyan-200/30">
            <Image src="/brand/logo-mark.svg" alt="GIVIA" width={34} height={34} priority />
          </div>
        </div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  )
}
