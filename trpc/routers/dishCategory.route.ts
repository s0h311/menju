import { zDBDishCategory } from '@/types/db/dish.db.type'
import { router, procedure } from '../trpc'
import { createDishCategory, deleteDishCategory, updateDishCategory } from '../data/prismaClient'
import { capitalize, getMultiLanguageStringProperty } from '../helpers/dishHelpers'
import { z } from 'zod'

export const dishCategoryRouter = router({
  addDishCategory: procedure.input(zDBDishCategory).mutation(async (req) => {
    const { input } = req
    const dishCategory = await createDishCategory(input)
    const object = {
      ...dishCategory,
      name: capitalize(getMultiLanguageStringProperty(dishCategory.name, 'de')),
    }
    return object
  }),

  updateDishCategory: procedure.input(zDBDishCategory).mutation(async (req) => {
    const { input } = req
    return await updateDishCategory(input)
  }),

  deleteDishCategory: procedure.input(z.number()).mutation(async (req) => {
    const { input: dishCategoryId } = req
    await deleteDishCategory(dishCategoryId)
  }),
})
