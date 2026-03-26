'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'
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
            className={`mt-8 px-5 py-5 text-center ${homeSurface.secondary}`}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e7d2af]/78">
              {locale === 'zh' ? '分析进行中' : 'ANALYSIS IN PROGRESS'}
            </p>
            <div className="mx-auto mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#e7d2af] via-sky-300 to-cyan-100"
                animate={{ x: ['-120%', '320%'] }}
                transition={{ duration: 1.15, ease: 'linear', repeat: Infinity }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-100">
              {isLoadingRecognition
                ? locale === 'zh'
                  ? `正在整理礼物信息，请稍候…（已等待 ${recognizingElapsedSeconds}s）`
                  : `Preparing the gift signal... (${recognizingElapsedSeconds}s)`
                : locale === 'zh'
                  ? `正在生成送礼判断与文化建议…（已等待 ${analyzingElapsedSeconds}s）`
                  : `Building the cultural recommendation... (${analyzingElapsedSeconds}s)`}
            </p>
            <p className="mt-1 text-xs text-slate-300/70">
              {isLoadingRecognition
                ? locale === 'zh'
                  ? recognizingElapsedSeconds >= 12
                    ? '等待略久，但系统仍会继续整理并自动处理非结构化返回。'
                    : '通常需要 3-12 秒。'
                  : recognizingElapsedSeconds >= 12
                    ? 'This is taking a little longer, but fallback handling is still protecting the flow.'
                    : 'Typical wait is 3-12 seconds.'
                : locale === 'zh'
                  ? analyzingElapsedSeconds >= 20
                    ? '等待略久，请保持页面开启，分析仍在继续。'
                    : '通常需要 20-25 秒。'
                  : analyzingElapsedSeconds >= 20
                    ? 'This is taking a little longer; keep the page open while the recommendation finishes.'
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
            className="mt-8 flex items-start gap-3 rounded-[1.4rem] border border-red-400/30 bg-[rgba(127,29,29,0.24)] p-4 backdrop-blur-md"
          >
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-red-400" />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
