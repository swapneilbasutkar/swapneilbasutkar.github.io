"use client";

import { useEffect, useState } from "react";
import { portfolio } from "@/content/portfolio";

/**
 * Desktop navigation, styled as a project file tree.
 *
 * These are real anchors, so the nav works with JavaScript disabled; the
 * IntersectionObserver only adds the "you are here" highlight on top.
 */
export function FileTree() {
  const [active, setActive] = useState<string>(portfolio.nav[0]?.id ?? "");

  useEffect(() => {
    const sections = portfolio.nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the entry nearest the top of the viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="text-sm">
      <p className="mb-3 flex items-center gap-2 text-dim">
        <span aria-hidden="true">▾</span>
        <span>~/portfolio</span>
      </p>
      <ul className="ml-2 border-l border-line">
        {portfolio.nav.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-4 transition-colors ${
                  isActive
                    ? "border-amber text-amber"
                    : "border-transparent text-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                <span aria-hidden="true" className="text-dim">
                  {item.kind === "dir" ? "▸" : "·"}
                </span>
                <span>{item.file}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 ml-2 border-l border-line pl-4 text-xs leading-relaxed text-dim">
        {portfolio.projects.length} projects · {portfolio.experience.length} roles
      </p>
    </nav>
  );
}
