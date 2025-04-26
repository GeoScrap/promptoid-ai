import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get environment variables related to Google OAuth
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const nodeEnv = process.env.NODE_ENV;

    // Check if required environment variables are set
    const missingVars = [];
    if (!googleClientId) missingVars.push('GOOGLE_CLIENT_ID');
    if (!googleClientSecret) missingVars.push('GOOGLE_CLIENT_SECRET');
    if (!nextAuthUrl) missingVars.push('NEXTAUTH_URL');
    if (!nextAuthSecret) missingVars.push('NEXTAUTH_SECRET');

    // Construct the expected callback URL
    const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`;

    // Get the current URL from the request
    const vercelUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : null;

    // Return the configuration (with masked secrets)
    return NextResponse.json({
      status: 'success',
      config: {
        googleClientId: googleClientId ? `${googleClientId.substring(0, 10)}...` : null,
        googleClientSecret: googleClientSecret ? '***' : null,
        nextAuthUrl,
        nextAuthSecret: nextAuthSecret ? '***' : null,
        nodeEnv,
        callbackUrl,
        vercelUrl,
      },
      missingVars: missingVars.length > 0 ? missingVars : null,
      message: missingVars.length > 0
        ? `Missing required environment variables: ${missingVars.join(', ')}`
        : 'All required environment variables are set',
      instructions: 'Make sure the callback URL is added to your Google OAuth configuration in the Google Cloud Console',
    });
  } catch (error) {
    console.error('Error in test-google API route:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
