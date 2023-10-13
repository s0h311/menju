import type { MenuState } from '@/store/menuStore'
import type { DishCategory } from '@/types/dish.type'

type getState = () => MenuState
type setState = (
  partial: MenuState | Partial<MenuState> | ((state: MenuState) => MenuState | Partial<MenuState>),
  replace?: boolean | undefined
) => void

export const addDishCategory = (get: getState, set: setState, dishCategory: DishCategory) =>
  set({
    allDishes: [
      ...get().allDishes,
      {
        category: dishCategory,
        dishes: [],
      },
    ],
  })

export const updateDishCategory = (get: getState, set: setState, dishCategory: DishCategory) => {
  const dishesByCategory = get().allDishes.find((dbc) => dbc.category.id === dishCategory.id)
  if (dishesByCategory) {
    dishesByCategory.category = dishCategory
  }
  set({ allDishes: get().allDishes })
}

export const removeDishCategory = (get: getState, set: setState, dishCategoryId: number) =>
  set({
    allDishes: get().allDishes.filter((dishesByCategory) => dishesByCategory.category.id !== dishCategoryId),
  })
