'use client'

import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'
import { Dish, DishesByCategory } from '@/app/types/dish.type'
import { useState } from 'react'
import CardGrid from '@/app/components/kitchen/cardGrid'
import Card from '@/app/components/kitchen/card'

export default function KitchenAddAndEdit() {
  const [activeDishesCategory, setActiveDishesCategory] = useState<DishesByCategory | null>(null)

  const menuStore = useStore(useMenuStore, (state) => state)
  const allDishes: Dish[] =
    menuStore?.allDishes
      .filter((dishesByCategory: DishesByCategory) => dishesByCategory.dishes.length)
      .map((dishesByCategory: DishesByCategory) => dishesByCategory.dishes)
      .flat() || []

  return (
    <section className='grid grid-cols-2 gap-5 xl:gap-10 w-full h-full'>
      <CardGrid title='Kategorien'>
        {menuStore?.allDishes.map((card: DishesByCategory) => (
          <Card
            key={card.category.id}
            title={card.category.name}
            image={card.category.picture || card.dishes.at(0)?.picture || ''}
            onClick={() => setActiveDishesCategory(card)}
          >
            <p>Anzahl Gerichte: {card.dishes.length}</p>
          </Card>
        ))}
      </CardGrid>
      <CardGrid
        title={activeDishesCategory ? `Gerichte - ${activeDishesCategory.category.name}` : 'Alle Gerichte'}
        withReset
        onReset={() => setActiveDishesCategory(null)}
      >
        {(activeDishesCategory?.dishes || allDishes).map((card: Dish) => (
          <Card
            key={card.id}
            title={card.name}
            image={card.picture || ''}
          >
            <p>{card.price}</p>
          </Card>
        ))}
      </CardGrid>
    </section>
  )
}
