import pool from "./db";

export type ChatMessage = {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  text: string;
  timestamp: Date;
  chatId: string;
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
      let query = 'SELECT * FROM "ChatMessage"';
      const params = [];
      if (chatId) {
        query += ' WHERE "chatId" = $1';
        params.push(chatId);
      }
      query += ' ORDER BY timestamp ASC';
      const result = await pool.query(query, params);
      return result.rows.map((row: Record<string, unknown>) => ({
        ...row,
        timestamp: new Date(row.timestamp as string)
      } as ChatMessage));
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }
  }

  public async getChatSessions(): Promise<{ chatId: string; senderName: string }[]> {
    try {
      const result = await pool.query(
        'SELECT DISTINCT "chatId", "senderName" FROM "ChatMessage" WHERE sender = \'user\''
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      return [];
    }
  }

  public async addMessage(message: Omit<ChatMessage, "id" | "timestamp">): Promise<ChatMessage> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    try {
      const result = await pool.query(
        'INSERT INTO "ChatMessage" (id, sender, "senderName", text, timestamp, "chatId") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, message.sender, message.senderName, message.text, now, message.chatId]
      );
      const row = result.rows[0];
      return {
        ...row,
        timestamp: new Date(row.timestamp)
      };
    } catch (error) {
      console.error("Error adding chat message:", error);
      throw error;
    }
  }
}

export const chatStore = ChatStore.getInstance();
