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
      <div ref={workflowRef} className={`rounded-[1.75rem] p-3.5 sm:p-4 ${homeSurface.quiet}`}>
        <WorkflowProgress steps={workflowSteps} />
      </div>

      <section className={`rounded-[2rem] p-4 sm:p-5 xl:p-6 ${homeSurface.secondary}`}>
        <div className="mb-6 flex flex-col gap-2.5 sm:mb-7">
          <p className="text-xs uppercase tracking-[0.22em] text-[#e7d2af]/78">
            {giftInputProps.locale === 'zh' ? '引导式流程' : 'GUIDED WORKFLOW'}
          </p>
          <h2 className="home-balance text-2xl font-semibold text-slate-100 sm:text-[2rem]">
            {giftInputProps.locale === 'zh' ? '按真实送礼顺序完成判断' : 'Follow the real gifting decision sequence'}
          </h2>
          <p className="home-pretty max-w-3xl text-sm leading-7 text-slate-300/72">
            {giftInputProps.locale === 'zh'
              ? '先整理礼物信息，再补齐国家与对象语境，最后把建议收敛成可直接执行的送礼方案。'
              : 'Start with the gift signal, add country and recipient context, then narrow the outcome into an actionable gifting recommendation.'}
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_minmax(18rem,0.86fr)] xl:items-start 2xl:gap-7">
          <div className="flex flex-col gap-5 sm:gap-6">
            <StepGiftInput {...giftInputProps} />
            <StepCountry {...countryProps} />
            <StepAnalysis {...analysisProps} />
          </div>

          <div className="xl:sticky xl:top-24">
            <WorkflowSupportAssistantPanel {...assistantProps} />
          </div>
        </div>
      </section>

      <div className="mb-2">
        <WorkflowSupportHistoryPanels {...historyProps} />
      </div>
    </>
  )
}
