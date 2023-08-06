'use client'

import { trpc } from '@/trpc/trpc'
import Image from 'next/image'
import { Cart } from './types/order.type'
import { useCartStore } from '@/store/store'
import Link from 'next/link'
import DishDialog from './components/dishDialog'
import { Dish } from './types/dish.type'
import { useState } from 'react'
import CartDialog from './components/cartDialog'

export default function Home() {
  const dishesByCategory = trpc.dishesByCategory.useQuery({ restaurantId: 1, language: 'it' })

  const [activeDish, setActiveDish] = useState<Dish | null>(null)

  return (
    <div className='grid gap-5 border p-5 border-red-400'>
      <Link href='/fmsinn/menu/1'>GO TO MENU</Link>
      {dishesByCategory.data?.map((category) => (
        <div
          className='grid gap-2 border p-2 border-blue-400'
          key={category.category.id}
        >
          <p>{category.category.name}</p>
          {category.dishes.map((dish) => (
            <div
              className='grid gap-2 p-2 border border-green-400 cursor-pointer'
              onClick={() => setActiveDish(dish)}
              key={dish.id}
            >
              <p>{dish.name}</p>
              {dish.picture ? (
                <Image
                  src={dish.picture}
                  width={500}
                  height={300}
                  alt=''
                />
              ) : (
                ''
              )}
              <p>{dish.price}</p>
            </div>
          ))}
        </div>
      ))}
      {activeDish ? (
        <DishDialog
          dish={activeDish}
          setOpenDialog={setActiveDish}
        />
      ) : (
        ''
      )}
      <div className='sticky bottom-0 right-0 justify-self-end'>
        <CartDialog />
      </div>
    </div>
  )
}
