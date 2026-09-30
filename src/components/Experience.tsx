import { portfolio } from "@/content/portfolio";
import { Section } from "./Section";

/**
 * A chronological timeline. One continuous rule with a marker per role, rather
 * than a separate card for every position.
 */
export function Experience() {
  return (
    <Section
      id="experience"
      label="experience.log"
      command="tail experience.log"
      description="Most recent first."
    >
      <ol className="relative ml-2 space-y-10 border-l border-line pl-6 sm:pl-8">
        {portfolio.experience.map((role, i) => (
          <li key={`${role.company}-${role.title}`} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-2.5 -left-[1.6rem] h-2 w-2 rounded-full sm:-left-[2.1rem] ${
                i === 0 ? "bg-green" : "bg-line-strong"
              }`}
            />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-fg sm:text-lg">{role.title}</h3>
              <span className="text-sm text-amber">{role.company}</span>
            </div>

            <p className="mt-1 text-sm text-dim">
              {role.period}
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              {role.location}
            </p>

            <ul className="mt-3 max-w-2xl space-y-2.5">
              {role.bullets.map((bullet, j) => (
                <li
                  key={j}
                  className="relative pl-5 text-[0.95rem] leading-relaxed text-muted"
                >
                  <span aria-hidden="true" className="absolute left-0 text-dim">
                    ›
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
