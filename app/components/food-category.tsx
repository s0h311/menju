import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import FoodItem from '@/app/components/food-item'
import { Dish, DishCategory } from '@/app/types/dish.type'

type FoodCategoryProps = {
  category: DishCategory
  dishes: Dish[]
}

export default function FoodCategory({ dishes, category }: FoodCategoryProps) {
  return (
    <Box className='mt-4'>
      <Typography
        variant='h5'
        gutterBottom
      >
        {category.name}
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
        {dishes.map((dish) => (
          <FoodItem
            key={dish.id}
            dish={dish}
          />
        ))}
      </Stack>
    </Box>
  )
}
