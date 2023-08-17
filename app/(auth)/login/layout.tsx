import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Einloggen | FMSinn',
}

type LoginLayoutProps = {
  children: React.ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className='grid place-items-center h-screen'>
      <div className='w-[90dvw] xl:w-[70dvw] h-[90dvh] xl:h-[80dvh]'>{children}</div>
    </div>
  )
}
