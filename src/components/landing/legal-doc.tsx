import { PublicPage } from "@/components/landing/public-page";

export type LegalSection = { heading: string; body: React.ReactNode };

/** Shared layout for the Terms and Privacy pages. */
export function LegalDoc({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <PublicPage>
      <article className="px-6 pt-16 pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Last updated {updated}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <div className="mt-5 text-lg text-muted-foreground">{intro}</div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-10">
            <ol className="space-y-9">
              {sections.map((section, i) => (
                <li key={section.heading}>
                  <h2 className="flex items-baseline gap-3 text-lg font-semibold">
                    <span className="font-mono text-xs text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </h2>
                  <div className="mt-2 space-y-3 pl-8 text-[15px] leading-relaxed text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:space-y-1.5">
                    {section.body}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>
    </PublicPage>
  );
}
