import prisma from "./prisma";
import { type Ticket } from "@/app/tickets/data"

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
      return await prisma.ticket.findMany({
        orderBy: { createdAt: "asc" }
      }) as unknown as Ticket[];
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return [];
    }
  }

  public async addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt"> & { department?: string }): Promise<Ticket> {
    try {
      return await prisma.ticket.create({
        data: {
          name: ticket.name,
          subject: ticket.subject,
          problemDescription: ticket.problemDescription,
          status: ticket.status,
          priority: ticket.priority,
          department: ticket.department || "General",
        }
      }) as unknown as Ticket;
    } catch (error) {
      console.error("Error adding ticket:", error);
      throw error;
    }
  }

  public async deleteTicket(id: string): Promise<boolean> {
    try {
      await prisma.ticket.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return false;
    }
  }
}

export const ticketStore = TicketStore.getInstance();
