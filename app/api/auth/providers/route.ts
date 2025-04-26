import { NextResponse } from 'next/server';
import { getProviders } from 'next-auth/react';

export async function GET() {
  try {
    // Get the available authentication providers
    const providers = await getProviders();
    
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
