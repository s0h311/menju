import Dialog from '@/app/ui/dialog'
import { Checkbox, ThemeProvider } from '@mui/material'
import { Dish } from '@/app/types/dish.type'
import Image from 'next/image'
import { useState } from 'react'
import { OrderPosition } from '../../types/order.type'
import { useCartStore } from '@/store/cart-store'
import { theme } from '@/app/ui/theme'

type DishDialogProps = {
  dish: Dish
  setOpenDialog: (value: Dish | null) => void
}

export default function DishDialog({ dish, setOpenDialog }: DishDialogProps) {
  const { addPosition } = useCartStore((state) => state)

  const addToBasket = () => {
    addPosition(order)
    setOpenDialog(null)
  }

  const [order, setOrder] = useState<OrderPosition>({
    dish,
    quantity: 1,
    leftOutIngredients: [],
  })

  const onIngredientCheckboxChange = (ingredient: string) => {
    let leftOutIngredients = [...order.leftOutIngredients, ingredient]

    if (order.leftOutIngredients.includes(ingredient)) {
      leftOutIngredients = order.leftOutIngredients.filter((leftoutIngredient) => leftoutIngredient !== ingredient)
    }

    setOrder({
      ...order,
      leftOutIngredients,
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={dish !== null}
        onClose={() => setOpenDialog(null)}
        onProceed={() => addToBasket()}
        closeText='Heute nicht'
        proceedText='Ich wills'
      >
        {dish.picture && (
          <Image
            className='rounded-t-2xl mb-2'
            src={dish.picture}
            width={500}
            height={400}
            quality={80}
            alt={`${dish.name} Bild`}
          />
        )}

        <div className='grid gap-3 px-5'>
          <div className='grid grid-flow-col'>
            <h1 className='text-lg'>{dish.name}</h1>
            <p className='place-self-end'>{dish.price}€</p>
          </div>

          <div className='flex space-x-2 whitespace-nowrap overflow-x-scroll no-scrollbar cursor-pointer'>
            {dish.labels.map((label) => (
              <p
                className='rounded-xl px-2 py-1 bg-accent text-secondary text-sm'
                key={label}
              >
                {label}
              </p>
            ))}
          </div>

          <div className='grid gap-1'>
            <h3>Nährwerte pro 100g*</h3>
            <div className='flex items-center gap-2'>
              <p className='text-sm'>Kalorien:</p>
              <p className='rounded-xl px-2 py-1 bg-secondary text-sm'>{dish.nutritions?.energy} kcal</p>
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-sm'>Protein:</p>
              <p className='rounded-xl px-2 py-1 bg-secondary text-sm'>{dish.nutritions?.protein} g</p>
            </div>
          </div>

          <div>
            <h3>Zutaten</h3>
            <ul className='grid grid-cols-2'>
              {dish.requiredIngredients.map((ingredient) => (
                <li
                  className='text-sm flex items-center'
                  key={ingredient}
                >
                  <Checkbox
                    color='accent'
                    size='small'
                    defaultChecked
                    disabled
                  />
                  <p className='text-sm leading-none'>{ingredient}</p>
                </li>
              ))}
            </ul>

            <ul className='grid grid-cols-2'>
              {dish.optionalIngredients.map((ingredient) => (
                <li
                  className='text-sm flex items-center cursor-pointer'
                  key={ingredient}
                  onClick={() => onIngredientCheckboxChange(ingredient)}
                >
                  <Checkbox
                    color='accent'
                    size='small'
                    checked={!order.leftOutIngredients.includes(ingredient)}
                  />
                  <p className='text-sm leading-none'>{ingredient}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className='text-sm'>{dish.description}</p>

          <p className='text-[10px]'>*Durchschnittswerte</p>
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
