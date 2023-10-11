import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Einloggen | Menju',
}

type LoginLayoutProps = {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className='grid place-items-center h-screen'>
      <div className='w-[90dvw] xl:w-[70dvw] h-[90dvh] xl:h-[80dvh]'>{children}</div>
    </div>
  )
}
