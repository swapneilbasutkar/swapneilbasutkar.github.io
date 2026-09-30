/**
 * Type definitions for the portfolio content.
 *
 * Every piece of copy rendered by the site is described here and supplied by
 * `src/content/portfolio.ts`. Components read from that object and never hold
 * their own copy, so the site can be re-worded without touching JSX.
 */

/** A single entry in the desktop file-tree nav and the mobile link row. */
export interface NavItem {
  /** DOM id of the section this links to. */
  id: string;
  /** Label shown in the file tree, styled like a filename or directory. */
  file: string;
  /** Plain-language label used by assistive technology and mobile nav. */
  label: string;
  kind: "file" | "dir";
}

/** Distinguishes work that anyone can install from work that stays internal. */
export type ProjectKind = "published-library" | "internal";

export interface CodeBlock {
  /** Filename shown in the panel's title bar. */
  filename: string;
  /** Used only as a label; highlighting is done with a small hand-rolled tokenizer. */
  language: "ts" | "bash" | "text";
  code: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "npm" | "repo" | "external";
}

/** One labelled block of a case study, e.g. "Business problem". */
export interface CaseStudyBlock {
  label: string;
  body: string;
}

/** A conceptual, explicitly-labelled diagram. Never presented as a screenshot. */
export interface ConceptDiagram {
  caption: string;
  steps: { label: string; detail: string }[];
}

export interface Project {
  /** Stable identifier used by the `open <slug>` terminal command and the anchor id. */
  slug: string;
  title: string;
  /** Human-readable category badge, e.g. "Published npm library". */
  category: string;
  kind: ProjectKind;
  /** Featured projects render expanded; the rest render compact. */
  featured: boolean;
  /** One-line summary shown under the title. */
  tagline: string;
  /** Filename shown in the panel title bar. */
  file: string;
  caseStudy: CaseStudyBlock[];
  tech: string[];
  /** Copyable install command, published packages only. */
  install?: string;
  code?: CodeBlock;
  links: ProjectLink[];
  diagram?: ConceptDiagram;
  /** Shown as a small note, e.g. why there is no repository link. */
  note?: string;
}

export interface Position {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface SkillGroup {
  /** Key used when the group is rendered as JSON. */
  key: string;
  label: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  detail?: string;
  date: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeAsset {
  /** Path under /public. Set to null when the asset does not exist. */
  href: string | null;
  format: "PDF" | "DOCX";
  label: string;
}

export interface TerminalCommandHelp {
  command: string;
  description: string;
}

export interface Portfolio {
  profile: {
    name: string;
    /** Shell-prompt user@host, e.g. "swapneil@portfolio". */
    handle: string;
    descriptor: string;
    headline: string;
    supporting: string;
    location: string;
    /** One contextual impact statement shown in the hero. */
    impact: string;
    /** Key/value rows in the hero's profile panel. Keep these short. */
    facts: { label: string; value: string }[];
    /** Longer introduction for the whoami section and terminal command. */
    whoami: string[];
  };
  links: {
    email: string;
    github: string;
    githubLabel: string;
  };
  resume: {
    pdf: ResumeAsset;
    docx: ResumeAsset;
  };
  nav: NavItem[];
  projects: Project[];
  experience: Position[];
  skills: SkillGroup[];
  education: Education[];
  certifications: Certification[];
  terminal: {
    intro: string;
    help: TerminalCommandHelp[];
    /** Commands offered as clickable chips beneath the input. */
    suggestions: string[];
  };
  meta: {
    title: string;
    description: string;
    /** Keywords for <meta name="keywords">. */
    keywords: string[];
  };
}
