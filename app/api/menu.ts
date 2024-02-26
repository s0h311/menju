'use server'

import {
  createDishCategory as pCreateDishCategory,
  getDishesByCategoryFromRestaurant,
  updateDishCategory as pUpdateDishCategory,
} from '@/trpc/data/prismaClient'
import type { DBDishCategory } from '@/types/db/dish.db.type'
import type { DishesByCategory } from '@/types/dish.type'
import type { Language, RestaurantId } from '@/types/order.type'
import logger from '@/utils/logger'
import type { DishCategory } from '@prisma/client'

async function getDishesByCategory(restaurantId: RestaurantId, language: Language): Promise<DishesByCategory[]> {
  logger.info('======== getDishesByCategory HIT ========')
  return getDishesByCategoryFromRestaurant(restaurantId, language)
}

type DishCategoryMutationResponse = { data: DishCategory; error: null } | { data: null; error: unknown }

async function addDishCategory(dishCategory: DBDishCategory): Promise<DishCategoryMutationResponse> {
  try {
    const data = await pCreateDishCategory(dishCategory)
    return { data, error: null }
  } catch (error) {
    logger.error('Error adding dish category', JSON.stringify(error))
    return { data: null, error }
  }
}

async function updateDishCategory(dishCategory: DBDishCategory): Promise<DishCategoryMutationResponse> {
  try {
    const data = await pUpdateDishCategory(dishCategory)
    return { data, error: null }
  } catch (error) {
    logger.error('Error updating dish category', JSON.stringify(error))
    return { data: null, error }
  }
}

export { getDishesByCategory, addDishCategory, updateDishCategory }
