import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Admin paths reachable without a session: the login screen and the magic-link landing. */
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/auth']

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lang = pathname.startsWith('/en') ? 'en' : 'ka'

  // Forward as request headers so server-component headers() can read them.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-lang', lang)
  requestHeaders.set('x-pathname', pathname)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  // Everything outside /admin is public: no session work, no added latency.
  if (!pathname.startsWith('/admin')) return response

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fail closed: without Supabase configured we cannot authenticate anyone, so
  // the admin area stays shut rather than falling open.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isPublicAdminPath(pathname)) return response
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Standard @supabase/ssr session refresh: reads the auth cookies off the
  // request and writes any rotated ones back onto the response.
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: requestHeaders } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isPublicAdminPath(pathname)) {
    // Redirect, never render: an unauthenticated request must not reach a page
    // that reads lead data.
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (user && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/leads', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|logos|api|studio).*)',
  ],
}
