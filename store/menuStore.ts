import { Dish, DishCategory, DishesByCategory } from '@/types/dish.type'
import { FilterChipModel } from '@/types/filterChip.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { addDish, removeDish, updateDish } from '@/store/menuStore/dish.store'
import { addDishCategory, removeDishCategory, updateDishCategory } from '@/store/menuStore/dishCategory.store'
import { filter, setAllDishes, setVisibleDishes, updateFilter } from '@/store/menuStore/filter.store'

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

export const useMenuStore = create(
  persist<MenuState>(
    (set, get) => ({
      allDishes: [],
      visibleDishes: [],
      activeFilter: [],
      updateFilter: (filter: FilterChipModel) => updateFilter(get, set, filter),
      filter: () => filter(get, set),
      setAllDishes: (dishes: DishesByCategory[]) => setAllDishes(get, set, dishes),
      setVisibleDishes: (dishes: DishesByCategory[]) => setVisibleDishes(get, set, dishes),

      addDishCategory: (dishCategory: DishCategory) => addDishCategory(get, set, dishCategory),
      updateDishCategory: (dishCategory: DishCategory) => updateDishCategory(get, set, dishCategory),
      removeDishCategory: (dishCategoryId: number) => removeDishCategory(get, set, dishCategoryId),

      addDish: (dish: Dish) => addDish(get, set, dish),
      updateDish: (dish: Dish) => updateDish(get, set, dish),
      removeDish: (dishCategoryId: number, dishId: number) => removeDish(get, set, dishCategoryId, dishId),
    }),
    {
      name: 'menu',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
