import { DishesByCategory } from '@/types/dish.type'
import { FilterChipModel } from '@/types/filter-chip.types'
import { MenuState } from '../menuStore'

export type getState = () => MenuState
export type setState = (
  partial: MenuState | Partial<MenuState> | ((state: MenuState) => MenuState | Partial<MenuState>),
  replace?: boolean | undefined
) => void

export const updateFilter = (get: getState, set: setState, filter: FilterChipModel) =>
  set({ activeFilter: getUpdatedFilter(filter, get().activeFilter) })

export const filter = (get: getState, set: setState) =>
  set({ visibleDishes: applyFilter(get().allDishes, get().activeFilter) })

export const setAllDishes = (get: getState, set: setState, dishes: DishesByCategory[]) =>
  set({ allDishes: dishes, visibleDishes: dishes })

export const setVisibleDishes = (get: getState, set: setState, dishes: DishesByCategory[]) =>
  set({ visibleDishes: dishes })

// HELPERS //

const getUpdatedFilter = (filter: FilterChipModel, activeFilter: FilterChipModel[]): FilterChipModel[] => {
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
