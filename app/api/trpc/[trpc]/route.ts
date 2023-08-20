import { FetchCreateContextFnOptions, fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/trpc/trpc-server'

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: (opts: FetchCreateContextFnOptions): object | Promise<object> => ({}),
  })

export const GET = handler
export const POST = handler
