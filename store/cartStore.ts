import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Cart, OrderPosition, PaymentMethod } from '@/types/order.type'
import { addPosition, removePosition, updateNetTotal, updateNote, updatePaymentMethod } from './cartStore/cart.store'

export type CartState = {
  cart: Omit<Cart, 'restaurantId'>
  quantity: number
}

export type CartActions = {
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
  removePosition: (position: OrderPosition) => void
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void
  updateNote: (note: string) => void
  reset: () => void
}

const initialState: CartState = {
  cart: {
    tableId: '',
    positions: [],
    orderStatus: 'RECEIVED',
    paymentMethod: 'CARD',
    isPayed: false,
    netTotal: 0,
    vat: null,
    note: null,
  },
  quantity: 0,
}

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      cart: initialState.cart,
      quantity: initialState.quantity,
      setCart: (cart: Cart) => set({ cart }),
      removePosition: (position: OrderPosition) => {
        removePosition(get, set, position)
        set({ quantity: get().quantity - 1 })
        updateNetTotal(get, set, position.extraIngredients, true)
      },
      addPosition: (position: OrderPosition) => {
        addPosition(get, set, position)
        set({ quantity: get().quantity + 1 })
        updateNetTotal(get, set, position.extraIngredients)
      },
      updatePaymentMethod: (paymentMethod: PaymentMethod) => updatePaymentMethod(get, set, paymentMethod),
      updateNote: (note: string) => updateNote(get, set, note),
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
