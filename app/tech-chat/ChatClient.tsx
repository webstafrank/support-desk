"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type ChatMessage } from "@/lib/chat-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Simple ShieldCheck icon since it was missing in some imports
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

interface ChatClientProps {
  initialUserName: string;
  department: string;
}

export default function ChatClient({ initialUserName, department }: ChatClientProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create a unique chatId for this session/user
    let id = localStorage.getItem('support_chat_id');
    if (!id) {
      id = initialUserName !== "User" ? initialUserName : `user_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('support_chat_id', id);
    }
    setChatId(id);
  }, [initialUserName]);

  const { data, error, mutate } = useSWR(
    chatId ? `/api/chat?chatId=${chatId}` : null, 
    fetcher, 
    { refreshInterval: 2000 }
  );

  const messages: ChatMessage[] = data?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !chatId) return;

    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user",
          senderName: initialUserName,
          text: input.trim(),
          chatId: chatId,
          department: department,
        }),
      });

      if (response.ok) {
        setInput("");
        mutate();
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("An error occurred while sending");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-10 flex flex-col items-center">
      <Card className="w-full max-w-4xl h-[70vh] flex flex-col border-primary/20 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Chat with Technician
                  <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">Online</Badge>
                </CardTitle>
                <CardDescription>Direct support from our IT team (Dept: {department})</CardDescription>
              </div>
            </div>
            <Link href="/waitlist">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Waitlist
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-primary/5"
        >
          {!chatId && (
             <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {chatId && messages.length === 0 && !error && (
            <div className="text-center py-10 text-muted-foreground">
              <p>No messages yet. Send a message to start chatting with a technician.</p>
            </div>
          )}

          {error && (
            <div className="text-center text-destructive py-4">
              Failed to load chat messages.
            </div>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex items-start gap-3",
                msg.sender === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                msg.sender === "admin" ? "bg-primary/10" : "bg-secondary/10"
              )}>
                {msg.sender === "admin" ? (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="space-y-1">
                <div className={cn(
                  "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                  msg.sender === "admin" 
                    ? "bg-muted rounded-tl-none border border-border" 
                    : "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                )}>
                  {msg.text}
                </div>
                <div className={cn(
                  "text-[10px] text-muted-foreground px-1",
                  msg.sender === "user" ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t bg-muted/30">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message technician..." 
              className="flex-1 bg-background" 
              disabled={sending || !chatId}
            />
            <Button type="submit" disabled={sending || !input.trim() || !chatId}>
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
