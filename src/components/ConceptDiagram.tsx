import type { ConceptDiagram } from "@/content/types";

/**
 * A deliberately plain, explicitly-labelled illustration. It is captioned as
 * conceptual so it is never mistaken for a real system diagram or screenshot.
 */
export function ConceptDiagramView({ diagram }: { diagram: ConceptDiagram }) {
  return (
    <figure className="mt-6">
      <div className="rounded border border-line bg-panel-2 px-3 py-4 sm:px-4">
        {/* Wraps rather than scrolls, so every step stays visible in a narrow
            panel without the reader having to discover a scrollbar. */}
        <ol className="flex flex-wrap items-stretch gap-x-2 gap-y-3">
          {diagram.steps.map((step, i) => (
            <li key={step.label} className="flex items-center gap-2">
              <div className="rounded border border-line-strong px-3 py-2 text-center">
                <span className="block text-xs text-fg">{step.label}</span>
                <span className="block text-[0.7rem] text-dim">{step.detail}</span>
              </div>
              {i < diagram.steps.length - 1 ? (
                <span aria-hidden="true" className="text-dim">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-2 text-xs text-dim">{diagram.caption}</figcaption>
    </figure>
  );
}
