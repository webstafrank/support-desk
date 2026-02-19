import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { logout } from "@/lib/mock-auth";

export default async function Navbar() {
  const cookieStore = await cookies();
  const role = cookieStore.get("it_support_role")?.value;
  const name = cookieStore.get("it_support_name")?.value;

  return (
    <Card className="p-4 mb-4 shadow-sm border-none rounded-none md:rounded-lg">
      <nav className="container flex items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-primary">
            KSA IT
          </Link>
          
          <div className="flex items-center gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
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
          {role ? (
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
