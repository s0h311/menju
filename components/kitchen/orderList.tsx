'use client'

import useTypeTransformer from '@/hooks/useTypeTranformer'
import type { DBOrder } from '@/types/db/order.db.type'
import type { Order, OrderStatus } from '@/types/order.type'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { Check } from '@mui/icons-material'
import { Button } from '@mui/material'

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
          filter: 'order_status=eq.RECEIVED',
        },
        (payload) => setOrders((orders) => [...orders, dbOrderToOrder(payload.new as DBOrder)])
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(ordersChannel)
    }
  }, [supabaseClient, setOrders, dbOrderToOrder])

  const updateStatus = async (orderId: string, status: Omit<OrderStatus, 'RECEIVED'>) => {
    const { error } = await supabaseClient.from('order').update({ order_status: status }).eq('id', orderId)
    if (error) {
      // TODO handle Error
      return
    }
    setOrders((orders) => orders.filter((order) => order.id !== orderId))
  }

  return (
    <ul className='grid lg:grid-cols-3 gap-5 grid-cols-2'>
      {orders.map((order) => (
        <li
          key={order.id}
          className='grid gap-5 border p-5 rounded-lg shadow h-fit relative'
        >
          <div className='flex gap-2 relative'>
            {/* OrderId */}
            <p className='bg-yellow-400 rounded px-2 w-fit'>{order.id?.substring(order.id.indexOf('-') + 1)}</p>

            {/* Zahlungeingang */}
            {order.paymentMethod === 'CARD' && (
              <p className={`rounded px-2 w-fit ${order.isPayed ? 'bg-green-300' : 'bg-red-300'}`}>
                {order.isPayed ? 'BEZAHLT' : 'UNBEZAHLT'}
              </p>
            )}

            {/* Zahlungsmethode */}
            <p>{order.paymentMethod}</p>

            <div className='flex gap-2 absolute right-0'>
              {/* TableId */}
              {order.tableId && <p>TISCH {order.tableId}</p>}

              {
                /* Status Ändern */
                //TODO remove '!'
              }

              <Button
                sx={{ p: 0, boxShadow: 'none', minWidth: 0 }}
                color='success'
                onClick={() => updateStatus(order.id!, 'DONE')}
                variant='contained'
              >
                <Check />
              </Button>
            </div>
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
                <p className='bg-red-400 rounded px-2'>{position.leftOutIngredients.join(', ')}</p>
              )}
              {position.extraIngredients.length > 0 && (
                <p className='bg-blue-400 rounded px-2'>
                  {position.extraIngredients.map((ingredient) => ingredient.name).join(', ')}
                </p>
              )}
            </div>
          ))}

          {/* Bemerkung */}
          {order.note && (
            <div>
              <h3>Anmerkung</h3>
              <p className='text-slate-500'>{order.note}</p>
            </div>
          )}

          {/* OrderId Voll */}
          <p className='text-xs place-self-end'>{order.id}</p>
        </li>
      ))}
    </ul>
  )
}
