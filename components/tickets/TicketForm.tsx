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

export default function TicketForm({ id, defaultName = "" }: { id?: string; defaultName?: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName,
      subject: "Support Request",
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
    } else if (defaultName) {
      form.setValue("name", defaultName);
    }
  }, [id, form, defaultName]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure name is set if not provided (should be set by defaultName)
    if (!values.name && defaultName) {
      values.name = defaultName;
    }
    
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
            : "Describe your problem to get help."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe what you need help with (e.g. 'I can't connect to the printer', 'My email is not syncing')"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <Button type="submit" className="w-full h-11">
              {id ? "Update Ticket" : "Submit Support Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
