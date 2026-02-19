export type Ticket = {
  id: string;
  name: string;
  subject: string;
  problemDescription: string;
  status: "open" | "closed" | "in progress";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
};

export const tickets: Ticket[] = [
  {
    id: "1",
    name: "John Doe",
    subject: "Website not loading",
    problemDescription: "The company website is not accessible from any browser.",
    status: "open",
    priority: "high",
    createdAt: new Date("2023-01-15T10:00:00Z"),
    updatedAt: new Date("2023-01-15T10:00:00Z"),
  },
  {
    id: "2",
    name: "Jane Smith",
    subject: "Email client configuration",
    problemDescription: "Need assistance configuring Outlook for a new employee.",
    status: "in progress",
    priority: "medium",
    createdAt: new Date("2023-01-16T11:30:00Z"),
    updatedAt: new Date("2023-01-16T14:00:00Z"),
  },
  {
    id: "3",
    name: "Peter Jones",
    subject: "Printer not responding",
    problemDescription: "Office printer is offline and not printing documents.",
    status: "closed",
    priority: "low",
    createdAt: new Date("2023-01-17T09:00:00Z"),
    updatedAt: new Date("2023-01-17T11:00:00Z"),
  },
  {
    id: "4",
    name: "Alice Brown",
    subject: "Software installation request",
    problemDescription: "Request for Adobe Photoshop installation on a new workstation.",
    status: "open",
    priority: "medium",
    createdAt: new Date("2023-01-18T14:15:00Z"),
    updatedAt: new Date("2023-01-18T14:15:00Z"),
  },
  {
    id: "5",
    name: "Bob White",
    subject: "Network drive access issue",
    problemDescription: "Unable to access shared network drive, permission denied.",
    status: "in progress",
    priority: "high",
    createdAt: new Date("2023-01-19T10:45:00Z"),
    updatedAt: new Date("2023-01-19T12:30:00Z"),
  },
];