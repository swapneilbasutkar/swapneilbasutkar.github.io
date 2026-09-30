import { portfolio } from "@/content/portfolio";
import { Section } from "./Section";

/**
 * A single readable block of prose rather than one card per sentence.
 */
export function Whoami() {
  return (
    <Section id="whoami" label="whoami" command="cat whoami.md">
      <div className="max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-muted">
        {portfolio.profile.whoami.map((paragraph, i) => (
          <p key={i} className={i === 0 ? "text-fg" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
