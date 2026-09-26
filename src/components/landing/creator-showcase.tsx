import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { listCreators } from "@/lib/creators";
import { formatUSD } from "@/lib/format";
import { FloatingCubes, type Cube } from "@/components/landing/floating-cubes";

// xl+: content column is max-w-5xl (512px either side of centre), so gutter
// cubes sit at ~585px. Below xl: centred in the 80px top/bottom
// padding bands ((80 - size) / 2), clear of content even at full drift.
const CUBES: Cube[] = [
  { top: "18%", x: -580, size: 48, photo: 15, duration: 8.9, delay: -3.4, show: "xl-up" },
  { top: "64%", x: 585, size: 38, photo: 60, duration: 6.1, delay: -0.7, show: "xl-up" },
  { top: "22px", left: "10%", size: 36, photo: 41, duration: 7.3, delay: -4.4, show: "below-xl" },
  { bottom: "21px", right: "9%", size: 38, photo: 57, duration: 8.4, delay: -1.6, show: "below-xl" },
];

/** First three creators from the live marketplace listing - real data, not copy. */
export async function CreatorShowcase() {
  const creators = await listCreators({ take: 3 });
  if (creators.length === 0) return null;

  return (
    <section className="relative px-6 py-20">
      <FloatingCubes cubes={CUBES} />
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              On the marketplace now
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Work with all the best creators</h2>
          </div>
          <Link
            href="/marketplace"
            prefetch={false}
            className="inline-flex items-center gap-1.5 font-heading text-sm font-medium text-primary hover:underline"
          >
            Browse all creators
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const name = creator.user.name || "Unnamed creator";
            return (
              <div key={creator.id} className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <PersonAvatar name={name} />
                  <div className="min-w-0">
                    <p className="truncate font-heading font-medium">{name}</p>
                    {creator.country && <p className="truncate text-sm text-muted-foreground">{creator.country}</p>}
                  </div>
                </div>

                {creator.headline && (
                  <p className="mt-3 truncate text-sm text-muted-foreground" title={creator.headline}>
                    {creator.headline}
                  </p>
                )}

                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                  {creator.industries.map((i) => (
                    <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {i}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      Per post
                    </p>
                    <p className="mt-0.5 font-mono text-xl font-semibold">{formatUSD(creator.pricePerPost)}</p>
                  </div>
                  {/* Goes to the creator's profile: signed-in companies book from
                      there, everyone else is sent to sign in first by middleware. */}
                  <Button
                    size="lg"
                    className="px-5"
                    nativeButton={false}
                    render={<Link href={`/marketplace/${creator.id}`} prefetch={false} />}
                  >
                    Book
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
