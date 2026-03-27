import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Givia',
  description:
    'Givia is a cross-cultural gifting editorial system that helps each gesture arrive with greater tact through relationship, setting, and cultural tone.',
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
