import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lang = pathname.startsWith('/en') ? 'en' : 'ka'

  // Forward as request headers so server-component headers() can read them
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-lang', lang)
  requestHeaders.set('x-pathname', pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|logos|api|studio).*)',
  ],
}
