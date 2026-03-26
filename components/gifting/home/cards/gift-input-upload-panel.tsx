'use client'

import React from 'react'
import Image from 'next/image'
import { ImagePlus, PencilLine, Trash2, Upload } from 'lucide-react'
import { homeButton, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import { cn } from '@/lib/utils'
import type { Locale, RecognitionResult } from '@/components/gifting/home/types'

interface GiftInputUploadPanelProps {
  locale: Locale
  recognition: RecognitionResult | null
  imagePreview: string
  selectedFile: File | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  shouldHideGiftInputs: boolean
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearSelectedImage: () => void
  onToggleTextEditor: () => void
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

export function GiftInputUploadPanel({
  locale,
  recognition,
  imagePreview,
  selectedFile,
  fileInputRef,
  shouldHideGiftInputs,
  onFileSelect,
  onClearSelectedImage,
  onToggleTextEditor,
}: GiftInputUploadPanelProps) {
  const isZh = locale === 'zh'

  return (
    <div className="mb-6">
      <div className={`p-3 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)] ${homeSurface.inset}`}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'group w-full cursor-pointer overflow-hidden rounded-[1.1rem] border border-dashed border-white/16 text-left transition-all hover:border-[#e7d2af]/26 hover:bg-white/[0.03]',
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
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#e7d2af]/72">
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
                  <div className={`${homeSurface.glassStrip} px-3 py-1 text-[11px]`}>
                    {selectedFile ? formatFileSize(selectedFile.size) : null}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-[#e7d2af]/18 bg-[#e7d2af]/8 text-[#f3ddba]">
                <ImagePlus size={26} />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-50">{isZh ? '上传礼物图片' : 'Upload gift image'}</p>
                <p className={`mt-1 text-sm leading-6 ${homeText.body}`}>
                  {isZh
                    ? '支持用图片触发识别，也支持后续继续修改名称、描述和标签。'
                    : 'Start from an image, then keep editing the name, description, and label after recognition.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-300/82">
                <span className={homeSurface.glassStrip}>JPG / PNG / WEBP</span>
                <span className={homeSurface.glassStrip}>
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
            className={`${homeButton.primary} px-3 py-2 text-xs sm:justify-start sm:py-1.5`}
          >
            <Upload size={14} />
            {imagePreview ? (isZh ? '更换图片' : 'Replace image') : isZh ? '选择图片' : 'Choose image'}
          </button>

          {imagePreview && (
            <button
              type="button"
              onClick={onClearSelectedImage}
              className={`${homeButton.secondary} px-3 py-2 text-xs sm:justify-start sm:py-1.5`}
            >
              <Trash2 size={14} />
              {isZh ? '移除图片' : 'Remove image'}
            </button>
          )}

          {selectedFile && recognition && (
            <button
              type="button"
              onClick={onToggleTextEditor}
              className={`${homeSurface.glassStrip} justify-center px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/[0.06] sm:justify-start sm:py-1.5`}
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
            <span className={`text-[11px] ${homeText.meta}`}>
              {isZh
                ? '上传图片只影响识别输入，不会锁定你的后续修改。'
                : 'The image only seeds recognition and never locks your later edits.'}
            </span>
          )}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
    </div>
  )
}
