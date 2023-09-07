import { TrpcProvider } from '@/trpc/trpcProvider'
import { Container } from '@mui/material'

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <Container>{children}</Container>
    </TrpcProvider>
  )
}
