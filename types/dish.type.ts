import { z } from 'zod'

export const zAllergy = z.object({
  id: z.number(),
  name: z.string(),
  allergens: z.array(z.string()),
})

export const zNutritions = z.object({
  energy: z.number(),
  protein: z.number(),
})

export const zIngredients = z.object({
  required: z.array(z.string()),
  optional: z.array(z.string()),
})

export const zDietType = z.enum(['VEGAN', 'VEGETARIAN', 'PESCATARIAN', 'OMNIVORE'])

export const zDish = z.object({
  id: z.number(),
  priority: z.number(),
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
  priority: z.number(),
  name: z.string(),
  picture: z.string().url().nullable(),
  restaurantId: z.number(),
})

export const zDishesByCategory = z.object({
  category: zDishCategory,
  dishes: z.array(zDish),
})

export type Nutritions = z.infer<typeof zNutritions>
export type Dish = z.infer<typeof zDish>
export type DishCategory = z.infer<typeof zDishCategory>
export type DishesByCategory = z.infer<typeof zDishesByCategory>
export type Ingredients = z.infer<typeof zIngredients>
export type DietType = z.infer<typeof zDietType>
