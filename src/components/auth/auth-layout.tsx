import { Search, Handshake, TrendingUp } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { FloatingCubes, type Cube } from "@/components/landing/floating-cubes";

const POINTS = [
  { icon: Search, text: "Browse creators by industry and price" },
  { icon: Handshake, text: "Book at a fixed price, no negotiation" },
  { icon: TrendingUp, text: "Track every collaboration to delivery" },
];

// Side panel (lg+): the copy hugs the left edge and sits mid-height, so cubes
// go down the right-hand side and in the empty bands above and below it.
const PANEL_CUBES: Cube[] = [
  { top: "9%", right: "14%", size: 50, photo: 12, duration: 7.2, delay: -1.3, show: "lg-up" },
  { top: "21%", right: "38%", size: 38, photo: 47, duration: 8.6, delay: -4.1, show: "lg-up" },
  { top: "25%", right: "6%", size: 42, photo: 32, duration: 6.4, delay: -2.2, show: "lg-up" },
  { bottom: "24%", right: "5%", size: 46, photo: 15, duration: 7.9, delay: -5.6, show: "lg-up" },
  { bottom: "11%", right: "34%", size: 36, photo: 60, duration: 8.9, delay: -3.4, show: "lg-up" },
  { bottom: "9%", right: "5%", size: 40, photo: 23, duration: 6.1, delay: -0.7, show: "lg-up" },
];

// Below lg the panel is hidden, so cubes sit centred in the 80px padding bands
// above and below the form instead ((80 - size) / 2 from the edge).
const FORM_CUBES: Cube[] = [
  { top: "23px", left: "8%", size: 34, photo: 68, duration: 7.5, delay: -6.2, show: "below-lg" },
  { bottom: "22px", right: "10%", size: 36, photo: 36, duration: 8.2, delay: -2.9, show: "below-lg" },
  { bottom: "23px", left: "22%", size: 34, photo: 53, duration: 6.8, delay: -4.8, show: "below-lg" },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page-glow grid min-h-[calc(100dvh-3px)] lg:grid-cols-2">
      {/* `isolate` makes the panel its own stacking context, so its gradient paints
          first and the cubes (at -z-10) float above it but below the copy. */}
      <div className="bg-panel-glow relative isolate hidden overflow-hidden border-r border-border lg:flex lg:flex-col lg:items-start lg:justify-between lg:p-10">
        <FloatingCubes cubes={PANEL_CUBES} />
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

      <div className="relative isolate flex flex-col items-center justify-center overflow-hidden px-4 py-20 lg:py-12">
        <FloatingCubes cubes={FORM_CUBES} />
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
