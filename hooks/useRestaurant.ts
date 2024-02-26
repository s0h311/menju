'use client'

import { useRestaurantStore } from '@/store/restaurantStore'
import useStore from './useStore'
import type { Language, PaymentMethod } from '@/types/order.type'
import type { CartType, Colors, Features } from '@/types/restaurant.type'
import { defaultFeatures } from '@/types/restaurant.type'
import { useEffect, useState } from 'react'

const useRestaurant = () => {
  const restaurantStore = useStore(useRestaurantStore, (state) => state, true)

  const isFilterBarEnabled: boolean =
    restaurantStore?.features?.isFilterBarEnabled ?? defaultFeatures.isFilterBarEnabled
  const cartType: CartType = restaurantStore?.features?.cartType ?? defaultFeatures.cartType
  const enabledPaymentMethods: PaymentMethod[] =
    restaurantStore?.features?.enabledPaymentMethods ?? defaultFeatures.enabledPaymentMethods
  const logoUrl: string | null = restaurantStore?.logoUrl ?? null
  const colors: Colors | null = restaurantStore?.colors ?? null

  return {
    isFilterBarEnabled,
    cartType,
    enabledPaymentMethods,
    logoUrl,
    colors,
  }
}

type RestaurantState = {
  restaurantId: number
  name: string
  abbreviation: string
  features: Features
  language: Language
  tableId: string
  colors: Colors | null
  logoUrl: string | null
}

const initialState: RestaurantState = {
  restaurantId: 0,
  name: '',
  abbreviation: '',
  features: defaultFeatures,
  language: 'de',
  tableId: '',
  colors: null,
  logoUrl: null,
}

function initRestaurant(state: Partial<RestaurantState>): void {
  if (!sessionStorage.getItem('restaurant')) {
    sessionStorage.setItem(
      'restaurant',
      JSON.stringify({
        ...initialState,
        ...state, // Override default values
      })
    )
  }
}

function updateRestaurantState(state: Partial<RestaurantState>): void {
  const currentState = sessionStorage.getItem('restaurant')

  if (!currentState) {
    throw new Error('Restaurant not found in session storage')
  }

  const restaurant = JSON.parse(currentState)
  sessionStorage.setItem(
    'restaurant',
    JSON.stringify({
      ...restaurant,
      ...state,
    })
  )
}

function useRestaurantState(): RestaurantState {
  const [state, setState] = useState<RestaurantState>(initialState)

  const restaurant = isWindowDefinded() ? sessionStorage.getItem('restaurant') : JSON.stringify(initialState)

  useEffect(() => {
    setState(JSON.parse(restaurant ?? JSON.stringify(initialState)))
  }, [restaurant])

  return state
}

function isWindowDefinded(): boolean {
  return typeof window !== 'undefined'
}

export { useRestaurant, initRestaurant, updateRestaurantState, useRestaurantState }
