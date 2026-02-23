"use client";

import { useActionState, useEffect } from "react";
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
import { signupUser } from "@/lib/mock-auth";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupUser, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">User Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create a user account.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid gap-4">
          {state?.error && <div className="text-destructive text-sm font-medium">{state.error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Max Robinson" required disabled={isPending} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" placeholder="IT, Sales, HR..." required disabled={isPending} />
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium hover:text-primary transition-colors">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
