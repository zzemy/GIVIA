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
      <div className="hidden md:block">
        <div className={`rounded-[1.35rem] px-3 py-3 ${homeSurface.inset}`}>
          <div className="flex items-center gap-3">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                      step.status === 'completed'
                        ? 'border border-[#e7d2af]/30 bg-[#e7d2af]/11 text-[#f7e7cc]'
                        : step.status === 'current'
                          ? 'border border-white/12 bg-white/[0.06] text-slate-50'
                          : 'border border-white/8 bg-white/[0.025] text-slate-400'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">0{step.id}</p>
                    <p
                      className={`truncate text-sm ${
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
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1">
                    <div className={`h-px rounded-full ${step.status === 'completed' ? 'bg-[#e7d2af]/58' : 'bg-white/8'}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className={`rounded-[1.2rem] p-3 ${homeSurface.inset}`}>
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step.status === 'completed'
                      ? 'bg-[#e7d2af]/62'
                      : step.status === 'current'
                        ? 'bg-slate-200/78'
                        : 'bg-white/8'
                  }`}
                />
                {idx < steps.length - 1 && <div className="w-1" />}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-3 flex justify-between gap-2">
            {steps.map(step => (
              <div key={step.id} className="min-w-0 flex-1 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">0{step.id}</p>
                <p
                  className={`truncate text-xs ${
                    step.status === 'current' ? 'text-slate-100' : step.status === 'completed' ? 'text-[#f5e4c7]' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
