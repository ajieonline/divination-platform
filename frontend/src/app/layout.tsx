import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '灵境占卜 - 探索命运的奥秘',
  description: '灵境占卜是一个集塔罗占卜、星座运势、周易占卜、八字命理于一体的神秘学平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
