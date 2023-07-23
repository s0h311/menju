import { TrpcProvider } from '@/trpc/trpc-provider'
import { Container } from '@mui/material'

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <Container>{children}</Container>
    </TrpcProvider>
  )
}