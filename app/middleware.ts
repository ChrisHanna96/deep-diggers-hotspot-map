import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host') || ''

  if (host !== 'globaldeepdiggersundergroundmap.com') {
    url.hostname = 'globaldeepdiggersundergroundmap.com'
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}