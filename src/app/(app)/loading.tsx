import { Skeleton } from "@/components/ui/skeleton";

// Fallback for (app) pages without their own loading.tsx. Renders inside the
// (app) layout, so the sidebar shell is already on screen - content only.
export default function AppShellLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
