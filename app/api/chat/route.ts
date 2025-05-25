import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Instantiate Groq Client at module level
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body as { message: string; history?: ChatMessage[] };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set. The API route will not function.');
      return NextResponse.json({ error: 'API key not configured on server.' }, { status: 500 });
    }

    const systemPrompt: ChatMessage = {
      role: "system",
      content: `You are a helpful scheduling assistant. You can help users manage their calendar and schedule activities.
If you suggest creating a calendar event, include the event details in a JSON block within your response.
The JSON block should start with \`\`\`json and end with \`\`\`.
The JSON should include:
- title: string (required)
- description: string (optional)
- start: string (ISO 8601 format, required)
- end: string (ISO 8601 format, required)
- categoryId: string (e.g., "work", "personal", "health", "social", "finance", "education", "travel", "hobbies", "family", "other")
Example:
"Okay, I can help you schedule that.
\`\`\`json
{
  "title": "Team Meeting",
  "description": "Discuss project updates",
  "start": "2024-07-15T10:00:00Z",
  "end": "2024-07-15T11:00:00Z",
  "categoryId": "work"
}
\`\`\`"
`
    };

    const groqMessages: ChatMessage[] = [
      systemPrompt,
      ...history,
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama3-8b-8192",
    });

    const aiContent = completion.choices[0]?.message?.content || "Sorry, I could not generate a response.";

    // Attempt to extract and process suggested activity
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = aiContent.match(jsonBlockRegex);
    let suggestedActivity = null;

    if (match && match[1]) {
      try {
        const parsedJson = JSON.parse(match[1]);
        if (parsedJson.title && parsedJson.start && parsedJson.end && parsedJson.categoryId) {
          const startDate = new Date(parsedJson.start);
          const endDate = new Date(parsedJson.end);

          // Check if dates are valid
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            suggestedActivity = {
              title: parsedJson.title,
              description: parsedJson.description || null, // Optional
              start: startDate,
              end: endDate,
              categoryId: parsedJson.categoryId,
            };
          } else {
            console.warn("Invalid date format in suggested activity:", parsedJson.start, parsedJson.end);
          }
        } else {
          console.warn("Missing required fields in suggested activity JSON:", parsedJson);
        }
      } catch (jsonError) {
        console.error("Error parsing JSON from AI response:", jsonError);
      }
    }

    const responsePayload: { response: string; suggestedActivity?: any } = { response: aiContent };
    if (suggestedActivity) {
      responsePayload.suggestedActivity = suggestedActivity;
    }

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('Error in /api/chat route:', error);
    // Type guard for error with message property
    let errorMessage = 'Internal Server Error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as { message: string }).message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
