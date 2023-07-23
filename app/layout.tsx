import './globals.css'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { TrpcProvider } from '@/trpc/trpc-provider'

const kanit = Kanit({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FMSInn',
  description: 'The easiest way to get your food',
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <TrpcProvider>
      <html lang='en'>
        <body className={kanit.className}>{children}</body>
      </html>
    </TrpcProvider>
  )
}
