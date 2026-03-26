'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, PencilLine, Sparkles, Upload, WandSparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

const fieldClassName =
  'w-full rounded-[1.65rem] border border-black/7 bg-white/72 px-5 py-4 text-[15px] leading-7 text-[#1d1a17] placeholder:text-[#9aa1af] transition focus:border-[#5b72d1]/45 focus:bg-white focus:outline-none focus:shadow-[0_0_0_4px_rgba(91,114,209,0.08)]'

const secondaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/68 px-4 py-2.5 text-sm text-[#495161] shadow-[0_12px_28px_-24px_rgba(15,23,42,0.2)] transition hover:bg-white'

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
      className="rounded-[2.6rem] border border-black/6 bg-[linear-gradient(155deg,rgba(255,255,255,0.96),rgba(248,244,237,0.94))] p-6 shadow-[0_36px_84px_-48px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:p-8"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-black/6 bg-white/66 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Editorial intake' : 'Editorial intake'}</p>
            <h3 className="mt-3 text-[1.9rem] font-serif leading-tight text-[#1d1a17]">
              {isZh ? '先建立礼物的视觉与语义主档。' : 'Create the visual and semantic master profile first.'}
            </h3>
            <p className="mt-3 text-sm leading-8 text-[#6c7380]">
              {imagePreview
                ? isZh
                  ? '当前图像会作为这份礼物的主视觉档案，文字则补充材质、包装与赠送气质。'
                  : 'The current image acts as the visual master, while text refines material, packaging, and social tone.'
                : isZh
                  ? '不要把这里当成表单。把它理解为给礼物建立一个清晰、可被文化阅读的起点。'
                  : 'Do not treat this as a form. Treat it as the first authored profile of the gift before cultural reading begins.'}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.35rem] border border-[#ddd4c8] bg-[linear-gradient(180deg,#fcfaf7,#f7f0e7)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex min-h-[27rem] w-full flex-col items-center justify-center rounded-[1.9rem] border border-black/5 bg-white/80 px-8 text-center transition hover:bg-white hover:shadow-[0_26px_56px_-38px_rgba(15,23,42,0.2)]"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#eef2ff] text-[#5569bc] shadow-[0_18px_36px_-22px_rgba(85,105,188,0.4)]">
                  <ImagePlus size={38} />
                </div>
                <p className="text-[2.2rem] font-serif leading-tight text-[#1d1a17]">{isZh ? '上传礼物主视觉' : 'Upload the gift key visual'}</p>
                <p className="mt-4 max-w-md text-sm leading-8 text-[#6c7380]">
                  {isZh
                    ? '包装、材质、轮廓、色彩和细节会成为这份礼物的第一层文化线索。'
                    : 'Packaging, material, silhouette, color, and detail become the first cultural signals the system reads.'}
                </p>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[2rem] bg-[#f2ece4] shadow-[0_28px_58px_-36px_rgba(15,23,42,0.22)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.28),transparent_28%)] mix-blend-screen" />
                  <div className="relative aspect-[4/4.6] w-full">
                    <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/62 via-black/14 to-transparent px-5 pb-5 pt-20 text-white">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">{isZh ? 'Visual master' : 'Visual master'}</p>
                    <p className="mt-2 truncate text-base">{selectedFile?.name ?? (isZh ? '已上传礼物主视觉' : 'Uploaded gift visual')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className={secondaryButtonClassName}>
                    <Upload size={14} />
                    {isZh ? '替换图片' : 'Replace image'}
                  </button>
                  <button type="button" onClick={onClearSelectedImage} className={secondaryButtonClassName}>
                    <X size={14} />
                    {isZh ? '移除图片' : 'Remove image'}
                  </button>
                  {recognition && (
                    <button type="button" onClick={onToggleTextEditor} className={secondaryButtonClassName}>
                      <PencilLine size={14} />
                      {shouldHideGiftInputs ? (isZh ? '展开文字编辑' : 'Show text editor') : isZh ? '收起文字编辑' : 'Hide text editor'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {recognition && (
            <div className="rounded-[2rem] border border-[#eadfcb] bg-[linear-gradient(180deg,#fffdf8,#fff4e5)] p-5 shadow-[0_22px_46px_-34px_rgba(184,129,45,0.24)]">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#fff1da] p-2.5 text-[#b8812d]">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#b8812d]">{isZh ? 'Machine reading' : 'Machine reading'}</p>
                  <p className="mt-3 text-[1.5rem] font-serif leading-tight text-[#1d1a17]">{isZh ? recognition.itemZh : recognition.itemEn}</p>
                  <p className="mt-3 text-sm leading-7 text-[#6f5a35]">
                    {isZh ? '类别' : 'Category'} · {recognition.category} · {isZh ? '置信度' : 'Confidence'} {(recognition.confidence * 100).toFixed(0)}%
                  </p>
                  {recognitionSource && (
                    <p className="mt-2 text-xs leading-6 text-[#9d8760]">{isZh ? '识别来源' : 'Recognition source'}: {recognitionSource}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[2.1rem] border border-black/6 bg-white/66 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.16)]">
            <div className="grid gap-4 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              {!shouldHideGiftInputs && (
                <div className="rounded-[1.8rem] border border-black/6 bg-[#fcfaf7] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Object title' : 'Object title'}</p>
                  <input
                    id="gift-name"
                    type="text"
                    value={giftName}
                    onChange={event => onGiftNameChange(event.target.value)}
                    placeholder={isZh ? '例如：钢笔、香水、茶具' : 'e.g. fountain pen, perfume, tea set'}
                    className={`${fieldClassName} mt-3`}
                  />
                  <div className="mt-4 rounded-[1.4rem] border border-black/6 bg-white/70 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#98a2b3]">{isZh ? 'Editorial cue' : 'Editorial cue'}</p>
                    <p className="mt-2 text-sm leading-7 text-[#69707d]">
                      {hasTextDraft
                        ? isZh
                          ? '你已经有了礼物草稿，现在需要把它写得更像一份有质感的物件说明。'
                          : 'You already have a draft. Now shape it into a more refined object profile.'
                        : isZh
                          ? '一句准确的物件标题，就能决定后续文化解读的起点。'
                          : 'A precise object title already shapes the start of the cultural interpretation.'}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-[1.8rem] border border-black/6 bg-[linear-gradient(180deg,#fff,#fcfaf7)] p-4">
                {!shouldHideGiftInputs && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="gift-description" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                        {isZh ? 'Gift description' : 'Gift description'}
                      </label>
                      <button
                        type="button"
                        onClick={onBeautifyGiftDescription}
                        disabled={!giftDescription.trim()}
                        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/68 px-3 py-1.5 text-[11px] text-[#495161] disabled:cursor-not-allowed disabled:opacity-40"
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
                      rows={8}
                      placeholder={
                        isZh
                          ? '例如：黑色金属笔身、简约商务风、礼盒包装、偏正式赠礼场景'
                          : 'e.g. black metal body, minimal business styling, boxed packaging, formal gifting context'
                      }
                      className={`${fieldClassName} mt-3 min-h-[15rem] resize-none overflow-hidden`}
                    />
                  </>
                )}

                {recognition && (
                  <div className={`${shouldHideGiftInputs ? '' : 'mt-5'} rounded-[1.7rem] border border-black/6 bg-white/72 p-4`}>
                    <label htmlFor="vision-label" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                      {isZh ? 'Detected label' : 'Detected label'}
                    </label>
                    <input
                      id="vision-label"
                      value={visionLabel}
                      onChange={event => onVisionLabelChange(event.target.value)}
                      placeholder={isZh ? '可修改识别标签' : 'Edit detected label'}
                      className={`${fieldClassName} mt-3`}
                    />

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <label htmlFor="vision-description" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                        {isZh ? 'Machine description' : 'Machine description'}
                      </label>
                      <button
                        type="button"
                        onClick={onBeautifyVisionDescription}
                        disabled={!visionDescription.trim()}
                        className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/68 px-3 py-1.5 text-[11px] text-[#495161] disabled:cursor-not-allowed disabled:opacity-40"
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
                      className={`${fieldClassName} mt-3 resize-none overflow-hidden`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2.15rem] border border-[#e8decd] bg-[linear-gradient(180deg,#fffdf8,#fff5e7)] p-5 shadow-[0_24px_50px_-36px_rgba(184,129,45,0.22)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-[34rem]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9b6b20]">{isZh ? 'Editorial action' : 'Editorial action'}</p>
                <p className="mt-3 text-base leading-8 text-[#5f4b2c]">
                  {isZh
                    ? '确认当前礼物档案，让系统把图像、标题与描述合并成统一的礼物语义。'
                    : 'Confirm the current gift profile so image, title, and description can be merged into one coherent semantic read.'}
                </p>
              </div>

              <Button
                onClick={onRecognize}
                disabled={!canRecognize || isRecognizing}
                className="rounded-full bg-gradient-to-r from-[#5b72d1] via-[#4f65bd] to-[#4355a9] px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_42px_-24px_rgba(91,114,209,0.48)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles size={16} className="mr-2 inline" />
                {isRecognizing
                  ? isZh
                    ? `识别中... ${recognizingElapsedSeconds}s`
                    : `Recognizing... ${recognizingElapsedSeconds}s`
                  : isTextOnlyRecognition
                    ? isZh
                      ? '确认礼物档案'
                      : 'Confirm gift profile'
                    : isZh
                      ? '开始礼物识别'
                      : 'Start object reading'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
