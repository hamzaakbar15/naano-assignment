import { cn } from "@/lib/utils";

/**
 * Decorative blurred-blob background. Absolutely positioned, pointer-events
 * disabled — drop into any `relative overflow-hidden` container. Used behind
 * the landing hero and the auth split-panel so both feel like one system.
 */
export function GradientBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute -top-32 -left-24 size-[26rem] rounded-full bg-blue-400/30 blur-[100px] dark:bg-blue-500/20" />
      <div className="absolute -right-24 top-1/4 size-[24rem] rounded-full bg-violet-400/25 blur-[100px] dark:bg-violet-500/20" />
      <div className="absolute bottom-0 left-1/4 size-[22rem] rounded-full bg-sky-300/25 blur-[100px] dark:bg-sky-500/15" />
    </div>
  );
}
