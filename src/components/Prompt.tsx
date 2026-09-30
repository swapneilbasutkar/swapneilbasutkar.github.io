import { portfolio } from "@/content/portfolio";

/**
 * The shell prompt, e.g. `swapneil@portfolio:~$`.
 * `cursor` appends a decorative blinking block (hidden from screen readers and
 * frozen under prefers-reduced-motion — see globals.css).
 */
export function Prompt({
  cursor = false,
  command,
  className = "",
}: {
  cursor?: boolean;
  command?: string;
  className?: string;
}) {
  return (
    // The prompt itself never breaks, but a long command is allowed to wrap —
    // otherwise it would widen the page on a narrow screen.
    <span className={className}>
      <span className="whitespace-nowrap">
        <span className="text-green">{portfolio.profile.handle}</span>
        <span className="text-dim">:</span>
        <span className="text-amber">~</span>
        <span className="text-dim">$</span>
      </span>
      {command ? <span className="text-fg"> {command}</span> : null}
      {cursor ? <span className="cursor ml-1.5 align-text-bottom" aria-hidden="true" /> : null}
    </span>
  );
}
