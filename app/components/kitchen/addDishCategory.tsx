'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, ThemeProvider, Card as MCard, Button, CardContent, CardActions, CardMedia } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Check, Close } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { theme } from '@/app/ui/theme'
import { DishCategory, NewDishCategory, zNewDishCategory } from '@/app/types/dish.type'
import { trpc } from '@/trpc/trpc'
import useStore from '@/store/nextjs-hook'
import { useMenuStore } from '@/store/menu-store'
import ImagePicker from './imagePicker'
import { useEffect, useRef, useState } from 'react'
import useStorageUploader from '@/app/hooks/useStorageUploader'
import { useRestaurantStore } from '@/store/restaurantStore'

type AddDishCategoryProps = {
  editingDishCategory?: DishCategory
  onClose: () => void
}

export default function AddDishCategory({ editingDishCategory, onClose }: AddDishCategoryProps) {
  const addDishCategoryMutation = trpc.addDishCategory.useMutation()
  const updateDishCategoryMutation = trpc.updateDishCategory.useMutation()
  const menuStore = useStore(useMenuStore, (state) => state)
  const restaurantStore = useStore(useRestaurantStore, (state) => state)
  const storageUploader = useStorageUploader()
  const [preview, setPreview] = useState<string | null>(null)
  const imageFile = useRef<File | null>(null)
  const imageStoragePath = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setError,
    setValue,
    getValues,
    watch,
  } = useForm<NewDishCategory>({
    defaultValues: {
      id: editingDishCategory?.id || undefined,
      name: { de: editingDishCategory?.name || '', en: '', it: '' },
      picture: editingDishCategory?.picture || null,
      restaurantId: restaurantStore?.restaurantId,
    },
    resolver: zodResolver(zNewDishCategory),
  })

  useEffect(() => {
    if (restaurantStore?.restaurantId) {
      setValue('restaurantId', restaurantStore.restaurantId)
    }
  }, [restaurantStore?.restaurantId, setValue])

  const onSubmit = async (dishCategory: NewDishCategory): Promise<void> => {
    if (imageFile.current) {
      await uploadImage(imageFile.current)
      if (imageStoragePath.current) {
        dishCategory.picture = imageStoragePath.current
      }
    }

    if (editingDishCategory) {
      updateDishCategoryMutation.mutateAsync(dishCategory, {
        onSuccess: async (category: DishCategory) => {
          if (editingDishCategory.picture && editingDishCategory.picture !== getValues().picture) {
            await storageUploader.removeImage([editingDishCategory.picture])
          }
          menuStore?.updateDishCategory(category)
          onClose()
        },
      })
    } else {
      addDishCategoryMutation.mutateAsync(dishCategory, {
        onSuccess: async (category: DishCategory) => {
          menuStore?.addDishCategory(category)
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
      setError('name.de', {
        type: 'supabaseError',
        message: error.message,
      })
    }
  }

  const onImageChange = async (imageData: string, file: File): Promise<void> => {
    setPreview(imageData)
    imageFile.current = file
  }

  const removeImage = () => {
    setPreview(null)
    imageFile.current = null
    setValue('picture', null)
    watch('picture') // Trigger rerender manually, as react-hook-form doesn't trigger one when 'setValue' is used
  }

  return (
    <ThemeProvider theme={theme}>
      <MCard
        sx={{ cursor: 'pointer' }}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {(getValues().picture || preview) && (
          <CardMedia
            sx={{ height: '13dvh' }}
            component='img'
            image={getValues().picture || preview || ''}
            onClick={removeImage}
          />
        )}
        <CardContent sx={{ display: 'grid', gap: '10px' }}>
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
            {...register('name.de')}
            error={!!errors.name}
            helperText={errors.name?.de?.message}
            multiline
            color='accent'
          />
          <CardActions sx={{ padding: '0', paddingTop: '7px', marginBottom: '-8px' }}>
            <Button
              sx={{ width: '100%' }}
              variant='outlined'
              color='error'
              onClick={onClose}
            >
              <Close />
            </Button>
            <LoadingButton
              sx={{ width: '100%' }}
              loading={isSubmitSuccessful}
              variant='outlined'
              color='success'
              type='submit'
            >
              <Check />
            </LoadingButton>
          </CardActions>
        </CardContent>
      </MCard>
    </ThemeProvider>
  )
}
