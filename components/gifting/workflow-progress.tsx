'use client'

import React from 'react'

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
        <div className="rounded-[1.6rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,244,238,0.92))] px-4 py-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.18)]">
          <div className="flex items-center gap-3">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                      step.status === 'completed'
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-600'
                        : step.status === 'current'
                          ? 'border border-[#4a5f97]/20 bg-[#eef2ff] text-[#4a5f97]'
                          : 'border border-black/6 bg-white/70 text-[#98a2b3]'
                    }`}
                  >
                    {step.status === 'completed' ? '✓' : step.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#98a2b3]">0{step.id}</p>
                    <p
                      className={`truncate text-sm ${
                        step.status === 'completed'
                          ? 'text-[#18794e]'
                          : step.status === 'current'
                            ? 'font-medium text-[#1f2937]'
                            : 'text-[#98a2b3]'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1">
                    <div className={`h-px rounded-full ${step.status === 'completed' ? 'bg-emerald-200' : 'bg-black/8'}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="rounded-[1.3rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,238,0.94))] p-3 shadow-[0_16px_30px_-26px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    step.status === 'completed'
                      ? 'bg-emerald-300'
                      : step.status === 'current'
                        ? 'bg-[#8da2e2]'
                        : 'bg-black/8'
                  }`}
                />
                {idx < steps.length - 1 && <div className="w-1" />}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-3 flex justify-between gap-2">
            {steps.map(step => (
              <div key={step.id} className="min-w-0 flex-1 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#98a2b3]">0{step.id}</p>
                <p
                  className={`truncate text-xs ${
                    step.status === 'current' ? 'text-[#1f2937]' : step.status === 'completed' ? 'text-[#18794e]' : 'text-[#98a2b3]'
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
