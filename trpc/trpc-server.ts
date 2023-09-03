import {initTRPC} from '@trpc/server'
import superjson from 'superjson'
import {
 zNewDishCategory,
} from '@/app/types/dish.type'
import { zCart, zLanguageAndRestaurantId} from '@/app/types/order.type'
import {zRegisterCredentials} from '@/app/types/credentials.type'
import { UserResponse} from '@supabase/supabase-js'
import {
  capitalize,
  getMultiLanguageStringProperty
} from "@/trpc/business-domain/dish-service";
import {z} from "zod";
import {createUser} from "@/trpc/data/supabase-client";
import {
  createDishCategory, createOrder,
  createRestaurant,
  deleteDishCategory, getDishesByCategoryFromRestaurant,
  updateDishCategory
} from "@/trpc/data/prisma-client";

const t = initTRPC.create({
  transformer: superjson,
})
export const appRouter = t.router({
  dishesByCategory: t.procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const {
      input: {restaurantId, language},
    } = req
    return await getDishesByCategoryFromRestaurant(restaurantId, language)
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req
    return await createOrder(input);
  }),

  addRestaurant: t.procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    const restaurant = await createRestaurant(input.name)
    return await createUser(input, restaurant)
  }),

  addDishCategory: t.procedure.input(zNewDishCategory).mutation(async (req) => {
    const { input } = req
    const dishCategory = await createDishCategory(input)
    return {
      ...dishCategory,
      name: capitalize(getMultiLanguageStringProperty(dishCategory.name, 'de')),
    }
  }),

  updateDishCategory: t.procedure.input(zNewDishCategory).mutation(async (req) => {
    const { input } = req
    const updatedDishCategory = await updateDishCategory(input);
    return {
      ...updatedDishCategory,
      name: capitalize(getMultiLanguageStringProperty(updatedDishCategory.name, 'de')),
    }
  }),

  deleteDishCategory: t.procedure.input(z.number()).mutation(async (req) => {
    const { input: dishCategoryId } = req
    await deleteDishCategory(dishCategoryId)
  }),
})

export type AppRouter = typeof appRouter
