import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderPosition } from '@/app/types/order.type'
import { Cart } from '@/app/types/order.type'
import { Dish } from '@/app/types/dish.type'
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
export type MenuState = {
  allDishes: Dish[]
  visibleDishes: Dish[]
  toggleFilter: (activeFilter: FilterChipModel[]) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  allDishes: [],
  visibleDishes: [],
  toggleFilter: (activeFilters: FilterChipModel[]) => {
    set((state) => {
      return {
        visibleDishes: state.visibleDishes.filter((dish: Dish) =>
          activeFilters.every(
            (filter: FilterChipModel) => dish.labels.includes(filter.label) || dish.allergies.includes(filter.label)
          )
        ),
      }
    })
  },
}))

export const useCartStore = create<CartState>((set) => ({
  cart: {
    table: '',
    positions: [],
    paymentMethod: 'CARD',
    isPayed: false,
    netTotal: 0,
    restaurantId: 0,
    vat: undefined,
    note: undefined,
  },
  setCart: (cart: Cart) => set(() => ({ cart: cart })),
}))
