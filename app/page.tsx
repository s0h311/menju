'use client'

import { trpc } from '@/trpc/trpc'
import Image from 'next/image'
import Link from 'next/link'
import DishDialog from './components/guest/dish-dialog'
import { Dish } from './types/dish.type'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/gotrue-js/src/lib/types'
import { useStore } from 'zustand'
import { useRestaurantStore } from '@/store/restaurantStore'

export default function Home() {
  const supabase = createClientComponentClient()
  const restaurantStore = useStore(useRestaurantStore, (state) => state)

  const dishesByCategory = trpc.dishesByCategory.useQuery({
    restaurantId: restaurantStore.restaurantId,
    language: 'it',
  })

  const [activeDish, setActiveDish] = useState<Dish | null>(null)
  const [user, setUser] = useState<User | null>(null) //TODO example retrieve user

  //TODO example signout
  const signout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  //TODO example get user
  useEffect(() => {
    const getUser = async () => {
      const data = await supabase.auth.getUser()
      setUser(data.data.user)
    }

    getUser()
  }, [supabase])

  return (
    <div className='grid gap-5 border p-5 border-red-400'>
      <Link href='/login'>GO TO LOGIN PAGE</Link>
      {
        //TODO Example
        user ? <button onClick={() => signout()}>SIGNOUT</button> : ''
      }
      <Link href='/fmsinn/1'>GO TO MENU</Link>
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
