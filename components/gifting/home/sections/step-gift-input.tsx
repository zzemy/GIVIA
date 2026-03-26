'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, PencilLine, Sparkles, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeButton, homeControl } from '@/components/gifting/home/home-design-tokens'
import { withBasePath } from '@/lib/asset-path'
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-black/6 bg-white/92 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-7"
    >
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-black/6 pb-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#667085]">{isZh ? 'STEP 01' : 'STEP 01'}</p>
          <h2 className="mt-2 text-[1.9rem] font-serif leading-tight text-[#1c1a17]">
            {isZh ? '第一步：上传图片或输入礼物' : 'Step 1: Upload image or type the gift'}
          </h2>
          <p className="mt-2 max-w-[42rem] text-sm leading-7 text-[#667085]">
            {isZh
              ? '从一张图、一句名称，或一段礼物描述开始。系统会先识别物件，再进入跨文化判断。'
              : 'Start from an image, a gift name, or a short description. The system recognizes the object first, then moves into cultural evaluation.'}
          </p>
        </div>
        <Image src={withBasePath('/brand/step-vision.svg')} alt="Vision step" width={42} height={42} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-dashed border-[#d8d1c7] bg-[#fbf7f2] p-4">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[18rem] w-full flex-col items-center justify-center rounded-[1.25rem] border border-transparent bg-white/70 px-6 text-center transition hover:border-[#9db2e7]/40 hover:bg-white"
              >
                <div className="mb-5 flex size-18 items-center justify-center rounded-full bg-[#eef2ff] text-[#4a5f97] shadow-[0_14px_30px_-20px_rgba(74,95,151,0.45)]">
                  <ImagePlus size={30} />
                </div>
                <p className="text-2xl font-serif text-[#1c1a17]">{isZh ? '上传礼物图片' : 'Upload the gift image'}</p>
                <p className="mt-3 max-w-xs text-sm leading-7 text-[#667085]">
                  {isZh
                    ? '支持 JPG、PNG、WEBP。你也可以稍后继续修改识别标签与礼物描述。'
                    : 'JPG, PNG, and WEBP are supported. You can refine the recognized label and description afterward.'}
                </p>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[1.35rem] bg-[#f4efe9]">
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-4 pb-4 pt-10 text-white">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/75">{isZh ? '当前图片' : 'Current image'}</p>
                    <p className="mt-1 truncate text-sm font-medium">{selectedFile?.name ?? (isZh ? '已上传礼物图片' : 'Uploaded gift image')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                    <Upload size={14} />
                    {isZh ? '更换图片' : 'Replace image'}
                  </button>
                  <button type="button" onClick={onClearSelectedImage} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                    <X size={14} />
                    {isZh ? '移除图片' : 'Remove image'}
                  </button>
                  {recognition && (
                    <button type="button" onClick={onToggleTextEditor} className={`${homeButton.secondary} px-4 py-2 text-sm`}>
                      <PencilLine size={14} />
                      {shouldHideGiftInputs ? (isZh ? '继续编辑文字' : 'Continue editing') : isZh ? '收起文字编辑' : 'Collapse text edit'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {recognition && (
            <div className="rounded-[1.35rem] border border-[#e3d7c4] bg-[linear-gradient(180deg,#fff9f1,#fff)] p-4 shadow-[0_18px_36px_-28px_rgba(178,128,45,0.3)]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-[#fdf0dc] p-2 text-[#b8812d]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#b8812d]">{isZh ? '识别完成' : 'Recognition complete'}</p>
                  <p className="mt-2 text-lg font-semibold text-[#1c1a17]">
                    {locale === 'zh' ? recognition.itemZh : recognition.itemEn}
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {isZh ? '类别' : 'Category'}: {recognition.category} · {isZh ? '置信度' : 'Confidence'} {(recognition.confidence * 100).toFixed(0)}%
                  </p>
                  {recognitionSource && (
                    <p className="mt-2 text-xs leading-6 text-[#98a2b3]">
                      {isZh ? '识别来源' : 'Recognition source'}: {recognitionSource}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!shouldHideGiftInputs && (
            <div className="rounded-[1.35rem] border border-black/6 bg-[#fcfaf7] p-4">
              <label htmlFor="gift-name" className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">
                {isZh ? '礼物名称' : 'Gift name'}
              </label>
              <input
                id="gift-name"
                type="text"
                value={giftName}
                onChange={event => onGiftNameChange(event.target.value)}
                placeholder={isZh ? '例如：钢笔、香水、茶具' : 'e.g. fountain pen, perfume, tea set'}
                className={`${homeControl.input} mt-3`}
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <label htmlFor="gift-description" className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">
                  {isZh ? '礼物描述' : 'Gift description'}
                </label>
                <button
                  type="button"
                  onClick={onBeautifyGiftDescription}
                  disabled={!giftDescription.trim()}
                  className={`${homeButton.secondary} px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {isZh ? '一键润色' : 'Polish'}
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
                rows={4}
                placeholder={
                  isZh
                    ? '例如：黑色金属笔身、简约商务风、礼盒包装'
                    : 'e.g. black metal body, minimal business style, boxed package'
                }
                className={`${homeControl.input} mt-3 resize-none overflow-hidden leading-7`}
              />
            </div>
          )}

          {recognition && (
            <div className="rounded-[1.35rem] border border-black/6 bg-white/88 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label htmlFor="vision-label" className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">
                  {isZh ? '识别标签' : 'Detected label'}
                </label>
              </div>
              <input
                id="vision-label"
                value={visionLabel}
                onChange={event => onVisionLabelChange(event.target.value)}
                placeholder={isZh ? '可修改识别标签' : 'Edit detected label'}
                className={homeControl.input}
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <label htmlFor="vision-description" className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">
                  {isZh ? '识别描述' : 'Recognized description'}
                </label>
                <button
                  type="button"
                  onClick={onBeautifyVisionDescription}
                  disabled={!visionDescription.trim()}
                  className={`${homeButton.secondary} px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {isZh ? '润色描述' : 'Polish'}
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
                rows={3}
                placeholder={isZh ? '可直接修改识别输出的礼物描述' : 'Edit recognized gift description'}
                className={`${homeControl.input} mt-3 resize-none overflow-hidden leading-7`}
              />
            </div>
          )}

          <Button
            onClick={onRecognize}
            disabled={!canRecognize || isRecognizing}
            className={`w-full rounded-full py-4 text-sm font-semibold ${homeButton.primary}`}
          >
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
    </motion.section>
  )
}
