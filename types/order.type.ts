import { z } from 'zod'
import { zDish } from './dish.type'

export const zLanguage = z.enum(['en', 'de', 'it'])
export const zRestaurantId = z.number().int().positive().finite()

const zOrderPosition = z.object({
  dish: zDish,
  quantity: z.number(),
  leftOutIngredients: z.string().array(),
})

const zPaymentMethod = z.enum(['CARD', 'CASH', 'COUPON'])

export const zCart = z.object({
  table: z.string(),
  positions: z.array(zOrderPosition),
  paymentMethod: zPaymentMethod,
  isPayed: z.boolean().nullable(),
  netTotal: z.number(),
  vat: z.number().nullable(),
  note: z.string().max(100).nullable(),
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
export type PaymentMethod = z.infer<typeof zPaymentMethod>
