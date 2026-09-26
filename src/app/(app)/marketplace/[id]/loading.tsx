import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Skeleton className="h-4 w-28" />
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="size-12 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="mt-2 h-4 w-72" />
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
