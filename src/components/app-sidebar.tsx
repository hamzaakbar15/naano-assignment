"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Handshake, LayoutDashboard, LogOut, Store, Wallet, type LucideIcon } from "lucide-react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import { PersonAvatar } from "@/components/person-avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS: { href: string; label: string; icon: LucideIcon; roles: Role[] }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["CREATOR", "COMPANY"] },
  { href: "/marketplace", label: "Marketplace", icon: Store, roles: ["COMPANY"] },
  { href: "/collaborations", label: "Collaborations", icon: Handshake, roles: ["CREATOR", "COMPANY"] },
  { href: "/earnings", label: "Earnings", icon: Wallet, roles: ["CREATOR"] },
];

type ShellUser = { role: Role; name: string | null; email: string | null };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      aria-label="Sign out"
      title="Sign out"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <LogOut className="size-4" />
    </button>
  );
}

// Role, name and email come from the server layout rather than useSession():
// until the client session resolves they'd be undefined, and every link
// (including the other role's page) would render and be prefetched.
export function AppSidebar({ user }: { user: ShellUser }) {
  const pathname = usePathname();
  const links = LINKS.filter((l) => l.roles.includes(user.role));
  const displayName = user.name || user.email || "?";

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <aside className="fixed top-[3px] bottom-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center px-5">
          <BrandLogo href="/dashboard" />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          <p className="px-3 pb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Menu
          </p>
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {active && (
                  <span className="bg-brand-gradient absolute top-1.5 bottom-1.5 -left-3 w-1 rounded-r-full" aria-hidden />
                )}
                <Icon className={cn("size-4.5", active && "text-primary")} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 px-1">
            <PersonAvatar name={displayName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name || "Account"}</p>
              {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-1 px-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              {user.role === "COMPANY" ? "Company" : "Creator"}
            </span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile: top bar + scrollable nav row */}
      <header className="sticky top-[3px] z-40 border-b border-sidebar-border bg-sidebar md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <BrandLogo href="/dashboard" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 font-heading text-sm font-medium whitespace-nowrap",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("size-4", active && "text-primary")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
