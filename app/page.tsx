import { auth } from "@/auth";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Bot, ShieldCheck, Ticket } from "lucide-react";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session;
  const role = session?.user?.role;

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] mx-auto px-4 gap-12 py-10">
      <div className="max-w-4xl space-y-6 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <Bot className="h-4 w-4" />
          Next-Gen IT Support
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-tight">
          KSA IT Support <br />
          <span className="text-muted-foreground">Desk Portal</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Providing advanced technical assistance for your daily workflow. 
          Connect with technicians or use our AI agent for instant fixes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {isLoggedIn ? (
            <Link 
              href={role === "admin" ? "/admin" : "/dashboard"}
              className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20")}
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link 
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg gap-2 shadow-lg shadow-primary/20")}
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 px-8 text-lg")}
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <FeatureCard 
          icon={<Ticket className="h-8 w-8 text-primary" />}
          title="Smart Tickets"
          description="Submit and track your issues in real-time with our streamlined queue system."
        />
        <FeatureCard 
          icon={<Bot className="h-8 w-8 text-primary" />}
          title="AI Assistance"
          description="Get immediate solutions from our Gemini-powered IT support agent."
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-8 w-8 text-primary" />}
          title="Secure Auth"
          description="Enterprise-grade security ensuring your data and communications are protected."
        />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
