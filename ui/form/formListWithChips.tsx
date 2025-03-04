import type { DBMultiLanguageStringProperty } from '@/types/db/dish.db.type'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

type FormListWithChipsProps = {
  onItemAdd: (item: DBMultiLanguageStringProperty) => void
  onItemRemove: (item: DBMultiLanguageStringProperty) => void
  items: DBMultiLanguageStringProperty[]
  placeholder: string
  chipColor: string
  addButttonColor: string
}

export default function FormListWithChips({
  onItemAdd,
  onItemRemove,
  items,
  placeholder,
  chipColor,
  addButttonColor,
}: FormListWithChipsProps) {
  const labelInput = useRef<HTMLInputElement>(null)

  const addItem = () => {
    if (!labelInput.current) return

    const multiLanguage = { de: labelInput.current.value, en: '', it: '' }
    onItemAdd(multiLanguage)

    labelInput.current.value = ''
  }

  return (
    <div className='flex space-x-2 w-full whitespace-nowrap overflow-x-scroll no-scrollbar'>
      <input
        className={`px-2 py-1 -mr-2 rounded-l-xl text-white placeholder:text-gray-300 text-sm outline-none w-1/3 min-w-[33%] ${chipColor}`}
        ref={labelInput}
        type='text'
        placeholder={placeholder}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === 'Enter') return addItem()
          return
        }}
      />
      <button
        className={`rounded-r-xl px-2 ${addButttonColor}`}
        type='button'
        tabIndex={-1}
        onClick={addItem}
      >
        +
      </button>
      {items.map((item: DBMultiLanguageStringProperty) => (
        <button
          className={`rounded-xl px-2 py-1 text-white text-sm cursor-pointer ${chipColor}`}
          key={item.de}
          tabIndex={-1}
          onClick={() => onItemRemove(item)}
        >
          {item.de}
        </button>
      ))}
    </div>
  )
}
