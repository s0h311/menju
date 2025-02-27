import OrderList from '@/components/kitchen/orderList'
import logger from '@/utils/logger'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Orders() {
  const cookieStore = cookies()
  const superbaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )

  const { data: userData, error: userError } = await superbaseClient.auth.getUser()

  const { data: orderData, error: orderError } = await superbaseClient
    .from('order')
    .select()
    .eq('order_status', 'RECEIVED')

  const { data: restaurantData, error: restaurantError } = await superbaseClient
    .from('restaurant')
    .select('features')
    .eq('user_id', userData.user?.id)
    .single()

  const restaurantId = userData.user?.user_metadata['restaurantId']

  if (userError) {
    logger.error(userError.message, 'Orders - get user')
  }

  if (orderError) {
    logger.error(orderError.message, 'Orders - fetch orders')
  }

  if (restaurantError) {
    logger.error(restaurantError.message, 'Orders - fetch features')
  }

  return (
    <>
      {restaurantData && restaurantData.features.cartType === 'cannotOrder' ? (
        <p>Die Bestellfunktion ist nicht freigeschaltet</p>
      ) : (
        <OrderList
          initialOrders={orderData ?? []}
          restaurantId={restaurantId}
        />
      )}
    </>
  )
}
