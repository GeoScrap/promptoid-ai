import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the request URL for debugging
  console.log('Middleware - Request URL:', request.url);

  // Get the pathname
  const { pathname } = request.nextUrl;

  // Log more details for auth-related requests
  if (pathname.includes('/api/auth')) {
    console.log('Auth Request Details:', {
      pathname,
      search: request.nextUrl.search,
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
    });
  }

  // Add headers for debugging
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/login',
    '/dashboard/:path*',
    '/direct-signin',
    '/auth-debug-test',
  ],
};
