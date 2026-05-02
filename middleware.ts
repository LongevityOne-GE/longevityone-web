import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lang = pathname.startsWith('/en') ? 'en' : 'ka'

  const response = NextResponse.next()
  response.headers.set('x-lang', lang)
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|logos|api|studio).*)',
  ],
}
