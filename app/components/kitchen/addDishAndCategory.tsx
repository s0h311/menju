import { Dish, DishCategory } from '../../types/dish.type'
import AddDish from './AddDish'
import AddDishCategory from './addDishCategory'

type AddDishAndCategoryProps = {
  title: string
  onClose: () => void
  type: 'dishcategory' | 'dish'
  edit?: boolean
  dishCategory?: DishCategory
  dish?: Dish
}

export default function AddDishAndCategory({
  title,
  onClose,
  type,
  edit,
  dishCategory,
  dish,
}: AddDishAndCategoryProps) {
  return (
    <div className='p-5 w-full h-full rounded-lg bg-gray-300 space-y-3 relative'>
      <h2 className='text-lg'>{title || 'Hinzufügen'}</h2>
      <button
        className='absolute right-5 top-0'
        onClick={onClose}
      >
        Abbrechen
      </button>

      {type === 'dishcategory' ? (
        <AddDishCategory
          dishCategory={dishCategory}
          onAddSuccessfull={onClose}
        />
      ) : (
        <AddDish />
      )}
    </div>
  )
}
