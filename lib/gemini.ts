import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK with your API key
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey, {
  httpOptions: { apiVersion: 'v1' } // Use v1 instead of v1beta
});

export async function generatePromptRefinement(userPrompt: string, answers?: Record<number, string>): Promise<string> {
  try {
    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct the prompt based on whether we have answers or not
    let promptText = `
      You are an AI prompt engineering assistant. Your task is to refine and improve the following user prompt to make it more effective, detailed, and likely to produce better results from AI systems.

      Original user prompt: "${userPrompt}"
`;

    // If we have answers, include them in the prompt
    if (answers && Object.keys(answers).length > 0) {
      promptText += `
      The user has provided the following additional information:
`;

      // Add each answer to the prompt
      Object.entries(answers).forEach(([questionIndex, answer]) => {
        promptText += `      - ${answer}\n`;
      });
    }

    // Complete the prompt with instructions
    promptText += `
      Please provide a refined version that:
      1. Adds more specific details and context
      2. Clarifies the desired format or structure
      3. Includes any necessary constraints or requirements
      4. Makes the intent clearer
      ${answers ? '5. Incorporates all the additional information provided by the user' : ''}

      Return only the refined prompt without explanations or additional text.
    `;

    const prompt = promptText;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const refinedPrompt = response.text();

    return refinedPrompt;
  } catch (error: any) {
    console.error('Error generating prompt refinement:', error);

    // Check for specific error types
    if (error.status === 404) {
      throw new Error('Gemini API model not found. The model may not be available in the current API version.');
    } else if (error.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    } else if (error.message && (error.message.includes('models/gemini-pro is not found') || error.message.includes('not found for API version'))) {
      throw new Error('Gemini API model not found. Please check the API version configuration.');
    }

    throw new Error(`Failed to generate prompt refinement: ${error.message || 'Unknown error'}`);
  }
}

export async function generateQuestions(userPrompt: string): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI prompt engineering assistant. Based on the following user prompt, generate clarification questions to help refine it.

      Original user prompt: "${userPrompt}"

      Generate two types of questions:
      1. General clarification questions about tone, purpose, or audience (2 questions)
      2. Topic-specific questions based on keywords in the prompt (1 question)

      For each question, provide 4-5 multiple-choice options.

      Return the result in JSON format like this:
      {
        "questions": [
          {
            "question": "What tone would you like to use?",
            "options": ["Formal", "Semi-formal", "Friendly", "Assertive"]
          },
          {
            "question": "What is the main intent?",
            "options": ["Request", "Information", "Feedback", "Other"]
          },
          {
            "question": "[Topic-specific question here]?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
          }
        ]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const response = result.response;
    const jsonText = response.text();

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonText);
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Fallback to default questions
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
  } catch (error: any) {
    console.error('Error generating questions:', error);

    // Log specific error information
    if (error.status === 404) {
      console.error('Gemini API model not found. The model may not be available in the current API version.');
    } else if (error.status === 429) {
      console.error('Gemini API rate limit exceeded. Please try again later.');
    } else if (error.message && (error.message.includes('models/gemini-pro is not found') || error.message.includes('not found for API version'))) {
      console.error('Gemini API model not found. Please check the API version configuration.');
    }

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

export async function generatePromptSuggestions(userPrompt: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an AI prompt engineering assistant. Based on the following user prompt, suggest 3 different ways to improve or modify it for better results.

      Original user prompt: "${userPrompt}"

      Provide exactly 3 alternative versions, each on a new line, numbered 1-3. Each alternative should take a slightly different approach or emphasize different aspects.

      Return only the numbered list of alternatives without explanations or additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestionsText = response.text();

    // Parse the suggestions into an array
    const suggestions = suggestionsText
      .split('\n')
      .filter(line => line.trim().match(/^\d+\.\s/)) // Filter lines that start with a number and period
      .map(line => line.replace(/^\d+\.\s/, '').trim()); // Remove the numbering

    return suggestions.slice(0, 3); // Ensure we return exactly 3 suggestions
  } catch (error: any) {
    console.error('Error generating prompt suggestions:', error);

    // Log specific error information
    if (error.status === 404) {
      console.error('Gemini API model not found. The model may not be available in the current API version.');
    } else if (error.status === 429) {
      console.error('Gemini API rate limit exceeded. Please try again later.');
    } else if (error.message && (error.message.includes('models/gemini-pro is not found') || error.message.includes('not found for API version'))) {
      console.error('Gemini API model not found. Please check the API version configuration.');
    }

    // Return fallback suggestions
    return [
      'Add more specific details about what you want',
      'Specify the format or structure you prefer',
      'Include any constraints or requirements'
    ];
  }
}
