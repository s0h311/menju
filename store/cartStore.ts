import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderPosition } from '@/types/order.type'
import { useRestaurantStore } from './restaurantStore'

type CartState = {
  cart: Cart
  setCart: (cart: Cart) => void
  addPosition: (position: OrderPosition) => void
}

const restaurantId = useRestaurantStore.getState().restaurantId

export const useCartStore = create(
  persist<CartState>(
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
      setCart: (cart: Cart) => set(() => ({ cart: cart })),
      addPosition: (position: OrderPosition) => {
        const currentPosition = get().cart.positions.find((currentPosition) => {
          currentPosition.dish.id === position.dish.id &&
            currentPosition.leftOutIngredients.every((p) => position.leftOutIngredients.includes(p))
          //TODO funktioniert nicht
        })
        if (currentPosition) {
          currentPosition.quantity++
          return set(() => ({
            cart: get().cart,
          }))
        }
        set(() => ({
          cart: {
            ...get().cart,
            positions: [...get().cart.positions, position],
          },
        }))
      },
    }),
    {
      name: 'cart',
    }
  )
)
