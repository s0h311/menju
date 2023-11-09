import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/trpc/trpcServer'
export const trpc = createTRPCReact<AppRouter>()
