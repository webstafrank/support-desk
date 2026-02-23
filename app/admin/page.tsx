"use client";

import { useState, useEffect } from "react";
import { type Ticket } from "@/app/tickets/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, User, Search, RefreshCw, MessageSquare, Loader2 } from "lucide-react";
import TicketStatus from "@/components/tickets/TicketStatus";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [ticketList, setTicketList] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();
      setTicketList(data.tickets.map((t: Ticket) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })));
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter tickets based on search term
  const filteredTickets = ticketList.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingTickets = filteredTickets.filter(t => t.status === "open" || t.status === "in progress");

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setTicketList(prev => prev.filter(t => t.id !== id));
        toast.success("Ticket deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete ticket");
      }
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      toast.error("An error occurred while deleting the ticket");
    }
  };

  return (
    <div className="container py-8 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage all support ticket requests in one place.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/admin/chat">
            <Button variant="secondary" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with Users
            </Button>
          </Link>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="pl-8 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={fetchTickets} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Queued Ticket List
            <Badge variant="secondary" className="rounded-full px-2.5">
              {loading ? "..." : pendingTickets.length}
            </Badge>
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading support requests...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                <CardHeader className="p-5 pb-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold">
                        {ticket.subject}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {ticket.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {ticket.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <TicketStatus status={ticket.status} />
                      <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.problemDescription}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex justify-end gap-2 bg-muted/30 pt-3">
                  <Link href="/admin/chat">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Chat with User
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDelete(ticket.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Request
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {pendingTickets.length === 0 && (
              <div className="text-center py-20 bg-muted/30 rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">
                  {searchTerm ? "No tickets matching your search." : "No pending tickets in the queue."}
                </p>
                {searchTerm && (
                  <Button variant="link" onClick={() => setSearchTerm("")}>
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
