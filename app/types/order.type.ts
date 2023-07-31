import { z } from 'zod'

export const zLanguage = z.enum(['en', 'de', 'it'])
export const zRestaurantId = z.number().int().positive().finite()

const zOrderPosition = z.object({
  dishId: z.number(),
  quantity: z.number(),
  leftOutIngredients: z.string().array(),
})

export const zCart = z.object({
  table: z.string(),
  positions: z.array(zOrderPosition),
  paymentMethod: z.enum(['CARD', 'CASH', 'COUPON']),
  isPayed: z.boolean().optional(),
  netTotal: z.number(),
  vat: z.number().optional(),
  note: z.string().max(100).optional(),
  restaurantId: zRestaurantId,
})

export const zLanguageAndRestaurantId = z.object({
  restaurantId: zRestaurantId,
  language: zLanguage,
})

export type Language = z.infer<typeof zLanguage>
export type RestaurantId = z.infer<typeof zRestaurantId>
export type OrderPosition = z.infer<typeof zOrderPosition>
export type Cart = z.infer<typeof zCart>
export type LanguageAndRestaurantId = z.infer<typeof zLanguageAndRestaurantId>
