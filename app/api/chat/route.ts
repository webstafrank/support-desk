import { NextResponse } from 'next/server'
import { chatStore } from "@/lib/chat-store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');
  const type = searchParams.get('type');

  if (type === 'sessions') {
    const sessions = await chatStore.getChatSessions();
    return NextResponse.json({ sessions })
  }

  const messages = await chatStore.getMessages(chatId || undefined);
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { sender, senderName, text, chatId } = body;
  
  if (!sender || !text || !chatId) {
    return NextResponse.json({ success: false, message: "Missing sender, text or chatId" }, { status: 400 })
  }
  
  const newMessage = await chatStore.addMessage({
    sender,
    senderName: senderName || "User",
    text,
    chatId,
  });
  
  return NextResponse.json({ success: true, message: newMessage })
}
