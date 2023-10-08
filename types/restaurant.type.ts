import { z } from 'zod'
import { zPaymentMethod, zRestaurantId } from './order.type'

const zCartType = z.enum(['cannotOrder', 'canOrder'])

export const zFeatures = z.object({
  isFilterBarEnabled: z.boolean().default(true),
  cartType: zCartType.default('canOrder'),
  enabledPaymentMethods: z.array(zPaymentMethod).default([]),
})

export const zRestaurant = z.object({
  id: zRestaurantId,
  name: z.string().min(3).max(20),
  abbreviation: z.string().min(1).max(5),
  features: zFeatures,
})

export type CartType = z.infer<typeof zCartType>
export type Features = z.infer<typeof zFeatures>
export type Restaurant = z.infer<typeof zRestaurant>

export const defaultFeatures: Features = {
  isFilterBarEnabled: true,
  cartType: 'canOrder',
  enabledPaymentMethods: ['CARD', 'CASH'],
}
