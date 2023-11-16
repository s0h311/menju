import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { addminRouter } from './routers/admin.route'
import { dishRouter } from './routers/dish.route'
import { dishCategoryRouter } from './routers/dishCategory.route'
import { menuRouter } from './routers/menu.route'
import { restaurantRouter } from './routers/restaurant.route'
import { mergeRouters } from './trpc'

export const prismaClient = new PrismaClient()

export const supabaseClientAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

export const appRouter = mergeRouters(addminRouter, dishRouter, dishCategoryRouter, menuRouter, restaurantRouter)

export type AppRouter = typeof appRouter
