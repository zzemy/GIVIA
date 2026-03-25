import type { ModelMessage } from '@/lib/ai/adapters/types'

export type PromptLanguage = 'zh' | 'en' | undefined

export interface PromptAudienceContext {
  group: string
  customGroup: string
  sceneTemplate: string
  ageBand: string
  gender: string
  occupation: string
  relationship: string
  occasion: string
  purpose: string
  budgetRange: string
  formality: string
  notes: string
}

export interface PromptGiftContext {
  name: string
  description: string
  visionLabel: string
  visionDescription: string
  source: string
  rawLabels: string[]
}

export interface PromptSections {
  roleMission: string[]
  safetyRules: string[]
  domainContext: string[]
  outputContract: string[]
}

export function renderPromptSections(sections: PromptSections): string {
  return [
    '## Role / Mission',
    ...sections.roleMission,
    '',
    '## Safety Rules',
    ...sections.safetyRules,
    '',
    '## Domain Context',
    ...sections.domainContext,
    '',
    '## Output Contract',
    ...sections.outputContract,
  ].join('\n')
}

export function stringifyPromptSections(sections: PromptSections): string {
  return renderPromptSections(sections)
}

export function stringifyPromptPayload(payload: unknown): string {
  return JSON.stringify(payload, null, 2)
}

export function buildPromptMessages(args: {
  sections: PromptSections
  userPayload: unknown
}): ModelMessage[] {
  return [
    { role: 'system', content: renderPromptSections(args.sections) },
    { role: 'user', content: stringifyPromptPayload(args.userPayload) },
  ]
}
