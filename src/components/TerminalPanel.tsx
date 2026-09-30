"use client";

import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { portfolio } from "@/content/portfolio";
import {
  completeInput,
  runCommand,
  stepHistory,
  type OutputLine,
} from "@/lib/terminal";
import { Panel } from "./Panel";
import { Prompt } from "./Prompt";
import { Section } from "./Section";

interface Entry {
  id: number;
  /** The command the visitor typed. Absent for the seeded intro block. */
  input?: string;
  lines: OutputLine[];
}

const TONE_CLASS = {
  default: "text-fg",
  muted: "text-muted",
  green: "text-green",
  amber: "text-amber",
  error: "text-red",
} as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scroll a section into view and move focus to its heading, so the change of
 * location is announced rather than only visual.
 */
function navigateTo(target: string) {
  const element = document.getElementById(target);
  if (!element) return;

  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  const heading = document.getElementById(`${target}-heading`);
  (heading ?? element).focus({ preventScroll: true });
}

/**
 * An optional command interface over content that is already on the page.
 *
 * It is deterministic and entirely local: input is matched against a fixed list
 * of commands in `src/lib/terminal.ts`. Nothing is evaluated, executed or sent
 * anywhere.
 */
export function TerminalPanel() {
  const inputId = useId();
  const [entries, setEntries] = useState<Entry[]>(() => [
    { id: 0, lines: runCommand("help").lines },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const nextId = useRef(1);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const entryCount = entries.length;

  // Keep the transcript pinned to its newest line without scrolling the page.
  useLayoutEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entryCount]);

  const submit = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const result = runCommand(trimmed);

    setHistory((prev) => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
    setHistoryIndex(null);
    setValue("");

    if (result.effect?.kind === "clear") {
      setEntries([]);
    } else {
      setEntries((prev) => [
        ...prev,
        { id: nextId.current++, input: trimmed, lines: result.lines },
      ]);
    }

    if (result.effect?.kind === "navigate") {
      const { target } = result.effect;
      // Let the new transcript entry paint before moving focus away.
      requestAnimationFrame(() => navigateTo(target));
    }
  }, []);

  /** Suggestion chips run the same engine, then hand focus back on desktop. */
  const runSuggestion = useCallback(
    (command: string) => {
      submit(command);
      if (window.matchMedia("(pointer: fine)").matches) {
        inputRef.current?.focus();
      }
    },
    [submit],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const next = stepHistory(history, historyIndex, "up");
        setHistoryIndex(next.index);
        setValue(next.value);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = stepHistory(history, historyIndex, "down");
        setHistoryIndex(next.index);
        setValue(next.value);
        return;
      }

      if (event.key === "Tab" && !event.shiftKey) {
        const completion = completeInput(value);

        // Only swallow Tab when there is something to complete — otherwise it
        // must keep moving focus, or keyboard users are trapped in the input.
        if (completion.candidates.length === 0) return;
        event.preventDefault();

        setValue(completion.value);
        if (completion.candidates.length > 1) {
          setEntries((prev) => [
            ...prev,
            {
              id: nextId.current++,
              lines: [
                { type: "text", text: completion.candidates.join("   "), tone: "muted" },
              ],
            },
          ]);
        }
      }
    },
    [history, historyIndex, value],
  );

  return (
    <Section
      id="terminal"
      label="terminal"
      command="./terminal"
      description={portfolio.terminal.intro}
    >
      <Panel title={`${portfolio.profile.handle}: ~`}>
        <div
          ref={transcriptRef}
          className="thin-scroll max-h-[22rem] overflow-y-auto overscroll-contain px-3 py-4 text-[0.875rem] leading-[1.7] sm:px-4"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {entries.length === 0 ? (
            <p className="text-dim">Cleared. Type a command, or select one below.</p>
          ) : null}

          {entries.map((entry) => (
            <div key={entry.id} className="mb-3 last:mb-0">
              {entry.input ? (
                <p className="mb-1">
                  <Prompt command={entry.input} />
                </p>
              ) : null}
              {entry.lines.map((line, i) => (
                <TerminalLine key={i} line={line} onRun={runSuggestion} />
              ))}
            </div>
          ))}
        </div>

        <form
          className="border-t border-line bg-panel-2 px-3 py-3 sm:px-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
        >
          <label htmlFor={inputId} className="mb-1.5 block text-xs text-dim">
            Command input — Enter to run, ↑/↓ for history, Tab to complete
          </label>
          <div className="flex items-center gap-2 rounded border border-line bg-panel px-3 py-2 focus-within:border-amber/60">
            <span aria-hidden="true" className="text-sm">
              <Prompt />
            </span>
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="help"
              className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-dim"
            />
            <button
              type="submit"
              className="rounded border border-line-strong px-2.5 py-1 text-xs text-muted transition-colors hover:border-amber/60 hover:text-amber"
            >
              run
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-dim">try:</span>
            {portfolio.terminal.suggestions.map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => runSuggestion(command)}
                className="rounded border border-line bg-panel px-2 py-1 text-xs text-muted transition-colors hover:border-amber/50 hover:text-amber"
              >
                {command}
              </button>
            ))}
          </div>
        </form>
      </Panel>
    </Section>
  );
}

function TerminalLine({
  line,
  onRun,
}: {
  line: OutputLine;
  onRun: (command: string) => void;
}) {
  if (line.type === "blank") {
    return <div className="h-3" aria-hidden="true" />;
  }

  if (line.type === "text") {
    return (
      <p className={`whitespace-pre-wrap ${TONE_CLASS[line.tone ?? "default"]}`}>
        {line.text}
      </p>
    );
  }

  if (line.type === "row") {
    return (
      <p className="flex flex-wrap gap-x-3 pl-2">
        <span className="text-amber sm:w-48">{line.left}</span>
        <span className="min-w-0 text-muted">{line.right}</span>
      </p>
    );
  }

  if (line.type === "link") {
    const external = line.external ?? false;
    return (
      <p className="whitespace-pre-wrap">
        {line.prefix ? <span className="text-dim">{line.prefix}</span> : null}
        <a
          href={line.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...(line.href.startsWith("/") ? { download: true } : {})}
          className="text-green underline decoration-line-strong underline-offset-4 hover:decoration-amber"
        >
          {line.label}
        </a>
        {external ? (
          <>
            <span aria-hidden="true" className="ml-1 text-dim">
              ↗
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        ) : null}
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <button
        type="button"
        onClick={() => onRun(line.command)}
        className="rounded border border-line-strong px-2 py-0.5 text-left text-xs text-amber transition-colors hover:border-amber"
      >
        {line.command}
      </button>
      {line.description ? (
        <span className="text-muted">{line.description}</span>
      ) : null}
    </p>
  );
}
