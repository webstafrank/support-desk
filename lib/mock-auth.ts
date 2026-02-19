"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Mock "Database" in memory
// Note: In Next.js dev mode, this might reset often, but works for mock demos.
// For a more persistent mock, we could use a JSON file.
export type User = {
  name: string;
  password: string;
  department: string;
  role: "user" | "admin";
};

// Hardcoded admin for convenience
const admins: User[] = [
  { name: "admin", password: "998877", department: "IT", role: "admin" },
];

// In-memory user store
const users: User[] = [];

export async function signupUser(formData: FormData) {
  const name = formData.get("name")?.toString();
  const department = formData.get("department")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !department || !password) {
    return { error: "All fields are required" };
  }

  // Check if user already exists
  if (users.find(u => u.name === name)) {
    return { error: "User already exists" };
  }

  const newUser: User = { name, department, password, role: "user" };
  users.push(newUser);
  
  // Set session
  (await cookies()).set("it_support_role", "user");
  (await cookies()).set("it_support_name", name);
  (await cookies()).set("it_support_key", "secret1234");
  
  redirect("/");
}

export async function loginUser(formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  const user = users.find(u => u.name === name && u.password === password);
  
  if (!user) {
    return { error: "Invalid user credentials" };
  }

  (await cookies()).set("it_support_role", "user");
  (await cookies()).set("it_support_name", name);
  (await cookies()).set("it_support_key", "secret1234");
  
  redirect("/");
}

export async function loginAdmin(formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  const admin = admins.find(a => a.name === name && a.password === password);
  
  if (!admin) {
    return { error: "Invalid admin credentials" };
  }

  (await cookies()).set("it_support_role", "admin");
  (await cookies()).set("it_support_name", name);
  (await cookies()).set("it_support_key", "secret1234");
  
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("it_support_role");
  (await cookies()).delete("it_support_name");
  (await cookies()).delete("it_support_key");
  redirect("/login");
}
