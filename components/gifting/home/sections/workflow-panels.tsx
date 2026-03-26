'use client'

import React from 'react'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'
import { WorkflowProgress } from '@/components/gifting/workflow-progress'
import { StepGiftInput } from '@/components/gifting/home/sections/step-gift-input'
import { StepAnalysis } from '@/components/gifting/home/sections/step-analysis'
import { StepCountry } from '@/components/gifting/home/sections/step-country'
import {
  WorkflowSupportAssistantPanel,
  WorkflowSupportHistoryPanels,
} from '@/components/gifting/home/sections/workflow-support-panels'

interface WorkflowPanelsProps {
  workflowRef: React.RefObject<HTMLDivElement | null>
  workflowSteps: React.ComponentProps<typeof WorkflowProgress>['steps']
  giftInputProps: React.ComponentProps<typeof StepGiftInput>
  analysisProps: React.ComponentProps<typeof StepAnalysis>
  countryProps: React.ComponentProps<typeof StepCountry>
  assistantProps: React.ComponentProps<typeof WorkflowSupportAssistantPanel>
  historyProps: React.ComponentProps<typeof WorkflowSupportHistoryPanels>
}

export function WorkflowPanels({
  workflowRef,
  workflowSteps,
  giftInputProps,
  analysisProps,
  countryProps,
  assistantProps,
  historyProps,
}: WorkflowPanelsProps) {
  return (
    <>
      <div ref={workflowRef} className={`mb-7 rounded-[1.75rem] p-4 sm:p-5 ${homeSurface.quiet}`}>
        <WorkflowProgress steps={workflowSteps} />
      </div>

      <section className={`mb-10 rounded-[2rem] p-4 sm:p-5 lg:mb-12 xl:p-6 ${homeSurface.quiet}`}>
        <div className="mb-6 flex flex-col gap-2 sm:mb-7">
          <p className="text-xs uppercase tracking-[0.22em] text-[#e7d2af]/78">
            {giftInputProps.locale === 'zh' ? 'GUIDED WORKFLOW' : 'GUIDED WORKFLOW'}
          </p>
          <h2 className="text-2xl font-semibold text-slate-100">
            {giftInputProps.locale === 'zh' ? '按真实送礼顺序完成判断' : 'Follow the real gifting decision sequence'}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-300/72">
            {giftInputProps.locale === 'zh'
              ? '先整理礼物信息，再补齐国家与对象语境，最后把建议收敛成可直接执行的送礼方案。'
              : 'Start with the gift signal, add country and recipient context, then narrow the outcome into an actionable gifting recommendation.'}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-7 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start 2xl:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <StepGiftInput {...giftInputProps} />
            <StepAnalysis {...analysisProps} />
          </div>

          <div className="flex h-full flex-col gap-5 sm:gap-6">
            <StepCountry {...countryProps} />
            <div className="xl:ml-auto xl:max-w-[38rem] xl:pl-8 2xl:max-w-[40rem] 2xl:pl-10">
              <WorkflowSupportAssistantPanel {...assistantProps} />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8 lg:mb-10">
        <WorkflowSupportHistoryPanels {...historyProps} />
      </div>
    </>
  )
}
