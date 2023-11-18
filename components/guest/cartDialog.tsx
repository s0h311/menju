'use client'

import useStore from '@/hooks/useStore'
import { useCartStore } from '@/store/cartStore'
import type { Cart, OrderPosition, PaymentMethod } from '@/types/order.type'
import { zCart } from '@/types/order.type'
import Dialog from '@/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBagOutlined, AddCircle, RemoveCircle } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormMultiSelectionChips from '@/ui/form/formMultiSelectionChips'
import { trpc } from '@/trpc/trpcObject'
import { useRestaurantStore } from '@/store/restaurantStore'
import useTypeTransformer from '@/hooks/useTypeTranformer'
import useRestaurant from '@/hooks/useRestaurant'
import toast from '@/utils/toast'
import { useCustomTheme } from '@/ui/theme'

export default function CartDialog() {
  const theme = useCustomTheme()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const cartStore = useStore(useCartStore, (state) => state)
  const [cart, setCart] = useState<Omit<Cart, 'restaurantId'> | null>(null)
  const createOrderMutation = trpc.createOrder.useMutation()
  const restaurantStore = useStore(useRestaurantStore, (state) => state)
  const { orderToDBOrder } = useTypeTransformer()
  const { cartType, enabledPaymentMethods } = useRestaurant()

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    reset,
  } = useForm<Pick<Cart, 'note' | 'paymentMethod'>>({
    defaultValues: { note: '', paymentMethod: 'CARD' },
    resolver: zodResolver(zCart.pick({ note: true, paymentMethod: true })),
  })

  const updatePaymentMethod = (paymentMethod: PaymentMethod) => {
    setValue('paymentMethod', paymentMethod, { shouldValidate: true })
    cartStore?.updatePaymentMethod(paymentMethod)
  }

  useEffect(() => {
    if (cartStore) {
      setCart(cartStore.cart)
    }
  }, [setCart, cartStore])

  const createOrder = (cart: Pick<Cart, 'note' | 'paymentMethod'>) => {
    if (!cartStore || cartType === 'cannotOrder') {
      return
    }

    toast.successMinimal('Bestellung eingegangen')

    createOrderMutation.mutateAsync(
      orderToDBOrder({
        ...cartStore?.cart,
        paymentMethod: cart.paymentMethod,
        note: cart.note,
        restaurantId: restaurantStore?.restaurantId ?? 0,
        tableId: restaurantStore?.tableId ?? '',
      }),
      { onSuccess: () => reset() }
    )
    setShowDialog(false)
    cartStore.reset()
  }

  const getIngredientsText = useCallback((position: OrderPosition): string => {
    const allIngredients = [...position.dish.ingredients.optional, ...position.dish.ingredients.required]
    const currentIngredients = allIngredients.filter((ingredient) => !position.leftOutIngredients.includes(ingredient))
    return currentIngredients.join(', ')
  }, [])

  const getTotalDishPrice = useCallback((position: OrderPosition): number => {
    const dishPrice = position.dish.price

    if (position.extraIngredients.length === 0) return dishPrice

    const costOfAllExtraIngredients: number = position.extraIngredients
      .map((ingredient) => ingredient.price)
      .reduce((price1, price2) => price1 + price2)

    return dishPrice + costOfAllExtraIngredients
  }, [])

  return (
    <ThemeProvider theme={theme}>
      {!showDialog ? (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: '10px',
            right: '15px',
            backgroundColor: 'var(--primary) !important',
            borderRadius: '9999px',
            p: '12px',
          }}
          aria-label='Warenkorb'
          onClick={() => setShowDialog(true)}
        >
          <>
            {cartStore && cartStore.quantity > 0 && (
              <div className='text-xs absolute right-2 top-2 bg-red-500 rounded-full w-4 h-4'>
                <p className='text-white font-bold'>{cartStore.quantity}</p>
              </div>
            )}
            <ShoppingBagOutlined
              color='textColor'
              style={{ transform: 'scale(1.3)', zIndex: '-1' }}
            />
          </>
        </IconButton>
      ) : (
        <div>
          <Dialog
            sx={{ pb: 0 }}
            title='Bestellung'
            open={showDialog}
            revertSuccessError={cartType === 'cannotOrder'}
            closeText='Schliessen'
            proceedText='Bestellen'
            onProceed={cartType === 'cannotOrder' ? undefined : handleSubmit(createOrder)}
            onClose={() => setShowDialog(false)}
            loading={isSubmitSuccessful}
          >
            {!cart?.positions.length ? (
              <h3>Such dir doch etwas aus :)</h3>
            ) : (
              <div className='space-y-3'>
                {/* Positionen */}
                {cart.positions.map((position) => (
                  <div
                    key={position.dish.id + position.leftOutIngredients.join('') + position.extraIngredients.join('')}
                    className='grid w-11/12 mx-auto'
                  >
                    {position.dish.picture && (
                      <Image
                        className='rounded-lg'
                        style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                        src={position.dish.picture}
                        width={350}
                        height={240}
                        quality={70}
                        alt=''
                      />
                    )}

                    {/* Menge Buttons */}
                    <div className='flex place-self-center justify-center items-center gap-2 -mt-6 bg-secondary rounded-xl'>
                      <IconButton
                        sx={{ p: '3px' }}
                        onClick={() => cartStore?.removePosition(position)}
                      >
                        <RemoveCircle color='error' />
                      </IconButton>
                      <p>{position.quantity}</p>
                      <IconButton
                        sx={{ p: '3px' }}
                        onClick={() => cartStore?.addPosition(position)}
                      >
                        <AddCircle color='success' />
                      </IconButton>
                    </div>

                    {/* Name + Preis */}
                    <div className='flex place-content-between'>
                      <h3>{position.dish.name}</h3>
                      <p>{getTotalDishPrice(position).toFixed(2) + '€'}</p>
                    </div>
                    <p className='truncate text-sm text-gray-500'>{getIngredientsText(position)}</p>
                  </div>
                ))}

                <hr />

                <div className='space-y-2'>
                  {cartType === 'canOrder' && (
                    <>
                      {/* Zahlungsmethoden */}
                      <FormMultiSelectionChips
                        items={enabledPaymentMethods}
                        activeItem={getValues('paymentMethod')}
                        onClick={updatePaymentMethod}
                      />

                      {/* Bemerkung */}
                      <TextField
                        className='multiline-textfield'
                        placeholder='Anmerkung'
                        multiline
                        {...register('note', {
                          onChange: (event) => cartStore?.updateNote(event.target.value),
                        })}
                        error={!!errors.note}
                        helperText={errors.note?.message}
                      />
                    </>
                  )}

                  {/* Gesamtbetrag */}
                  <p>Gesamtbetrag: {cart?.netTotal.toFixed(2)}€</p>

                  {/* Hinweis */}
                  {cartType === 'cannotOrder' && (
                    <p className='text-[#388e3c]'>Bitte bestellen Sie bei unserem Personal</p>
                  )}
                </div>
              </div>
            )}
          </Dialog>
        </div>
      )}
    </ThemeProvider>
  )
}
