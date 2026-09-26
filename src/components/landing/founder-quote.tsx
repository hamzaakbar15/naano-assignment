import { FloatingCubes, type Cube } from "@/components/landing/floating-cubes";
import { CEO } from "@/lib/founders";

// xl+: panel is max-w-5xl (512px either side of centre), so gutter cubes sit
// at ~585px. Below xl: centred in the 80px top/bottom
// padding bands ((80 - size) / 2), clear of content even at full drift.
const CUBES: Cube[] = [
  { top: "10%", x: 585, size: 42, photo: 23, duration: 7.5, delay: -6.2, show: "xl-up" },
  { top: "68%", x: -590, size: 52, photo: 68, duration: 8.2, delay: -2.9, show: "xl-up" },
  { top: "22px", right: "22%", size: 36, photo: 64, duration: 6.9, delay: -5.1, show: "below-xl" },
  { bottom: "20px", left: "18%", size: 40, photo: 3, duration: 7.8, delay: -2.3, show: "below-xl" },
];

export function FounderQuote() {
  return (
    <section className="relative px-6 py-20">
      <FloatingCubes cubes={CUBES} />
      <figure className="bg-brand-gradient mx-auto flex max-w-5xl flex-col gap-8 rounded-2xl p-8 text-white sm:flex-row sm:items-center sm:gap-10 sm:p-12">
        {/* Thomas's own headshot from naano.com - same image as the About page. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CEO.photo}
          alt={CEO.name}
          width={112}
          height={112}
          loading="lazy"
          className="size-24 shrink-0 rounded-2xl bg-white/15 object-cover ring-4 ring-white/20 sm:size-28"
        />
        <div>
          <blockquote className="font-heading text-xl leading-snug font-medium text-balance sm:text-2xl">
            &ldquo;We kept watching great B2B teams chase LinkedIn creators through cold DMs and spreadsheets, and
            creators undersell themselves in endless back-and-forth. Naano turns that into one clear price, one click to
            book, and one place to see the post go live.&rdquo;
          </blockquote>
          <figcaption className="mt-6 font-mono text-[11px] font-medium tracking-wider text-white/80 uppercase">
            {CEO.name} — Co-founder &amp; CEO
          </figcaption>
        </div>
      </figure>
    </section>
  );
}
