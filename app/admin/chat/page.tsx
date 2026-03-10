"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, ShieldCheck, Loader2, ChevronLeft, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ChatMessage } from "@/lib/chat-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch active chat sessions
  const { data: sessionsData, mutate: mutateSessions } = useSWR("/api/chat?type=sessions", fetcher, {
    refreshInterval: 5000,
  });

  // Fetch messages for the selected chat
  const { data: messagesData, error: messagesError, mutate: mutateMessages } = useSWR(
    selectedChatId ? `/api/chat?chatId=${selectedChatId}` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  const sessions = sessionsData?.sessions || [];
  const messages: ChatMessage[] = messagesData?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !selectedChatId) return;

    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "admin",
          senderName: "Support Admin",
          text: input.trim(),
          chatId: selectedChatId,
        }),
      });

      if (response.ok) {
        setInput("");
        mutateMessages();
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
    <div className="container py-8 mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Support Chat Console</h1>
        <p className="text-muted-foreground mt-1">Communicate directly with users in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <Card className="md:col-span-1 h-[70vh] flex flex-col border-primary/20 shadow-lg">
          <CardHeader className="border-b bg-muted/30 py-4 px-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Active Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No active chat sessions
              </div>
            ) : (
              sessions.map((session: any) => (
                <button
                  key={session.chatId}
                  onClick={() => setSelectedChatId(session.chatId)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors flex flex-col gap-1",
                    selectedChatId === session.chatId 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted"
                  )}
                >
                  <div className="font-medium truncate">{session.senderName}</div>
                  <div className={cn(
                    "text-[10px] truncate",
                    selectedChatId === session.chatId ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    ID: {session.chatId}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 h-[70vh] flex flex-col border-primary/20 shadow-lg">
          {!selectedChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquare className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold">Select a conversation</h3>
              <p className="text-muted-foreground max-w-xs">
                Choose a user from the sidebar to start responding to their support request.
              </p>
            </div>
          ) : (
            <>
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {sessions.find((s: any) => s.chatId === selectedChatId)?.senderName || "User Chat"}
                        <Badge className="bg-primary text-primary-foreground">Active</Badge>
                      </CardTitle>
                      <CardDescription>Managing user support conversation</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedChatId(null)} className="md:hidden">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gradient-to-b from-transparent to-primary/5"
              >
                {messages.length === 0 && !messagesError && (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                {messagesError && (
                  <div className="text-center text-destructive py-4">
                    Failed to load chat messages.
                  </div>
                )}

                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex items-start gap-3",
                      msg.sender === "admin" ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      msg.sender === "user" ? "bg-secondary/10" : "bg-primary/10"
                    )}>
                      {msg.sender === "user" ? (
                        <User className="h-5 w-5 text-secondary" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className={cn(
                        "p-3 rounded-2xl max-w-[85%] text-sm shadow-sm",
                        msg.sender === "user" 
                          ? "bg-muted rounded-tl-none border border-border" 
                          : "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                      )}>
                        {msg.text}
                      </div>
                      <div className={cn(
                        "text-[10px] text-muted-foreground px-1",
                        msg.sender === "admin" ? "text-right" : "text-left"
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
                    placeholder="Reply to user..." 
                    className="flex-1 bg-background" 
                    disabled={sending}
                  />
                  <Button type="submit" disabled={sending || !input.trim()}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Reply
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
