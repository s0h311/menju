'use client'

import { Dish, DishesByCategory } from '@/app/types/dish.type'
import { trpc } from '@/trpc/trpc'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { Box, Stack } from '@mui/material'
import FilterBar from '@/app/components/guest/filter-bar'
import FoodCategory from '@/app/components/guest/food-category'
import React, { useEffect } from 'react'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const menuStore = useStore(useMenuStore, (state) => state)
  const dishesByCategory = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  })

  useEffect(() => {
    if (dishesByCategory.data && menuStore?.visibleDishes.length === 0) {
      menuStore.setAllDishes(dishesByCategory.data)
      menuStore.setVisibleDishes(dishesByCategory.data)
    }
  }, [dishesByCategory.data, menuStore])

  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory.data)

  function getFilterChips(dishesByCategory: DishesByCategory[] | undefined): FilterChipModel[] {
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
      <Box className='sticky top-0 z-10'>{<FilterBar chipData={filterChips} />}</Box>
      {menuStore?.visibleDishes.map((category) => (
        <FoodCategory
          key={category.category.id}
          category={category.category}
        />
      ))}
    </Stack>
  )
}
