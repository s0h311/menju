import type { DishesByCategory } from '@/types/dish.type'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getDishesByCategory } from '@/app/api/menu'
import { useRestaurantInfo } from './useRestaurant'

function useDishes(): UseQueryResult<DishesByCategory[]> {
  const { restaurantId, language } = useRestaurantInfo()

  const query = useQuery({
    queryKey: ['dischesByCategory', restaurantId, language],
    queryFn: () => getDishesByCategory(restaurantId, language),
    refetchOnWindowFocus: false,
    retry: 1,
  })
  return query
}

export { useDishes }
