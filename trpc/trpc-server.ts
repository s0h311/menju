import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { PrismaClient } from '@prisma/client'
import {
  DishesByCategory,
  MultiLanguageStringProperty,
  MultiLanguageArrayProperty,
  Nutrition,
  Ingredient,
} from '@/app/types/dish.type'
import { JSONValue } from 'superjson/dist/types'
import { Language, zCart, zLanguageAndRestaurantId } from '@/app/types/order.type'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()

const getMultiLanguageStringProperty = (property: JSONValue, language: Language): string => {
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageStringProperty
    return data[language]
  }
  return ''
}

const getMultiLanguageArrayProperty = (property: JSONValue, language: Language): string[] => {
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageArrayProperty
    return data[language]
  }
  return []
}

const getIngredients = (property: JSONValue, language: Language, type: 'required' | 'optional'): string[] => {
  if (property && typeof property === 'object') {
    const data = property as Ingredient
    return data[type][language]
  }
  return []
}

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const { input } = req
    const { restaurantId, language } = input

    const categories = await prisma.dishCategory.findMany({ where: { restaurantId } })
    const categoryIds = structuredClone(categories).map((category) => category.id)
    const dishes = await prisma.dish.findMany({ where: { categoryId: { in: categoryIds } } })
    // Can be optimized by removing dishes that are filtered below
    const dishesByCategory: DishesByCategory[] = categories.map((category) => {
      return {
        category: {
          ...category,
          name: getMultiLanguageStringProperty(category.name, language),
        },
        dishes: dishes
          .filter((dish) => dish.categoryId == category.id)
          .map((dish) => ({
            ...dish,
            name: getMultiLanguageStringProperty(dish.name, language),
            requiredIngredients: getIngredients(dish.ingredients, language, 'required'),
            optionalIngredients: getIngredients(dish.ingredients, language, 'optional'),
            labels: getMultiLanguageArrayProperty(dish.labels, language),
            allergies: getMultiLanguageArrayProperty(dish.allergies, language),
            nutritions: dish.nutritions as Nutrition,
            description: getMultiLanguageStringProperty(dish.description, language),
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
