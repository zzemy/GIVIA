'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import type { Locale } from '@/components/gifting/home/types'

interface PageFeedbackProps {
  isLoading: boolean
  isLoadingRecognition: boolean
  locale: Locale
  recognizingElapsedSeconds: number
  analyzingElapsedSeconds: number
  error: string
}

export function PageFeedback({
  isLoading,
  isLoadingRecognition,
  locale,
  recognizingElapsedSeconds,
  analyzingElapsedSeconds,
  error,
}: PageFeedbackProps) {
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-center"
          >
            <div className="mx-auto h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-100"
                animate={{ x: ['-120%', '320%'] }}
                transition={{ duration: 1.15, ease: 'linear', repeat: Infinity }}
              />
            </div>
            <p className="mt-3 text-sm text-cyan-100/80">
              {isLoadingRecognition
                ? locale === 'zh'
                  ? `正在识别礼物信息，请稍候...（已等待 ${recognizingElapsedSeconds}s）`
                  : `Recognizing gift information... (${recognizingElapsedSeconds}s)`
                : locale === 'zh'
                  ? `正在生成文化分析，网络波动时可能稍有延迟...（已等待 ${analyzingElapsedSeconds}s）`
                  : `Generating cultural analysis... (${analyzingElapsedSeconds}s)`}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {isLoadingRecognition
                ? locale === 'zh'
                  ? recognizingElapsedSeconds >= 12
                    ? '等待时间较长：模型可能返回非结构化内容，系统会自动兜底处理。'
                    : '通常需要 3-12 秒。'
                  : recognizingElapsedSeconds >= 12
                    ? 'Longer wait detected: fallback handling may be triggered for non-structured output.'
                    : 'Typical wait is 3-12 seconds.'
                : locale === 'zh'
                  ? analyzingElapsedSeconds >= 20
                    ? '等待时间较长：请保持页面不关闭，分析仍在继续。'
                    : '通常需要 20-25 秒。'
                  : analyzingElapsedSeconds >= 20
                    ? 'Longer wait detected: keep this page open while analysis continues.'
                    : 'Typical wait is 20-25 seconds.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4"
          >
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-red-400" />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
