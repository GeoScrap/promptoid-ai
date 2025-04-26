import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the request URL
  const url = new URL(request.url);
  
  // Get environment variables
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const nodeEnv = process.env.NODE_ENV;
  
  // Calculate expected callback URLs
  const expectedCallbackUrls = [
    `${nextAuthUrl}/api/auth/callback/google`,
    vercelUrl ? `${vercelUrl}/api/auth/callback/google` : null,
    `${url.origin}/api/auth/callback/google`,
    // Common variations that might be used
    `${nextAuthUrl}/api/auth/callback/google/`,
    vercelUrl ? `${vercelUrl}/api/auth/callback/google/` : null,
    `${url.origin}/api/auth/callback/google/`,
  ].filter(Boolean);
  
  return NextResponse.json({
    requestUrl: request.url,
    origin: url.origin,
    host: url.host,
    pathname: url.pathname,
    environment: {
      nextAuthUrl,
      vercelUrl,
      nodeEnv,
    },
    expectedCallbackUrls,
    message: "Add these URLs to your Google OAuth Authorized redirect URIs in Google Cloud Console",
  });
}
