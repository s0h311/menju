import { Card, CardContent, CardMedia, Divider, Stack, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Dish } from '@/app/types/dish.type'
import DishDialog from '@/app/components/dishDialog'

type FoodItemProps = {
  dish: Dish
}

export default function FoodItem({ dish }: FoodItemProps) {
  const [activeDish, setActiveDish] = useState<Dish | null>(null)

  return (
    <Card
      sx={{ minWidth: 250 }}
      onClick={() => setActiveDish(dish)}
      className='cursor-pointer'
      key={dish.id}
    >
      {dish.picture ? (
        <CardMedia
          sx={{ height: 150 }}
          image={dish.picture}
          title={dish.name}
        />
      ) : (
        ''
      )}
      <CardContent>
        <div className='grid grid-flow-col'>
          <h1 className='text-lg'>{dish.name}</h1>
          <p className='place-self-end'>{dish.price}€</p>
        </div>

        <Stack
          mt={2}
          direction='row'
          justifyContent='center'
          alignItems='center'
          divider={
            <Divider
              orientation='vertical'
              flexItem
            />
          }
          spacing={2}
        >
          <ul>
            {dish.requiredIngredients.map((ingredient) => (
              <li
                className='text-sm flex items-center'
                key={ingredient}
              >
                <p className='text-sm leading-none'>{ingredient}</p>
              </li>
            ))}
          </ul>
          <ul>
            {dish.optionalIngredients.map((ingredient) => (
              <li
                className='text-sm flex items-center'
                key={ingredient}
              >
                <p className=''>{ingredient} (Optional)</p>
              </li>
            ))}
          </ul>
        </Stack>
      </CardContent>

      {activeDish ? (
        <DishDialog
          dish={activeDish}
          setOpenDialog={setActiveDish}
        />
      ) : (
        ''
      )}
    </Card>
  )
}
