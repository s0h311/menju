import { Dish } from '@/types/dish.type'
import { MenuState } from '@/store/menuStore'

export type getState = () => MenuState
export type setState = (
  partial: MenuState | Partial<MenuState> | ((state: MenuState) => MenuState | Partial<MenuState>),
  replace?: boolean | undefined
) => void

export const addDish = (get: getState, set: setState, dish: Dish) => {
  const dishesByCategory = get().allDishes.find((dbc) => dbc.category.id === dish.categoryId)
  if (dishesByCategory) {
    dishesByCategory.dishes.push(dish)
  }
  set(() => ({
    allDishes: get().allDishes,
  }))
}

export const removeDish = (get: getState, set: setState, dishCategoryId: number, dishId: number) => {
  const dishesByCategory = get().allDishes.find((dbc) => dbc.category.id === dishCategoryId)
  const dishIndex = dishesByCategory?.dishes.findIndex((oldDish) => oldDish.id === dishId)

  if (dishesByCategory && dishIndex && dishIndex >= 0) {
    dishesByCategory.dishes.splice(dishIndex, 1)
  }

  set(() => ({
    allDishes: get().allDishes,
  }))
}
