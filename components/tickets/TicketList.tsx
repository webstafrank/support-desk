"use client";

import useSWR from "swr";
import { type Ticket } from "@/app/tickets/data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import TicketStatus from "./TicketStatus";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TicketList({ 
  statusFilter = "all" 
}: { 
  statusFilter?: "all" | "pending" | "closed" 
}) {
  const { data, error, isLoading } = useSWR("/api/tickets", fetcher, {
    refreshInterval: 3000, 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 w-full col-span-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 w-full col-span-full">
        <p className="text-destructive">Failed to load tickets.</p>
      </div>
    );
  }

  let tickets: Ticket[] = data?.tickets || [];

  if (statusFilter === "pending") {
    tickets = tickets.filter(t => t.status === "open" || t.status === "in progress");
  } else if (statusFilter === "closed") {
    tickets = tickets.filter(t => t.status === "closed");
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10 w-full col-span-full border-2 border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No support tickets in the queue.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function TicketItem({ ticket }: { ticket: Ticket }) {
  // Ensure dates are objects
  const createdAt = new Date(ticket.createdAt);

  return (
    <Link href={`/tickets/${ticket.id}`} className="block hover:scale-[1.02] transition-transform">
      <Card className="h-full border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium line-clamp-1 mr-2">{ticket.subject}</CardTitle>
          <TicketStatus status={ticket.status} />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold mb-1">{ticket.name}</div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {ticket.problemDescription}
          </p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              {createdAt.toLocaleDateString()}
            </p>
            <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0 h-5">
              {ticket.priority.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}