import { Card, CardContent, CardMedia } from '@mui/material'
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
      sx={{ minWidth: 250, maxWidth: 250, maxHeight: '40dvh' }}
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

        <p className='overflow-hidden text-ellipsis text-sm text-slate-600'>
          {[...dish.ingredients.required, ...dish.ingredients.optional].join(', ')}
        </p>
      </CardContent>
    </Card>
  )
}
