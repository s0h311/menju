import { DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MenuState = {
  allDishes: DishesByCategory[]
  visibleDishes: DishesByCategory[]
  activeFilter: FilterChipModel[]
  updateFilter: (filter: FilterChipModel) => void
  filter: () => void
  setAllDishes: (dishes: DishesByCategory[]) => void
  setVisibleDishes: (dishes: DishesByCategory[]) => void
}

const updateFilter = (filter: FilterChipModel, activeFilter: FilterChipModel[]): FilterChipModel[] => {
  const existingFilter = activeFilter.find((f) => f.label === filter.label)
  if (existingFilter) {
    return activeFilter.filter((f) => f.label !== filter.label)
  } else {
    return [...activeFilter, filter]
  }
}

const applyFilter = (dishes: DishesByCategory[], activeFilter: FilterChipModel[]): DishesByCategory[] => {
  return dishes.map((category) => {
    const filteredDishes = category.dishes.filter(
      (dish) => isAttributeInFilters(dish.labels, activeFilter) || isAttributeInFilters(dish.allergies, activeFilter)
    )
    return { ...category, dishes: filteredDishes }
  })
}

const isAttributeInFilters = (attribute: String[], filters: FilterChipModel[]): boolean => {
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
      updateFilter: (filter: FilterChipModel) =>
        set((state) => ({
          activeFilter: updateFilter(filter, get().activeFilter),
        })),
      filter: () =>
        set((state) => ({
          visibleDishes: applyFilter(get().allDishes, get().activeFilter),
        })),

      setAllDishes: (dishes: DishesByCategory[]) => {
        set((state) => ({
          allDishes: dishes,
        }))
      },
      setVisibleDishes: (dishes: DishesByCategory[]) =>
        set((state) => ({
          visibleDishes: dishes,
        })),
    }),
    {
      name: 'menu',
    }
  )
)
