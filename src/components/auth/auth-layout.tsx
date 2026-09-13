import Link from "next/link";
import { Search, Handshake, TrendingUp } from "lucide-react";
import { GradientBackdrop } from "@/components/marketing/gradient-backdrop";

const POINTS = [
  { icon: Search, text: "Browse creators by industry and price" },
  { icon: Handshake, text: "Book at a fixed price, no negotiation" },
  { icon: TrendingUp, text: "Track every collaboration to delivery" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border bg-muted/30 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <GradientBackdrop />
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Naano
        </Link>
        <div>
          <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-balance">
            Book LinkedIn creators. Track every post.
          </h2>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point.text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <point.icon className="size-4 shrink-0" />
                {point.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">A creator-marketplace concept build.</p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 text-sm font-semibold tracking-tight lg:hidden">
          Naano
        </Link>
        {children}
      </div>
    </div>
  );
}
