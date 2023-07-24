import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import FoodItem from '@/app/components/food-item'
import { FoodItemModel } from '@/app/types/food-category.types'

type FoodCategoryProps = {
  label: string
  items: FoodItemModel[]
}

export default function FoodCategory({ label, items }: FoodCategoryProps) {
  return (
    <Box className='mt-4'>
      <Typography variant='h5' gutterBottom>
        {label}
      </Typography>
      <Divider orientation='horizontal' flexItem className='mb-2' />

      <Stack direction='row' spacing={2} className='mt-4 overflow-x-auto no-scrollbar'>
        {items.map((data) => (
          <FoodItem key={data.key} item={data} />
        ))}
      </Stack>
    </Box>
  )
}
