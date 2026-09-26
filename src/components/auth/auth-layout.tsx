import { Search, Handshake, TrendingUp } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const POINTS = [
  { icon: Search, text: "Browse creators by industry and price" },
  { icon: Handshake, text: "Book at a fixed price, no negotiation" },
  { icon: TrendingUp, text: "Track every collaboration to delivery" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100dvh-3px)] lg:grid-cols-2">
      <div className="hidden border-r border-border bg-card lg:flex lg:flex-col lg:justify-between lg:p-10">
        <BrandLogo />
        <div>
          <h2 className="max-w-sm text-3xl font-semibold tracking-tight text-balance">
            Book LinkedIn creators. Track every post.
          </h2>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <point.icon className="size-4" />
                </span>
                {point.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          A creator-marketplace concept build
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="mb-8 lg:hidden">
          <BrandLogo />
        </div>
        {children}
      </div>
    </div>
  );
}
