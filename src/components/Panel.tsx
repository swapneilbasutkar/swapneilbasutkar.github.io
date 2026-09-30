import type { ReactNode } from "react";

/** Decorative macOS-style window controls. Purely visual, hidden from AT. */
export function WindowControls() {
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
      <span className="block h-2.5 w-2.5 rounded-full bg-[#3e4446]" />
      <span className="block h-2.5 w-2.5 rounded-full bg-[#3e4446]" />
      <span className="block h-2.5 w-2.5 rounded-full bg-[#3e4446]" />
    </span>
  );
}

interface PanelProps {
  /** Filename-style label shown in the title bar. */
  title: string;
  /** Optional right-aligned slot, e.g. a category badge. */
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Renders the decorative window controls. */
  controls?: boolean;
}

/**
 * The repeated chrome of this site: a bordered panel with a terminal-style
 * title bar. Used for project files, the skills JSON and the terminal itself.
 */
export function Panel({ title, meta, children, className = "", controls = true }: PanelProps) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-line bg-panel ${className}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-line bg-panel-2 px-3 py-2.5 sm:px-4">
        {controls ? <WindowControls /> : null}
        <span className="min-w-0 text-sm text-muted">{title}</span>
        {meta ? <span className="ml-auto">{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}

/** Small outlined label used for project categories. */
export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "amber" | "green";
}) {
  const tones = {
    muted: "border-line-strong text-muted",
    amber: "border-amber/40 text-amber",
    green: "border-green/40 text-green",
  } as const;

  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs leading-5 whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
