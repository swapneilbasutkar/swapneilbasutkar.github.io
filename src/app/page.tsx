import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";
import { FileTree } from "@/components/FileTree";
import { MobileNav } from "@/components/MobileNav";
import { Whoami } from "@/components/Whoami";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { StackJson } from "@/components/StackJson";
import { Contact } from "@/components/Contact";
import { TerminalPanel } from "@/components/TerminalPanel";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:border focus:border-amber focus:bg-panel focus:px-3 focus:py-2 focus:text-sm focus:text-amber"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <Hero />

        <div className="mb-10 lg:hidden">
          <MobileNav />
        </div>

        {/* min-w-0 keeps long code lines from widening the grid. */}
        <div className="grid gap-x-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 pb-10">
              <FileTree />
            </div>
          </aside>

          <div className="min-w-0 space-y-20 pb-10 sm:space-y-24">
            <Whoami />
            <Projects />
            <Experience />
            <StackJson />
            <Contact />
            <TerminalPanel />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
