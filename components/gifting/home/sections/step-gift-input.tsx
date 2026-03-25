'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GiftInputRecognitionPanel } from '@/components/gifting/home/cards/gift-input-recognition-panel'
import { GiftInputTextEditor } from '@/components/gifting/home/cards/gift-input-text-editor'
import { GiftInputUploadPanel } from '@/components/gifting/home/cards/gift-input-upload-panel'
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

      <GiftInputUploadPanel
        locale={locale}
        recognition={recognition}
        imagePreview={imagePreview}
        selectedFile={selectedFile}
        fileInputRef={fileInputRef}
        shouldHideGiftInputs={shouldHideGiftInputs}
        onFileSelect={onFileSelect}
        onClearSelectedImage={onClearSelectedImage}
        onToggleTextEditor={onToggleTextEditor}
      />

      <div className="my-3 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-600/70" />
        <span>{isZh ? '或' : 'or'}</span>
        <div className="h-px flex-1 bg-slate-600/70" />
      </div>

      <GiftInputTextEditor
        locale={locale}
        shouldHideGiftInputs={shouldHideGiftInputs}
        giftName={giftName}
        giftDescription={giftDescription}
        giftDescriptionRef={giftDescriptionRef}
        onGiftNameChange={onGiftNameChange}
        onGiftDescriptionChange={onGiftDescriptionChange}
        onBeautifyGiftDescription={onBeautifyGiftDescription}
        autoResizeTextarea={autoResizeTextarea}
      />

      <GiftInputRecognitionPanel
        locale={locale}
        recognition={recognition}
        recognitionSource={recognitionSource}
        visionLabel={visionLabel}
        visionDescription={visionDescription}
        visionDescriptionRef={visionDescriptionRef}
        onVisionLabelChange={onVisionLabelChange}
        onVisionDescriptionChange={onVisionDescriptionChange}
        onBeautifyVisionDescription={onBeautifyVisionDescription}
        autoResizeTextarea={autoResizeTextarea}
      />

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
