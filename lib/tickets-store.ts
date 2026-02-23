import pool from "./db";
import { type Ticket } from "@/app/tickets/data"

// Database-backed store for the prototype using node-postgres
class TicketStore {
  private static instance: TicketStore;

  private constructor() {}

  public static getInstance(): TicketStore {
    if (!TicketStore.instance) {
      TicketStore.instance = new TicketStore();
    }
    return TicketStore.instance;
  }

  public async getTickets(): Promise<Ticket[]> {
    try {
      const result = await pool.query('SELECT * FROM "ksa"."Ticket" ORDER BY "createdAt" ASC');
      return result.rows.map((row: Record<string, unknown>) => ({
        ...row,
        createdAt: new Date(row.createdAt as string),
        updatedAt: new Date(row.updatedAt as string)
      } as Ticket));
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  }

  public async addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    try {
      const result = await pool.query(
        'INSERT INTO "ksa"."Ticket" (id, name, subject, "problemDescription", status, priority, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [id, ticket.name, ticket.subject, ticket.problemDescription, ticket.status, ticket.priority, now, now]
      );
      const row = result.rows[0];
      return {
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      };
    } catch (error) {
      console.error("Error adding ticket:", error);
      throw error;
    }
  }

  public async deleteTicket(id: string): Promise<boolean> {
    try {
      const result = await pool.query('DELETE FROM "ksa"."Ticket" WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return false;
    }
  }
}

export const ticketStore = TicketStore.getInstance();
