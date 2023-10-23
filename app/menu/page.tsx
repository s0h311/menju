'use client'

import type { Dish, DishesByCategory } from '@/types/dish.type'
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
  const { isFilterBarEnabled, logoUrl } = useRestaurant()
  const [activeDish, setActiveDish] = useState<Dish | null>(null)

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
    <section>
      {logoUrl && <Navbar logoUrl={logoUrl} />}
      {filterChips.length > 0 && isFilterBarEnabled && <FilterBar chipData={filterChips} />}
      <Stack className='py-4'>
        {visibleDishes ? (
          <>
            {visibleDishes?.map((dishesByCategory, index) => (
              <FoodCategory
                key={dishesByCategory.category.id}
                category={dishesByCategory.category}
                dishes={dishesByCategory.dishes}
                onCardClick={(dish) => setActiveDish(dish)}
                hasPriority={index <= 1}
              />
            ))}
          </>
        ) : (
          <>
            {filterChips.length > 0 && isFilterBarEnabled && <FilterBarSkeleton />}
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
        <CartDialog />
      </Stack>
    </section>
  )
}
