import { useRestaurantStore } from '@/store/restaurantStore'
import useStore from './useStore'
import type { PaymentMethod } from '@/types/order.type'
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

export default useRestaurant
