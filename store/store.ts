import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderPosition } from '@/app/types/order.type'
import { Dish, DishCategory, DishesByCategory } from '@/app/types/dish.type'
import { FilterChipModel } from '@/app/types/filter-chip.types'

type CartState = {
  cart: Cart
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
}

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: {
        table: '',
        positions: [],
        paymentMethod: 'CARD',
        isPayed: false,
        netTotal: 0,
        restaurantId: 0,
        vat: null,
        note: null,
      },
      setCart: (cart: Cart) => set(() => ({ cart: cart })),
      addPosition: (position: OrderPosition) =>
        set((state) => ({
          cart: {
            ...get().cart,
            positions: [...get().cart.positions, position],
          },
        })),
    }),
    {
      name: 'cart',
    }
  )
)
