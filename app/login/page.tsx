'use client'

import Image from 'next/image'
import image from '@/public/images/login-food.jpg'
import { Box, TextField } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { LoadingButton } from '@mui/lab'
import { zLoginCredentials } from '@/types/credentials.type'
import type { LoginCredentials } from '@/types/credentials.type'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserClient } from '@supabase/ssr'
import useDeviceType from '@/hooks/useDeviceType'
import { useRouter } from 'next/navigation'
import useStore from '@/hooks/useStore'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useCustomTheme } from '@/ui/theme'

export default function Login() {
  const theme = useCustomTheme()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
          quality={70}
          placeholder='blur'
          alt=''
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
