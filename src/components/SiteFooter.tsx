import { portfolio } from "@/content/portfolio";

export function SiteFooter() {
  const { profile, links } = portfolio;

  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-8 text-sm text-dim sm:px-6">
        <p>
          <span aria-hidden="true" className="mr-1.5">
            {"//"}
          </span>
          {profile.name} · {profile.location}
        </p>
        <p className="ml-auto flex flex-wrap gap-4">
          <a
            href={`mailto:${links.email}`}
            className="transition-colors hover:text-amber"
          >
            {links.email}
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-amber"
          >
            {links.githubLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
