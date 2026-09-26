import Link from "next/link";
import { cn } from "@/lib/utils";

/** Gradient logo box + wordmark, shared by the app sidebar and public pages. */
export function BrandLogo({
  href = "/",
  wordmarkClassName,
}: {
  href?: string;
  /** e.g. visually hide the wordmark on very narrow headers (keep it for screen readers). */
  wordmarkClassName?: string;
}) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2.5">
      <span
        aria-hidden
        className="bg-brand-gradient flex size-8 items-center justify-center rounded-md font-heading text-sm font-bold text-white"
      >
        N
      </span>
      <span className={cn("font-heading text-lg font-semibold tracking-tight", wordmarkClassName)}>Naano</span>
    </Link>
  );
}
