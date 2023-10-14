import type { RegisterCredentials } from '@/types/credentials.type'
import type { Restaurant } from '@prisma/client'
import type { AdminUser, RegisterCredentialsAdminUser } from '@/types/adminUser.type'
import type { DBOrder } from '@/types/db/order.db.type'
import { supabaseClientAdmin } from '../trpcServer'
import type { UserResponse } from '@supabase/supabase-js'

export async function createUser(credentials: RegisterCredentials, restaurant: Restaurant): Promise<UserResponse> {
  const res = await supabaseClientAdmin.auth.admin.createUser({
    email: credentials.email,
    password: credentials.password,
    email_confirm: true,
    user_metadata: {
      name: credentials.name,
      restaurantId: restaurant.id,
    },
  })

  const { data, error } = res

  if (data.user) {
    await supabaseClientAdmin
      .from('restaurant')
      .update({ user_id: data.user.id })
      .eq('id', data.user.user_metadata['restaurantId'])
  }

  if (error) {
    console.error(error)
  }

  return res
}

export async function createAdminUser(credentials: RegisterCredentialsAdminUser) {
  const { data: userData, error: userInsertError } = await supabaseClientAdmin.auth.admin.createUser({
    email: credentials.email,
    password: credentials.password,
    email_confirm: true,
    user_metadata: {
      name: credentials.name,
    },
  })

  if (userInsertError) return { data: userData, error: userInsertError }

  await supabaseClientAdmin.rpc('update_user_role', {
    role: credentials.role === 'Admin' ? 'app_admin' : credentials.role === 'Super Admin' ? 'app_superadmin' : 'norole',
    userid: userData.user?.id,
  })

  return { data: userData, error: userInsertError }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data: rawAdminUsers } = await supabaseClientAdmin
    .from('users')
    .select()
    .or('role.eq.app_admin,role.eq.app_superadmin')

  return (
    rawAdminUsers?.map((admin) => ({
      id: admin.id,
      name: admin.raw_user_meta_data['name'],
      email: admin.email || '',
      role: admin.role == 'app_admin' ? 'Admin' : 'Super Admin',
    })) || []
  )
}

export const createOrder = async (order: DBOrder) => supabaseClientAdmin.rpc('create_order', order) // DATABASE FUNCTION
