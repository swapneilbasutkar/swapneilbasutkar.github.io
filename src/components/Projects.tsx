import { portfolio } from "@/content/portfolio";
import { Section } from "./Section";
import { ProjectPanel } from "./ProjectPanel";

export function Projects() {
  const featured = portfolio.projects.filter((p) => p.featured);
  const rest = portfolio.projects.filter((p) => !p.featured);

  return (
    <Section
      id="projects"
      label="projects/"
      command="ls projects/"
      description="Two published npm libraries and enterprise work I owned end to end. Internal work is summarised without client detail."
    >
      <div className="space-y-6">
        {featured.map((project) => (
          <ProjectPanel key={project.slug} project={project} />
        ))}
      </div>

      {rest.length > 0 ? (
        <>
          <h3 className="mt-12 mb-5 text-sm text-dim">
            <span aria-hidden="true" className="mr-1.5">
              {"//"}
            </span>
            Also shipped
          </h3>
          <div className="grid gap-6 xl:grid-cols-2">
            {rest.map((project) => (
              <ProjectPanel key={project.slug} project={project} />
            ))}
          </div>
        </>
      ) : null}
    </Section>
  );
}
