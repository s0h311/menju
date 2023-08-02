'use client'

import React from 'react'
import FilterBar from '@/app/components/filter-bar'
import { Box, Stack } from '@mui/material'
import FoodCategory from '@/app/components/food-category'
import { trpc } from '@/trpc/trpc'
import { Dish, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const dishesByCategory: DishesByCategory[] | undefined = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  }).data
  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory)

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
      <Box className='sticky top-0 z-10'>
        <FilterBar chipData={filterChips} />
      </Box>
      {dishesByCategory?.map((category: DishesByCategory) => (
        <FoodCategory
          key={category.category.id}
          category={category.category}
          dishes={category.dishes}
        />
      ))}
    </Stack>
  )
}
