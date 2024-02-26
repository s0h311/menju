import { Container } from '@mui/material'
import type { ReactNode } from 'react'

export default function MenuLayout({ children }: { children: ReactNode }) {
  return <Container>{children}</Container>
}
