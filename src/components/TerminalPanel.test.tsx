import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalPanel } from "./TerminalPanel";
import { portfolio } from "@/content/portfolio";
import { projectAnchorId } from "@/lib/terminal";

afterEach(cleanup);

function setup() {
  const user = userEvent.setup();
  render(<TerminalPanel />);
  const input = screen.getByLabelText(/command input/i);
  const transcript = screen.getByLabelText("Terminal output");
  return { user, input, transcript };
}

describe("TerminalPanel", () => {
  it("shows the command list before anything is typed", () => {
    const { transcript } = setup();
    expect(within(transcript).getByText(/Available commands:/)).toBeInTheDocument();
  });

  it("labels the input so it is usable by keyboard and on mobile", () => {
    const { input } = setup();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAccessibleName();
  });

  it("does not steal focus on mount", () => {
    const { input } = setup();
    expect(input).not.toHaveFocus();
  });

  it("echoes the command and prints its output on Enter", async () => {
    const { user, input, transcript } = setup();

    await user.type(input, "whoami{Enter}");

    // The echoed line carries the full prompt, which `help` output does not.
    // The prompt is split across several spans, so match on textContent.
    expect(
      within(transcript).getByText(
        (_content, element) =>
          element?.tagName === "P" &&
          element.textContent === `${portfolio.profile.handle}:~$ whoami`,
      ),
    ).toBeInTheDocument();
    expect(within(transcript).getByText(portfolio.profile.name)).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("reports unknown commands with a suggestion", async () => {
    const { user, input, transcript } = setup();

    await user.type(input, "hlep{Enter}");

    expect(within(transcript).getByText(/command not found: hlep/)).toBeInTheDocument();
    expect(within(transcript).getByRole("button", { name: "help" })).toBeInTheDocument();
  });

  it("recalls previous commands with ArrowUp and clears with ArrowDown", async () => {
    const { user, input } = setup();

    await user.type(input, "whoami{Enter}");
    await user.type(input, "skills{Enter}");

    await user.type(input, "{ArrowUp}");
    expect(input).toHaveValue("skills");

    await user.type(input, "{ArrowUp}");
    expect(input).toHaveValue("whoami");

    await user.type(input, "{ArrowDown}");
    expect(input).toHaveValue("skills");

    await user.type(input, "{ArrowDown}");
    expect(input).toHaveValue("");
  });

  it("completes a command with Tab", async () => {
    const { user, input } = setup();

    await user.type(input, "who");
    await user.keyboard("{Tab}");

    expect(input).toHaveValue("whoami");
  });

  it("completes a project slug with Tab", async () => {
    const { user, input } = setup();

    await user.type(input, "open ll");
    await user.keyboard("{Tab}");

    expect(input).toHaveValue("open llm-assert");
  });

  it("lets Tab move focus when there is nothing to complete", async () => {
    const { user, input } = setup();

    await user.type(input, "zzz");
    await user.keyboard("{Tab}");

    expect(input).toHaveValue("zzz");
    expect(input).not.toHaveFocus();
  });

  it("clears the transcript without removing the page content", async () => {
    const { user, input, transcript } = setup();

    await user.type(input, "whoami{Enter}");
    expect(within(transcript).getByText(portfolio.profile.name)).toBeInTheDocument();

    await user.type(input, "clear{Enter}");

    expect(within(transcript).queryByText(portfolio.profile.name)).not.toBeInTheDocument();
    expect(within(transcript).getByText(/Cleared\./)).toBeInTheDocument();
    // The surrounding section, and therefore the rest of the page, survives.
    expect(screen.getByRole("heading", { name: "terminal" })).toBeInTheDocument();
  });

  it("scrolls to a project and focuses its heading via `open`", async () => {
    const slug = "llm-assert";
    const anchor = projectAnchorId(slug);

    // Stand-in for the real project panel rendered elsewhere on the page.
    const target = document.createElement("article");
    target.id = anchor;
    const heading = document.createElement("h3");
    heading.id = `${anchor}-heading`;
    heading.tabIndex = -1;
    heading.textContent = "llm-assert";
    target.appendChild(heading);
    document.body.appendChild(target);

    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

    try {
      const { user, input, transcript } = setup();
      await user.type(input, `open ${slug}{Enter}`);

      expect(within(transcript).getByText(/Opening llm-assert/)).toBeInTheDocument();
      expect(scrollIntoView).toHaveBeenCalled();
      expect(heading).toHaveFocus();
    } finally {
      raf.mockRestore();
      target.remove();
    }
  });

  it("runs a clickable suggestion chip", async () => {
    const { user, transcript } = setup();

    await user.click(screen.getByRole("button", { name: "projects" }));

    expect(within(transcript).getByText(/Select one to jump to it/)).toBeInTheDocument();
    for (const project of portfolio.projects) {
      expect(
        within(transcript).getByRole("button", { name: `open ${project.slug}` }),
      ).toBeInTheDocument();
    }
  });
});
