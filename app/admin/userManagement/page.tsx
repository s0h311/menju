'use client'

import { trpc } from '@/trpc/trpc'
import { zRegisterCredentialsAdminUser } from '@/types/adminUser.type'
import type { RegisterCredentialsAdminUser } from '@/types/adminUser.type'
import type { UserResponse } from '@supabase/supabase-js'
import { useState } from 'react'
import UserList from '@/components/admin/userList'
import AddUserForm from '@/components/admin/addUserForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function UserManagement() {
  const { data: adminUsers, refetch } = trpc.adminUsers.useQuery()
  const [createdSuccessfully, setCreatedSuccessfully] = useState<boolean>(false)
  const addAdminUserMutation = trpc.addAdminUser.useMutation()

  const createAdminUser = (user: RegisterCredentialsAdminUser) => {
    addAdminUserMutation.mutateAsync(user, {
      onSuccess: (data) => displayErrorOrSuccess(data),
    })
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
    setValue,
    getValues,
    setError,
    reset,
  } = useForm<RegisterCredentialsAdminUser>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Admin',
    },
    resolver: zodResolver(zRegisterCredentialsAdminUser),
  })

  const displayErrorOrSuccess = (data: UserResponse) => {
    if (data?.error) {
      setError('role', {
        type: 'supabaseError',
        message: data?.error.message,
      })
    }

    if (data?.data.user) {
      refetch()
      setCreatedSuccessfully(true)
      setTimeout(() => {
        setCreatedSuccessfully(false)
        reset()
      }, 1000)
    }
  }

  return (
    <div className='flex gap-10 xl:gap-20 w-full'>
      <section className='w-fit space-y-5 overflow-y-scroll'>
        <h2 className='text-lg'>Alle Benutzer</h2>
        <UserList adminUsers={adminUsers ?? []} />
      </section>

      <section className='w-fit space-y-5'>
        <h2 className='text-lg'>Benutzer Hinzufügen</h2>
        <AddUserForm
          register={register}
          errors={errors}
          getValues={getValues}
          setValue={setValue}
          handleSubmit={handleSubmit}
          onSubmit={createAdminUser}
          isSubmitSuccessful={isSubmitSuccessful}
          createdSuccessfully={createdSuccessfully}
        />
      </section>
    </div>
  )
}
