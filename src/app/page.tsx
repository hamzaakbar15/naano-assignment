import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Naano
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Book LinkedIn creators to publish sponsored posts.
      </h1>
      <p className="mt-4 max-w-xl text-balance text-muted-foreground">
        Companies find creators by industry, book them at a fixed price, and
        track each collaboration from request to delivery. Creators get paid
        for posts, not followers.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register?role=company"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          I&apos;m a company
        </Link>
        <Link
          href="/register?role=creator"
          className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          I&apos;m a creator
        </Link>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </main>
  );
}
