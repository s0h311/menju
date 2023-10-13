import { z } from 'zod'
import { zRestaurantId } from '@/types/restaurant.type'
import { zDietType, zNutritions } from '@/types/dish.type'

const zDBMultiLanguageStringProperty = z.object({
  de: z.string().nonempty(),
  en: z.string(),
  it: z.string(),
})

const zDBMultiLanguageStringPropertyOptional = z.object({
  de: z.string(),
  en: z.string(),
  it: z.string(),
})

const zDBIngredients = z.object({
  required: z.array(zDBMultiLanguageStringProperty),
  optional: z.array(zDBMultiLanguageStringProperty),
})

export const zDBDishCategory = z.object({
  id: z.number().optional(),
  priority: z.number().min(0),
  name: zDBMultiLanguageStringProperty,
  picture: z.string().url().nullable(),
  restaurantId: zRestaurantId,
})

export const zDBDish = z.object({
  id: z.number().optional(),
  priority: z.number().min(0),
  name: zDBMultiLanguageStringProperty,
  price: z.number(),
  picture: z.string().url().nullable(),
  categoryId: z.number().min(1),
  ingredients: zDBIngredients,
  labels: z.array(zDBMultiLanguageStringProperty).nullable(),
  allergies: z.array(zDBMultiLanguageStringProperty).nullable(),
  nutritions: zNutritions.nullable(),
  dietType: zDietType.nullable(),
  description: zDBMultiLanguageStringPropertyOptional.nullable(),
  saleStartDate: z.date().nullable(),
  saleEndDate: z.date().nullable(),
  salePrice: z.number().nullable(),
  saleDays: z.array(z.number()),
})

export type DBDish = z.infer<typeof zDBDish>
export type DBDishCategory = z.infer<typeof zDBDishCategory>
export type DBMultiLanguageStringProperty = z.infer<typeof zDBMultiLanguageStringProperty>
