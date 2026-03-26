import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Givia | Light Editorial High-End Gifting',
  description:
    'A cross-cultural gifting experience rebuilt with bright editorial storytelling, human context, and high-end international brand direction.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  )
}
