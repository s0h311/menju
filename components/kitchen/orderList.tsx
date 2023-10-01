'use client'

import useTypeTransformer from '@/hooks/useTypeTranformer'
import { DBOrder } from '@/types/db/order.db.type'
import { Order } from '@/types/order.type'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

type OrderListProps = {
  initialOrders: DBOrder[]
}

export default function OrderList({ initialOrders }: OrderListProps) {
  const supabaseClient = createClientComponentClient()
  const { dbOrderToOrder } = useTypeTransformer()

  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const currentOrders = initialOrders.map((dbOrder) => dbOrderToOrder(dbOrder))
    setOrders(currentOrders)
  }, [setOrders, initialOrders, dbOrderToOrder])

  useEffect(() => {
    const ordersChannel = supabaseClient
      .channel('ordersChannel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order',
        },
        (payload) => setOrders((orders) => [...orders, dbOrderToOrder(payload.new as DBOrder)])
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(ordersChannel)
    }
  }, [supabaseClient, setOrders, dbOrderToOrder])

  return (
    <ul className='grid grid-cols-3 gap-5'>
      {orders.map((order) => (
        <li
          key={order.id}
          className='grid gap-5 border p-5 rounded-lg shadow h-fit'
        >
          <div className='flex gap-4 relative'>
            <p className='bg-yellow-400 rounded px-2 w-fit '>{order.id}</p>

            {/* Zahlungeingang */}
            <p className={`rounded px-2 w-fit ${order.isPayed ? 'bg-green-300' : 'bg-red-300'}`}>
              {order.isPayed ? 'BEZAHLT' : 'NICHT BEZAHLT'}
            </p>

            {/* Zahlungsmethode */}
            <p>{order.paymentMethod}</p>

            {/* Table */}
            {order.table && <p className='absolute right-0'>TISCH {order.table}</p>}
          </div>

          {/* Positions */}
          {order.positions.map((position) => (
            <div
              key={position.dish.id + position.leftOutIngredients.join('')}
              className='border p-5 rounded-lg shadow'
            >
              {/* Quantity + Dish Name */}
              <div className='flex gap-2 bg-green-400 rounded px-2'>
                <p>{position.quantity}X</p>
                <p>{position.dish.name}</p>
              </div>
              {position.leftOutIngredients.length > 0 && (
                <p className='bg-red-400 rounded px-2'>{position.leftOutIngredients}</p>
              )}
            </div>
          ))}

          {order.note && (
            <div>
              <h3>Anmerkung</h3>
              <p className='text-slate-500'>{order.note}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
