import { TrpcProvider } from '../../trpc/trpc-provider'

export default function EssenLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <div className='w-[100dvw] h-[100dvh] grid place-items-center'>{children}</div>
    </TrpcProvider>
  )
}
