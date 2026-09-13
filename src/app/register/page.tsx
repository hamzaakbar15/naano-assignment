import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Join Naano</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick how you&apos;ll use it.</p>
      </div>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
