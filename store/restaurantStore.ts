import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RestaurantState = {
  restaurantId: number
  setRestaurantId: (restaurantId: number) => void
}

export const useRestaurantStore = create(
  persist<RestaurantState>(
    (set) => ({
      restaurantId: 0,
      setRestaurantId: (restaurantId: number) => set(() => ({ restaurantId })),
    }),
    { name: 'restaurant' }
  )
)
