import { DishCategory, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type MenuState = {
  allDishes: DishesByCategory[]
  visibleDishes: DishesByCategory[]
  activeFilter: FilterChipModel[]
  updateFilter: (filter: FilterChipModel) => void
  filter: () => void
  setAllDishes: (dishes: DishesByCategory[]) => void
  setVisibleDishes: (dishes: DishesByCategory[]) => void
  restaurantId: number
  setRestaurantId: (restaurantId: number) => void
  addDishCategory: (dishCategory: DishCategory) => void
}

const updateFilter = (filter: FilterChipModel, activeFilter: FilterChipModel[]): FilterChipModel[] => {
  const existingFilter = activeFilter.find((f) => f.label === filter.label)
  if (existingFilter) {
    return activeFilter.filter((f) => f.label !== filter.label)
  } else {
    return [...activeFilter, filter]
  }
}

const applyFilter = (dishes: DishesByCategory[], activeFilter: FilterChipModel[]): DishesByCategory[] =>
  dishes.map((category) => {
    const filteredDishes = category.dishes.filter(
      (dish) => isAttributeInFilters(dish.labels, activeFilter) || isAttributeInFilters(dish.allergies, activeFilter)
    )
    return { ...category, dishes: filteredDishes }
  })

const isAttributeInFilters = (attribute: string[], filters: FilterChipModel[]): boolean => {
  let attributeFound = true
  filters.forEach((filter: FilterChipModel) => {
    if (!attribute.includes(filter.label)) {
      attributeFound = false
    }
  })
  return attributeFound
}

export const useMenuStore = create(
  persist<MenuState>(
    (set, get) => ({
      allDishes: [],
      visibleDishes: [],
      activeFilter: [],
      restaurantId: 0,
      updateFilter: (filter: FilterChipModel) =>
        set(() => ({
          activeFilter: updateFilter(filter, get().activeFilter),
        })),
      filter: () =>
        set(() => ({
          visibleDishes: applyFilter(get().allDishes, get().activeFilter),
        })),

      setAllDishes: (dishes: DishesByCategory[]) => {
        set(() => ({
          allDishes: dishes,
        }))
      },
      setVisibleDishes: (dishes: DishesByCategory[]) =>
        set(() => ({
          visibleDishes: dishes,
        })),
      setRestaurantId: (restaurantId: number) => set(() => ({ restaurantId })),
      addDishCategory: (dishCategory: DishCategory) =>
        set(() => ({
          allDishes: [
            ...get().allDishes,
            {
              category: dishCategory,
              dishes: [],
            },
          ],
        })),
    }),
    {
      name: 'menu',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
