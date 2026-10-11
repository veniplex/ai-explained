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
  }
};
