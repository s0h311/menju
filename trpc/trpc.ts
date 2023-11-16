import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({
  transformer: superjson,
})

export const procedure = t.procedure
export const router = t.router
export const mergeRouters = t.mergeRouters
