"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonAvatar } from "@/components/person-avatar";

const LINKS: { href: string; label: string; roles: Role[] }[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["CREATOR", "COMPANY"] },
  { href: "/marketplace", label: "Marketplace", roles: ["COMPANY"] },
  { href: "/collaborations", label: "Collaborations", roles: ["CREATOR", "COMPANY"] },
  { href: "/earnings", label: "Earnings", roles: ["CREATOR"] },
];

export function Nav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const displayName = session?.user?.name || session?.user?.email || "?";

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            Naano
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {LINKS.filter((l) => !role || l.roles.includes(role)).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === l.href && "bg-muted text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <PersonAvatar name={displayName} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">
                {session?.user?.email}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-1.5 sm:hidden">
        {LINKS.filter((l) => !role || l.roles.includes(role)).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground",
              pathname === l.href && "bg-muted text-foreground"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
