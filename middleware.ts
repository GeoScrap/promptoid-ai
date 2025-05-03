import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a simple response with no auth checks
  const res = NextResponse.next();

  // Add cache control headers to prevent caching
  res.headers.set('Cache-Control', 'no-store, max-age=0');

  return res;
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/auth/callback',
  ],
};
