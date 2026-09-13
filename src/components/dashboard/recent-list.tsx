import Link from "next/link";
import { PersonAvatar } from "@/components/person-avatar";
import { StatusBadge } from "@/components/collaborations/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatUSD } from "@/lib/format";
import type { CollabStatus } from "@prisma/client";

export type RecentItem = {
  id: string;
  name: string;
  status: CollabStatus;
  price: number;
};

export function RecentList({ items, emptyLabel }: { items: RecentItem[]; emptyLabel: string }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">{emptyLabel}</CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      {items.map((item, i) => (
        <Link
          key={item.id}
          href="/collaborations"
          className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
            i !== items.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <PersonAvatar name={item.name} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
          <span className="text-sm text-muted-foreground">{formatUSD(item.price)}</span>
          <StatusBadge status={item.status} />
        </Link>
      ))}
    </div>
  );
}
