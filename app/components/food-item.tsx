import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { Dish } from '@/app/types/dish.type'
import { useMenuStore } from '@/store/menu-store'

type FoodItemProps = {
  dish: Dish
}

export default function FoodItem({ dish }: FoodItemProps) {
  {
    const menuStore = useMenuStore((state) => state)
    return (
      <Card sx={{ minWidth: 300 }}>
        <CardContent>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
          >
            {dish.name}
          </Typography>
          <div className='flex flex-wrap -mx-2'>
            {[...dish.optionalIngredients].map((ingredient, index) => (
              <Typography
                key={index}
                variant='subtitle2'
                className='w-1/1 px-4 mb-4'
              >
                {ingredient}
              </Typography>
            ))}
          </div>
          <Typography
            variant='button'
            color='text.secondary'
            className='self-end'
          >
            {dish.price}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}
