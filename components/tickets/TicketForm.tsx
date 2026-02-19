"use client";

import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { tickets } from "@/app/tickets/data";
import { useEffect } from "react";
import { createTicket } from "@/app/lib/actions";

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

export default function TicketForm({ id }: { id?: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      problemDescription: "",
      status: "open",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (id) {
      const ticket = tickets.find((ticket) => ticket.id === id);
      if (ticket) {
        form.reset(ticket);
      }
    }
  }, [id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // This onSubmit will now call the server action
    if (id) {
      // Update ticket logic (not part of this request)
      toast.success("Ticket updated successfully!");
    } else {
      const result = await createTicket(values);
      if (result.success) {
        toast.success("Ticket created successfully!");
        router.push("/tickets/waiting");
      } else {
        toast.error(result.message);
      }
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{id ? "Edit Ticket" : "Create Ticket"}</CardTitle>
        <CardDescription>
          {id
            ? `Fill in the form below to update ticket #${id}.`
            : "Fill in the form below to create a new ticket."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Ticket subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your problem in detail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{id ? "Update Ticket" : "Create Ticket"}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
