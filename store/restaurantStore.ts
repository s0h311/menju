import { Language } from '@/types/order.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type RestaurantState = {
  restaurantId: number
  language: Language
  tableId: string
  setRestaurantId: (restaurantId: number) => void
  setLanguage: (language: Language) => void
  setTableId: (tableId: string) => void
}

export const useRestaurantStore = create(
  persist<RestaurantState>(
    (set) => ({
      restaurantId: 0,
      language: 'de',
      tableId: '',
      setRestaurantId: (restaurantId: number) => set({ restaurantId }),
      setLanguage: (language: Language) => ({ language }),
      setTableId: (tableId: string) => set({ tableId }),
    }),
    {
      name: 'restaurant',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
