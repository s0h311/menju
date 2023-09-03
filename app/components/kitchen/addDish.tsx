'use client'

import { DishCategory, NewDish, zNewDish } from '@/app/types/dish.type'
import Dialog from '@/app/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ImagePicker from './imagePicker'
import { TextField, Select, InputLabel, MenuItem, FormControl } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useStore from '@/store/nextjs-hook'
import { useMenuStore } from '@/store/menu-store'

type AddDishProps = {
  open: boolean
  editingDish?: NewDish
  onClose: () => void
}

export default function AddDish({ open, editingDish, onClose }: AddDishProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const imageFile = useRef<File | null>(null)

  const menuStore = useStore(useMenuStore, (state) => state)
  const [dishCategories, setDishCategories] = useState<DishCategory[]>([])

  useEffect(() => {
    const categories = menuStore?.allDishes.map((dbc) => dbc.category)
    if (categories) {
      setDishCategories(categories)
    }
    console.log(dishCategories)
  }, [menuStore?.allDishes])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setError,
    setValue,
    getValues,
    watch,
  } = useForm<NewDish>({
    defaultValues: editingDish
      ? { ...editingDish }
      : {
          id: undefined,
          name: { de: '', en: '', it: '' },
          price: 0,
          picture: null,
          categoryId: 0,
          ingredients: { required: [], optional: [] },
          labels: [],
          allergies: [],
          nutritions: { energy: 0, protein: 0 },
          dietType: null,
          description: { de: '', en: '', it: '' },
          saleStartDate: null,
          saleEndDate: null,
          salePrice: null,
          saleDays: [],
        },
    resolver: zodResolver(zNewDish),
  })

  const onImageChange = async (imageData: string, file: File): Promise<void> => {
    setPreview(imageData)
    imageFile.current = file
  }

  const removeImage = () => {
    setPreview(null)
    imageFile.current = null
    setValue('picture', null, { shouldValidate: true }) // the second argument is to trigger a rerender
  }

  /* const watcher = watch()
  useEffect(() => {
    console.log(getValues())
  }, [watcher]) */

  return (
    <Dialog
      sx={{ p: '20px', mt: '16px' }}
      open={open}
      closeText='Abbrechen'
      proceedText='Hinzufügen'
      onClose={onClose}
      onProceed={onClose}
      maxWidth='xs'
      imageData={{
        src: getValues().picture || preview,
        alt: `${getValues().name} Bild`,
        onClick: () => removeImage(),
      }}
    >
      <div className='grid gap-3'>
        {!getValues().picture && !preview && (
          <>
            <ImagePicker onChange={onImageChange} />
            <TextField
              id='pictureUrl'
              label='Bild Link'
              {...register('picture')}
              error={!!errors.picture}
              helperText={errors.picture?.message}
              color='accent'
            />
          </>
        )}
        <TextField
          id='name'
          label='Name'
          required
          {...register('name.de')}
          error={!!errors.name}
          helperText={errors.name?.de?.message}
          color='accent'
        />

        <TextField
          id='price'
          label='Preis'
          type='number'
          required
          {...register('price')}
          error={!!errors.price}
          helperText={errors.price?.message}
          color='accent'
        />
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id='category-label'>Kategorie</InputLabel>
          <Select
            labelId='category-label'
            id='category'
            label='Kategorie'
            required
            {...register('categoryId')}
            error={!!errors.categoryId}
          >
            {dishCategories.map((dishCategory) => (
              <MenuItem
                key={dishCategory.id}
                value={dishCategory.id}
              >
                {dishCategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className='flex space-x-2 whitespace-nowrap overflow-x-scroll no-scrollbar cursor-pointer'>
          <button>+</button>
          {getValues().labels?.map((label) => (
            <p
              className='rounded-xl px-2 py-1 bg-primary text-text text-sm'
              key={label.de}
            >
              {label.de}
            </p>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
