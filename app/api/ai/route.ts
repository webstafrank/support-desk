import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Note: Ensure GEMINI_API_KEY is set in your environment variables
const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Fallback if API key is not present (for development/demo purposes)
    if (!API_KEY) {
      console.warn("GEMINI_API_KEY not found. Using local fallback.");
      const mockResponse = getMockResponse(message);
      // Simulate slight delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ response: mockResponse, source: "Local Gemma Mock" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are a helpful IT support assistant for KSA IT Support. Be concise, professional, and friendly. Help the user solve their technical issue. Use the Google Search tool when necessary to provide accurate and up-to-date information.",
      tools: [
        {
          googleSearch: {},
        },
      ] as any,
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return NextResponse.json({ 
      response: responseText, 
      source: "Gemini 1.5 Flash with Google Search" 
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}

// Simple local fallback responses for standard support queries
function getMockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("printer") || msg.includes("print")) {
    return "I recommend checking if the printer is properly connected to the network. Often, restarting both the printer and your router resolves 'offline' issues. Is it showing any specific error codes?";
  }
  if (msg.includes("password") || msg.includes("login")) {
    return "For security reasons, I can't reset passwords directly. Please use the 'Forgot Password' link on the login page or contact the IT desk if you're locked out of your SSO account.";
  }
  if (msg.includes("slow") || msg.includes("performance")) {
    return "Slowness can be caused by many factors. Try closing unused browser tabs or checking for background system updates. If the issue persists, we might need to look at your RAM usage.";
  }
  return "I'm a simple IT support assistant. I've received your message about: '" + userMessage + "'. For more complex issues, please wait for a human technician or provide more details so I can better assist you.";
}
