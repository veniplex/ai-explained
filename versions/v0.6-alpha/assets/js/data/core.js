/* Agentic AI, Explained (v6): the core path. The shape of it: the eight chapters with their entries, what the recap
   points to, the figures' proportions and the guide titles. The words are in the two voices:
   voice-kitchen-*.js and voice-ui.js (the kitchen picture, AE3.kitchen) and voice-tech.js and voice-ui.js (plain
   technical words, AE3.tech). Entries live in entries.js; sources and facts in sources.js; guides in guides.js.
   Inline markup in strings: `code`, **bold**, [[entry-id]] or [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";

  AE3.meta = { updated: "2026-10-12", snapshot: "October 2026", repo: "https://github.com/veniplex/ai-explained", v1: "../v0.1-alpha/" };

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

  // What each passage of a chapter is about: the arrows run from the passage to these pieces of the map. One list per
  // voice, one item per paragraph of the chapter text, then one for the example. An item is a list of entry ids
  // (the entry must already be on the map in that chapter), "you" (the person at the top) or "zone" (the chapter's own
  // piece of the map as a whole).
  AE3.points = {
    chef: {
      kitchen: { text: [["model"], ["reasoning"], ["model"]], example: ["you", "model"] },
      technical: { text: [["model"], ["model"], ["model", "reasoning"]], example: ["you", "model"] }
    },
    counter: {
      kitchen: { text: [["context", "prompt"], ["context"]], example: ["context", "prompt"] },
      technical: { text: [["context", "prompt"], ["context"], ["context"]], example: ["context", "prompt"] }
    },
    tools: {
      kitchen: { text: [["tools"], ["mcp"]], example: ["tools", "mcp"] },
      technical: { text: [["tools"], ["tools"], ["mcp"]], example: ["tools", "mcp"] }
    },
    loop: {
      kitchen: { text: [["agent-loop"], ["harness"]], example: ["agent-loop"] },
      technical: { text: [["agent-loop"], ["agent-loop"], ["harness"]], example: ["agent-loop"] }
    },
    recipes: {
      kitchen: { text: [["instructions", "skills"], ["knowledge", "memory"]], example: ["zone"] },
      technical: { text: [["instructions", "skills"], ["knowledge"], ["memory"]], example: ["zone"] }
    },
    locks: {
      kitchen: { text: [["permissions", "sandbox", "hooks"], ["security"]], example: ["zone"] },
      technical: { text: [["permissions", "sandbox"], ["hooks"], ["security"]], example: ["zone"] }
    },
    helpers: {
      kitchen: { text: [["team"], ["background"]], example: ["zone"] },
      technical: { text: [["team"], ["team"], ["background"]], example: ["zone"] }
    },
    "kitchen-ops": {
      kitchen: { text: [["evals"], ["cost", "governance"]], example: ["zone"] },
      technical: { text: [["evals"], ["evals"], ["cost", "governance"]], example: ["zone"] }
    }
  };

  // Each of the five ideas points to the entries behind it; the text is AE3.kitchen.recap and AE3.tech.recap.
  AE3.recap = [
    { entries: ["model", "context"] },
    { entries: ["context", "skills", "knowledge", "memory", "team"] },
    { entries: ["instructions", "permissions", "hooks", "sandbox"] },
    { entries: ["team", "agent-loop", "evals"] },
    { entries: ["agent-loop", "evals"] }
  ];

  // The proportions of the two bars; their labels and captions are in AE3.kitchen.figures and AE3.tech.figures.
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

  // The ledes and notes of the guides are in AE3.kitchen.compare / .build and AE3.tech.guides.
  AE3.guideList = [
    {
      id: "compare", menu: "Easily confused", hint: "Skill vs. tool vs. MCP vs. plugin vs. hook", eyebrow: "Easily confused",
      title: "Skill, tool, MCP server, plugin, hook: what is the difference?"
    },
    {
      id: "build", menu: "Build your own", hint: "From one prompt to an agent team", eyebrow: "Build your own",
      title: "Building an agent, step by step"
    },
    { id: "glossary", menu: "Glossary", hint: "The vocabulary, A to Z", eyebrow: "Glossary", title: "The vocabulary, A to Z" },
    {
      id: "learn", menu: "Learn more", hint: "Talks, courses, books, papers", eyebrow: "Learn more", title: "Where to go deeper"
    },
    { id: "about", menu: "About", hint: "Sources, privacy, credits", eyebrow: "About", title: "About this page" }
  ];
})(window.AE3);
