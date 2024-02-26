'use server'

import { getDishesByCategoryFromRestaurant } from '@/trpc/data/prismaClient'
import type { DishesByCategory } from '@/types/dish.type'
import type { Language, RestaurantId } from '@/types/order.type'
import logger from '@/utils/logger'

async function getDishesByCategory(restaurantId: RestaurantId, language: Language): Promise<DishesByCategory[]> {
  logger.info('======== getDishesByCategory HIT ========')
  return getDishesByCategoryFromRestaurant(restaurantId, language)
}

export { getDishesByCategory }
