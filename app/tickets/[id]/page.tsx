import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TicketForm from "@/components/tickets/TicketForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <main className="container flex flex-col items-center">
      <div className="w-full flex justify-between items-center py-4">
        <Link
          href="/tickets"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Ticket #{id}</h1>
      </div>
      <TicketForm id={id} />
    </main>
  );
}
