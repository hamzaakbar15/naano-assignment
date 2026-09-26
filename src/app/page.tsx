import Link from "next/link";
import { Search, Handshake, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/collaborations/status-badge";
import { FloatingCubes, type Cube } from "@/components/landing/floating-cubes";
import { CreatorShowcase } from "@/components/landing/creator-showcase";
import { FounderQuote } from "@/components/landing/founder-quote";
import { Faq } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

// The creator showcase reads live marketplace data; re-render at most once a
// minute rather than querying the database on every landing-page visit.
export const revalidate = 60;

// lg+: hero copy is max-w-3xl (384px either side of centre), so gutter cubes
// sit at ~450px. Below lg: centred in the 64px top / 96px bottom padding
// bands, so the ±9px drift keeps clear of the header and the copy.
const HERO_CUBES: Cube[] = [
  { top: "8%", x: -455, size: 50, photo: 12, duration: 7.2, delay: -1.3, show: "lg-up" },
  { top: "22%", x: 450, size: 54, photo: 32, duration: 8.6, delay: -4.1, show: "lg-up" },
  { top: "55%", x: -445, size: 40, photo: 5, duration: 6.4, delay: -2.2, show: "lg-up" },
  { top: "72%", x: 460, size: 44, photo: 47, duration: 7.9, delay: -5.6, show: "lg-up" },
  { top: "15px", right: "8%", size: 34, photo: 8, duration: 7.4, delay: -2.6, show: "below-lg" },
  { bottom: "26px", left: "6%", size: 44, photo: 20, duration: 8.1, delay: -0.9, show: "below-lg" },
  { bottom: "31px", right: "14%", size: 34, photo: 27, duration: 6.6, delay: -3.8, show: "below-lg" },
];

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
    // isolate + overflow-hidden: the cubes (at -z-10) stay behind every section
    // and are clipped at the page edges.
    <div className="bg-page-glow relative isolate overflow-hidden">
      <SiteHeader />

      <main className="relative">
        <section className="relative px-6 pt-16 pb-24 sm:pt-20">
          <FloatingCubes cubes={HERO_CUBES} />
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

        <section id="how-it-works" className="scroll-mt-8 border-y border-border bg-card px-6 py-20">
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

        <CreatorShowcase />
        <FounderQuote />
        <Faq />
      </main>

      <SiteFooter />
    </div>
  );
}
