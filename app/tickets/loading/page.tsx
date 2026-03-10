"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/tickets/waiting");
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <div className="relative flex flex-col items-center">
        <div className="p-6 bg-primary/5 rounded-full animate-pulse mb-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Booking your ticket...</h1>
        <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000">
          We're connecting you with our support team.
        </p>
        
        <div className="mt-8 w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading-bar_2s_ease-in-out_infinite]" 
               style={{ width: "30%" }}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(400%); width: 30%; }
        }
      `}</style>
    </div>
  );
}
