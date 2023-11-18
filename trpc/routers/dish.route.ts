import { zDBDish } from '@/types/db/dish.db.type'
import { procedure, router } from '../trpc'
import { createDish, deleteDish, updateDish } from '../data/prismaClient'
import { z } from 'zod'

export const dishRouter = router({
  addDish: procedure.input(zDBDish).mutation(async (req) => {
    const { input } = req
    return await createDish(input)
  }),

  updateDish: procedure.input(zDBDish).mutation(async (req) => {
    const { input } = req
    return await updateDish(input)
  }),

  deleteDish: procedure.input(z.number()).mutation(async (req) => {
    const { input: id } = req
    await deleteDish(id)
  }),
})
