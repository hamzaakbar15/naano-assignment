import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { BookButton } from "@/components/marketplace/book-button";
import { formatUSD } from "@/lib/format";
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
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No creators match those filters yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <Card key={creator.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{creator.user.name || "Unnamed creator"}</CardTitle>
                {creator.country && <p className="text-sm text-muted-foreground">{creator.country}</p>}
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {creator.industries.map((i) => (
                    <Badge key={i} variant="secondary">
                      {i}
                    </Badge>
                  ))}
                </div>
                <p className="text-lg font-semibold">{formatUSD(creator.pricePerPost)} / post</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" render={<Link href={`/marketplace/${creator.id}`} />}>
                  View profile
                </Button>
                <BookButton creatorId={creator.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
