'use client'

import { DietType, Dish, DishCategory } from '@/types/dish.type'
import { DBMultiLanguageStringProperty, DBDish, zDBDish } from '@/types/db/dish.db.type'
import Dialog from '@/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useStore from '@/hooks/useStore'
import { useMenuStore } from '@/store/menuStore'
import { TextareaAutosize } from '@mui/base'
import FormImage from './form/formImage'
import FormDropdown from '@/components/kitchen/form/formDropdown'
import FormListWithChips from './form/formListWithChips'
import FormMultiSelectionChips from './form/formMultiSelectionChips'
import useStorageUploader from '@/hooks/useStorageUploader'
import { trpc } from '@/trpc/trpc'
import { initialDBDish } from '@/types/db/dish.initial.db'
import useTypeTransformer from '@/hooks/useTypeTranformer'

type AddDishProps = {
  open: boolean
  editingDish?: Dish
  onClose: () => void
}

export default function AddDish({ open, editingDish, onClose }: AddDishProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const imageFile = useRef<File | null>(null)
  const storageUploader = useStorageUploader()
  const menuStore = useStore(useMenuStore, (state) => state)
  const [dishCategories, setDishCategories] = useState<DishCategory[]>([])
  const imageStoragePath = useRef<string | null>(null)
  const addDishMutation = trpc.addDish.useMutation()
  const updateDishMutation = trpc.updateDish.useMutation()
  const { dishToDBDish } = useTypeTransformer()

  useEffect(() => {
    const categories = menuStore?.allDishes.map((dbc) => dbc.category)
    if (categories) {
      setDishCategories(categories)
    }
  }, [menuStore?.allDishes])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setError,
    setValue,
    getValues,
    watch,
  } = useForm<DBDish>({
    defaultValues: editingDish ? dishToDBDish(editingDish) : initialDBDish,
    resolver: zodResolver(zDBDish),
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

  const addMultiLanguageItem = (
    newItem: DBMultiLanguageStringProperty,
    fieldName: 'labels' | 'allergies' | 'ingredients.required' | 'ingredients.optional'
  ) => {
    const field = getValues(fieldName)
    if (!field || !field.length) setValue(fieldName, [newItem], { shouldValidate: true })
    else setValue(fieldName, [...field, newItem], { shouldValidate: true })
  }

  const removeMultiLanguageItem = (
    item: DBMultiLanguageStringProperty,
    fieldName: 'labels' | 'allergies' | 'ingredients.required' | 'ingredients.optional'
  ) => {
    let field = getValues(fieldName)

    if (field) {
      field = field?.filter((currentField) => currentField.de !== item.de)
    }
    setValue(fieldName, field, { shouldValidate: true })
  }

  const dietTypes: DietType[] = ['VEGAN', 'VEGETARIAN', 'PESCATARIAN', 'OMNIVORE']

  const onSubmit = async (dish: DBDish): Promise<void> => {
    if (imageFile.current) {
      await uploadImage(imageFile.current)
      if (imageStoragePath.current) {
        dish.picture = imageStoragePath.current
      }
    }

    if (editingDish) {
      updateDishMutation.mutateAsync(dish, {
        onSuccess: async (dish: Dish) => {
          if (editingDish.picture && editingDish.picture !== getValues().picture) {
            await storageUploader.removeImage([editingDish.picture])
          }
          menuStore?.updateDish(dish)
          onClose()
        },
      })
    } else {
      addDishMutation.mutateAsync(dish, {
        onSuccess: async (dish: Dish) => {
          menuStore?.addDish(dish)
          onClose()
        },
      })
    }
  }

  const uploadImage = async (imageFile: File): Promise<void> => {
    const { data, error } = await storageUploader.uploadImage(imageFile)
    if (data) {
      imageStoragePath.current = data.path
    }
    if (error) {
      setError('description.de', {
        type: 'supabaseError',
        message: error.message,
      })
    }
  }

  const watchAll = watch()
  useEffect(() => {
    console.log(getValues())
  }, [watchAll])

  return (
    <Dialog
      sx={{ display: 'grid', gap: '12px', pb: 0, px: '20px', overflowY: 'unset' }}
      open={open}
      title={!getValues().picture && !preview ? 'Neues Gericht hinzufügen' : ''}
      closeText='Abbrechen'
      proceedText={editingDish ? 'Ändern' : 'Hinzufügen'}
      onClose={onClose}
      onProceed={handleSubmit(onSubmit)}
      maxWidth='xs'
      imageData={{
        src: getValues().picture || preview,
        alt: `${getValues().name} Bild`,
        onClick: () => removeImage(),
      }}
      loading={isSubmitSuccessful}
    >
      {/* Image */}
      {!getValues().picture && !preview && (
        <FormImage
          onImageChange={onImageChange}
          register={{ ...register('picture') }}
          error={{ error: !!errors.picture, helperText: errors.picture?.message }}
        />
      )}

      {/* Name */}
      <TextField
        id='name'
        label='Name'
        required
        {...register('name.de')}
        error={!!errors.name}
        helperText={errors.name?.de?.message}
        color='accent'
      />

      {/* Price */}
      <TextField
        id='price'
        label='Preis'
        required
        type='number'
        {...register('price', { valueAsNumber: true, min: 1, max: 10000 })}
        error={!!errors.price}
        helperText={errors.price?.message}
        color='accent'
      />

      {/* CategoryId */}
      <FormDropdown
        label='Kategorie'
        error={!!errors.categoryId}
        items={dishCategories}
        onChange={(categoryId: number) => setValue('categoryId', categoryId, { shouldValidate: true })}
        selectedValue={getValues('categoryId')}
      />

      {/* Labels */}
      <FormListWithChips
        onItemAdd={(item: DBMultiLanguageStringProperty) => addMultiLanguageItem(item, 'labels')}
        onItemRemove={(item: DBMultiLanguageStringProperty) => removeMultiLanguageItem(item, 'labels')}
        items={getValues().labels || []}
        placeholder='Label'
        chipColor='bg-teal-800'
        addButttonColor='bg-teal-600'
      />

      {/* Allergies */}
      <FormListWithChips
        onItemAdd={(item: DBMultiLanguageStringProperty) => addMultiLanguageItem(item, 'allergies')}
        onItemRemove={(item: DBMultiLanguageStringProperty) => removeMultiLanguageItem(item, 'allergies')}
        items={getValues().allergies || []}
        placeholder='Allergen'
        chipColor='bg-cyan-800'
        addButttonColor='bg-cyan-600'
      />

      {/* Required Ingredients */}
      <FormListWithChips
        onItemAdd={(item: DBMultiLanguageStringProperty) => addMultiLanguageItem(item, 'ingredients.required')}
        onItemRemove={(item: DBMultiLanguageStringProperty) => removeMultiLanguageItem(item, 'ingredients.required')}
        items={getValues().ingredients.required || []}
        placeholder='Zutat'
        chipColor='bg-sky-800'
        addButttonColor='bg-sky-600'
      />

      {/* Optional Ingredients */}
      <FormListWithChips
        onItemAdd={(item: DBMultiLanguageStringProperty) => addMultiLanguageItem(item, 'ingredients.optional')}
        onItemRemove={(item: DBMultiLanguageStringProperty) => removeMultiLanguageItem(item, 'ingredients.optional')}
        items={getValues().ingredients.optional || []}
        placeholder='optionale Zutat'
        chipColor='bg-sky-900'
        addButttonColor='bg-sky-800'
      />

      {/* DietType */}
      <FormMultiSelectionChips
        items={dietTypes}
        activeItem={getValues('dietType')}
        onClick={(dietType) => setValue('dietType', dietType, { shouldValidate: true })}
      />

      {/* Description */}
      <TextareaAutosize
        className='border border-slate-500 shadow-sm rounded-l-lg rounded-tr-lg p-3 outline-none'
        placeholder='Beschreibung'
        {...register('description.de')}
      />
    </Dialog>
  )
}
