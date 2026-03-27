import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '礼智极意 | Givia',
  description:
    '礼智极意（Givia）是一个跨文化礼赠编辑系统，围绕关系、场景与文化语气，帮助每一份心意更得体地抵达。',
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
