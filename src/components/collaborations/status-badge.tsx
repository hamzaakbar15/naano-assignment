import { cn } from "@/lib/utils";
import { COLLAB_STATUS_LABELS } from "@/lib/constants";

const STYLES = {
  PENDING: { dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-500/15" },
  ACTIVE: { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-300", bg: "bg-blue-100 dark:bg-blue-500/15" },
  COMPLETED: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  DECLINED: { dot: "bg-muted-foreground/50", text: "text-muted-foreground", bg: "bg-muted" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof STYLES }) {
  const style = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {COLLAB_STATUS_LABELS[status]}
    </span>
  );
}
