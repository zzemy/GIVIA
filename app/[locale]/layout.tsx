import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MobileAppShell } from '@/components/gifting/mobile/mobile-app-shell'
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'

const locales = ['zh', 'en'] as const

type SupportedLocale = (typeof locales)[number]

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locales.includes(locale as SupportedLocale)
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const messages = locale === 'zh' ? zhMessages : enMessages

  return {
    title: messages.workflow.title,
    description: messages.workflow.subtitle,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  return <MobileAppShell locale={locale}>{children}</MobileAppShell>
}
