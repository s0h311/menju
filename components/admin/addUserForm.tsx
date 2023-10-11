import { TextField } from '@mui/material'
import FormDropdown from '../kitchen/form/formDropdown'
import { LoadingButton } from '@mui/lab'
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import type { RegisterCredentialsAdminUser } from '@/types/adminUser.type'

type AddUserFormProps = {
  onSubmit: (credentials: RegisterCredentialsAdminUser) => void
  register: UseFormRegister<RegisterCredentialsAdminUser>
  errors: FieldErrors<RegisterCredentialsAdminUser>
  handleSubmit: UseFormHandleSubmit<RegisterCredentialsAdminUser>
  getValues: UseFormGetValues<RegisterCredentialsAdminUser>
  setValue: UseFormSetValue<RegisterCredentialsAdminUser>
  isSubmitted: boolean
  createdSuccessfully: boolean
}

export default function AddUserForm({
  onSubmit,
  register,
  errors,
  handleSubmit,
  getValues,
  setValue,
  isSubmitted,
  createdSuccessfully,
}: AddUserFormProps) {
  const roles = [
    {
      id: 'Admin',
      name: 'Admin',
    },
    {
      id: 'Super Admin',
      name: 'Super Admin',
    },
  ]

  return (
    <form
      className='grid gap-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        required
        id='nameInput'
        label='Name'
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        required
        id='emailInput'
        label='E-Mail'
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        required
        id='passwordInput'
        label='Password'
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <FormDropdown
        label='Rolle'
        error={!!errors.role}
        items={roles}
        onChange={(role: 'Admin' | 'Super Admin') => setValue('role', role, { shouldValidate: true })}
        selectedValue={getValues('role')}
      />

      {createdSuccessfully && <p className='text-green-700'>Restaurant added successfully</p>}

      <LoadingButton
        sx={{ borderRadius: '5px' }}
        variant='outlined'
        type='submit'
        loading={isSubmitted}
      >
        Neuen Admin Hinzufügen
      </LoadingButton>
    </form>
  )
}
