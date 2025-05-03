import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return Supabase providers
    const providers = {
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: '/api/auth/google',
      }
    };

    return NextResponse.json({
      status: 'success',
      providers,
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
