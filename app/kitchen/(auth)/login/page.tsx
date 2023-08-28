'use client'

import Image from 'next/image'
import image from '@/public/images/login-food.jpg'
import { Box, TextField, ThemeProvider } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { theme } from '@/app/ui/theme'
import { zLoginCredentials, LoginCredentials } from '@/app/types/credentials.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import useDeviceType from '@/app/hooks/useDeviceType'
import { useRouter } from 'next/navigation'
import { useStore } from 'zustand'
import { useRestaurantStore } from '@/store/restaurantStore'

export default function Login() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const restaurantStore = useStore(useRestaurantStore, (state) => state)

  const { isMobile } = useDeviceType()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
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
      restaurantStore?.setRestaurantId(data.user.user_metadata['restaurantId'])
      router.push('/kitchen')
    }
  }

  return (
    <div className='grid md:grid-cols-2 place-items-center h-full'>
      {!isMobile && (
        <Image
          className='rounded-[40px] max-h-full w-auto'
          src={image}
          alt=''
          quality={75}
          placeholder='blur'
        />
      )}

      <div className='grid place-items-center gap-10 md:gap-0 h-full w-full relative'>
        <h1 className='text-2xl lg:text-3xl tracking-wider md:absolute md:top-[30%] lg:top-[20%] mx-auto'>
          Willkommen zurück
        </h1>

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
      </div>
    </div>
  )
}
