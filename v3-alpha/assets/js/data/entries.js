/* Agentic AI, Explained (v3): the 21 entries. Each opens in the drawer in three levels:
   1. the kitchen picture and one plain sentence, 2. how it works, the example and what it means for you,
   3. "Go deeper": details for builders and the merged v1 concepts. Facts and sources live in sources.js.
   Inline markup: `code`, **bold**, [[entry-id]] or [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
window.AE3.entries = {

  /* ---- Chapter 1: the chef ---- */
  "model": {
    chapter: "chef", name: "Language model (LLM)", label: "Language model",
    kitchen: "The chef: has read every cookbook, knows what usually comes next, and forgets each order once it is served.",
    short: "A program trained on huge amounts of text to predict what comes next. It reads and writes text, piece by piece.",
    how: [
      "Training adjusts billions of internal numbers until the model predicts text well; later training teaches it to follow instructions. Its knowledge then stops at a cut-off date. It looks nothing up, keeps no memory between requests, and can sound sure while being wrong, which is called a hallucination."
    ],
    example: "With nothing else to go on, it answers the flight question from memory, with invented prices.",
    forYou: [
      "Check recent or exact facts against a source.",
      "Models differ in skill, speed and price; the newest is not always the best fit."
    ],
    deeper: {
      details: [
        "Technically, a large language model is a neural network (a transformer) with billions of internal settings called parameters. Pre-training on trillions of tokens teaches it to predict the next token. Post-training with human and AI feedback turns that predictor into an assistant that follows instructions and declines harmful requests.",
        "Current frontier models read text and images, take very long inputs and are trained to call tools, which is what makes agents possible. Open-weight models can be downloaded and run on your own hardware.",
        "Choose per task: a strong model for planning and hard problems, a smaller and faster one for simple, high-volume steps. Compare candidates on your own examples, not only on public leaderboards."
      ],
      includes: [
        { name: "Fine-tuning", text: "Training an existing model further on your own examples to change its weights. The last lever to pull, after better instructions, better context and better tools." }
      ]
    },
    related: ["reasoning", "context", "cost"],
    from: ["model", "fine-tuning"]
  },

  "reasoning": {
    chapter: "chef", name: "Reasoning (thinking models)", label: "Reasoning",
    kitchen: "Before a tricky dish, the chef stops and plans every step first: slower to start, but fewer dishes burn.",
    short: "A reasoning model, also called a thinking model, works through a problem step by step before it answers.",
    how: [
      "The model writes out its thinking before it answers. This thinking is extra text, counted in tokens (small pieces of words) like the answer itself, so the answer takes longer and costs more, even when the app hides it. In return, the model does much better at maths, planning and code. Many apps let you set how hard it thinks; this is often called the effort level."
    ],
    example: "Before suggesting a flight, it weighs dates, bag fees and stopovers against each other.",
    forYou: [
      "Turn on thinking, or a higher effort, for hard problems with many steps.",
      "For quick lookups, a fast model or a low effort is quicker and cheaper."
    ],
    deeper: {
      details: [
        "Reasoning models are trained with reinforcement learning (learning by trial and reward) to write a chain of thought, their reasoning in words, before the final answer. Spending more computing power while answering, called test-time compute, reliably improves results on maths, coding and multi-step problems.",
        "Most model APIs (the connections programs use to call a model) now offer an effort or thinking level, for example from low to max, rather than a fixed number of thinking tokens. With adaptive thinking, the model decides how long to think within the level you set. Thinking tokens are billed like the answer, even when they are hidden. In agents, models also think between tool calls (interleaved thinking), so they can reflect on a surprising result before choosing the next action.",
        "Use high effort for planning, debugging, maths and complex trade-offs, and lower effort for simple steps where speed matters, such as sorting requests (routing) or pulling fields out of text (extraction). Maximum effort everywhere is slower, more expensive and sometimes worse on simple tasks; tune it per step, as you would choose a model per step. Reasoning models need fewer step-by-step instructions: give clear goals, context and success criteria instead. And do not read the visible reasoning as a faithful record of how the model reached its answer; research shows it often is not."
      ],
      includes: []
    },
    related: ["model", "agent-loop", "cost"],
    from: ["reasoning"]
  },

  /* ---- Chapter 2: the counter ---- */
  "context": {
    chapter: "counter", name: "Context window", label: "Context window",
    kitchen: "The counter: the chef can only use what lies on it, and it has a fixed size.",
    short: "The context is everything the model sees in one request; the context window is its size limit.",
    how: [
      "The context holds your message, attached files, the app's standing instructions and the chat so far. The model remembers nothing between requests, so the app sends it all again each time. Context is measured in tokens, small pieces of words. Answers get worse as the window fills with clutter, an effect called context rot. Choosing what goes in, and what stays out, is context engineering."
    ],
    example: "Your dates, budget and home airport are in the context, so the answer fits your trip. A pasted travel guide would only bury them.",
    forYou: [
      "Give it what matters for the task, not everything you have.",
      "Start a new chat for a new topic; old messages get in the way."
    ],
    deeper: {
      details: [
        "In English, one token is roughly three quarters of a word. The window is the maximum number of tokens one request can hold, including the reply. In 2026 about one million tokens is standard for frontier models (the most capable ones); many smaller and older models offer 128,000 to 200,000.",
        "On every turn the harness, the app around the model, sends the whole conversation again: system prompt, tool definitions, history and tool results. Longer contexts cost more, run slower and lose quality, effects researchers call “lost in the middle” and “context rot”, so a bigger window is not automatically better. Prompt caching makes a repeated beginning cheap and fast ([[cost]]): put stable content first, changing content last. Use long context for a whole document, and [[knowledge|retrieval]] (looking up only what is needed) for large or changing collections. Do not dump all your code, whole inboxes or logs in, and do not assume the model remembers earlier chats unless the harness re-sends them ([[memory]]).",
        "Context engineering is prompt engineering grown up for agents: curating everything in the window across many turns. The model's attention is limited, so aim for the smallest set of useful tokens that lets it take the next step well; clear out stale tool output and dead ends. Write context out into notes, select what to bring in, compress what stays (summarise long outputs, but keep error messages the agent still needs), and isolate work in [[team|sub-agents]], helpers with their own context. Load details only when needed, and point to files instead of pasting them."
      ],
      includes: [
        { name: "Context engineering", text: "Choosing what goes into the context at each step, and what stays out, so the model has exactly what it needs for its next move." }
      ]
    },
    related: ["prompt", "memory", "skills", "knowledge"],
    from: ["context-window", "context-engineering"]
  },

  "prompt": {
    chapter: "counter", name: "Prompt & system prompt", label: "Prompt",
    kitchen: "Your order says what you want tonight; the owner's standing orders say how every dish is served.",
    short: "A prompt is the message you send. The system prompt holds standing instructions from whoever built the app, sent with every request.",
    how: [
      "The system prompt goes in before your message. It sets the model's role, rules and answer format. Your prompt then says what you want right now. Good prompts are specific: a clear goal, the limits that apply, an example of a good result, and what counts as done. Anything you leave out, the model has to guess."
    ],
    example: "Your request about the Lisbon flights is the prompt. The travel app's system prompt says: always show total prices.",
    forYou: [
      "Say what you want, the limits (dates, budget) and the format, such as “a table with three options”.",
      "Explain why a rule matters. Models follow reasons better than shouted commands."
    ],
    deeper: {
      details: [
        "The system prompt sits at the very top of the context. It sets the role, goals, constraints, guidance on when to use which tool, and the output format. Use it for behaviour that applies to every task: a fixed answer format, the tone, and when to hand a case over to a person. For agents it is one part of [[context|context engineering]].",
        "Prompt engineering, the craft of writing prompts, still matters. Be clear and specific, give examples, structure the prompt with headings or tags (labelled sections), and explain why a rule exists: current models generalise from reasons better than from rules. Aim for the middle: neither rigid if-then rules for every case nor vague platitudes. Use examples sparingly and vary them, so the model does not copy one pattern. Skip the shouting: current models over-react to “CRITICAL” and “MUST”, and plain, explained instructions work better.",
        "Keep the system prompt stable so it can be cached and reused cheaply, keep it in version control (a record of every change) and test changes with [[evals]]. Avoid enormous prompts full of edge cases: move procedures into [[skills]] and facts into retrieval ([[knowledge]]). Rules that must never be broken belong in code, in [[hooks]] and [[permissions]]: prompts suggest, code enforces."
      ],
      includes: []
    },
    related: ["context", "instructions", "skills"],
    from: ["system-prompt"]
  },

  /* ---- Chapter 3: knives, pots and one plug ---- */
  "tools": {
    chapter: "tools", name: "Tools", label: "Tools",
    kitchen: "Knives, pots and an oven: they turn the chef's talk into cooking.",
    short: "A tool is something the model can ask to have done, such as a web search or a new row in a spreadsheet.",
    how: [
      "The model writes a structured request: which tool, with which inputs. The harness, the software around the model, runs the tool and puts the result into the context. Tools can search, handle files, run code or work inside other apps. As a last resort, computer use lets the model click and type on a screen like a person, but slower and less reliably."
    ],
    example: "A flight search returns today's real prices; a spreadsheet tool writes the cheapest three into your travel sheet.",
    forYou: [
      "An assistant is only as useful as its tools: without search, it can only guess prices.",
      "Know what each tool may change: a sent email or a payment cannot be undone."
    ],
    deeper: {
      details: [
        "Each tool is described to the model by a name, a description and a JSON Schema, a formal description of its inputs. The model replies with a structured tool call (also called function calling): the tool's name plus its inputs. The harness runs the code and returns the result as a new message; the model never executes anything itself. Tools come built in (a command line, file editing, web search, code execution), from [[mcp|MCP servers]] or from your own code.",
        "Tool design is user-experience design for models: clear names, a focused purpose, helpful error messages and short, useful output. Use tools for live data, for changing things and for exact work such as arithmetic. Avoid dozens of overlapping tools, which confuse the model and fill the context; design tools around tasks, not one per function of another service's API (its interface for programs). Current practice: fewer, more capable tools; tool search, which loads definitions only when needed; programmatic tool calling, where the model writes code that calls the tools so intermediate data stays out of the context; and strict schemas for reliable inputs.",
        "Computer use means the model looks at screenshots and replies with clicks, typing and scrolling; browser agents do the same inside a web browser. This reaches old applications and ordinary websites, but it is slower, costlier and more fragile than an API, and web pages are a major route for [[security|prompt injection]]. Prefer APIs and MCP, then the page structure, then full-screen control. Require confirmation for purchases, logins and messages, and run it in a [[sandbox]] or a separate browser profile."
      ],
      includes: [
        { name: "Computer & browser use", text: "The model looks at the screen and clicks, types and scrolls like a person, to use software or websites that offer no other way in." }
      ]
    },
    related: ["mcp", "agent-loop", "permissions", "sandbox"],
    from: ["tools", "computer-use"]
  },

  "mcp": {
    chapter: "tools", name: "MCP (Model Context Protocol)", label: "MCP",
    kitchen: "The standard plug: any appliance built with it works in any kitchen that has the socket.",
    short: "MCP, the Model Context Protocol, is an open standard for connecting AI apps to other software.",
    how: [
      "Anthropic, the company behind Claude, introduced MCP in November 2024. Since December 2025 it has been governed by the Agentic AI Foundation, part of the non-profit Linux Foundation. A company builds one MCP server, a program that offers its tools, data and ready-made prompts. Every app that supports MCP can then use it. Many apps call such servers connectors. Each server gets access to your accounts, so you must trust whoever made it."
    ],
    example: "The assistant opens your travel sheet through a connector: the spreadsheet maker's MCP server.",
    forYou: [
      "In AI apps, look for “connectors” or “integrations”; many of them are MCP servers.",
      "Install only connectors from makers you trust, with only the access they need."
    ],
    deeper: {
      details: [
        "MCP defines how a host (the app running the agent, see [[harness]]) connects, through MCP clients (the part of the host that talks to one server), to MCP servers. Servers offer **tools** (actions), **resources** (data) and **prompts** (templates). They run on your own computer or remotely over the web (HTTP), with access granted through OAuth, the standard behind “allow this app access” screens.",
        "Since its launch, MCP has been adopted across the industry. The current revision (2026-07-28) simplified the core so that a server no longer has to remember each client between requests, which lets remote servers spread across many machines. It moved optional features, such as long-running tasks and interactive interfaces (MCP Apps), into formal extensions.",
        "Use MCP for integrations many agents can reuse (GitHub, Jira, Slack, databases, internal systems) and to make your own product usable by AI agents. Do not load many servers with hundreds of tools into every chat or job: use tool search, or code execution with MCP, where tools appear as code so large intermediate results never enter the context. Treat every server as untrusted code that holds your credentials (logins and keys): check who publishes it and what access it asks for, stay on a version you have checked, review changes to its tool descriptions, and use OAuth 2.1 with per-user, least-privilege scopes, so each user grants only the access the task needs."
      ],
      includes: []
    },
    related: ["tools", "security", "harness"],
    from: ["mcp"]
  },

  /* ---- Chapter 4: taste, adjust, taste again ---- */
  "agent-loop": {
    chapter: "loop", name: "Agent loop", label: "Agent loop",
    kitchen: "The chef cooks, tastes and adjusts, again and again, until the dish is right.",
    short: "The cycle that turns a model into an agent: look, act, see the result, repeat.",
    how: [
      "The model looks at its context and picks a tool to use. The harness (the app around the model) runs it and adds the result. The model looks again, until it reaches the goal and answers, or hits a limit on steps, time or money.",
      "On long jobs, agents keep a to-do list. They should also check their work, by running tests or reading results back, because errors add up: if each step goes right 95% of the time, a 10-step job goes right only about 60% of the time."
    ],
    example: "It searches flights, finds May 3 fully booked, tries nearby days, fills your travel sheet and reads it back.",
    forYou: [
      "Say what “done” looks like.",
      "Ask the agent to check its work."
    ],
    deeper: {
      details: [
        "Research introduced the loop as ReAct (reasoning plus acting). On each turn the model either answers or asks for a tool call; the harness runs the tool and appends the result, called the observation. The loop ends with a final answer, a stop [[hooks|hook]], a person interrupting, or a budget for turns, tokens, time or money running out. Current models think between tool calls and can make several calls in one turn.",
        "Agents plan explicitly (a written plan a person approves) or implicitly (choosing the next step each turn). Many harnesses offer plan mode: read-only exploring that ends in a plan you review before anything changes. A to-do list keeps long tasks on track and survives when older steps are summarised ([[memory|compaction]]). Skip plans for small tasks, and update them when reality changes.",
        "Agents become more reliable with ground-truth feedback, outside checks that show what actually happened: compilers, tests, linters (automatic style and error checkers), a screenshot of the result, a schema check, or a second model reviewing against explicit criteria. Models cannot reliably correct their own reasoning without such a signal, so avoid self-review in the same context. Do not let the agent edit tests to make them pass; protect them with [[hooks]] or [[permissions]].",
        "Use the loop for open-ended tasks whose steps cannot be known in advance, and a fixed [[team|workflow]] where a fixed sequence would do. Always set stop conditions and budgets: clear, checkable goals make the loop converge; vague goals make it wander."
      ],
      includes: [
        { name: "Planning & task lists", text: "Breaking a goal into steps before acting, and keeping a visible to-do list while working." },
        { name: "Verification & self-correction", text: "Giving the agent a way to check its own work, with tests, screenshots or a reviewer, and to fix what fails." }
      ]
    },
    related: ["harness", "tools", "reasoning", "evals"],
    from: ["agent-loop", "planning", "verification"]
  },

  "harness": {
    chapter: "loop", name: "Harness (the agent app)", label: "Harness",
    kitchen: "The kitchen around the chef: it lays out the counter, runs the appliances and enforces the rules.",
    short: "The harness is the app around the model: it runs the agent loop and does what the model cannot.",
    how: [
      "The model only writes text. The harness runs the loop, builds the context, runs the tools the model asks for, enforces permissions (what the agent may do alone and what needs your OK) and keeps track of progress. You meet harnesses in chat apps, code editors, terminals (text windows for commands), browsers and team chat. The same model behaves differently in different harnesses."
    ],
    example: "The travel app is the harness: it runs the searches and holds the booking until you say OK.",
    forYou: [
      "Pick the harness for the job: a chat app for questions, a coding agent for software, a browser agent for websites.",
      "To compare models fairly, try them in the same app."
    ],
    deeper: {
      details: [
        "The model only predicts tokens; the harness does everything else. It builds each request (system prompt, instruction files, tool definitions, history), calls the model, reads its tool calls, runs them in a [[sandbox]] or through [[mcp|MCP]], feeds the results back, compacts the context when it fills up, enforces [[permissions]] and [[hooks]], starts sub-agents and saves checkpoints.",
        "Harness quality is a large part of agent quality: the same model scores very differently in different harnesses, so keep one constant when you compare the other. Harness engineering shapes the environment (tools, documentation, fast tests, guardrails) so agents can do reliable work. Customise an existing harness through instruction files, [[skills]], MCP servers, hooks and permissions rather than forking it (copying and changing its code).",
        "A surface is where people meet the harness: a chat app, an IDE (a code editor), a terminal, a desktop app, a browser, team chat or an API in your own product. It shapes what the agent sees (the open file, the current page), how it asks for approval and how results appear. Good surfaces show actions, sources and costs. Every page a browser agent reads can carry a [[security|prompt injection]].",
        "To put an agent into your own product, use an agent SDK (a code library with the loop, tool calls, state and tracing built in) or a managed runtime that also hosts it. For simple cases, a direct API call and a short loop is often clearer, and open protocols such as MCP reduce lock-in."
      ],
      includes: [
        { name: "Surfaces & interfaces", text: "Where people meet the agent: chat apps, IDEs, terminals, desktop apps, browsers, team chat or an API." },
        { name: "Agent SDKs & frameworks", text: "Code libraries for building agents and harnesses, with the loop, tool calls and tracing built in." }
      ]
    },
    related: ["agent-loop", "context", "permissions", "model"],
    from: ["harness", "surfaces", "sdk"]
  },

  /* ---- Chapter 5: recipe cards and a notebook ---- */
  "instructions": {
    chapter: "recipes", name: "Instruction files", label: "Instruction files",
    kitchen: "House rules on the kitchen wall, read again before every shift.",
    short: "Instruction files hold standing rules in plain text. The harness puts them in the context at the start of every new chat or job.",
    how: [
      "They are written in Markdown, plain text with a little formatting for headings and lists. Agents that write code read files such as AGENTS.md or CLAUDE.md; chat apps offer the same idea as custom instructions. Typical contents are house rules, how a project is organised and your preferences. They sit in the context on every request, so every line takes up room: keep them short."
    ],
    example: "A house rule says “aisle seat, and no airlines that charge for cabin bags”, so searches take it into account without you repeating it.",
    forYou: [
      "Write down the rules you keep repeating, in a few short lines.",
      "When the agent makes the same mistake twice, add one precise line."
    ],
    deeper: {
      details: [
        "Instruction files are a standing briefing: how to build and test, conventions, a map of the project, what to avoid. AGENTS.md is the open format shared across agent apps, now stewarded by the Agentic AI Foundation under the Linux Foundation. Many harnesses also read their own file, such as `CLAUDE.md`, `GEMINI.md`, Cursor rules or Copilot instructions.",
        "Files can be layered: a global file for personal preferences, a project file the team shares in its code repository, and files in sub-folders for local rules. They load at the start of every chat or job, so every line costs context on every turn.",
        "Keep them short and specific; models skim past long or auto-generated files. Put task-specific procedures into [[skills]], which load only when needed, and link to documentation instead of pasting it in. Treat the file like code: review it, prune it and test whether it actually changes behaviour.",
        "Measure the effect. A 2026 study found that generic overviews of a repository add cost without improving results, while precise instructions are followed."
      ],
      includes: []
    },
    related: ["prompt", "skills", "memory"],
    from: ["instructions"]
  },

  "skills": {
    chapter: "recipes", name: "Skills & saved prompts", label: "Skills",
    kitchen: "Recipe cards in a box: the chef takes one out only when a dish needs it.",
    short: "A skill is written know-how for one kind of task. The agent loads it only when that task comes up.",
    how: [
      "A skill is a folder with a SKILL.md file: step-by-step instructions in plain text, sometimes with small programs the agent can run. Until a task needs it, only its name and a one-line description sit in the context, so even many skills take little room. Since December 2025 the format has been an open standard that many apps support. You can often start one by name, like a saved prompt."
    ],
    example: "A skill explains how to compare total prices including bags. It loads only when the agent compares flights.",
    forYou: [
      "Turn a procedure you repeat into a skill, and say when to use it.",
      "Install skills only from sources you trust: they can contain code."
    ],
    deeper: {
      details: [
        "A skill packages procedural know-how: a `SKILL.md` file with a name and a description in its header plus Markdown instructions, and optionally scripts, templates and reference files. At the start of a chat or job only each skill's name and description sit in the context, a few dozen tokens each. When a task matches, the model reads the full `SKILL.md`, and only then the extra files it needs. This is called progressive disclosure.",
        "Anthropic introduced skills in October 2025 and published the format as an open standard in December 2025. By October 2026 more than 40 products support it, including Codex, GitHub Copilot, VS Code, Cursor and Gemini CLI.",
        "Use skills for repeatable procedures, for company conventions too large for the [[instructions|instruction file]], and for helper scripts, so the agent runs tested code instead of writing it from scratch. Write the description for triggering (“Use when…”), because it decides whether the skill loads. Keep `SKILL.md` focused, move details into referenced files, keep skills in version control and test them with [[evals]].",
        "Read skills from untrusted sources before installing them, since they can contain code. Turn successful work and existing procedures into skills, and share them through plugins."
      ],
      includes: [
        { name: "Playbooks & runbooks", text: "A written, step-by-step procedure for a recurring task, with checks and a definition of done. Best stored as a skill." },
        { name: "Slash commands & prompt templates", text: "Saved prompts you start by name, such as /review. In 2026 most harnesses folded them into skills." },
        { name: "Plugins & extensions", text: "Installable bundles of skills, commands, sub-agents, hooks and MCP servers, so a whole setup can be shared with one install. They can run code with your permissions, so install only ones you trust." }
      ]
    },
    related: ["instructions", "tools", "team"],
    from: ["skills", "playbooks", "commands", "plugins"]
  },

  "knowledge": {
    chapter: "recipes", name: "Looking things up (search & RAG)", label: "Looking things up",
    kitchen: "A library next door: when the chef lacks a fact, it is looked up, not guessed.",
    short: "Looking things up gives the agent facts it was never trained on, from the web, your files or a company knowledge base.",
    how: [
      "Often the agent simply searches the web or your files, as you would, and tries better search words if the first ones fail. RAG (retrieval-augmented generation) is used for large document collections: before the model answers, a search fetches the best-matching passages and adds them to the context. That search often uses embeddings, lists of numbers that capture meaning, so texts with similar meaning are found even when the words differ."
    ],
    example: "The agent looks up the airline's baggage rules and checks your company's travel policy before it suggests a flight.",
    forYou: [
      "Ask for sources, and open one or two to check them.",
      "Answers are only as good as the documents behind them."
    ],
    deeper: {
      details: [
        "RAG grounds the model in your own data without retraining it. The classic pipeline splits documents into chunks, turns each chunk into an embedding and stores them in an index. At question time it retrieves the best-matching chunks, ideally combining meaning and keyword search and then reranking (sorting the hits again), and adds them to the prompt with their sources. In agents, retrieval becomes a tool the model calls as often as it needs (agentic RAG).",
        "An embedding is a vector of hundreds to thousands of numbers; similar meanings land close together, and vector databases search millions of them quickly. Embeddings often miss exact identifiers such as product codes or error numbers, so pair them with keyword search such as BM25 (hybrid search), and never mix embeddings from different models in one index.",
        "In agentic search the model uses ordinary tools (listing files, grep for text search, reading files, web search, fetching pages) and refines its queries as it learns. Coding agents often prefer it to an index: it is always up to date, exact for names and needs no indexing pipeline. Deep research runs long searches, often with several agents in parallel, and writes a report.",
        "Use RAG for large, private or changing collections and for answers that need citations, not for collections that fit in the context. Measure whether the right passages come back, check the citations, and keep untrusted pages away from a chat or job that also holds sensitive access ([[security]])."
      ],
      includes: [
        { name: "Retrieval-augmented generation (RAG)", text: "Looking up relevant passages in your knowledge base and putting them into the context before the model answers." },
        { name: "Embeddings & vector search", text: "Lists of numbers that capture meaning, so texts can be searched by meaning instead of exact words." },
        { name: "Agentic search & web search", text: "The agent searches files and the web itself with ordinary tools, refining its queries as it goes, instead of using a pre-built index." }
      ]
    },
    related: ["context", "memory", "tools", "mcp"],
    from: ["rag", "embeddings", "search"]
  },

  "memory": {
    chapter: "recipes", name: "Memory & compaction", label: "Memory",
    kitchen: "The chef's notebook keeps what should not be forgotten, and old scraps are cleared off the counter to make room.",
    short: "The model remembers nothing between requests, so memory means notes kept outside the context and loaded again when needed.",
    how: [
      "Memory holds things like your preferences, decisions already made and progress on a long job. The harness saves these notes in files or a database and puts the relevant ones back into the context in a later chat or job. Compaction solves a different problem: on a long job the context fills up, so the harness summarises or removes older steps and keeps the latest ones word for word."
    ],
    example: "Next time, the agent remembers your home airport. On a long job, thirty flight searches shrink to one line each.",
    forYou: [
      "Check what your assistant remembers about you, and delete what it should not keep."
    ],
    deeper: {
      details: [
        "Inside a run, the context window is short-term memory. Long-term memory lives outside it and is loaded when relevant: files the agent reads and writes (notes, progress logs, [[instructions|instruction files]]), memory tools and stores, or vector and graph databases. Research borrowed three kinds from cognitive science: episodic (what happened), semantic (facts) and procedural (how to do things, in practice instruction files and [[skills]]).",
        "File-based memory, such as Markdown notes, progress logs and git history, is simple, transparent and works across harnesses; memory tools in APIs let the agent create, read and update its own memory files. Do not remember everything: stale or wrong memories mislead the agent. Store personal data only with consent, retention rules and a way to delete it, and make memory visible and editable.",
        "Compaction replaces older history with a summary (decisions made, open problems, files touched) and keeps recent turns word for word. Context editing removes stale items automatically, such as old tool results. Some harnesses compact automatically near the limit, others on command, and APIs offer it on the server side.",
        "Poor compaction makes the agent forget decisions or redo work. Keep error details it still needs, let users say what to keep, and pair compaction with a progress file and version control, so a fresh context can pick up where the old one stopped."
      ],
      includes: [
        { name: "Compaction & context editing", text: "When the context fills up, the harness summarises older steps or removes stale ones so the agent can keep working." }
      ]
    },
    related: ["context", "instructions", "knowledge"],
    from: ["memory", "compaction"]
  }
};
