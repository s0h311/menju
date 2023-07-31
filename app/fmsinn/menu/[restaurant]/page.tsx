'use client'

import React from 'react'
import FilterBar from '@/app/components/filter-bar'
import { Box, Stack } from '@mui/material'
import FoodCategory from '@/app/components/food-category'
import { trpc } from '@/trpc/trpc'
import { DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { getFilterChips } from '@/app/fmsinn/menu/[restaurant]/utils'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const dishesByCategory: DishesByCategory[] | undefined = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  }).data
  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory)
  return (
    <Stack className='mb-4'>
      <Box className='sticky top-0 z-10'>
        <FilterBar chipData={filterChips} />
      </Box>
      {dishesByCategory?.map((category: DishesByCategory) => {
        return (
          <FoodCategory
            key={category.category.id}
            dishesByCategory={category}
          />
        )
      })}
    </Stack>
  )
}
