import { JSONValue } from 'superjson/dist/types'
import { Language } from '@/types/order.type'
import { Dish, Ingredients, MultiLanguageStringProperty, Nutritions } from '@/types/dish.type'
import { Dish as pDish } from '@prisma/client'

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

export const getMultiLanguageStringProperty = (property: JSONValue, language: Language): string => {
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageStringProperty
    return data[language]
  }
  return ''
}

export const getAllMultiLanguageStringProperties = (property: JSONValue, language: Language): string[] => {
  const res: string[] = []
  if (property && typeof property === 'object') {
    const data = property as MultiLanguageStringProperty[]
    data.forEach((element) => res.push(getMultiLanguageStringProperty(element, language)))
  }
  return res
}

export const getNutritions = (property: JSONValue): Nutritions => {
  const res: Nutritions = {
    energy: 0,
    protein: 0,
  }
  if (property && typeof property === 'object') {
    const data = property as Nutritions & { id: number; dish: string }
    res.energy = data.energy
    res.protein = data.protein
  }
  return res
}

export const getIngredients = (property: JSONValue, language: Language): Ingredients => {
  const res: Ingredients = {
    required: [],
    optional: [],
  }
  if (property && typeof property === 'object') {
    const data = property as Ingredients
    data['required'].forEach((ingredient) => res.required.push(getMultiLanguageStringProperty(ingredient, language)))
    data['optional'].forEach((ingredient) => res.optional.push(getMultiLanguageStringProperty(ingredient, language)))
  }
  return res
}

export const mapDish = (dish: pDish, language: Language): Dish => ({
  ...dish,
  name: getMultiLanguageStringProperty(dish.name, language),
  ingredients: getIngredients(dish.ingredients, language),
  labels: getAllMultiLanguageStringProperties(dish.labels, language),
  allergies: getAllMultiLanguageStringProperties(dish.allergies, language),
  nutritions: getNutritions(dish.nutritions),
  description: getMultiLanguageStringProperty(dish.description, language),
})
