import AuthTabs from "@/app/components/auth/AuthTabs";
import { Suspense } from "react";
import { Bot } from "lucide-react";

export default async function Home() {
  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] mx-auto px-4 gap-8 py-10">
      <div className="max-w-3xl space-y-4 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-2">
          <Bot className="h-4 w-4" />
          KSA IT Support Portal
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary leading-tight">
          Welcome to <span className="text-muted-foreground">Support Desk</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Please sign in to your account to submit tickets, check waitlist status, or chat with our IT technicians.
        </p>
      </div>
      
      <div className="w-full flex justify-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
        <Suspense fallback={<div className="w-full max-w-sm h-[400px] animate-pulse bg-muted rounded-lg" />}>
          <AuthTabs />
        </Suspense>
      </div>
    </main>
  );
}
