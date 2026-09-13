import Link from "next/link";
import { Search, Handshake, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GradientBackdrop } from "@/components/marketing/gradient-backdrop";

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
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-sm font-semibold tracking-tight">Naano</span>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="relative">
        <section className="relative px-6 pt-16 pb-24 sm:pt-20">
          <GradientBackdrop />
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
              For B2B companies &amp; LinkedIn creators
            </Badge>
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
              <Link
                href="/register?role=company"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/80"
              >
                I&apos;m a company
              </Link>
              <Link
                href="/register?role=creator"
                className="rounded-md border border-border bg-background/80 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
              >
                I&apos;m a creator
              </Link>
            </div>
          </div>

          {/* Illustrative preview of the actual product UI - not a fabricated metric */}
          <div className="mx-auto mt-16 max-w-md rounded-xl bg-card/90 p-4 shadow-xl ring-1 ring-foreground/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Amina Yusuf</p>
                <p className="text-xs text-muted-foreground">United Kingdom</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="mt-3 flex gap-1.5">
              <Badge variant="secondary">SaaS</Badge>
              <Badge variant="secondary">AI / ML</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">Price per post</span>
              <span className="text-sm font-semibold">$450</span>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              One simple loop, start to finish.
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="text-center sm:text-left">
                  <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted sm:mx-0">
                    <step.icon className="size-5" />
                  </div>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
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
          <span>Naano</span>
          <span>A creator-marketplace concept build.</span>
        </div>
      </footer>
    </div>
  );
}
