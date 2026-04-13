'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Sparkles, Upload, WandSparkles } from 'lucide-react'
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
  suggestedGiftName: string
  suggestedGiftDescription: string
  giftDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  visionLabel: string
  visionDescription: string
  visionDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  canRecognize: boolean
  isRecognizing: boolean
  isTextOnlyRecognition: boolean
  recognizingElapsedSeconds: number
  isBeautifyingGiftDescription: boolean
  isBeautifyingVisionDescription: boolean
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearSelectedImage: () => void
  onToggleTextEditor: () => void
  onGiftNameChange: (value: string) => void
  onGiftDescriptionChange: (value: string) => void
  onAcceptSuggestedGiftName: () => void
  onAcceptSuggestedGiftDescription: () => void
  onVisionLabelChange: (value: string) => void
  onVisionDescriptionChange: (value: string) => void
  onBeautifyGiftDescription: () => void
  onBeautifyVisionDescription: () => void
  onRecognize: () => void | Promise<void>
  autoResizeTextarea: (element: HTMLTextAreaElement | null) => void
  canContinue: boolean
  onContinue: () => void
}

const fieldClassName =
  'w-full rounded-[1.6rem] border border-[rgba(74,63,51,0.12)] bg-[rgba(255,255,255,0.84)] px-5 py-4 text-[15px] leading-7 text-[#221d18] placeholder:text-[#9b9388] transition duration-300 focus:border-[rgba(90,101,132,0.34)] focus:bg-white focus:outline-none focus:ring-0'

const stagePhotography = {
  editorial: {
    src: '/editorial/object-stage.jpg?v=1',
    position: 'center 34%',
  },
}

export function StepGiftInput({
  locale,
  recognition,
  imagePreview,
  selectedFile,
  fileInputRef,
  giftName,
  giftDescription,
  suggestedGiftName,
  suggestedGiftDescription,
  giftDescriptionRef,
  visionLabel,
  visionDescription,
  visionDescriptionRef,
  canRecognize,
  isRecognizing,
  isTextOnlyRecognition,
  recognizingElapsedSeconds,
  isBeautifyingGiftDescription,
  isBeautifyingVisionDescription,
  onFileSelect,
  onClearSelectedImage,
  onGiftNameChange,
  onGiftDescriptionChange,
  onAcceptSuggestedGiftName,
  onAcceptSuggestedGiftDescription,
  onVisionLabelChange,
  onVisionDescriptionChange,
  onBeautifyGiftDescription,
  onBeautifyVisionDescription,
  onRecognize,
  autoResizeTextarea,
  canContinue,
  onContinue,
}: StepGiftInputProps) {
  const isZh = locale === 'zh'
  const [showAiNotes, setShowAiNotes] = React.useState(false)
  const recognitionLabel = recognition ? (isZh ? recognition.itemZh : recognition.itemEn) : null
  const displayClassName = isZh ? 'font-display-zh' : 'font-serif'
  const hasManualDraft = Boolean(giftName.trim() || giftDescription.trim())
  const hasAiSuggestions = Boolean(suggestedGiftName.trim() || suggestedGiftDescription.trim())
  const isRecognizedState = Boolean(recognition || hasAiSuggestions)
  const suggestedNameApplied = Boolean(suggestedGiftName.trim() && giftName.trim() === suggestedGiftName.trim())
  const suggestedDescriptionApplied = Boolean(
    suggestedGiftDescription.trim() && giftDescription.trim() === suggestedGiftDescription.trim(),
  )
  const shouldShowRecognizeAction = Boolean(selectedFile && !recognition && !isRecognizing)

  const chapterNotes = isZh
    ? ['礼物先作为对象被识别，再进入文化判断', '你可以完全自己定稿，AI 只在需要时给建议']
    : ['The gift is clarified as an object before it enters the cultural reading.', 'You may draft it entirely yourself and keep the AI in a lighter role.']
  const stageHeading = isZh ? '让礼物先以对象身份登场' : 'Let the gift arrive first as an object.'
  const stageUploadTitle = isZh ? '上传礼物主视觉' : 'Upload a gift image.'
  const draftHeading = isZh ? '先把这份礼物写成一页对象稿' : 'Draft the gift as an object sheet.'

  const checkpointTitle = isRecognizing
    ? isZh
      ? '我正在读取这件礼物的对象轮廓'
      : 'I am reading the object contours now.'
    : shouldShowRecognizeAction
      ? isZh
        ? '主视觉已经就位，可以开始识别'
        : 'The image is ready. Recognition can begin.'
      : hasAiSuggestions && !canContinue
        ? isZh
          ? '我已经给出候选名称与描述，等你确认'
          : 'I have prepared candidate naming and description for your review.'
        : canContinue
          ? isZh
            ? '对象信息已经足够，可以进入文化语境'
            : 'The object draft is now sufficient for cultural context.'
          : hasManualDraft
            ? isZh
              ? '你正在手动定稿对象信息'
              : 'You are drafting the object manually.'
            : isZh
              ? '上传图片让我识别，或直接自己写对象稿'
              : 'Upload an image for AI recognition, or write the object draft yourself.'

  const checkpointBody = isRecognizing
    ? isZh
      ? `AI 正在提炼名称、外观与材质线索${recognizingElapsedSeconds > 0 ? ` · ${recognizingElapsedSeconds}s` : ''}`
      : `The AI is extracting naming, visual, and material cues${recognizingElapsedSeconds > 0 ? ` · ${recognizingElapsedSeconds}s` : ''}`
    : shouldShowRecognizeAction
      ? isZh
        ? '识别后我会先给出名称建议和描述建议，你点采纳后才会写入表单。'
        : 'Recognition will produce candidate naming and description. Nothing is written into the fields until you accept it.'
      : hasAiSuggestions && !canContinue
        ? isZh
          ? 'AI 给的是候选稿，不是最终稿。你可以采纳、重写，或完全忽略。'
          : 'The AI draft is a candidate, not the final object sheet. You can accept, rewrite, or ignore it entirely.'
        : canContinue
          ? isZh
            ? '下一步再把这份对象稿放进目的地与送礼场景中，让礼物真正进入被接收的语境。'
            : 'Next, place this object sheet inside its destination and gifting scene so it can enter a real reception context.'
          : hasManualDraft
            ? isZh
              ? '如果你不需要 AI 识别，继续补完名称或描述即可。'
              : 'If you do not need AI recognition, continue refining the naming or description on your own.'
            : isZh
              ? '这一步只做对象定稿，不讨论国家、关系和风险判断。'
              : 'This step only defines the object itself, not the country, relationship, or risk judgment yet.'

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-0 w-full flex-1 flex-col">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible rounded-[1.6rem] border border-[rgba(74,63,51,0.12)] bg-[linear-gradient(160deg,rgba(255,252,247,0.92),rgba(248,242,234,0.88))] shadow-[0_32px_86px_-62px_rgba(36,24,18,0.18)] sm:rounded-[2.35rem] xl:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(165,181,214,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(214,185,155,0.22),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),transparent)]" />

        <div className="relative grid min-h-0 flex-1 xl:grid-cols-[minmax(21rem,0.84fr)_minmax(0,1.16fr)]">
          <div className="relative flex min-h-[15rem] flex-col justify-between overflow-visible border-b border-[rgba(74,63,51,0.1)] px-4 py-4 sm:px-6 sm:py-6 xl:min-h-0 xl:overflow-hidden xl:border-r xl:border-b-0 xl:px-7 xl:py-7">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#8f877b] sm:text-[11px]">{isZh ? 'Object stage' : 'Object stage'}</p>
                <p className={`mt-2.5 max-w-[22rem] text-[1.22rem] leading-[1.08] tracking-[-0.03em] text-[#201915] sm:mt-3 sm:text-[1.9rem] ${displayClassName}`}>
                  {stageHeading}
                </p>
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">
                <p>01</p>
                <p className="mt-2">{isZh ? '对象定稿' : 'Object draft'}</p>
              </div>
            </div>

            <div className="relative mt-3 flex-1 overflow-hidden rounded-[2rem] border border-[rgba(74,63,51,0.12)] bg-[rgba(92,72,54,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex h-full min-h-[12.5rem] w-full flex-col justify-between overflow-hidden text-left"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,252,247,0.04) 0%, rgba(77,54,39,0.16) 34%, rgba(17,12,10,0.54) 100%), url(${stagePhotography.editorial.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: stagePhotography.editorial.position,
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(255,244,225,0.26),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.08),transparent_26%)] mix-blend-screen" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_44%,rgba(21,15,11,0.16)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,rgba(19,14,11,0),rgba(19,14,11,0.58))]" />
                  <div className="relative p-5 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/66 sm:text-[11px]">{isZh ? 'Upload key image' : 'Upload key image'}</p>
                    <p className={`mt-3 max-w-[18rem] text-[1.32rem] leading-[1.12] text-white sm:mt-4 sm:text-[2rem] ${displayClassName}`}>
                      {stageUploadTitle}
                    </p>
                  </div>
                  <div className="relative p-5 sm:p-7">
                    <p className="max-w-[23rem] text-[0.84rem] leading-6 text-white/84 sm:text-sm sm:leading-7">
                      {isZh
                        ? '一张能看清材质、包装与用途的图，会比一串空泛形容词更快把对象说清楚。'
                        : 'A photograph that reveals material, packaging, and use will clarify the object faster than vague adjectives.'}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/8 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/88 transition group-hover:bg-white/14 sm:text-[11px]">
                      <Upload size={13} />
                      {isZh ? '选择图像' : 'Select image'}
                    </div>
                  </div>
                </button>
              ) : (
                <>
                  <Image src={imagePreview} alt="Gift preview" fill unoptimized className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(18,14,11,0.38))]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.22),transparent_28%)] mix-blend-screen" />
                  <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-7">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/66 sm:text-[11px]">{isZh ? 'Object image' : 'Object image'}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="max-w-[24rem] text-[0.84rem] leading-6 text-white/84 sm:text-sm sm:leading-7">
                        {recognitionLabel
                          ? isZh
                            ? `当前识别对象：${recognitionLabel}`
                            : `Current object reading: ${recognitionLabel}`
                          : isZh
                            ? '现在可以让 AI 给出候选名称和对象描述。'
                            : 'You can now ask the AI for candidate naming and object description.'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-white/86 sm:gap-3 sm:text-[11px]">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full border border-white/24 bg-white/10 px-3.5 py-2 transition hover:bg-white/16 sm:px-4">
                          {isZh ? '替换图像' : 'Replace image'}
                        </button>
                        <button type="button" onClick={onClearSelectedImage} className="rounded-full border border-white/24 bg-white/10 px-3.5 py-2 transition hover:bg-white/16 sm:px-4">
                          {isZh ? '移除图像' : 'Remove image'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex items-end justify-between gap-2 border-t border-[rgba(74,63,51,0.1)] pt-4">
              <div className="space-y-2">
                {chapterNotes.map(line => (
                  <p key={line} className="text-[0.85rem] leading-6 text-[#70685f] sm:text-sm sm:leading-7">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-6 xl:px-7 xl:py-7">
            <div className="max-w-[42rem]">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8f877b]">{isZh ? 'Object draft' : 'Object draft'}</p>
              <h2 className={`mt-3 max-w-[34rem] leading-[1.04] tracking-[-0.04em] text-[#221c17] ${displayClassName} ${isRecognizedState ? 'text-[1.26rem] sm:text-[1.72rem]' : 'text-[1.36rem] sm:text-[2.12rem]'}`}>
                {draftHeading}
              </h2>
              {!isRecognizedState && (
                <p className="mt-3 max-w-[38rem] text-[0.84rem] leading-6 text-[#70675f] sm:text-[0.92rem] sm:leading-7">
                  {isZh
                    ? '名称与描述是这一页唯一需要被确认的核心内容。AI 可以先给候选稿，但真正进入下一步的，必须是你认可后的对象文字。'
                    : 'Naming and description are the only core layers that must be confirmed here. The AI may draft candidates first, but only the text you accept should move forward.'}
                </p>
              )}
            </div>

            <div className={`grid min-h-0 gap-2 ${isRecognizedState ? 'mt-4' : 'mt-6'}`}>
              <article>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#978f84] sm:text-[11px]">{isZh ? 'Gift naming' : 'Gift naming'}</p>
                    <p className={`mt-1.5 text-[0.98rem] leading-tight text-[#231d18] sm:text-[1.06rem] ${displayClassName}`}>
                      {isZh ? '先给它一个准确、优雅、没有歧义的名称。' : 'Begin with a name that is precise, elegant, and free of ambiguity.'}
                    </p>
                  </div>
                </div>
                {suggestedGiftName && !suggestedNameApplied && (
                  <div className="mt-2 flex items-center justify-between gap-3 rounded-[1rem] border border-[rgba(90,101,132,0.14)] bg-[linear-gradient(90deg,rgba(243,246,252,0.92),rgba(250,246,240,0.92))] px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7f8798]">{isZh ? 'AI 名称建议' : 'AI naming suggestion'}</p>
                      <p className="mt-0.5 truncate text-sm leading-6 text-[#322b25]">{suggestedGiftName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onAcceptSuggestedGiftName}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(90,101,132,0.18)] bg-white/82 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#4f5d77] transition hover:bg-white"
                    >
                      <Check size={12} />
                      {isZh ? '采纳' : 'Use it'}
                    </button>
                  </div>
                )}
                <input
                  id="gift-name"
                  type="text"
                  value={giftName}
                  onChange={event => onGiftNameChange(event.target.value)}
                  placeholder={isZh ? '例如：真丝围巾、木盒茶器、签字钢笔' : 'e.g. silk scarf, tea set in a wooden box, signing pen'}
                  className={`${fieldClassName} mt-3 text-[14px] sm:text-[15px]`}
                />
                {suggestedGiftName && suggestedNameApplied && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#7f8798]">{isZh ? 'AI 名称建议已写入' : 'AI naming suggestion applied'}</p>
                )}
              </article>

              <article>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#978f84] sm:text-[11px]">{isZh ? 'Object description' : 'Object description'}</p>
                    <p className={`mt-1.5 text-[0.98rem] leading-tight text-[#231d18] sm:text-[1.06rem] ${displayClassName}`}>
                      {isZh ? '写它的外观、材质、包装和第一层气质。' : 'Write its appearance, material, packaging, and first layer of mood.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={onBeautifyGiftDescription}
                      disabled={!giftDescription.trim() || isBeautifyingGiftDescription}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,63,51,0.1)] bg-white/72 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#62584d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <WandSparkles size={12} />
                      {isBeautifyingGiftDescription ? (isZh ? '优化中' : 'Refining') : isZh ? '优化文气' : 'Refine tone'}
                    </button>
                  </div>
                </div>
                {suggestedGiftDescription && !suggestedDescriptionApplied && (
                  <div className="mt-2 flex items-start justify-between gap-3 rounded-[1rem] border border-[rgba(90,101,132,0.14)] bg-[linear-gradient(90deg,rgba(243,246,252,0.92),rgba(250,246,240,0.92))] px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7f8798]">{isZh ? 'AI 描述建议' : 'AI description suggestion'}</p>
                      <p className="mt-0.5 text-[13px] leading-5 text-[#322b25]">{suggestedGiftDescription}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onAcceptSuggestedGiftDescription}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(90,101,132,0.18)] bg-white/82 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#4f5d77] transition hover:bg-white"
                    >
                      <Check size={12} />
                      {isZh ? '采纳' : 'Use it'}
                    </button>
                  </div>
                )}
                <textarea
                  ref={giftDescriptionRef}
                  id="gift-description"
                  value={giftDescription}
                  onChange={event => {
                    onGiftDescriptionChange(event.target.value)
                    autoResizeTextarea(event.target)
                  }}
                  rows={2}
                  placeholder={
                    isZh
                      ? '写下礼物的外观、颜色、材质、包装、用途，以及它给人的第一眼印象。'
                      : 'Describe the object’s look, color, material, packaging, function, and the first impression it gives.'
                  }
                  className={`${fieldClassName} mt-3 min-h-[6.5rem] resize-none overflow-hidden text-[14px] sm:min-h-[5rem] sm:text-[15px]`}
                />
                {suggestedGiftDescription && suggestedDescriptionApplied && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#7f8798]">{isZh ? 'AI 描述建议已写入' : 'AI description suggestion applied'}</p>
                )}
              </article>

              <div className="flex items-center justify-between gap-2 border-t border-[rgba(74,63,51,0.08)] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAiNotes(current => !current)}
                  className="text-[11px] uppercase tracking-[0.2em] text-[#7d7469] transition hover:text-[#332b24]"
                >
                  {showAiNotes
                    ? isZh
                      ? '收起补充线索'
                      : 'Hide extra cues'
                    : isZh
                      ? '按需补充给 AI 的细节线索'
                      : 'Add extra cues only when needed'}
                </button>
                {showAiNotes && (
                  <button
                    type="button"
                    onClick={onBeautifyVisionDescription}
                    disabled={!visionDescription.trim() || isBeautifyingVisionDescription}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,63,51,0.1)] bg-white/72 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-[#62584d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <WandSparkles size={12} />
                    {isBeautifyingVisionDescription ? (isZh ? '优化中' : 'Refining') : isZh ? '优化文气' : 'Refine tone'}
                  </button>
                )}
              </div>

              {showAiNotes && (
                <div className="grid gap-2 rounded-[1.25rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.52)] px-4 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#978f84] sm:text-[11px]">{isZh ? 'Cultural cue' : 'Cultural cue'}</p>
                    <input
                      id="vision-label"
                      value={visionLabel}
                      onChange={event => onVisionLabelChange(event.target.value)}
                      placeholder={isZh ? '例如：低调商务、收藏感、节庆问候、轻奢家居' : 'e.g. understated business, collectible, festive greeting, refined homeware'}
                      className={`${fieldClassName} mt-2.5 text-[14px] sm:text-[15px]`}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#978f84] sm:text-[11px]">{isZh ? 'Editorial note' : 'Editorial note'}</p>
                    <textarea
                      ref={visionDescriptionRef}
                      id="vision-description"
                      value={visionDescription}
                      onChange={event => {
                        onVisionDescriptionChange(event.target.value)
                        autoResizeTextarea(event.target)
                      }}
                      rows={3}
                      placeholder={
                        isZh
                          ? '只有当这份礼物有明显文化暗示时，再补充它可能引发的联想与氛围。'
                          : 'Only add this when the object carries a strong cultural cue that may change the reading.'
                      }
                      className={`${fieldClassName} mt-2.5 min-h-[6rem] resize-none overflow-hidden text-[14px] sm:min-h-[5rem] sm:text-[15px]`}
                    />
                  </div>
                </div>
              )}

              {isTextOnlyRecognition && (
                <p className="text-sm leading-7 text-[#7b746c]">
                  {isZh
                    ? '当前对象稿主要由你手动撰写。后续如果补图，AI 的识别会更细腻。'
                    : 'The current object sheet is primarily authored by you. Adding an image later will make the AI reading more nuanced.'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative border-t border-[rgba(74,63,51,0.1)] bg-[linear-gradient(90deg,rgba(245,248,252,0.88),rgba(250,245,238,0.88))] px-5 py-3.5 sm:px-7 sm:py-4">
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-[48rem]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
              <p className={`mt-2 text-[1.14rem] leading-tight text-[#201a16] ${displayClassName}`}>{checkpointTitle}</p>
              <p className="mt-1.5 text-sm leading-6 text-[#69645f]">{checkpointBody}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 xl:justify-end">
              {shouldShowRecognizeAction && (
                <button
                  type="button"
                  onClick={onRecognize}
                  disabled={!canRecognize || isRecognizing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#24201b] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:w-auto sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  <Sparkles size={12} />
                  {isRecognizing ? (isZh ? `识别中 ${recognizingElapsedSeconds}s` : `Reading ${recognizingElapsedSeconds}s`) : isZh ? '开始识别' : 'Run recognition'}
                </button>
              )}

              {!shouldShowRecognizeAction && canContinue && (
                <button
                  type="button"
                  onClick={onContinue}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#24201b] px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] sm:w-auto sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  {isZh ? '我确认，进入下一步' : 'I confirm, continue'}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
