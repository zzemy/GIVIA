'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { StepAnalysis } from '@/components/gifting/home/sections/step-analysis'
import { StepCountry } from '@/components/gifting/home/sections/step-country'
import { StepGiftInput } from '@/components/gifting/home/sections/step-gift-input'
import { ResultsSection } from '@/components/gifting/home/sections/results-section'
import { useHomePageController } from '@/components/gifting/home/hooks/use-home-page-controller'

type StepTheme = {
  accent: string
  glow: string
  buttonClassName: string
  accentTextClassName: string
  chapter: string
  kicker: string
  title: string
  desc: string
  quote: string
}
export default function GiftingPage() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const routeLocale = (params?.locale === 'en' ? 'en' : 'zh') as 'zh' | 'en'

  const controller = useHomePageController(routeLocale)
  const { isZh, workflowPanelsProps, resultsProps, feedbackProps } = controller
  const { giftInputProps, countryProps, analysisProps } = workflowPanelsProps

  const [currentStep, setCurrentStep] = useState(1)

  const updateStep = (nextStep: number) => {
    setCurrentStep(nextStep)
  }

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

  React.useEffect(() => {
    if (currentStep === 5 && !resultsProps) {
      setCurrentStep(1)
    }
  }, [currentStep, resultsProps])

  const editorialContent: Record<number, StepTheme> = {
    1: {
      accent: '#5368b5',
      glow: 'rgba(83,104,181,0.16)',
      buttonClassName: 'bg-[#5368b5] text-white shadow-[0_18px_38px_-24px_rgba(83,104,181,0.55)] hover:bg-[#465aa1]',
      accentTextClassName: 'text-[#5368b5]',
      chapter: 'Chapter 01',
      kicker: 'Object opening',
      title: isZh ? '先读懂礼物本身。' : 'Begin by understanding the object itself.',
      desc: isZh
        ? '这一章负责把礼物从一件物，写成一份可以被文化阅读的对象稿。'
        : 'This chapter turns the object from a mere thing into an authored profile that culture can read.',
      quote: isZh ? '礼物首先是一种被看见、被命名、被联想的存在。' : 'A gift is first something seen, named, and associated.',
    },
    2: {
      accent: '#2d8a69',
      glow: 'rgba(45,138,105,0.14)',
      buttonClassName: 'bg-[#2d8a69] text-white shadow-[0_18px_38px_-24px_rgba(45,138,105,0.5)] hover:bg-[#247357]',
      accentTextClassName: 'text-[#2d8a69]',
      chapter: 'Chapter 02',
      kicker: 'Recipient writing',
      title: isZh ? '先把收礼人写清楚。' : 'Write the recipient clearly first.',
      desc: isZh
        ? '这一章由 AI 先写出一页人物来信，你只需要轻轻校正关系、身份与分寸。'
        : 'This chapter begins with an AI-written recipient letter that you only need to revise lightly for relationship, profile, and tact.',
      quote: isZh ? '礼物先抵达一个人，随后才抵达场景。' : 'A gift reaches a person before it reaches a scene.',
    },
    3: {
      accent: '#736357',
      glow: 'rgba(115,99,87,0.14)',
      buttonClassName: 'bg-[#736357] text-white shadow-[0_18px_38px_-24px_rgba(115,99,87,0.34)] hover:bg-[#65574c]',
      accentTextClassName: 'text-[#736357]',
      chapter: 'Chapter 03',
      kicker: 'AI judgment',
      title: isZh ? '再把线索交给 AI 生成判断。' : 'Then hand the signals to the AI for judgment.',
      desc: isZh
        ? '这里不再继续填写大量内容，而是让 AI 整理文化风险、语气分寸与更合适的送达方式。'
        : 'This chapter stops asking for more input and lets the AI organize cultural risk, tone, and the best way for the gesture to arrive.',
      quote: isZh ? '真正重要的不是堆更多字段，而是让 AI 做出有分寸的判断。' : 'What matters is not adding more fields, but letting the AI make a tactful judgment.',
    },
    4: {
      accent: '#7b58b9',
      glow: 'rgba(123,88,185,0.16)',
      buttonClassName: 'bg-[#7b58b9] text-white shadow-[0_18px_38px_-24px_rgba(123,88,185,0.5)] hover:bg-[#6945a8]',
      accentTextClassName: 'text-[#7b58b9]',
      chapter: 'Chapter 04',
      kicker: 'Composing',
      title: isZh ? '系统正在写最后的终稿。' : 'The system is composing the final dossier.',
      desc: isZh
        ? '礼物语义、文化规则、关系距离与送达语气正在交叉校准。'
        : 'Gift meaning, cultural rules, relational distance, and delivery tone are being cross-calibrated.',
      quote: isZh ? '终稿不是凭空生成，而是把所有线索写成可送达的结构。' : 'The dossier is not arbitrary. It writes all signals into a deliverable structure.',
    },
    5: {
      accent: '#8a5d67',
      glow: 'rgba(138,93,103,0.16)',
      buttonClassName: 'bg-[#8a5d67] text-white shadow-[0_18px_38px_-24px_rgba(138,93,103,0.32)] hover:bg-[#774f58]',
      accentTextClassName: 'text-[#8a5d67]',
      chapter: 'Chapter 05',
      kicker: 'Final dossier',
      title: isZh ? '让这份心意以更好的方式抵达。' : 'Let the gesture arrive in a better way.',
      desc: isZh
        ? '这里呈现的是完整报告，而不是简单推荐列表。'
        : 'What appears here is a complete report, not a simple list of suggestions.',
      quote: isZh ? '礼物真正抵达的，是人与文化之间。' : 'A gift truly lands between people and culture.',
    },
  }

  const currentContent = editorialContent[currentStep] ?? editorialContent[1]
  const canAdvanceFromStep1 = Boolean(giftInputProps.giftName.trim() || giftInputProps.giftDescription.trim())
  const canAdvanceFromStep2 = Boolean(countryProps.selectedCountry && (countryProps.targetGroup !== 'other' || countryProps.customAudienceGroup.trim()))

  const railLabels = [
    isZh ? '礼物对象' : 'Object',
    isZh ? '人物语境' : 'Context',
    isZh ? '礼赠判断' : 'Judgment',
    isZh ? '稿件生成' : 'Composing',
    isZh ? '终稿报告' : 'Dossier',
  ]

  const analyzingElapsedSeconds = analysisProps.analyzingElapsedSeconds
  const expectedMinSeconds = 8
  const expectedMaxSeconds = 20
  const loadingStageText =
    analyzingElapsedSeconds < expectedMinSeconds
      ? isZh
        ? '正在建立分析上下文'
        : 'Building analysis context'
      : analyzingElapsedSeconds < expectedMaxSeconds
        ? isZh
          ? '正在交叉校准风险与表达'
          : 'Cross-calibrating risk and expression'
        : isZh
          ? '处理时间偏长，正在等待模型返回'
          : 'Taking longer than usual, waiting for model response'
  const loadingHintText =
    analyzingElapsedSeconds < expectedMaxSeconds
      ? isZh
        ? `常见耗时 ${expectedMinSeconds}-${expectedMaxSeconds} 秒，请稍候。`
        : `Typical runtime is ${expectedMinSeconds}-${expectedMaxSeconds} seconds, please wait.`
      : isZh
        ? '超过 55 秒通常只是系统繁忙，仍会继续处理；仅超过 180 秒才会触发超时提示。'
        : 'Beyond 55 seconds usually means system load and processing continues; only after 180 seconds will a timeout be triggered.'
  const loadingProgress = Math.min(95, Math.max(8, Math.round((analyzingElapsedSeconds / expectedMaxSeconds) * 100)))

  const brandEyebrow = isZh ? 'Givia' : ''
  const brandTitle = isZh ? '礼智极意' : 'Givia'
  const languageToggleLabel = isZh ? 'EN Edition' : 'ZH Edition'
  const backHomeLabel = isZh ? '返回首页' : 'Back home'

  if (currentStep === 5) {
    return (
      <div className={`relative min-h-screen overflow-hidden bg-[#f8f3ec] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.82),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(226,212,216,0.28),transparent_26%),linear-gradient(180deg,rgba(248,243,236,0.84),rgba(250,247,242,0.98))]" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-6 py-6 sm:px-8 lg:px-12">
          <header className="flex items-start justify-between gap-4">
            <div>
              {brandEyebrow ? <p className="text-[0.78rem] tracking-[0.18em] text-[#7c8490]">{brandEyebrow}</p> : null}
              <p className={`mt-2 text-[2.4rem] tracking-[-0.08em] text-[#191614] ${isZh ? 'font-serif uppercase tracking-[0.02em]' : 'font-serif'}`}>{brandTitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push(`/${routeLocale}`)}
                className="inline-flex items-center gap-2 border-b border-[#E5E0D8]/80 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
              >
                <ArrowLeft className="h-4 w-4" />
                {backHomeLabel}
              </button>
            </div>
          </header>

          <div className="mt-8 grid gap-6 border-t border-[#E5E0D8]/80 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.3em] ${currentContent.accentTextClassName}`}>{currentContent.chapter}</p>
              <h1 className="mt-4 text-[3.3rem] font-serif leading-[0.96] tracking-[-0.06em] text-[#1c1a17] md:text-[4rem]">{currentContent.title}</h1>
              <p className="mt-4 max-w-[40rem] text-base leading-8 text-[#667085]">{currentContent.desc}</p>
            </div>

            <div className="flex flex-col justify-end border-l border-[#E5E0D8]/80 pl-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{currentContent.kicker}</p>
              <p className="mt-3 text-[1.18rem] font-serif leading-tight text-[#1c1a17]">{currentContent.quote}</p>
            </div>
          </div>

          <main className="mt-8 flex-1">
            {resultsProps ? (
              <ResultsSection {...resultsProps} onReset={() => {
                  setCurrentStep(1)
                  router.push(`/${routeLocale}/gifting`)
                  resultsProps.onReset()
                }} />
            ) : (
              <div className="rounded-[2rem] border border-[#E5E0D8]/80 bg-white/72 p-16 text-center text-[#98a2b3]">{isZh ? '报告生成失败，请重试。' : 'Failed to generate the report. Please try again.'}</div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#f8f3ec] text-[#1c1a17] lg:h-screen lg:overflow-hidden ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.82),transparent_28%),linear-gradient(180deg,rgba(248,243,236,0.84),rgba(250,247,242,0.98))]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] blur-3xl"
        style={{
          background: `radial-gradient(circle at 20% 18%, ${currentContent.glow}, transparent 26%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-4 py-4 sm:px-8 lg:h-[100dvh] lg:min-h-0 lg:px-12">
        <header className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            {brandEyebrow ? <p className="text-[0.78rem] tracking-[0.18em] text-[#7c8490]">{brandEyebrow}</p> : null}
            <p className={`mt-1.5 text-[2rem] text-[#191614] ${isZh ? 'font-serif uppercase tracking-[0.02em]' : 'font-serif tracking-[-0.08em]'}`}>{brandTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push(`/${isZh ? 'en' : 'zh'}/gifting`)}
              className="inline-flex items-center gap-2 border-b border-[#E5E0D8]/80 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
            >
              {languageToggleLabel}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${routeLocale}`)}
              className="inline-flex items-center gap-2 border-b border-[#E5E0D8]/80 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
            >
              <ArrowLeft className="h-4 w-4" />
              {backHomeLabel}
            </button>
          </div>
        </header>

        <div className="mt-5 flex items-start gap-4 border-t border-[#E5E0D8]/80 pt-4 sm:mt-6 sm:items-center sm:gap-6">
          <div className="hidden min-w-[8.5rem] sm:block">
            <p className={`text-[11px] uppercase tracking-[0.3em] ${currentContent.accentTextClassName}`}>{currentContent.chapter}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
              {currentContent.kicker} · {isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}
            </p>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-2 sm:gap-3 sm:overflow-visible sm:pb-0">
            {railLabels.map((label, index) => {
              const stepIndex = index + 1
              const active = stepIndex === currentStep
              const reached = stepIndex < currentStep

              return (
                <button
                  key={label}
                  type="button"
                  disabled={true}
                  className="flex min-w-[6.5rem] flex-1 flex-col gap-2 text-left sm:min-w-0"
                >
                  <span
                    className="h-[2px] rounded-full transition-all"
                    style={{
                      backgroundColor: active ? currentContent.accent : reached ? 'rgba(28,26,23,0.34)' : 'rgba(28,26,23,0.1)',
                    }}
                  />
                  <span className={`truncate text-[10px] uppercase tracking-[0.18em] ${active ? 'text-[#1c1a17]' : 'text-[#98a2b3]'}`}>
                    0{stepIndex} {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <main className="mt-5 min-h-0 flex-1 overflow-visible pb-4 sm:mt-6 lg:overflow-hidden lg:pb-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-0 w-full flex-1 flex-col"
              >
                <StepGiftInput {...giftInputProps} canContinue={canAdvanceFromStep1} onContinue={() => updateStep(2)} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex min-h-0 w-full flex-col pt-2 lg:h-full">
                <div className="min-h-0 flex w-full flex-1 flex-col overflow-hidden">
                  <StepCountry {...countryProps} canContinue={canAdvanceFromStep2} onBack={() => updateStep(1)} onContinue={() => updateStep(3)} />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex min-h-0 w-full flex-col pt-2 lg:h-full">
                <div className="min-h-0 flex w-full flex-1 flex-col overflow-hidden">
                  {feedbackProps.error && <div className="mb-4 rounded-[1.5rem] border border-rose-200 bg-rose-50/88 px-5 py-3 text-sm text-rose-700">{feedbackProps.error}</div>}
                  <StepAnalysis {...analysisProps} onBack={() => updateStep(2)} />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex min-h-full items-center justify-center lg:h-full">
                <div className="w-full max-w-[66rem] overflow-hidden rounded-[1.8rem] border border-[#E5E0D8]/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(247,242,236,0.9))] shadow-[0_36px_86px_-52px_rgba(0,0,0,0.03)] sm:rounded-[2.2rem] lg:rounded-[3rem]">
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="relative min-h-[16rem] overflow-hidden bg-[linear-gradient(180deg,rgba(123,88,185,0.08),rgba(40,38,34,0.44)),url(https://images.pexels.com/photos/10479673/pexels-photo-10479673.jpeg?cs=srgb&dl=pexels-jonathanborba-10479673.jpg&fm=jpg)] bg-cover bg-center sm:min-h-[24rem]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24),transparent_30%)] mix-blend-screen" />
                      <div className="relative flex h-full flex-col justify-between p-5 sm:p-7">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">{isZh ? 'Editorial composition' : 'Editorial composition'}</p>
                        <p className="max-w-[16rem] text-[1.15rem] font-serif leading-tight text-white sm:text-[1.45rem]">
                          {isZh ? '系统正在把礼物、关系与文化分寸写成一份真正可送达的终稿。' : 'The system is writing object, relationship, and tact into a dossier that can actually be delivered.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-center p-5 sm:p-8 lg:p-10">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className={`h-4 w-4 rounded-full border-[1.5px] border-transparent border-t-current ${currentContent.accentTextClassName}`}
                        />
                        <p className={`text-[11px] uppercase tracking-[0.2em] font-medium ${currentContent.accentTextClassName}`}>
                          {isZh ? '稿件生成中...' : 'Dossier in progress...'}
                        </p>
                      </div>

                      <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E0D8]/80 bg-white/75 px-3 py-1.5 text-xs text-[#475467]">
                        <span>{isZh ? `已等待 ${analyzingElapsedSeconds} 秒` : `Waiting ${analyzingElapsedSeconds}s`}</span>
                        <span className="text-[#98a2b3]">·</span>
                        <span>{loadingStageText}</span>
                      </div>
                      
                      <motion.h2 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-6 text-[1.95rem] font-serif leading-[1.08] tracking-[-0.04em] text-[#1c1a17] sm:text-[2.3rem] lg:text-[2.7rem]"
                      >
                        {isZh ? '系统正在整理文化风险、表达方式与替代方向。' : 'The system is assembling risk, expression, and better alternatives.'}
                      </motion.h2>

                      <p className="mt-5 max-w-xl text-[1rem] leading-8 text-[#667085] sm:mt-6 sm:text-lg sm:leading-9">
                        {isZh
                          ? '礼物语义、国家礼仪、关系角色与包装语气正在被交叉校准，准备输出更稳妥、更得体的送达方案。'
                          : 'Gift semantics, etiquette, relationship roles, and packaging tone are being cross-calibrated to produce a more tactful and fitting route for the gesture.'}
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                          isZh ? '礼物语义' : 'Gift semantics',
                          isZh ? '文化分寸' : 'Cultural tact',
                          isZh ? '关系语境' : 'Relationship context',
                        ].map((item, i) => (
                          <motion.div 
                            key={item} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                            className="border-t border-[#E5E0D8]/80 pt-4 text-sm text-[#475467]"
                          >
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentContent.accentTextClassName.replace('text-', 'bg-')}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentContent.accentTextClassName.replace('text-', 'bg-')}`}></span>
                              </span>
                              {item}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="relative mt-10 h-[2px] w-full overflow-hidden rounded-full bg-[#E5E0D8]/40">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${currentContent.accentTextClassName.replace('text-', 'bg-')}`}
                          style={{ width: `${loadingProgress}%`, opacity: 0.24 }}
                        />
                        <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className={`absolute inset-y-0 w-1/2 rounded-full ${currentContent.accentTextClassName.replace('text-', 'bg-')}`}
                        />
                      </div>
                      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                        {loadingHintText}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
