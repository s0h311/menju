import Dialog from '@/ui/dialog'
import { Checkbox } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { Dish } from '@/types/dish.type'
import { useState } from 'react'
import { OrderPosition } from '@/types/order.type'
import { useCartStore } from '@/store/cartStore'
import { theme } from '@/ui/theme'
import useStore from '@/hooks/useStore'

type DishDialogProps = {
  dish: Dish
  setOpenDialog: (value: Dish | null) => void
}

// TODO in mehrere Komponente aufteilen
export default function DishDialog({ dish, setOpenDialog }: DishDialogProps) {
  const cartStore = useStore(useCartStore, (state) => state)

  const [order, setOrder] = useState<OrderPosition>({
    dish,
    quantity: 1,
    leftOutIngredients: [],
  })

  const addToBasket = () => {
    cartStore?.addPosition(order)
    setOpenDialog(null)
  }

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
        sx={{ p: 0 }}
        open={dish !== null}
        onClose={() => setOpenDialog(null)}
        onProceed={() => addToBasket()}
        closeText='Heute nicht'
        proceedText='Ich wills'
        imageData={dish.picture ? { src: dish.picture, alt: `${dish.name} Bild` } : null}
      >
        <div className='grid gap-3 px-5'>
          <div className='grid grid-flow-col'>
            <h1 className='text-lg'>{dish.name}</h1>
            <p className='place-self-end'>{dish.price.toFixed(2)}€</p>
          </div>

          <div className='flex space-x-2 whitespace-nowrap overflow-x-scroll no-scrollbar cursor-pointer'>
            {dish.labels.map((label) => (
              <p
                className='rounded-xl px-2 py-1 bg-primary text-text text-sm'
                key={label}
              >
                {label}
              </p>
            ))}
          </div>

          {/* Nährwerte */}
          {dish.nutritions && (dish.nutritions.energy > 0 || dish.nutritions.protein > 0) && (
            <div className='grid gap-1'>
              <h3>Nährwerte pro 100g*</h3>
              <div className='flex items-center gap-2 ml-2'>
                <p className='text-sm'>Kalorien:</p>
                <p className='rounded-xl px-2 py-1 bg-secondary text-sm'>{dish.nutritions.energy} kcal</p>
              </div>
              <div className='flex items-center gap-2 ml-2'>
                <p className='text-sm'>Protein:</p>
                <p className='rounded-xl px-2 py-1 bg-secondary text-sm'>{dish.nutritions.protein} g</p>
              </div>
            </div>
          )}

          {(dish.ingredients.required.length > 0 || dish.ingredients.optional.length > 0) && (
            <div>
              <h3>Zutaten</h3>
              <ul className='grid grid-cols-2'>
                {dish.ingredients.required.map((ingredient) => (
                  <li
                    className='text-sm flex items-center'
                    key={ingredient}
                  >
                    <Checkbox
                      sx={{ paddingLeft: '8px' }}
                      color='primary'
                      size='small'
                      defaultChecked
                      disabled
                    />
                    <p className='text-sm leading-none'>{ingredient}</p>
                  </li>
                ))}
              </ul>

              <ul className='grid grid-cols-2'>
                {dish.ingredients.optional.map((ingredient) => (
                  <li
                    className='text-sm flex items-center cursor-pointer'
                    key={ingredient}
                    onClick={() => onIngredientCheckboxChange(ingredient)}
                  >
                    <Checkbox
                      sx={{ paddingLeft: '8px' }}
                      color='primary'
                      size='small'
                      checked={!order.leftOutIngredients.includes(ingredient)}
                    />
                    <p className='text-sm leading-none'>{ingredient}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dish.allergies.length > 0 && (
            <div>
              <h3>Allergene</h3>
              <ul className='ml-2 grid grid-cols-2'>
                {dish.allergies.map((allergy) => (
                  <li
                    className='text-sm flex'
                    key={allergy}
                  >
                    {allergy}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className='text-sm'>{dish.description}</p>

          {dish.nutritions && (dish.nutritions.energy > 0 || dish.nutritions.protein > 0) && (
            <p className='text-[10px]'>*Durchschnittswerte</p>
          )}
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
