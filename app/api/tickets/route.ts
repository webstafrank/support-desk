import { NextResponse } from 'next/server'
import { ticketStore } from "@/lib/tickets-store"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tickets = await ticketStore.getTickets();
  return NextResponse.json({ tickets })
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json()
  const newTicket = await ticketStore.addTicket(body);
  return NextResponse.json({ success: true, ticket: newTicket })
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
  
  const deleted = await ticketStore.deleteTicket(id);
  return NextResponse.json({ success: deleted, message: deleted ? "Ticket deleted" : "Ticket not found" })
}
