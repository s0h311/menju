import { TrpcProvider } from '@/trpc/trpcProvider'
import { Container } from '@mui/material'
import { ReactNode } from 'react'

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <TrpcProvider>
      <Container>{children}</Container>
    </TrpcProvider>
  )
}
