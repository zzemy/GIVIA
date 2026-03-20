import type { Metadata } from "next"
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'

const locales = ['zh', 'en'] as const

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = locale === 'en' ? enMessages : zhMessages

  return {
    title: messages.workflow.title,
    description: messages.workflow.subtitle,
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
