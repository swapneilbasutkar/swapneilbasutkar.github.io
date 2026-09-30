import { Fragment } from "react";
import { portfolio } from "@/content/portfolio";
import { Panel } from "./Panel";
import { Section } from "./Section";

/**
 * Skills as a syntax-coloured JSON object. No proficiency bars or percentages.
 *
 * The rendered JSON is decorative punctuation for a screen reader, so it is
 * `aria-hidden` and paired with an equivalent visually-hidden definition list.
 */
export function StackJson() {
  const { skills, education, certifications } = portfolio;

  return (
    <Section
      id="stack"
      label="stack.json"
      command="cat stack.json"
      description="What I reach for, grouped by what it is for."
    >
      {/* The JSON panel and the credentials sit side by side on wide screens
          rather than stacking, which leaves the section far less empty. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start xl:gap-12">
      <Panel title="stack.json">
        <div className="thin-scroll overflow-x-auto px-3 py-4 sm:px-5">
          {/* Values wrap onto as many lines as they need, with a hanging
              indent, so the object stays compact instead of running to one
              item per line. */}
          <pre aria-hidden="true" className="text-[0.85rem] leading-[1.8]">
            <code>
              <span className="text-[var(--syn-punct)]">{"{"}</span>
              {skills.map((group, gi) => (
                <Fragment key={group.key}>
                  {"\n  "}
                  <span className="text-[var(--syn-key)]">&quot;{group.key}&quot;</span>
                  <span className="text-[var(--syn-punct)]">: [</span>
                  <span className="block pl-[4ch] whitespace-pre-wrap">
                    {group.items.map((item, ii) => (
                      <Fragment key={item}>
                        <span className="text-[var(--syn-string)]">&quot;{item}&quot;</span>
                        {ii < group.items.length - 1 ? (
                          <span className="text-[var(--syn-punct)]">, </span>
                        ) : null}
                      </Fragment>
                    ))}
                  </span>
                  {"  "}
                  <span className="text-[var(--syn-punct)]">
                    ]{gi < skills.length - 1 ? "," : ""}
                  </span>
                </Fragment>
              ))}
              {"\n"}
              <span className="text-[var(--syn-punct)]">{"}"}</span>
            </code>
          </pre>

          <dl className="sr-only">
            {skills.map((group) => (
              <Fragment key={group.key}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(", ")}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </Panel>

      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1">
        <div>
          <h3 className="mb-3 text-sm text-amber">Education</h3>
          <ul className="space-y-3">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="text-[0.95rem] text-fg">{item.degree}</p>
                <p className="text-sm text-muted">
                  {item.institution}
                  {item.detail ? (
                    <>
                      <span aria-hidden="true" className="mx-2 text-dim">
                        ·
                      </span>
                      {item.detail}
                    </>
                  ) : null}
                </p>
                <p className="text-sm text-dim">{item.date}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm text-amber">Certification</h3>
          <ul className="space-y-3">
            {certifications.map((item) => (
              <li key={item.name}>
                <p className="text-[0.95rem] text-fg">{item.name}</p>
                <p className="text-sm text-muted">{item.issuer}</p>
                <p className="text-sm text-dim">{item.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>
    </Section>
  );
}
