import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { RouteAdminDashboard, RouteKitchenDashboard, RouteLogin } from './types/routes'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = request.nextUrl.pathname
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  //  KITCHEN //
  if (path.includes(RouteKitchenDashboard)) {
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
    } else return response
  }

  // ADMIN //
  if (path.includes(RouteAdminDashboard)) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const role = session?.user.role ?? 'notAdmin'
    const allowedRoles = ['app_admin', 'app_superadmin']

    if (!session || !allowedRoles.includes(role)) {
      url.pathname = RouteLogin
      return NextResponse.redirect(url)
    } else return response
  }

  return response
}
