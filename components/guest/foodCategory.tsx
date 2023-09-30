import { Box, Divider, Stack } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import FoodItem from './foodItem'
import { Dish, DishCategory } from '@/types/dish.type'
import { useMenuStore } from '@/store/menuStore'
import useStore from '@/hooks/useStore'
import { theme } from '@/ui/theme'

type FoodCategoryProps = {
  category: DishCategory
  onCardClick: (dish: Dish) => void
}
export default function FoodCategory({ category, onCardClick }: FoodCategoryProps) {
  const menuStore = useStore(useMenuStore, (state) => state)

  return (
    <ThemeProvider theme={theme}>
      <Box className='mt-4'>
        <h1 className='text-2xl'>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h1>
        <Divider
          orientation='horizontal'
          flexItem
          className='mb-2'
        />

        <Stack
          direction='row'
          spacing={2}
          className='overflow-x-auto no-scrollbar p-1'
        >
          {menuStore?.visibleDishes.length &&
            menuStore.visibleDishes
              .filter((cat) => category.id === cat.category.id)
              .map((dish) =>
                dish.dishes.map((dish) => (
                  <FoodItem
                    key={dish.id}
                    dish={dish}
                    onClick={() => onCardClick(dish)}
                  />
                ))
              )}
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
