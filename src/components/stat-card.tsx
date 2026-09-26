import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-muted text-foreground",
  pending: "bg-status-pending-bg text-status-pending",
  active: "bg-status-active-bg text-status-active",
  completed: "bg-status-completed-bg text-status-completed",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  featured = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: keyof typeof TONES;
  /** Brand-gradient treatment - reserved for the headline money figure. */
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl p-5",
        featured ? "bg-brand-gradient text-white" : "border border-border bg-card text-card-foreground"
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "font-mono text-[11px] font-medium tracking-wider uppercase",
            featured ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold tracking-tight">{value}</p>
        {hint && <p className={cn("mt-1 text-xs", featured ? "text-white/75" : "text-muted-foreground")}>{hint}</p>}
      </div>
      {Icon && (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            featured ? "bg-white/15 text-white" : TONES[tone]
          )}
        >
          <Icon className="size-4.5" />
        </div>
      )}
    </div>
  );
}
