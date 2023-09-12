import { z } from 'zod'
import { zRestaurantId } from '@/types/order.type'
import { zDietType, zNutritions } from '@/types/dish.type'

const zDBMultiLanguageStringProperty = z.object({
  de: z.string().nonempty(),
  en: z.string(),
  it: z.string(),
})

const zDBIngredients = z.object({
  required: z.array(zDBMultiLanguageStringProperty),
  optional: z.array(zDBMultiLanguageStringProperty),
})

export const zDBDishCategory = z.object({
  id: z.number().optional(),
  name: zDBMultiLanguageStringProperty,
  picture: z.string().url().nullish(),
  restaurantId: zRestaurantId,
})

export const zDBDish = z.object({
  id: z.number().optional(),
  name: zDBMultiLanguageStringProperty,
  price: z.number(),
  picture: z.string().url().nullish(),
  categoryId: z.number(),
  ingredients: zDBIngredients,
  labels: z.array(zDBMultiLanguageStringProperty).optional(),
  allergies: z.array(zDBMultiLanguageStringProperty).optional(),
  nutritions: zNutritions.optional(),
  dietType: zDietType.nullish(),
  description: zDBMultiLanguageStringProperty.optional(),
  saleStartDate: z.date().nullish(),
  saleEndDate: z.date().nullish(),
  salePrice: z.number().nullish(),
  saleDays: z.array(z.number()).optional(),
})

export type DBDish = z.infer<typeof zDBDish>
export type DBDishCategory = z.infer<typeof zDBDishCategory>
export type DBMultiLanguageStringProperty = z.infer<typeof zDBMultiLanguageStringProperty>
export type DBIngredients = z.infer<typeof zDBIngredients>
