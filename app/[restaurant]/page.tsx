'use client'

import { Dish, DishesByCategory } from '@/types/dish.type'
import { trpc } from '@/trpc/trpc'
import { FilterChipModel } from '@/types/filter-chip.types'
import { Stack } from '@mui/material'
import FilterBar from '@/app/components/guest/filter-bar'
import FoodCategory from '@/app/components/guest/food-category'
import { useEffect, useState } from 'react'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'
import { useRestaurantStore } from '@/store/restaurantStore'
import DishDialog from '../components/guest/dish-dialog'

export default function Menu({ params }: { params: { restaurant: string } }) {
  const [activeDish, setActiveDish] = useState<Dish | null>(null)

  const menuStore = useStore(useMenuStore, (state) => state)
  const restaurantStore = useStore(useRestaurantStore, (state) => state)

  const restaurantId: number = parseInt(params.restaurant)

  const { data: dishesByCategory } = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  })

  useEffect(() => {
    if (dishesByCategory && menuStore?.visibleDishes.length === 0) {
      menuStore.setAllDishes(dishesByCategory)
      menuStore.setVisibleDishes(dishesByCategory)
    }
  }, [dishesByCategory, menuStore])

  useEffect(() => {
    restaurantStore?.setRestaurantId(restaurantId)
  }, [restaurantStore, restaurantId])

  const filterChips: FilterChipModel[] = getFilterChips(dishesByCategory)

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
      <FilterBar chipData={filterChips} />
      {menuStore?.visibleDishes.map((category) => (
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
