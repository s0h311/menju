import type { OrderPosition, PaymentMethod } from '@/types/order.type'
import type { CartActions, CartState } from '../cartStore'

type State = CartState & CartActions
type getState = () => State
type setState = (
  partial: State | Partial<State> | ((state: State) => State | Partial<State>),
  replace?: boolean | undefined
) => void

export const removePosition = (get: getState, set: setState, position: OrderPosition) => {
  const currentPosition = get().cart.positions.find((currentPosition) => comparePositions(currentPosition, position))
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
}

export const addPosition = (get: getState, set: setState, position: OrderPosition) => {
  const currentPosition = get().cart.positions.find((currentPosition) => comparePositions(currentPosition, position))

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
}

export const updatePaymentMethod = (get: getState, set: setState, paymentMethod: PaymentMethod) =>
  set({
    cart: { ...get().cart, paymentMethod },
  })

export const updateNote = (get: getState, set: setState, note: string) =>
  set({
    cart: { ...get().cart, note },
  })

// HELPERS //

const comparePositions = (p1: OrderPosition, p2: OrderPosition): boolean =>
  p1.dish.id === p2.dish.id &&
  p1.leftOutIngredients.length === p2.leftOutIngredients.length &&
  p2.leftOutIngredients.every((p) => p1.leftOutIngredients.includes(p))
