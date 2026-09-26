import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/** Top bar for the public marketing pages (landing, about, legal). */
export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-5 sm:px-6">
      {/* Below 400px there isn't room for the wordmark plus both buttons, so
          only the logo mark shows (the name stays available to screen readers). */}
      <BrandLogo wordmarkClassName="max-[399px]:sr-only" />
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="lg" className="max-sm:h-8 max-sm:px-2.5" nativeButton={false} render={<Link href="/login" />}>
          Sign in
        </Button>
        <Button size="lg" className="max-sm:h-8 max-sm:px-3" nativeButton={false} render={<Link href="/register" />}>
          Get started
        </Button>
      </div>
    </header>
  );
}
