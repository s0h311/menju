type FormMultiSelectionChipsProps<T> = {
  items: T[]
  activeItem: T
  onClick: (item: T) => void
}

export default function FormMultiSelectionChips<T>({ items, activeItem, onClick }: FormMultiSelectionChipsProps<T>) {
  return (
    <div className='flex space-x-2 w-full whitespace-nowrap overflow-x-scroll no-scrollbar'>
      {items.map((item) => (
        <button
          key={String(item)}
          className={`rounded-xl px-2 py-1 text-sm cursor-pointer ${
            activeItem === item && 'border border-success text-success'
          }`}
          type='button'
          onClick={() => onClick(item)}
        >
          {String(item)}
        </button>
      ))}
    </div>
  )
}
