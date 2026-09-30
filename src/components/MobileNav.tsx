import { portfolio } from "@/content/portfolio";

/**
 * Small-screen navigation: a plain, scrollable row of anchors. No hamburger,
 * no JavaScript, nothing to open before the links are reachable.
 */
export function MobileNav() {
  return (
    <nav aria-label="Sections" className="lg:hidden">
      <ul className="thin-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {portfolio.nav.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-block rounded border border-line bg-panel px-3 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
