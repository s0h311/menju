import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import { PrismaClient } from '@prisma/client'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(z.number()).query(async (req) => {
    const { input: restaurantId } = req
    const categories = await prisma.dishCategory.findMany({ where: { restaurantId } })
    const categoryIds = structuredClone(categories).map((category) => category.id)
    const dishes = await prisma.dish.findMany({ where: { categoryId: { in: categoryIds } } })
    // Can be optimized by removing dishes that are filtered below
    const dishesByCategory = categories.map((category) => {
      return {
        category,
        dishes: dishes.filter((dish) => dish.categoryId == category.id),
      }
    })
    return dishesByCategory
  }),
})

export type AppRouter = typeof appRouter
