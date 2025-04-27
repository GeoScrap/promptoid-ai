import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired - required for Server Components
  const { data } = await supabase.auth.getSession();

  // Log session status for debugging
  console.log("Middleware - Session exists:", !!data.session);
  console.log("Middleware - Path:", request.nextUrl.pathname);

  // Check auth status for protected routes
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  if (pathname.startsWith('/dashboard')) {
    // If no session, redirect to login
    if (!data.session) {
      console.log("Middleware - No session, redirecting to login");
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    console.log("Middleware - Session found, allowing access to dashboard");
  }

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
    '/auth-debug',
  ],
};
