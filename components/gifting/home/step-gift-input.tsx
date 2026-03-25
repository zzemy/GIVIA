'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, CheckCircle, ImagePlus, PencilLine, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { withBasePath } from '@/lib/asset-path'
import { cn } from '@/lib/utils'
import type { Locale, RecognitionResult, RecognitionSource } from '@/components/gifting/home/types'

interface StepGiftInputProps {
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

function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`
  }

  const units = ['KB', 'MB', 'GB']
  let size = sizeInBytes / 1024
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 || unitIndex > 0 ? 1 : 2)} ${units[unitIndex]}`
}

const normalizeForCompare = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s,，。.!！?？;；:：、'"“”‘’\-_/\\()[\]{}<>《》]/g, '')
    .trim()

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-2xl border border-cyan-200/20 bg-[#14243b]/90 p-4 backdrop-blur-md transition-colors hover:border-cyan-200/35 sm:p-6"
    >
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div>
          <h2 className="mb-1.5 text-lg font-bold sm:mb-2 sm:text-xl">
            {isZh ? '第一步：上传图片或输入礼物' : 'Step 1: Upload Image or Type the Gift'}
          </h2>
          <p className="text-xs text-gray-400 sm:text-sm">
            {isZh
              ? '支持图片识别，也支持直接输入礼物名称或场景描述。'
              : 'Use either image recognition or direct text input for the gift item.'}
          </p>
        </div>
        <Image src={withBasePath('/brand/step-vision.svg')} alt="vision step" width={36} height={36} />
      </div>

      <div className="mb-6">
        <div className="rounded-[1.4rem] border border-cyan-200/18 bg-[#10233d]/72 p-3 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'group w-full cursor-pointer overflow-hidden rounded-[1.1rem] border border-dashed border-cyan-200/28 text-left transition-all hover:border-cyan-200/55 hover:bg-cyan-200/5',
              imagePreview ? 'relative aspect-[4/3] bg-slate-950/70 p-0' : 'min-h-[12rem] p-5 sm:min-h-[16rem] sm:p-8',
            )}
          >
            {imagePreview ? (
              <>
                <div className="relative h-full w-full">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04101d]/96 via-[#04101d]/32 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/72">
                        {isZh ? '当前识别图片' : 'Current reference image'}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-50">
                        {selectedFile?.name ?? (isZh ? '已上传图片' : 'Uploaded image')}
                      </p>
                      <p className="mt-1 text-xs text-slate-300/86">
                        {recognition
                          ? isZh
                            ? '识别后仍可继续手动修改名称、标签和描述。'
                            : 'You can still edit the name, label, and description after recognition.'
                          : isZh
                            ? '点击图片可更换，下面可继续补充礼物文字信息。'
                            : 'Click the image to replace it, then keep refining the text details below.'}
                      </p>
                    </div>
                    <div className="rounded-full border border-cyan-100/20 bg-[#071726]/72 px-3 py-1 text-[11px] text-cyan-50/88">
                      {selectedFile ? formatFileSize(selectedFile.size) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
                  <ImagePlus size={26} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-50">{isZh ? '上传礼物图片' : 'Upload gift image'}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300/88">
                    {isZh
                      ? '支持用图片触发识别，也支持后续继续修改名称、描述和标签。'
                      : 'Start from an image, then keep editing the name, description, and label after recognition.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300/82">
                  <span className="rounded-full border border-cyan-100/14 bg-cyan-100/8 px-3 py-1">JPG / PNG / WEBP</span>
                  <span className="rounded-full border border-cyan-100/14 bg-cyan-100/8 px-3 py-1">
                    {isZh ? '支持替换与移除' : 'Replaceable and removable'}
                  </span>
                </div>
              </div>
            )}
          </button>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/22 bg-cyan-300/12 px-3 py-2 text-xs font-medium text-cyan-50 transition hover:border-cyan-200/38 hover:bg-cyan-300/18 sm:justify-start sm:py-1.5"
            >
              <Upload size={14} />
              {imagePreview ? (isZh ? '更换图片' : 'Replace image') : isZh ? '选择图片' : 'Choose image'}
            </button>

            {imagePreview && (
              <button
                type="button"
                onClick={onClearSelectedImage}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-400/18 bg-slate-200/6 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-300/34 hover:bg-slate-200/12 sm:justify-start sm:py-1.5"
              >
                <Trash2 size={14} />
                {isZh ? '移除图片' : 'Remove image'}
              </button>
            )}

            {selectedFile && recognition && (
              <button
                type="button"
                onClick={onToggleTextEditor}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200/18 bg-slate-200/6 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-200/38 hover:bg-slate-200/10 sm:justify-start sm:py-1.5"
              >
                <PencilLine size={14} />
                {shouldHideGiftInputs
                  ? isZh
                    ? '继续编辑文字'
                    : 'Continue editing text'
                  : isZh
                    ? '收起文字编辑'
                    : 'Collapse text editor'}
              </button>
            )}

            {selectedFile && (
              <span className="text-[11px] text-slate-400">
                {isZh
                  ? '上传图片只影响识别输入，不会锁定你的后续修改。'
                  : 'The image only seeds recognition and never locks your later edits.'}
              </span>
            )}
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />

        <div className="my-3 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-600/70" />
          <span>{isZh ? '或' : 'or'}</span>
          <div className="h-px flex-1 bg-slate-600/70" />
        </div>

        {shouldHideGiftInputs ? (
          <div className="rounded-xl border border-cyan-200/12 bg-[#0f1f35]/68 px-3 py-2 text-xs leading-5 text-slate-400">
            {isZh
              ? '图片已识别。你仍然可以用上方“继续编辑文字”来补充或修改礼物名称、描述和标签。'
              : 'The image has been recognized. Use “Continue editing text” above to keep refining the name, description, and label.'}
          </div>
        ) : (
          <>
            <label htmlFor="gift-name" className="mb-2 block text-xs font-medium text-slate-300">
              {isZh ? '礼物名称（必填其一：名称或图片）' : 'Gift name (required if no image)'}
            </label>
            <input
              id="gift-name"
              type="text"
              value={giftName}
              onChange={event => onGiftNameChange(event.target.value)}
              placeholder={isZh ? '例如：钢笔、香水、茶具' : 'e.g. fountain pen, perfume, tea set'}
              className="w-full rounded-xl border border-cyan-200/20 bg-[#0f1f35] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-200/45 focus:outline-none"
            />

            <div className="mb-2 mt-3 flex items-center justify-between">
              <label htmlFor="gift-description" className="block text-xs font-medium text-slate-300">
                {isZh ? '礼物描述（选填）' : 'Gift description (optional)'}
              </label>
              <button
                type="button"
                onClick={onBeautifyGiftDescription}
                disabled={!giftDescription.trim()}
                className="text-[11px] font-medium text-cyan-200/90 transition hover:text-cyan-100 disabled:cursor-not-allowed disabled:text-slate-500"
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
              rows={3}
              placeholder={
                isZh ? '例如：黑色金属笔身、简约商务风、礼盒包装' : 'e.g. black metal body, minimal business style, boxed package'
              }
              className="w-full resize-none overflow-hidden rounded-xl border border-cyan-200/20 bg-[#0f1f35] px-3 py-2 text-sm leading-6 text-slate-100 placeholder:text-slate-400 focus:border-cyan-200/45 focus:outline-none"
            />
          </>
        )}
      </div>

      <AnimatePresence>
        {recognition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-lg border border-sky-300/30 bg-sky-500/10 p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-sky-300" />
              <div className="flex-1">
                {(() => {
                  const recognizedDisplay = locale === 'zh' ? recognition.itemZh : recognition.itemEn
                  const detectedDisplay = (visionLabel || recognizedDisplay).trim()
                  const shouldShowDetectedLabel =
                    normalizeForCompare(detectedDisplay) !== normalizeForCompare(recognizedDisplay)

                  return (
                    <>
                      <p className="mb-2 text-sm text-gray-300">
                        {locale === 'zh' ? '识别物件:' : 'Recognized item:'}{' '}
                        <span className="font-semibold text-sky-200">{recognizedDisplay}</span>
                      </p>
                      <div className="space-y-1 text-xs text-gray-400">
                        <p>{locale === 'zh' ? '类别:' : 'Category:'} {recognition.category}</p>
                        {shouldShowDetectedLabel && (
                          <p>
                            {locale === 'zh' ? '识别标签:' : 'Detected label:'}{' '}
                            <span className="text-slate-200">{detectedDisplay}</span>
                          </p>
                        )}
                        <p>{locale === 'zh' ? '置信度:' : 'Confidence:'} {(recognition.confidence * 100).toFixed(0)}%</p>
                        <p className="text-[11px] text-slate-400">
                          {recognitionSource === 'aliyun-dashscope-text'
                            ? locale === 'zh'
                              ? '说明：该数值来自 AI 文本识别阶段，仅表示识别可信度。'
                              : 'Note: this value comes from AI text recognition confidence only.'
                            : locale === 'zh'
                              ? '说明：该数值来自 AI 图像识别阶段，仅表示识别可信度，最终建议会结合全部输入上下文。'
                              : 'Note: this value comes from model recognition confidence only; final advice uses full input context.'}
                        </p>
                      </div>
                    </>
                  )
                })()}

                <div className="mt-3 space-y-2 border-t border-slate-600/40 pt-3">
                  <p className="text-[11px] text-slate-400">
                    {locale === 'zh' ? '识别结果可手动修正，分析会使用你修改后的内容。' : 'Recognition outputs are editable before analysis.'}
                  </p>
                  <input
                    value={visionLabel}
                    onChange={event => onVisionLabelChange(event.target.value)}
                    placeholder={locale === 'zh' ? '可修改识别标签' : 'Edit detected label'}
                    className="w-full rounded-lg border border-cyan-200/20 bg-[#0f1f35] px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-cyan-200/45 focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      {locale === 'zh' ? '礼物描述（可直接修改识别结果）' : 'Gift description (editable recognition result)'}
                    </p>
                    <button
                      type="button"
                      onClick={onBeautifyVisionDescription}
                      disabled={!visionDescription.trim()}
                      className="text-[11px] font-medium text-cyan-200/90 transition hover:text-cyan-100 disabled:cursor-not-allowed disabled:text-slate-500"
                    >
                      {locale === 'zh' ? '润色描述' : 'Polish'}
                    </button>
                  </div>
                  <textarea
                    ref={visionDescriptionRef}
                    value={visionDescription}
                    onChange={event => {
                      onVisionDescriptionChange(event.target.value)
                      autoResizeTextarea(event.target)
                    }}
                    rows={2}
                    placeholder={locale === 'zh' ? '可直接修改识别输出的礼物描述' : 'Edit recognized gift description'}
                    className="w-full resize-none overflow-hidden rounded-lg border border-cyan-200/20 bg-[#0f1f35] px-2 py-1.5 text-xs leading-5 text-slate-100 placeholder:text-slate-400 focus:border-cyan-200/45 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={onRecognize}
        disabled={!canRecognize || isRecognizing}
        className={`w-full rounded-lg py-2 font-semibold transition-all ${
          isRecognizing
            ? 'bg-slate-700/70 text-slate-300'
            : 'border border-cyan-200/45 bg-cyan-300/14 text-cyan-100 hover:bg-cyan-300/22'
        }`}
      >
        {isRecognizing ? (
          <>
            <Sparkles size={16} className="mr-2 inline animate-spin" />
            {locale === 'zh' ? `识别中... ${recognizingElapsedSeconds}s` : `Recognizing... ${recognizingElapsedSeconds}s`}
          </>
        ) : (
          <>
            <Sparkles size={16} className="mr-2 inline" />
            {isTextOnlyRecognition
              ? locale === 'zh'
                ? '确认礼物信息'
                : 'Confirm Gift Info'
              : locale === 'zh'
                ? 'AI 识别物件'
                : 'AI Recognize'}
          </>
        )}
      </Button>
    </motion.div>
  )
}
