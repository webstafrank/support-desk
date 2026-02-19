import TicketList from "@/components/tickets/TicketList";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Bot, MessageSquare, ListTodo, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WaitlistPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="flex flex-col gap-4 text-center items-center">
        <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}>
           <ChevronLeft className="h-4 w-4 mr-2" />
           Back to Home
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Waitlist & Assistance</h1>
        <p className="text-muted-foreground text-lg max-w-[600px]">
          View your position in the queue, get instant help from our AI, or start a chat with an assigned technician.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Fix with AI agent
            </CardTitle>
            <CardDescription>
              Our AI assistant can help you resolve common issues instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai-chat" className="w-full block">
              <Button className="w-full" size="lg">Start AI Chat</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Chat with technician
            </CardTitle>
            <CardDescription>
              Direct messaging with an allocated IT support specialist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tech-chat" className="w-full block">
              <Button className="w-full" variant="outline" size="lg">Contact Technician</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Queue (Support Tickets)</h2>
        </div>
        <TicketList statusFilter="pending" />
      </div>
    </div>
  );
}
