import { portfolio } from "@/content/portfolio";
import { WindowControls } from "./Panel";

/**
 * A thin, sticky title bar that frames the whole page as one terminal window.
 */
export function SiteHeader() {
  const { profile, links } = portfolio;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-panel-2/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-2.5 sm:px-6">
        <WindowControls />
        <p className="min-w-0 truncate text-sm text-muted">
          <span className="text-green">{profile.handle}</span>
          <span className="text-dim">: ~/portfolio</span>
        </p>

        <nav
          aria-label="Quick links"
          className="ml-auto flex shrink-0 items-center gap-4 whitespace-nowrap"
        >
          <a
            href={`mailto:${links.email}`}
            className="hidden text-sm text-muted transition-colors hover:text-amber sm:inline"
          >
            email
          </a>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition-colors hover:text-amber"
          >
            github
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
