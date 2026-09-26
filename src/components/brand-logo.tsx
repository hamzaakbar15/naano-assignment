import Link from "next/link";

/** Gradient logo box + wordmark, shared by the app sidebar and public pages. */
export function BrandLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="bg-brand-gradient flex size-8 items-center justify-center rounded-md font-heading text-sm font-bold text-white">
        N
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">Naano</span>
    </Link>
  );
}
