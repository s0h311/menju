import KitchenSettingsList from '@/components/kitchen/settings'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function KitchenSettings() {
  const superbaseClient = createServerComponentClient({ cookies })

  const { data, error } = await superbaseClient.from('restaurant').select().single()

  if (error) {
    console.error('[KitchenSettings - fetch features]', error)
  }

  return (
    <>
      {data && (
        <KitchenSettingsList
          restaurant={{
            id: data.id,
            name: data.name,
            abbreviation: data.abbreviation,
            features: data.features,
          }}
        />
      )}
    </>
  )
}
