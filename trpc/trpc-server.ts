import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson, { SuperJSON } from 'superjson'
import { PrismaClient } from '@prisma/client'
import { zCart, zDishesByCategory } from '@/app/types/order.types'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(zDishesByCategory).query(async (req) => {
    const { input } = req
    const { restaurantId, language } = input

    const categories = await prisma.dishCategory.findMany({ where: { restaurantId } })
    const categoryIds = structuredClone(categories).map((category) => category.id)
    const dishes = await prisma.dish.findMany({ where: { categoryId: { in: categoryIds } } })
    // Can be optimized by removing dishes that are filtered below
    const dishesByCategory = categories.map((category) => {
      return {
        category: {
          ...category,
          //@ts-ignore
          name: category.name[language],
        },
        dishes: dishes
          .filter((dish) => dish.categoryId == category.id)
          .map((dish) => ({
            ...dish,
            //@ts-ignore
            name: dish.name[language],
            //@ts-ignore
            ingredients: dish.ingredients[language],
          })),
      }
    })
    return dishesByCategory
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req
    const order = await prisma.order.create({ data: { ...input } })
    return order
  }),
})

export type AppRouter = typeof appRouter
