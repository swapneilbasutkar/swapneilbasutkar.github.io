# Swapneil Basutkar — Portfolio

A terminal-inspired personal portfolio built with Next.js, TypeScript and Tailwind CSS.
Everything renders statically: no database, no authentication, no API keys, and no network
requests at runtime.

```
swapneil@portfolio:~$ npm install && npm run dev
```

---

## Requirements

- Node.js 20 or newer (developed on Node 22)
- npm 10 or newer

## Setup and local preview

```bash
npm install
npm run dev        # http://localhost:3000
```

Production preview:

```bash
npm run build
npm run start      # add -- -p 4321 to use a different port
```

## Scripts

| Script              | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                    |
| `npm run build`     | Production build (Node host)                          |
| `npm run build:static` | Static export to `out/` (GitHub Pages, any CDN)    |
| `npm run start`     | Serve the production build                            |
| `npm run typecheck` | `tsc --noEmit`                                        |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript configs)  |
| `npm test`          | Vitest, single run                                    |
| `npm run test:watch`| Vitest in watch mode                                  |

---

## Editing content

**All copy lives in one file: [`src/content/portfolio.ts`](src/content/portfolio.ts).**
No component contains its own text, so you never have to touch JSX to reword the site.
The shapes are defined and documented in [`src/content/types.ts`](src/content/types.ts), so
your editor will tell you if a field is missing or misspelled.

| What you want to change        | Where                                    |
| ------------------------------ | ---------------------------------------- |
| Name, headline, intro, location| `portfolio.profile`                       |
| Email and GitHub               | `portfolio.links`                         |
| Resume download paths          | `portfolio.resume`                        |
| Nav items and section order    | `portfolio.nav` (ids must match sections) |
| Projects and case studies      | `portfolio.projects`                      |
| Experience timeline            | `portfolio.experience`                    |
| Skills groups                  | `portfolio.skills`                        |
| Education and certifications   | `portfolio.education`, `.certifications`  |
| Terminal help text and chips   | `portfolio.terminal`                      |
| Page title, description, keywords | `portfolio.meta`                       |

### Adding a project

Append an object to `portfolio.projects`. The important fields:

- `slug` — lowercase, hyphenated. It becomes the `#project-<slug>` anchor **and** the
  argument to the terminal's `open <slug>` command. A test asserts slugs are unique and
  URL-safe.
- `featured: true` renders it full width in the main list; `false` puts it in the compact
  "Also shipped" grid.
- `kind: "published-library"` gives it a green badge; `kind: "internal"` a neutral one.
- `install` adds a copyable install command. `code` adds a syntax-highlighted preview.
- `links: []` means no link buttons — which is the correct setting for internal work.

Nothing else needs updating: the nav counter, the terminal's `projects` listing, and Tab
completion for `open` all derive from this array.

### Colours and type

Design tokens are CSS custom properties at the top of
[`src/app/globals.css`](src/app/globals.css) and are exposed to Tailwind through
`@theme inline`. Change a token there and it propagates everywhere.

The typeface is JetBrains Mono, self-hosted at build time via `next/font/google` — the
browser never contacts Google Fonts.

---

## Replacing the resume

Both files live in `public/resume/` and are referenced by `portfolio.resume`:

```
public/resume/Swapneil_Basutkar_Resume.pdf
public/resume/Swapneil_Basutkar_Resume.docx
```

To update, replace the DOCX and regenerate the PDF. On Windows, with Word installed:

```powershell
$docx = "$PWD\public\resume\Swapneil_Basutkar_Resume.docx"
$pdf  = "$PWD\public\resume\Swapneil_Basutkar_Resume.pdf"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docx, $false, $true)
$doc.ExportAsFixedFormat($pdf, 17)   # 17 = wdExportFormatPDF
$doc.Close($false); $word.Quit()
```

On macOS or Linux, use LibreOffice:

```bash
soffice --headless --convert-to pdf --outdir public/resume \
  public/resume/Swapneil_Basutkar_Resume.docx
```

**Never rename a `.docx` to `.pdf`.** It produces a file that browsers and ATS parsers
cannot open.

If you drop one of the formats, set its `href` to `null` in `portfolio.resume`. The button
and the terminal's `resume` command both disappear cleanly — they never point at a file
that is not there.

> **Note:** the published resume deliberately lists **email and location only** — the phone
> number was removed, because these files are publicly downloadable from a public repo. If
> you swap in a new DOCX, check the contact line before pushing.

---

## The interactive terminal

The command interface in the `terminal` section is deterministic and entirely local. Input
is matched against a fixed list of commands in [`src/lib/terminal.ts`](src/lib/terminal.ts)
and mapped to pre-written output. **It never calls `eval`, never executes a shell command,
and never sends input to a server.**

Commands: `help`, `whoami`, `projects`, `open <project-slug>`, `experience`, `skills`,
`resume`, `contact`, `clear`. Enter runs, ↑/↓ walks history, Tab completes commands and
project slugs.

It is strictly optional. Every piece of content it surfaces is already rendered on the page
on first paint — you can read the entire portfolio without typing anything, and with
JavaScript disabled.

Adding a command means adding a branch to `runCommand` and an entry to
`portfolio.terminal.help`. A test asserts those two lists stay in sync.

---

## Deployment

No production domain is hard-coded. Two environment variables control it:

| Variable                | Purpose                                                                  |
| ----------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`  | Absolute base for `metadataBase` and the Open Graph image URL             |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served from, e.g. `/portfolio`. Empty for the root   |

See [`.env.example`](.env.example). Both are read at build time.

### GitHub Pages (free)

The site exports to plain static files, so GitHub Pages hosts it at no cost.
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on every
push to `main`, gated on typecheck, lint and tests.

1. Create a repository and push `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push. The workflow publishes the site and prints the URL.

The repository name decides the URL, and the workflow adapts automatically:

| Repository name              | URL                                            | Base path    |
| ---------------------------- | ---------------------------------------------- | ------------ |
| `<username>.github.io`       | `https://<username>.github.io/`                 | none         |
| anything else, e.g. `portfolio` | `https://<username>.github.io/portfolio/`    | `/portfolio` |

A user site gives the cleaner URL. Both are fully supported and both were tested.

**Custom domain.** Add it under Settings → Pages, put the same domain in a `public/CNAME`
file, and clear `NEXT_PUBLIC_BASE_PATH` (a custom domain serves from the root).

### Vercel

Import the repository at [vercel.com/new](https://vercel.com/new); the Next.js preset needs
no changes. Set `NEXT_PUBLIC_SITE_URL` and leave `NEXT_PUBLIC_BASE_PATH` unset.

### Anywhere else

`npm run build` then `npm run start` on any Node host, or `npm run build:static` and serve
the resulting `out/` directory from any static host or CDN.

### Building the static export locally

```bash
npm run build:static          # writes ./out
python -m http.server 4500 --directory out
```

`npm run start` does not work on an exported build — serve `out/` with a static server
instead.

---

## Accessibility and performance notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`, `aside`), one `h1`, and a skip link.
- Real anchors for navigation — the file tree works without JavaScript; the
  IntersectionObserver only adds the active highlight.
- Body text is 16px or larger. All text colours were checked against the panel backgrounds
  and meet WCAG AA for normal text.
- Visible `:focus-visible` outlines in amber on every interactive element.
- `prefers-reduced-motion: reduce` disables the cursor blink, smooth scrolling and
  transitions.
- Tab inside the terminal input only completes when there is something to complete —
  otherwise it moves focus normally, so keyboard users are never trapped.
- Code blocks scroll horizontally on their own; the page itself has no horizontal overflow
  (verified from 320px to 1920px).
- The terminal never autofocuses, and no page-wide keyboard shortcuts are registered.

---

## Content provenance

This section records how the factual claims on the site were sourced, and what was
deliberately left out.

**Resume.** Employment history, dates, titles, metrics, education and the certification come
from the DOCX in `public/resume/`. Nothing was embellished or invented. Metrics stay attached
to the work they came from and are never combined into a headline statistic.

**Internal enterprise work.** The Workday agent, the conversational AI application and the
recoverable-workflow redesign are described in summary only: no client identities, no
proprietary configuration, no source code, no screenshots and no repository links. The
"conceptual overview" beside the workflow project is explicitly captioned as illustrative
and is not a system diagram.

**`llm-assert`.** Capabilities, matcher names, provider support, caching behaviour and the
usage example were taken from the package's own README on the npm registry (v1.0.0).

- The published package **does not declare a `repository` field on npm.** The source link on
  the site points at `github.com/swapneilbasutkar/llm-assert`, verified separately: that
  repository's `package.json` carries the identical name, version `1.0.0` and description as
  the published package.
- The README's badge points at `github.com/llm-assert/llm-assert`. That is a **different,
  unrelated project** ("Playwright assertion matchers for testing LLM outputs") owned by a
  different account. It is deliberately not linked anywhere on this site. There are also
  unrelated Python packages with similar names.

**`brand-category-identifier`.** Description, dependencies, the two classification modes and
the usage example come from the package README and repository (v1.1.2). The repository link
**is** present in npm package metadata.

- The automatic fallback is described because it was confirmed in the implementation
  (`src/ai-classifier.ts`): when the LLM call throws, the classifier returns a result from
  the deterministic classifier, marked `"Low"` confidence with reasoning stating the LLM was
  unavailable. The site states that caveat rather than implying a silent, equivalent result.

**Not claimed anywhere.** Download counts, GitHub stars, adoption numbers, testimonials,
awards, project screenshots, client names, a LinkedIn profile, RAG architecture, evaluation
results, vector databases, caching layers beyond what the packages document, or any
statement about current availability.

**Job titles.** "Forward Deployed Engineer" appears only as a keyword in page metadata. It is
never presented as a current or past job title.

---

## Project structure

```
src/
  app/
    layout.tsx           metadata, fonts, root layout
    page.tsx             the single page, composed of sections
    globals.css          design tokens and base styles
    icon.svg             favicon
    opengraph-image.png  social preview card (see scripts/README.md)
  content/
    portfolio.ts         ← all content lives here
    types.ts             typed shapes for the above
  lib/
    terminal.ts          deterministic command engine
    terminal.test.ts
    basePath.ts          prefixes /public paths when deployed to a sub-path
  components/
    SiteHeader / SiteFooter / Hero / Whoami / Projects / ProjectPanel /
    Experience / StackJson / Contact / TerminalPanel / FileTree / MobileNav /
    Panel / Prompt / Code / CopyButton / ConceptDiagram / Section
public/
  resume/                PDF and DOCX downloads
scripts/
  opengraph-image.tsx    source the social card was rendered from
.github/workflows/
  deploy.yml             build, test and publish to GitHub Pages
```

## Tests

```bash
npm test
```

Covers the parts most likely to break silently: command parsing (arguments, whitespace,
casing), `open <slug>` resolution and its error paths, unknown-command handling and
nearest-match suggestions, Tab completion for both commands and slugs, command-history
traversal including both boundaries, transcript clearing, project navigation (scroll plus
focus move), and a check that the documented command list matches the implemented one.
