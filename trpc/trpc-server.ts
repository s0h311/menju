import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import { PrismaClient } from '@prisma/client'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()

export const appRouter = t.router({
  userById: t.procedure.input(z.number()).query((req) => {
    const { input } = req
    return prisma.essen.findMany()
  }),
})

export type AppRouter = typeof appRouter
