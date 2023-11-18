import { zRegisterCredentials } from '@/types/credentials.type'
import { procedure, router } from '../trpc'
import { createRestaurant } from '../data/prismaClient'
import type { UserResponse } from '@supabase/supabase-js'
import { zRegisterCredentialsAdminUser } from '@/types/adminUser.type'
import { createAdminUser, createUser, getAdminUsers } from '../data/supabaseAdminClient'
import type { Restaurant } from '@prisma/client'

export const addminRouter = router({
  addRestaurant: procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    const restaurant: Restaurant = await createRestaurant({
      name: input.name,
      abbreviation: input.abbreviation,
    })
    return await createUser(input, restaurant)
  }),

  adminUsers: procedure.query(async () => await getAdminUsers()),

  addAdminUser: procedure.input(zRegisterCredentialsAdminUser).mutation(async (req): Promise<UserResponse> => {
    const { input } = req
    return await createAdminUser(input)
  }),
})
