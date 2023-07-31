import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import FoodItem from '@/app/components/food-item'
import { DishCategory, DishesByCategory } from '@/app/types/dish.type'

type FoodCategoryProps = {
  dishesByCategory: DishesByCategory
}

export default function FoodCategory({ dishesByCategory }: FoodCategoryProps) {
  return (
    <Box className='mt-4'>
      <Typography
        variant='h5'
        gutterBottom
      >
        {dishesByCategory.category.name}
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
        {dishesByCategory.dishes.map((dish) => (
          <FoodItem
            key={dish.id}
            dish={dish}
          />
        ))}
      </Stack>
    </Box>
  )
}
