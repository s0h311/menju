import { z } from 'zod'
import { zOrderPosition, zOrderStatus } from '../order.type'
import { zRestaurantId, zPaymentMethod } from '../restaurant.type'

export const zDBOrder = z.object({
  id: z.string().optional(),
  table_id: z.string(),
  positions: z.array(zOrderPosition),
  order_status: zOrderStatus,
  payment_method: zPaymentMethod,
  is_payed: z.boolean().nullable(),
  net_total: z.number(),
  vat: z.number().nullable(),
  note: z.string().nullable(),
  restaurant_id: zRestaurantId,
})

export type DBOrder = z.infer<typeof zDBOrder>
