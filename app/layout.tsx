import './globals.css'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'

const kanit = Kanit({
  weight: '300',
  style: 'normal',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FMSInn',
  description: 'The easiest way to get your food',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={kanit.className}>
        {children}
      </body>
    </html>
  )
}
