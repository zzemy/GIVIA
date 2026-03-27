'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ImagePlus, PencilLine, Sparkles, Upload, WandSparkles, X } from 'lucide-react'
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
  'w-full border-0 border-b border-black/10 bg-transparent px-0 py-3 text-[15px] leading-7 text-[#1d1a17] placeholder:text-[#9aa1af] transition focus:border-[#6175ca]/45 focus:outline-none focus:ring-0'

const actionClassName =
  'inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/72 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#495161] shadow-[0_12px_24px_-22px_rgba(15,23,42,0.18)] transition hover:bg-white'

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
  const objectPrompt = isZh ? '这份物件，第一眼应该被如何称呼？' : 'How should this object be named at first glance?'
  const objectNotePrompt = isZh ? '如果把它写进一段礼赠描述，它会呈现怎样的材质、气质与场景？' : 'If it were written into a gifting note, what material, mood, and scene would it carry?'
  const cuePrompt = isZh ? '它更接近哪一种社会气质或文化线索？' : 'What social or cultural cue does it feel closest to?'
  const editorialPrompt = isZh ? '如果把它放进跨文化语境，它会让人联想到怎样的距离、礼仪与情绪？' : 'Placed in a cross-cultural setting, what distance, etiquette, and feeling might it suggest?'

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-6 overflow-hidden rounded-[2.9rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,244,238,0.9))] p-5 shadow-[0_36px_88px_-52px_rgba(15,23,42,0.18)] xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:p-6"
    >
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[2.3rem] bg-[linear-gradient(180deg,#faf7f2,#f3ece2)] p-4">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

        {!imagePreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group flex h-full min-h-[23rem] w-full flex-col items-center justify-center rounded-[2rem] border border-black/6 bg-white/74 px-8 text-center transition hover:bg-white hover:shadow-[0_26px_58px_-36px_rgba(15,23,42,0.2)]"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#eef2ff] text-[#5e72c2] shadow-[0_18px_36px_-22px_rgba(94,114,194,0.35)]">
              <ImagePlus size={36} />
            </div>
            <p className="text-[2.3rem] font-serif leading-tight text-[#1d1a17]">{isZh ? '上传礼物主视觉' : 'Upload the gift key visual'}</p>
            <p className="mt-4 max-w-md text-sm leading-8 text-[#6c7380]">
              {isZh
                ? '这张图会成为礼物档案的开篇。材质、边角、包装与光线，都会成为后续文化判断的第一层线索。'
                : 'This image opens the object dossier. Material, edges, packaging, and light become the first cues in the later cultural reading.'}
            </p>
          </button>
        ) : (
          <div className="grid h-full min-h-0 gap-4 lg:grid-rows-[minmax(0,1fr)_auto]">
            <div className="group relative min-h-0 overflow-hidden rounded-[2.1rem] shadow-[0_30px_68px_-40px_rgba(15,23,42,0.26)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.26),transparent_28%)] mix-blend-screen" />
              <div className="relative h-full min-h-[23rem]">
                <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/68 via-black/18 to-transparent px-5 pb-5 pt-16 text-white">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/72">{isZh ? 'Object cover' : 'Object cover'}</p>
                <p className="mt-2 truncate text-base">{selectedFile?.name ?? (isZh ? '已上传礼物图像' : 'Uploaded gift image')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-black/6 pt-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className={actionClassName}>
                <Upload size={14} />
                {isZh ? '替换图像' : 'Replace image'}
              </button>
              <button type="button" onClick={onClearSelectedImage} className={actionClassName}>
                <X size={14} />
                {isZh ? '移除图像' : 'Remove image'}
              </button>
              {recognition && (
                <button type="button" onClick={onToggleTextEditor} className={actionClassName}>
                  <PencilLine size={14} />
                  {shouldHideGiftInputs ? (isZh ? '展开稿件文字' : 'Show editorial text') : isZh ? '收起稿件文字' : 'Hide editorial text'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-[2.3rem] bg-white/62 p-6 backdrop-blur-2xl xl:p-8">
        <div className="border-b border-black/8 pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Editorial object sheet' : 'Editorial object sheet'}</p>
          <h3 className="mt-3 text-[2.2rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1d1a17]">
            {isZh ? '先把礼物写成一份有质感的对象档案。' : 'Write the gift first as a refined object profile.'}
          </h3>
          <p className="mt-4 max-w-[40rem] text-sm leading-8 text-[#69707d]">
            {imagePreview
              ? isZh
                ? '现在请补上它的气质：它像什么、适合怎样的关系、会让人想到怎样的场景与分寸。'
                : 'Now add its tone: what it feels like, what relationship it suits, and what scene or tact it may imply.'
              : isZh
                ? '如果暂时没有图片，也可以先用文字搭建物件轮廓，让系统理解这份礼物会如何被第一眼阅读。'
                : 'If no image is available yet, text can still establish the object profile and how the gift may be read at first glance.'}
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-8 overflow-hidden pt-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-8">
            {!shouldHideGiftInputs && (
              <article className="border-b border-black/8 pb-5">
                <label htmlFor="gift-name" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                  {isZh ? 'Object title / 物件题名' : 'Object title'}
                </label>
                <p className="mt-2 text-[1.05rem] font-serif leading-8 text-[#1d1a17]">{objectPrompt}</p>
                <input
                  id="gift-name"
                  type="text"
                  value={giftName}
                  onChange={event => onGiftNameChange(event.target.value)}
                  placeholder={isZh ? '例如：丝巾、钢笔、香氛、茶器' : 'e.g. silk scarf, fountain pen, fragrance, tea ware'}
                  className={`${fieldClassName} mt-2`}
                />
                <p className="mt-3 text-sm leading-7 text-[#7b808c]">
                  {hasTextDraft
                    ? isZh
                      ? '标题不必华丽，但必须准确。它会决定后续文化阅读的起点。'
                      : 'The title need not be ornate, but it must be precise. It sets the opening frame for the later reading.'
                    : isZh
                      ? '先给物件一个足够清晰的名称，后面的判断才会稳。'
                      : 'Give the object a clear enough name first so the rest of the reading can stay grounded.'}
                </p>
              </article>
            )}

            {recognition && (
              <article className="border-b border-black/8 pb-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-[#eef2ff] p-2.5 text-[#5e72c2]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Machine observation' : 'Machine observation'}</p>
                    <p className="mt-2 text-[1.35rem] font-serif leading-tight text-[#1d1a17]">{isZh ? recognition.itemZh : recognition.itemEn}</p>
                    <p className="mt-3 text-sm leading-7 text-[#69707d]">
                      {isZh ? '类别' : 'Category'} · {recognition.category} · {isZh ? '置信度' : 'Confidence'} {(recognition.confidence * 100).toFixed(0)}%
                    </p>
                    {recognitionSource && <p className="mt-1 text-xs leading-6 text-[#98a2b3]">{recognitionSource}</p>}
                  </div>
                </div>
              </article>
            )}

            <article className="border-b border-black/8 pb-5">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="vision-label" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                  {isZh ? 'Editorial cue / 编辑线索' : 'Editorial cue'}
                </label>
                {recognition && (
                  <button
                    type="button"
                    onClick={onRecognize}
                    disabled={!canRecognize || isRecognizing}
                    className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#495161] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Sparkles size={12} />
                    {isRecognizing
                      ? isZh
                        ? `识别中 ${recognizingElapsedSeconds}s`
                        : `Reading ${recognizingElapsedSeconds}s`
                      : isZh
                        ? '重读图像'
                        : 'Re-read image'}
                  </button>
                )}
              </div>
              <p className="mt-2 text-[1.05rem] font-serif leading-8 text-[#1d1a17]">{cuePrompt}</p>
              <input
                id="vision-label"
                value={visionLabel}
                onChange={event => onVisionLabelChange(event.target.value)}
                placeholder={isZh ? '例如：低调商务、手作感、纪念性' : 'e.g. understated business, artisanal, commemorative'}
                className={`${fieldClassName} mt-2`}
              />
            </article>
          </div>

          <div className="space-y-8 overflow-auto pr-1">
            {!shouldHideGiftInputs && (
              <article className="border-b border-black/8 pb-5">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="gift-description" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                    {isZh ? 'Object note / 物件描述' : 'Object note'}
                  </label>
                  <button
                    type="button"
                    onClick={onBeautifyGiftDescription}
                    disabled={!giftDescription.trim()}
                    className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#495161] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <WandSparkles size={12} />
                    {isZh ? '整理文气' : 'Refine tone'}
                  </button>
                </div>
                <p className="mt-2 text-[1.05rem] font-serif leading-8 text-[#1d1a17]">{objectNotePrompt}</p>
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
                      ? '写材质、颜色、包装、用途、风格与它会让人想到的场景。'
                      : 'Write about material, color, packaging, purpose, styling, and the kind of scene it evokes.'
                  }
                  className={`${fieldClassName} mt-2 min-h-[10rem] resize-none overflow-hidden`}
                />
              </article>
            )}

            <article>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="vision-description" className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">
                  {isZh ? 'Editorial note / 编辑判断' : 'Editorial note'}
                </label>
                <button
                  type="button"
                  onClick={onBeautifyVisionDescription}
                  disabled={!visionDescription.trim()}
                  className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#495161] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <WandSparkles size={12} />
                  {isZh ? '整理文气' : 'Refine tone'}
                </button>
              </div>
              <p className="mt-2 text-[1.05rem] font-serif leading-8 text-[#1d1a17]">{editorialPrompt}</p>
              <textarea
                ref={visionDescriptionRef}
                id="vision-description"
                value={visionDescription}
                onChange={event => {
                  onVisionDescriptionChange(event.target.value)
                  autoResizeTextarea(event.target)
                }}
                rows={7}
                placeholder={
                  isZh
                    ? '写下这份礼物会让人联想到的气氛、关系距离、礼仪感与文化印象。'
                    : 'Describe the atmosphere, distance, etiquette, and cultural impression this gift may carry.'
                }
                className={`${fieldClassName} mt-2 min-h-[10rem] resize-none overflow-hidden`}
              />
              <p className="mt-3 text-sm leading-7 text-[#7b808c]">
                {isTextOnlyRecognition
                  ? isZh
                    ? '当前识别主要依据文字输入，后续可继续补充图像以提高判断细腻度。'
                    : 'The current reading relies mainly on text. You can still add imagery later for a finer interpretation.'
                  : isZh
                    ? '这一段决定系统会如何理解礼物的情绪、社会语气与文化暗示。'
                    : 'This paragraph shapes how the system interprets the gift’s emotional tone, social register, and cultural suggestion.'}
              </p>
            </article>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
