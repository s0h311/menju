import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@/trpc/trpcServer'
export const trpc = createTRPCReact<AppRouter>()
