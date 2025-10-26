import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public access to auth page
  if (pathname === '/auth') {
    return NextResponse.next()
  }

  // Check for auth session (you can customize this logic)
  const authToken = request.cookies.get('slush_auth_token')?.value

  // If no auth token, redirect to /auth
  if (!authToken && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon-.*\\.png|manifest.json|sw.js|.*\\..*).*)',
  ],
}

