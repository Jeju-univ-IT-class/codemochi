import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '모찌체크 - 제주도 실시간 혼잡도 체크',
  description: '제주도 관광지의 실시간 혼잡도와 주차 정보를 확인하고 제보하세요. 사용자 기반 라이브 가이드.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'mozzi1.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'mozzi1.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'mozzi1.png',
        type: 'image/png',
      },
    ],
    apple: 'mozzi1.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
