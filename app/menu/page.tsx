'use client'

import type { Dish, DishesByCategory } from '@/types/dish.type'
import type { FilterChipModel } from '@/types/filterChip.type'
import { Stack } from '@mui/material'
import FilterBar from '@/components/guest/filterBar'
import FoodCategory from '@/components/guest/foodCategory'
import { useCallback, useEffect, useState } from 'react'
import DishDialog from '@/components/guest/dishDialog'
import FilterBarSkeleton from '@/components/guest/skeleton/filterBarSkeleton'
import FoodCategorySkeleton from '@/components/guest/skeleton/foodCategorySkeleton'
import React from 'react'
import CartDialog from '@/components/guest/cartDialog'
import { useSearchParams } from 'next/navigation'
import { QUERY_PARAM } from '@/types/queryParams.type'
import { initRestaurant, useRestaurantState } from '@/hooks/useRestaurant'
import Navbar from '@/components/guest/navbar'
import { useDishes } from '@/hooks/useDish'
import type { UseQueryResult } from '@tanstack/react-query'

export default function Menu() {
  const queryParams = useSearchParams()
  const restaurantId: number = parseInt(queryParams.get(QUERY_PARAM.restaurandId) ?? '')
  const tableId: string = queryParams.get(QUERY_PARAM.tableId) ?? 'unknown'

  // RESTAURANT
  useEffect(() => {
    initRestaurant({ restaurantId, language: 'de', tableId })
  }, [restaurantId, tableId])

  const {
    features: { isFilterBarEnabled },
    logoUrl,
  } = useRestaurantState()

  // DISHESBYCATEGORY
  const { data, isLoading, isError, isSuccess }: UseQueryResult<DishesByCategory[]> = useDishes()
  const [dishesByCategory, setDishesByCategory] = useState<DishesByCategory[]>([])

  useEffect(() => {
    if (isSuccess && data) {
      setDishesByCategory(data)
    }
  }, [data, isSuccess])

  // ACTIVE DISH, VISIBLE DISHES
  const [activeDish, setActiveDish] = useState<Dish | null>(null)
  const [visibleDishes, setVisibleDishes] = useState<DishesByCategory[]>([])

  useEffect(() => {
    if (isSuccess && dishesByCategory) {
      setVisibleDishes(dishesByCategory)
    }
  }, [isSuccess, dishesByCategory])

  // FILTERS
  const [availableFilters, setAvailableFilters] = useState<FilterChipModel[]>([])

  const initFilters = useCallback(() => {
    const filterChipNames = new Set<string>()
    const filterChips: FilterChipModel[] = []
    if (!dishesByCategory || !dishesByCategory.length) return []

    dishesByCategory.map(({ dishes }): void => {
      dishes.map((dish: Dish): void =>
        [...dish.allergies, ...dish.labels].forEach((filterName: string) => filterChipNames.add(filterName))
      )
    })

    filterChipNames.forEach((name: string) => filterChips.push({ label: name }))
    setAvailableFilters(filterChips)
  }, [dishesByCategory])

  useEffect(() => {
    initFilters()
  }, [initFilters])

  function filter(filters: FilterChipModel[]): void {
    const res = []

    for (const dbc of dishesByCategory) {
      const dishes = dbc.dishes.filter((dish) => {
        const labelsOfDish = [...dish.allergies, ...dish.labels]

        let isDishVisible = false

        // Use every to early return if a label is found
        filters.every((f) => {
          if (labelsOfDish.includes(f.label)) {
            isDishVisible = true
            return false // break the loop
          }
          return true // continue the loop
        })

        return isDishVisible
      })

      if (dishes.length > 0) {
        res.push({ category: dbc.category, dishes })
      }
    }

    setVisibleDishes(res)
  }

  // RENDER //

  if (isError) return <p>Sry</p>

  if (isLoading)
    return (
      <Stack className='pt-4'>
        <>
          <FilterBarSkeleton />
          <FoodCategorySkeleton />
          <FoodCategorySkeleton />
        </>
      </Stack>
    )

  return (
    <section>
      {logoUrl && <Navbar logoUrl={logoUrl} />}

      {availableFilters.length > 0 && isFilterBarEnabled && (
        <FilterBar
          chipData={availableFilters}
          onFilter={filter}
        />
      )}

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
