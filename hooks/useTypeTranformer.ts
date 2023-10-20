import type { DBDish, DBDishCategory, DBMultiLanguageStringProperty } from '@/types/db/dish.db.type'
import type { DBOrder } from '@/types/db/order.db.type'
import type { Dish, DishCategory } from '@/types/dish.type'
import type { Language, Order } from '@/types/order.type'
import { useCallback } from 'react'

export default function useTypeTransformer() {
  const stringToDBMultiLanguageString = (str: string): DBMultiLanguageStringProperty => ({
    de: str,
    en: '',
    it: '',
  })

  const stringArrayToDBMultiLanguageStringArray = useCallback(
    (arr: string[]): DBMultiLanguageStringProperty[] => arr.map((element) => stringToDBMultiLanguageString(element)),
    []
  )

  const dishToDBDish = useCallback(
    (dish: Dish): DBDish => ({
      ...dish,
      name: stringToDBMultiLanguageString(dish.name),
      ingredients: {
        required: stringArrayToDBMultiLanguageStringArray(dish.ingredients.required),
        optional: stringArrayToDBMultiLanguageStringArray(dish.ingredients.optional),
        extra: dish.ingredients.extra.map((ingredient) => ({
          name: stringToDBMultiLanguageString(ingredient.name),
          price: ingredient.price,
        })),
      },
      labels: !dish.labels ? null : stringArrayToDBMultiLanguageStringArray(dish.labels),
      allergies: !dish.allergies ? null : stringArrayToDBMultiLanguageStringArray(dish.allergies),
      description: !dish.description ? null : stringToDBMultiLanguageString(dish.description),
    }),
    [stringArrayToDBMultiLanguageStringArray]
  )

  const dBdishToDish = useCallback(
    (dish: DBDish, language: Language): Dish => ({
      ...dish,
      id: dish.id ?? 0,
      name: dish.name[language],
      ingredients: {
        required: dish.ingredients.required.map((ingredient) => ingredient[language]),
        optional: dish.ingredients.optional.map((ingredient) => ingredient[language]),
        extra: dish.ingredients.extra.map((ingredient) => ({
          name: ingredient.name[language],
          price: ingredient.price,
        })),
      },
      labels: !dish.labels ? [] : dish.labels.map((label) => label[language]),
      allergies: !dish.allergies ? [] : dish.allergies.map((allergy) => allergy[language]),
      description: !dish.description ? null : dish.description[language],
    }),
    []
  )

  const dishCategoryToDBDishCategory = useCallback(
    (dishCategory: DishCategory): DBDishCategory => ({
      ...dishCategory,
      name: stringToDBMultiLanguageString(dishCategory.name),
    }),
    []
  )

  const dbOrderToOrder = useCallback(
    (dbOrder: DBOrder): Order => ({
      ...dbOrder,
      id: dbOrder.id,
      tableId: dbOrder.table_id,
      orderStatus: dbOrder.order_status,
      paymentMethod: dbOrder.payment_method,
      isPayed: dbOrder.is_payed,
      netTotal: dbOrder.net_total,
      restaurantId: dbOrder.restaurant_id,
    }),
    []
  )

  const orderToDBOrder = useCallback(
    (order: Order): DBOrder => ({
      ...order,
      table_id: order.tableId,
      order_status: order.orderStatus,
      payment_method: order.paymentMethod,
      is_payed: order.isPayed,
      net_total: order.netTotal,
      restaurant_id: order.restaurantId,
    }),
    []
  )

  return {
    dishCategoryToDBDishCategory,
    dishToDBDish,
    dBdishToDish,
    dbOrderToOrder,
    orderToDBOrder,
  }
}
