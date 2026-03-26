'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useHomePageController } from '@/components/gifting/home/hooks/use-home-page-controller'
import { StepCountry } from '@/components/gifting/home/sections/step-country'
import { StepGiftInput } from '@/components/gifting/home/sections/step-gift-input'
import { StepAnalysis } from '@/components/gifting/home/sections/step-analysis'
import { ResultsSection } from '@/components/gifting/home/sections/results-section'

type StepTheme = {
  theme: string
  panel: string
  text: string
  accent: string
  title: string
  desc: string
  images: string[]
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

  const editorialContent: StepTheme[] = [
    {
      theme: 'from-indigo-50 via-sky-50 to-white',
      panel: 'bg-indigo-600',
      text: 'text-indigo-900',
      accent: 'bg-indigo-600',
      title: isZh ? '开启人文之旅' : 'The Journey Begins',
      desc: isZh
        ? '每一份礼物都带着情绪、关系与文化线索。我们先从礼物本身开始，辨认它将被怎样理解。'
        : 'Every gift carries emotion, relationship, and cultural signals. We begin by understanding how the object itself will be read.',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      theme: 'from-emerald-50 via-teal-50 to-white',
      panel: 'bg-emerald-600',
      text: 'text-emerald-900',
      accent: 'bg-emerald-600',
      title: isZh ? '探索目的地文化' : 'Read the destination culture',
      desc: isZh
        ? '国家不是收件地址而已，它决定礼物的象征意义、礼仪节奏与表达边界。'
        : 'A country is not just a shipping destination. It shapes symbolism, etiquette rhythm, and the edges of what feels appropriate.',
      images: [
        'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526481280695-3c469eb3887d?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      theme: 'from-amber-50 via-orange-50 to-white',
      panel: 'bg-amber-500',
      text: 'text-amber-900',
      accent: 'bg-amber-500',
      title: isZh ? '为对象定制语境' : 'Shape the recipient context',
      desc: isZh
        ? '同一件礼物，送给客户、长辈或亲密朋友，意义与包装方式都会完全不同。'
        : 'The same gift lands differently for a client, an elder, or an intimate friend. Context changes the entire gesture.',
      images: [
        'https://images.unsplash.com/photo-1529156069898-49953eb1b5ea?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      theme: 'from-purple-50 via-fuchsia-50 to-white',
      panel: 'bg-purple-600',
      text: 'text-purple-900',
      accent: 'bg-purple-600',
      title: isZh ? '汇聚文化智慧' : 'Weaving cultural intelligence',
      desc: isZh
        ? '系统正在交叉比对文化禁忌、礼物语义、对象画像与辅助模块结果，生成最终判断。'
        : 'The system is cross-referencing taboo signals, gift semantics, recipient context, and optional modules to form the final judgment.',
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      ],
    },
    {
      theme: 'from-rose-50 via-pink-50 to-white',
      panel: 'bg-rose-600',
      text: 'text-rose-900',
      accent: 'bg-rose-600',
      title: isZh ? '完成情感传递' : 'Complete the emotional delivery',
      desc: isZh
        ? '这里不是冰冷评分，而是一份真正可执行的礼赠建议，帮你把心意安全、得体、精准地送达。'
        : 'This is not just a score. It is an actionable gifting recommendation designed to land with tact, warmth, and precision.',
      images: [
        'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  ]

  const currentContent = editorialContent[currentStep - 1] ?? editorialContent[0]

  const canAdvanceFromStep1 = Boolean(giftInputProps.recognition || giftInputProps.giftName.trim() || giftInputProps.selectedFile)
  const canAdvanceFromStep2 = Boolean(countryProps.selectedCountry)

  return (
    <div className={`min-h-screen bg-[#fcfaf7] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
      <div className={`flex min-h-screen bg-gradient-to-br transition-colors duration-700 ${currentContent.theme}`}>
        <aside className="relative hidden h-screen w-[48%] overflow-hidden border-r border-black/6 lg:flex lg:flex-col">
          <div className="absolute left-[-12%] top-[-12%] h-64 w-64 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-white/40 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${routeLocale}`)}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-md transition hover:bg-white ${currentContent.text}`}
                title={isZh ? '返回首页' : 'Back to home'}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xl font-serif font-medium tracking-tight">Givia</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-black/35">{isZh ? 'Light Editorial Flow' : 'Light Editorial Flow'}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex-1"
              >
                <div className="relative mb-12 h-[46vh] w-full">
                  <motion.img
                    src={currentContent.images[0]}
                    alt="Editorial reference 1"
                    className="absolute left-0 top-0 z-20 h-[70%] w-[56%] rounded-[2rem] object-cover shadow-[0_28px_60px_-26px_rgba(15,23,42,0.28)] saturate-[0.9]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  />
                  <motion.img
                    src={currentContent.images[1]}
                    alt="Editorial reference 2"
                    className="absolute bottom-0 right-[8%] z-30 h-[58%] w-[46%] rounded-[2rem] object-cover shadow-[0_28px_60px_-26px_rgba(15,23,42,0.28)] saturate-[0.82]"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 }}
                  />
                  <motion.img
                    src={currentContent.images[2]}
                    alt="Editorial reference 3"
                    className="absolute right-[-3%] top-[12%] z-10 h-[46%] w-[38%] rounded-[2rem] object-cover opacity-75 shadow-[0_20px_40px_-26px_rgba(15,23,42,0.22)] grayscale-[0.12]"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.75 }}
                    transition={{ delay: 0.18 }}
                  />
                </div>

                <div className="max-w-md">
                  <div className="mb-6 flex items-center gap-3">
                    <span className={`h-[2px] w-9 rounded-full ${currentContent.accent}`}></span>
                    <span className={`text-sm font-semibold uppercase tracking-[0.18em] ${currentContent.text}`}>
                      {isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}
                    </span>
                  </div>
                  <h2 className="text-5xl font-serif leading-tight tracking-tight text-[#1c1a17]">{currentContent.title}</h2>
                  <p className="mt-6 text-lg font-light leading-relaxed text-[#5d6472]">{currentContent.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${step === currentStep ? `w-12 ${currentContent.accent}` : 'w-4 bg-black/10'}`} />
              ))}
            </div>
          </div>
        </aside>

        <div className="relative flex min-h-screen w-full flex-col bg-white/88 shadow-[-20px_0_50px_rgba(0,0,0,0.03)] lg:w-[52%]">
          <header className="sticky top-0 z-30 border-b border-black/6 bg-white/82 px-6 py-5 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => router.push(`/${routeLocale}`)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.16em] text-[#98a2b3]">{isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}</p>
                <p className="mt-1 text-lg font-serif text-[#1c1a17]">{currentContent.title}</p>
              </div>
              <div className="w-10" />
            </div>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`h-1 flex-1 rounded-full ${step <= currentStep ? currentContent.panel : 'bg-black/8'}`} />
              ))}
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-6 py-10 md:px-10 md:py-14 xl:px-14">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-8 max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? '第一步 / 礼物输入' : 'Step 1 / Gift input'}</p>
                    <h1 className="mt-3 text-4xl font-serif leading-tight text-[#1c1a17]">{isZh ? '您准备了什么礼物？' : 'What are you planning to give?'}</h1>
                    <p className="mt-3 text-base leading-8 text-[#667085]">
                      {isZh ? '可以上传图片，也可以直接输入礼物名称和描述。先让系统读懂礼物，再谈文化判断。' : 'Upload an image or describe the gift directly. Let the system understand the object before entering cultural evaluation.'}
                    </p>
                  </div>

                  <StepGiftInput {...giftInputProps} />

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!canAdvanceFromStep1}
                      className={`rounded-full px-10 py-4 text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 ${currentContent.panel}`}
                    >
                      {isZh ? '继续下一步' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-8 max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? '第二步 / 国家与对象' : 'Step 2 / Country and audience'}</p>
                    <h1 className="mt-3 text-4xl font-serif leading-tight text-[#1c1a17]">{isZh ? '礼物将去往哪个文化语境？' : 'Which cultural context is this gift entering?'}</h1>
                    <p className="mt-3 text-base leading-8 text-[#667085]">
                      {isZh ? '锁定国家、场景和收礼对象，系统才知道这份礼物会被怎样阅读。' : 'Set the country, scene, and audience so the system can understand how the gift will be interpreted.'}
                    </p>
                  </div>

                  <StepCountry {...countryProps} />

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="rounded-full border border-black/8 bg-white px-8 py-4 text-[#475467] transition hover:bg-[#f8f4ef]"
                    >
                      {isZh ? '返回' : 'Back'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={!canAdvanceFromStep2}
                      className={`rounded-full px-10 py-4 text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 ${currentContent.panel}`}
                    >
                      {isZh ? '继续下一步' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-8 max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? '第三步 / 文化判断' : 'Step 3 / Cultural judgment'}</p>
                    <h1 className="mt-3 text-4xl font-serif leading-tight text-[#1c1a17]">{isZh ? '生成送礼建议与风险判断' : 'Generate the cultural recommendation'}</h1>
                    <p className="mt-3 text-base leading-8 text-[#667085]">
                      {isZh ? '最后一步会输出文化风险、替代建议、包装方向和问候语语气。' : 'The last step produces risk notes, alternative recommendations, packaging direction, and greeting tone.'}
                    </p>
                  </div>

                  {feedbackProps.error && (
                    <div className="mb-6 rounded-[1.35rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                      {feedbackProps.error}
                    </div>
                  )}

                  <StepAnalysis {...analysisProps} />

                  <div className="mt-8 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="rounded-full border border-black/8 bg-white px-8 py-4 text-[#475467] transition hover:bg-[#f8f4ef]"
                    >
                      {isZh ? '返回' : 'Back'}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="flex flex-1 flex-col items-center justify-center py-20 text-center"
                >
                  <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-purple-100 opacity-70 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-[3px] border-purple-200"></div>
                    <div className="absolute inset-2 rounded-full border-[3px] border-purple-600 border-t-transparent animate-spin"></div>
                    <Sparkles className="relative z-10 h-10 w-10 animate-pulse text-purple-600" />
                  </div>
                  <h2 className="text-4xl font-serif tracking-tight text-[#1c1a17]">{isZh ? '正在汇聚全球文化智慧' : 'Weaving cultural wisdom'}</h2>
                  <p className="mt-6 max-w-md text-lg font-light leading-relaxed text-[#667085]">
                    {isZh ? '系统正在交叉比对文化禁忌、礼物语义、对象画像与辅助模块结果，为你生成最终判断。' : 'The system is cross-referencing cultural taboos, gift semantics, recipient context, and enhancement modules to form the final recommendation.'}
                  </p>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="flex flex-1 flex-col"
                >
                  {resultsProps ? (
                    <ResultsSection {...resultsProps} />
                  ) : (
                    <div className="rounded-[2rem] bg-[#f8f4ef] p-16 text-center text-[#98a2b3]">
                      {isZh ? '报告生成失败，请重试。' : 'Failed to generate the report. Please try again.'}
                    </div>
                  )}

                  <div className="mt-8 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-white transition ${currentContent.panel}`}
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
