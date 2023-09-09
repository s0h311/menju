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

export default function CartDialog() {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const cartStore = useStore(useCartStore, (state) => state)

  const [cart, setCart] = useState<Cart | null>(null)

  const { register, getValues, watch, setValue } = useForm<Pick<Cart, 'note' | 'paymentMethod'>>({
    defaultValues: { note: '', paymentMethod: 'CASH' },
    resolver: zodResolver(zCart.pick({ note: true, paymentMethod: true })),
  })

  useEffect(() => {
    if (cartStore) {
      setCart(cartStore.cart)
    }
  }, [setCart, cartStore])

  const createOrder = () => {}

  const getIngredientsText = (position: OrderPosition): string => {
    const allIngredients = [...position.dish.ingredients.optional, ...position.dish.ingredients.required]
    const currentIngredients = allIngredients.filter((ingredient) => !position.leftOutIngredients.includes(ingredient))
    return currentIngredients.join(', ')
  }

  const paymentMethods: PaymentMethod[] = ['CARD', 'CASH', 'COUPON']

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
            p: '5px',
          }}
          onClick={() => setShowDialog(true)}
        >
          <ShoppingBagOutlined sx={{}} />
        </IconButton>
      ) : (
        <div>
          <Dialog
            title='Bestellung'
            open={showDialog}
            closeText='Abbrechen'
            proceedText='Bestellen'
            onProceed={createOrder}
            onClose={() => setShowDialog(false)}
          >
            <div className='space-y-3'>
              {cart &&
                cart.positions.map((position) => (
                  <div
                    key={position.dish.id}
                    className='grid w-4/5 mx-auto'
                  >
                    {position.dish.picture && (
                      <Image
                        className='rounded-lg'
                        src={position.dish.picture}
                        width={300}
                        height={200}
                        alt=''
                      />
                    )}
                    <div className='flex place-self-center justify-center items-center gap-2 -mt-6 bg-secondary rounded-xl'>
                      <IconButton sx={{ p: '3px' }}>
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
                    <div className='flex place-content-between'>
                      <h3>{position.dish.name}</h3>
                      <p>{position.dish.price + '€'}</p>
                    </div>
                    <p className='truncate text-sm text-gray-500'>{getIngredientsText(position)}</p>
                  </div>
                ))}
              <hr />
              <div className='mx-auto'>
                <FormMultiSelectionChips
                  items={paymentMethods}
                  activeItem={getValues('paymentMethod')}
                  onClick={(paymentMethod) => setValue('paymentMethod', paymentMethod)}
                />
                <TextareaAutosize
                  className='border border-slate-500 shadow-sm rounded-l-lg rounded-tr-lg p-3 outline-none'
                  placeholder='Anmerkung'
                  {...register('note')}
                />
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  )
}
