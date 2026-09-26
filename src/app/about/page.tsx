import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Handshake, Megaphone, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOUNDERS } from "@/lib/founders";
import { PublicPage } from "@/components/landing/public-page";

export const metadata: Metadata = {
  title: "About us — Naano",
  description: "The team behind the B2B LinkedIn creator marketplace.",
};

// Copy adapted (not copied) from the About page on naano.com.
const FACTS = [
  { label: "Founded", value: "2025, Paris, France" },
  { label: "Category", value: "B2B LinkedIn creator marketplace" },
];

const FOR_BRANDS = [
  { icon: TrendingUp, title: "A new growth channel", text: "Turn LinkedIn creators into one of your strongest sales channels." },
  { icon: BadgeCheck, title: "Borrowed authority", text: "Get recommended by voices your buyers already trust in your industry." },
  { icon: Megaphone, title: "People, not ads", text: "Reach buyers through real professionals instead of another banner." },
];

const FOR_CREATORS = [
  { icon: Sparkles, title: "Expertise is the asset", text: "Your credibility counts for more than your follower count." },
  { icon: Handshake, title: "Paid for what you already do", text: "Get paid to recommend tools you genuinely use and believe in." },
  { icon: Wallet, title: "Earn from your network", text: "Turn the audience you have built on LinkedIn into revenue." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{children}</p>
  );
}

export default function AboutPage() {
  return (
    <PublicPage>
      <section className="px-6 pt-16 pb-20 text-center sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Our story</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Founders, building for founders.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-balance text-muted-foreground">
            Naano is the B2B LinkedIn creator marketplace, connecting companies that want to grow with trusted
            creators who want to earn from the audience they&apos;ve built.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="flex flex-col items-center rounded-xl border border-border bg-card p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.photo}
                alt={f.name}
                width={96}
                height={96}
                loading="lazy"
                className="size-24 rounded-2xl bg-muted object-cover ring-4 ring-primary-soft"
              />
              <p className="mt-3 font-heading font-medium">{f.name}</p>
              <p className="mt-0.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">{f.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>How we started</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Growth led by people, not ads.</h2>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>
                We started Naano because we believe growth works better when it comes from people. Buyers listen to
                professionals they already follow far more than to another ad.
              </p>
              <p>
                So we help businesses grow through creator-led growth: real professionals, speaking to real audiences
                who trust them.
              </p>
            </div>
          </div>
          <div>
            <Eyebrow>Our mission</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Make creator marketing a channel you can rely on.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We match B2B companies with LinkedIn micro-creators who bring two things ads can&apos;t buy:
            </p>
            <ul className="mt-3 space-y-2">
              {["Real credibility in their industry", "Trust that turns into growth"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-border bg-background p-4">
                  <dt className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Eyebrow>Why Naano</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Better for brands. Better for creators.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { heading: "For brands", items: FOR_BRANDS },
              { heading: "For creators", items: FOR_CREATORS },
            ].map((col) => (
              <div key={col.heading} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{col.heading}</h3>
                <ul className="mt-5 space-y-5">
                  {col.items.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <Icon className="size-4.5" />
                      </span>
                      <div>
                        <p className="font-heading font-medium">{title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="bg-brand-gradient mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-2xl p-10 text-center text-white sm:p-14">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Traditional advertising is losing its pull. Collaboration is what comes next.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              className="h-11 border-transparent bg-white px-5 text-[#10151a] hover:bg-white/90 hover:text-[#10151a] dark:bg-white dark:hover:bg-white/90"
              nativeButton={false}
              render={<Link href="/register?role=company" />}
            >
              I&apos;m a company
            </Button>
            <Button
              variant="outline"
              className="h-11 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white dark:border-white/40 dark:bg-transparent dark:hover:bg-white/10"
              nativeButton={false}
              render={<Link href="/register?role=creator" />}
            >
              I&apos;m a creator
            </Button>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
