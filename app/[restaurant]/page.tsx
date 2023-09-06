'use client'

import { Dish, DishesByCategory } from '@/types/dish.type'
import { trpc } from '@/trpc/trpc'
import { FilterChipModel } from '@/types/filter-chip.types'
import { Stack } from '@mui/material'
import FilterBar from '@/components/guest/filterBar'
import FoodCategory from '@/components/guest/foodCategory'
import { useState } from 'react'
import DishDialog from '@/components/guest/dishDialog'
import useDishService from '@/hooks/useDishService'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const dishService = useDishService({ restaurantId, language: 'de' })

  const [activeDish, setActiveDish] = useState<Dish | null>(null)
  const { dishesByCategory, visibleDishes } = dishService

  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory)

  function getFilterChips(dishesByCategory: DishesByCategory[]): FilterChipModel[] {
    const filterChipNames: Set<string> = new Set<string>()
    const filterChips: FilterChipModel[] = []
    dishesByCategory?.map((dishes: DishesByCategory): void => {
      dishes.dishes.map((dish: Dish): void =>
        [...dish.allergies, ...dish.labels].forEach((filterName: string) => filterChipNames.add(filterName))
      )
    })
    filterChipNames.forEach((name: string) => filterChips.push({ label: name }))
    return filterChips
  }

  return (
    <Stack className='mb-4'>
      <FilterBar chipData={filterChips} />
      {visibleDishes?.map((category) => (
        <FoodCategory
          key={category.category.id}
          category={category.category}
          onCardClick={(dish) => setActiveDish(dish)}
        />
      ))}
      {activeDish && (
        <DishDialog
          dish={activeDish}
          setOpenDialog={setActiveDish}
        />
      )}
    </Stack>
  )
}
