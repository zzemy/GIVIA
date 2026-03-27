'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PencilLine, Sparkles, Upload, WandSparkles } from 'lucide-react'
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
  'w-full border-0 border-b border-black/10 bg-transparent px-0 py-3 text-[15px] leading-7 text-[#1d1a17] placeholder:text-[#9aa1af] transition duration-500 focus:border-[#6175ca]/45 focus:outline-none focus:ring-0'

const stagePhotography = {
  editorial:
    'https://images.pexels.com/photos/4792659/pexels-photo-4792659.jpeg?cs=srgb&dl=pexels-ekaterina-bolovtsova-4792659.jpg&fm=jpg',
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
  const recognitionLabel = recognition ? (isZh ? recognition.itemZh : recognition.itemEn) : null

  const chapterNotes = [
    isZh ? '先确认它是什么，再判断它会被怎样理解。' : 'Name the object first, then judge how it may be interpreted.',
    isZh ? '材质、边角、包装和用途，都会改变礼物的社会气质。' : 'Material, edges, packaging, and use all change the object’s social tone.',
    isZh ? '这一章产出的不是表单，而是礼物的对象稿。' : 'What emerges here is not a form, but an authored object sheet.',
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid flex-1 gap-8 overflow-hidden xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]"
    >
      <div className="grid min-h-0 gap-5 xl:grid-rows-[minmax(0,1fr)_auto]">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

        {!imagePreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex min-h-[26rem] w-full flex-col justify-between overflow-hidden rounded-[2.8rem] text-left shadow-[0_36px_88px_-52px_rgba(15,23,42,0.22)]"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(255,255,255,0.04),rgba(14,11,10,0.42)),url(${stagePhotography.editorial})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.22),transparent_28%)] mix-blend-screen" />
            <div className="relative p-7 text-white sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.26em] text-white/64">{isZh ? 'Chapter opening' : 'Chapter opening'}</p>
              <p className="mt-4 max-w-[17rem] text-[2.55rem] font-serif leading-[1.02]">
                {isZh ? '上传礼物主视觉。' : 'Upload the object image.'}
              </p>
            </div>

            <div className="relative space-y-4 p-7 text-white sm:p-8">
              <p className="max-w-[24rem] text-sm leading-8 text-white/82">
                {isZh
                  ? '最好是一张能看清材质、包装、用途或品牌气质的照片。真正影响判断的，往往是这些细节。'
                  : 'Use a photograph that reveals material, packaging, function, or brand mood. Those details often determine the final reading.'}
              </p>
              <div className="inline-flex items-center gap-2 border-b border-white/28 pb-2 text-[11px] uppercase tracking-[0.18em] text-white/82">
                <Upload size={14} />
                {isZh ? '选择图像并开始撰写' : 'Select image and begin writing'}
              </div>
            </div>
          </button>
        ) : (
          <div className="relative min-h-[26rem] overflow-hidden rounded-[2.8rem] shadow-[0_36px_88px_-52px_rgba(15,23,42,0.22)]">
            <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(13,11,10,0.44))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.22),transparent_28%)] mix-blend-screen" />
            <div className="relative flex h-full flex-col justify-between p-7 text-white sm:p-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/64">{isZh ? 'Object manuscript' : 'Object manuscript'}</p>
                <p className="mt-4 max-w-[16rem] text-[2.35rem] font-serif leading-[1.02]">
                  {isZh ? '礼物主视觉已就位。' : 'The object image is in place.'}
                </p>
              </div>

              <div>
                <p className="text-[1.02rem] font-medium">{selectedFile?.name ?? (isZh ? '已上传礼物图像' : 'Uploaded gift image')}</p>
                <p className="mt-3 max-w-[24rem] text-sm leading-8 text-white/82">
                  {isZh
                    ? '现在继续写下它的气质、场景与文化暗示，让这张图真正进入礼赠语境。'
                    : 'Now add its tone, scene, and cultural suggestion so the image can enter the gifting context with precision.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 rounded-[2.2rem] border border-black/6 bg-white/74 p-6 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.18)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '章节提示' : 'Chapter note'}</p>
            <div className="mt-3 space-y-2">
              {chapterNotes.map(line => (
                <p key={line} className="text-sm leading-7 text-[#667085]">
                  {line}
                </p>
              ))}
            </div>
            {recognition && recognitionLabel && (
              <div className="mt-4 border-t border-black/8 pt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '已识别线索' : 'Observed signal'}</p>
                <p className="mt-2 text-[1.1rem] font-serif text-[#1d1a17]">{recognitionLabel}</p>
                <p className="mt-2 text-xs leading-6 text-[#7b808c]">
                  {recognitionSource} · {isZh ? '置信度' : 'Confidence'} {(recognition.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 sm:justify-end">
            {imagePreview && (
              <>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.16em] text-[#556070] transition hover:text-[#1d1a17]">
                  {isZh ? '替换图像' : 'Replace image'}
                </button>
                <button type="button" onClick={onClearSelectedImage} className="border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.16em] text-[#556070] transition hover:text-[#1d1a17]">
                  {isZh ? '移除图像' : 'Remove image'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onRecognize}
              disabled={!canRecognize || isRecognizing}
              className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.16em] text-[#556070] transition hover:text-[#1d1a17] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={12} />
              {isRecognizing ? (isZh ? `识别中 ${recognizingElapsedSeconds}s` : `Reading ${recognizingElapsedSeconds}s`) : isZh ? '开始细读' : 'Read the object'}
            </button>
            {recognition && (
              <button type="button" onClick={onToggleTextEditor} className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.16em] text-[#556070] transition hover:text-[#1d1a17]">
                <PencilLine size={12} />
                {shouldHideGiftInputs ? (isZh ? '展开对象稿' : 'Show object sheet') : isZh ? '收起对象稿' : 'Hide object sheet'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 overflow-auto pr-1">
        <div className="border-b border-black/8 pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">{isZh ? 'Object dossier' : 'Object dossier'}</p>
          <h3 className="mt-4 max-w-[32rem] text-[2.8rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17]">
            {isZh ? '把礼物写成一份清晰、克制、带质感的对象稿。' : 'Write the gift as a clear, restrained, and textured object sheet.'}
          </h3>
          <p className="mt-4 max-w-[34rem] text-sm leading-8 text-[#69707d]">
            {isZh
              ? '系统需要先理解这个物件本身，再去判断它在另一种文化里会被如何读懂。'
              : 'The system first needs to understand the object itself before it can judge how the gift may be read in another culture.'}
          </p>
        </div>

        <div className="space-y-8 pt-6">
          {!shouldHideGiftInputs && (
            <>
              <article className="border-b border-black/8 pb-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Object title' : 'Object title'}</p>
                    <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
                      {isZh ? '先给它一个准确、优雅、没有歧义的称呼。' : 'Give it a name that is precise, elegant, and free of ambiguity.'}
                    </p>
                  </div>
                  {hasTextDraft && <p className="pt-1 text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? '对象已起稿' : 'Draft started'}</p>}
                </div>
                <input
                  id="gift-name"
                  type="text"
                  value={giftName}
                  onChange={event => onGiftNameChange(event.target.value)}
                  placeholder={isZh ? '例如：真丝围巾、木盒茶器、签字钢笔' : 'e.g. silk scarf, tea set in a wooden box, signing pen'}
                  className={`${fieldClassName} mt-3`}
                />
              </article>

              <article className="border-b border-black/8 pb-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Material and mood' : 'Material and mood'}</p>
                    <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
                      {isZh ? '写下材质、色调、包装和它给人的第一层印象。' : 'Write the material, tone, packaging, and the first impression it gives.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onBeautifyGiftDescription}
                    disabled={!giftDescription.trim()}
                    className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.14em] text-[#556070] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <WandSparkles size={12} />
                    {isZh ? '整理文气' : 'Refine tone'}
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
                  rows={6}
                  placeholder={
                    isZh
                      ? '写材质、颜色、包装、用途、风格，以及它会让人想到的情境。'
                      : 'Describe the material, color, packaging, purpose, styling, and the kind of situation it evokes.'
                  }
                  className={`${fieldClassName} mt-3 min-h-[9rem] resize-none overflow-hidden`}
                />
              </article>
            </>
          )}

          <article className="border-b border-black/8 pb-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Cultural cue' : 'Cultural cue'}</p>
            <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
              {isZh ? '概括它更接近哪一种社会气质、礼仪感或生活方式。' : 'Summarize the social mood, etiquette, or way of living it feels closest to.'}
            </p>
            <input
              id="vision-label"
              value={visionLabel}
              onChange={event => onVisionLabelChange(event.target.value)}
              placeholder={isZh ? '例如：低调商务、收藏感、节庆问候、轻奢家居' : 'e.g. understated business, collectible, festive greeting, refined homeware'}
              className={`${fieldClassName} mt-3`}
            />
          </article>

          <article>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{isZh ? 'Editorial note' : 'Editorial note'}</p>
                <p className="mt-2 text-[1.16rem] font-serif leading-8 text-[#1d1a17]">
                  {isZh ? '把它放进跨文化语境，它会让人联想到怎样的距离、礼貌与情绪？' : 'Placed in a cross-cultural setting, what kind of distance, courtesy, and emotion might it suggest?'}
                </p>
              </div>
              <button
                type="button"
                onClick={onBeautifyVisionDescription}
                disabled={!visionDescription.trim()}
                className="inline-flex items-center gap-2 border-b border-black/10 pb-2 text-[11px] uppercase tracking-[0.14em] text-[#556070] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <WandSparkles size={12} />
                {isZh ? '整理文气' : 'Refine tone'}
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
              rows={7}
              placeholder={
                isZh
                  ? '写下它可能带来的文化印象、关系距离、礼仪感和被接收时的气氛。'
                  : 'Describe the cultural impression, relational distance, etiquette, and atmosphere it may create when received.'
              }
              className={`${fieldClassName} mt-3 min-h-[10rem] resize-none overflow-hidden`}
            />
            <p className="mt-3 text-sm leading-7 text-[#7b808c]">
              {isTextOnlyRecognition
                ? isZh
                  ? '当前系统主要依据文字理解礼物，后续补图会让判断更细腻。'
                  : 'The reading currently relies mainly on text. Adding imagery later will make the judgment more nuanced.'
                : isZh
                  ? '这一段决定系统会如何理解礼物的情绪、社会语气与文化暗示。'
                  : 'This paragraph guides the system’s understanding of the gift’s emotion, social register, and cultural suggestion.'}
            </p>
          </article>
        </div>
      </div>
    </motion.section>
  )
}
