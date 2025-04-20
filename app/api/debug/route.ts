import { NextResponse } from 'next/server';

export async function GET() {
  // Only enable this in development or with proper authentication in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'Debug endpoint disabled in production' }, { status: 403 });
  }

  // Return environment variables for debugging
  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL,
    google_client_id: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 5) + '...',
    database_url: process.env.DATABASE_URL?.substring(0, 20) + '...',
    node_env: process.env.NODE_ENV,
  });
}
