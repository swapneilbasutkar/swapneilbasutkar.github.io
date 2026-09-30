"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "error";

/**
 * Copy-to-clipboard with explicit success *and* failure feedback — the
 * Clipboard API is unavailable over plain HTTP and can be denied by policy, so
 * a silent no-op would be misleading.
 */
export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  /** Accessible name, e.g. "Copy install command". */
  label: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2400);
  }, [value]);

  const text = status === "copied" ? "copied" : status === "error" ? "copy failed" : "copy";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="rounded border border-line-strong px-2 py-1 text-xs text-muted transition-colors hover:border-amber/50 hover:text-amber"
      >
        {text}
      </button>
      {/* Announced separately so the button's own name stays stable. */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? `Copied ${value} to clipboard`
          : status === "error"
            ? "Could not copy to clipboard. Select the text and copy manually."
            : ""}
      </span>
      {status === "error" ? (
        <span className="text-xs text-red" aria-hidden="true">
          select and copy manually
        </span>
      ) : null}
    </span>
  );
}
