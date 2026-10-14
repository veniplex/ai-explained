/* AI explained: the core path. The shape of it: the eight chapters with their entries, what the recap
   points to, the figures' proportions and the guide titles. The words are in voice-tech.js and voice-ui-tech.js (plain
   technical words, AE3.tech); the kitchen sentences of the glossary are in voice-glossary-kitchen.js (AE3.kitchen). Entries live in entries.js; sources and facts in sources.js; guides in guides.js.
   Inline markup in strings: `code`, **bold**, [[entry-id]] or [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";

  AE3.meta = { updated: "2026-10-14", snapshot: "October 2026", repo: "https://github.com/veniplex/ai-explained" };

  AE3.hero = { title: "How an AI agent works", minutes: 9 };

  // zone: the colour of the chapter on the map; figure: a picture that belongs to the chapter's text.
  AE3.chapters = [
    { id: "chef", n: 1, zone: "model", figure: null, entries: ["model", "reasoning"] },
    { id: "counter", n: 2, zone: "harness", figure: "context-bars", entries: ["context", "prompt"] },
    { id: "tools", n: 3, zone: "tools", figure: null, entries: ["tools", "mcp"] },
    { id: "loop", n: 4, zone: "harness", figure: "loop", entries: ["agent-loop", "harness"] },
    { id: "recipes", n: 5, zone: "know", figure: null, entries: ["instructions", "skills", "knowledge", "memory"] },
    { id: "locks", n: 6, zone: "control", figure: null, entries: ["permissions", "sandbox", "hooks", "security"] },
    { id: "helpers", n: 7, zone: "orch", figure: null, entries: ["team", "background"] },
    { id: "kitchen-ops", n: 8, zone: "ops", figure: null, entries: ["evals", "cost", "governance"] }
  ];

  // Each of the five ideas points to the entries behind it; the text is AE3.tech.recap.
  AE3.recap = [
    { entries: ["model", "context"] },
    { entries: ["context", "skills", "knowledge", "memory", "team"] },
    { entries: ["instructions", "permissions", "hooks", "sandbox"] },
    { entries: ["team", "agent-loop", "evals"] },
    { entries: ["agent-loop", "evals"] }
  ];

  // The proportions of the two bars; their labels and captions are in AE3.tech.figures.
  AE3.figures = {
    contextBars: [
      [
        { pct: 11, zone: "harness", cls: "strong" },
        { pct: 15, zone: "model" },
        { pct: 52, zone: "tools", cls: "danger" },
        { pct: 15, zone: "know" },
        { pct: 7, cls: "free" }
      ],
      [
        { pct: 11, zone: "harness", cls: "strong" },
        { pct: 4, zone: "harness" },
        { pct: 9, zone: "model" },
        { pct: 7, zone: "tools" },
        { pct: 2, zone: "know", cls: "strong" },
        { pct: 67, cls: "free" }
      ]
    ]
  };

  // The guides, in the order of the list. menu: the short name, hint: what to expect (one sentence, the same in both ways), title: the heading of the
  // page, kind: always article (all seven guides have one layout), minutes: reading time (the long guide's own number is shown on its page).
  // The text of the guides is in voice-guides-long-tech-*.js.
  AE3.guideList = [
    {
      id: "how-it-works", menu: "How an agent works", kind: "article", minutes: 15, icon: "loop",
      hint: "Follow one request from the first message to the final answer: what goes into the context, how tools are called and why the loop stops.",
      title: "How an agent works, from request to answer"
    },
    {
      id: "context", menu: "Context engineering", kind: "article", minutes: 14, icon: "window",
      hint: "Why more context is not better, what fills the window, and how caching, compaction, retrieval and sub-agents keep it useful.",
      title: "Context engineering: deciding what the model sees"
    },
    {
      id: "build", menu: "Build your own", kind: "article", minutes: 20, icon: "ladder",
      hint: "A ladder from one prompt to a team of agents, with twelve steps, patterns, example routes, open protocols and a launch checklist.",
      title: "Building an agent, step by step"
    },
    {
      id: "secure", menu: "Securing agents", kind: "article", minutes: 15, icon: "shield",
      hint: "Permissions, sandboxes, hooks and prompt injection: how to let an agent act without handing over the keys.",
      title: "Securing an agent: permissions, sandboxes and prompt injection"
    },
    {
      id: "evaluate", menu: "Testing and running", kind: "article", minutes: 14, icon: "checklist",
      hint: "Evals, traces, cost and governance: how to know that an agent works, and how to keep it working once it is live.",
      title: "Testing and running agents in production"
    },
    {
      id: "compare", menu: "Easily confused", kind: "article", minutes: 6, icon: "scales",
      hint: "Skill, tool, MCP server, plugin or hook? One table shows who starts each, when it enters the context and what it costs.",
      title: "Skill, tool, MCP server, plugin, hook: what is the difference?"
    },
    {
      id: "learn", menu: "Where to learn more", kind: "article", minutes: 8, icon: "books",
      hint: "Talks, courses, books and papers from the people who build and study these systems, easiest first.",
      title: "Where to go deeper"
    }
  ];
})(window.AE3);
