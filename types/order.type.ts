import { z } from 'zod'
import { zDish } from './dish.type'
import {zPaymentMethod, zRestaurantId} from "@/types/restaurant.type";

export const zLanguage = z.enum(['en', 'de', 'it'])

export const zOrderPosition = z.object({
  dish: zDish,
  quantity: z.number(),
  leftOutIngredients: z.string().array(),
})

export const zOrderStatus = z.enum(['RECEIVED', 'DONE', 'REJECTED'])

export const zCart = z.object({
  tableId: z.string(),
  positions: z.array(zOrderPosition),
  orderStatus: zOrderStatus,
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
export type OrderStatus = z.infer<typeof zOrderStatus>
export type Cart = z.infer<typeof zCart>
export type Order = Cart & { id?: string }
export type LanguageAndRestaurantId = z.infer<typeof zLanguageAndRestaurantId>
export type PaymentMethod = z.infer<typeof zPaymentMethod>
