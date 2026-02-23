"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pool from "./db";

export type User = {
  name: string;
  password: string;
  department: string;
  role: "user" | "admin";
};

// Hardcoded admin for convenience - will be checked in the DB
const DEFAULT_ADMIN = { name: "admin", password: "998877", department: "IT", role: "admin" };

async function ensureAdmin() {
  try {
    const result = await pool.query('SELECT * FROM "ksa"."User" WHERE name = $1', [DEFAULT_ADMIN.name]);
    if (result.rowCount === 0) {
      const id = Math.random().toString(36).substring(7);
      const now = new Date();
      await pool.query(
        'INSERT INTO "ksa"."User" (id, name, password, department, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, DEFAULT_ADMIN.name, DEFAULT_ADMIN.password, DEFAULT_ADMIN.department, DEFAULT_ADMIN.role, now, now]
      );
    }
  } catch (err) {
    console.error("Error ensuring admin user exists:", err);
  }
}

export async function signupUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString();
  const department = formData.get("department")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !department || !password) {
    return { error: "All fields are required" };
  }

  try {
    // Check if user already exists
    const result = await pool.query('SELECT * FROM "ksa"."User" WHERE name = $1', [name]);
    if (result.rowCount && result.rowCount > 0) {
      return { error: "User already exists" };
    }

    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    await pool.query(
      'INSERT INTO "ksa"."User" (id, name, password, department, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, name, password, department, "user", now, now]
    );
  } catch (err) {
    console.error("Signup error:", err);
    return { error: "An error occurred during signup" };
  }
  
  // Set session
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  (await cookies()).set("it_support_role", "user", { maxAge });
  (await cookies()).set("it_support_name", name, { maxAge });
  (await cookies()).set("it_support_key", "secret1234", { maxAge });
  
  redirect("/");
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    const result = await pool.query('SELECT * FROM "ksa"."User" WHERE name = $1 AND password = $2', [name, password]);
    const user = result.rows[0] as User | undefined;
    
    if (!user) {
      return { error: "Invalid user credentials" };
    }

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    (await cookies()).set("it_support_role", user.role, { maxAge });
    (await cookies()).set("it_support_name", user.name, { maxAge });
    (await cookies()).set("it_support_key", "secret1234", { maxAge });
  } catch (err) {
    console.error("Login error:", err);
    return { error: "An error occurred during login" };
  }
  
  redirect("/");
}

export async function loginAdmin(prevState: unknown, formData: FormData) {
  await ensureAdmin();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    const result = await pool.query('SELECT * FROM "ksa"."User" WHERE name = $1 AND password = $2 AND role = $3', [name, password, "admin"]);
    const admin = result.rows[0] as User | undefined;
    
    if (!admin) {
      return { error: "Invalid admin credentials" };
    }

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    (await cookies()).set("it_support_role", "admin", { maxAge });
    (await cookies()).set("it_support_name", admin.name, { maxAge });
    (await cookies()).set("it_support_key", "secret1234", { maxAge });
  } catch (err) {
    console.error("Admin login error:", err);
    return { error: "An error occurred during admin login" };
  }
  
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("it_support_role");
  (await cookies()).delete("it_support_name");
  (await cookies()).delete("it_support_key");
  redirect("/login");
}
