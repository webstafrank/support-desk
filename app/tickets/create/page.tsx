import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TicketForm from "@/components/tickets/TicketForm";

import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("it_support_name")?.value || "";

  return (
    <main className="container flex flex-col items-center">
      <div className="w-full flex justify-between items-center py-4">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Create new ticket</h1>
      </div>
      <TicketForm defaultName={userName} />
    </main>
  );
}