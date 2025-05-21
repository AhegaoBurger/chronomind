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
      content: "You are a helpful scheduling assistant. You can help users manage their calendar and schedule activities."
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
    return NextResponse.json({ response: aiContent });

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
