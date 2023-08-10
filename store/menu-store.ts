import { Dish, DishCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { create } from 'zustand'

export type MenuState = {
  allDishes: Map<DishCategory, Dish[]>
  visibleDishes: Map<DishCategory, Dish[]>
  activeFilter: FilterChipModel[]
  updateFilter: (filter: FilterChipModel) => void
  filter: () => void
  setAllDishes: (dishes: Map<DishCategory, Dish[]>) => void
  setVisibleDishes: (dishes: Map<DishCategory, Dish[]>) => void
}

const updateFilter = (filter: FilterChipModel, activeFilter: FilterChipModel[]): FilterChipModel[] => {
  const existingFilter = activeFilter.find((f) => f.label === filter.label)
  if (existingFilter) {
    return activeFilter.filter((f) => f.label !== filter.label)
  } else {
    return [...activeFilter, filter]
  }
}

const applyFilter = (dishes: Dish[], activeFilter: FilterChipModel[]): Dish[] => {
  return dishes.filter((dish: Dish) =>
    activeFilter.every(
      (filter: FilterChipModel) => dish.labels.includes(filter.label) || dish.allergies.includes(filter.label)
    )
  )
}

export const useMenuStore = create<MenuState>((set) => ({
  allDishes: new Map<DishCategory, Dish[]>(),
  visibleDishes: new Map<DishCategory, Dish[]>(),
  activeFilter: [],
  updateFilter: (filter: FilterChipModel) =>
    set((state) => ({
      ...state,
      activeFilter: updateFilter(filter, state.activeFilter),
    })),
  filter: () =>
    set((state) => {
      const newVisibleDishes = new Map() // Neue Map für die sichtbaren Gerichte
      state.allDishes.forEach((dishes, category) => {
        const updatedDishes = applyFilter(dishes, state.activeFilter)
        newVisibleDishes.set(category, updatedDishes)
      })
      return { ...state, visibleDishes: newVisibleDishes } // Zustand mit aktualisierten sichtbaren Gerichten zurückgeben
    }),

  setAllDishes: (dishes: Map<DishCategory, Dish[]>) =>
    set((state) => ({
      ...state,
      allDishes: dishes,
    })),
  setVisibleDishes: (dishes: Map<DishCategory, Dish[]>) =>
    set((state) => ({
      ...state,
      visibleDishes: dishes,
    })),
}))
