import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { RouteAdminDashboard, RouteKitchenDashboard, RouteLogin } from './types/routes'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = req.nextUrl.pathname
  const res = NextResponse.next()

  //  KITCHEN //
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

  // ADMIN //
  if (path.includes(RouteAdminDashboard)) {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const role = session?.user.role ?? 'notAdmin'
    const allowedRoles = ['app_admin', 'app_superadmin']

    if (!session || !allowedRoles.includes(role)) {
      url.pathname = RouteLogin
      return NextResponse.redirect(url)
    } else return res
  }

  return res
}
