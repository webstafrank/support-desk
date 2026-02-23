"use server";

import { z } from "zod";
import { ticketStore } from "@/lib/tickets-store";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  problemDescription: z.string().min(10, {
    message: "Problem description must be at least 10 characters.",
  }),
  status: z.enum(["open", "closed", "in progress"]),
  priority: z.enum(["low", "medium", "high"]),
});

export async function createTicket(values: z.infer<typeof formSchema>) {
  // Validate data
  const validatedFields = formSchema.parse(values);
  
  try {
    const newTicket = await ticketStore.addTicket({
      ...validatedFields,
      // Status and Priority are already validated by Zod
    });
    
    // Revalidate the admin dashboard path so it shows the new ticket if the user navigates there
    revalidatePath("/admin");
    
    return { success: true, message: "Ticket created successfully!", ticket: newTicket };
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}
