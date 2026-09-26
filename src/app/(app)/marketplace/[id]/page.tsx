import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PersonAvatar } from "@/components/person-avatar";
import { BookButton } from "@/components/marketplace/book-button";
import { formatUSD } from "@/lib/format";
import { estimateReach } from "@/lib/estimate-reach";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-mono text-xl font-semibold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default async function CreatorProfilePage({ params }: { params: { id: string } }) {
  const creator = await prisma.creatorProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true } } },
  });
  if (!creator) notFound();

  const name = creator.user.name || "Unnamed creator";
  const reach = estimateReach(creator.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 font-heading text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Marketplace
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <PersonAvatar name={name} size="lg" />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
              {creator.headline && <p className="mt-1 text-muted-foreground">{creator.headline}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {creator.industries.map((i) => (
                  <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <BookButton creatorId={creator.id} size="lg" className="sm:w-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Price per post" value={formatUSD(creator.pricePerPost)} />
        <Stat label="Typical reach" value={reach.toLocaleString()} hint="estimated" />
        {creator.country && <Stat label="Country" value={creator.country} />}
      </div>

      {creator.linkedinUrl && (
        <a
          href={creator.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-heading text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View LinkedIn profile ↗
        </a>
      )}
    </div>
  );
}
