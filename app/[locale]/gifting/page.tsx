'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { StepAnalysis } from '@/components/gifting/home/sections/step-analysis'
import { StepCountry } from '@/components/gifting/home/sections/step-country'
import { StepGiftInput } from '@/components/gifting/home/sections/step-gift-input'
import { ResultsSection } from '@/components/gifting/home/sections/results-section'
import { useHomePageController } from '@/components/gifting/home/hooks/use-home-page-controller'
import { withBasePath } from '@/lib/asset-path'

type StepTheme = {
  theme: string
  buttonClassName: string
  accentBarClassName: string
  accentTextClassName: string
  title: string
  desc: string
  quote: string
  chapter: string
  images: [string, string]
}

export default function GiftingPage() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const routeLocale = (params?.locale === 'en' ? 'en' : 'zh') as 'zh' | 'en'

  const controller = useHomePageController(routeLocale)
  const { isZh, workflowPanelsProps, resultsProps, feedbackProps } = controller
  const { giftInputProps, countryProps, analysisProps } = workflowPanelsProps

  const [currentStep, setCurrentStep] = useState(1)

  React.useEffect(() => {
    if (analysisProps.isAnalyzing && currentStep !== 4) {
      setCurrentStep(4)
      return
    }

    if (!analysisProps.isAnalyzing && currentStep === 4) {
      if (feedbackProps.error) {
        setCurrentStep(3)
      } else if (resultsProps) {
        setCurrentStep(5)
      }
    }
  }, [analysisProps.isAnalyzing, currentStep, feedbackProps.error, resultsProps])

  const editorialContent: Record<number, StepTheme> = {
    1: {
      theme: 'from-[#eef3ff] via-[#f6f8fc] to-[#fffdf9]',
      buttonClassName:
        'bg-[#5368b5] text-white shadow-[0_18px_38px_-24px_rgba(83,104,181,0.55)] hover:bg-[#465aa1]',
      accentBarClassName: 'bg-[#5368b5]',
      accentTextClassName: 'text-[#5368b5]',
      chapter: isZh ? 'Chapter 01' : 'Chapter 01',
      title: isZh ? '让礼物先被准确看见。' : 'Let the gift be seen precisely first.',
      desc: isZh
        ? '从图像、名称与描述里提炼礼物的真实语义，避免后续所有判断都建立在错误认知之上。'
        : 'Extract the gift’s real meaning from image, name, and description before every later decision inherits the wrong premise.',
      quote: isZh ? 'Every gesture starts with the object itself.' : 'Every gesture starts with the object itself.',
      images: [
        withBasePath('/brand/gift-ceremony.svg'),
        withBasePath('/brand/scene-business.svg'),
      ],
    },
    2: {
      theme: 'from-[#eef8f3] via-[#f8fbfa] to-[#fffdf9]',
      buttonClassName:
        'bg-[#2d8a69] text-white shadow-[0_18px_38px_-24px_rgba(45,138,105,0.5)] hover:bg-[#247357]',
      accentBarClassName: 'bg-[#2d8a69]',
      accentTextClassName: 'text-[#2d8a69]',
      chapter: isZh ? 'Chapter 02' : 'Chapter 02',
      title: isZh ? '把国家与对象写进语境。' : 'Write country and recipient into the context.',
      desc: isZh
        ? '礼物不是发往一个地址，而是进入一个由礼仪、关系与场合共同塑造的阅读环境。'
        : 'A gift does not ship to an address. It enters a reading environment shaped by etiquette, relationship, and occasion.',
      quote: isZh ? 'Context changes how the same object is felt.' : 'Context changes how the same object is felt.',
      images: [
        withBasePath('/brand/world-map.svg'),
        withBasePath('/brand/scene-family.svg'),
      ],
    },
    3: {
      theme: 'from-[#fff4e7] via-[#fffaf4] to-[#fffdf9]',
      buttonClassName:
        'bg-[#c67a1f] text-white shadow-[0_18px_38px_-24px_rgba(198,122,31,0.5)] hover:bg-[#ab681a]',
      accentBarClassName: 'bg-[#c67a1f]',
      accentTextClassName: 'text-[#c67a1f]',
      chapter: isZh ? 'Chapter 03' : 'Chapter 03',
      title: isZh ? '把信息收束成文化判断。' : 'Narrow the information into a cultural read.',
      desc: isZh
        ? '这里不再增加素材，而是把礼物线索、文化禁忌和关系角色整合成真正可执行的建议。'
        : 'This is where gift signals, cultural taboos, and relationship roles are edited into an actionable recommendation.',
      quote: isZh ? 'Precision matters most at the moment of judgment.' : 'Precision matters most at the moment of judgment.',
      images: [
        withBasePath('/brand/scene-festival.svg'),
        withBasePath('/brand/ambient-ribbon.svg'),
      ],
    },
    4: {
      theme: 'from-[#f6f0ff] via-[#fbf8ff] to-[#fffdf9]',
      buttonClassName:
        'bg-[#7b58b9] text-white shadow-[0_18px_38px_-24px_rgba(123,88,185,0.5)] hover:bg-[#6945a8]',
      accentBarClassName: 'bg-[#7b58b9]',
      accentTextClassName: 'text-[#7b58b9]',
      chapter: isZh ? 'Chapter 04' : 'Chapter 04',
      title: isZh ? '系统正在编织文化判断。' : 'The system is weaving the cultural read.',
      desc: isZh
        ? '多模态识别、规则判断和关系语境正在交叉校准，准备输出最终礼赠建议。'
        : 'Multimodal recognition, rules, and relationship context are being cross-checked to shape the final gifting recommendation.',
      quote: isZh ? 'Editorial intelligence is being composed.' : 'Editorial intelligence is being composed.',
      images: [
        withBasePath('/brand/world-map.svg'),
        withBasePath('/brand/hero-global-gift.svg'),
      ],
    },
    5: {
      theme: 'from-[#fff1f4] via-[#fff8f8] to-[#fffdf9]',
      buttonClassName:
        'bg-[#d84b74] text-white shadow-[0_18px_38px_-24px_rgba(216,75,116,0.52)] hover:bg-[#c13d66]',
      accentBarClassName: 'bg-[#d84b74]',
      accentTextClassName: 'text-[#d84b74]',
      chapter: isZh ? 'Chapter 05' : 'Chapter 05',
      title: isZh ? '把情感安全地送达。' : 'Deliver the emotion with precision.',
      desc: isZh
        ? '结果页不是评分终点，而是一份兼顾文化分寸、表达方式与替代方案的礼赠编辑稿。'
        : 'The result is not a scorecard. It is an editorial gifting brief balancing tact, expression, and alternatives.',
      quote: isZh ? 'A gift lands through feeling, not through raw utility.' : 'A gift lands through feeling, not through raw utility.',
      images: [
        withBasePath('/brand/gift-ceremony.svg'),
        withBasePath('/brand/hero-global-gift.svg'),
      ],
    },
  }

  const currentContent = editorialContent[currentStep] ?? editorialContent[1]
  const canAdvanceFromStep1 = Boolean(giftInputProps.recognition || giftInputProps.giftName.trim() || giftInputProps.selectedFile)
  const canAdvanceFromStep2 = Boolean(countryProps.selectedCountry)

  const railLabels = [
    isZh ? '礼物信号' : 'Gift signal',
    isZh ? '文化语境' : 'Context',
    isZh ? '判断生成' : 'Judgment',
    isZh ? '汇聚中' : 'Composing',
    isZh ? '最终提案' : 'Proposal',
  ]

  return (
    <div className={`min-h-screen bg-[#fcfaf7] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
      <div className={`flex min-h-screen bg-gradient-to-br transition-colors duration-700 ${currentContent.theme}`}>
        <aside className="relative hidden h-screen w-[46%] overflow-hidden border-r border-black/6 lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.66),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.34),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.08))]" />

          <div className="relative z-10 flex h-full flex-col px-10 pb-10 pt-9 xl:px-12 xl:pb-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${routeLocale}`)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white/72 text-[#1c1a17] shadow-[0_12px_30px_-24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
                title={isZh ? '返回首页' : 'Back to home'}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xl font-serif font-medium tracking-tight text-[#1c1a17]">Givia</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                  {isZh ? 'Narrative Editorial Flow' : 'Narrative Editorial Flow'}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-1 flex-col"
              >
                <div className="grid h-[42vh] gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
                  <div className="relative overflow-hidden rounded-[2.75rem] border border-white/80 shadow-[0_32px_72px_-42px_rgba(15,23,42,0.28)]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(248,244,238,0.08), rgba(26,25,23,0.48)), url(${currentContent.images[0]})`,
                      }}
                    />
                    <div className="relative flex h-full flex-col justify-between p-6">
                      <div className="inline-flex w-fit items-center rounded-full border border-white/28 bg-white/14 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/84 backdrop-blur-md">
                        {currentContent.chapter}
                      </div>
                      <div className="max-w-md">
                        <p className="text-[2rem] font-serif leading-tight text-white xl:text-[2.35rem]">
                          {currentContent.quote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="relative overflow-hidden rounded-[2.15rem] border border-white/80 shadow-[0_24px_52px_-34px_rgba(15,23,42,0.24)]">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(24,23,22,0.34)), url(${currentContent.images[1]})`,
                        }}
                      />
                      <div className="relative flex h-full min-h-[12rem] items-end p-5">
                        <div className="rounded-full border border-white/26 bg-white/18 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/86 backdrop-blur-md">
                          {isZh ? 'Human frame' : 'Human frame'}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2.15rem] border border-white/70 bg-white/58 p-5 shadow-[0_24px_48px_-38px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
                      <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                        {isZh ? 'Narrative note' : 'Narrative note'}
                      </p>
                      <p className="mt-3 text-base leading-8 text-[#5d6472]">{currentContent.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 max-w-[32rem]">
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`h-[2px] w-11 rounded-full ${currentContent.accentBarClassName}`} />
                    <span className={`text-sm font-semibold uppercase tracking-[0.18em] ${currentContent.accentTextClassName}`}>
                      {isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}
                    </span>
                  </div>
                  <h2 className="text-[3.2rem] font-serif leading-[1.02] tracking-[-0.04em] text-[#1c1a17]">
                    {currentContent.title}
                  </h2>
                  <p className="mt-5 max-w-[29rem] text-lg font-light leading-9 text-[#5d6472]">
                    {currentContent.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 grid grid-cols-5 gap-2">
              {railLabels.map((label, index) => {
                const stepIndex = index + 1
                const active = stepIndex === currentStep
                const reached = stepIndex < currentStep

                return (
                  <div
                    key={label}
                    className={`rounded-[1.25rem] border px-3 py-3 text-center transition-all ${
                      active
                        ? 'border-black/10 bg-white/72 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.2)]'
                        : reached
                          ? 'border-black/6 bg-white/42'
                          : 'border-transparent bg-white/18'
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#98a2b3]">0{stepIndex}</p>
                    <p className={`mt-1 truncate text-xs ${active ? 'text-[#1c1a17]' : 'text-[#98a2b3]'}`}>{label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="relative flex min-h-screen w-full flex-col bg-[rgba(255,255,255,0.82)] shadow-[-18px_0_50px_rgba(15,23,42,0.04)] lg:w-[54%]">
          <header className="sticky top-0 z-30 border-b border-black/6 bg-white/78 px-6 py-5 backdrop-blur-2xl lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => router.push(`/${routeLocale}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/6 bg-white/82 text-black transition hover:bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className={`text-[11px] uppercase tracking-[0.18em] ${currentContent.accentTextClassName}`}>
                  {isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}
                </p>
                <p className="mt-1 text-lg font-serif text-[#1c1a17]">{currentContent.title}</p>
              </div>
              <div className="w-10" />
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-[980px] flex-1 flex-col px-6 py-10 md:px-10 md:py-14 xl:px-14">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-10 max-w-3xl">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 01 / Gift signal' : 'Step 01 / Gift signal'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '先把礼物的语义写清楚。' : 'Clarify the gift before you judge it.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '上传参考图，补充名称与描述，让系统先理解这份礼物本身，再进入跨文化解读。'
                        : 'Upload a reference, add the name and description, and let the system understand the object before the cross-cultural read begins.'}
                    </p>
                  </div>

                  <StepGiftInput {...giftInputProps} />

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!canAdvanceFromStep1}
                      className={`inline-flex items-center gap-2 rounded-full px-10 py-4 transition disabled:cursor-not-allowed disabled:opacity-40 ${currentContent.buttonClassName}`}
                    >
                      {isZh ? '继续下一章' : 'Continue'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-10 max-w-3xl">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 02 / Cultural context' : 'Step 02 / Cultural context'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '把目的地、对象与场合编辑进同一页。' : 'Edit destination, recipient, and occasion onto the same page.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '国家只是起点，更重要的是这份礼物将被谁接收、在什么场合被感知。'
                        : 'Country is only the starting point. What matters is who receives the gift and in what social setting it will be felt.'}
                    </p>
                  </div>

                  <StepCountry {...countryProps} />

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="rounded-full border border-black/8 bg-white/84 px-8 py-4 text-[#475467] transition hover:bg-white"
                    >
                      {isZh ? '返回上一章' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!canAdvanceFromStep2}
                      className={`inline-flex items-center gap-2 rounded-full px-10 py-4 transition disabled:cursor-not-allowed disabled:opacity-40 ${currentContent.buttonClassName}`}
                    >
                      {isZh ? '进入判断' : 'Continue'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-10 max-w-3xl">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 03 / Cultural judgment' : 'Step 03 / Cultural judgment'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '把所有线索收束成一份礼赠建议。' : 'Turn the gathered signals into a gifting recommendation.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '最后一步决定的是送与不送、怎么送，以及如果不稳妥时该如何替换。'
                        : 'This final chapter decides whether to send, how to send, and what to substitute when the current option is not tactful enough.'}
                    </p>
                  </div>

                  {feedbackProps.error && (
                    <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50/88 px-5 py-4 text-sm text-rose-700">
                      {feedbackProps.error}
                    </div>
                  )}

                  <StepAnalysis {...analysisProps} />

                  <div className="mt-8 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="rounded-full border border-black/8 bg-white/84 px-8 py-4 text-[#475467] transition hover:bg-white"
                    >
                      {isZh ? '返回上一章' : 'Back'}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="flex flex-1 items-center justify-center py-16"
                >
                  <div className="w-full max-w-[52rem] rounded-[2.8rem] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(248,243,236,0.9))] p-8 shadow-[0_36px_86px_-52px_rgba(15,23,42,0.3)] sm:p-10">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center">
                      <div className="relative flex h-44 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-purple-100 blur-3xl" />
                        <div className="absolute h-36 w-36 rounded-full border border-purple-200/80" />
                        <div className="absolute h-28 w-28 rounded-full border-[3px] border-purple-500 border-t-transparent animate-spin" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-purple-600 shadow-[0_20px_40px_-24px_rgba(123,88,185,0.45)]">
                          <Sparkles className="h-7 w-7 animate-pulse" />
                        </div>
                      </div>

                      <div>
                        <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                          {isZh ? 'Composing cultural intelligence' : 'Composing cultural intelligence'}
                        </p>
                        <h2 className="mt-4 text-[2.7rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                          {isZh ? '系统正在把判断写成最终提案。' : 'The system is shaping the final editorial recommendation.'}
                        </h2>
                        <p className="mt-4 max-w-xl text-lg leading-9 text-[#667085]">
                          {isZh
                            ? '正在同步比对礼物语义、国家礼仪、关系角色和高级模块结果，准备输出更稳妥的送礼提案。'
                            : 'Gift semantics, country etiquette, relationship roles, and enhancement modules are being cross-checked to form a safer gifting proposal.'}
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            isZh ? '礼物语义' : 'Gift semantics',
                            isZh ? '文化禁忌' : 'Cultural taboos',
                            isZh ? '关系语境' : 'Relationship context',
                          ].map(item => (
                            <div key={item} className="rounded-[1.4rem] border border-black/6 bg-white/72 px-4 py-4 text-sm text-[#475467]">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  {resultsProps ? (
                    <ResultsSection {...resultsProps} />
                  ) : (
                    <div className="rounded-[2rem] border border-black/6 bg-white/72 p-16 text-center text-[#98a2b3]">
                      {isZh ? '报告生成失败，请重试。' : 'Failed to generate the report. Please try again.'}
                    </div>
                  )}

                  <div className="mt-8 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`inline-flex items-center gap-2 rounded-full px-8 py-4 transition ${currentContent.buttonClassName}`}
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      {isZh ? '重新开始' : 'Start again'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
