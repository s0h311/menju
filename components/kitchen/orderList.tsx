'use client'

import { Order } from '@/types/order.type'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

type OrderListProps = {
  initialOrders: Order[]
}

export default function OrderList({ initialOrders }: OrderListProps) {
  const supabaseClient = createClientComponentClient()

  const [orders, setOrders] = useState<Order[]>(initialOrders)

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
        (payload) => setOrders((orders) => [...orders, payload.new as Order])
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(ordersChannel)
    }
  }, [supabaseClient, setOrders])

  return (
    <ul className='grid grid-cols-3 gap-5'>
      {orders.map((order) => (
        <li
          key={order.id}
          className='space-y-5 border p-5 rounded-lg shadow'
        >
          {/* Table */}
          <p className='bg-yellow-400 rounded px-2'>{order.table}</p>

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

          {/* Additional Info */}
          <div className='flex gap-24 items-center'>
            <div>
              <p className='text-slate-500'>Zahlung</p>
              <p className='text-slate-500'>Zahlungsmethode</p>
              <p className='text-slate-500'>Bemerkung</p>
              <p className='text-slate-500'>ID</p>
            </div>
            <div>
              <p>{order.isPayed}</p>
              <p>{order.paymentMethod}</p>
              <p>{order.note}</p>
              <p>{order.id}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
