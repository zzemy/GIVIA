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
        <div className={`rounded-[1.4rem] px-3 py-3 ${homeSurface.quiet}`}>
          <div className="flex items-start justify-between gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    step.status === 'completed'
                      ? 'border border-[#e7d2af]/28 bg-[#e7d2af]/12 text-[#f7e7cc]'
                      : step.status === 'current'
                        ? 'border border-sky-200/20 bg-sky-200/10 text-slate-50 ring-1 ring-sky-100/14'
                        : 'border border-white/8 bg-white/[0.02] text-slate-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <p
                  className={`mt-2 text-center text-sm ${
                    step.status === 'completed'
                      ? 'text-[#f5e4c7]'
                      : step.status === 'current'
                        ? 'font-medium text-slate-100'
                        : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="mx-2 mt-5 flex-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step.status === 'completed'
                        ? 'bg-[#e7d2af]/68'
                        : 'bg-white/8'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
          </div>
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
                    ? 'bg-[#e7d2af]/68'
                    : step.status === 'current'
                      ? 'bg-sky-200/64'
                      : 'bg-white/8'
                }`}
              />
              {idx < steps.length - 1 && <div className="w-1" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-2 flex justify-between">
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
