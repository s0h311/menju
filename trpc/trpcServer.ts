import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { zDBDish, zDBDishCategory } from '@/types/db/dish.db.type'
import { zLanguageAndRestaurantId } from '@/types/order.type'
import { zRegisterCredentials } from '@/types/credentials.type'
import type { UserResponse } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { capitalize, getMultiLanguageStringProperty } from '@/trpc/helpers/dishHelpers'
import { z } from 'zod'
import { createAdminUser, createUser, getAdminUsers, createOrder } from '@/trpc/data/supabaseAdminClient'
import {
  createDish,
  createDishCategory,
  createRestaurant,
  deleteDish,
  deleteDishCategory,
  getDishesByCategoryFromRestaurant,
  getRestaurant,
  updateColors,
  updateDish,
  updateDishCategory,
  updateFeatures,
} from '@/trpc/data/prismaClient'
import type { Restaurant } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { zRegisterCredentialsAdminUser } from '@/types/adminUser.type'
import { zDBOrder } from '@/types/db/order.db.type'
import { zColors, zRestaurantId } from '@/types/restaurant.type'
import { zFeatures } from '@/types/restaurant.type'

const t = initTRPC.create({
  transformer: superjson,
})

export const prismaClient = new PrismaClient()

export const supabaseClientAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

export const appRouter = t.router({
  restaurant: t.procedure.input(zRestaurantId).query(async (req) => {
    const { input: restaurantId } = req
    return await getRestaurant(restaurantId)
  }),

  updateFeatures: t.procedure
    .input(z.object({ restaurantId: zRestaurantId, features: zFeatures }))
    .mutation(async (req) => {
      const {
        input: { restaurantId, features },
      } = req
      return await updateFeatures(restaurantId, features)
    }),

  updateColors: t.procedure.input(z.object({ restaurantId: zRestaurantId, colors: zColors })).mutation(async (req) => {
    const {
      input: { restaurantId, colors },
    } = req
    return await updateColors(restaurantId, colors)
  }),

  dishesByCategory: t.procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const {
      input: { restaurantId, language },
    } = req
    return await getDishesByCategoryFromRestaurant(restaurantId, language)
  }),

  createOrder: t.procedure.input(zDBOrder).mutation((req) => {
    const { input } = req
    return createOrder(input)
  }),

  // DISH CATEGORY CRUD //

  addDishCategory: t.procedure.input(zDBDishCategory).mutation(async (req) => {
    const { input } = req
    const dishCategory = await createDishCategory(input)
    const object = {
      ...dishCategory,
      name: capitalize(getMultiLanguageStringProperty(dishCategory.name, 'de')),
    }
    return object
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

  // ADMIN CRUD //

  addRestaurant: t.procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    const restaurant: Restaurant = await createRestaurant({
      name: input.name,
      abbreviation: input.abbreviation,
    })
    return await createUser(input, restaurant)
  }),

  adminUsers: t.procedure.query(async () => await getAdminUsers()),

  addAdminUser: t.procedure.input(zRegisterCredentialsAdminUser).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    return await createAdminUser(input)
  }),
})

export type AppRouter = typeof appRouter
