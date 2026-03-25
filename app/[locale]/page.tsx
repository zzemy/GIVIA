'use client'

import { AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import { HomeHeroSection } from '@/components/gifting/home/sections/home-hero-section'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'
import { PageFeedback } from '@/components/gifting/home/sections/page-feedback'
import { ResultsSection } from '@/components/gifting/home/sections/results-section'
import { useHomePageController } from '@/components/gifting/home/hooks/use-home-page-controller'
import { WorkflowPanels } from '@/components/gifting/home/sections/workflow-panels'
import type { Locale } from '@/components/gifting/home/types'

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const routeLocale: Locale = params?.locale === 'en' ? 'en' : 'zh'

  const { isZh, heroProps, workflowPanelsProps, feedbackProps, resultsProps } = useHomePageController(routeLocale)

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-[#061225] text-white ${isZh ? 'font-sans-zh' : ''}`}>
      <HomeBackground />

      <main className="relative mx-auto max-w-[1480px] px-5 pb-12 pt-0 xl:px-8">
        <HomeHeroSection {...heroProps} />
        <WorkflowPanels {...workflowPanelsProps} />
        <PageFeedback {...feedbackProps} />

        <AnimatePresence>
          {resultsProps && <ResultsSection {...resultsProps} />}
        </AnimatePresence>
      </main>
    </div>
  )
}
