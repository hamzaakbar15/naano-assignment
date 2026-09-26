import Link from "next/link";
import { Users, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EmptyState } from "@/components/empty-state";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { BookButton } from "@/components/marketplace/book-button";
import { formatUSD } from "@/lib/format";
import { estimateReach } from "@/lib/estimate-reach";
import type { Prisma } from "@prisma/client";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { q?: string; industry?: string };
}) {
  const { q, industry } = searchParams;

  const where: Prisma.CreatorProfileWhereInput = {
    ...(industry ? { industries: { has: industry } } : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { headline: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const creators = await prisma.creatorProfile.findMany({
    where,
    include: { user: { select: { name: true } } },
    orderBy: { pricePerPost: "asc" },
  });

  const filtered = Boolean(q || industry);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse creators and book a sponsored post.</p>
        </div>
        <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          {creators.length} {creators.length === 1 ? "creator" : "creators"}
          {filtered ? " matching" : ""}
        </p>
      </div>

      <MarketplaceFilters />

      {creators.length === 0 ? (
        <EmptyState
          icon={filtered ? SearchX : Users}
          title={filtered ? "No creators match those filters" : "No creators yet"}
          description={
            filtered ? "Try a different search term or industry." : "Check back soon — new creators join regularly."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const name = creator.user.name || "Unnamed creator";
            return (
              <div
                key={creator.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <PersonAvatar name={name} />
                  <div className="min-w-0">
                    <p className="truncate font-heading font-medium">{name}</p>
                    {creator.country && <p className="truncate text-sm text-muted-foreground">{creator.country}</p>}
                  </div>
                </div>

                {creator.headline && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{creator.headline}</p>
                )}

                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                  {creator.industries.map((i) => (
                    <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {i}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Per post
                    </p>
                    <p className="mt-0.5 font-mono text-xl font-semibold">{formatUSD(creator.pricePerPost)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Est. reach
                    </p>
                    <p className="mt-0.5 font-mono text-sm">{estimateReach(creator.id).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {/* No prefetch: one per card would mean a burst of server renders on every marketplace load. */}
                  <Button
                    variant="outline"
                    className="flex-1"
                    nativeButton={false}
                    render={<Link href={`/marketplace/${creator.id}`} prefetch={false} />}
                  >
                    View profile
                  </Button>
                  <BookButton creatorId={creator.id} className="flex-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
