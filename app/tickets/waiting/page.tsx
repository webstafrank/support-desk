"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId); // Clean up the timer
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Wait while we send you a technician</h1>
      <div className="flex flex-col items-center gap-4">
        <p className="text-8xl font-mono font-bold tracking-tighter text-primary">
          {formatTime(timeLeft)}
        </p>
        <p className="text-muted-foreground animate-pulse">Technician is being assigned...</p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Prefer to see your place in the queue?</p>
        <Link 
          href="/waitlist" 
          className={cn(buttonVariants({ variant: "outline" }), "gap-2 border-primary/20 hover:bg-primary/5")}
        >
          View Full Waitlist
        </Link>
      </div>
    </div>
  );
}
