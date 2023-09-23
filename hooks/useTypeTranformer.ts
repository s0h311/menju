import { DBDish, DBDishCategory, DBMultiLanguageStringProperty } from '@/types/db/dish.db.type'
import { Dish, DishCategory } from '@/types/dish.type'

export default function useTypeTransformer() {
  // HELPERS //

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

  const dishCategoryToDBDishCategory = (dishCategory: DishCategory): DBDishCategory => ({
    ...dishCategory,
    name: stringToDBMultiLanguageString(dishCategory.name),
  })

  return {
    dishToDBDish,
    dishCategoryToDBDishCategory,
  }
}
