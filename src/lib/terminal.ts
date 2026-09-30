import { portfolio } from "@/content/portfolio";
import { withBasePath } from "@/lib/basePath";

/**
 * A deterministic, client-side command interface.
 *
 * Every command maps to a hard-coded branch below. Nothing here executes shell
 * commands, calls `eval`, or sends input anywhere. The only side effects it can
 * request are "scroll to a section of this page" and "clear the transcript",
 * both expressed as data (`TerminalEffect`) for the component to carry out.
 */

export type OutputTone = "default" | "muted" | "green" | "amber" | "error";

export type OutputLine =
  /** Plain text, optionally tinted. */
  | { type: "text"; text: string; tone?: OutputTone }
  /** An anchor. `external` links get target=_blank + rel. */
  | { type: "link"; label: string; href: string; external?: boolean; prefix?: string }
  /** A button that runs `command` when activated. */
  | { type: "command"; command: string; description?: string }
  /**
   * A two-part row. Aligned into columns on wide screens and allowed to flow
   * on narrow ones — space-padded columns would wrap badly on a phone.
   */
  | { type: "row"; left: string; right: string }
  /** Blank spacer line. */
  | { type: "blank" };

export type TerminalEffect =
  | { kind: "navigate"; target: string }
  | { kind: "clear" };

export interface CommandResult {
  lines: OutputLine[];
  effect?: TerminalEffect;
}

export interface ParsedCommand {
  name: string;
  args: string[];
}

/** Commands that take an argument, so completion adds a trailing space. */
const COMMANDS_WITH_ARGS = ["open"] as const;

export const COMMANDS = [
  "help",
  "whoami",
  "projects",
  "open",
  "experience",
  "skills",
  "resume",
  "contact",
  "clear",
] as const;

export type CommandName = (typeof COMMANDS)[number];

export const PROJECT_SLUGS: string[] = portfolio.projects.map((p) => p.slug);

/** DOM id prefix for a project panel. Kept in one place so nav can't drift. */
export const projectAnchorId = (slug: string) => `project-${slug}`;

/**
 * Split raw input into a command name and arguments.
 * Extra whitespace is collapsed and the command name is lower-cased.
 */
export function parseCommand(input: string): ParsedCommand {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const [name = "", ...args] = tokens;
  return { name: name.toLowerCase(), args };
}

/** Levenshtein distance, used only to suggest a near-miss command. */
function distance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  let prev = Array.from({ length: cols }, (_, i) => i);

  for (let i = 1; i < rows; i++) {
    const curr = [i, ...new Array<number>(cols - 1).fill(0)];
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[cols - 1];
}

/**
 * Nearest known command to an unrecognised one, or null when nothing is close.
 * The threshold scales a little with length so "experiance" still matches.
 */
export function nearestCommand(name: string): string | null {
  if (!name) return null;
  let best: string | null = null;
  let bestDistance = Infinity;

  for (const candidate of COMMANDS) {
    const d = distance(name, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }

  const threshold = name.length <= 4 ? 2 : 3;
  return bestDistance <= threshold ? best : null;
}

/** Same idea, for `open <slug>`. */
export function nearestSlug(slug: string): string | null {
  if (!slug) return null;
  let best: string | null = null;
  let bestDistance = Infinity;

  for (const candidate of PROJECT_SLUGS) {
    const d = distance(slug, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }
  return bestDistance <= 4 ? best : null;
}

function longestCommonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

export interface Completion {
  /** What the input should become. Unchanged when there is nothing to complete. */
  value: string;
  /** All matches, so the component can list ambiguous options. */
  candidates: string[];
}

/**
 * Tab completion for command names and, after `open `, project slugs.
 * A unique match completes fully; several matches extend to their common prefix.
 */
export function completeInput(input: string): Completion {
  // Still typing the command itself (no space committed yet).
  if (!/\s/.test(input)) {
    const token = input.toLowerCase();
    const candidates = COMMANDS.filter((c) => c.startsWith(token));

    if (candidates.length === 0) return { value: input, candidates: [] };
    if (candidates.length === 1) {
      const only = candidates[0];
      const needsArg = (COMMANDS_WITH_ARGS as readonly string[]).includes(only);
      return { value: needsArg ? `${only} ` : only, candidates: [only] };
    }
    return { value: longestCommonPrefix([...candidates]), candidates: [...candidates] };
  }

  const { name, args } = parseCommand(input);

  if (name === "open") {
    const partial = (args[0] ?? "").toLowerCase();
    const candidates = PROJECT_SLUGS.filter((slug) => slug.startsWith(partial));

    if (candidates.length === 0) return { value: input, candidates: [] };
    if (candidates.length === 1) return { value: `open ${candidates[0]}`, candidates };
    return { value: `open ${longestCommonPrefix(candidates)}`, candidates };
  }

  return { value: input, candidates: [] };
}

/**
 * Move through command history.
 *
 * `history` is oldest-first. `index` is the entry currently shown, or null when
 * the user is composing a fresh line. Going down past the newest entry returns
 * to that fresh, empty line.
 */
export function stepHistory(
  history: string[],
  index: number | null,
  direction: "up" | "down",
): { index: number | null; value: string } {
  if (history.length === 0) return { index: null, value: "" };

  if (direction === "up") {
    const next = index === null ? history.length - 1 : Math.max(0, index - 1);
    return { index: next, value: history[next] };
  }

  if (index === null) return { index: null, value: "" };

  const next = index + 1;
  if (next >= history.length) return { index: null, value: "" };
  return { index: next, value: history[next] };
}

// --- Command output builders ------------------------------------------------

function helpLines(): OutputLine[] {
  return [
    { type: "text", text: "Available commands:", tone: "muted" },
    ...portfolio.terminal.help.map<OutputLine>((h) => ({
      type: "row",
      left: h.command,
      right: h.description,
    })),
    { type: "blank" },
    {
      type: "text",
      text: "Tab completes commands and project slugs. ↑/↓ walks history.",
      tone: "muted",
    },
  ];
}

function projectLines(): OutputLine[] {
  return [
    { type: "text", text: `${portfolio.projects.length} projects. Select one to jump to it:`, tone: "muted" },
    ...portfolio.projects.map<OutputLine>((p) => ({
      type: "command",
      command: `open ${p.slug}`,
      description: `${p.title} — ${p.category}`,
    })),
  ];
}

function skillLines(): OutputLine[] {
  const lines: OutputLine[] = [];
  portfolio.skills.forEach((group, i) => {
    if (i > 0) lines.push({ type: "blank" });
    lines.push({ type: "text", text: `${group.label}:`, tone: "amber" });
    lines.push({ type: "text", text: `  ${group.items.join(", ")}` });
  });
  return lines;
}

function resumeLines(): OutputLine[] {
  const available = [portfolio.resume.pdf, portfolio.resume.docx].filter(
    (asset) => asset.href !== null,
  );

  if (available.length === 0) {
    return [
      {
        type: "text",
        text: "No resume file is currently published with this site.",
        tone: "muted",
      },
    ];
  }

  return [
    { type: "text", text: "Resume downloads:", tone: "muted" },
    ...available.map<OutputLine>((asset) => ({
      type: "link",
      label: `${asset.label}`,
      href: withBasePath(asset.href as string),
      prefix: "  ",
    })),
  ];
}

function contactLines(): OutputLine[] {
  return [
    { type: "text", text: "Email and links:", tone: "muted" },
    {
      type: "link",
      label: portfolio.links.email,
      href: `mailto:${portfolio.links.email}`,
      prefix: "  email   ",
    },
    {
      type: "link",
      label: portfolio.links.githubLabel,
      href: portfolio.links.github,
      external: true,
      prefix: "  github  ",
    },
  ];
}

function openLines(rawSlug: string | undefined): CommandResult {
  if (!rawSlug) {
    return {
      lines: [
        { type: "text", text: "open: missing project slug.", tone: "error" },
        { type: "text", text: "Pick one:", tone: "muted" },
        ...portfolio.projects.map<OutputLine>((p) => ({
          type: "command",
          command: `open ${p.slug}`,
          description: p.title,
        })),
      ],
    };
  }

  const slug = rawSlug.toLowerCase();
  const project = portfolio.projects.find((p) => p.slug === slug);

  if (!project) {
    const suggestion = nearestSlug(slug);
    const lines: OutputLine[] = [
      { type: "text", text: `open: no project named "${rawSlug}".`, tone: "error" },
    ];
    if (suggestion) {
      lines.push({ type: "command", command: `open ${suggestion}`, description: "Did you mean this?" });
    }
    lines.push({ type: "text", text: "All projects:", tone: "muted" });
    lines.push(
      ...portfolio.projects.map<OutputLine>((p) => ({
        type: "command",
        command: `open ${p.slug}`,
        description: p.title,
      })),
    );
    return { lines };
  }

  return {
    lines: [
      { type: "text", text: `Opening ${project.title}…`, tone: "green" },
      { type: "text", text: project.tagline, tone: "muted" },
    ],
    effect: { kind: "navigate", target: projectAnchorId(project.slug) },
  };
}

/**
 * Run one line of input. Pure: the same input always produces the same result.
 */
export function runCommand(input: string): CommandResult {
  const { name, args } = parseCommand(input);

  if (!name) return { lines: [] };

  switch (name) {
    case "help":
      return { lines: helpLines() };

    case "whoami":
      return {
        lines: [
          { type: "text", text: portfolio.profile.name, tone: "green" },
          { type: "text", text: `${portfolio.profile.descriptor} · ${portfolio.profile.location}` },
          { type: "blank" },
          ...portfolio.profile.whoami.map<OutputLine>((text) => ({ type: "text", text })),
        ],
        effect: { kind: "navigate", target: "whoami" },
      };

    case "projects":
      return { lines: projectLines(), effect: { kind: "navigate", target: "projects" } };

    case "open":
      return openLines(args[0]);

    case "experience":
      return {
        lines: [
          { type: "text", text: "Jumping to experience.log…", tone: "green" },
          ...portfolio.experience.map<OutputLine>((role) => ({
            type: "row",
            left: role.period,
            right: `${role.title} — ${role.company}`,
          })),
        ],
        effect: { kind: "navigate", target: "experience" },
      };

    case "skills":
      return { lines: skillLines(), effect: { kind: "navigate", target: "stack" } };

    case "resume":
      return { lines: resumeLines() };

    case "contact":
      return { lines: contactLines(), effect: { kind: "navigate", target: "contact" } };

    case "clear":
      return { lines: [], effect: { kind: "clear" } };

    default: {
      const suggestion = nearestCommand(name);
      const lines: OutputLine[] = [
        { type: "text", text: `command not found: ${name}`, tone: "error" },
      ];
      if (suggestion) {
        lines.push({ type: "command", command: suggestion, description: "Did you mean this?" });
      }
      // Always leave a way out, without offering `help` twice.
      if (suggestion !== "help") {
        lines.push({ type: "command", command: "help", description: "List every command" });
      }
      return { lines };
    }
  }
}
