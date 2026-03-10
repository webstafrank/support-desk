import LoginForm from "@/app/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40 p-4">
      <Suspense fallback={<div className="w-full max-w-sm h-[400px] animate-pulse bg-muted rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
