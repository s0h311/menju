'use client'

import { trpc } from '@/trpc/trpc'
import Link from 'next/link'
import { Dish } from './types/dish.type'
import { useRef } from 'react'
import useStore from '@/store/nextjs-hook'
import { useMenuStore } from '@/store/menu-store'

export default function Home() {
  const menuStore = useStore(useMenuStore, (state) => state)

  const addDishMutation = trpc.addDish.useMutation()
  const updateDishMutation = trpc.updateDish.useMutation()
  const deleteDishMutation = trpc.deleteDish.useMutation()

  const id = useRef<number | undefined>()
  const categoryId = useRef<number | undefined>()

  const add = () => {
    addDishMutation.mutateAsync(
      {
        name: { de: 'Pizza', en: 'Pizza', it: 'Pizza' },
        price: 7.5,
        picture:
          'https://images.lecker.de/pizza-bianca-mit-pilzen,id=a5ed1fe9,b=lecker,w=710,ca=0,8.14,100,91.86,rm=sk.webp',
        categoryId: 1,
        ingredients: {
          required: [{ de: 'teig', en: 'dough', it: 'impasto' }],
          optional: [{ de: 'tomatensoße', en: 'tomatosauce', it: 'salsa di pomodoro' }],
        },
        labels: [{ de: 'Beste Pizza der Stadt', en: 'Best pizza in town', it: 'La migliore pizza in città' }],
        allergies: [
          { de: 'Nuss', en: 'Nut', it: 'noce' },
          { de: 'Soja', en: '', it: '' },
        ],
        nutritions: {
          energy: 790,
          protein: 34,
        },
        dietType: 'VEGETARIAN',
        description: {
          de: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
          en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
          it: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
        },
        saleStartDate: new Date(),
        saleEndDate: new Date(),
        salePrice: 6.5,
        saleDays: [0, 2, 6],
      },
      {
        onSuccess: (dish: Dish | null) => {
          if (dish) {
            console.log(dish)
            id.current = dish?.id || undefined
            categoryId.current = dish.categoryId || undefined
            menuStore?.addDish(dish)
          }
        },
      }
    )
  }

  const update = () => {
    updateDishMutation.mutateAsync(
      {
        id: id.current,
        name: { de: 'Döner', en: 'Doner Kebab', it: 'Doner Kebap' },
        price: 7.5,
        picture:
          'https://images.lecker.de/pizza-bianca-mit-pilzen,id=a5ed1fe9,b=lecker,w=710,ca=0,8.14,100,91.86,rm=sk.webp',
        categoryId: 1,
        ingredients: {
          required: [{ de: 'teig', en: 'dough', it: 'impasto' }],
          optional: [{ de: 'tomatensoße', en: 'tomatosauce', it: 'salsa di pomodoro' }],
        },
        labels: [{ de: 'Beste Pizza der Stadt', en: 'Best pizza in town', it: 'La migliore pizza in città' }],
        allergies: [
          { de: 'Nuss', en: 'Nut', it: 'noce' },
          { de: 'Soja', en: '', it: '' },
        ],
        nutritions: {
          energy: 790,
          protein: 34,
        },
        dietType: 'VEGETARIAN',
        description: {
          de: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
          en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
          it: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
        },
        saleStartDate: new Date(),
        saleEndDate: new Date(),
        salePrice: 6.5,
        saleDays: [0, 2, 6],
      },
      {
        onSuccess: (dish: Dish | null) => {
          if (dish) {
            console.log(dish)
            id.current = dish?.id || undefined

            menuStore?.updateDish(dish)
          }
        },
      }
    )
  }

  const remove = () => {
    if (categoryId.current && id.current) {
      deleteDishMutation.mutateAsync(id.current, {
        onSuccess: () => {
          menuStore?.removeDish(categoryId.current!, id.current!)
        },
      })
    }
  }

  return (
    <section className='grid place-items-center gap-10 mt-10'>
      <button onClick={add}>add</button>
      <button onClick={update}>update</button>
      <button onClick={remove}>delete</button>

      <h1 className='text-2xl flex items-center gap-1'>
        <p>Welcome to</p>
        <p className='italic'>Menju</p>
      </h1>

      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/1'
      >
        Go to Demo
      </Link>
    </section>
  )
}
