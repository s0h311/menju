import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderPosition, PaymentMethod } from '@/types/order.type'
import { useRestaurantStore } from './restaurantStore'

type CartState = {
  cart: Cart
}

type CartActions = {
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
  removePosition: (position: OrderPosition) => void
  updatePaymentMethod: (method: PaymentMethod) => void
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
      setCart: (cart: Cart) => set({ cart }),
      reset: () => {
        set(initialState)
      },
      updateNote: (note: string) => {
        set({ cart: { ...get().cart, note } })
      },
      updatePaymentMethod: (method: PaymentMethod) =>
        set({
          cart: { ...get().cart, paymentMethod: method },
        }),
      removePosition: (position: OrderPosition) => {
        const currentPosition = get().cart.positions.find((currentPosition) =>
          comparePositions(currentPosition, position)
        )
        if (currentPosition && currentPosition.quantity > 1) {
          currentPosition.quantity--
          return set({
            cart: { ...get().cart, netTotal: get().cart.netTotal - position.dish.price },
          })
        }
        get().cart.positions.filter((currentPosition) => !comparePositions(currentPosition, position))
        set({
          cart: {
            ...get().cart,
            positions: get().cart.positions.filter((currentPosition) => !comparePositions(currentPosition, position)),
            netTotal: get().cart.netTotal - position.dish.price,
          },
        })
      },
      addPosition: (position: OrderPosition) => {
        const currentPosition = get().cart.positions.find((currentPosition) =>
          comparePositions(currentPosition, position)
        )

        if (currentPosition) {
          currentPosition.quantity++
          return set({
            cart: { ...get().cart, netTotal: get().cart.netTotal + position.dish.price },
          })
        }

        set({
          cart: {
            ...get().cart,
            positions: [...get().cart.positions, position],
            netTotal: get().cart.netTotal + position.dish.price,
          },
        })
      },
    }),
    {
      name: 'cart',
    }
  )
)

const comparePositions = (p1: OrderPosition, p2: OrderPosition): boolean =>
  p1.dish.id === p2.dish.id &&
  p1.leftOutIngredients.length === p2.leftOutIngredients.length &&
  p2.leftOutIngredients.every((p) => p1.leftOutIngredients.includes(p))
