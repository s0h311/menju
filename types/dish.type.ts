import { z } from 'zod'

export const zRestaurantId = z.number().int().positive().finite() //TODO auch duplicate in order.type vorhanden

export const zAllergy = z.object({
  id: z.number(),
  name: z.string(),
  allergens: z.array(z.string()),
})

export const zNutritions = z.object({
  energy: z.number(),
  protein: z.number(),
})

const zMultiLanguageStringProperty = z.object({
  de: z.string().nonempty(),
  en: z.string(),
  it: z.string(),
})

const zPIngredients = z.object({
  required: z.array(zMultiLanguageStringProperty),
  optional: z.array(zMultiLanguageStringProperty),
})

const zIngredients = z.object({
  required: z.array(z.string()),
  optional: z.array(z.string()),
})

const zDietType = z.enum(['VEGAN', 'VEGETARIAN', 'PESCATARIAN', 'OMNIVORE'])

export const zDish = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  picture: z.string().url().nullable(),
  categoryId: z.number(),
  ingredients: zIngredients,
  labels: z.array(z.string()),
  allergies: z.array(z.string()),
  nutritions: zNutritions.nullable(),
  dietType: zDietType.nullable(),
  description: z.string().nullable(),
  saleStartDate: z.date().nullable(),
  saleEndDate: z.date().nullable(),
  salePrice: z.number().nullable(),
  saleDays: z.array(z.number()),
})

export const zDishCategory = z.object({
  id: z.number(),
  name: z.string(),
  picture: z.string().url().nullable(),
  restaurantId: z.number(),
})

export const zDishesByCategory = z.object({
  category: zDishCategory,
  dishes: z.array(zDish),
})

export const zNewDishCategory = z.object({
  id: z.number().optional(),
  name: zMultiLanguageStringProperty,
  picture: z.string().url().nullish(),
  restaurantId: zRestaurantId,
})

export const zNewDish = z.object({
  id: z.number().optional(),
  name: zMultiLanguageStringProperty,
  price: z.number(),
  picture: z.string().url().nullish(),
  categoryId: z.number(),
  ingredients: zPIngredients,
  labels: z.array(zMultiLanguageStringProperty).optional(),
  allergies: z.array(zMultiLanguageStringProperty).optional(),
  nutritions: zNutritions.optional(),
  dietType: zDietType.nullish(),
  description: zMultiLanguageStringProperty.optional(),
  saleStartDate: z.date().nullish(),
  saleEndDate: z.date().nullish(),
  salePrice: z.number().nullish(),
  saleDays: z.array(z.number()).optional(),
})

export type Allergy = z.infer<typeof zAllergy>
export type Nutritions = z.infer<typeof zNutritions>
export type Dish = z.infer<typeof zDish>
export type NewDish = z.infer<typeof zNewDish>
export type DishCategory = z.infer<typeof zDishCategory>
export type NewDishCategory = z.infer<typeof zNewDishCategory>
export type DishesByCategory = z.infer<typeof zDishesByCategory>
export type MultiLanguageStringProperty = z.infer<typeof zMultiLanguageStringProperty>
export type PIngredients = z.infer<typeof zPIngredients>
export type Ingredients = z.infer<typeof zIngredients>
export type DietType = z.infer<typeof zDietType>
