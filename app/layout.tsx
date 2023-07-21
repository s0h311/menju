import './globals.css'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { TrpcProvider } from '../trpc/trpc-provider'

const kanit = Kanit({
  weight: '300',
  style: 'normal',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FMSinn',
  description: 'FMSinn',
}

interface RootLayoutProps {
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
