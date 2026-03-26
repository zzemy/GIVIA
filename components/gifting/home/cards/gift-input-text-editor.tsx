'use client'

import React from 'react'
import { homeButton, homeControl, homeSurface, homeText } from '@/components/gifting/home/home-design-tokens'
import type { Locale } from '@/components/gifting/home/types'

interface GiftInputTextEditorProps {
  locale: Locale
  shouldHideGiftInputs: boolean
  giftName: string
  giftDescription: string
  giftDescriptionRef: React.RefObject<HTMLTextAreaElement | null>
  onGiftNameChange: (value: string) => void
  onGiftDescriptionChange: (value: string) => void
  onBeautifyGiftDescription: () => void
  autoResizeTextarea: (element: HTMLTextAreaElement | null) => void
}

export function GiftInputTextEditor({
  locale,
  shouldHideGiftInputs,
  giftName,
  giftDescription,
  giftDescriptionRef,
  onGiftNameChange,
  onGiftDescriptionChange,
  onBeautifyGiftDescription,
  autoResizeTextarea,
}: GiftInputTextEditorProps) {
  const isZh = locale === 'zh'

  if (shouldHideGiftInputs) {
    return (
      <div className={`px-3 py-2 text-xs leading-5 ${homeSurface.quiet} ${homeText.muted}`}>
        {isZh
          ? '图片已识别。你仍然可以用上方“继续编辑文字”来补充或修改礼物名称、描述和标签。'
          : 'The image has been recognized. Use “Continue editing text” above to keep refining the name, description, and label.'}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="gift-name" className={`mb-2 block text-xs font-medium ${homeText.muted}`}>
          {isZh ? '礼物名称（必填其一：名称或图片）' : 'Gift name (required if no image)'}
        </label>
        <input
          id="gift-name"
          type="text"
          value={giftName}
          onChange={event => onGiftNameChange(event.target.value)}
          placeholder={isZh ? '例如：钢笔、香水、茶具' : 'e.g. fountain pen, perfume, tea set'}
          className={homeControl.input}
        />
      </div>

      <div className={`p-3 sm:p-4 ${homeSurface.quiet}`}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="gift-description" className={`block text-xs font-medium ${homeText.muted}`}>
            {isZh ? '礼物描述（选填）' : 'Gift description (optional)'}
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
          rows={3}
          placeholder={
            isZh ? '例如：黑色金属笔身、简约商务风、礼盒包装' : 'e.g. black metal body, minimal business style, boxed package'
          }
          className={`${homeControl.input} resize-none overflow-hidden leading-6`}
        />
      </div>
    </div>
  )
}
