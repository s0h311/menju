'use client'

import { trpc } from '@/trpc/trpc'
import Image from 'next/image'
import { Cart } from './types/order.types'

export default function Home() {
  const dishesByCategory = trpc.dishesByCategory.useQuery({ restaurantId: 1, language: 'IT' })
  const mutation = trpc.createOrder.useMutation()

  const addDemoOrder = () => {
    let demoCart: Cart = {
      restaurantId: 1,
      table: 'A3',
      positions: [
        {
          dishId: 3,
          quantity: 2,
          leftOutIngredients: [],
        },
        {
          dishId: 3,
          quantity: 1,
          leftOutIngredients: [],
        },
      ],
      paymentMethod: 'CARD',
      isPayed: true,
      netTotal: 35,
      vat: 7,
      note: '',
    }

    mutation.mutate(demoCart)
  }

  return (
    <div className='grid gap-5 border p-5 border-red-400'>
      <button onClick={addDemoOrder}>ADD NEW ORDER</button>
      {dishesByCategory.data?.map((category) => (
        <div className='grid gap-2 border p-2 border-blue-400' key={category.category.id}>
          <p>{category.category.name}</p>
          {category.dishes.map((dish) => (
            <div className='grid gap-2 p-2 border border-green-400' key={dish.id}>
              <p>{dish.name}</p>
              <Image src={dish.picture} width={500} height={300} alt='' />
              <p>{dish.price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
