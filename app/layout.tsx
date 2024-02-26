import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import type { ReactNode } from 'react'
import { ReactQueryProvider } from '@/trpc/ReactQueryProvider'

const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Menju',
  description: 'The easiest way to get your food',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryProvider>
      <html lang='en'>
        <body className={`${robotoSerif.className}`}>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ReactQueryProvider>
  )
}
