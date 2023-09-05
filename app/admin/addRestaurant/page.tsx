'use client'

import { Box, TextField, Button } from '@mui/material'
import { zRegisterCredentials, RegisterCredentials } from '@/types/credentials.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/trpc'
import { useState } from 'react'
import { UserResponse } from '@supabase/supabase-js'

export default function AddRestaurant() {
  const addRestaurantMutation = trpc.addRestaurant.useMutation()
  const [addRestaurantSuccess, setAddRestaurantSuccess] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterCredentials>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      restaurantId: 0,
    },
    resolver: zodResolver(zRegisterCredentials),
  })

  const registerUser = async (credentials: RegisterCredentials) => {
    addRestaurantMutation.mutateAsync(credentials, {
      onSuccess: (data) => displayErrorOrSuccess(data),
    })
  }

  const displayErrorOrSuccess = (data: UserResponse) => {
    if (data?.error) {
      setError('password', {
        type: 'supabaseError',
        message: data?.error.message,
      })
    }

    if (data?.data.user) {
      setAddRestaurantSuccess(true)
    }
  }

  return (
    <Box
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit(registerUser)}
      noValidate
    >
      <div className='grid gap-4 w-1/3 xl:w-1/4'>
        <h1 className='text-lg'>Restaurant Anlegen</h1>

        <TextField
          required
          id='name'
          label='Name'
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          required
          id='email'
          label='E-Mail'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          required
          id='password'
          label='Passwort'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {addRestaurantSuccess && <p className='text-green-700'>Restaurant added successfully</p>}

        <Button
          sx={{ borderRadius: '5px' }}
          variant='outlined'
          type='submit'
        >
          Neues Restaurant Anlegen
        </Button>
      </div>
    </Box>
  )
}
