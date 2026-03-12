"use server";

import { signIn, signOut } from "@/auth";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const DEFAULT_ADMIN = { name: "admin", password: "998877", department: "IT", role: "admin" };

async function ensureAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { name: DEFAULT_ADMIN.name },
    });

    if (!admin) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await prisma.user.create({
        data: {
          name: DEFAULT_ADMIN.name,
          hashedPassword: hashedPassword,
          department: DEFAULT_ADMIN.department,
          role: "admin",
        },
      });
      console.log("Default admin user created successfully.");
    }
  } catch (err) {
    console.error("Critical error ensuring admin user exists:", err);
    // Rethrow to let the caller handle it if necessary, but here we'll just log
  }
}

export async function signupUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const department = formData.get("department")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !department || !password) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return { error: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        department,
        hashedPassword,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Signup exception:", err);
    return { error: "Database error. Please try again later." };
  }

  redirect("/login?signup=success");
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    await signIn("credentials", {
      name,
      password,
      redirectTo: "/",
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

export async function loginAdmin(prevState: unknown, formData: FormData) {
  await ensureAdmin();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Name and password are required" };
  }

  try {
    // Check if user is admin before signing in (optional, but good for UX)
    const user = await prisma.user.findUnique({ where: { name } });
    if (user && user.role !== "admin") {
      return { error: "Access denied. Admin role required." };
    }

    await signIn("credentials", {
      name,
      password,
      redirectTo: "/admin",
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

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
