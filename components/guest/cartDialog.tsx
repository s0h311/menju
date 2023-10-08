'use client'

import useStore from '@/hooks/useStore'
import { useCartStore } from '@/store/cartStore'
import { Cart, OrderPosition, PaymentMethod, zCart } from '@/types/order.type'
import Dialog from '@/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBagOutlined, AddCircle, RemoveCircle } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormMultiSelectionChips from '@/components/kitchen/form/formMultiSelectionChips'
import { TextareaAutosize } from '@mui/base'
import { trpc } from '@/trpc/trpc'
import { useRestaurantStore } from '@/store/restaurantStore'
import useTypeTransformer from '@/hooks/useTypeTranformer'
import useFeatures from '@/hooks/useFeatures'

export default function CartDialog() {
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const cartStore = useStore(useCartStore, (state) => state)
  const [cart, setCart] = useState<Omit<Cart, 'restaurantId'> | null>(null)
  const createOrderMutation = trpc.createOrder.useMutation()
  const restaurantStore = useStore(useRestaurantStore, (state) => state)
  const { orderToDBOrder } = useTypeTransformer()
  const { cartType, enabledPaymentMethods } = useFeatures()

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitted },
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
    if (!cartStore || cartType === 'cannotOrder') return

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

  const getIngredientsText = (position: OrderPosition): string => {
    const allIngredients = [...position.dish.ingredients.optional, ...position.dish.ingredients.required]
    const currentIngredients = allIngredients.filter((ingredient) => !position.leftOutIngredients.includes(ingredient))
    return currentIngredients.join(', ')
  }

  return (
    <>
      {!showDialog ? (
        <IconButton
          sx={{
            position: 'fixed',
            bottom: '10px',
            right: '15px',
            backgroundColor: '#7eaa92 !important',
            borderRadius: '9999px',
            p: '12px',
          }}
          onClick={() => setShowDialog(true)}
        >
          <ShoppingBagOutlined sx={{}} />
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
            loading={isSubmitted}
          >
            {!cart?.positions.length ? (
              <h3>Such dir doch etwas aus :)</h3>
            ) : (
              <div className='space-y-3'>
                {/* Positionen */}
                {cart.positions.map((position) => (
                  <div
                    key={position.dish.id + position.leftOutIngredients.join('')}
                    className='grid w-11/12 mx-auto'
                  >
                    {position.dish.picture && (
                      <Image
                        className='rounded-lg'
                        style={{ aspectRatio: '16/9' }}
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
                      <p>{position.dish.price.toFixed(2) + '€'}</p>
                    </div>
                    <p className='truncate text-sm text-gray-500'>{getIngredientsText(position)}</p>
                  </div>
                ))}

                <hr />

                {/* Zahlungsmethoden */}
                <div className='space-y-2'>
                  <FormMultiSelectionChips
                    items={enabledPaymentMethods}
                    activeItem={getValues('paymentMethod')}
                    onClick={updatePaymentMethod}
                  />

                  {/* Bemerkung */}
                  <TextareaAutosize
                    className='border border-slate-500 shadow-sm rounded-l-lg rounded-tr-lg p-3 outline-none w-full'
                    placeholder='Anmerkung'
                    {...register('note', { onChange: (event) => cartStore?.updateNote(event.target.value) })}
                  />

                  {/* Gesamtbetrag */}
                  <p>Gesamtbetrag: {cartStore?.cart.netTotal.toFixed(2)}€</p>

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
    </>
  )
}
