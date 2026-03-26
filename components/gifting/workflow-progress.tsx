'use client'

import React from 'react'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'

interface WorkflowStep {
  id: number
  label: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'pending'
}

interface WorkflowProgressProps {
  steps: WorkflowStep[]
}

export function WorkflowProgress({ steps }: WorkflowProgressProps) {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    step.status === 'completed'
                      ? 'border border-[#e7d2af]/30 bg-[#e7d2af]/14 text-[#f7e7cc] shadow-[0_10px_30px_rgba(231,210,175,0.18)]'
                      : step.status === 'current'
                        ? 'border border-sky-200/24 bg-sky-200/12 text-slate-50 ring-1 ring-sky-100/18'
                        : 'border border-white/8 bg-white/[0.03] text-slate-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <p
                  className={`mt-2 text-center text-sm font-medium ${
                    step.status === 'completed'
                      ? 'text-[#f5e4c7]'
                      : step.status === 'current'
                        ? 'font-semibold text-slate-100'
                        : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-2 mt-6">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step.status === 'completed'
                        ? 'bg-[#e7d2af]/75'
                        : 'bg-white/10'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className={`flex items-center gap-2 rounded-[1.25rem] p-3 ${homeSurface.quiet}`}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex-1 h-2 rounded-full transition-all ${
                  step.status === 'completed'
                    ? 'bg-[#e7d2af]/75'
                    : step.status === 'current'
                      ? 'bg-sky-200/70'
                      : 'bg-white/10'
                }`}
              />
              {idx < steps.length - 1 && <div className="w-1" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map(step => (
            <p key={step.id} className="flex-1 text-center text-xs text-slate-400">
              <span className={step.status === 'current' ? 'text-slate-100' : step.status === 'completed' ? 'text-[#f5e4c7]' : ''}>
                {step.label}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
