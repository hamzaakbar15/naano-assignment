import Link from "next/link";
import { Search, Handshake, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatusBadge } from "@/components/collaborations/status-badge";

const STEPS = [
  {
    icon: Search,
    title: "Browse by industry",
    description: "Filter creators by industry and price until you find the right fit for your buyers.",
  },
  {
    icon: Handshake,
    title: "Book at a fixed price",
    description: "No back-and-forth negotiation. See the price up front, click book, and the creator takes it from there.",
  },
  {
    icon: TrendingUp,
    title: "Track to delivery",
    description: "Follow every collaboration from request to published post, all in one status table.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="lg" nativeButton={false} render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
            Get started
          </Button>
        </div>
      </header>

      <main className="relative">
        <section className="relative px-6 pt-16 pb-24 sm:pt-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="rounded-full bg-primary-soft px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-primary uppercase">
              For B2B companies &amp; LinkedIn creators
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Book LinkedIn creators.
              <br />
              Track every post.
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">
              Companies find creators by industry, book them at a fixed price, and
              follow each collaboration from request to delivery. Creators get
              paid for posts, not follower counts.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button className="h-11 px-5" nativeButton={false} render={<Link href="/register?role=company" />}>
                I&apos;m a company
              </Button>
              <Button
                variant="outline"
                className="h-11 bg-card px-5"
                nativeButton={false}
                render={<Link href="/register?role=creator" />}
              >
                I&apos;m a creator
              </Button>
            </div>
          </div>

          {/* Illustrative preview of the product UI. Deliberately made-up values that match
              no seeded creator, and labelled as an example, so it never reads as live data. */}
          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl shadow-foreground/5">
            <p className="mb-3 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Example creator card
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-medium">Jordan Reyes</p>
                <p className="text-xs text-muted-foreground">Canada</p>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>
            <div className="mt-3 flex gap-1.5">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">SaaS</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">AI / ML</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Price per post
              </span>
              <span className="font-mono text-sm font-semibold">$520</span>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              One simple loop, start to finish.
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="text-center sm:text-left">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary sm:mx-0">
                    <step.icon className="size-5" />
                  </div>
                  <p className="mt-4 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <span className="font-heading font-medium text-foreground">Naano</span>
          <span>A creator-marketplace concept build.</span>
        </div>
      </footer>
    </div>
  );
}
