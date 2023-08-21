import React, { useEffect, useState } from 'react'
import Dialog from '../../ui/dialog'
import { useCartStore } from '@/store/cart-store'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Cart } from '../../types/order.type'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { trpc } from '@/trpc/trpc'
import { useStore } from 'zustand'

export default function CartDialog() {
  const cartStore = useStore(useCartStore, (state) => state)

  const orderMutation = trpc.createOrder.useMutation()

  const { cart, reset, setCart } = cartStore

  const sendOrder = () => {
    orderMutation.mutate(cartOrder, {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
    })
  }

  const [open, setOpen] = useState<boolean>(false)

  const [cartOrder, setCartOrder] = useState<Cart>({} as Cart)

  useEffect(() => setCartOrder(cart), [cart])

  const handleChange = (event: SelectChangeEvent) => {
    const paymentMethod = event.target.value as 'CARD' | 'CASH' | 'COUPON' | 'UNDECIDED'
    setCartOrder((cartOrder) => ({ ...cartOrder, paymentMethod }))
    setCart(cartOrder)
  }

  return (
    <>
      {!open ? (
        <ShoppingCartIcon
          onClick={() => setOpen(true)}
          className='cursor-pointer'
        />
      ) : (
        <Dialog
          title='Warenkorb'
          open={open}
          closeText={'abbrechen'}
          onClose={() => setOpen(false)}
          onProceed={sendOrder}
          proceedText='bestellen'
          proceedDisabled={!cart.positions.length}
        >
          <div className='px-5 gap-3'>
            <div className='flex justify-between'>
              <p>Gericht</p>
              <p className='w-1/4'>Qty</p>
              <p>Preis</p>
            </div>
            <div>
              {cart.positions.map((cartDish) => (
                <div
                  key={cartDish.dish.id}
                  className='flex justify-between'
                >
                  <p>{cartDish.dish.name}</p>
                  <p>X</p>
                  <p className='w-1/3'>{cartDish.quantity}</p>
                  <p>{cartDish.dish.price}</p>
                </div>
              ))}
            </div>
            <hr />
            <div className='pt-3 text-right'>
              <p className='pb-2'>{cart.netTotal}€</p>
              <div>
                <FormControl sx={{ pb: 1, minWidth: 1 / 2 }}>
                  <InputLabel id='demo-simple-select-autowidth-label'>Zahlungsmethode</InputLabel>
                  <Select
                    labelId='demo-simple-select-autowidth-label'
                    id='demo-simple-select-autowidth'
                    value={cartOrder.paymentMethod}
                    onChange={handleChange}
                    autoWidth
                    label='Zahlungsmethode'
                  >
                    <MenuItem value='UNDECIDED'>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'CASH'}>Bar</MenuItem>
                    <MenuItem value={'CARD'}>Karte</MenuItem>
                    <MenuItem value={'COUPON'}>Koupon</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <textarea
                className='border-2'
                placeholder='notiz hinzufügen'
                onChange={(e) => setCartOrder({ ...cartOrder, note: e.target.value })}
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}
