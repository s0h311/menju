import './globals.css'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { TrpcProvider } from '@/trpc/trpcProvider'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'

const kanit = Kanit({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Menju',
  description: 'The easiest way to get your food',
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <TrpcProvider>
      <html lang='en'>
        <body className={`${kanit.className}`}>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </TrpcProvider>
  )
}
