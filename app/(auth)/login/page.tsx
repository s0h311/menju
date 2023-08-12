'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import image from '@/public/images/login-food.jpg'
import { Box, TextField, ThemeProvider } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { theme } from '@/app/ui/theme'
import { zLoginCredentials, LoginCredentials } from '@/app/types/credentials.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/gotrue-js/src/lib/types'
import useDeviceType from '@/app/hooks/useDeviceType'

export default function Login() {
  const { isMobile } = useDeviceType()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null) //TODO example retrieve user

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(zLoginCredentials),
  })

  const signin = async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      setError('email', {
        type: error.name,
      })

      setError('password', {
        type: error.name,
        message: error.message,
      })
    }

    if (data.user) {
      window.location.reload()
      //TODO navigate to Kitchen Dashboard (K DASH)
    }
  }

  //TODO example signout
  const signout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  //TODO example get user
  useEffect(() => {
    const getUser = async () => {
      const data = await supabase.auth.getUser()
      setUser(data.data.user)
    }

    getUser()
  }, [supabase.auth])

  return (
    <div className='grid md:grid-cols-2 place-items-center'>
      {!isMobile ? (
        <Image
          className='rounded-[40px]'
          src={image}
          alt=''
        />
      ) : (
        ''
      )}

      <div className='grid place-items-center gap-10 md:gap-0 h-full w-full relative'>
        <h1 className='text-3xl tracking-wider md:absolute md:top-[5%] lg:top-[15%] mx-auto'>Willkommen zurück</h1>

        <ThemeProvider theme={theme}>
          <Box
            className='grid gap-6 w-3/4 lg:w-1/2'
            component='form'
            autoComplete='off'
            onSubmit={handleSubmit(signin)}
            noValidate
          >
            <TextField
              required
              id='email'
              label='E-Mail'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              color='accent'
            />

            <TextField
              required
              id='password'
              label='Passwort'
              type='password'
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              color='accent'
            />

            <LoadingButton
              loading={isSubmitSuccessful}
              variant='outlined'
              color='accent'
              type='submit'
            >
              Anmelden
            </LoadingButton>
          </Box>
        </ThemeProvider>
        {user ? (
          <button
            className='absolute bottom-28'
            onClick={() => signout()}
          >
            SIGNOUT
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
