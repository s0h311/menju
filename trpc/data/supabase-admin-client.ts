import { createClient } from '@supabase/supabase-js'
import { RegisterCredentials } from '@/types/credentials.type'
import { Restaurant } from '@prisma/client'

const supabaseClientAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  { auth: { persistSession: false } }
)

export async function createUser(credentials: RegisterCredentials, restaurant: Restaurant) {
  return supabaseClientAdmin.auth.admin.createUser({
    email: credentials.email,
    password: credentials.password,
    email_confirm: true,
    user_metadata: {
      name: credentials.name,
      restaurantId: restaurant.id,
    },
  })
}
