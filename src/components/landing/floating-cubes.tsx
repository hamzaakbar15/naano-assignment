import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type Cube = {
  size: number;
  /** pravatar.cc image number. */
  photo: number;
  duration: number;
  delay: number;
  /** Vertical anchor within the host section (use one). */
  top?: string;
  bottom?: string;
  /** Horizontal: offset of the cube's centre from the page centre, in px... */
  x?: number;
  /** ...or pinned to a section edge. */
  left?: string;
  right?: string;
  /** Which viewports the cube appears on. */
  show: "lg-up" | "xl-up" | "below-lg" | "below-xl";
};

const SHOW = {
  "lg-up": "hidden lg:block",
  "xl-up": "hidden xl:block",
  "below-lg": "lg:hidden",
  "below-xl": "xl:hidden",
} as const;

/**
 * Decorative floating cubes for one landing-page section. The host section
 * must be `relative` (without a z-index) inside the page's
 * `relative isolate overflow-hidden` wrapper: the cubes then paint at -z-10
 * behind every section, card and line of text on the page, and the wrapper
 * clips them at the page edges.
 *
 * Two placements keep them in genuine whitespace at every width:
 * - wide screens: `x` offsets put them in the side gutters outside the
 *   section's content column (`lg-up` / `xl-up`);
 * - narrower screens, where content runs edge to edge: they sit in the
 *   section's top/bottom padding bands (`below-lg` / `below-xl`).
 */
export function FloatingCubes({ cubes }: { cubes: Cube[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {cubes.map((cube) => (
        <div
          key={cube.photo}
          className={cn("absolute", cube.x !== undefined && "-translate-x-1/2", SHOW[cube.show])}
          style={
            {
              top: cube.top,
              bottom: cube.bottom,
              left: cube.x !== undefined ? `calc(50% + ${cube.x}px)` : cube.left,
              right: cube.right,
            } as CSSProperties
          }
        >
          <div
            className="animate-float flex items-center justify-center rounded-[12px] border border-border bg-card shadow-sm"
            style={{
              width: cube.size,
              height: cube.size,
              animationDuration: `${cube.duration}s`,
              animationDelay: `${cube.delay}s`,
            }}
          >
            {/* Decorative placeholder face from pravatar.cc - a plain <img> keeps
                a remote, throwaway asset out of the Next image optimiser. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.pravatar.cc/96?img=${cube.photo}`}
              alt=""
              loading="lazy"
              decoding="async"
              className="rounded-full object-cover"
              style={{ width: Math.round(cube.size * 0.62), height: Math.round(cube.size * 0.62) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
