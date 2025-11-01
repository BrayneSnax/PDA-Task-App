/**
 * Gemini API Service
 * Uses OpenAI-compatible API format with gemini-2.5-flash model
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const API_TIMEOUT = 10000; // 10 seconds

interface GeminiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call Gemini API to generate pattern insight
 */
export async function generateInsight(prompt: string): Promise<string> {
  try {
    // Get API key from environment
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const insight = data.choices[0]?.message?.content?.trim();

    if (!insight) {
      throw new Error('No insight generated');
    }

    return insight;
  } catch (error) {
    console.error('Error generating insight:', error);
    
    // Return a graceful fallback message
    return 'The system is listening. As patterns emerge, I will offer a quiet observation here.';
  }
}
