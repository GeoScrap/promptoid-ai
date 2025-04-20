import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { refinePrompt, getQuestions } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { originalPrompt, answers } = await request.json();

    if (!originalPrompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // If we have the initial prompt but no answers, generate dynamic follow-up questions
    if (!answers) {
      try {
        // Generate dynamic questions based on the user's prompt
        const questionsData = await getQuestions(originalPrompt);
        return NextResponse.json(questionsData);
      } catch (error) {
        console.error("Error generating questions:", error);
        // Fallback questions if AI service is unavailable
        return NextResponse.json({
          questions: [
            {
              question: "What is the main purpose of this prompt?",
              options: ["Information gathering", "Creative content", "Technical assistance", "Other"]
            },
            {
              question: "What tone would you prefer?",
              options: ["Professional", "Casual", "Academic", "Conversational"]
            },
            {
              question: "How detailed should the response be?",
              options: ["Brief overview", "Moderate detail", "Comprehensive", "Extremely detailed"]
            }
          ]
        });
      }
    }

    // If we have both the prompt and answers, generate the refined prompt
    try {
      // Use the abstracted AI service to refine the prompt with the user's answers
      const refinedPrompt = await refinePrompt(originalPrompt, answers);

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
      console.error("Error generating refined prompt:", error);

      // Get the error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Check for specific error types
      let status = 500;
      let userErrorMessage = 'Failed to refine prompt';

      if (errorMessage.includes('insufficient balance') || errorMessage.includes('Insufficient Balance')) {
        userErrorMessage = 'AI service account has insufficient balance. Please add credits or configure an alternative API.';
      }

      // Fallback if AI service fails
      return NextResponse.json(
        {
          error: userErrorMessage,
          message: errorMessage,
          refinedPrompt: `I couldn't refine your prompt due to a technical issue. Please try again later or check your API configuration.\n\nOriginal prompt: ${originalPrompt}`
        },
        { status: status }
      );
    }
  } catch (error) {
    console.error("Error refining prompt:", error);
    return NextResponse.json({ error: "Failed to refine prompt" }, { status: 500 });
  }
}