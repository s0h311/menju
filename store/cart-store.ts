import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderPosition } from '@/app/types/order.type'

type CartState = {
  cart: Cart
}

type CartActions = {
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
  reset: () => void
}

const initialState: CartState = {
  cart: {
    table: '',
    positions: [],
    netTotal: 0,
    vat: null,
    note: null,
    restaurantId: 1,
    paymentMethod: 'UNDECIDED',
    isPayed: false,
  },
}

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      cart: {
        table: '1',
        positions: [],
        paymentMethod: 'UNDECIDED',
        isPayed: false,
        netTotal: 0,
        restaurantId: 1,
        vat: null,
        note: null,
      },
      setCart: (cart: Cart) => set(() => ({ cart: cart })),
      reset: () => {
        set(initialState)
      },

      addPosition: (position: OrderPosition) =>
        set((state) => ({
          cart: {
            ...get().cart,
            positions: [...get().cart.positions, position],
            netTotal: get().cart.netTotal + position.dish.price * position.quantity,
          },
        })),
    }),
    {
      name: 'cart',
    }
  )
)
