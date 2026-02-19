import { tickets as initialTickets, type Ticket } from "@/app/tickets/data"

// In-memory store for the prototype
// Note: This will not persist between server restarts or in serverless environments with multiple instances
class TicketStore {
  private static instance: TicketStore;
  private tickets: Ticket[] = [...initialTickets];

  private constructor() {}

  public static getInstance(): TicketStore {
    if (!TicketStore.instance) {
      TicketStore.instance = new TicketStore();
    }
    return TicketStore.instance;
  }

  public getTickets(): Ticket[] {
    return [...this.tickets].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  public addTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Ticket {
    const newTicket: Ticket = {
      ...ticket,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tickets.push(newTicket);
    return newTicket;
  }

  public deleteTicket(id: string): boolean {
    const initialLength = this.tickets.length;
    this.tickets = this.tickets.filter(t => t.id !== id);
    return this.tickets.length < initialLength;
  }
}

export const ticketStore = TicketStore.getInstance();
