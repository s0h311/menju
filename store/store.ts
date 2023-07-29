import { create } from 'zustand'
import { Cart } from '@/app/types/order.type'

type CartState = {
  cart: Cart
  setCart: (cart: Cart) => void
}

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
