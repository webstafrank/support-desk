import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { ArrowRight, Ticket, ClipboardList, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const role = (await cookies()).get("it_support_role")?.value;

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] mx-auto px-4 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
          KSA IT Support <span className="text-muted-foreground">Desk Portal</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          {role === "admin" 
            ? "Administrative portal for managing IT support requests and technicians."
            : "Describe your problem and get immediate assistance from our dedicated IT support team."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {role === "admin" ? (
            <Link 
              href="/admin" 
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-2 h-14 px-8 text-lg font-bold shadow-lg")}
            >
              <ShieldCheck className="h-5 w-5" />
              Admin Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
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
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
