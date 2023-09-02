import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { Dish as pDish, PrismaClient } from '@prisma/client'
import {
  DishesByCategory,
  MultiLanguageStringProperty,
  Nutritions,
  Ingredients,
  zNewDishCategory,
  zNewDish,
  Dish,
} from '@/app/types/dish.type'
import { JSONValue } from 'superjson/dist/types'
import { Language, zCart, zLanguageAndRestaurantId } from '@/app/types/order.type'
import { zRegisterCredentials } from '@/app/types/credentials.type'
import { UserResponse, createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { JsonValue } from '@prisma/client/runtime/library'

const t = initTRPC.create({
  transformer: superjson,
})

const prisma = new PrismaClient()
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

const getMultiLanguageStringProperty = (property: JSONValue, language: Language): string => {
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageStringProperty
    return data[language]
  }
  return ''
}

const getAllMultiLanguageStringProperties = (property: JSONValue, language: Language): string[] => {
  const res: string[] = []
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageStringProperty[]
    data.forEach((element) => res.push(getMultiLanguageStringProperty(element, language)))
  }
  return res
}

const getIngredients = (property: JSONValue, language: Language): Ingredients => {
  const res: Ingredients = {
    required: [],
    optional: [],
  }
  if (property && typeof property === 'object') {
    const data = property as Ingredients
    data['required'].forEach((ingredient) => res.required.push(getMultiLanguageStringProperty(ingredient, language)))
    data['optional'].forEach((ingredient) => res.optional.push(getMultiLanguageStringProperty(ingredient, language)))
  }
  return res
}

const getNutritions = (property: JsonValue): Nutritions => {
  const res: Nutritions = {
    energy: 0,
    protein: 0,
  }
  if (property && typeof property === 'object') {
    const data = property as Nutritions & { id: number; dish: string }
    res.energy = data.energy
    res.protein = data.protein
  }
  return res
}

const mapDish = (dish: pDish, language: Language): Dish => ({
  ...dish,
  name: getMultiLanguageStringProperty(dish.name, language),
  ingredients: getIngredients(dish.ingredients, language),
  labels: getAllMultiLanguageStringProperties(dish.labels, language),
  allergies: getAllMultiLanguageStringProperties(dish.allergies, language),
  nutritions: getNutritions(dish.nutritions),
  description: getMultiLanguageStringProperty(dish.description, language),
})

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

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
        name: capitalize(getMultiLanguageStringProperty(category.name, language)),
      },
      dishes: dishes.filter((dish) => dish.categoryId == category.id).map((dish) => mapDish(dish, language)),
    }))
    return dishesByCategory
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req
    const order = await prisma.order.create({ data: { ...input } })
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

  addDishCategory: t.procedure.input(zNewDishCategory).mutation(async (req) => {
    const { input } = req
    const dishCategory = await prisma.dishCategory.create({
      data: {
        ...input,
      },
    })
    return {
      ...dishCategory,
      name: capitalize(getMultiLanguageStringProperty(dishCategory.name, 'de')),
    }
  }),

  updateDishCategory: t.procedure.input(zNewDishCategory).mutation(async (req) => {
    const { input } = req
    const updatedDishCategory = await prisma.dishCategory.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
      },
    })
    return {
      ...updatedDishCategory,
      name: capitalize(getMultiLanguageStringProperty(updatedDishCategory.name, 'de')),
    }
  }),

  deleteDishCategory: t.procedure.input(z.number()).mutation(async (req) => {
    const { input: id } = req
    await prisma.dishCategory.delete({
      where: {
        id,
      },
    })
  }),

  addDish: t.procedure.input(zNewDish).mutation(async (req) => {
    const { input } = req

    const dish = await prisma.dish.create({
      data: {
        ...input,
      },
    })
    return mapDish(dish, 'de')
  }),

  updateDish: t.procedure.input(zNewDish).mutation(async (req) => {
    const { input } = req

    const dish = await prisma.dish.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
      },
    })
    return mapDish(dish, 'de')
  }),

  deleteDish: t.procedure.input(z.number()).mutation(async (req) => {
    const { input: id } = req
    await prisma.dish.delete({
      where: {
        id,
      },
    })
  }),
})

export type AppRouter = typeof appRouter
