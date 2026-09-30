import type { Project } from "@/content/types";
import { projectAnchorId } from "@/lib/terminal";
import { Badge, Panel } from "./Panel";
import { Code } from "./Code";
import { CopyButton } from "./CopyButton";
import { ConceptDiagramView } from "./ConceptDiagram";

const linkClass =
  "inline-flex items-center gap-1.5 rounded border border-line-strong px-3 py-1.5 text-sm text-fg transition-colors hover:border-amber/60 hover:text-amber";

/**
 * One project, rendered as a source file. Everything is visible on load —
 * nothing is hidden behind a toggle.
 */
export function ProjectPanel({ project }: { project: Project }) {
  const anchor = projectAnchorId(project.slug);
  const featured = project.featured;

  return (
    // min-w-0 stops a wide child (a code block, a diagram) from setting this
    // grid item's minimum size and widening the whole page.
    <article id={anchor} className="min-w-0">
      <Panel
        title={project.file}
        meta={
          <Badge tone={project.kind === "published-library" ? "green" : "muted"}>
            {project.category}
          </Badge>
        }
      >
        {/* A container query, not a viewport one: the case-study columns must
            react to how wide THIS panel is, since compact projects sit two to
            a row on large screens. */}
        <div className="@container px-4 py-4 sm:px-6 sm:py-5">
          <h3
            id={`${anchor}-heading`}
            tabIndex={-1}
            className={`font-semibold tracking-tight text-fg ${featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}
          >
            {project.title}
          </h3>
          <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            {project.tagline}
          </p>

          <dl className="mt-4 space-y-3 border-t border-line pt-4">
            {project.caseStudy.map((block) => (
              <div
                key={block.label}
                className="@2xl:grid @2xl:grid-cols-[11rem_1fr] @2xl:gap-5"
              >
                <dt className="text-sm text-amber @2xl:pt-0.5">{block.label}</dt>
                <dd className="mt-1 max-w-2xl text-[0.95rem] leading-relaxed text-muted @2xl:mt-0">
                  {block.body}
                </dd>
              </div>
            ))}
          </dl>

          {project.diagram ? <ConceptDiagramView diagram={project.diagram} /> : null}

          {project.install ? (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="thin-scroll min-w-0 flex-1 overflow-x-auto rounded border border-line bg-panel-2 px-3 py-2">
                  <code className="text-sm whitespace-pre">
                    <span className="text-dim">$ </span>
                    <span className="text-[var(--syn-key)]">npm</span>
                    <span className="text-fg">{project.install.replace(/^npm/, "")}</span>
                  </code>
                </div>
                <CopyButton
                  value={project.install}
                  label={`Copy install command for ${project.title}`}
                />
              </div>
            </div>
          ) : null}

          {project.code ? (
            <div className="mt-4 overflow-hidden rounded border border-line bg-panel-2">
              <p className="border-b border-line px-3 py-1.5 text-xs text-dim sm:px-4">
                {project.code.filename}
              </p>
              <Code code={project.code.code} language={project.code.language} />
            </div>
          ) : null}

          {/* Links and tech share one row and only wrap when they have to,
              which saves a whole row of height on most panels. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.label}
                <span aria-hidden="true" className="text-dim">
                  ↗
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}

            <ul
              className="flex flex-wrap gap-2"
              aria-label={`Technologies used in ${project.title}`}
            >
              {project.tech.map((item) => (
                <li
                  key={item}
                  className="rounded border border-line bg-panel-2 px-2 py-0.5 text-xs text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {project.note ? (
            <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-dim">
              <span aria-hidden="true" className="mr-1.5">
                {"//"}
              </span>
              {project.note}
            </p>
          ) : null}
        </div>
      </Panel>
    </article>
  );
}
