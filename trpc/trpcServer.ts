import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { addminRouter } from './routes/admin.route'
import { dishRouter } from './routes/dish.route'
import { dishCategoryRouter } from './routes/dishCategory.route'
import { menuRouter } from './routes/menu.route'
import { restaurantRouter } from './routes/restaurant.route'
import { mergeRouters } from './trpc'

export const prismaClient = new PrismaClient()

export const supabaseClientAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

export const appRouter = mergeRouters(addminRouter, dishRouter, dishCategoryRouter, menuRouter, restaurantRouter)

export type AppRouter = typeof appRouter
