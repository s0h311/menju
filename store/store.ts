import { create } from 'zustand'
import { Cart, OrderPosition } from '@/app/types/order.type'

type CartState = {
  cart: Cart
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
}

export const useCartStore = create<CartState>((set) => ({
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
        ...state.cart,
        positions: [...state.cart.positions, position],
      },
    })),
}))
