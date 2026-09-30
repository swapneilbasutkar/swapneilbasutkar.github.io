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
      "Customer-facing engineer with 5+ years across enterprise consulting and product development. I build AI agents, integrations, and applications—and own the path from requirements to production.",
    location: "Dallas, Texas",
    impact:
      "Most recently: built and deployed an internal AI agent for Workday implementation analysis, cutting manual subject-matter expert effort by 80%.",
    whoami: [
      "I sit between the people who have the problem and the system that has to solve it. That usually means running the discovery conversation, writing down what success actually looks like, and then building the thing myself.",
      "Over five years at Deloitte, Accenture and SimplrOps I have shipped production LLM applications, enterprise integrations across Workday, SuccessFactors and Oracle, and full-stack features in Python, TypeScript and Node.js.",
      "I stay on after launch. Diagnosing a production incident from Datadog logs and shipping the fix through CI/CD the same day is a normal part of the job, not an exception.",
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
          body: "Workday implementation analysis and configuration leaned on subject-matter experts working through the same material by hand for every engagement. It was slow, it did not scale with demand, and the scarcest people on the team were spending their time on repeatable analysis.",
        },
        {
          label: "What I built",
          body: "An internal AI agent, built around a custom Claude Agent Skill, that performs Workday implementation analysis and configuration work. It runs in production inside the firm.",
        },
        {
          label: "My ownership",
          body: "I owned it end to end: gathering requirements from the subject-matter experts who would use it, defining the success criteria we would judge it against, designing the agent itself, and taking it through production rollout.",
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
          body: 'You cannot write expect(output).toBe("exact string") against a model that phrases its answer differently every run. Teams end up either skipping the assertion entirely or reaching for a separate Python tool or CLI workflow that lives outside their test suite.',
        },
        {
          label: "What it does",
          body: "llmExpect() drops into an existing Jest or Vitest suite with no setup file and no custom matcher registration. It throws on failure, which the test runner catches like any other assertion, and the failure message includes the score, the threshold and the model's reasoning.",
        },
        {
          label: "Assertions",
          body: "toBeRelevantTo, toMatchTone, toContainHallucination, toBeFactuallyCorrect, toSatisfy (free-form natural-language criteria), toHaveSentiment and toBeSafe. All of them support .not, and each accepts per-assertion overrides for threshold, model, provider, timeout and caching.",
        },
        {
          label: "Providers and caching",
          body: "OpenAI by default, Anthropic, or Ollama for free local inference with no API key. Responses are cached on disk and keyed on assertion type, input, criteria and model, so a re-run does not spend credits again. Optional setup entry points are exported at llm-assert/jest and llm-assert/vitest.",
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
      note: "The published package does not declare a repository field on npm. The source link above was verified separately: that repository's package.json carries the same name, version and description as the published package.",
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
          body: "Turning a raw brand name into a useful category is harder than a lookup table. Names arrive with inconsistent casing, suffixes and spelling, new brands appear constantly, and a static list goes stale the moment you ship it.",
        },
        {
          label: "AI classification",
          body: "AIBrandClassifier combines LangChain, OpenAI and Tavily search so the model classifies against current information rather than training data alone. identify() returns just the category name; classify() returns category, subcategory, a confidence rating and the evidence source URLs it used. It requires both an OpenAI and a Tavily API key.",
        },
        {
          label: "Offline classification",
          body: "The default export, BrandCategorizer, is a deterministic Naive Bayes classifier that runs with no API keys and no network. It is limited to the brands it was trained on and returns 'Unknown' when confidence is low, which makes it suited to internal datasets rather than open-ended input.",
        },
        {
          label: "Fallback behaviour",
          body: "If the LLM call fails, AIBrandClassifier catches the error and returns a result from the deterministic classifier instead. That result is explicitly marked 'Low' confidence and states that the LLM was unavailable, so a degraded answer is never mistaken for a confident one.",
        },
        {
          label: "Taxonomy",
          body: "Brand names are normalised before classification, and results are constrained to a fixed category set — Technology, Automotive, Fashion and so on — rather than free text.",
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

const category = await classifier.identify("Nvidia");
// "Technology"

const result = await classifier.classify("Impossible Foods");
// {
//   category: "Food & Beverage",
//   subcategory: "Plant-based Meat Alternatives",
//   confidence: "High",
//   evidence_sources: ["https://en.wikipedia.org/...", ...]
// }`,
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

    {
      slug: "conversational-ai",
      title: "Conversational AI Application",
      category: "Internal enterprise application",
      kind: "internal",
      featured: false,
      file: "conversational-ai.md",
      tagline:
        "Took an OpenAI and LangChain conversational agent from proof of concept to production on AWS.",
      caseStudy: [
        {
          label: "What I did",
          body: "Led a conversational AI agent built on OpenAI and LangChain from proof of concept through to production. I owned the path between those two points, not just the prototype.",
        },
        {
          label: "What shipped",
          body: "Deployed on AWS Elastic Beanstalk with a custom UI and conversation storage backed by RDS.",
        },
      ],
      tech: ["OpenAI", "LangChain", "Python", "AWS Elastic Beanstalk", "RDS"],
      links: [],
      note: "Internal enterprise work. Summarised without client identities or proprietary detail.",
    },

    {
      slug: "recoverable-workflows",
      title: "Recoverable Enterprise Workflows",
      category: "Internal reliability and automation work",
      kind: "internal",
      featured: false,
      file: "recoverable-workflows.md",
      tagline:
        "Redesigned long-running automation so an interruption costs minutes instead of a full re-run.",
      caseStudy: [
        {
          label: "The reliability problem",
          body: "Long-running Robot Framework pipelines had no memory of their own progress. Any interruption meant starting again from the beginning and redoing work that had already completed successfully — burning runtime and infrastructure cost each time.",
        },
        {
          label: "What I changed",
          body: "I redesigned the pipelines to persist checkpoints as they go and to make each step idempotent, so re-running a step that already finished is safe and has no additional effect.",
        },
        {
          label: "Resulting behaviour",
          body: "An interrupted workflow now resumes from its last checkpoint instead of restarting, skipping the work it has already done. That reduced both runtime and infrastructure cost.",
        },
      ],
      diagram: {
        caption: "Conceptual overview — illustrative, not a system diagram.",
        steps: [
          { label: "step 1", detail: "checkpoint saved" },
          { label: "step 2", detail: "checkpoint saved" },
          { label: "interrupted", detail: "run stops" },
          { label: "resume", detail: "continues at step 3" },
        ],
      },
      tech: ["Robot Framework", "Python", "Idempotency", "Checkpointing"],
      links: [],
      note: "Internal enterprise work. Summarised without client identities or proprietary detail.",
    },
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
        "Delivered Python, Selenium, and Automation Anywhere workflows for 5+ enterprise client projects; parallelized processing to cut execution time by 30% across 10,000+ monthly requests.",
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
