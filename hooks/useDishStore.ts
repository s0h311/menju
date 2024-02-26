import { type DishCategory, type DishesByCategory } from '@/types/dish.type'
import logger from '@/utils/logger'
import { useEffect, useState } from 'react'

const STORE_KEY = 'dishes'

function setDishes(dishes: DishesByCategory[]): void {
  if (isWindowDefinded()) {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(dishes))
  }
}

function addDishCategoryToStore(dishCategory: DishCategory): void {
  if (!isWindowDefinded()) {
    logger.error('Window is not defined')
    return
  }

  const stateJson = sessionStorage.getItem(STORE_KEY)

  if (!stateJson) {
    logger.error('No dishes found in session storage')
    return
  }

  const state: DishesByCategory[] = JSON.parse(stateJson)

  state.push({
    category: dishCategory,
    dishes: [],
  })

  setDishes(state)
}

function updateDishCategoryOnStore(dishCategory: DishCategory): void {
  if (!isWindowDefinded()) {
    logger.error('Window is not defined')
    return
  }

  const stateJson = sessionStorage.getItem(STORE_KEY)

  if (!stateJson) {
    logger.error('No dishes found in session storage')
    return
  }

  const state: DishesByCategory[] = JSON.parse(stateJson)

  const dishesByCategory = state.find((dbc) => dbc.category.id === dishCategory.id)

  if (!dishesByCategory) {
    logger.error('No dish category found, cannot update')
    return
  }

  dishesByCategory.category = dishCategory

  setDishes(state)
}

function useDishState() {
  const initalState: DishesByCategory[] = []

  const [state, setState] = useState<DishesByCategory[]>([])

  const dishesByCategory = isWindowDefinded()
    ? sessionStorage.getItem(STORE_KEY) ?? JSON.stringify(initalState)
    : JSON.stringify(initalState)

  useEffect(() => {
    setState(JSON.parse(dishesByCategory))
  }, [dishesByCategory])

  return state
}

function isWindowDefinded(): boolean {
  return typeof window !== 'undefined'
}

export { useDishState, addDishCategoryToStore, updateDishCategoryOnStore }
