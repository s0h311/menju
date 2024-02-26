import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/ReactQueryProvider.tsx/trpcServer'

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: (): object | Promise<object> => ({}),
  })

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
