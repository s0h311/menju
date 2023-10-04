import useStore from './useStore'
import { useEffect, experimental_useOptimistic as useOptimistic } from 'react'
import { Dish, DishCategory, DishesByCategory } from '@/types/dish.type'
import { trpc } from '@/trpc/trpc'
import { useMenuStore } from '@/store/menuStore'
import { DBDish, DBDishCategory } from '@/types/db/dish.db.type'
import { useRestaurantStore } from '@/store/restaurantStore'
import useTypeTransformer from './useTypeTranformer'
import { LanguageAndRestaurantId } from '@/types/order.type'

type UseDishConfigs = LanguageAndRestaurantId & { tableId: string }

const useDish = (configs?: UseDishConfigs) => {
  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)
  const menuStore = useStore(useMenuStore, (state) => state, true)
  const visibleDishes = menuStore?.visibleDishes
  const { dBdishToDish } = useTypeTransformer()

  const {
    data: trueDishesByCategory,
    isSuccess,
    refetch,
    isFetched,
  } = trpc.dishesByCategory.useQuery(
    {
      restaurantId: configs?.restaurantId ?? restaurantStore?.restaurantId ?? 0,
      language: configs?.language ?? restaurantStore?.language ?? 'de',
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    }
  )

  useEffect(() => {
    if (!restaurantStore) return

    if (configs) {
      restaurantStore.setRestaurantId(configs.restaurantId)
      restaurantStore.setLanguage(configs.language)
      restaurantStore.setTableId(configs.tableId)
    }

    if (menuStore?.allDishes.length === 0 && !isFetched) {
      refetch()
    }
  }, [restaurantStore, menuStore, configs, isFetched, refetch])

  useEffect(() => {
    if (menuStore && isSuccess) {
      menuStore?.setAllDishes(trueDishesByCategory)
    }
  }, [menuStore, trueDishesByCategory, isSuccess])

  const [dishesByCategory, setDishesByCategory] = useOptimistic<DishesByCategory[]>(menuStore?.allDishes ?? [])

  // OPTIMISCTIC MUTATIONS //

  const mutateDishCategoryOptimistic = (
    dishCategory: DBDishCategory,
    imageData: string | null,
    editingDishCategory?: DishCategory
  ) => {
    const newDishCategory: DishesByCategory = {
      category: { ...dishCategory, id: 0, name: dishCategory.name.de, picture: imageData },
      dishes: [],
    }

    setDishesByCategory((dbc) => {
      const newDishesByCategory = structuredClone(dbc)
      if (editingDishCategory) {
        const index = dbc.findIndex((dbc) => dbc.category.id === editingDishCategory.id)
        newDishesByCategory.splice(index, 1, newDishCategory)
        return newDishesByCategory
      }
      return [...dbc, newDishCategory]
    })
  }

  const mutateDishOptimistic = async (dbDish: DBDish, imageData: string | null, editingDish?: Dish): Promise<void> => {
    const newDish: Dish = dBdishToDish(dbDish, restaurantStore?.language ?? 'de')

    setDishesByCategory((currentDishesByCategory) => {
      const newDishesByCategory = structuredClone(currentDishesByCategory)

      let dishCategoryIndex = 0
      const dishCategory: DishesByCategory | undefined = newDishesByCategory.find((dbc, index) => {
        if (dbc.category.id === dbDish.id) {
          dishCategoryIndex = index
          return true
        }
        return false
      })

      if (!dishCategory) return newDishesByCategory

      if (editingDish) {
        const dishIndex = dishCategory?.dishes.findIndex((currentDish) => currentDish.id === dbDish.id)
        dishCategory?.dishes.splice(dishIndex, 1, newDish)

        return newDishesByCategory
      }
      dishCategory?.dishes.push(newDish)
      newDishesByCategory.splice(dishCategoryIndex, 1, dishCategory)
      return newDishesByCategory
    })
  }

  return {
    dishesByCategory,
    visibleDishes,
    mutateDishCategoryOptimistic,
    mutateDishOptimistic,
  }
}

export default useDish
