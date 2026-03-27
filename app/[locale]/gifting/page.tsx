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
      kicker: 'Context writing',
      title: isZh ? '先写目的地与送礼场景。' : 'Set the destination and gifting scene first.',
      desc: isZh
        ? '这一章默认只保留 AI 最需要的国家、场景、预算和语气，不再堆满人物细节。'
        : 'This chapter keeps only the destination, scene, budget, and register the AI truly needs first, without overloading the page.',
      quote: isZh ? '同一份礼物，换一个语境，意义就会完全不同。' : 'The same gift changes meaning as soon as the context changes.',
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
  const canAdvanceFromStep1 = Boolean(giftInputProps.recognition || giftInputProps.giftName.trim() || giftInputProps.selectedFile)
  const canAdvanceFromStep2 = Boolean(countryProps.selectedCountry)

  const railLabels = [
    isZh ? '礼物对象' : 'Object',
    isZh ? '人物语境' : 'Context',
    isZh ? '礼赠判断' : 'Judgment',
    isZh ? '稿件生成' : 'Composing',
    isZh ? '终稿报告' : 'Dossier',
  ]

  const aiCompanion = {
    1: {
      label: isZh ? 'AI 对象识别' : 'AI object reading',
      title: isZh
        ? giftInputProps.recognition
          ? `我先把它理解成「${giftInputProps.recognition.itemZh}」`
          : '先给我一张图，或一句准确描述。'
        : giftInputProps.recognition
          ? `I am currently reading this as “${giftInputProps.recognition.itemEn}”`
          : 'Give me an image, or one precise object description first.',
      body: isZh
        ? giftInputProps.recognition
          ? '接下来我会继续抓取材质、包装和社会气质，帮你判断这份礼物在别的文化里会被怎样第一眼阅读。'
          : '我会先识别礼物类型，再帮你提炼材质、气质与文化暗示。你不需要一开始就写很多。'
        : giftInputProps.recognition
          ? 'Next I will keep extracting material, packaging, and social mood to judge how the object may be read elsewhere.'
          : 'I will identify the object first, then help you refine its material, mood, and cultural suggestion. You do not need to write everything at once.',
      bullets: isZh
        ? [
            giftInputProps.selectedFile ? '已收到礼物主图' : '还没有主图',
            giftInputProps.giftName.trim() ? `名称：${giftInputProps.giftName.trim()}` : '还没有名称',
            giftInputProps.giftDescription.trim() ? '已补充对象描述' : '建议先写一句材质与用途',
          ]
        : [
            giftInputProps.selectedFile ? 'Gift image received' : 'No key image yet',
            giftInputProps.giftName.trim() ? `Name: ${giftInputProps.giftName.trim()}` : 'No title yet',
            giftInputProps.giftDescription.trim() ? 'Object description added' : 'Start with one sentence on material and use',
          ],
    },
    2: {
      label: isZh ? 'AI 语境建模' : 'AI context reading',
      title: isZh
        ? countryProps.selectedCountry
          ? `我正在把礼物放进「${countryProps.selectedCountry}」对应的文化语境`
          : '先告诉我礼物要进入哪里。'
        : countryProps.selectedCountry
          ? `I am placing the gift inside the cultural context of “${countryProps.selectedCountry}”`
          : 'Tell me where the gift is going first.',
      body: isZh
        ? countryProps.selectedCountry
          ? '国家、场景、预算和语气已经足够让我开始判断“得体”的边界。人物细节只有在真正影响判断时才需要补。'
          : '我需要先知道国家和场景。没有这些信息，再好的礼物也无法判断是否得体。'
        : countryProps.selectedCountry
          ? 'Country, scene, budget, and register are already enough for me to start judging the boundary of tact. Recipient details matter only when they truly change the reading.'
          : 'I need the destination and scene first. Without them, even a strong gift cannot be judged for tact.',
      bullets: isZh
        ? [
            countryProps.selectedCountry ? `目的地：${countryProps.selectedCountry}` : '目的地待选择',
            countryProps.sceneTemplate ? `场景：${countryProps.sceneTemplate}` : '场景待选择',
            countryProps.budgetLabel ? `预算：${countryProps.budgetLabel}` : '预算待补充',
          ]
        : [
            countryProps.selectedCountry ? `Destination: ${countryProps.selectedCountry}` : 'Destination pending',
            countryProps.sceneTemplate ? `Scene: ${countryProps.sceneTemplate}` : 'Scene pending',
            countryProps.budgetLabel ? `Budget: ${countryProps.budgetLabel}` : 'Budget pending',
          ],
    },
    3: {
      label: isZh ? 'AI 判断引擎' : 'AI judgment engine',
      title: isZh ? '这里开始由 AI 接管，不再让你继续填表。' : 'From here the AI takes over, rather than asking for more form input.',
      body: isZh
        ? '我会把礼物对象、文化目的地、关系对象和送礼场景组织成一份礼赠终稿，包括风险、语气、包装和替代方向。'
        : 'I will organize the object, cultural destination, recipient, and scene into a final gifting dossier covering risk, tone, packaging, and alternatives.',
      bullets: isZh
        ? [
            analysisProps.canAnalyze ? '关键信息已足够，可以开始生成' : '还有关键信息未完成',
            analysisProps.hasEnabledAnalysisEnhancement ? '已启用增强图层' : '当前为基础 AI 判断',
            feedbackProps.error ? `当前报错：${feedbackProps.error}` : '等待你确认并启动生成',
          ]
        : [
            analysisProps.canAnalyze ? 'Core inputs are sufficient to generate' : 'Some key inputs are still missing',
            analysisProps.hasEnabledAnalysisEnhancement ? 'Deeper layers enabled' : 'Core AI judgment only',
            feedbackProps.error ? `Current error: ${feedbackProps.error}` : 'Waiting for your go-ahead to generate',
          ],
    },
  } as const

  const currentAiCompanion = aiCompanion[currentStep as 1 | 2 | 3]
  const aiAsideTheme = {
    1: 'from-[#f7f8fd] via-[#fcfcfe] to-[#f8f5f1]',
    2: 'from-[#f5faf6] via-[#fcfdfb] to-[#f7f5f0]',
    3: 'from-[#f7f4ef] via-[#fcfbf8] to-[#f8f5f1]',
  }[currentStep as 1 | 2 | 3]

  if (currentStep === 5) {
    return (
      <div className={`relative min-h-screen overflow-hidden bg-[#f8f3ec] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.82),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(226,212,216,0.28),transparent_26%),linear-gradient(180deg,rgba(248,243,236,0.84),rgba(250,247,242,0.98))]" />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1520px] flex-col px-6 py-6 sm:px-8 lg:px-12">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.78rem] tracking-[0.18em] text-[#7c8490]">{isZh ? '礼智极意' : 'Givia'}</p>
              <p className="mt-2 text-[2.4rem] font-serif tracking-[-0.08em] text-[#191614]">{isZh ? 'Givia' : 'Final editorial dossier'}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/${routeLocale}`)}
              className="inline-flex items-center gap-2 border-b border-[#E5E0D8]/80 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
            >
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回首页' : 'Back home'}
            </button>
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
              <ResultsSection {...resultsProps} />
            ) : (
              <div className="rounded-[2rem] border border-[#E5E0D8]/80 bg-white/72 p-16 text-center text-[#98a2b3]">{isZh ? '报告生成失败，请重试。' : 'Failed to generate the report. Please try again.'}</div>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-screen overflow-hidden bg-[#f8f3ec] text-[#1c1a17] ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.82),transparent_28%),linear-gradient(180deg,rgba(248,243,236,0.84),rgba(250,247,242,0.98))]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] blur-3xl"
        style={{
          background: `radial-gradient(circle at 20% 18%, ${currentContent.glow}, transparent 26%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex h-screen w-full max-w-[1520px] flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.78rem] tracking-[0.18em] text-[#7c8490]">{isZh ? '礼智极意' : 'Givia'}</p>
            <p className="mt-2 text-[2.4rem] font-serif tracking-[-0.08em] text-[#191614]">{isZh ? 'Givia' : 'Cross-cultural gifting editorial'}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(`/${routeLocale}`)}
              className="inline-flex items-center gap-2 border-b border-[#E5E0D8]/80 pb-2 text-[11px] uppercase tracking-[0.24em] text-[#7d8593] transition hover:text-[#191614]"
            >
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回首页' : 'Back home'}
            </button>
          </div>
        </header>

        <div className="mt-4 grid gap-4 border-t border-[#E5E0D8]/80 pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,16.5rem)]">
          <div>
            <p className={`text-[11px] uppercase tracking-[0.3em] ${currentContent.accentTextClassName}`}>{currentContent.chapter}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{currentContent.kicker}</span>
              <span className="h-1 w-1 rounded-full bg-black/12" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? `步骤 0${currentStep}` : `Step 0${currentStep}`}</span>
            </div>
            <h1 className="mt-2 text-[2.35rem] font-serif leading-[0.98] tracking-[-0.06em] text-[#1c1a17] md:text-[2.85rem]">{currentContent.title}</h1>
            <p className="mt-2 max-w-[37rem] text-[0.96rem] leading-8 text-[#667085]">{currentContent.desc}</p>
          </div>

          <div className="flex flex-col justify-between border-l border-[#E5E0D8]/80 pl-4">
            <p className="text-[0.96rem] font-serif leading-snug text-[#1c1a17]">{currentContent.quote}</p>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                {railLabels.map((label, index) => {
                  const stepIndex = index + 1
                  const active = stepIndex === currentStep
                  const reached = stepIndex < currentStep

                  return (
                    <div key={label} className="flex min-w-0 flex-1 flex-col gap-2">
                      <span
                        className="h-[2px] rounded-full transition-all"
                        style={{
                          backgroundColor: active ? currentContent.accent : reached ? 'rgba(28,26,23,0.34)' : 'rgba(28,26,23,0.1)',
                        }}
                      />
                      <span className={`truncate text-[10px] uppercase tracking-[0.18em] ${active ? 'text-[#1c1a17]' : 'text-[#98a2b3]'}`}>0{stepIndex}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <main className="mt-5 min-h-0 flex-1 overflow-hidden rounded-[3rem] border border-[#E5E0D8]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,242,236,0.88))] px-5 py-5 shadow-[0_36px_88px_-58px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6 xl:px-7 xl:py-7">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  <StepGiftInput {...giftInputProps} />
                  <div className="mt-8 flex justify-end w-full pb-10">
                    <button onClick={() => setCurrentStep(2)} disabled={!canAdvanceFromStep1} className="bg-indigo-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">
                      {isZh ? '下一步：配置场景' : 'Next: Configure Scene'} <ArrowRight className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  <StepCountry {...countryProps} />
                  <div className="mt-8 flex justify-between w-full pb-10">
                    <button onClick={() => setCurrentStep(1)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}
                    </button>
                    <button onClick={() => setCurrentStep(3)} disabled={!canAdvanceFromStep2} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">
                      {isZh ? '下一步：开始判断' : 'Next: AI Judgment'} <ArrowRight className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  {feedbackProps.error && <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50/88 px-5 py-4 text-sm text-rose-700">{feedbackProps.error}</div>}
                  <StepAnalysis {...analysisProps} />
                  <div className="mt-8 flex justify-between w-full pb-10">
                    <button onClick={() => setCurrentStep(2)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex h-full items-center justify-center">
                <div className="w-full max-w-[66rem] overflow-hidden rounded-[3rem] border border-[#E5E0D8]/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(247,242,236,0.9))] shadow-[0_36px_86px_-52px_rgba(0,0,0,0.03)]">
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="relative min-h-[24rem] overflow-hidden bg-[linear-gradient(180deg,rgba(123,88,185,0.08),rgba(40,38,34,0.44)),url(https://images.pexels.com/photos/10479673/pexels-photo-10479673.jpeg?cs=srgb&dl=pexels-jonathanborba-10479673.jpg&fm=jpg)] bg-cover bg-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24),transparent_30%)] mix-blend-screen" />
                      <div className="relative flex h-full flex-col justify-between p-7">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">{isZh ? 'Editorial composition' : 'Editorial composition'}</p>
                        <p className="max-w-[16rem] text-[1.45rem] font-serif leading-tight text-white">
                          {isZh ? '系统正在把礼物、关系与文化分寸写成一份真正可送达的终稿。' : 'The system is writing object, relationship, and tact into a dossier that can actually be delivered.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 sm:p-10">
                      <p className={`text-[11px] uppercase tracking-[0.2em] ${currentContent.accentTextClassName}`}>{isZh ? '稿件生成中' : 'Dossier in progress'}</p>
                      <h2 className="mt-4 text-[2.7rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                        {isZh ? '系统正在整理文化风险、表达方式与替代方向。' : 'The system is assembling risk, expression, and better alternatives.'}
                      </h2>
                      <p className="mt-4 max-w-xl text-lg leading-9 text-[#667085]">
                        {isZh
                          ? '礼物语义、国家礼仪、关系角色与包装语气正在被交叉校准，准备输出更稳妥、更得体的送达方案。'
                          : 'Gift semantics, etiquette, relationship roles, and packaging tone are being cross-calibrated to produce a more tactful and fitting route for the gesture.'}
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                          isZh ? '礼物语义' : 'Gift semantics',
                          isZh ? '文化分寸' : 'Cultural tact',
                          isZh ? '关系语境' : 'Relationship context',
                        ].map(item => (
                          <div key={item} className="border-t border-[#E5E0D8]/80 pt-4 text-sm text-[#475467]">
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                        {isZh ? '终稿不是只给结论，而是给出真正可执行的改写方式。' : 'The dossier will not stop at a verdict. It will explain how to rewrite the gesture.'}
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