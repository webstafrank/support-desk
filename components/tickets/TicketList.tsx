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
    <div className="block transition-transform">
      <Card className="h-full border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold text-primary">Ticket #{ticket.id}</CardTitle>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Queue Position
            </p>
          </div>
          <TicketStatus status={ticket.status} />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-primary/5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase">Submitted</span>
              <span className="text-xs font-medium">{createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-muted-foreground uppercase">Priority</span>
              <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"} className="text-[9px] px-1.5 py-0 h-4 uppercase">
                {ticket.priority}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}