import Link from "next/link";
import { Users, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketplace</h1>
        <p className="text-sm text-muted-foreground">Browse creators and book a sponsored post.</p>
      </div>

      <MarketplaceFilters />

      {creators.length === 0 ? (
        <EmptyState
          icon={q || industry ? SearchX : Users}
          title={q || industry ? "No creators match those filters" : "No creators yet"}
          description={
            q || industry
              ? "Try a different search term or industry."
              : "Check back soon — new creators join regularly."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const name = creator.user.name || "Unnamed creator";
            return (
              <Card
                key={creator.id}
                className="flex flex-col transition-shadow hover:shadow-md hover:ring-foreground/20"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <PersonAvatar name={name} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{name}</p>
                      {creator.country && (
                        <p className="truncate text-sm text-muted-foreground">{creator.country}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {creator.industries.map((i) => (
                      <Badge key={i} variant="secondary">
                        {i}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{formatUSD(creator.pricePerPost)} / post</p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3.5" />
                      {estimateReach(creator.id).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" render={<Link href={`/marketplace/${creator.id}`} />}>
                    View profile
                  </Button>
                  <BookButton creatorId={creator.id} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
