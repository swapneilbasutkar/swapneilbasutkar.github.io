import { Fragment } from "react";

/**
 * A deliberately small syntax highlighter.
 *
 * It exists so code previews carry a few coloured details rather than being a
 * wall of one colour. It is not a parser: it recognises comments, strings,
 * keywords, call sites, numbers and punctuation, and leaves everything else
 * alone. Output is React elements, never raw HTML.
 */

type TokenKind = "comment" | "string" | "keyword" | "fn" | "number" | "punct" | "plain";

const KEYWORDS = [
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "await",
  "async",
  "function",
  "return",
  "new",
  "test",
  "describe",
  "it",
  "true",
  "false",
  "null",
  "undefined",
];

const TS_PATTERN = new RegExp(
  [
    "(\\/\\/[^\\n]*)", // 1 line comment
    "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)", // 2 string
    `\\b(${KEYWORDS.join("|")})\\b`, // 3 keyword
    "([A-Za-z_$][\\w$]*)(?=\\()", // 4 call site
    "\\b(\\d+(?:\\.\\d+)?)\\b", // 5 number
    "([{}()\\[\\];:,.=!<>+*/|&?])", // 6 punctuation
  ].join("|"),
  "g",
);

const BASH_PATTERN = /(#[^\n]*)|(^\s*(?:npm|npx|yarn|pnpm|git|export)\b)/gm;

const CLASS_FOR: Record<TokenKind, string> = {
  comment: "text-[var(--syn-comment)] italic",
  string: "text-[var(--syn-string)]",
  keyword: "text-[var(--syn-key)]",
  fn: "text-[var(--syn-fn)]",
  number: "text-[var(--syn-string)]",
  punct: "text-[var(--syn-punct)]",
  plain: "",
};

interface Token {
  kind: TokenKind;
  text: string;
}

function tokenize(code: string, language: "ts" | "bash" | "text"): Token[] {
  if (language === "text") return [{ kind: "plain", text: code }];

  const pattern = language === "bash" ? BASH_PATTERN : TS_PATTERN;
  const tokens: Token[] = [];
  let lastIndex = 0;

  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    // Zero-length matches would loop forever; nudge past them.
    if (match.index === pattern.lastIndex) {
      pattern.lastIndex += 1;
      continue;
    }

    if (match.index > lastIndex) {
      tokens.push({ kind: "plain", text: code.slice(lastIndex, match.index) });
    }

    let kind: TokenKind = "plain";
    if (language === "bash") {
      kind = match[1] ? "comment" : "keyword";
    } else if (match[1]) kind = "comment";
    else if (match[2]) kind = "string";
    else if (match[3]) kind = "keyword";
    else if (match[4]) kind = "fn";
    else if (match[5]) kind = "number";
    else if (match[6]) kind = "punct";

    tokens.push({ kind, text: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push({ kind: "plain", text: code.slice(lastIndex) });
  }

  return tokens;
}

/**
 * A horizontally scrollable code block. The block scrolls on its own so a long
 * line can never widen the page.
 */
export function Code({
  code,
  language = "ts",
  className = "",
}: {
  code: string;
  language?: "ts" | "bash" | "text";
  className?: string;
}) {
  const tokens = tokenize(code, language);

  return (
    <pre
      tabIndex={0}
      className={`thin-scroll overflow-x-auto px-3 py-3.5 text-[0.85rem] leading-[1.75] sm:px-4 ${className}`}
    >
      <code>
        {tokens.map((token, i) => (
          <Fragment key={i}>
            {token.kind === "plain" ? (
              token.text
            ) : (
              <span className={CLASS_FOR[token.kind]}>{token.text}</span>
            )}
          </Fragment>
        ))}
      </code>
    </pre>
  );
}
