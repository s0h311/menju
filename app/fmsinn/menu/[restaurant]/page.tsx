'use client'

import React from 'react'
import FilterBar from '@/app/components/filter-bar'
import { Box, Stack } from '@mui/material'
import FoodCategory from '@/app/components/food-category'
import { trpc } from '@/trpc/trpc'
import { Dish, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { ZodString } from 'zod'

function getFilterChips(dishesByCategory: DishesByCategory[]): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  dishesByCategory.map((allDishesAndCategories: DishesByCategory) => {
    return allDishesAndCategories.dishes.map((allDishes: Dish): void => {
      filterChips.push(
        ...getFilterChipsFromAllergies(allDishes.allergies),
        ...getFilterChipsFromLabels(allDishes.labels)
      )
    })
  })
  return filterChips
}

function getFilterChipsFromAllergies(allergies: ZodString['_output'][]): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  allergies.map((allergy: string) => {
    filterChips.push({ key: Math.floor(Math.random() * 100), label: allergy })
  })
  return filterChips
}

function getFilterChipsFromLabels(labels: ZodString['_output'][]): FilterChipModel[] {
  const filterChips: FilterChipModel[] = []
  labels.map((label: string) => {
    filterChips.push({ key: Math.floor(Math.random() * 100), label })
  })
  return filterChips
}

export default function Menu({ params }: { params: { restaurant: string } }) {
  const restaurantId: number = parseInt(params.restaurant)
  const dishesByCategory: DishesByCategory[] | undefined = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  }).data
  return (
    <Stack className='mb-4'>
      <Box className='sticky top-0 z-10'>
        <FilterBar chipData={dishesByCategory ? getFilterChips(dishesByCategory) : []} />
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
