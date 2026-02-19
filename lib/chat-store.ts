export type ChatMessage = {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: Date;
};

class ChatStore {
  private static instance: ChatStore;
  private messages: ChatMessage[] = [
    {
      id: "1",
      sender: "admin",
      senderName: "Support Tech",
      text: "Hello, this is technical support. I'm reviewing your ticket. How can I assist?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    }
  ];

  private constructor() {}

  public static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  public getMessages(): ChatMessage[] {
    return this.messages;
  }

  public addMessage(message: Omit<ChatMessage, "id" | "timestamp">): ChatMessage {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

export const chatStore = ChatStore.getInstance();
