import { NextResponse } from 'next/server';
import { refinePrompt } from '@/lib/ai-service';
import { getServerSession } from '@/app/api/auth/[...supabase]/route';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to refine prompts' },
        { status: 401 }
      );
    }

    // Get the prompt and answers from the request body
    const { prompt, answers } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A valid prompt is required' },
        { status: 400 }
      );
    }

    // Refine the prompt using our AI service with the user's answers if provided
    const refinedPrompt = await refinePrompt(prompt, answers);

    // Check if the refinedPrompt contains an error message
    if (refinedPrompt.includes("technical issue") || refinedPrompt.includes("API configuration")) {
      console.warn('Prompt refinement returned an error message:', refinedPrompt);

      // Check for specific error types
      let status = 500;
      let errorMessage = 'Failed to refine prompt';

      if (refinedPrompt.includes("insufficient balance") || refinedPrompt.includes("Insufficient Balance")) {
        errorMessage = 'AI service account has insufficient balance. Please add credits or configure an alternative API.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          refinedPrompt: refinedPrompt
        },
        { status: status }
      );
    }

    return NextResponse.json({ refinedPrompt });
  } catch (error) {
    console.error('Error refining prompt:', error);

    // Extract the error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Create a user-friendly error message based on the specific error
    let userMessage = 'I couldn\'t refine your prompt due to a technical issue.';

    if (errorMessage.includes('API key')) {
      userMessage = 'There seems to be an issue with the API key configuration.';
    } else if (errorMessage.includes('rate limit')) {
      userMessage = 'The AI service is currently experiencing high demand. Please try again in a few minutes.';
    } else if (errorMessage.includes('invalid response')) {
      userMessage = 'The AI service returned an unexpected response. Our team has been notified.';
    } else if (errorMessage.includes('insufficient balance') || errorMessage.includes('Insufficient Balance')) {
      userMessage = 'The AI service account has insufficient balance. Please add credits or configure an alternative API.';
    }

    // Return a more detailed error message
    return NextResponse.json(
      {
        error: 'Failed to refine prompt',
        message: errorMessage,
        refinedPrompt: `${userMessage} Please try again later or check your API configuration.\n\nOriginal prompt: ${prompt}`
      },
      { status: 500 }
    );
  }
}
