"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingCubes, type Cube } from "@/components/landing/floating-cubes";

// lg+: content column is max-w-3xl (384px either side of centre), so gutter
// cubes sit at ~455px. Below lg: centred in the 80px top/bottom
// padding bands ((80 - size) / 2), clear of content even at full drift.
const CUBES: Cube[] = [
  { top: "22%", x: -455, size: 40, photo: 36, duration: 6.8, delay: -4.8, show: "lg-up" },
  { top: "66%", x: 455, size: 34, photo: 53, duration: 7.7, delay: -1.9, show: "lg-up" },
  { top: "22px", right: "12%", size: 36, photo: 11, duration: 8.7, delay: -3.1, show: "below-lg" },
  { bottom: "22px", left: "8%", size: 36, photo: 44, duration: 7.1, delay: -0.4, show: "below-lg" },
];

const FAQS = [
  {
    q: "How are creators vetted?",
    a: "Every creator builds a profile with their LinkedIn profile link, the industries they cover and their price per post. You can review all of it, and click through to their LinkedIn to read their past posts, before you book anyone.",
  },
  {
    q: "Is the price really fixed?",
    a: "Yes. Each creator sets one price per post, shown on their card and profile. That's what the booking costs: no bidding, no negotiation, no surprise fees added later.",
  },
  {
    q: "What happens if a creator declines?",
    a: "The request is marked Declined in your Collaborations list and nothing is owed. You're free to book another creator straight away.",
  },
  {
    q: "Who owns the post?",
    a: "The post is published on the creator's own LinkedIn account, so it lives on their profile, in front of their audience. Once it's live, the creator adds the link and it appears in your Collaborations list.",
  },
  {
    q: "How do creators get paid?",
    a: "When a creator marks a post as delivered, the booking's price is added to their Earnings page, so they always see what they've earned. A payout method isn't connected yet.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "No. You can book a single post, with no subscription and no minimum spend. Come back and book again whenever you need another.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Track the answer's natural height so max-height animates to exactly that,
  // and stays right if the text re-wraps on resize.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="border-b border-border last:border-b-0">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading font-medium transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:px-6"
        >
          {question}
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md border border-border transition-[transform,background-color,color] duration-300",
              open ? "rotate-45 bg-primary-soft text-primary" : "text-muted-foreground"
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        aria-hidden={!open}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative scroll-mt-8 px-6 py-20">
      <FloatingCubes cubes={CUBES} />
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          FAQ
        </p>
        <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          How the marketplace works
        </h2>
        <div className="mt-10 rounded-2xl border border-border bg-card">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
