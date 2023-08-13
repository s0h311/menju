import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import FoodItem from '@/app/components/food-item'
import { DishCategory } from '@/app/types/dish.type'
import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'

type FoodCategoryProps = {
  category: DishCategory
}
export default function FoodCategory({ category }: FoodCategoryProps) {
  const menuStore = useStore(useMenuStore, (state) => state)

  return (
    <Box className='mt-4'>
      <Typography
        variant='h5'
        gutterBottom
      >
        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
      </Typography>
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
  )
}
