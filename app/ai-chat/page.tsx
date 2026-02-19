"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  source?: string;
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your AI support assistant powered by Gemini. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse: Message = {
          id: Math.random().toString(36).substring(7),
          sender: "ai",
          text: data.response,
          source: data.source,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        toast.error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 flex flex-col items-center">
      <Card className="w-full max-w-4xl h-[75vh] flex flex-col border-primary/20 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg shadow-inner">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Fix with AI Agent</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-0.5">
                  Powered by <span className="text-primary font-medium">Gemini 1.5 Flash</span>
                </CardDescription>
              </div>
            </div>
            <Link href="/waitlist">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Waitlist
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-primary/5"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.sender === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "p-2 rounded-xl shadow-sm",
                msg.sender === "ai" ? "bg-primary/10" : "bg-secondary/10"
              )}>
                {msg.sender === "ai" ? (
                  <Bot className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="space-y-1.5 max-w-[80%]">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.sender === "ai" 
                    ? "bg-muted rounded-tl-none border border-border" 
                    : "bg-primary text-primary-foreground rounded-tr-none ml-auto"
                )}>
                  {msg.text}
                </div>
                {msg.source && (
                  <div className="text-[10px] text-muted-foreground px-2 opacity-60">
                    Source: {msg.source}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-in fade-in duration-300">
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
                <Bot className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-border flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground italic">Thinking...</span>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t bg-muted/30">
          <form onSubmit={handleSend} className="flex gap-3">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your technical problem in detail..." 
              className="flex-1 bg-background h-11 px-4" 
              disabled={isLoading}
            />
            <Button type="submit" className="h-11 px-6 gap-2 shadow-lg" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </>
              )}
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest opacity-50 font-bold">
            Powered by KSA IT AI Core
          </p>
        </div>
      </Card>
    </div>
  );
}
