import { trpc } from '@/trpc/trpc'
import { LanguageAndRestaurantId } from '../types/order.type'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useEffect, useState } from 'react'
import { DishesByCategory } from '../types/dish.type'
import useStore from '@/store/nextjs-hook'

export default function useDishService(configs?: LanguageAndRestaurantId) {
  // STORES
  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)

  useEffect(() => {
    if (configs) {
      restaurantStore?.setRestaurantId(configs.restaurantId)
    }
  }, [configs, restaurantStore])

  // LOAD CONFIGS
  if (restaurantStore && !restaurantStore.restaurantId && !configs?.restaurantId) {
    throw new Error("'restaurantId' must be present")
  }

  // eslint-disable-next-line
  // @ts-ignore
  const restaurantId: number = configs.restaurantId || restaurantStore.restaurantId

  // TRPC Queries
  const { data: dishesByCategoryData, isSuccess: isSuccessDishesByCategory } = trpc.dishesByCategory.useQuery({
    restaurantId,
    language: 'de',
  })

  // FETCH
  const [dishesByCategory, setDishesByCategory] = useState<DishesByCategory[]>([])
  useEffect(() => {
    if (isSuccessDishesByCategory) {
      setDishesByCategory(dishesByCategoryData)
    }
  }, [dishesByCategoryData, isSuccessDishesByCategory])

  return {
    dishesByCategory,
  }
}
