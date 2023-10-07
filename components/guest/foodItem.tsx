import { Card, CardContent, CardMedia, Divider, Stack } from '@mui/material'
import { Dish } from '@/types/dish.type'
import Image from 'next/image'

type FoodItemProps = {
  dish: Dish
  priority: boolean
  onClick: () => void
}

export default function FoodItem({ dish, priority, onClick }: FoodItemProps) {
  return (
    <Card
      sx={{ minWidth: 250 }}
      onClick={onClick}
      className='cursor-pointer border-solid border-2'
      key={dish.id}
    >
      {dish.picture && (
        <CardMedia sx={{ height: 150, position: 'relative' }}>
          <Image
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
            src={dish.picture}
            fill
            sizes='(max-width: 414px) 60vw, (max-width: 768px) 45vw, 20vw'
            quality={70}
            priority={priority}
            alt={dish.name}
          />
        </CardMedia>
      )}
      <CardContent>
        <div className='grid grid-flow-col'>
          <h1 className='text-lg'>{dish.name}</h1>
          <p className='place-self-end'>{dish.price.toFixed(2)}€</p>
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
          <ul className='list-none'>
            {dish.ingredients.required.map((ingredient) => (
              <li
                className='text-sm flex items-center'
                key={ingredient}
              >
                {ingredient}
              </li>
            ))}
          </ul>
          <ul className='list-none'>
            {dish.ingredients.optional.map((ingredient) => (
              <li
                className='text-sm flex items-center'
                key={ingredient}
              >
                {ingredient} (Optional)
              </li>
            ))}
          </ul>
        </Stack>
      </CardContent>
    </Card>
  )
}
