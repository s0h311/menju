import { z } from 'zod'

export const zPaymentMethod = z.enum(['CARD', 'CASH', 'COUPON'])
export const zRestaurantId = z.number().int().positive().finite()
const zCartType = z.enum(['cannotOrder', 'canOrder'])
const zColor = z.string().regex(/^#/)

export const zFeatures = z.object({
  isFilterBarEnabled: z.boolean().default(true),
  cartType: zCartType.default('canOrder'),
  enabledPaymentMethods: z.array(zPaymentMethod).default([]),
})

export const zColors = z.object({
  primary: zColor.default('#7eaa92'),
  secondary: zColor.default('#caddc3'),
  accent: zColor.default('#f7e987'),
  textColor: zColor.default('#445069'),
})

export const zRestaurant = z.object({
  id: zRestaurantId,
  name: z.string().min(3).max(20),
  abbreviation: z.string().min(1).max(5),
  features: zFeatures,
  colors: zColors,
})

export type CartType = z.infer<typeof zCartType>
export type Features = z.infer<typeof zFeatures>
export type Colors = z.infer<typeof zColors>
export type Restaurant = z.infer<typeof zRestaurant>

export const defaultFeatures: Features = {
  isFilterBarEnabled: true,
  cartType: 'canOrder',
  enabledPaymentMethods: ['CARD', 'CASH'],
}
