'use client'

import React from 'react'
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
      <div ref={workflowRef} className="mb-12 rounded-2xl">
        <WorkflowProgress steps={workflowSteps} />
      </div>

      <div className="mb-8 grid gap-4 sm:gap-6 lg:mb-10 xl:grid-cols-12 xl:items-start 2xl:gap-7">
        <div className="space-y-4 sm:space-y-6 xl:col-span-4 2xl:col-span-5">
          <StepGiftInput {...giftInputProps} />
          <StepAnalysis {...analysisProps} />
        </div>

        <div className="flex h-full flex-col gap-4 sm:gap-6 xl:col-span-8 2xl:col-span-7">
          <StepCountry {...countryProps} />
          <WorkflowSupportAssistantPanel {...assistantProps} />
        </div>
      </div>

      <div className="mb-8 lg:mb-10">
        <WorkflowSupportHistoryPanels {...historyProps} />
      </div>
    </>
  )
}
