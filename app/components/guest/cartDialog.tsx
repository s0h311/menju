'use client'

import useStore from '@/hooks/useStore'
import { useCartStore } from '@/store/cartStore'
import { Cart, zCart } from '@/types/order.type'
import Dialog from '@/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBagOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CartDialog() {
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const cartStore = useStore(useCartStore, (state) => state)

  const { register, getValues } = useForm<Cart>({
    defaultValues: { ...cartStore?.cart },
    resolver: zodResolver(zCart),
  })

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
            <>
              {getValues().positions.map((position) => (
                <div key={position.dish.id}>
                  {position.dish.picture && (
                    <Image
                      src={position.dish.picture}
                      width={200}
                      alt=''
                    />
                  )}
                </div>
              ))}
            </>
          </Dialog>
        </div>
      )}
    </>
  )
}
