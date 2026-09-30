import { portfolio } from "@/content/portfolio";
import { withBasePath } from "@/lib/basePath";
import { Panel } from "./Panel";
import { Prompt } from "./Prompt";

const primary =
  "inline-flex items-center justify-center gap-2 rounded border border-green/50 bg-green/10 px-4 py-2.5 text-sm text-green transition-colors hover:border-green hover:bg-green/15";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded border border-line-strong px-4 py-2.5 text-sm text-fg transition-colors hover:border-amber/60 hover:text-amber";

/**
 * The first viewport: who, what, where, and the three things a recruiter is
 * most likely to want next. Everything here is static markup — no animation
 * stands between the visitor and the content.
 */
export function Hero() {
  const { profile, resume } = portfolio;

  return (
    // Two columns from lg up: the pitch on the left, a compact profile panel on
    // the right, so the first viewport uses the full width instead of trailing
    // off into empty space. Stacks below lg.
    <div className="py-12 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-14">
      <div>
        <p aria-hidden="true" className="mb-5 text-sm">
          <Prompt command="whoami" cursor />
        </p>

        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-fg sm:text-5xl">
          {profile.name}
        </h1>

        <p className="mt-3 text-base text-amber sm:text-lg">{profile.descriptor}</p>

        <p className="mt-7 max-w-3xl text-xl leading-snug font-medium text-fg sm:text-[1.75rem]">
          {profile.headline}
        </p>

        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">
          {profile.supporting}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className={primary}>
            View Projects
          </a>
          {/* The label is one flex item, so the accessible name keeps its space:
              "Resume (PDF)", not "Resume(PDF)". */}
          {resume.pdf.href ? (
            <a href={withBasePath(resume.pdf.href)} download className={secondary}>
              <span>
                Resume <span className="text-dim">({resume.pdf.format})</span>
              </span>
            </a>
          ) : null}
          <a href="#contact" className={secondary}>
            Contact
          </a>
        </div>

        <p className="mt-10 max-w-2xl border-l-2 border-green/50 bg-panel/60 py-3 pr-4 pl-4 text-[0.95rem] leading-relaxed text-muted">
          <span aria-hidden="true" className="mr-2 text-green">
            ›
          </span>
          {profile.impact}
        </p>
      </div>

      {/* Summary of facts stated elsewhere on the page, not new claims. */}
      <div className="mt-12 lg:mt-14">
        <Panel title="profile">
          <dl className="divide-y divide-line">
            {profile.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-wrap items-baseline gap-x-3 px-4 py-2.5"
              >
                <dt className="w-20 shrink-0 text-xs text-[var(--syn-key)]">
                  {fact.label}
                </dt>
                <dd className="min-w-0 flex-1 text-sm text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
