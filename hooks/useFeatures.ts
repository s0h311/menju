import { useRestaurantStore } from '@/store/restaurantStore'
import useStore from './useStore'
import { PaymentMethod } from '@/types/order.type'
import { CartType, defaultFeatures } from '@/types/restaurant.type'

const useFeatures = () => {
  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)

  const isFilterBarEnabled: boolean =
    restaurantStore?.features?.isFilterBarEnabled ?? defaultFeatures.isFilterBarEnabled
  const cartType: CartType = restaurantStore?.features?.cartType ?? defaultFeatures.cartType
  const enabledPaymentMethods: PaymentMethod[] =
    restaurantStore?.features?.enabledPaymentMethods ?? defaultFeatures.enabledPaymentMethods

  return {
    isFilterBarEnabled,
    cartType,
    enabledPaymentMethods,
  }
}

export default useFeatures
