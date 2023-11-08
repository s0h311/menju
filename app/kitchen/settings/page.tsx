import KitchenSettingsList from '@/components/kitchen/settings'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function KitchenSettings() {
  const superbaseClient = createServerComponentClient({ cookies })

  // TODO duplicate 'orders/page.tsx, einen Service daraus machen'
  const { data: userData, error: userError } = await superbaseClient.auth.getUser()

  const { data, error } = await superbaseClient
    .from('restaurant')
    .select()
    .eq('user_id', userData.user?.id)
    .single()

  if (userError) {
    console.error('[KitchenSettings - get user]', userError)
  }

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
            colors: data.colors,
          }}
        />
      )}
    </>
  )
}
