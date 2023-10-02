import OrderList from '@/components/kitchen/orderList'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Orders() {
  const superbaseClient = createServerComponentClient({ cookies })
  const { data, error } = await superbaseClient.from('order').select()

  console.error(error)

  return <OrderList initialOrders={data ?? []} />
}
