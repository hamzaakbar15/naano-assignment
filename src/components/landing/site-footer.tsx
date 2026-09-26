import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
      { label: "Get started", href: "/register" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About us", href: "/about" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The marketplace for sponsored LinkedIn posts. Fixed prices, clear status, delivered posts.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase sm:flex-row">
          <span>© {new Date().getFullYear()} Naano. All rights reserved.</span>
          <span>A creator-marketplace concept build</span>
        </div>
      </div>
    </footer>
  );
}
