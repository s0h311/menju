import { zColors, zFeatures, zRestaurantId } from '@/types/restaurant.type'
import { procedure, router } from '../trpc'
import { getRestaurant, updateColors, updateFeatures } from '../data/prismaClient'
import { z } from 'zod'

export const restaurantRouter = router({
  restaurant: procedure.input(zRestaurantId).query(async (req) => {
    const { input: restaurantId } = req
    return await getRestaurant(restaurantId)
  }),

  updateFeatures: procedure
    .input(z.object({ restaurantId: zRestaurantId, features: zFeatures }))
    .mutation(async (req) => {
      const {
        input: { restaurantId, features },
      } = req
      return await updateFeatures(restaurantId, features)
    }),

  updateColors: procedure.input(z.object({ restaurantId: zRestaurantId, colors: zColors })).mutation(async (req) => {
    const {
      input: { restaurantId, colors },
    } = req
    return await updateColors(restaurantId, colors)
  }),
})
