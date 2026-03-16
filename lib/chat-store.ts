import prisma from "./prisma";

export type ChatMessage = {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: Date;
  chatId: string;
  department?: string;
};

class ChatStore {
  private static instance: ChatStore;

  private constructor() {}

  public static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  public async getMessages(chatId?: string): Promise<ChatMessage[]> {
    try {
      const where = chatId ? { chatId } : {};
      return await prisma.chatMessage.findMany({
        where,
        orderBy: { timestamp: "asc" }
      }) as unknown as ChatMessage[];
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  }

  public async getChatSessions(): Promise<{ chatId: string; senderName: string; department?: string }[]> {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { sender: "user" },
        distinct: ["chatId", "senderName"],
        select: {
          chatId: true,
          senderName: true,
          department: true,
        }
      });
      return messages
        .filter(m => m.chatId !== null)
        .map(m => ({
          chatId: m.chatId as string,
          senderName: m.senderName,
          department: m.department || undefined,
        }));
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      return [];
    }
  }

  public async addMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    try {
      return await prisma.chatMessage.create({
        data: {
          sender: message.sender,
          senderName: message.senderName,
          text: message.text,
          chatId: message.chatId,
          department: message.department || "General",
        }
      }) as unknown as ChatMessage;
    } catch (error) {
      console.error("Error adding chat message:", error);
      throw error;
    }
  }
}

export const chatStore = ChatStore.getInstance();
