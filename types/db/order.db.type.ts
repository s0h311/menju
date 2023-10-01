import { OrderPosition, PaymentMethod, RestaurantId } from '../order.type'

export type DBOrder = {
  id: number
  table: string
  positions: OrderPosition[]
  payment_method: PaymentMethod
  is_payed: boolean | null
  net_total: number
  vat: number | null
  note: string | null
  restaurant_id: RestaurantId
}
