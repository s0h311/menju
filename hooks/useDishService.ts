import { trpc } from '@/trpc/trpc'
import { Language, LanguageAndRestaurantId } from '../types/order.type'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useEffect, useState } from 'react'
import { DishesByCategory } from '@/types/dish.type'
import useStore from '@/hooks/useStore'
import { useMenuStore } from '@/store/menuStore'

export default function useDishService(configs?: LanguageAndRestaurantId) {
  // RESTAURANT ID & LANGUAGE //

  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)

  const [dataOutdated, setDataOutdated] = useState<boolean>(true)

  const isDataOutdated = (configs: LanguageAndRestaurantId, storeRestaurantId: number, storeLanguage: Language) =>
    configs.restaurantId !== storeRestaurantId || configs.language !== storeLanguage

  useEffect(() => {
    if (
      restaurantStore &&
      configs &&
      configs.restaurantId &&
      isDataOutdated(configs, restaurantStore.restaurantId, restaurantStore.language)
    ) {
      restaurantStore.setRestaurantId(configs.restaurantId)
      restaurantStore.setLanguage(configs.language)
      setDataOutdated(true)
    } else {
      setDataOutdated(false)
    }
  }, [configs, restaurantStore])

  // DISHES & DISH CATEGORY //

  const menuStore = useStore(useMenuStore, (state) => state, true)

  const {
    data: dishesByCategoryData,
    isSuccess: isSuccessDishesByCategory,
    refetch: refetchDishes,
  } = trpc.dishesByCategory.useQuery(
    {
      restaurantId: (configs?.restaurantId || restaurantStore?.restaurantId)!,
      language: (configs?.language || restaurantStore?.language)!,
    },
    { enabled: dataOutdated, refetchOnWindowFocus: false }
  )

  const [dishesByCategory, setDishesByCategory] = useState<DishesByCategory[]>([])
  const visibleDishes = menuStore?.visibleDishes

  useEffect(() => {
    refetchDishes()
  }, [dataOutdated, refetchDishes])

  useEffect(() => {
    if (isSuccessDishesByCategory && menuStore) {
      menuStore.setAllDishes(dishesByCategoryData)
      setDishesByCategory(menuStore.allDishes)
    }
  }, [dishesByCategoryData, isSuccessDishesByCategory, menuStore])

  // EXPORTING FUNCTIONS //

  const setRestaurantId = (restaurantId: number) => {
    if (restaurantId !== restaurantStore?.restaurantId) {
      restaurantStore?.setRestaurantId(restaurantId)
      setDataOutdated(true)
    }
  }

  const setLanguage = (language: Language) => {
    if (language !== restaurantStore?.language) {
      restaurantStore?.setLanguage(language)
      setDataOutdated(true)
    }
  }

  return {
    dishesByCategory,
    visibleDishes,
    setRestaurantId,
    setLanguage,
  }
}
