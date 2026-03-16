import { auth } from "@/auth";
import ChatClient from "./ChatClient";
import { redirect } from "next/navigation";

export default async function TechChatPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const name = session.user.name || "User";
  const department = session.user.department || "General";

  return <ChatClient initialUserName={name} department={department} />;
}
