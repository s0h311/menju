import { array, string, z } from 'zod'

export const zAllergy = z.object({
  id: z.number(),
  name: z.string(),
  allergens: z.array(z.string()),
})

export const zNutrition = z.object({
  id: z.number(),
  dish: z.string(), // Unique dishes, not related to entity Dish
  energy: z.number(),
  protein: z.number(),
})

const zMultiLanguageStringProperty = z.object({
  de: z.string(),
  en: z.string(),
  it: z.string(),
})

const zMultiLanguageArrayProperty = z.object({
  de: z.array(z.string()),
  en: z.array(z.string()),
  it: z.array(z.string()),
})

const zIngredient = z.object({
  required: zMultiLanguageArrayProperty,
  optional: zMultiLanguageArrayProperty,
})

export const zDish = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  picture: z.string().nullable(), // URL of the picture
  categoryId: z.number(),
  requiredIngredients: z.array(z.string()),
  optionalIngredients: z.array(z.string()),
  labels: z.array(z.string()),
  allergies: z.array(z.string()),
  nutritions: zNutrition.nullable(),
  type: z.enum(['VEGAN', 'VEGETARIAN', 'PESCATARIAN', 'OMNIVORE']).nullable(),
  description: z.string().nullable(),
  saleStartDate: z.date().nullable(),
  saleEndDate: z.date().nullable(),
  salePrice: z.number().nullable(),
  saleDays: z.array(z.number()),
})

export const zDishCategory = z.object({
  id: z.number(),
  name: z.string(),
  picture: z.string(), // URL of the picture
  restaurantId: z.number(),
})

export const zDishesByCategory = z.object({
  category: zDishCategory,
  dishes: z.array(zDish),
})

export type Allergy = z.infer<typeof zAllergy>
export type Nutrition = z.infer<typeof zNutrition>
export type Dish = z.infer<typeof zDish>
export type DishCategory = z.infer<typeof zDishCategory>
export type DishesByCategory = z.infer<typeof zDishesByCategory>
export type MultiLanguageStringProperty = z.infer<typeof zMultiLanguageStringProperty>
export type MultiLanguageArrayProperty = z.infer<typeof zMultiLanguageArrayProperty>
export type Ingredient = z.infer<typeof zIngredient>
