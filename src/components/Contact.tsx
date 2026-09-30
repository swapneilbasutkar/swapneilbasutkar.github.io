import { portfolio } from "@/content/portfolio";
import { withBasePath } from "@/lib/basePath";
import { Panel } from "./Panel";
import { Section } from "./Section";
import { CopyButton } from "./CopyButton";

const rowLabel = "text-sm text-[var(--syn-key)] sm:w-24 sm:shrink-0";
const linkClass =
  "text-[var(--syn-string)] underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-amber";

/**
 * Email, GitHub and the resume downloads. Only links that were verified are
 * shown — there is no invented profile here and no availability claim.
 */
export function Contact() {
  const { links, resume } = portfolio;
  const resumeAssets = [resume.pdf, resume.docx].filter((asset) => asset.href !== null);

  return (
    <Section
      id="contact"
      label="contact"
      command="cat contact.sh"
      description="The fastest way to reach me is email."
    >
      <Panel title="contact.sh">
        <div className="space-y-5 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span className={rowLabel}>email</span>
            <span className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${links.email}`} className={linkClass}>
                {links.email}
              </a>
              <CopyButton value={links.email} label="Copy email address" />
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span className={rowLabel}>github</span>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {links.githubLabel}
              <span aria-hidden="true" className="ml-1 text-dim">
                ↗
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          {resumeAssets.length > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className={rowLabel}>resume</span>
              <span className="flex flex-wrap gap-2">
                {resumeAssets.map((asset) => (
                  <a
                    key={asset.href}
                    href={withBasePath(asset.href as string)}
                    download
                    className="inline-flex items-center gap-2 rounded border border-line-strong px-3 py-1.5 text-sm text-fg transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    {asset.label}
                    <span aria-hidden="true" className="text-dim">
                      ↓
                    </span>
                  </a>
                ))}
              </span>
            </div>
          ) : null}
        </div>
      </Panel>
    </Section>
  );
}
