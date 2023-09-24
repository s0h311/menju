import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Cart, OrderPosition, PaymentMethod } from '@/types/order.type'
import { useRestaurantStore } from './restaurantStore'
import { addPosition, removePosition, updateNote, updatePaymentMethod } from './cartStore/cart.store'

export type CartState = {
  cart: Cart
}

export type CartActions = {
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
  removePosition: (position: OrderPosition) => void
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void
  updateNote: (note: string) => void
  reset: () => void
}

const restaurantId = useRestaurantStore.getState().restaurantId

const initialState: CartState = {
  cart: {
    table: '',
    positions: [],
    paymentMethod: 'CARD',
    isPayed: false,
    netTotal: 0,
    restaurantId,
    vat: null,
    note: null,
  },
}

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      cart: initialState.cart,
      setCart: (cart: Cart) => set({ cart }),
      removePosition: (position: OrderPosition) => removePosition(get, set, position),
      addPosition: (position: OrderPosition) => addPosition(get, set, position),
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
