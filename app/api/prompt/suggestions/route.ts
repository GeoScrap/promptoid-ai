import { NextResponse } from 'next/server';
import { getSuggestions } from '@/lib/ai-service';
import { getServerSession } from '@/app/api/auth/[...supabase]/route';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to get prompt suggestions' },
        { status: 401 }
      );
    }

    // Get the prompt from the request body
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required' },
        { status: 400 }
      );
    }

    // Get suggestions using our AI service
    const suggestions = await getSuggestions(prompt);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating prompt suggestions:', error);

    // Extract the error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Create a user-friendly error message based on the specific error
    let userErrorMessage = 'Failed to generate prompt suggestions';

    if (errorMessage.includes('insufficient balance') || errorMessage.includes('Insufficient Balance')) {
      userErrorMessage = 'AI service account has insufficient balance. Please add credits or configure an alternative API.';
    }

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: userErrorMessage,
        message: errorMessage,
        // Return fallback suggestions
        suggestions: [
          'Add more specific details about what you want',
          'Specify the format or structure you prefer',
          'Include any constraints or requirements'
        ]
      },
      { status: 500 }
    );
  }
}
