import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { zDBDish, zDBDishCategory } from '@/types/db/dish.db.type'
import { zCart, zLanguageAndRestaurantId } from '@/types/order.type'
import { zRegisterCredentials } from '@/types/credentials.type'
import { UserResponse } from '@supabase/supabase-js'
import { capitalize, getMultiLanguageStringProperty } from '@/trpc/helpers/dishHelpers'
import { z } from 'zod'
import { createUser } from '@/trpc/data/supabaseAdminClient'
import {
  createDish,
  createDishCategory,
  createOrder,
  createRestaurant,
  deleteDish,
  deleteDishCategory,
  getDishesByCategoryFromRestaurant,
  updateDish,
  updateDishCategory,
} from '@/trpc/data/prismaClient'
import { Restaurant } from '@prisma/client'

const t = initTRPC.create({
  transformer: superjson,
})

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const {
      input: { restaurantId, language },
    } = req
    return await getDishesByCategoryFromRestaurant(restaurantId, language)
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req
    return await createOrder(input)
  }),

  addRestaurant: t.procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    const restaurant: Restaurant = await createRestaurant(input.name)
    return await createUser(input, restaurant)
  }),

  // DISH CATEGORY CRUD //

  addDishCategory: t.procedure.input(zDBDishCategory).mutation(async (req) => {
    const { input } = req
    const dishCategory = await createDishCategory(input)
    return {
      ...dishCategory,
      name: capitalize(getMultiLanguageStringProperty(dishCategory.name, 'de')),
    }
  }),

  updateDishCategory: t.procedure.input(zDBDishCategory).mutation(async (req) => {
    const { input } = req
    return await updateDishCategory(input)
  }),

  deleteDishCategory: t.procedure.input(z.number()).mutation(async (req) => {
    const { input: dishCategoryId } = req
    await deleteDishCategory(dishCategoryId)
  }),

  // DISH CRUD //

  addDish: t.procedure.input(zDBDish).mutation(async (req) => {
    const { input } = req
    return await createDish(input)
  }),

  updateDish: t.procedure.input(zDBDish).mutation(async (req) => {
    const { input } = req
    return await updateDish(input)
  }),

  deleteDish: t.procedure.input(z.number()).mutation(async (req) => {
    const { input: id } = req
    await deleteDish(id)
  }),
})

export type AppRouter = typeof appRouter
