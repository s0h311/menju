import OrderList from '@/components/kitchen/orderList'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Orders() {
  const superbaseClient = createServerComponentClient({ cookies })

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

  if (userError) {
    console.error('[KitchenSettings - get user]', userError)
  }

  if (orderError) {
    console.error('[Orders - fetch orders]', orderError)
  }

  if (restaurantError) {
    console.error('[Orders - fetch features]', restaurantError)
  }

  return (
    <>
      {restaurantData && restaurantData.features.cartType === 'cannotOrder' ? (
        <p>Die Bestellfunktion ist nicht freigeschaltet</p>
      ) : (
        <OrderList initialOrders={orderData ?? []} />
      )}
    </>
  )
}
