"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, loginAdmin } from "@/lib/mock-auth";
import Link from "next/link";
import { ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [state, formAction, isPending] = useActionState(
    isAdmin ? loginAdmin : loginUser,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="flex bg-muted p-1 rounded-lg">
        <Button
          variant={!isAdmin ? "default" : "ghost"}
          className="flex-1 gap-2"
          onClick={() => { setIsAdmin(false); }}
          disabled={isPending}
        >
          <UserIcon className="h-4 w-4" />
          User
        </Button>
        <Button
          variant={isAdmin ? "default" : "ghost"}
          className="flex-1 gap-2"
          onClick={() => { setIsAdmin(true); }}
          disabled={isPending}
        >
          <ShieldCheck className="h-4 w-4" />
          Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isAdmin ? "Admin Login" : "User Login"}</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Enter your administrator credentials" 
              : "Enter your name and password to access your account."}
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="grid gap-4">
            {state?.error && <div className="text-destructive text-sm font-medium">{state.error}</div>}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder={isAdmin ? "Admin Name" : "Your Name"} 
                required 
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isPending} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${isAdmin ? "Admin" : "User"}`
              )}
            </Button>
            {!isAdmin && (
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline font-medium hover:text-primary transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
