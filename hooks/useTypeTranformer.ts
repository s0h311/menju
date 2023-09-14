import { DBDish, DBMultiLanguageStringProperty } from '@/types/db/dish.db.type'
import { Dish } from '@/types/dish.type'

export default function useTypeTransformer() {
  // HELPERS //

  const stringToDBMultiLanguageString = (str: string): DBMultiLanguageStringProperty => ({
    de: str,
    en: '',
    it: '',
  })

  const dishToDBDish = (dish: Dish): DBDish => ({
    ...dish,
    name: { de: dish.name, en: '', it: '' },
    ingredients: {
      required: dish.ingredients.required.map((ingredient) => stringToDBMultiLanguageString(ingredient)),
      optional: dish.ingredients.optional.map((ingredient) => stringToDBMultiLanguageString(ingredient)),
    },
    labels: dish.labels.map((label) => stringToDBMultiLanguageString(label)),
    allergies: dish.allergies.map((allergy) => stringToDBMultiLanguageString(allergy)),
    description: dish.description ? stringToDBMultiLanguageString(dish.description) : null,
  })

  return {
    dishToDBDish,
  }
}
