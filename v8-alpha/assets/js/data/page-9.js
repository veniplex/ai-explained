/* Agentic AI, Explained (v8): page 9, the finale. */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 9, id: "end", hash: "ch-e", zone: "start",
  kicker: "The end",
  title: "The whole kitchen",
  lead: "One Saturday, one kitchen, and five ideas to take home.",
  panels: [
    {
      size: "w", zone: "start", bg: "kitchen",
      alt: "Saturday morning. The owner says OK. The chef smiles at the counter, the till is open and its padlock hangs open. A delivery person arrives with crates of firm tomatoes.",
      cap: "You say OK. The till opens once, the order goes to the best stall, and 20 kilos of firm tomatoes arrive on Saturday morning.",
      scene: [
        ["window", 90, 150, { w: 100, h: 78 }],
        ["rays", 90, 104, { n: 7, r0: 66, r1: 82, d: 4 }],
        ["calendar", 250, 96, { t: "Sat", r: -3 }],
        ["counter", 410, 258, { w: 280, h: 56 }],
        ["chef", 470, 206, { s: 1.05, mood: "happy", arms: "cheer" }],
        ["owner", 200, 240, { s: 1.0, mood: "happy", arms: "point", fx: [-30, 0] }],
        ["till", 345, 191, { }],
        ["padlock", 378, 187, { open: true, s: 0.9, d: 3 }],
        ["person", 650, 240, { s: 0.92, mood: "happy", arms: "give", shirt: "m-tools", hat: "cap", hatf: "m-tools", fx: [60, 0], d: 2 }],
        ["crate", 758, 240, { n: 6, d: 3 }],
        ["crate", 758, 218, { n: 6, d: 4 }],
        ["crate", 758, 196, { n: 5, d: 5 }]
      ],
      say: [
        { t: "OK.", at: [19, 12], tail: "bl", w: 8 },
        { t: "All firm.", at: [72, 8], tail: "bl", w: 12 }
      ]
    },
    {
      size: "w", zone: "harness", bg: "kitchen",
      alt: "The whole kitchen in a row, each part with a small label: the owner, the chef and the counter, the tools, the notebook and recipe cards, the helpers, the locks, the taste panel with its camera, and the inspector.",
      cap: "Here is the whole kitchen. You give the order. The chef reads the counter, uses tools, keeps notes, calls helpers, works behind locks, and is tasted and inspected.",
      scene: [
        ["shelf", 156, 92, { w: 100 }],
        ["camera", 676, 70, { }],
        ["owner", 52, 236, { s: 0.74, mood: "happy", arms: "out" }],
        ["chef", 156, 214, { s: 0.68, mood: "calm", arms: "down", d: 1 }],
        ["counter", 156, 256, { w: 104, h: 42 }],
        ["ticket", 196, 203, { t: "Sat", s: 0.8, r: -4 }],
        ["counter", 260, 256, { w: 96, h: 42 }],
        ["phone", 242, 203, { s: 0.9 }],
        ["orderbook", 284, 203, { s: 0.7 }],
        ["counter", 364, 256, { w: 96, h: 42 }],
        ["notebook", 346, 203, { s: 0.8 }],
        ["cardbox", 388, 203, { s: 0.75 }],
        ["chef", 458, 240, { s: 0.5, mood: "happy", arms: "down" }],
        ["chef", 494, 240, { s: 0.5, mood: "proud", arms: "down" }],
        ["counter", 476, 256, { w: 96, h: 36 }],
        ["bowl", 476, 209, { c: "clay", s: 0.8 }],
        ["cupboard", 566, 240, { state: "locked", s: 0.85 }],
        ["alarm", 604, 128, { ring: 1, s: 0.8 }],
        ["person", 656, 236, { s: 0.6, mood: "calm", arms: "down", shirt: "m-know" }],
        ["counter", 686, 256, { w: 90, h: 38 }],
        ["person", 710, 236, { s: 0.6, mood: "happy", arms: "down", shirt: "m-model" }],
        ["scorecard", 672, 207, { t: " ", size: 14, s: 0.7 }], ["check", 672, 196, { s: 0.7 }],
        ["person", 782, 240, { s: 0.7, mood: "calm", arms: "down", shirt: "m-ops", hat: "cap", clip: true, flip: true }],
        ["label", 52, 276, { t: "you", size: 14, weight: 600 }],
        ["label", 156, 276, { t: "chef, counter", size: 14, weight: 600 }],
        ["label", 260, 276, { t: "tools", size: 14, weight: 600 }],
        ["label", 364, 276, { t: "notes, recipes", size: 14, weight: 600 }],
        ["label", 476, 276, { t: "helpers", size: 14, weight: 600 }],
        ["label", 580, 276, { t: "locks", size: 14, weight: 600 }],
        ["label", 686, 276, { t: "panel, camera", size: 14, weight: 600 }],
        ["label", 782, 276, { t: "inspector", size: 14, weight: 600 }]
      ]
    },
    {
      size: "s", zone: "model", bg: "kitchen",
      alt: "The first idea: the chef remembers nothing. The chef stares blankly with an empty thought cloud next to a counter that holds only one ticket.",
      cap: "Each order is forgotten the moment it is served. Only what is on the counter right now counts, plus what the chef learned from the cookbooks.",
      scene: [
        ["counter", 285, 258, { w: 190, h: 50 }],
        ["ticket", 285, 197, { t: "Sat", r: -3, fx: [0, -20] }],
        ["chef", 110, 240, { s: 0.95, mood: "think", arms: "think" }],
        ["ques", 240, 140, { s: 1.2, amb: "amb-bob" }],
        ["label", 200, 281, { t: "The chef remembers nothing.", size: 19, weight: 700 }]
      ],
      say: [
        { t: "Which order was this again?", at: [8, 5], tail: "br", k: "think", w: 40 }
      ]
    },
    {
      size: "s", zone: "harness", bg: "kitchen",
      alt: "The second idea: the counter is the bottleneck. A big pile of papers covers the counter and hides a note that says no soft tomatoes. The chef looks for it.",
      cap: "The counter is small, and clutter hides what matters. Recipe cards, the cookbook shelf and the notebook bring the right thing at the right time. Helpers keep the counter clean.",
      scene: [
        ["counter", 190, 258, { w: 300, h: 50 }],
        ["note", 112, 192, { w: 100, h: 34, t: "no soft tomatoes", f: "bads", r: -9, size: 9.5 }],
        ["pile", 218, 197, { n: 12, s: 1.2, d: 1 }],
        ["chef", 330, 206, { s: 0.85, mood: "worried", arms: "shrug" }],
        ["label", 200, 281, { t: "The counter is the bottleneck.", size: 19, weight: 700 }]
      ],
      say: [
        { t: "Where did the rule go?", at: [44, 4], tail: "br", k: "think", w: 36 }
      ]
    },
    {
      size: "s", zone: "control", bg: "kitchen",
      alt: "The third idea: a rule asks, a lock holds. On the left a paper note on the wall asks for no soft tomatoes while the chef cheekily holds a soft one. On the right a locked cupboard does not open, and the chef shrugs.",
      cap: "A rule on the wall asks the chef politely. A lock on the cupboard cannot be talked round. Put the dangerous things behind locks.",
      scene: [
        ["c_notecard", 70, 118, { w: 92, h: 56, lines: ["Please:", "no soft", "tomatoes."], size: 11, f: "parts", r: -3 }],
        ["chef", 130, 240, { s: 0.85, mood: "happy", arms: "give", d: 1 }],
        ["tomato", 190, 196, { soft: true, r: 11, d: 3 }],
        ["cupboard", 285, 240, { state: "locked", s: 1.15 }],
        ["chef", 355, 240, { s: 0.8, mood: "oops", arms: "shrug", d: 2 }],
        ["label", 200, 281, { t: "A rule asks. A lock holds.", size: 19, weight: 700 }]
      ],
      say: [
        { t: "Just this once.", at: [32, 5], tail: "bl", w: 28 }
      ]
    },
    {
      size: "s", zone: "know", bg: "kitchen",
      alt: "The fourth idea: start simple. Three stairs rise from left to right. On the first stands an order ticket, marked start here. On the second stands a recipe card. On the third stands a small improvising chef.",
      cap: "One order ticket beats a fixed recipe, and a fixed recipe beats a chef who improvises, until the taste panel shows you need more.",
      scene: [
        ["c_stairs", 200, 240, { n: 3, w: 86, h: 34 }],
        ["ticket", 114, 206, { t: "Sat", d: 1 }],
        ["card", 200, 172, { t: "recipe", s: 1.2, d: 2 }],
        ["chef", 286, 138, { s: 0.55, mood: "think", arms: "up", d: 3 }],
        ["label", 114, 142, { t: "start here", size: 13 }],
        ["arrowline", 0, 0, { pts: [[114, 148], [114, 156]], d: 1 }],
        ["label", 200, 281, { t: "Start simple.", size: 19, weight: 700 }]
      ],
      say: [
        { t: "Climb only when the taste panel says so.", at: [48, 4], tail: "bl", k: "sign", w: 48 }
      ]
    },
    {
      size: "w", zone: "ops", bg: "kitchen",
      alt: "The fifth idea: taste before serving. The chef and a second cook both taste the dish. Three stars hang above the plate. The owner waits happily on the right under a covered plate.",
      cap: "Tasting every dish, and letting a second cook taste it too, turns a plausible dish into a good one.",
      scene: [
        ["counter", 350, 258, { w: 480, h: 56 }],
        ["chef", 200, 206, { s: 1.0, mood: "taste", arms: "hold" }],
        ["spoon", 218, 160, { r: 20, d: 2 }],
        ["chef", 500, 206, { s: 1.0, mood: "taste", arms: "hold", flip: true, d: 1 }],
        ["spoon", 482, 160, { r: -20, d: 2 }],
        ["plate", 350, 191, { c: "clay" }],
        ["stars", 350, 150, { n: 3, d: 3, amb: "amb-pulse" }],
        ["cloche", 580, 191, { d: 4 }],
        ["owner", 710, 240, { s: 1.0, mood: "happy", arms: "out", d: 5 }],
        ["label", 410, 286, { t: "Taste before serving.", size: 22, weight: 700 }]
      ],
      say: [
        { t: "This is good.", at: [10, 8], tail: "br", w: 14 },
        { t: "I agree.", at: [68, 8], tail: "bl", w: 12 }
      ]
    }
  ],
  namesTitle: "All the real names",
  namesNote: "Every picture has a real name. Each links to the longer explanation in v6.",
  names: [
    { kw: "the chef", term: "Language model (LLM)", id: "model", def: "A program trained on huge amounts of text to predict what comes next. It reads and writes text, piece by piece." },
    { kw: "planning first", term: "Reasoning (thinking models)", id: "reasoning", def: "A reasoning model works through a problem step by step before it answers." },
    { kw: "the counter", term: "Context window", id: "context", def: "The context is everything the model sees in one request; the context window is its size limit." },
    { kw: "the order ticket", term: "Prompt & system prompt", id: "prompt", def: "A prompt is the message you send. The system prompt holds standing instructions, sent with every request." },
    { kw: "knives and phones", term: "Tools", id: "tools", def: "A tool is something the model can ask to have done, such as a web search or a new row in a spreadsheet." },
    { kw: "the one plug", term: "MCP (Model Context Protocol)", id: "mcp", def: "MCP is an open standard for connecting AI apps to other software." },
    { kw: "the tasting circle", term: "Agent loop", id: "agent-loop", def: "The cycle that turns a model into an agent: look, act, see the result, repeat." },
    { kw: "the kitchen around the chef", term: "Harness (the agent app)", id: "harness", def: "The harness is the app around the model: it runs the agent loop and does what the model cannot." },
    { kw: "house rules sheet", term: "Instruction files", id: "instructions", def: "Instruction files hold standing rules in plain text. The harness puts them in the context at the start of every new job." },
    { kw: "recipe cards", term: "Skills & saved prompts", id: "skills", def: "A skill is written know-how for one kind of task. The agent loads it only when that task comes up." },
    { kw: "cookbook shelf and market call", term: "Looking things up (search & RAG)", id: "knowledge", def: "Looking things up gives the agent facts it was never trained on, from the web, your files or a knowledge base." },
    { kw: "the notebook", term: "Memory & compaction", id: "memory", def: "The model remembers nothing between requests, so memory means notes kept outside the context and loaded again when needed." },
    { kw: "keys to cupboards", term: "Permissions & approval", id: "permissions", def: "Permissions decide what an agent may do alone, what needs your approval and what is forbidden." },
    { kw: "sealed test kitchen", term: "Sandbox", id: "sandbox", def: "A sandbox is an isolated computer where the agent runs code without touching the rest of your systems." },
    { kw: "smoke alarm and till lock", term: "Hooks & guardrails", id: "hooks", def: "Hooks are small programs the harness runs automatically at fixed moments. Guardrails check what goes into and comes out of the model." },
    { kw: "the forged note", term: "Prompt injection & security", id: "security", def: "Prompt injection hides instructions in text an agent reads, to hijack what it does." },
    { kw: "helpers", term: "Sub-agents, workflows & teams", id: "team", def: "Sub-agents are helper agents with their own fresh context; workflows run fixed steps in code." },
    { kw: "night shift", term: "Background agents & triggers", id: "background", def: "A background agent starts on its own, works while nobody watches and reports back when it is done." },
    { kw: "taste panel", term: "Evals & observability", id: "evals", def: "Evals are tests for AI: real tasks with clear pass or fail criteria." },
    { kw: "the bill", term: "Cost & providers", id: "cost", def: "AI is billed per token: the small pieces of text that go in and come out." },
    { kw: "health inspector", term: "Governance & regulation", id: "governance", def: "Governance means the policies, records and legal duties around using AI in an organisation." }
  ]
});
