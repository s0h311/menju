'use client'

import { Dish, DishCategory, DishesByCategory } from '@/app/types/dish.type'
import { trpc } from '@/trpc/trpc'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { Box, Stack } from '@mui/material'
import FilterBar from '@/app/components/filter-bar'
import FoodCategory from '@/app/components/food-category'
import React, { useEffect } from 'react'
import { useMenuStore } from '@/store/menu-store'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const { setAllDishes } = useMenuStore()
  const { setVisibleDishes } = useMenuStore()
  const { visibleDishes } = useMenuStore()
  const dishesByCategory = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  })
  useEffect(() => {
    if (dishesByCategory.data) {
      const dishes = new Map<DishCategory, Dish[]>()
      dishesByCategory.data.forEach((allDishes) => {
        dishes.set(allDishes.category, allDishes.dishes)
      })
      setAllDishes(dishes)
      setVisibleDishes(dishes)
    }
  }, [dishesByCategory.data, setAllDishes, setVisibleDishes])

  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory.data)

  function getFilterChips(dishesByCategory: DishesByCategory[] | undefined): FilterChipModel[] {
    const filterChipNames: Set<string> = new Set<string>()
    const filterChips: FilterChipModel[] = []
    dishesByCategory?.map((dishes: DishesByCategory): void => {
      dishes.dishes.map((dish: Dish): void => {
        ;[...dish.allergies, ...dish.labels].forEach((filterName: string) => filterChipNames.add(filterName))
      })
    })
    filterChipNames.forEach((name: string) => filterChips.push({ label: name }))
    return filterChips
  }

  return (
    <Stack className='mb-4'>
      <Box className='sticky top-0 z-10'>{<FilterBar chipData={filterChips} />}</Box>
      {Array.from(visibleDishes.keys()).map((category) => (
        <FoodCategory
          key={category.id}
          category={category}
        />
      ))}
    </Stack>
  )
}
