import OrderList from '@/components/kitchen/orderList'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Orders() {
  const superbaseClient = createServerComponentClient({ cookies })
  const { data } = await superbaseClient.from('order').select()

  return <OrderList initialOrders={data ?? []} />
}
