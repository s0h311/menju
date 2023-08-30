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
import { useRef, useState } from 'react'
import useStorageUploader from '@/app/hooks/useStorageUploader'

type AddDishCategoryProps = {
  dishCategory?: DishCategory
  onClose: () => void
}

export default function AddDishCategory({ dishCategory, onClose }: AddDishCategoryProps) {
  const addDishCategoryMutation = trpc.addDishCategory.useMutation()
  const menuStore = useStore(useMenuStore, (state) => state)
  const [preview, setPreview] = useState<string | null>(null)
  const storageUploader = useStorageUploader()
  const imageFile = useRef<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setError,
    setValue,
    getValues,
  } = useForm<NewDishCategory>({
    defaultValues: {
      name: { de: '', en: '', it: '' },
      picture: null,
      restaurantId: menuStore?.restaurantId,
    },
    resolver: zodResolver(zNewDishCategory),
  })

  const addDishCategory = (dishCategory: NewDishCategory): void => {
    addDishCategoryMutation.mutateAsync(dishCategory, {
      onSuccess: async (category) => {
        if (imageFile.current) {
          const { data, error } = await storageUploader.uploadImage(imageFile.current)
          if (data) {
            setValue('picture', data.path)
          }
          if (error) {
            setError('name.de', {
              type: 'supabaseError',
              message: error.message,
            })
          }
        }

        menuStore?.addDishCategory(category)
        onClose()
      },
    })
  }

  const onImageChange = async (data: string, file: File): Promise<void> => {
    setPreview(data)
    imageFile.current = file
  }

  const removeImage = () => {
    setPreview(null)
    setValue('picture', null)
    imageFile.current = null
  }

  return (
    <ThemeProvider theme={theme}>
      <MCard
        sx={{ cursor: 'pointer' }}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit(addDishCategory)}
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
              <ImagePicker
                {...register('picture')}
                onChange={onImageChange}
              />
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
            helperText={errors.name?.message}
            multiline
            color='accent'
          />
          <CardActions sx={{ padding: '0' }}>
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
