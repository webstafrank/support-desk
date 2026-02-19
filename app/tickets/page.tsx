import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TicketList from "@/components/tickets/TicketList";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <main className="container flex flex-col items-center">
      <div className="w-full flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Link
          href="/tickets/create"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create new ticket
        </Link>
      </div>
      <TicketList />
    </main>
  );
}