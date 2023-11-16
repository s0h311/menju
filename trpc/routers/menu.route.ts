import { zLanguageAndRestaurantId } from '@/types/order.type'
import { procedure, router } from '../trpc'
import { getDishesByCategoryFromRestaurant } from '../data/prismaClient'
import { zDBOrder } from '@/types/db/order.db.type'
import { createOrder } from '../data/supabaseAdminClient'

export const menuRouter = router({
  dishesByCategory: procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const {
      input: { restaurantId, language },
    } = req
    return await getDishesByCategoryFromRestaurant(restaurantId, language)
  }),

  createOrder: procedure.input(zDBOrder).mutation((req) => {
    const { input } = req
    return createOrder(input)
  }),
})
