import { Skeleton } from "@/components/ui/skeleton";

// Shown the first time a signed-in visitor enters the app shell (e.g. right
// after login/onboarding), before we know their role to render the real nav.
export default function AppShellLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-7 w-14" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
