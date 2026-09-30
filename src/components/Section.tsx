import type { ReactNode } from "react";
import { Prompt } from "./Prompt";

/**
 * A page section with a terminal-style label.
 *
 * The decorative prompt line repeats the heading, so it is hidden from
 * assistive technology; the `<h2>` carries the real label. The heading is
 * focusable (`tabIndex={-1}`) so terminal navigation can move focus to it
 * rather than only scrolling the page.
 */
export function Section({
  id,
  label,
  command,
  description,
  children,
}: {
  id: string;
  /** Section label, e.g. "whoami" or "stack.json". */
  label: string;
  /** Command shown in the decorative prompt line, e.g. "cat whoami.md". */
  command: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <header className="mb-6">
        <p aria-hidden="true" className="mb-2 text-sm">
          <Prompt command={command} />
        </p>
        <h2
          id={`${id}-heading`}
          tabIndex={-1}
          className="text-xl font-semibold tracking-tight text-fg sm:text-2xl"
        >
          {label}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-[0.95rem] text-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
