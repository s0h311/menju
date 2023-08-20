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
import { zRegisterCredentials } from '@/app/types/credentials.type'
import { UserResponse, createClient } from '@supabase/supabase-js'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE || '')

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
    const {
      input: { restaurantId, language },
    } = req

    const categories = await prisma.dishCategory.findMany({ where: { restaurantId } })
    const categoryIds = structuredClone(categories).map((category) => category.id)
    const dishes = await prisma.dish.findMany({ where: { categoryId: { in: categoryIds } } })
    // Can be optimized by removing dishes that are filtered below
    const dishesByCategory: DishesByCategory[] = categories.map((category) => ({
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
          nutritions: { ...(dish.nutritions as Nutrition) },
          description: getMultiLanguageStringProperty(dish.description, language),
        })),
    }))
    return dishesByCategory
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req

    const order = await prisma.order.create({
      data: {
        ...input,
        positions: input.positions.map((position) => ({
          ...position,
          dish: position.dish.id,
        })),
      },
    })
    return order
  }),

  addRestaurant: t.procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input: credentials } = req

    const restaurant = await prisma.restaurant.create({ data: { name: credentials.name } })

    return supabaseAdmin.auth.admin.createUser({
      email: credentials.email,
      password: credentials.password,
      email_confirm: true,
      user_metadata: {
        name: credentials.name,
        restaurantId: restaurant.id,
      },
    })
  }),
})

export type AppRouter = typeof appRouter
