import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PersonAvatar } from "@/components/person-avatar";
import { BookButton } from "@/components/marketplace/book-button";
import { formatUSD } from "@/lib/format";
import { estimateReach } from "@/lib/estimate-reach";

export default async function CreatorProfilePage({ params }: { params: { id: string } }) {
  const creator = await prisma.creatorProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } } },
  });
  if (!creator) notFound();

  const name = creator.user.name || "Unnamed creator";
  const reach = estimateReach(creator.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start gap-4">
        <PersonAvatar name={name} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
          {creator.headline && <p className="mt-1 text-muted-foreground">{creator.headline}</p>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {creator.industries.map((i) => (
              <Badge key={i} variant="secondary">
                {i}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Price per post</p>
            <p className="mt-1 text-xl font-semibold">{formatUSD(creator.pricePerPost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Typical reach</p>
            <p className="mt-1 text-xl font-semibold">{reach.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">estimated</p>
          </CardContent>
        </Card>
        {creator.country && (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="mt-1 text-xl font-semibold">{creator.country}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {creator.linkedinUrl && (
        <a
          href={creator.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium underline underline-offset-4"
        >
          View LinkedIn profile ↗
        </a>
      )}

      <div>
        <BookButton creatorId={creator.id} size="lg" />
      </div>
    </div>
  );
}
