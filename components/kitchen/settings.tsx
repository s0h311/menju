'use client'

import { CartType, Features, Restaurant, zFeatures } from '@/types/restaurant.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import ToggleButton from './form/toggleButton'
import { PaymentMethod } from '@/types/order.type'
import { LoadingButton } from '@mui/lab'
import { trpc } from '@/trpc/trpc'

type SettingsListProps = {
  restaurant: Restaurant
}

export default function KitchenSettingsList({
  restaurant: { id: restaurantId, name, abbreviation, features },
}: SettingsListProps) {
  const { mutateAsync: updateFeaturesMutation } = trpc.updateFeatures.useMutation()
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false)

  const {
    handleSubmit,
    formState: { isSubmitted },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<Features>({
    defaultValues: features,
    resolver: zodResolver(zFeatures),
  })

  const addPaymenMethod = (paymentMethod: PaymentMethod): void => {
    let currentPaymentMethods = getValues('enabledPaymentMethods')

    if (currentPaymentMethods.includes(paymentMethod)) {
      currentPaymentMethods = currentPaymentMethods.filter(
        (currentPaymentMethod) => currentPaymentMethod !== paymentMethod
      )
    } else {
      currentPaymentMethods.push(paymentMethod)
    }
    setValue('enabledPaymentMethods', currentPaymentMethods, { shouldValidate: true })
  }

  const save = async (newFeatures: Features): Promise<void> => {
    updateFeaturesMutation(
      { restaurantId, features: newFeatures },
      {
        onSuccess: displayErrorOrSuccess,
      }
    )
  }

  const displayErrorOrSuccess = () => {
    if (savedSuccessfully) throw 69 + 420 // TODO use for toast
    setSavedSuccessfully(true)
    setTimeout(() => {
      setSavedSuccessfully(false)
      reset({}, { keepValues: true })
    }, 1000)
  }

  const watchAll = watch()
  useEffect(() => {}, [watchAll])

  return (
    <div className='flex gap-10 xl:gap-20 w-full'>
      <section className='w-fit space-y-5 overflow-y-scroll'>
        <h2 className='text-lg'>Daten</h2>
        <div className='flex gap-24 items-center border p-5 rounded-lg shadow'>
          <div>
            <p className='text-slate-500'>Name</p>
            <p className='text-slate-500'>Abkürzung</p>
          </div>
          <div>
            <p>{name}</p>
            <p>{abbreviation}</p>
          </div>
        </div>
      </section>

      <form
        className='grid gap-5 w-fit'
        onSubmit={handleSubmit(save)}
      >
        <h2 className='text-lg'>Features</h2>

        <label className='-mb-4'>Filtern</label>
        <ToggleButton
          value={getValues('isFilterBarEnabled')}
          onChange={(value: boolean) => setValue('isFilterBarEnabled', value, { shouldValidate: true })}
          items={[
            { value: true, name: 'An' },
            { value: false, name: 'Aus' },
          ]}
        />

        <label className='-mb-4'>Bestellen</label>
        <ToggleButton
          value={getValues('cartType')}
          onChange={(value: CartType) => setValue('cartType', value, { shouldValidate: true })}
          items={[
            { value: 'canOrder', name: 'An' },
            { value: 'cannotOrder', name: 'Aus' },
          ]}
        />

        <label className='-mb-4'>Zahlungsmethoden</label>
        <ToggleButton
          value={getValues('enabledPaymentMethods')}
          onChange={addPaymenMethod}
          items={[
            { value: 'CARD', name: 'Karte' },
            { value: 'CASH', name: 'Bar' },
            { value: 'COUPON', name: 'Gutschein' },
          ]}
        />

        <LoadingButton
          sx={{ borderRadius: '5px' }}
          variant='outlined'
          type='submit'
          loading={isSubmitted}
        >
          Speichern
        </LoadingButton>
      </form>
    </div>
  )
}
