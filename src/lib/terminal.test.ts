import { describe, expect, it } from "vitest";
import { portfolio } from "@/content/portfolio";
import {
  COMMANDS,
  PROJECT_SLUGS,
  completeInput,
  nearestCommand,
  parseCommand,
  projectAnchorId,
  runCommand,
  stepHistory,
  type OutputLine,
} from "./terminal";

const commandLines = (lines: OutputLine[]) =>
  lines.filter((l): l is Extract<OutputLine, { type: "command" }> => l.type === "command");

const rows = (lines: OutputLine[]) =>
  lines.filter((l): l is Extract<OutputLine, { type: "row" }> => l.type === "row");

/** Everything the transcript would read out, as one string. */
const joined = (lines: OutputLine[]) =>
  lines
    .map((l) =>
      l.type === "text" ? l.text : l.type === "row" ? `${l.left} ${l.right}` : "",
    )
    .join("\n");

describe("parseCommand", () => {
  it("splits a command from its arguments", () => {
    expect(parseCommand("open llm-assert")).toEqual({
      name: "open",
      args: ["llm-assert"],
    });
  });

  it("trims and collapses surrounding whitespace", () => {
    expect(parseCommand("   open    llm-assert   ")).toEqual({
      name: "open",
      args: ["llm-assert"],
    });
  });

  it("lower-cases the command name but preserves argument casing", () => {
    expect(parseCommand("OPEN LLM-Assert")).toEqual({
      name: "open",
      args: ["LLM-Assert"],
    });
  });

  it("returns an empty name for blank input", () => {
    expect(parseCommand("    ")).toEqual({ name: "", args: [] });
  });
});

describe("runCommand — known commands", () => {
  it("does nothing for empty input", () => {
    expect(runCommand("")).toEqual({ lines: [] });
    expect(runCommand("   ")).toEqual({ lines: [] });
  });

  it("help lists every documented command with its description", () => {
    const helpRows = rows(runCommand("help").lines);
    expect(helpRows.map((r) => r.left)).toEqual(
      portfolio.terminal.help.map((h) => h.command),
    );
    expect(helpRows.map((r) => r.right)).toEqual(
      portfolio.terminal.help.map((h) => h.description),
    );
  });

  it("help documents every command the parser accepts", () => {
    const documented = portfolio.terminal.help.map((h) => h.command.split(" ")[0]);
    expect(new Set(documented)).toEqual(new Set(COMMANDS));
  });

  it("whoami shows the introduction and navigates to it", () => {
    const result = runCommand("whoami");
    expect(joined(result.lines)).toContain(portfolio.profile.name);
    expect(result.effect).toEqual({ kind: "navigate", target: "whoami" });
  });

  it("projects lists every project as a clickable open command", () => {
    const result = runCommand("projects");
    const commands = commandLines(result.lines).map((l) => l.command);
    expect(commands).toEqual(PROJECT_SLUGS.map((slug) => `open ${slug}`));
    expect(result.effect).toEqual({ kind: "navigate", target: "projects" });
  });

  it("experience navigates to the timeline and lists every role", () => {
    const result = runCommand("experience");
    expect(result.effect).toEqual({ kind: "navigate", target: "experience" });
    expect(rows(result.lines).map((r) => r.left)).toEqual(
      portfolio.experience.map((role) => role.period),
    );
  });

  it("skills groups every skill under its label", () => {
    const output = joined(runCommand("skills").lines);
    for (const group of portfolio.skills) {
      expect(output).toContain(`${group.label}:`);
      expect(output).toContain(group.items[0]);
    }
    expect(runCommand("skills").effect).toEqual({ kind: "navigate", target: "stack" });
  });

  it("resume exposes the available download links", () => {
    const links = runCommand("resume").lines.filter((l) => l.type === "link");
    const hrefs = links.map((l) => (l.type === "link" ? l.href : ""));
    expect(hrefs).toContain(portfolio.resume.pdf.href);
    expect(hrefs).toContain(portfolio.resume.docx.href);
  });

  it("contact shows a mailto link and the GitHub profile", () => {
    const links = runCommand("contact").lines.filter((l) => l.type === "link");
    const hrefs = links.map((l) => (l.type === "link" ? l.href : ""));
    expect(hrefs).toContain(`mailto:${portfolio.links.email}`);
    expect(hrefs).toContain(portfolio.links.github);
  });

  it("clear requests a transcript clear and emits no output", () => {
    expect(runCommand("clear")).toEqual({ lines: [], effect: { kind: "clear" } });
  });

  it("accepts commands regardless of case or padding", () => {
    expect(runCommand("  HELP  ").lines.length).toBeGreaterThan(0);
    expect(joined(runCommand("  HELP  ").lines)).toContain("whoami");
  });
});

describe("runCommand — open <project-slug>", () => {
  it("navigates to the matching project panel", () => {
    const result = runCommand("open llm-assert");
    expect(result.effect).toEqual({
      kind: "navigate",
      target: projectAnchorId("llm-assert"),
    });
  });

  it("resolves every slug in the content file", () => {
    for (const slug of PROJECT_SLUGS) {
      expect(runCommand(`open ${slug}`).effect).toEqual({
        kind: "navigate",
        target: projectAnchorId(slug),
      });
    }
  });

  it("matches slugs case-insensitively", () => {
    expect(runCommand("open LLM-ASSERT").effect).toEqual({
      kind: "navigate",
      target: projectAnchorId("llm-assert"),
    });
  });

  it("lists the options when the slug is missing", () => {
    const result = runCommand("open");
    expect(result.effect).toBeUndefined();
    expect(joined(result.lines)).toContain("missing project slug");
    expect(commandLines(result.lines).map((l) => l.command)).toEqual(
      PROJECT_SLUGS.map((slug) => `open ${slug}`),
    );
  });

  it("suggests the nearest slug for a near miss", () => {
    const result = runCommand("open llm-asert");
    expect(result.effect).toBeUndefined();
    expect(joined(result.lines)).toContain('no project named "llm-asert"');
    expect(commandLines(result.lines)[0].command).toBe("open llm-assert");
  });
});

describe("runCommand — unknown commands", () => {
  it("reports the command as not found", () => {
    const result = runCommand("sudo rm -rf /");
    expect(joined(result.lines)).toContain("command not found: sudo");
    expect(result.effect).toBeUndefined();
  });

  it("offers the nearest command as a clickable suggestion", () => {
    const commands = commandLines(runCommand("hlep").lines).map((l) => l.command);
    expect(commands).toContain("help");
  });

  it("does not offer the same suggestion twice", () => {
    const commands = commandLines(runCommand("hlep").lines).map((l) => l.command);
    expect(commands).toEqual(["help"]);
  });

  it("offers both the near match and a way to list everything", () => {
    const commands = commandLines(runCommand("skils").lines).map((l) => l.command);
    expect(commands).toEqual(["skills", "help"]);
  });

  it("always offers help, even when nothing is close", () => {
    const commands = commandLines(runCommand("zzzzzzzz").lines).map((l) => l.command);
    expect(commands).toEqual(["help"]);
  });
});

describe("nearestCommand", () => {
  it("matches obvious typos", () => {
    expect(nearestCommand("experiance")).toBe("experience");
    expect(nearestCommand("proects")).toBe("projects");
  });

  it("gives up on input that resembles nothing", () => {
    expect(nearestCommand("qqqqqqqqqqqq")).toBeNull();
    expect(nearestCommand("")).toBeNull();
  });
});

describe("completeInput", () => {
  it("completes a unique command", () => {
    expect(completeInput("hel").value).toBe("help");
  });

  it("adds a trailing space for commands that take an argument", () => {
    expect(completeInput("op").value).toBe("open ");
  });

  it("extends to the common prefix when several commands match", () => {
    const result = completeInput("c");
    expect(result.candidates.sort()).toEqual(["clear", "contact"]);
    expect(result.value).toBe("c");
  });

  it("is case-insensitive", () => {
    expect(completeInput("HEL").value).toBe("help");
  });

  it("completes project slugs after `open `", () => {
    expect(completeInput("open ll").value).toBe("open llm-assert");
    expect(completeInput("open work").value).toBe("open workday-agent");
  });

  it("offers every slug when no partial is typed", () => {
    expect(completeInput("open ").candidates).toEqual(PROJECT_SLUGS);
  });

  it("leaves input untouched when nothing matches", () => {
    expect(completeInput("zzz")).toEqual({ value: "zzz", candidates: [] });
    expect(completeInput("open zzz")).toEqual({ value: "open zzz", candidates: [] });
  });

  it("does not complete arguments for commands that take none", () => {
    expect(completeInput("help me")).toEqual({ value: "help me", candidates: [] });
  });
});

describe("stepHistory", () => {
  const history = ["help", "whoami", "projects"];

  it("returns an empty line when there is no history", () => {
    expect(stepHistory([], null, "up")).toEqual({ index: null, value: "" });
    expect(stepHistory([], null, "down")).toEqual({ index: null, value: "" });
  });

  it("walks backwards from the newest entry", () => {
    const first = stepHistory(history, null, "up");
    expect(first).toEqual({ index: 2, value: "projects" });

    const second = stepHistory(history, first.index, "up");
    expect(second).toEqual({ index: 1, value: "whoami" });

    const third = stepHistory(history, second.index, "up");
    expect(third).toEqual({ index: 0, value: "help" });
  });

  it("stops at the oldest entry", () => {
    expect(stepHistory(history, 0, "up")).toEqual({ index: 0, value: "help" });
  });

  it("walks forwards again", () => {
    expect(stepHistory(history, 0, "down")).toEqual({ index: 1, value: "whoami" });
  });

  it("returns to a blank line past the newest entry", () => {
    expect(stepHistory(history, 2, "down")).toEqual({ index: null, value: "" });
  });

  it("stays blank when already composing a fresh line", () => {
    expect(stepHistory(history, null, "down")).toEqual({ index: null, value: "" });
  });
});

describe("content integrity", () => {
  it("every nav target has a matching section id in the content file", () => {
    expect(portfolio.nav.map((n) => n.id)).toEqual([
      "whoami",
      "projects",
      "experience",
      "stack",
      "contact",
      "terminal",
    ]);
  });

  it("project slugs are unique and url-safe", () => {
    expect(new Set(PROJECT_SLUGS).size).toBe(PROJECT_SLUGS.length);
    for (const slug of PROJECT_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
