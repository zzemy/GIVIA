'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type InteractiveFlowDemoProps = {
  locale: 'zh' | 'en'
}

type DemoStep = {
  id: number
  title: string
  summary: string
  payload: string[]
}

export function InteractiveFlowDemo({ locale }: InteractiveFlowDemoProps) {
  const isZh = locale === 'zh'
  const steps = useMemo<DemoStep[]>(
    () =>
      isZh
        ? [
            {
              id: 1,
              title: '礼物信息输入',
              summary: '先填礼物名称与描述，图片识别会自动补充细节。',
              payload: ['礼物名称：钢笔', '礼物描述：商务拜访送礼', '识别描述：金属笔身，商务风格'],
            },
            {
              id: 2,
              title: '国家与对象画像',
              summary: '选择国家与收礼人画像，让建议更贴近真实场景。',
              payload: ['目标国家：中国', '目标群体：同学/同事', '群体补充：正式场合'],
            },
            {
              id: 3,
              title: 'AI 文化分析',
              summary: '综合全部信息生成风险等级、包装与贺卡建议。',
              payload: ['风险等级：中等', '包装建议：青绿、银灰', '贺卡语气：真诚专业'],
            },
          ]
        : [
            {
              id: 1,
              title: 'Gift Input',
              summary: 'Provide gift name and notes, then image recognition adds details.',
              payload: ['giftName: Fountain Pen', 'giftDescription: Business visit', 'visionDescription: Metallic finish, formal style'],
            },
            {
              id: 2,
              title: 'Country and Audience',
              summary: 'Choose country and recipient profile for context-aware guidance.',
              payload: ['country: China', 'audience.group: peer', 'audience.profile: colleague, formal occasion'],
            },
            {
              id: 3,
              title: 'AI Cultural Analysis',
              summary: 'Generate risk level, packaging direction, and card copy in one pass.',
              payload: ['riskLevel: Medium', 'packaging.colors: teal, silver', 'card.tone: sincere and professional'],
            },
          ],
    [isZh],
  )

  const [activeStep, setActiveStep] = useState<number>(1)
  const current = steps.find(step => step.id === activeStep) ?? steps[0]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep(prev => (prev % steps.length) + 1)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [steps.length])

  return (
    <div className="relative mt-5 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(11,24,41,0.88),rgba(8,18,32,0.9))] p-4 shadow-[0_18px_48px_rgba(4,10,24,0.32)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/82">
        {isZh ? '可交互流程演示（点击切换）' : 'Interactive flow demo (click to switch)'}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {steps.map(step => {
          const isActive = step.id === activeStep
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors duration-200 ${
                isActive
                  ? 'border-[#e7d2af]/40 bg-[#e7d2af]/12 text-[#f7e8cd]'
                  : 'border-white/10 bg-[#0d1a2e]/78 text-slate-300 hover:border-white/20 hover:bg-[#12243b]'
              }`}
            >
              <p className="font-semibold">{isZh ? `步骤 ${step.id}` : `Step ${step.id}`}</p>
              <p className="mt-1 text-[11px] leading-5 opacity-90">{step.title}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-3 h-1 rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#e7d2af] to-sky-200"
          animate={{ width: `${(activeStep / steps.length) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 rounded-xl border border-white/10 bg-[#0f2238]/88 p-3"
      >
        <p className="text-sm font-semibold text-slate-100">{current.title}</p>
        <p className="mt-1 text-xs leading-6 text-slate-300/86">{current.summary}</p>
        <div className="mt-2 space-y-1">
          {current.payload.map(item => (
            <p key={item} className="rounded-md border border-white/10 bg-[#0b172a]/82 px-2 py-1 text-[11px] text-slate-200/92">
              {item}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
