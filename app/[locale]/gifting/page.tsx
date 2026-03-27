'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { StepAnalysis } from '@/components/gifting/home/sections/step-analysis'
import { StepCountry } from '@/components/gifting/home/sections/step-country'
import { StepGiftInput } from '@/components/gifting/home/sections/step-gift-input'
import { ResultsSection } from '@/components/gifting/home/sections/results-section'
import { useHomePageController } from '@/components/gifting/home/hooks/use-home-page-controller'
type StepTheme = {
  theme: string
  buttonClassName: string
  accentBarClassName: string
  accentTextClassName: string
  title: string
  desc: string
  quote: string
  chapter: string
  kicker: string
  images: [string, string, string]
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

  const photoSets: Record<number, [string, string, string]> = {
    1: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
    2: [
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    ],
    3: [
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    ],
    4: [
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    ],
    5: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1519741491041-6750297b4d0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
  }

  const editorialContent: Record<number, StepTheme> = {
    1: {
      theme: 'from-[#f3f6fb] via-[#f7f8fa] to-[#fcfaf7]',
      buttonClassName:
        'bg-[#5368b5] text-white shadow-[0_18px_38px_-24px_rgba(83,104,181,0.55)] hover:bg-[#465aa1]',
      accentBarClassName: 'bg-[#5368b5]',
      accentTextClassName: 'text-[#5368b5]',
      chapter: isZh ? 'Chapter 01' : 'Chapter 01',
      kicker: isZh ? 'Object reading' : 'Object reading',
      title: isZh ? '先看清故事，是从什么样的礼物开始。' : 'First, see what kind of object this story begins with.',
      desc: isZh
        ? '每一段送达都始于物件本身。先把它的材质、气质与象征看清，后面的文化判断才不会失焦。'
        : 'Every gesture begins with the object itself. Read its material, mood, and symbolism first so every later judgment does not drift off premise.',
      quote: isZh ? 'Every gesture starts with the object itself.' : 'Every gesture starts with the object itself.',
      images: photoSets[1],
    },
    2: {
      theme: 'from-[#f2f5f2] via-[#f7f8f5] to-[#fcfaf7]',
      buttonClassName:
        'bg-[#2d8a69] text-white shadow-[0_18px_38px_-24px_rgba(45,138,105,0.5)] hover:bg-[#247357]',
      accentBarClassName: 'bg-[#2d8a69]',
      accentTextClassName: 'text-[#2d8a69]',
      chapter: isZh ? 'Chapter 02' : 'Chapter 02',
      kicker: isZh ? 'Context framing' : 'Context framing',
      title: isZh ? '再把人物、地点与场合写进同一页。' : 'Then place the person, place, and occasion on the same page.',
      desc: isZh
        ? '礼物会进入一段具体关系、一个具体场合，以及一套正在等待它的文化阅读。'
        : 'A gift enters a specific relationship, a specific occasion, and a cultural reading already waiting for it.',
      quote: isZh ? 'Context changes how the same object is felt.' : 'Context changes how the same object is felt.',
      images: photoSets[2],
    },
    3: {
      theme: 'from-[#f6f3ee] via-[#faf8f4] to-[#fcfaf7]',
      buttonClassName:
        'bg-[#736357] text-white shadow-[0_18px_38px_-24px_rgba(115,99,87,0.34)] hover:bg-[#65574c]',
      accentBarClassName: 'bg-[#736357]',
      accentTextClassName: 'text-[#736357]',
      chapter: isZh ? 'Chapter 03' : 'Chapter 03',
      kicker: isZh ? 'Editorial judgment' : 'Editorial judgment',
      title: isZh ? '然后判断，这份心意会被怎样接住。' : 'Then decide how this gesture is likely to be received.',
      desc: isZh
        ? '礼物线索、文化分寸与关系角色会在这里收束成一个更成熟的判断。'
        : 'Gift signals, cultural tact, and relationship roles come together here as a more mature judgment.',
      quote: isZh ? 'Precision matters most at the moment of judgment.' : 'Precision matters most at the moment of judgment.',
      images: photoSets[3],
    },
    4: {
      theme: 'from-[#f4f3f8] via-[#faf8fb] to-[#fcfaf7]',
      buttonClassName:
        'bg-[#7b58b9] text-white shadow-[0_18px_38px_-24px_rgba(123,88,185,0.5)] hover:bg-[#6945a8]',
      accentBarClassName: 'bg-[#7b58b9]',
      accentTextClassName: 'text-[#7b58b9]',
      chapter: isZh ? 'Chapter 04' : 'Chapter 04',
      kicker: isZh ? 'Composition in progress' : 'Composition in progress',
      title: isZh ? '系统正在把这些线索写成最后的结论。' : 'The system is now writing those signals into a final conclusion.',
      desc: isZh
        ? '礼物语义、礼仪规则与关系语境正在交叉校准，准备把这次送达整理成一份更稳妥的提案。'
        : 'Gift meaning, etiquette rules, and relationship context are being cross-checked to turn this gesture into a more tactful proposal.',
      quote: isZh ? 'Editorial intelligence is being composed.' : 'Editorial intelligence is being composed.',
      images: photoSets[4],
    },
    5: {
      theme: 'from-[#f7f1f2] via-[#fbf8f8] to-[#fcfaf7]',
      buttonClassName:
        'bg-[#8a5d67] text-white shadow-[0_18px_38px_-24px_rgba(138,93,103,0.32)] hover:bg-[#774f58]',
      accentBarClassName: 'bg-[#8a5d67]',
      accentTextClassName: 'text-[#8a5d67]',
      chapter: isZh ? 'Chapter 05' : 'Chapter 05',
      kicker: isZh ? 'Final proposal' : 'Final proposal',
      title: isZh ? '最后，让心意以更好的方式抵达。' : 'At last, let the feeling arrive in a better way.',
      desc: isZh
        ? '最后呈现的是一份兼顾文化分寸、表达方式与替代方向的礼赠编辑稿。'
        : 'What follows is an editorial gifting brief balancing tact, expression, and alternatives.',
      quote: isZh ? 'A gift lands through feeling, not through raw utility.' : 'A gift lands through feeling, not through raw utility.',
      images: photoSets[5],
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
    <div className={`h-screen overflow-hidden bg-[#fcfaf7] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
      <div className={`flex h-screen overflow-hidden bg-gradient-to-br transition-colors duration-700 ${currentContent.theme}`}>
        <aside className="relative hidden h-screen w-[46%] overflow-hidden border-r border-black/6 lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,255,255,0.66),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.34),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.08))]" />

          <div className="relative z-10 flex h-full flex-col px-10 pb-10 pt-9 xl:px-12 xl:pb-12">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.push(`/${routeLocale}`)}
                whileHover={{ y: -2, x: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-white/72 text-[#1c1a17] shadow-[0_12px_30px_-24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
                title={isZh ? '返回首页' : 'Back to home'}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>
              <div>
                {isZh ? (
                  <>
                    <p className="text-[1.15rem] font-display-zh font-semibold tracking-[0.02em] text-[#1c1a17]">礼智极意</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">Givia</p>
                    <p className="mt-2 text-[10px] tracking-[0.18em] text-[#98a2b3]">跨文化礼赠编辑</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-serif font-medium tracking-tight text-[#1c1a17]">Givia</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">Cross-cultural gifting editorial</p>
                  </>
                )}
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
                <div className="grid h-[44vh] gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
                  <div className="relative overflow-hidden rounded-[3rem] border border-white/80 shadow-[0_36px_76px_-44px_rgba(15,23,42,0.28)]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(24,22,20,0.54)), url(${currentContent.images[0]})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.22),transparent_30%)] mix-blend-screen" />
                    <div className="relative flex h-full flex-col justify-between p-6 xl:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div className="inline-flex w-fit items-center rounded-full border border-white/28 bg-white/12 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/82 backdrop-blur-md">
                          {currentContent.chapter}
                        </div>
                        <div className="text-right text-[10px] uppercase tracking-[0.22em] text-white/52">
                          {isZh ? 'Editorial sequence' : 'Editorial sequence'}
                        </div>
                      </div>
                      <div className="max-w-[24rem]">
                        <p className="text-[2.05rem] font-serif leading-[1.04] tracking-[-0.03em] text-white xl:text-[2.5rem]">
                          {currentContent.quote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-rows-[0.92fr_1.08fr] gap-4">
                    <div className="rounded-[2.3rem] border border-white/76 bg-white/56 p-5 shadow-[0_24px_52px_-34px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                      <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>{currentContent.kicker}</p>
                      <p className="mt-4 text-[1.45rem] font-serif leading-tight text-[#1c1a17]">
                        {currentContent.title}
                      </p>
                      <p className="mt-4 text-sm leading-8 text-[#5d6472]">{currentContent.desc}</p>
                    </div>

                    <div className="grid grid-cols-[0.96fr_1.04fr] gap-4">
                      <div className="relative overflow-hidden rounded-[2rem] border border-white/78 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.24)]">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(24,23,22,0.32)), url(${currentContent.images[1]})`,
                          }}
                        />
                        <div className="relative flex h-full min-h-[10rem] items-end p-4">
                          <div className="rounded-full border border-white/26 bg-white/16 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/82 backdrop-blur-md">
                            {isZh ? 'Human scene' : 'Human scene'}
                          </div>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-[2rem] border border-white/78 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.24)]">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(24,23,22,0.36)), url(${currentContent.images[2]})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.24),transparent_28%)] mix-blend-screen" />
                        <div className="relative flex h-full items-end p-4">
                          <p className="max-w-[9rem] text-xs leading-6 text-white/84">
                            {isZh ? '换一个城市，同一份心意也会进入另一套文化记忆。' : 'In another city, the same gesture enters another cultural memory.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 max-w-[34rem]">
                  <div className="mb-5 flex items-center gap-3">
                    <span className={`h-[2px] w-11 rounded-full ${currentContent.accentBarClassName}`} />
                    <span className={`text-sm font-semibold uppercase tracking-[0.18em] ${currentContent.accentTextClassName}`}>
                      {isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}
                    </span>
                  </div>
                  <h2 className="text-[3.35rem] font-serif leading-[1] tracking-[-0.05em] text-[#1c1a17]">
                    {currentContent.title}
                  </h2>
                  <p className="mt-5 max-w-[30rem] text-lg font-light leading-9 text-[#5d6472]">
                    {currentContent.desc}
                  </p>
                  <p className="mt-5 max-w-[24rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                    {isZh ? '礼物、关系与文化判断，会在这里一页页展开。' : 'Gift, relationship, and cultural judgment unfold here page by page.'}
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
                  <motion.div
                    key={label}
                    initial={false}
                    animate={{ y: active ? -2 : 0, scale: active ? 1.015 : 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                  </motion.div>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[rgba(255,255,255,0.82)] shadow-[-18px_0_50px_rgba(15,23,42,0.04)] lg:w-[54%]">
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

          <main className="mx-auto flex h-full w-full max-w-[980px] flex-1 flex-col overflow-hidden px-6 py-8 md:px-10 md:py-10 xl:px-14">
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
                  <div className="mb-8 max-w-3xl border-b border-black/8 pb-6">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 01 / Opening object' : 'Step 01 / Opening object'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '故事要先从礼物本身开始。' : 'The story has to begin with the gift itself.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '上传参考图，补充名称与描述，让系统先理解这份物件是什么、像什么、会让人联想到什么。'
                        : 'Upload a reference, add the name and description, and let the system understand what the object is, what mood it carries, and what associations it may trigger.'}
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
                      {isZh ? '进入下一章' : 'Continue to the next chapter'}
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
                  <div className="mb-8 max-w-3xl border-b border-black/8 pb-6">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 02 / People and place' : 'Step 02 / People and place'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '再把人物、地点与场景放进同一个故事里。' : 'Then place person, place, and occasion inside the same story.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '国家只是背景，真正决定分寸的，是谁会接住它、在什么场合接住它、以及彼此相隔多远。'
                        : 'Country is only the backdrop. What defines the tact is who receives it, in what setting, and how much distance exists between you.'}
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
                      {isZh ? '进入判断章节' : 'Enter the judgment chapter'}
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
                  <div className="mb-8 max-w-3xl border-b border-black/8 pb-6">
                    <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                      {isZh ? 'Step 03 / Moment of judgment' : 'Step 03 / Moment of judgment'}
                    </p>
                    <h1 className="mt-4 text-[3rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                      {isZh ? '现在判断，这份心意最终会被怎样接住。' : 'Now decide how the gesture will finally be received.'}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#667085]">
                      {isZh
                        ? '这一章会判断它应以怎样的语气、包装与距离落地，才让好意沿着原本的方向抵达。'
                        : 'This chapter decides the tone, packaging, and distance the gesture needs so the goodwill can arrive as intended.'}
                    </p>
                    <p className="mt-4 max-w-[24rem] text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                      {isZh ? '这是整段叙事里最需要分寸感的一页。' : 'This is the chapter where tact matters most.'}
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
                  <div className="w-full max-w-[56rem] overflow-hidden rounded-[3rem] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(247,242,236,0.9))] shadow-[0_36px_86px_-52px_rgba(15,23,42,0.22)]">
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                      <div className="relative min-h-[21rem] overflow-hidden bg-[linear-gradient(180deg,rgba(108,120,171,0.08),rgba(40,38,34,0.52)),url(https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80)] bg-cover bg-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24),transparent_30%)] mix-blend-screen" />
                        <div className="relative flex h-full flex-col justify-between p-7">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">
                            {isZh ? 'Editorial composition' : 'Editorial composition'}
                          </p>
                          <p className="max-w-[14rem] text-[1.45rem] font-serif leading-tight text-white">
                            {isZh ? '系统正在把礼物、关系与文化分寸编排成一份可被送达的判断稿。' : 'The system is composing object, relationship, and tact into a deliverable editorial judgment.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 sm:p-10">
                        <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>
                          {isZh ? '稿件生成中' : 'Editorial draft in progress'}
                        </p>
                        <h2 className="mt-4 text-[2.7rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                          {isZh ? '系统正在把整段判断整理成最终礼赠编辑稿。' : 'The system is shaping the full reading into an editorial gifting draft.'}
                        </h2>
                        <p className="mt-4 max-w-xl text-lg leading-9 text-[#667085]">
                          {isZh
                            ? '礼物语义、国家礼仪、关系角色与包装语气正在被交叉校准，准备输出更稳妥、更得体的送达方案。'
                            : 'Gift semantics, etiquette, relationship roles, and packaging tone are being cross-calibrated to produce a more tactful and fitting way for the gesture to land.'}
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            isZh ? '礼物语义' : 'Gift semantics',
                            isZh ? '文化分寸' : 'Cultural tact',
                            isZh ? '关系语境' : 'Relationship context',
                          ].map(item => (
                            <div key={item} className="border-t border-black/8 pt-4 text-sm text-[#475467]">
                              {item}
                            </div>
                          ))}
                        </div>
                        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                          {isZh ? '系统正把这些线索整理成一份真正可交付的判断稿。' : 'The system is shaping these signals into a deliverable judgment draft.'}
                        </p>
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
