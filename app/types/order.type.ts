import { ZodObject, z } from 'zod'

export const zLanguage = z.enum(['en', 'de', 'it'])
export const zRestaurantId = z.number().int().positive().finite()

export const zCart = z.object({
  table: z.string(),
  positions: z
    .object({
      dishId: z.number(),
      quantity: z.number(),
      leftOutIngredients: z.string().array(),
    })
    .array(),
  paymentMethod: z.enum(['CARD', 'CASH', 'COUPON']),
  isPayed: z.boolean(),
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
export type Cart = z.infer<typeof zCart>
export type LanguageAndRestaurantId = z.infer<typeof zLanguageAndRestaurantId>
