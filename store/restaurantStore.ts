import type { Language } from '@/types/order.type'
import type { Features } from '@/types/restaurant.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type RestaurantState = {
  restaurantId: number
  name: string
  abbreviation: string
  features: Features | null
  language: Language
  tableId: string
  logoUrl: string | null
  setRestaurantId: (restaurantId: number) => void
  setName: (name: string) => void
  setAbbreviation: (abbreviation: string) => void
  setFeatures: (features: Features) => void
  setLanguage: (language: Language) => void
  setTableId: (tableId: string) => void
  setLogoUrl: (logoUrl: string | null) => void
}

export const useRestaurantStore = create(
  persist<RestaurantState>(
    (set) => ({
      restaurantId: 0,
      name: '',
      abbreviation: '',
      features: null,
      language: 'de',
      tableId: '',
      logoUrl: null,
      setRestaurantId: (restaurantId: number) => set({ restaurantId }),
      setName: (name: string) => set({ name }),
      setAbbreviation: (abbreviation: string) => set({ abbreviation }),
      setFeatures: (features: Features) => set({ features }),
      setLanguage: (language: Language) => ({ language }),
      setTableId: (tableId: string) => set({ tableId }),
      setLogoUrl: (logoUrl: string | null) => set({ logoUrl }),
    }),
    {
      name: 'restaurant',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
