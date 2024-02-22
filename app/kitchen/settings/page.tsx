import KitchenSettingsList from '@/components/kitchen/settings'
import logger from '@/utils/logger'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function KitchenSettings() {
  const superbaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
      },
    }
  )

  // TODO duplicate 'orders/page.tsx, einen Service daraus machen'
  const { data: userData, error: userError } = await superbaseClient.auth.getUser()

  const { data, error } = await superbaseClient
    .from('restaurant')
    .select()
    .eq('user_id', userData.user?.id)
    .single()

  if (userError) {
    logger.error(userError.message, 'KitchenSettings - get user')
  }

  if (error) {
    logger.error(error.message, 'KitchenSettings - fetch features')
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
