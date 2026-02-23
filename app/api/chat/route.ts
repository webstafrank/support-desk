import { NextResponse } from 'next/server'
import { chatStore } from "@/lib/chat-store"

export async function GET() {
  const messages = await chatStore.getMessages();
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { sender, senderName, text } = body;
  
  if (!sender || !text) {
    return NextResponse.json({ success: false, message: "Missing sender or text" }, { status: 400 })
  }
  
  const newMessage = await chatStore.addMessage({
    sender,
    senderName: senderName || "User",
    text,
  });
  
  return NextResponse.json({ success: true, message: newMessage })
}
