import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the Google OAuth configuration
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    
    // Check if the required environment variables are set
    const missingVars = [];
    if (!clientId) missingVars.push('GOOGLE_CLIENT_ID');
    if (!clientSecret) missingVars.push('GOOGLE_CLIENT_SECRET');
    if (!nextAuthUrl) missingVars.push('NEXTAUTH_URL');
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: `Missing environment variables: ${missingVars.join(', ')}`,
      }, { status: 400 });
    }
    
    // Construct the expected callback URL
    const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`;
    
    // Return the configuration (with masked secrets)
    return NextResponse.json({
      status: 'success',
      config: {
        clientId: `${clientId?.substring(0, 10)}...`,
        clientSecret: `${clientSecret?.substring(0, 5)}...`,
        nextAuthUrl,
        expectedCallbackUrl: callbackUrl,
      },
    });
  } catch (error) {
    console.error('Error in test-google API:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test Google OAuth configuration',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
