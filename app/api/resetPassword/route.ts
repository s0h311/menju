import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const handler = async (request: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const newPassword = searchParams.get('newPassword')

  if (!userId || !newPassword)
    return NextResponse.json({ error: 'userId and newPassword must be present' }, { status: 400 })

  const supabaseClientAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE || '',
    { auth: { persistSession: false } }
  )

  const { data, error } = await supabaseClientAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  })

  return NextResponse.json({ data, error }, {})
}

export const PATCH = handler
