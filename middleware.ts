import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = req.nextUrl.pathname
  const res = NextResponse.next()

  if (path.startsWith('/login')) {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()
    url.pathname = '/'
    if (session) return NextResponse.redirect(url)
  }

  return res // TODO maybe not needed
}
