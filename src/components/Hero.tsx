import { portfolio } from "@/content/portfolio";
import { withBasePath } from "@/lib/basePath";
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
    <div className="py-12 sm:py-16">
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

      {/* A small syntax-coloured detail rather than an icon. */}
      <p className="mt-5 text-sm">
        <span className="text-[var(--syn-key)]">location</span>
        <span className="text-[var(--syn-punct)]"> = </span>
        <span className="text-[var(--syn-string)]">&quot;{profile.location}&quot;</span>
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
  );
}
