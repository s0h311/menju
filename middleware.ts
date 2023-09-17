import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { RouteKitchenDashboard, RouteLogin } from './types/routes'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = req.nextUrl.pathname
  const res = NextResponse.next()

  if (path.includes(RouteKitchenDashboard)) {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (path === RouteLogin && session) {
      url.pathname = RouteKitchenDashboard
      return NextResponse.redirect(url)
    }
    if (path === RouteKitchenDashboard && !session) {
      url.pathname = RouteLogin
      return NextResponse.redirect(url)
    } else return res
  }

  return res
}
