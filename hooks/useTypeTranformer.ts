import { DBDish, DBDishCategory, DBMultiLanguageStringProperty } from '@/types/db/dish.db.type'
import { Dish, DishCategory } from '@/types/dish.type'
import { Language } from '@/types/order.type'

export default function useTypeTransformer() {
  const stringToDBMultiLanguageString = (str: string): DBMultiLanguageStringProperty => ({
    de: str,
    en: '',
    it: '',
  })

  const stringArrayToDBMultiLanguageStringArray = (arr: string[]): DBMultiLanguageStringProperty[] =>
    arr.map((element) => stringToDBMultiLanguageString(element))

  const dishToDBDish = (dish: Dish): DBDish => ({
    ...dish,
    name: stringToDBMultiLanguageString(dish.name),
    ingredients: {
      required: stringArrayToDBMultiLanguageStringArray(dish.ingredients.required),
      optional: stringArrayToDBMultiLanguageStringArray(dish.ingredients.optional),
    },
    labels: !dish.labels ? null : stringArrayToDBMultiLanguageStringArray(dish.labels),
    allergies: !dish.allergies ? null : stringArrayToDBMultiLanguageStringArray(dish.allergies),
    description: !dish.description ? null : stringToDBMultiLanguageString(dish.description),
  })

  const dBdishToDish = (dish: DBDish, language: Language): Dish => ({
    ...dish,
    id: dish.id ?? 0,
    name: dish.name[language],
    ingredients: {
      required: dish.ingredients.required.map((ingredient) => ingredient[language]),
      optional: dish.ingredients.optional.map((ingredient) => ingredient[language]),
    },
    labels: !dish.labels ? [] : dish.labels.map((label) => label[language]),
    allergies: !dish.allergies ? [] : dish.allergies.map((allergy) => allergy[language]),
    description: !dish.description ? null : dish.description[language],
  })

  const dishCategoryToDBDishCategory = (dishCategory: DishCategory): DBDishCategory => ({
    ...dishCategory,
    name: stringToDBMultiLanguageString(dishCategory.name),
  })

  return {
    dishCategoryToDBDishCategory,
    dishToDBDish,
    dBdishToDish,
  }
}
