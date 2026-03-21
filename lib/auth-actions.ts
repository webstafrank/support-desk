"use server";

import { signIn, signOut } from "@/auth";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Initial admin configuration from environment variables
const ADMIN_NAME = process.env.ADMIN_NAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdmin() {
  if (!ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD not set. Initial admin creation skipped.");
    return;
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { name: ADMIN_NAME },
    });

    if (!admin) {
      console.log("Seeding default admin user...");
      const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          name: ADMIN_NAME,
          hashedPassword: hashedPassword,
          department: "IT",
          role: "admin",
        },
      });
      console.log("Default admin user created successfully.");
    }
  } catch (err) {
    console.error("Critical error ensuring admin user exists:", err);
  }
}

export async function signupUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const department = formData.get("department")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !department || !password) {
    return { error: "All fields are required" };
  }

  let success = false;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return { error: "Username already taken" };
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        name,
        department,
        hashedPassword,
        role: "user",
      },
    });
    success = true;
  } catch (err) {
    console.error("Signup exception:", err);
    return { error: "Database error. Please try again later." };
  }

  if (success) {
    redirect("/login?signup=success");
  }
}

export async function login(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString() || "user";

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  if (role === "admin") {
    await ensureAdmin();
    // Pre-check for admin role
    const user = await prisma.user.findUnique({ where: { name } });
    if (user && user.role !== "admin") {
      return { error: "Access denied. Admin role required." };
    }
  }

  try {
    await signIn("credentials", {
      name,
      password,
      redirectTo: role === "admin" ? "/admin" : "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function loginUser(prevState: unknown, formData: FormData) {
  return login(prevState, formData);
}

export async function loginAdmin(prevState: unknown, formData: FormData) {
  return login(prevState, formData);
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
