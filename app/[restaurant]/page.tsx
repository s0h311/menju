'use client'

import { Dish, DishesByCategory } from '@/types/dish.type'
import { FilterChipModel } from '@/types/filterChip.type'
import { Stack } from '@mui/material'
import FilterBar from '@/components/guest/filterBar'
import FoodCategory from '@/components/guest/foodCategory'
import { useState } from 'react'
import DishDialog from '@/components/guest/dishDialog'
import useDishService from '@/hooks/useDishService'
import FilterBarSkeleton from '@/components/guest/skeleton/filterBarSkeleton'
import FoodCategorySkeleton from '@/components/guest/skeleton/foodCategorySkeleton'
import React from 'react'

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
      {dishService.visibleDishes ? (
        <>
          <FilterBar chipData={filterChips} />
          {visibleDishes
            ?.sort((a, b) => b.category.priority - a.category.priority)
            .map((category) => (
              <FoodCategory
                key={category.category.id}
                category={category.category}
                onCardClick={(dish) => setActiveDish(dish)}
              />
            ))}
        </>
      ) : (
        <>
          <FilterBarSkeleton />
          <FoodCategorySkeleton />
          <FoodCategorySkeleton />
        </>
      )}
      {activeDish && (
        <DishDialog
          dish={activeDish}
          setOpenDialog={setActiveDish}
        />
      )}
    </Stack>
  )
}
