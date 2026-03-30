"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { logout } from "@/lib/auth-actions";

type NavbarSession = {
  user?: {
    name?: string | null;
    role?: string;
  };
} | null;

const sessionFetcher = async (): Promise<NavbarSession> => {
  const response = await fetch("/api/auth/session", {
    credentials: "same-origin",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<NavbarSession>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    sessionFetcher()
      .then((data) => {
        if (active) {
          setSession(data);
        }
      })
      .catch(() => {
        if (active) {
          setSession(null);
        }
      })
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  const role = session?.user?.role;
  const name = session?.user?.name;
  const homeHref = role === "admin" ? "/admin" : role === "user" ? "/dashboard" : "/";

  return (
    <Card className="p-4 mb-4 shadow-sm border-none rounded-none md:rounded-lg">
      <nav className="container flex items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href={homeHref} className="font-bold text-xl tracking-tight text-primary">
            KSA IT
          </Link>

          <div className="flex items-center gap-2">
            <Link href={homeHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Home
            </Link>

            {role === "user" && (
              <>
                <Link href="/tickets/create" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Create Ticket
                </Link>
                <Link href="/waitlist" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Waitlist
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link href="/admin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Admin Dashboard
                </Link>
                <Link href="/admin/chat" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Admin Chat
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!ready ? (
            <div className="h-9 w-36 rounded-full bg-muted animate-pulse" />
          ) : role ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-medium">
                {role === "admin" ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>Admin: {name || "Admin"}</span>
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{name || "User"}</span>
                  </>
                )}
              </div>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Login
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </Card>
  );
}
