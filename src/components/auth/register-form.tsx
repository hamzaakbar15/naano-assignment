"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Briefcase, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ROLE_COPY = {
  creator: {
    title: "I'm a creator",
    description: "Get booked by companies to publish sponsored LinkedIn posts.",
    icon: Megaphone,
  },
  company: {
    title: "I'm a company",
    description: "Browse creators and book sponsored posts at a fixed price.",
    icon: Briefcase,
  },
} as const;

export function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = roleParam === "creator" || roleParam === "company" ? roleParam : null;

  if (!role) return <RolePicker />;
  return <SignupForm role={role} />;
}

function RolePicker() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-xl font-semibold tracking-tight">Join Naano</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick how you&apos;ll use it.</p>
      <div className="mt-6 space-y-3">
        {(Object.keys(ROLE_COPY) as Array<keyof typeof ROLE_COPY>).map((key) => {
          const Icon = ROLE_COPY[key].icon;
          return (
            <Link
              key={key}
              href={`/register?role=${key}`}
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/60"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium">{ROLE_COPY[key].title}</p>
                <p className="text-xs text-muted-foreground">{ROLE_COPY[key].description}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function SignupForm({ role }: { role: "creator" | "company" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: role.toUpperCase() }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (signInRes?.error) {
      setError("Account created, but sign-in failed. Try logging in.");
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-xl font-semibold tracking-tight">{ROLE_COPY[role].title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{ROLE_COPY[role].description}</p>
      <div className={cn("mt-6 space-y-4", error && "mt-4")}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/register" className="underline underline-offset-4">
            Choose a different role
          </Link>
        </p>
      </div>
    </div>
  );
}
