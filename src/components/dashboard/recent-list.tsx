import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PersonAvatar } from "@/components/person-avatar";
import { StatusBadge } from "@/components/collaborations/status-badge";
import { EmptyState } from "@/components/empty-state";
import { formatUSD } from "@/lib/format";
import type { CollabStatus } from "@prisma/client";

export type RecentItem = {
  id: string;
  name: string;
  status: CollabStatus;
  price: number;
};

export function RecentList({
  items,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  items: RecentItem[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {items.map((item, i) => (
        <Link
          key={item.id}
          href="/collaborations"
          className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/60 ${
            i !== items.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <PersonAvatar name={item.name} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
          <span className="font-mono text-sm text-muted-foreground tabular-nums">{formatUSD(item.price)}</span>
          <StatusBadge status={item.status} />
        </Link>
      ))}
    </div>
  );
}
