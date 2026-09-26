import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";

/** Shell for the public content pages: glow backdrop, header, footer. */
export function PublicPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page-glow relative isolate flex min-h-[calc(100dvh-3px)] flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
