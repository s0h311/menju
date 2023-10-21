import type { DBExtraIngredient } from '@/types/db/dish.db.type'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

type ExtraIngredientInputProps = {
  onItemAdd: (item: DBExtraIngredient) => void
  onItemRemove: (item: DBExtraIngredient) => void
  items: DBExtraIngredient[]
}

export default function ExtraIngredientInput({ onItemAdd, onItemRemove, items }: ExtraIngredientInputProps) {
  const labelInput = useRef<HTMLInputElement>(null)
  const priceInput = useRef<HTMLInputElement>(null)

  const addItem = () => {
    if (!labelInput.current || !priceInput.current) return

    const multiLanguage = { de: labelInput.current.value, en: '', it: '' }
    onItemAdd({ name: multiLanguage, price: parseInt(priceInput.current.value) })

    labelInput.current.value = ''
    priceInput.current.value = ''
  }

  return (
    <div className='flex w-full whitespace-nowrap overflow-x-scroll no-scrollbar'>
      <input
        className={`px-2 py-1 rounded-l-xl text-white placeholder:text-gray-300 text-sm outline-none w-1/3 min-w-[33%] bg-sky-950`}
        ref={labelInput}
        type='text'
        placeholder='extra Zutat'
      />

      <input
        className={`px-2 py-1 text-white placeholder:text-gray-300 text-sm outline-none w-[12%] min-w-[12%] bg-blue-950`}
        ref={priceInput}
        type='text'
        placeholder='Preis'
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') return addItem()
          return
        }}
      />

      <button
        className={`rounded-r-xl px-2 bg-blue-900`}
        type='button'
        tabIndex={-1}
        onClick={addItem}
      >
        +
      </button>

      {items.map((item: DBExtraIngredient) => (
        <button
          className={`rounded-xl px-2 py-1 ml-2 text-white text-sm cursor-pointer bg-sky-950`}
          key={item.name.de}
          tabIndex={-1}
          onClick={() => onItemRemove(item)}
        >
          {`${item.name.de} - ${item.price}€`}
        </button>
      ))}
    </div>
  )
}
