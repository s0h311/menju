'use client'

import { Box, TextField } from '@mui/material'
import { zRegisterCredentials, RegisterCredentials } from '@/types/credentials.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/trpc'
import { useState } from 'react'
import { UserResponse } from '@supabase/supabase-js'
import { LoadingButton } from '@mui/lab'

export default function AddRestaurant() {
  const addRestaurantMutation = trpc.addRestaurant.useMutation()
  const [addRestaurantSuccess, setAddRestaurantSuccess] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
    reset,
  } = useForm<RegisterCredentials>({
    defaultValues: {
      name: '',
      email: '',
      abbreviation: '',
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
      setTimeout(() => {
        setAddRestaurantSuccess(false)
        reset()
      }, 1000)
    }
  }

  const fields = [
    {
      name: 'name',
      label: 'Name',
    },
    {
      name: 'email',
      label: 'E-Mail',
    },
    {
      name: 'abbreviation',
      label: 'Abkürzung',
    },
    {
      name: 'password',
      label: 'Passwort',
    },
  ]

  return (
    <Box
      component='form'
      autoComplete='off'
      onSubmit={handleSubmit(registerUser)}
      noValidate
    >
      <div className='grid gap-4 w-1/3 xl:w-1/4'>
        <h1 className='text-lg'>Restaurant Anlegen</h1>

        {fields.map((field) => (
          <TextField
            key={field.name}
            required
            id={field.name}
            label={field.label}
            {...register(field.name)}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        ))}

        {addRestaurantSuccess && <p className='text-green-700'>Restaurant added successfully</p>}

        <LoadingButton
          sx={{ borderRadius: '5px' }}
          variant='outlined'
          type='submit'
          loading={isSubmitted}
        >
          Neues Restaurant Anlegen
        </LoadingButton>
      </div>
    </Box>
  )
}
