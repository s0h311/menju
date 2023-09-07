import { Language } from '@/types/order.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type RestaurantState = {
  restaurantId: number
  language: Language
  setRestaurantId: (restaurantId: number) => void
  setLanguage: (language: Language) => void
}

export const useRestaurantStore = create(
  persist<RestaurantState>(
    (set) => ({
      restaurantId: 0,
      language: 'de',
      setRestaurantId: (restaurantId: number) => set({ restaurantId }),
      setLanguage: (language: Language) => ({ language }),
    }),
    {
      name: 'restaurant',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
