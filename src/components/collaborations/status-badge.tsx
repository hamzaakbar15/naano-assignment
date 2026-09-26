import { cn } from "@/lib/utils";
import { COLLAB_STATUS_LABELS } from "@/lib/constants";

const STYLES = {
  PENDING: "bg-status-pending-bg text-status-pending",
  ACTIVE: "bg-status-active-bg text-status-active",
  COMPLETED: "bg-status-completed-bg text-status-completed",
  DECLINED: "bg-muted text-muted-foreground",
} as const;

export function StatusBadge({ status }: { status: keyof typeof STYLES }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide uppercase",
        STYLES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {COLLAB_STATUS_LABELS[status]}
    </span>
  );
}
