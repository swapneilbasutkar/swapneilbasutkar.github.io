import type { Portfolio } from "./types";

/**
 * ---------------------------------------------------------------------------
 * The single source of truth for every word on this site.
 * ---------------------------------------------------------------------------
 * Edit this file to change copy, experience, projects, skills or links. No
 * component holds its own text, so nothing else needs to be touched.
 *
 * Content rules this file follows deliberately:
 *   - Facts come from the resume in `public/resume/`. Nothing is embellished.
 *   - Internal client work is summarised without client identities, proprietary
 *     detail or repository links.
 *   - Metrics stay attached to the work they came from; they are never combined
 *     into a headline statistic.
 *   - No download counts, stars, testimonials or availability claims anywhere.
 */
export const portfolio: Portfolio = {
  profile: {
    name: "Swapneil Basutkar",
    handle: "swapneil@portfolio",
    descriptor: "Software Engineer · Enterprise AI",
    headline: "I turn enterprise problems into deployed software.",
    supporting:
      "Customer-facing engineer across enterprise consulting and product development at Deloitte and SimplrOps. I build AI agents, integrations, and applications—and own the path from requirements to production.",
    location: "Dallas, Texas",
    impact:
      "Most recently: built and deployed an internal AI agent for Workday implementation analysis, cutting manual subject-matter expert effort by 80%.",
    whoami: [
      "I sit between the people who have the problem and the system that has to solve it. That usually means running the discovery conversation, writing down what success actually looks like, and then building the thing myself.",
      "At Deloitte and SimplrOps I have shipped production LLM applications, enterprise integrations across Workday, SuccessFactors and Oracle, and full-stack features in Python, TypeScript and Node.js.",
      "I stay on after launch. Diagnosing a production incident from Datadog logs and shipping the fix through CI/CD the same day is a normal part of the job, not an exception.",
      "Before software engineering I spent three years at Accenture in RPA, building enterprise automation with Automation Anywhere, UiPath, Python and Selenium. It is where I learned to take a messy manual process apart and rebuild it as something that runs on its own.",
      "On the side I publish developer libraries to npm — tools I wanted while testing and building with LLMs.",
    ],
  },

  links: {
    email: "swapneil.basutkar@protonmail.com",
    github: "https://github.com/swapneilbasutkar",
    githubLabel: "github.com/swapneilbasutkar",
  },

  // Set `href` to null if the corresponding file is removed from public/resume/.
  resume: {
    pdf: {
      href: "/resume/Swapneil_Basutkar_Resume.pdf",
      format: "PDF",
      label: "Resume (PDF)",
    },
    docx: {
      href: "/resume/Swapneil_Basutkar_Resume.docx",
      format: "DOCX",
      label: "Resume (DOCX)",
    },
  },

  nav: [
    { id: "whoami", file: "whoami.md", label: "About", kind: "file" },
    { id: "projects", file: "projects/", label: "Projects", kind: "dir" },
    { id: "experience", file: "experience.log", label: "Experience", kind: "file" },
    { id: "stack", file: "stack.json", label: "Skills", kind: "file" },
    { id: "contact", file: "contact.sh", label: "Contact", kind: "file" },
    { id: "terminal", file: "terminal", label: "Terminal", kind: "file" },
  ],

  projects: [
    {
      slug: "workday-agent",
      title: "Workday Implementation AI Agent",
      category: "Internal enterprise AI project",
      kind: "internal",
      featured: true,
      file: "workday-agent.md",
      tagline:
        "An internal agent with a custom Claude Agent Skill that took 80% of the manual effort out of Workday implementation analysis.",
      caseStudy: [
        {
          label: "Business problem",
          body: "Every Workday engagement had subject-matter experts working through the same implementation analysis by hand — slow, unscalable, and the wrong use of the scarcest people on the team.",
        },
        {
          label: "What I built",
          body: "An internal AI agent, built around a custom Claude Agent Skill, that performs Workday implementation analysis and configuration. It runs in production.",
        },
        {
          label: "My ownership",
          body: "End to end: requirements from the experts who would use it, the success criteria we judged it against, the agent design, and production rollout.",
        },
        {
          label: "Outcome",
          body: "Manual subject-matter expert effort dropped by 80%.",
        },
      ],
      tech: ["Claude Agent Skills", "Anthropic API", "Python", "Requirements gathering"],
      links: [],
      note: "Internal enterprise work. Described in summary only — no client identities, proprietary configuration or source code, and no public repository.",
    },

    {
      slug: "llm-assert",
      title: "llm-assert",
      category: "Published npm library",
      kind: "published-library",
      featured: true,
      file: "llm-assert.test.ts",
      tagline:
        "Semantic assertions for Jest and Vitest, so you can test LLM output with expect()-style syntax.",
      caseStudy: [
        {
          label: "The problem",
          body: 'You cannot write expect(output).toBe("exact string") against a model that rephrases its answer every run — so the assertion gets skipped, or moved out to a separate tool.',
        },
        {
          label: "What it does",
          body: "llmExpect() drops into an existing Jest or Vitest suite with no setup file and no matcher registration. It throws like any other assertion, and the failure reports the score, the threshold and the model's reasoning.",
        },
        {
          label: "Assertions",
          body: "toBeRelevantTo, toMatchTone, toContainHallucination, toBeFactuallyCorrect, toSatisfy, toHaveSentiment, toBeSafe — all supporting .not and per-assertion overrides. Runs on OpenAI, Anthropic or local Ollama, with responses cached on disk so re-runs don't spend credits.",
        },
      ],
      tech: ["TypeScript", "Jest", "Vitest", "OpenAI", "Anthropic", "Ollama"],
      install: "npm install llm-assert",
      code: {
        filename: "reply.test.ts",
        language: "ts",
        code: `import { llmExpect } from "llm-assert";

test("customer service reply is relevant and professional", async () => {
  const reply = await getAIResponse("How do I get a refund?");

  await llmExpect(reply).toBeRelevantTo("refund policy");
  await llmExpect(reply).toMatchTone("professional and empathetic");
  await llmExpect(reply).not.toContainHallucination({ context: refundDocs });
});`,
      },
      links: [
        { label: "npm", href: "https://www.npmjs.com/package/llm-assert", kind: "npm" },
        {
          label: "Source",
          href: "https://github.com/swapneilbasutkar/llm-assert",
          kind: "repo",
        },
      ],
      note: "npm lists no repository for this package; the source link was verified separately against a package.json with the same name, version and description.",
    },

    {
      slug: "brand-category-identifier",
      title: "brand-category-identifier",
      category: "Published npm library",
      kind: "published-library",
      featured: true,
      file: "brand-category-identifier.ts",
      tagline:
        "Maps a brand name to a category, with an AI path for open-ended input and a deterministic path for offline use.",
      caseStudy: [
        {
          label: "The problem",
          body: "Mapping a raw brand name to a category is harder than a lookup table: inconsistent casing and suffixes, new brands constantly, and a static list that goes stale the moment you ship it.",
        },
        {
          label: "Two modes",
          body: "AIBrandClassifier pairs LangChain and OpenAI with Tavily search, so it classifies against current information rather than training data alone, returning category, subcategory, confidence and its sources. The default export is a deterministic Naive Bayes classifier that runs offline with no API keys, limited to the brands it was trained on.",
        },
        {
          label: "Fallback",
          body: "If the LLM call fails, the AI classifier falls back to the deterministic one and marks the result 'Low' confidence — a degraded answer is never mistaken for a confident one.",
        },
      ],
      tech: ["TypeScript", "LangChain", "OpenAI", "Tavily", "natural", "zod"],
      install: "npm install brand-category-identifier",
      code: {
        filename: "classify.ts",
        language: "ts",
        code: `import { AIBrandClassifier } from "brand-category-identifier";

const classifier = new AIBrandClassifier({
  openAIApiKey: process.env.OPENAI_API_KEY!,
  tavilyApiKey: process.env.TAVILY_API_KEY!,
});

await classifier.identify("Nvidia");
// "Technology"

await classifier.classify("Impossible Foods");
// { category: "Food & Beverage", subcategory: "Plant-based Meat
//   Alternatives", confidence: "High", evidence_sources: [...] }`,
      },
      links: [
        {
          label: "npm",
          href: "https://www.npmjs.com/package/brand-category-identifier",
          kind: "npm",
        },
        {
          label: "Source",
          href: "https://github.com/swapneilbasutkar/brand-category-identifier",
          kind: "repo",
        },
      ],
    },

    // The conversational AI application and the checkpointed Robot Framework
    // workflows used to sit here as compact entries. They were removed because
    // both already appear, almost word for word, as bullets under the two
    // Deloitte roles in `experience` below — repeating them made the projects
    // section look padded without adding information. Set `featured: false` on
    // any new project to bring the compact "Also shipped" grid back.
  ],

  experience: [
    {
      company: "Deloitte",
      location: "Dallas, TX (Remote)",
      title: "Software Engineer I",
      period: "May 2026 — Present",
      bullets: [
        "Built and deployed an internal AI agent with a custom Claude Agent Skill for Workday implementation analysis and configuration, reducing manual subject-matter expert effort by 80%. Owned requirements gathering, success criteria, agent design, and production rollout.",
        "Delivered Python and Node.js product features and production fixes, translating client-reported issues into engineering changes and deploying through GitHub Actions CI/CD.",
        "Redesigned Robot Framework pipelines with persisted checkpoints and idempotent recovery so interrupted enterprise workflows resume without redundant processing, reducing runtime and infrastructure cost.",
      ],
    },
    {
      company: "Deloitte",
      location: "Dallas, TX (Remote)",
      title: "Software Engineer (Services Associate)",
      period: "Jan 2025 — May 2026",
      bullets: [
        "Led an OpenAI and LangChain conversational AI agent from proof of concept to production on AWS Elastic Beanstalk, with a custom UI and RDS-backed conversation storage.",
        "Integrated Workday, SuccessFactors, and Oracle through SQL data pipelines and Node.js APIs serving customer-facing interfaces.",
        "Improved backend execution speed by 40% through Python and Robot Framework refactoring.",
        "Served as first-line technical contact for enterprise production issues, using Datadog logs to diagnose root causes, resolve incidents, and coordinate engineering fixes.",
      ],
    },
    {
      company: "SimplrOps",
      location: "Dallas, TX",
      title: "Software Engineer Intern",
      period: "Jul 2024 — Jan 2025",
      bullets: [
        "Shipped full-stack features with Python/Flask, Node.js, React, and Angular.",
        "Automated UI and data-processing tests with Robot Framework, cutting AWS deployment time by 60%.",
        "Owned production hotfixes through CI/CD, reducing issue resolution time from days to hours while maintaining 99.9% uptime.",
      ],
    },
    {
      company: "Accenture",
      location: "India",
      title: "Software Engineer",
      period: "Jul 2019 — Jul 2022",
      bullets: [
        "Built RPA and automation workflows with Automation Anywhere, UiPath, Python and Selenium for 5+ enterprise client projects; parallelized processing to cut execution time by 30% across 10,000+ monthly requests.",
        "Integrated SAP, Excel, and PDF data for financial reconciliation, reducing processing time from 5 days to 6 hours for $10M+ in monthly transactions.",
        "Created version-controlled API specifications, process flows, and solution architecture documentation, reducing new-team onboarding time by 50%.",
      ],
    },
  ],

  skills: [
    {
      key: "ai",
      label: "AI",
      items: [
        "Claude Agent Skills",
        "Anthropic APIs",
        "OpenAI APIs",
        "LangChain",
        "Prompt engineering",
      ],
    },
    {
      key: "development",
      label: "Development",
      items: [
        "Python",
        "TypeScript",
        "JavaScript",
        "SQL",
        "Node.js",
        "Flask",
        "React",
        "REST APIs",
      ],
    },
    {
      key: "cloud_and_data",
      label: "Cloud and data",
      items: [
        "AWS Elastic Beanstalk",
        "EC2",
        "S3",
        "RDS",
        "PostgreSQL",
        "MySQL",
        "Docker",
      ],
    },
    {
      key: "delivery_and_reliability",
      label: "Delivery and reliability",
      items: ["GitHub Actions", "Git", "Datadog", "Robot Framework", "Selenium"],
    },
  ],

  education: [
    {
      degree: "M.S. Computer Science",
      institution: "East Texas A&M University",
      detail: "GPA 3.7",
      date: "May 2024",
    },
    {
      degree: "B.Tech. Information Technology",
      institution: "SNIST, India",
      date: "May 2019",
    },
  ],

  certifications: [
    {
      name: "Advanced Prompt Engineer with Coding",
      issuer: "Deloitte AI Academy (DataCamp)",
      date: "Apr 2025",
    },
  ],

  terminal: {
    intro:
      "Optional. Everything it shows is already on this page — this is just another way to move around it.",
    help: [
      { command: "help", description: "List available commands" },
      { command: "whoami", description: "Short introduction" },
      { command: "projects", description: "List projects" },
      { command: "open <project-slug>", description: "Jump to a project" },
      { command: "experience", description: "Jump to the experience timeline" },
      { command: "skills", description: "Show grouped skills" },
      { command: "resume", description: "Show resume downloads" },
      { command: "contact", description: "Show email and links" },
      { command: "clear", description: "Clear this transcript" },
    ],
    suggestions: ["help", "whoami", "projects", "open workday-agent", "skills", "contact"],
  },

  meta: {
    title: "Swapneil Basutkar — Software Engineer · Enterprise AI",
    description:
      "Customer-facing software engineer in Dallas, Texas. I build enterprise AI agents, integrations, and full-stack applications, and own delivery from requirements to production.",
    keywords: [
      "Swapneil Basutkar",
      "Software Engineer",
      "Forward Deployed Engineer",
      "Applied AI Engineer",
      "Enterprise AI",
      "Claude Agent Skills",
      "LangChain",
      "Dallas",
    ],
  },
};

export default portfolio;
