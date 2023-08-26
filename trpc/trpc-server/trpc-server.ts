import {initTRPC} from '@trpc/server'
import superjson from 'superjson'
import {PrismaClient} from '@prisma/client'
import {
  DishesByCategory,
  Nutrition,
} from '@/app/types/dish.type'
import { zCart, zLanguageAndRestaurantId} from '@/app/types/order.type'
import {zRegisterCredentials} from '@/app/types/credentials.type'
import {createClient, UserResponse} from '@supabase/supabase-js'
import {
  getIngredients,
  getMultiLanguageArrayProperty,
  getMultiLanguageStringProperty
} from "@/trpc/trpc-server/business-domain/trpc-dish";

const t = initTRPC.create({
  transformer: superjson,
})

const prismaClient = new PrismaClient()
const supabaseClientAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

export const appRouter = t.router({
  dishesByCategory: t.procedure.input(zLanguageAndRestaurantId).query(async (req) => {
    const {
      input: { restaurantId, language },
    } = req

    const categories = await prismaClient.dishCategory.findMany({ where: { restaurantId } })
    const categoryIds = structuredClone(categories).map((category) => category.id)
    const dishes = await prismaClient.dish.findMany({ where: { categoryId: { in: categoryIds } } })
    // Can be optimized by removing dishes that are filtered below
    const dishesByCategory: DishesByCategory[] = categories.map((category) => ({
      category: {
        ...category,
        name: getMultiLanguageStringProperty(category.name, language),
      },
      dishes: dishes
        .filter((dish) => dish.categoryId == category.id)
        .map((dish) => ({
          ...dish,
          name: getMultiLanguageStringProperty(dish.name, language),
          requiredIngredients: getIngredients(dish.ingredients, language, 'required'),
          optionalIngredients: getIngredients(dish.ingredients, language, 'optional'),
          labels: getMultiLanguageArrayProperty(dish.labels, language),
          allergies: getMultiLanguageArrayProperty(dish.allergies, language),
          nutritions: dish.nutritions as Nutrition,
          description: getMultiLanguageStringProperty(dish.description, language),
        })),
    }))
    return dishesByCategory
  }),

  createOrder: t.procedure.input(zCart).mutation(async (req) => {
    const { input } = req
    return prismaClient.order.create({data: {...input}});
  }),

  addRestaurant: t.procedure.input(zRegisterCredentials).mutation(async (req): Promise<UserResponse> => {
    const { input: credentials } = req

    const restaurant = await prismaClient.restaurant.create({ data: { name: credentials.name } })

    return supabaseClientAdmin.auth.admin.createUser({
      email: credentials.email,
      password: credentials.password,
      email_confirm: true,
      user_metadata: {
        name: credentials.name,
        restaurantId: restaurant.id,
      },
    })
  }),
})

export type AppRouter = typeof appRouter
