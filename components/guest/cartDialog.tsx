'use client'

import useStore from '@/hooks/useStore'
import { useCartStore } from '@/store/cartStore'
import { Cart, zCart } from '@/types/order.type'
import Dialog from '@/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBagOutlined, AddCircle, RemoveCircle } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CartDialog() {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const cartStore = useStore(useCartStore, (state) => state)

  const [cart, setCart] = useState<Cart | null>(null)

  const { register, getValues, watch } = useForm<Cart>({
    defaultValues: { ...cartStore?.cart },
    resolver: zodResolver(zCart),
  })

  useEffect(() => {
    if (cartStore) {
      setCart(cartStore.cart)
    }
  }, [setCart, cartStore])

  const createOrder = () => {}

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
                    className='grid place-items-center'
                  >
                    {position.dish.picture && (
                      <Image
                        className='rounded-lg w-3/4'
                        src={position.dish.picture}
                        width={300}
                        height={200}
                        alt=''
                      />
                    )}
                    <div className='flex justify-center items-center gap-2 -mt-6 bg-secondary rounded-xl'>
                      <IconButton sx={{ p: '3px' }}>
                        <RemoveCircle color='error' />
                      </IconButton>
                      <p>{position.quantity}</p>
                      <IconButton sx={{ p: '3px' }}>
                        <AddCircle color='success' />
                      </IconButton>
                    </div>
                  </div>
                ))}
            </div>
          </Dialog>
        </div>
      )}
    </>
  )
}
