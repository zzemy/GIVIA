import type { Metadata } from "next"
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'
import jaMessages from '@/messages/ja.json'
import frMessages from '@/messages/fr.json'

const locales = ['zh', 'en', 'ja', 'fr'] as const

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages =
    locale === 'zh'
      ? zhMessages
      : locale === 'ja'
        ? jaMessages
        : locale === 'fr'
          ? frMessages
          : enMessages

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
