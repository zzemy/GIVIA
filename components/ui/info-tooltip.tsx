'use client'

import React, { useState } from 'react'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  content: string
  children?: React.ReactNode
  className?: string
}

export function InfoTooltip({ content, children, className }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {children}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100/30 text-cyan-300 hover:bg-cyan-100/50 transition-colors"
      >
        <Info size={14} />
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-50 border border-cyan-500/30">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
}
