import ManageDishes from '@/components/kitchen/manageDishes'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function KitchenDishes() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.auth.getUser()
  const restaurantId = data.user?.user_metadata['restaurantId']

  if (error) {
    console.error(error)
  }

  return <ManageDishes restaurantId={restaurantId} />
}
