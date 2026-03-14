import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { Ticket, ClipboardList, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect("/");
  }

  if (session.user?.role === "admin") {
    redirect("/admin");
  }

  const name = session.user?.name;

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] mx-auto px-4 text-center">
      <div className="max-w-3xl space-y-6">
        {name && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-700">
             <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Welcome back, {name}</span>
          </div>
        )}
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
          User <span className="text-muted-foreground">Dashboard</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Describe your problem and get immediate assistance from our dedicated IT support team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Need Help?
                </CardTitle>
                <CardDescription>
                  Create a new support ticket and get assigned to a technician.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  href="/tickets/create" 
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full gap-2")}
                >
                  Get Help Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Check Status
                </CardTitle>
                <CardDescription>
                  View your current position in the waitlist and chat with AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  href="/waitlist" 
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full gap-2")}
                >
                  View Waitlist
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
