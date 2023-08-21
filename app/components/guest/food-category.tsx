import {Box, Divider, Stack, ThemeProvider} from '@mui/material'
import React from 'react'
import FoodItem from './food-item'
import { DishCategory } from '@/app/types/dish.type'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'
import {theme} from "@/app/ui/theme";

type FoodCategoryProps = {
  category: DishCategory
}
export default function FoodCategory({ category }: FoodCategoryProps) {
  const menuStore = useStore(useMenuStore, (state) => state)

  return (
      <ThemeProvider theme={theme}>
      <Box className='mt-4'>
          <h1
              className='text-2xl'
          >
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
         </h1>
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
        {menuStore?.visibleDishes
          .filter((cat) => category.id === cat.category.id)
          .map((dish) =>
            dish.dishes.map((dish) => (
              <FoodItem
                key={dish.id}
                dish={dish}
              />
            ))
          )}
      </Stack>
    </Box>
      </ThemeProvider>
  )
}
