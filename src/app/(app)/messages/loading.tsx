import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesLoading() {
  return (
    <div className="grid h-[calc(100dvh-11rem)] min-h-[440px] overflow-hidden rounded-2xl border border-border bg-card md:h-[calc(100dvh-5rem-3px)] lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
      <div className="space-y-3 p-4 lg:border-r lg:border-border">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <Skeleton className="size-9 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block" />
    </div>
  );
}
