import { Dish, DishCategory, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getState, setState, removeDish, addDish } from './menuStore/dish'

export type MenuState = {
  allDishes: DishesByCategory[]
  visibleDishes: DishesByCategory[]
  activeFilter: FilterChipModel[]
  updateFilter: (filter: FilterChipModel) => void
  filter: () => void
  setAllDishes: (dishes: DishesByCategory[]) => void
  setVisibleDishes: (dishes: DishesByCategory[]) => void
  addDishCategory: (dishCategory: DishCategory) => void
  updateDishCategory: (dishCategory: DishCategory) => void
  removeDishCategory: (dishCategoryId: number) => void
  addDish: (dish: Dish) => void
  updateDish: (dish: Dish) => void
  removeDish: (dishCategoryId: number, dishId: number) => void
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

      updateDishCategory: (dishCategory: DishCategory) => {
        const dishesByCategory = get().allDishes.find((dbc) => dbc.category.id === dishCategory.id)
        if (dishesByCategory) {
          dishesByCategory.category = dishCategory
        }
        set(() => ({
          allDishes: get().allDishes,
        }))
      },

      removeDishCategory: (dishCategoryId: number) =>
        set(() => ({
          allDishes: get().allDishes.filter((dishesByCategory) => dishesByCategory.category.id !== dishCategoryId),
        })),

      addDish: (dish: Dish) => addDish(get, set, dish),

      updateDish: (dish: Dish) => {
        const dishesByCategory = get().allDishes.find((dbc) => dbc.category.id === dish.categoryId)
        const dishIndex = dishesByCategory?.dishes.findIndex((oldDish) => oldDish.id === dish.id)

        if (dishesByCategory && dishIndex && dishIndex >= 0) {
          dishesByCategory.dishes.splice(dishIndex, 1, dish)
        }

        set(() => ({
          allDishes: get().allDishes,
        }))
      },

      removeDish: (dishCategoryId: number, dishId: number) => removeDish(get, set, dishCategoryId, dishId),
    }),
    {
      name: 'menu',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
