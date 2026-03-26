'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, PencilLine, Sparkles, Upload, WandSparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton, homeControl } from '@/components/gifting/home/home-design-tokens'
import type { Locale, RecognitionResult, RecognitionSource } from '@/components/gifting/home/types'

export interface StepGiftInputProps {
  locale: Locale
  recognition: RecognitionResult | null
  recognitionSource: RecognitionSource | null
  imagePreview: string
  selectedFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  shouldHideGiftInputs: boolean
  giftName: string
  giftDescription: string
  giftDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  visionLabel: string
  visionDescription: string
  visionDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  canRecognize: boolean
  isRecognizing: boolean
  isTextOnlyRecognition: boolean
  recognizingElapsedSeconds: number
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearSelectedImage: () => void
  onToggleTextEditor: () => void
  onGiftNameChange: (value: string) => void
  onGiftDescriptionChange: (value: string) => void
  onVisionLabelChange: (value: string) => void
  onVisionDescriptionChange: (value: string) => void
  onBeautifyGiftDescription: () => void
  onBeautifyVisionDescription: () => void
  onRecognize: () => void | Promise<void>
  autoResizeTextarea: (element: HTMLTextAreaElement | null) => void
}

export function StepGiftInput({
  locale,
  recognition,
  recognitionSource,
  imagePreview,
  selectedFile,
  fileInputRef,
  shouldHideGiftInputs,
  giftName,
  giftDescription,
  giftDescriptionRef,
  visionLabel,
  visionDescription,
  visionDescriptionRef,
  canRecognize,
  isRecognizing,
  isTextOnlyRecognition,
  recognizingElapsedSeconds,
  onFileSelect,
  onClearSelectedImage,
  onToggleTextEditor,
  onGiftNameChange,
  onGiftDescriptionChange,
  onVisionLabelChange,
  onVisionDescriptionChange,
  onBeautifyGiftDescription,
  onBeautifyVisionDescription,
  onRecognize,
  autoResizeTextarea,
}: StepGiftInputProps) {
  const isZh = locale === 'zh'
  const hasTextDraft = Boolean(giftName.trim() || giftDescription.trim())

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2.3rem] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(249,245,239,0.94))] p-6 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          <div className="rounded-[1.9rem] border border-black/6 bg-white/70 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.18)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Source material' : 'Source material'}</p>
            <p className="mt-3 text-lg font-serif leading-tight text-[#1c1a17]">
              {isZh ? '让礼物拥有一个清晰的起点。' : 'Give the gift a clear editorial starting point.'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#667085]">
              {imagePreview
                ? isZh
                  ? '图像与文字正在共同定义礼物语义。'
                  : 'Image and text are now defining the gift together.'
                : isZh
                  ? '先上传图像，或直接用文字描述礼物。'
                  : 'Start from an image or describe the gift in words.'}
            </p>
          </div>

          <div className="rounded-[2rem] border border-dashed border-[#d8d1c7] bg-[linear-gradient(180deg,#fcfaf7,#f7f1e9)] p-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex min-h-[22rem] w-full flex-col items-center justify-center rounded-[1.6rem] border border-black/5 bg-white/78 px-6 text-center transition hover:bg-white hover:shadow-[0_22px_44px_-32px_rgba(15,23,42,0.18)]"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef2ff] text-[#4a5f97] shadow-[0_16px_34px_-22px_rgba(74,95,151,0.42)] transition group-hover:scale-[1.02]">
                  <ImagePlus size={34} />
                </div>
                <p className="text-[2rem] font-serif leading-tight text-[#1c1a17]">{isZh ? '上传礼物图片' : 'Upload the gift image'}</p>
                <p className="mt-3 max-w-sm text-sm leading-8 text-[#667085]">
                  {isZh
                    ? '把包装、材质、色彩和细节先交给系统。它们会成为后续文化判断的第一手线索。'
                    : 'Let packaging, material, color, and detail become the first signals the system reads before any cultural judgment begins.'}
                </p>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[1.7rem] bg-[#f4efe9] shadow-[0_24px_52px_-32px_rgba(15,23,42,0.22)]">
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent px-5 pb-5 pt-14 text-white">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">{isZh ? 'Captured object' : 'Captured object'}</p>
                    <p className="mt-2 truncate text-base">{selectedFile?.name ?? (isZh ? '已上传礼物图片' : 'Uploaded gift image')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                    <Upload size={14} />
                    {isZh ? '更换图像' : 'Replace image'}
                  </button>
                  <button type="button" onClick={onClearSelectedImage} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                    <X size={14} />
                    {isZh ? '移除图像' : 'Remove image'}
                  </button>
                  {recognition && (
                    <button type="button" onClick={onToggleTextEditor} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                      <PencilLine size={14} />
                      {shouldHideGiftInputs ? (isZh ? '展开文字编辑' : 'Show text editor') : isZh ? '收起文字区' : 'Hide text area'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {recognition && (
            <div className="rounded-[1.8rem] border border-[#ebe0cd] bg-[linear-gradient(180deg,#fffdf8,#fff5e8)] p-5 shadow-[0_20px_44px_-34px_rgba(184,129,45,0.28)]">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-[#fff0d9] p-2 text-[#b8812d]">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#b8812d]">{isZh ? 'Machine reading' : 'Machine reading'}</p>
                  <p className="mt-2 text-xl font-serif text-[#1c1a17]">{locale === 'zh' ? recognition.itemZh : recognition.itemEn}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6f5a35]">
                    {isZh ? '类别' : 'Category'} · {recognition.category} · {isZh ? '置信度' : 'Confidence'} {(recognition.confidence * 100).toFixed(0)}%
                  </p>
                  {recognitionSource && (
                    <p className="mt-2 text-xs leading-6 text-[#9b855e]">{isZh ? '识别来源' : 'Recognition source'}: {recognitionSource}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
            {!shouldHideGiftInputs && (
              <div className="rounded-[1.9rem] border border-black/6 bg-white/74 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Gift title' : 'Gift title'}</p>
                <input
                  id="gift-name"
                  type="text"
                  value={giftName}
                  onChange={event => onGiftNameChange(event.target.value)}
                  placeholder={isZh ? '例如：钢笔、香水、茶具' : 'e.g. fountain pen, perfume, tea set'}
                  className={`${homeControl.input} mt-3`}
                />
                <div className="mt-5 rounded-[1.4rem] border border-black/6 bg-[#fcfaf7] p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Editorial cue' : 'Editorial cue'}</p>
                  <p className="mt-2 text-sm leading-7 text-[#667085]">
                    {hasTextDraft
                      ? isZh
                        ? '你已经给出了礼物草稿，继续补充细节会让语义更稳定。'
                        : 'You already have a draft. A bit more detail will make the object reading more stable.'
                      : isZh
                        ? '一句礼物名称也可以成为判断的起点。'
                        : 'Even a single gift name can become the starting point for the recommendation.'}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-[1.9rem] border border-black/6 bg-[linear-gradient(180deg,#fff,#fcfaf7)] p-5">
              {!shouldHideGiftInputs && (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="gift-description" className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Gift description' : 'Gift description'}</label>
                    <button
                      type="button"
                      onClick={onBeautifyGiftDescription}
                      disabled={!giftDescription.trim()}
                      className={`${homeButton.secondary} px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      <WandSparkles size={12} />
                      {isZh ? '润色' : 'Polish'}
                    </button>
                  </div>
                  <textarea
                    ref={giftDescriptionRef}
                    id="gift-description"
                    value={giftDescription}
                    onChange={event => {
                      onGiftDescriptionChange(event.target.value)
                      autoResizeTextarea(event.target)
                    }}
                    rows={7}
                    placeholder={
                      isZh
                        ? '例如：黑色金属笔身、简约商务风、礼盒包装、偏正式赠礼场景'
                        : 'e.g. black metal body, minimal business styling, boxed packaging, formal gifting context'
                    }
                    className={`${homeControl.input} mt-3 min-h-[13rem] resize-none overflow-hidden leading-7`}
                  />
                </>
              )}

              {recognition && (
                <div className={`${shouldHideGiftInputs ? '' : 'mt-5'} rounded-[1.5rem] border border-black/6 bg-white/72 p-4`}>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="vision-label" className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Detected label' : 'Detected label'}</label>
                  </div>
                  <input
                    id="vision-label"
                    value={visionLabel}
                    onChange={event => onVisionLabelChange(event.target.value)}
                    placeholder={isZh ? '可修改识别标签' : 'Edit detected label'}
                    className={`${homeControl.input} mt-3`}
                  />

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <label htmlFor="vision-description" className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Machine description' : 'Machine description'}</label>
                    <button
                      type="button"
                      onClick={onBeautifyVisionDescription}
                      disabled={!visionDescription.trim()}
                      className={`${homeButton.secondary} px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-45`}
                    >
                      <WandSparkles size={12} />
                      {isZh ? '润色' : 'Polish'}
                    </button>
                  </div>
                  <textarea
                    ref={visionDescriptionRef}
                    id="vision-description"
                    value={visionDescription}
                    onChange={event => {
                      onVisionDescriptionChange(event.target.value)
                      autoResizeTextarea(event.target)
                    }}
                    rows={4}
                    placeholder={isZh ? '可直接修改识别输出的礼物描述' : 'Edit recognized gift description'}
                    className={`${homeControl.input} mt-3 resize-none overflow-hidden leading-7`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-black/6 bg-[#f8f3ec] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Action' : 'Action'}</p>
                <p className="mt-2 text-base leading-8 text-[#667085]">
                  {isZh
                    ? '确认当前礼物信息，系统将把视觉线索和文字描述整合成统一的礼物语义。'
                    : 'Confirm the current material so the system can merge visual cues and text into one coherent gift reading.'}
                </p>
              </div>

              <Button onClick={onRecognize} disabled={!canRecognize || isRecognizing} className={`rounded-full px-8 py-4 text-sm font-semibold ${homeButton.primary}`}>
                <Sparkles size={16} className="mr-2 inline" />
                {isRecognizing
                  ? locale === 'zh'
                    ? `识别中... ${recognizingElapsedSeconds}s`
                    : `Recognizing... ${recognizingElapsedSeconds}s`
                  : isTextOnlyRecognition
                    ? locale === 'zh'
                      ? '确认礼物信息'
                      : 'Confirm gift info'
                    : locale === 'zh'
                      ? 'AI 识别礼物'
                      : 'AI recognize the gift'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
