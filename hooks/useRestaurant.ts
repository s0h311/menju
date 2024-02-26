import { useRestaurantStore } from '@/store/restaurantStore'
import useStore from './useStore'
import type { LanguageAndRestaurantId, PaymentMethod } from '@/types/order.type'
import type { CartType, Colors } from '@/types/restaurant.type'
import { defaultFeatures } from '@/types/restaurant.type'

const useRestaurant = () => {
  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)

  const isFilterBarEnabled: boolean =
    restaurantStore?.features?.isFilterBarEnabled ?? defaultFeatures.isFilterBarEnabled
  const cartType: CartType = restaurantStore?.features?.cartType ?? defaultFeatures.cartType
  const enabledPaymentMethods: PaymentMethod[] =
    restaurantStore?.features?.enabledPaymentMethods ?? defaultFeatures.enabledPaymentMethods
  const logoUrl: string | null = restaurantStore?.logoUrl ?? null
  const colors: Colors | null = restaurantStore?.colors ?? null

  return {
    isFilterBarEnabled,
    cartType,
    enabledPaymentMethods,
    logoUrl,
    colors,
  }
}

type RestaurantConfig = LanguageAndRestaurantId & { tableId?: string }

function initRestaurant(configs: RestaurantConfig): void {
  if (!sessionStorage.getItem('restaurant')) {
    sessionStorage.setItem('restaurant', JSON.stringify(configs))
  }
}

function useRestaurantInfo(): RestaurantConfig {
  const restaurant = sessionStorage.getItem('restaurant')

  if (!restaurant) {
    throw new Error('Restaurant not found in session storage')
  }

  return JSON.parse(restaurant)
}

export { useRestaurant, initRestaurant, useRestaurantInfo }
