'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { trpc } from '@/trpc/trpcObject'
import superjson from 'superjson'
import type { FC } from 'react'

const getBaseUrl = () => (typeof window !== 'undefined' ? '' : process.env.URL)

export const TrpcProvider: FC<{ children: ReactNode }> = (p) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  )
  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
    </trpc.Provider>
  )
}
