import React, { useState } from 'react'
import Dialog from '../ui/dialog'
import { useCartStore } from '@/store/store'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Cart } from '../types/order.type'

export default function CartDialog() {
  const cart = useCartStore((store) => store.cart)
  const setCart = useCartStore((state) => state.setCart)
  const sendOrder = () => {
    setCart(cartOrder)
  }
  const [open, setOpen] = useState<boolean>(false)

  const [cartOrder, setCartOrder] = useState<Cart>({ ...cart })

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
          onProceed={() => sendOrder()}
          proceedText='bestellen'
        >
          <div className='px-5 gap-3'>
            <div>
              {cart.positions.map((cartDish) => (
                <div key={cartDish.dish.id}>
                  <p>{cartDish.dish.name}</p>
                  <p>{cartDish.leftOutIngredients}</p>
                  <p>{cartDish.quantity}</p>
                </div>
              ))}
            </div>
            <p>{cart.netTotal}€</p>
            <p>{cart.paymentMethod}</p>
            <textarea
              placeholder='notiz hinzufügen'
              onChange={(e) => setCartOrder({ ...cartOrder, note: e.target.value })}
            />
          </div>
        </Dialog>
      )}
    </>
  )
}
