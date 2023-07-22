import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson, { SuperJSON } from 'superjson'
import { PrismaClient } from '@prisma/client'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()

const dishesByCategoryInput = z.object({
  restaurantId: z.number(),
  language: z.enum(['en', 'de', 'it']),
})

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(dishesByCategoryInput).query(async (req) => {
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
    console.log(dishesByCategory)
    return dishesByCategory
  }),
})

export type AppRouter = typeof appRouter
