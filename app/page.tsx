import { auth } from "@/auth";
import AuthTabs from "@/app/components/auth/AuthTabs";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role;

  if (session) {
    if (role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] mx-auto px-4 gap-8">
      <div className="max-w-3xl space-y-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
          KSA IT Support <span className="text-muted-foreground">Desk Portal</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Possibilities beyond our skies
        </p>
      </div>
      
      <div className="w-full flex justify-center py-4">
        <Suspense fallback={<div className="w-full max-w-sm h-[400px] animate-pulse bg-muted rounded-lg" />}>
          <AuthTabs />
        </Suspense>
      </div>
    </main>
  );
}
