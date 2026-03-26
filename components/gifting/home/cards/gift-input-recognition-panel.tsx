'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { homeButton, homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
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
    .replace(/[\s,，。.!！?？;；:：、'"“”‘’\-_/\()[\]{}<>《》]/g, '')
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
          className={`mb-6 p-4 sm:p-5 ${homeSurface.quiet} border-[#e7d2af]/14 bg-[#e7d2af]/[0.045]`}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full border border-[#e7d2af]/18 bg-[#e7d2af]/8 p-2 text-[#f3ddba]">
              <CheckCircle size={16} className="flex-shrink-0" />
            </div>
            <div className="flex-1">
              {(() => {
                const recognizedDisplay = locale === 'zh' ? recognition.itemZh : recognition.itemEn
                const detectedDisplay = (visionLabel || recognizedDisplay).trim()
                const shouldShowDetectedLabel =
                  normalizeForCompare(detectedDisplay) !== normalizeForCompare(recognizedDisplay)

                return (
                  <>
                    <p className="mb-2 text-sm text-slate-300">
                      {locale === 'zh' ? '识别物件:' : 'Recognized item:'}{' '}
                      <span className="font-semibold text-[#f3ddba]">{recognizedDisplay}</span>
                    </p>
                    <div className={`space-y-1 text-xs ${homeText.meta}`}>
                      <p>
                        {locale === 'zh' ? '类别:' : 'Category:'} {recognition.category}
                      </p>
                      {shouldShowDetectedLabel && (
                        <p>
                          {locale === 'zh' ? '识别标签:' : 'Detected label:'}{' '}
                          <span className="text-slate-200">{detectedDisplay}</span>
                        </p>
                      )}
                      <p>
                        {locale === 'zh' ? '置信度:' : 'Confidence:'} {(recognition.confidence * 100).toFixed(0)}%
                      </p>
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

              <div className="mt-4 space-y-3 border-t border-white/8 pt-4">
                <p className={`text-[11px] ${homeText.meta}`}>
                  {locale === 'zh' ? '识别结果可手动修正，分析会使用你修改后的内容。' : 'Recognition outputs are editable before analysis.'}
                </p>
                <div className={`p-3 ${homeSurface.inset}`}>
                  <p className={`mb-2 text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
                    {locale === 'zh' ? '识别标签' : 'Detected label'}
                  </p>
                  <input
                    value={visionLabel}
                    onChange={event => onVisionLabelChange(event.target.value)}
                    placeholder={locale === 'zh' ? '可修改识别标签' : 'Edit detected label'}
                    className={`${homeControl.input} text-sm`}
                  />
                </div>
                <div className={`p-3 ${homeSurface.inset}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className={`text-[11px] uppercase tracking-[0.14em] ${homeText.meta}`}>
                      {locale === 'zh' ? '礼物描述' : 'Gift description'}
                    </p>
                    <button
                      type="button"
                      onClick={onBeautifyVisionDescription}
                      disabled={!visionDescription.trim()}
                      className={`${homeButton.secondary} px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-45`}
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
                    className={`${homeControl.input} resize-none overflow-hidden text-sm leading-6`}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
