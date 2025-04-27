import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the error from the URL
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const callbackUrl = url.searchParams.get('callbackUrl');

  // Redirect to the default error page
  const errorUrl = new URL('/auth/error', url.origin);
  if (error) {
    errorUrl.searchParams.set('error', error);
  }
  if (callbackUrl) {
    errorUrl.searchParams.set('callbackUrl', callbackUrl);
  }

  return NextResponse.redirect(errorUrl);
}
