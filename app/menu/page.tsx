'use client'

import type { Dish } from '@/types/dish.type'
import type { FilterChipModel } from '@/types/filterChip.type'
import { Stack } from '@mui/material'
import FilterBar from '@/components/guest/filterBar'
import FoodCategory from '@/components/guest/foodCategory'
import { useState } from 'react'
import DishDialog from '@/components/guest/dishDialog'
import FilterBarSkeleton from '@/components/guest/skeleton/filterBarSkeleton'
import FoodCategorySkeleton from '@/components/guest/skeleton/foodCategorySkeleton'
import React from 'react'
import CartDialog from '@/components/guest/cartDialog'
import useDish from '@/hooks/useDish'
import { useSearchParams } from 'next/navigation'
import { QUERY_PARAM } from '@/types/queryParams.type'
import useRestaurant from '@/hooks/useRestaurant'
import Navbar from '@/components/guest/navbar'

export default function Menu() {
  const queryParams = useSearchParams()
  const restaurantId: number = parseInt(queryParams.get(QUERY_PARAM.restaurandId) ?? '')
  const tableId: string = queryParams.get(QUERY_PARAM.tableId) ?? 'unknown'

  const { dishesByCategory, visibleDishes } = useDish({ restaurantId, language: 'de', tableId })
  const { isFilterBarEnabled, logoUrl, colors } = useRestaurant()
  const [activeDish, setActiveDish] = useState<Dish | null>(null)

  const filterChips: FilterChipModel[] = ((): FilterChipModel[] => {
    const filterChipNames = new Set<string>()
    const filterChips: FilterChipModel[] = []
    if (!dishesByCategory || !dishesByCategory.length) return []

    dishesByCategory.map(({ dishes }): void => {
      dishes.map((dish: Dish): void =>
        [...dish.allergies, ...dish.labels].forEach((filterName: string) => filterChipNames.add(filterName))
      )
    })

    filterChipNames.forEach((name: string) => filterChips.push({ label: name }))

    return filterChips
  })()

  return colors ? (
    visibleDishes && (
      <section>
        {logoUrl && <Navbar logoUrl={logoUrl} />}
        {filterChips.length > 0 && isFilterBarEnabled && <FilterBar chipData={filterChips} />}
        <Stack className='pt-4'>
          <>
            {visibleDishes.map((dishesByCategory, index) => (
              <FoodCategory
                key={dishesByCategory.category.id}
                category={dishesByCategory.category}
                dishes={dishesByCategory.dishes}
                onCardClick={(dish) => setActiveDish(dish)}
                hasPriority={index <= 1}
              />
            ))}
          </>
          )
          {activeDish && (
            <DishDialog
              dish={activeDish}
              setOpenDialog={setActiveDish}
            />
          )}
          <CartDialog />
        </Stack>
      </section>
    )
  ) : (
    <Stack className='pt-4'>
      <>
        <FilterBarSkeleton />
        <FoodCategorySkeleton />
        <FoodCategorySkeleton />
      </>
    </Stack>
  )
}
