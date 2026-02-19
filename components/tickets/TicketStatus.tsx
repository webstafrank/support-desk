import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function TicketStatus({
  status,
}: {
  status: "open" | "closed" | "in progress";
}) {
  return (
    <Badge
      className={cn(
        {
          "bg-green-500": status === "open",
          "bg-red-500": status === "closed",
          "bg-yellow-500": status === "in progress",
        },
        "text-white"
      )}
    >
      {status}
    </Badge>
  );
}