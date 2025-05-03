// Import Gemini AI service provider
import * as geminiService from './gemini';

// Check if Gemini API key is configured
const useGemini = !!process.env.GEMINI_API_KEY;

/**
 * Refines a user prompt to make it more effective
 */
export async function refinePrompt(userPrompt: string, answers?: Record<number, string>): Promise<string> {
  try {
    // Check if we have the API key configured
    if (!useGemini) {
      return `Improved version of: ${userPrompt}

Please add your Gemini API key to enable AI-powered prompt refinement.`;
    }

    // Use Gemini API
    return await geminiService.generatePromptRefinement(userPrompt, answers);
  } catch (error) {
    console.error('Error in prompt refinement:', error);
    // Return a more helpful error message
    return `I couldn't refine your prompt due to a technical issue. Please try again later or check your API configuration.

Original prompt: ${userPrompt}`;
  }
}

/**
 * Generates dynamic questions based on the user's input prompt
 */
export async function getQuestions(userPrompt: string): Promise<any> {
  try {
    if (useGemini) {
      return await geminiService.generateQuestions(userPrompt);
    } else {
      // Fallback questions if no API key is configured
      return {
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
      };
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions
    return {
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
    };
  }
}

/**
 * Generates alternative prompt suggestions based on the user's input
 */
export async function getSuggestions(userPrompt: string): Promise<string[]> {
  try {
    if (useGemini) {
      return await geminiService.generatePromptSuggestions(userPrompt);
    } else {
      // Fallback suggestions if no API key is configured
      return [
        `${userPrompt} with more specific details`,
        `${userPrompt} with step-by-step instructions`,
        `${userPrompt} with examples included`
      ];
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      'Try adding more context to your prompt',
      'Consider specifying your desired output format',
      'Include any relevant constraints or requirements'
    ];
  }
}
