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
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.status === 'completed'
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                      : step.status === 'current'
                        ? 'bg-cyan-400 text-gray-900 shadow-lg shadow-cyan-400/50 ring-2 ring-cyan-300'
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <p
                  className={`mt-2 text-sm font-medium text-center ${
                    step.status === 'current' ? 'text-cyan-300 font-semibold' : 'text-gray-400'
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
                        ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                        : 'bg-gray-700'
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
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex-1 h-2 rounded-full transition-all ${
                  step.status === 'completed'
                    ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                    : step.status === 'current'
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'bg-gray-700'
                }`}
              />
              {idx < steps.length - 1 && <div className="w-1" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map(step => (
            <p key={step.id} className="text-xs text-center text-gray-400 flex-1">
              <span className={step.status === 'current' ? 'text-cyan-300' : ''}>
                {step.label}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
