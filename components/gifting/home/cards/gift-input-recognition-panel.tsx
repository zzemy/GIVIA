'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import type { Locale, RecognitionResult, RecognitionSource } from '@/components/gifting/home/types'

interface GiftInputRecognitionPanelProps {
  locale: Locale
  recognition: RecognitionResult | null
  recognitionSource: RecognitionSource | null
  visionLabel: string
  visionDescription: string
  visionDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  onVisionLabelChange: (value: string) => void
  onVisionDescriptionChange: (value: string) => void
  onBeautifyVisionDescription: () => void
  autoResizeTextarea: (element: HTMLTextAreaElement | null) => void
}

const normalizeForCompare = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s,，。.!！?？;；:：、'"“”‘’\-_/\\()[\]{}<>《》]/g, '')
    .trim()

export function GiftInputRecognitionPanel({
  locale,
  recognition,
  recognitionSource,
  visionLabel,
  visionDescription,
  visionDescriptionRef,
  onVisionLabelChange,
  onVisionDescriptionChange,
  onBeautifyVisionDescription,
  autoResizeTextarea,
}: GiftInputRecognitionPanelProps) {
  return (
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
  )
}
