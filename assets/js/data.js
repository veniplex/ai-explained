/* Agentic AI, Explained: all page content.
   Edit this file to change text, add building blocks or update sources; no build step is needed.
   Inline markup in strings: `code`, **bold**, [[block-id]] or [[block-id|label]] for links to other blocks. */
window.AE = (function () {
  "use strict";

  var meta = {
    updated: "2026-10-11",
    snapshot: "October 2026",
    repo: "https://github.com/veniplex/ai-explained"
  };

  /* ---------------------------------------------------------------------------
     Zones: the regions of the map. "blocks" sets the order of chips inside a zone.
     ------------------------------------------------------------------------- */
  var zones = [
    { id: "start", name: "Start & finish", nick: "orders in, dishes out", eli5: "Every job starts with an order and ends with a dish served. This is where work comes in and where results go out.", short: "Start & finish", tag: "Where work comes in and where results go out.", blocks: ["triggers", "surfaces"] },
    { id: "model", name: "Model layer", nick: "the chef's brain", eli5: "The thinking part. It reads what is on the counter, thinks, and decides the next move. The provider is the agency you hire it through.", short: "Model", tag: "The reasoning engine, and who serves it to you.", blocks: ["model", "reasoning", "context-window", "provider", "fine-tuning"] },
    { id: "harness", name: "Harness", nick: "the kitchen", eli5: "Everything around the chef. It lays out the counter, runs the cook, taste and adjust loop, uses the tools and keeps notes.", short: "Harness", tag: "The agent runtime. It runs the loop, assembles the context, executes tools and keeps state.",
      groups: [
        { name: "Loop & runtime", blocks: ["harness", "agent-loop", "planning", "sdk"] },
        { name: "Context assembly", blocks: ["system-prompt", "instructions", "context-engineering", "compaction", "memory"] }
      ] },
    { id: "control", name: "Control layer", nick: "locks and alarms", eli5: "Rules the kitchen enforces whatever the chef thinks: keys for the cupboards, alarms that always ring, checks at the pass, and a person's nod for risky moves.", short: "Control", tag: "Checks every action before and after it runs. Part of the harness.", blocks: ["permissions", "hooks", "guardrails", "hitl", "security"] },
    { id: "know", name: "Know-how & knowledge", nick: "cookbooks and recipe cards", eli5: "What the kitchen knows: house rules, recipe cards, checklists and a library to look things up. Each is brought to the counter only when it is needed.", short: "Know-how", tag: "What gets loaded into the context, and when.", blocks: ["skills", "playbooks", "commands", "plugins", "rag", "embeddings", "search"] },
    { id: "tools", name: "Tools & environment", nick: "knives, pots and the oven", eli5: "Everything the chef can act with, one standard plug for new appliances, and a safe test kitchen to use them in.", short: "Tools", tag: "What the agent can do, and where it does it.", blocks: ["tools", "mcp", "sandbox", "computer-use"] },
    { id: "orch", name: "Orchestration", nick: "the kitchen brigade", eli5: "How big orders are split: assembly lines, helpers, whole teams of cooks, other restaurants, and the night shift.", short: "Orchestration", tag: "How work is split across calls, agents and time.", blocks: ["workflows", "subagents", "multi-agent", "a2a", "long-running", "verification"] },
    { id: "ops", name: "Operations", nick: "critics, cameras and the bill", eli5: "Watching from the outside: scoring the food, recording every step, counting the cost and following the health code.", short: "Operations", tag: "Measure, observe, budget and govern everything above.", blocks: ["evals", "observability", "cost", "governance"] }
  ];

  var connectors = [
    { id: "c-task", vertical: true, dir: "both", label: "task in · result out", from: "start", to: "harness",
      text: "A person or a system hands the harness a task. The final answer, file or pull request goes back out through a surface, and anything irreversible waits for a person.",
      eli5: "The order ticket comes in; the finished dish goes out." },
    { id: "c-api", dir: "both", label: "API call", sub: "context in, reply out", from: "harness", to: "model",
      text: "The harness calls the model through the provider's API: the full context goes in, a reply or a tool call comes out. The model keeps no state between calls.",
      eli5: "The kitchen shows the chef the whole counter; the chef says what to do next." },
    { id: "c-ctx", dir: "right", label: "into context", sub: "always, on demand, retrieved", from: "know", to: "harness",
      text: "Know-how enters the context only when it is needed: a skill when its description matches the task, a command or playbook when someone invokes it, and documents when RAG or search retrieves them.",
      eli5: "Recipe cards and library pages are brought to the counter when they are needed." },
    { id: "c-tool", dir: "both", label: "tool call", sub: "call out, result in", from: "harness", to: "tools",
      text: "The model asks for an action; the harness checks it, runs the tool and appends the result to the context.",
      eli5: "The chef asks for a tool to be used; the result comes back to the counter." },
    { id: "c-dele", dir: "both", label: "delegate", sub: "task out, summary in", from: "harness", to: "orch",
      text: "The harness hands tasks to workflows, sub-agents or other agents. They work in their own context and return condensed results.",
      eli5: "The chef hands a sub-task to a helper and gets back one finished bowl." },
    { id: "c-ops", vertical: true, dir: "both", label: "traces out · fixes in", from: "harness", to: "ops",
      text: "Operations watch every run: traces, scores and costs go out; better instructions, skills, tools and limits come back.",
      eli5: "Critics and cameras watch the kitchen; their notes make it better." }
  ];

  /* ---------------------------------------------------------------------------
     Building blocks. Fields:
       name, label (short chip label), aka (search synonyms), short (one sentence),
       eli5 (the kitchen picture, shown first), what (paragraphs), when, avoid, sota (current practice), examples,
       related, links (filled from SOURCES below), facts (dated status notes).
     ------------------------------------------------------------------------- */
  var blocks = {

    /* ---- Start & finish ---- */
    "triggers": {
      name: "Triggers & events", label: "Triggers & events",
      aka: ["schedule", "cron", "webhook", "event", "ci", "github actions", "slack", "background", "automation"],
      short: "What starts a run: a person's message, a schedule, a webhook, a failing build, a new ticket or an email.",
      eli5: "The order bell. A guest orders, a timer rings or a delivery arrives, and the kitchen starts cooking. Some orders come from people, others from a clock or another machine.",
      what: [
        "Every run begins with a trigger. Interactive triggers come from a person: a chat message, a command in the IDE or terminal, a mention in team chat. Automated triggers come from systems: a cron schedule, a webhook (new ticket, new pull request), a CI event (failing build), a file landing in storage, or another agent.",
        "The trigger decides what the run starts with (the issue text, the error log, the email) and whether a human is watching. Unattended triggers therefore need tighter permissions, budgets and sandboxing than interactive ones."
      ],
      when: [
        "Interactive work where a person steers: chat, IDE, terminal.",
        "Recurring jobs: daily reports, dependency updates, inbox triage (schedules).",
        "Event-driven work: an issue gets a label and the agent opens a pull request; CI fails and the agent proposes a fix."
      ],
      avoid: [
        "Unattended triggers on untrusted input (public issues, inbound email) without a sandbox and strict permissions. See [[security]].",
        "Runs without limits. Cap turns, time and spend for every unattended trigger."
      ],
      sota: [
        "Agents are first-class participants in CI, issue trackers and team chat: you assign an issue or mention the agent, and it reports back with a pull request or a document.",
        "Background agents in cloud sandboxes pick up work asynchronously, so several tasks run in parallel. See [[long-running]].",
        "Pass the event payload as structured context, plus a link back so people can follow the run."
      ],
      examples: ["Claude Code GitHub Actions and routines", "OpenAI Codex GitHub Action and Codex in Slack", "GitHub Copilot cloud agent (assign an issue)", "ChatGPT scheduled tasks", "Claude in Slack", "Webhooks from n8n, Zapier or your own backend"],
      related: ["surfaces", "long-running", "hitl", "security"]
    },

    "surfaces": {
      name: "Surfaces & interfaces", label: "Surfaces & interfaces",
      aka: ["ui", "chat", "ide", "cli", "terminal", "desktop", "browser", "slack", "generative ui", "ag-ui", "mcp apps", "agent client protocol", "acp"],
      short: "Where people meet the agent: chat apps, IDEs, terminals, desktop apps, browsers, team chat or an API. Also where results land.",
      eli5: "Where the food is served: the dining room, the takeaway window, the delivery app. One kitchen can cook for all of them at once.",
      what: [
        "A surface is the user interface around a harness. The same agent can appear in a chat app, an IDE panel, a terminal, a desktop app, an agentic browser, team chat, or behind an API in your own product.",
        "Surfaces shape what the agent can see (the open file, the current web page, a selection), how it asks for approval, and how results are shown: diffs, documents, previews or interactive UI. Open protocols now connect surfaces and agents: the Agent Client Protocol (editors and coding agents), AG-UI (agent back ends and app front ends) and MCP Apps (interactive UI inside chat)."
      ],
      when: [
        "Choose the surface where the work already happens: the IDE for code, team chat for requests, documents for writing.",
        "Use an API or SDK to embed an agent in your own product.",
        "Use interactive UI (forms, previews, approvals) when free text is a poor fit."
      ],
      avoid: [
        "Building a custom interface before the workflow is proven. Start in an existing harness.",
        "Hiding what the agent did. Good surfaces show actions, diffs, sources and costs."
      ],
      sota: [
        "One agent, many surfaces: terminal, IDE, desktop, web and mobile share sessions and settings.",
        "Generative and interactive UI lets agents return forms, charts and mini-apps instead of walls of text.",
        "Browser agents are consolidating into existing browsers and desktop apps (Claude in Chrome, Gemini in Chrome, the ChatGPT desktop app). Every page they read is a potential prompt-injection channel."
      ],
      examples: ["Claude apps, Cowork and Claude Code", "ChatGPT desktop app (Chat, Work, Codex)", "Gemini app and Antigravity", "VS Code with GitHub Copilot", "Cursor", "JetBrains IDEs", "Zed", "Claude in Chrome and Gemini in Chrome", "Perplexity Comet", "Slack and Teams"],
      related: ["triggers", "hitl", "harness", "computer-use"]
    },

    /* ---- Model layer ---- */
    "model": {
      name: "Foundation model (LLM)", label: "Foundation model",
      aka: ["llm", "large language model", "gpt", "claude", "gemini", "llama", "transformer", "open weights", "frontier model", "slm"],
      short: "The neural network that turns input tokens into output tokens. It reasons, writes and decides which tool to call, but it only sees what is in its context.",
      eli5: "The chef's brain. It has read millions of recipes and decides what to do next. But it remembers nothing from yesterday and only knows what is on the counter right now.",
      what: [
        "A large language model is a transformer network trained on huge amounts of text, code and often images and audio to predict the next token. Post-training (instruction tuning, reinforcement learning from human and AI feedback) then teaches it to follow instructions, use tools and behave safely.",
        "In an agent, the model is the decision-maker. On every turn it reads the full context and replies with text or with a structured tool call. Models differ in capability, speed, price, context length, modalities and licence: closed models are used through an API, open-weight models can also be run on your own hardware."
      ],
      when: [
        "Frontier models for planning, hard reasoning, ambiguous tasks and long agentic runs.",
        "Small, fast models for classification, routing, extraction, simple sub-agent jobs and high volume.",
        "Open-weight models when you need on-premises deployment, full control over data, or fine-tuning."
      ],
      avoid: [
        "Choosing by public leaderboards alone. Shortlist with benchmarks, decide with your own [[evals]].",
        "Treating the model as a database of facts. Ground it with [[rag|retrieval]], [[search]] or [[tools]]."
      ],
      sota: [
        "Mix models by role: a strong model plans and orchestrates, cheaper models execute well-defined sub-tasks.",
        "For agents, agentic benchmarks (software engineering, terminal use, tool use, computer use) say more than chat scores.",
        "Current frontier models are trained specifically for tool use, long-horizon tasks and computer use, and ship with effort controls.",
        "Every major lab ships a tiered family (flagship, balanced, small and fast). Establish quality with the strongest model, then step down wherever your evals allow."
      ],
      examples: ["Anthropic Claude (Fable, Opus, Sonnet, Haiku)", "OpenAI GPT (Astra, Sol, Luna) and open-weight gpt-oss", "Google Gemini and open-weight Gemma", "Meta Muse and Llama", "Mistral", "DeepSeek", "Alibaba Qwen", "Moonshot Kimi", "Zhipu GLM", "Grok"],
      related: ["reasoning", "context-window", "provider", "fine-tuning"]
    },

    "reasoning": {
      name: "Reasoning & thinking", label: "Reasoning & thinking",
      aka: ["thinking", "extended thinking", "chain of thought", "cot", "test-time compute", "effort", "reasoning model", "o-series", "budget"],
      short: "Models that think before they answer by spending extra tokens on step-by-step reasoning. You trade cost and latency for accuracy.",
      eli5: "The chef stops to think before cooking. An easy dish needs a moment; a tricky new one needs a long think. Thinking takes time, but fewer dishes get burnt.",
      what: [
        "Reasoning models are trained with reinforcement learning to produce a chain of thought before the final answer. Spending more compute at inference time (test-time compute) reliably improves results on maths, coding and multi-step problems.",
        "Most APIs now expose an effort or thinking level (for example from low to max) rather than a raw token budget. Thinking tokens are billed as output even when they are hidden. In agents, models also think between tool calls (interleaved thinking), which helps them reflect on a surprising result before choosing the next action."
      ],
      when: [
        "Planning, debugging, maths, complex trade-offs and multi-step decisions.",
        "After surprising tool results, so the model reflects before acting.",
        "Lower effort for simple, latency-sensitive steps such as routing or extraction."
      ],
      avoid: [
        "Maximum effort everywhere: slower, more expensive, and sometimes worse on simple tasks.",
        "Treating the visible reasoning as a faithful record of how the model reached its answer. Research shows it often is not."
      ],
      sota: [
        "Adaptive thinking: the model decides how long to think, within an effort level you set per task.",
        "Reasoning models need fewer step-by-step instructions. Give clear goals, context and success criteria instead.",
        "Tune effort per step of a workflow, as you would choose a model per step."
      ],
      examples: ["Claude adaptive thinking with effort levels", "OpenAI reasoning effort", "Gemini thinking levels", "DeepSeek-R1 (open weights)", "Qwen and Kimi thinking modes"],
      related: ["model", "planning", "cost", "agent-loop"]
    },

    "context-window": {
      name: "Context window & tokens", label: "Context window",
      aka: ["tokens", "tokenizer", "context length", "stateless", "working memory", "context rot", "lost in the middle", "1m context"],
      short: "The model's working memory, measured in tokens. Everything the agent knows in the moment must fit here, and the API is stateless.",
      eli5: "The counter. Everything the chef needs must be on it, and it has a fixed size. A cluttered counter makes even a great chef slow and sloppy.",
      what: [
        "Models read and write tokens, which are pieces of words (in English roughly three quarters of a word each). The context window is the maximum number of tokens one request can hold, including the reply. In 2026 about one million tokens is standard for frontier models; many smaller and older models offer 128,000 to 200,000.",
        "Model APIs are **stateless**: on every turn the harness sends the entire conversation again, including the system prompt, tool definitions, history and tool results. Longer contexts cost more, run slower and degrade quality, an effect researchers call “lost in the middle” and “context rot”. A bigger window is not automatically better."
      ],
      when: [
        "Budget the context like memory: stable content first (so it can be cached), changing content last.",
        "Use long context for whole-document analysis; use retrieval for large or changing collections."
      ],
      avoid: [
        "Dumping whole repositories, inboxes or logs into the context.",
        "Assuming the model remembers earlier sessions. It does not, unless the harness re-sends that information. See [[memory]]."
      ],
      sota: [
        "Manage the window actively with [[context-engineering]], [[compaction]], [[subagents]] and memory files.",
        "Prompt caching makes the repeated prefix cheap and fast. See [[cost]].",
        "Harnesses show a context meter and can clear old tool results automatically."
      ],
      examples: ["Token counters in SDKs", "Context meters in coding agents", "Long-context models with 1M-token windows"],
      related: ["context-engineering", "compaction", "memory", "cost"]
    },

    "provider": {
      name: "Providers & inference platforms", label: "Providers & platforms",
      aka: ["api", "inference", "anthropic", "openai", "google", "bedrock", "vertex", "azure", "foundry", "openrouter", "litellm", "ollama", "vllm", "hosting", "gateway", "router", "eu", "data residency"],
      short: "Who runs the model for you: the lab's own API, a cloud platform, a host for open models, or your own hardware.",
      eli5: "The agency that sends you the chef. You can book the same chef through different agencies, with different prices, opening hours and rules about where they may work.",
      what: [
        "A provider serves model inference over an API and handles scaling, rate limits, billing, data retention and regional hosting. The options are first-party APIs from the labs, hyperscaler platforms that offer many models with enterprise controls, specialised hosts for open-weight models, local runtimes, and gateways that put one API in front of many providers.",
        "The provider is invisible to the model but matters a lot to you: it determines which features arrive first, your data-protection terms, where data is processed (for example EU regions), and what happens during an outage."
      ],
      when: [
        "A first-party API to get new models and features first.",
        "A cloud platform when you need existing contracts, identity and access management, regional data residency and compliance tooling.",
        "Local or self-hosted inference for strict data control, offline use or experimentation.",
        "A gateway for fallbacks between providers, central cost tracking and switching models without code changes."
      ],
      avoid: [
        "Hard-wiring one provider into your code. Keep the model call behind a thin abstraction.",
        "Ignoring data-processing terms, retention settings and processing region when personal data is involved (GDPR)."
      ],
      sota: [
        "Multi-provider setups with automatic fallback are common for production agents.",
        "The same model can behave slightly differently across serving stacks; re-run your evals when you switch.",
        "EU customers choose explicit EU processing regions on cloud platforms, or EU-based providers. Global routing is cheaper but gives no residency guarantee.",
        "Compare candidates on Arena (human preference) and Artificial Analysis (quality, price, speed), then decide with your own evals."
      ],
      examples: ["Anthropic API", "OpenAI API", "Gemini API", "Amazon Bedrock", "Gemini Enterprise Agent Platform (formerly Vertex AI)", "Microsoft Foundry (formerly Azure AI Foundry)", "Mistral AI", "Hugging Face Inference Providers", "Together AI", "Fireworks AI", "Groq", "OpenRouter", "LiteLLM", "Ollama", "vLLM", "llama.cpp"],
      related: ["model", "cost", "governance", "security"]
    },

    "fine-tuning": {
      name: "Fine-tuning & post-training", label: "Fine-tuning",
      aka: ["training", "sft", "rlhf", "dpo", "lora", "qlora", "rft", "reinforcement fine-tuning", "distillation", "post-training", "alignment"],
      short: "Changing the model's weights with your own examples. The last lever to pull, after prompting, context and tools.",
      eli5: "Sending the chef to cooking school to master one cuisine. It costs time and money, and most of the time better recipe cards would have done the job.",
      what: [
        "Post-training turns a raw pre-trained model into a helpful assistant: supervised fine-tuning on examples, reinforcement learning from human feedback (RLHF) and from AI feedback (for example Constitutional AI). As a builder you can go further: supervised fine-tuning on your own examples, preference tuning (DPO), reinforcement fine-tuning against graders, or distillation from a large model into a small one.",
        "Parameter-efficient methods such as LoRA make fine-tuning open-weight models affordable. Fine-tuning teaches form, style and narrow skills. It is a poor way to add facts that change; use [[rag]] for those."
      ],
      when: [
        "A consistent format or style that prompting cannot achieve reliably.",
        "A narrow, high-volume task where a small tuned model can replace a large one, cutting cost and latency.",
        "Domain-specific tool-use behaviour, after evals show that prompting and context have plateaued."
      ],
      avoid: [
        "Fine-tuning to inject changing knowledge.",
        "Fine-tuning before you have [[evals]]: you cannot tell whether it helped.",
        "Locking yourself to an old model. A newer base model often beats your tuned old one."
      ],
      sota: [
        "Reinforcement fine-tuning with task-specific graders is used to teach agentic behaviour.",
        "Distil traces from a frontier model into a small model for high-volume routes.",
        "Most teams get further with better context, tools and skills than with fine-tuning.",
        "Self-serve fine-tuning of closed frontier models is shrinking in 2026; customisation is moving to cloud platforms and open-weight models."
      ],
      examples: ["Amazon Bedrock (supervised, reinforcement, distillation)", "Tuning on Gemini Enterprise Agent Platform", "Hugging Face TRL and PEFT (LoRA)", "Unsloth", "Fireworks AI and Together AI", "OpenAI fine-tuning API (winding down)"],
      related: ["model", "evals", "rag", "cost"]
    },

    /* ---- Harness: loop & runtime ---- */
    "harness": {
      name: "Harness (agent runtime)", label: "Harness",
      aka: ["runtime", "scaffold", "scaffolding", "agent framework", "claude code", "codex", "gemini cli", "cursor", "copilot", "devin", "openhands", "goose", "cline", "harness engineering", "coding agent"],
      short: "The software around the model that turns it into an agent. It runs the loop, assembles the context, executes tools, enforces permissions and manages memory.",
      eli5: "The kitchen around the chef. It hands over ingredients, runs the oven, enforces the rules and cleans up. A great chef in a bad kitchen still struggles.",
      what: [
        "The model only predicts tokens; the harness does everything else. It builds each request (system prompt, instruction files, tool definitions, history), calls the model, parses tool calls, runs them in a sandbox or through MCP, feeds the results back, compacts the context when it fills up, enforces permissions and hooks, spawns sub-agents, saves checkpoints and shows progress on a surface.",
        "Harness quality is a large part of agent quality: the same model scores very differently in different harnesses. **Harness engineering** is the practice of shaping this environment (tools, documentation, feedback loops, guardrails) so that agents can do reliable work."
      ],
      when: [
        "Use an existing harness (a coding agent or desktop agent) for software and knowledge work.",
        "Use an [[sdk|agent SDK]] when you need a harness inside your own product.",
        "Customise through instruction files, skills, MCP servers, hooks and permissions rather than by forking the harness."
      ],
      avoid: [
        "Writing your own loop from scratch for production unless you need full control.",
        "Comparing models without keeping the harness constant, or harnesses without keeping the model constant."
      ],
      sota: [
        "Mature harnesses ship plan mode, to-do lists, sub-agents, compaction, checkpoints and rewind, sandboxing, hooks, skills, MCP and background execution.",
        "Design the environment for the agent: fast tests, clear docs, linters and reproducible setups make agents dramatically more reliable.",
        "The same harness increasingly runs in the terminal, IDE, desktop, browser and cloud.",
        "Harnesses are becoming hosted services (Claude Managed Agents, the OpenAI Agents API), and agents now write task-specific harnesses themselves (dynamic workflows)."
      ],
      examples: ["Claude Code", "OpenAI Codex", "Google Antigravity and Antigravity CLI (successor to Gemini CLI)", "GitHub Copilot", "Cursor", "Devin and Devin Desktop", "OpenHands", "goose", "Cline", "Aider", "Amp", "Kiro", "Claude Managed Agents (hosted)", "OpenAI Agents API (hosted)"],
      related: ["agent-loop", "sdk", "context-engineering", "permissions", "sandbox"]
    },

    "agent-loop": {
      name: "Agent loop (think, act, observe)", label: "Agent loop",
      aka: ["react", "loop", "tool loop", "agentic loop", "turn", "reason act", "observation"],
      short: "The core cycle: the model reasons, calls a tool, reads the result, and repeats until the goal is met or a limit is reached.",
      eli5: "Taste, adjust, taste again. The chef cooks a little, checks the result and decides the next move, over and over, until the dish is right.",
      what: [
        "Research introduced the loop as ReAct (reasoning plus acting). It is simple: the model receives the context, then either answers or emits a tool call; the harness runs the tool and appends the result (the observation); repeat.",
        "The loop ends when the model gives a final answer, a stop hook ends it, a person interrupts, or a budget for turns, tokens, time or money runs out. Almost everything else in agentic AI is about giving this loop better context, better tools and better limits."
      ],
      when: [
        "Open-ended tasks where the number and order of steps cannot be known in advance.",
        "Tasks with feedback from the environment: test results, search hits, error messages."
      ],
      avoid: [
        "Loops without stop conditions or budgets.",
        "An agent loop where a fixed sequence would do. See [[workflows]]."
      ],
      sota: [
        "Interleaved thinking between tool calls, and several tool calls in parallel within one turn.",
        "Explicit termination criteria, maximum turns and spending limits.",
        "Clear, verifiable goals make the loop converge; vague goals make it wander."
      ],
      examples: ["The query loop in the Claude Agent SDK", "The Runner in the OpenAI Agents SDK", "ReAct agents in LangGraph", "smolagents CodeAgent"],
      related: ["harness", "tools", "reasoning", "verification"]
    },

    "planning": {
      name: "Planning & task lists", label: "Planning & to-dos",
      aka: ["plan mode", "todo", "to-do list", "task list", "decomposition", "spec", "tree of thoughts", "plan and solve"],
      short: "Breaking a goal into steps before acting, and keeping a visible to-do list while working.",
      eli5: "The prep list on the wall. Before a big order, the chef writes down every step and ticks them off, so nothing is forgotten halfway through.",
      what: [
        "Agents plan explicitly (write a plan and ask for approval) or implicitly (choose the next step each turn). Many harnesses offer a **plan mode**: read-only exploration that ends in a plan a person reviews before anything changes.",
        "During work, a to-do tool lets the agent keep and update a task list. This keeps long tasks on track, shows progress, and doubles as a record when the context is compacted. Research on task decomposition (Plan-and-Solve, Tree of Thoughts, ReWOO) shows that planning improves multi-step success."
      ],
      when: [
        "Non-trivial changes that touch many files or systems.",
        "When a person should agree on the approach before work starts.",
        "Long tasks, where the task list also serves as a progress log."
      ],
      avoid: [
        "Elaborate plans for small tasks.",
        "Plans that are never updated when reality changes."
      ],
      sota: [
        "Explore, plan, implement, verify: the default loop for coding agents.",
        "Write the plan or spec to a file so it survives context resets and can be reviewed.",
        "Let the agent ask clarifying questions while planning instead of guessing.",
        "Frontier models increasingly plan internally; some harnesses now make written to-do lists optional for them."
      ],
      examples: ["Plan mode in Claude Code, Cursor and others", "To-do tools in coding agents", "Spec files written before implementation"],
      related: ["reasoning", "hitl", "long-running", "memory"]
    },

    "sdk": {
      name: "Agent SDKs & frameworks", label: "Agent SDKs",
      aka: ["framework", "library", "langgraph", "langchain", "crewai", "autogen", "semantic kernel", "agent framework", "adk", "agents sdk", "claude agent sdk", "pydantic ai", "vercel ai sdk", "strands", "agentcore", "mastra", "smolagents", "llamaindex"],
      short: "Libraries for building agents and harnesses in code. The loop, tool calls, memory, multi-agent handoffs and tracing come built in.",
      eli5: "A kitchen in a box. The plumbing, stove and shelves come ready-made; you arrange them for the kind of food you want to cook.",
      what: [
        "When you build an agent into a product, an SDK saves you from rewriting the loop, tool execution, streaming, retries, state and tracing. Vendor SDKs are tuned to their own platforms but are often usable with other models. Open frameworks add graph-based control flow, typed outputs or a particular language ecosystem.",
        "Managed agent runtimes go one step further and host your agent with identity, memory, sandboxed tools and observability built in."
      ],
      when: [
        "You need an agent inside your own application or back end.",
        "You need durable state, human approval interrupts or custom orchestration graphs."
      ],
      avoid: [
        "Heavy abstractions for a simple use case. A direct API call plus a short loop is often clearer.",
        "Framework lock-in. Prefer open protocols at the edges ([[mcp]], [[a2a]], OpenTelemetry)."
      ],
      sota: [
        "The large vendors each offer an agent SDK; most support MCP, tracing and multi-agent patterns out of the box.",
        "Graph-based frameworks are popular for production workflows that need explicit control and persistence.",
        "Managed runtimes from cloud providers handle hosting, identity and memory."
      ],
      examples: ["Claude Agent SDK", "OpenAI Agents SDK", "Google Agent Development Kit (ADK 2)", "Microsoft Agent Framework (successor to Semantic Kernel and AutoGen)", "LangGraph and LangChain", "CrewAI", "LlamaIndex", "Pydantic AI", "Vercel AI SDK", "AWS Strands Agents", "Amazon Bedrock AgentCore", "Mastra", "Hugging Face smolagents"],
      related: ["harness", "agent-loop", "multi-agent", "observability"]
    },

    /* ---- Harness: context assembly ---- */
    "system-prompt": {
      name: "System prompt & prompt engineering", label: "System prompt",
      aka: ["prompt", "prompt engineering", "instructions", "role", "persona", "few-shot", "examples", "xml tags"],
      short: "The standing instructions that define the agent's role, rules, tone and output format. Written once by the builder, sent with every call.",
      eli5: "The chef's job description, read at the start of every shift: who we cook for, the house style, and what we never serve.",
      what: [
        "The system prompt sits at the very top of the context. It sets the role, goals, constraints, guidance on when to use which tool, and the output format.",
        "Prompt engineering still matters: be clear and specific, give examples, structure the prompt with headings or tags, and explain why a rule exists. For agents it is part of the broader [[context-engineering]]. Aim for the right altitude: neither brittle if-then logic nor vague platitudes."
      ],
      when: [
        "Behaviour that applies to every task this agent does.",
        "Output contracts, tone, and escalation rules."
      ],
      avoid: [
        "Enormous prompts full of edge cases. Move procedures into [[skills]] and facts into retrieval.",
        "Rules that must never be broken. Enforce those in code with [[hooks]] and [[permissions]]."
      ],
      sota: [
        "Keep it stable so it can be cached, keep it in version control, and test changes with evals.",
        "Explain the reason behind instructions; current models generalise from reasons better than from rules.",
        "Use examples sparingly and diversely so the model does not copy one pattern.",
        "Skip the shouting. Current models over-react to “CRITICAL” and “MUST”; plain, explained instructions work better."
      ],
      examples: ["Anthropic prompting best practices", "OpenAI prompting guide and Model Spec", "Google Gemini prompting strategies", "Prompt generators and improvers in developer consoles"],
      related: ["instructions", "context-engineering", "skills", "guardrails"]
    },

    "instructions": {
      name: "Instruction files (AGENTS.md and friends)", label: "Instruction files",
      aka: ["agents.md", "claude.md", "gemini.md", "rules", "cursor rules", "copilot instructions", "custom instructions", "project memory", "readme for agents"],
      short: "Plain Markdown files in your project or home folder that the harness loads automatically at session start: build commands, conventions, do's and don'ts.",
      eli5: "The house rules taped to the kitchen wall: where the pans are, how we plate, what not to touch. Every new cook reads them first.",
      what: [
        "Instruction files are a persistent briefing for the agent: how to build and test, coding conventions, architecture notes, where things live, what to avoid. **AGENTS.md** is the cross-tool open format, now stewarded by the Agentic AI Foundation under the Linux Foundation. Many harnesses also read their own file, such as `CLAUDE.md`, `GEMINI.md`, Cursor rules or Copilot instructions.",
        "They are loaded at the start of every session, so every line costs context on every turn. They can be layered: a global file for personal preferences, a project file shared by the team, and files in sub-folders for local rules."
      ],
      when: [
        "Facts every session needs: commands, conventions, a map of the project.",
        "Team rules checked into the repository; personal preferences in a user-level file."
      ],
      avoid: [
        "Long or auto-generated files. Keep them short and specific; models skim past bloat.",
        "Task-specific procedures. Put those in [[skills]] so they load only when needed."
      ],
      sota: [
        "Treat the file like code: review it, prune it, and test whether it actually changes behaviour.",
        "Link to documentation instead of pasting it in.",
        "When the agent makes the same mistake twice, add one precise line.",
        "Measure the effect. A 2026 study found generic repository overviews add cost without improving results, while precise instructions are followed."
      ],
      examples: ["AGENTS.md", "CLAUDE.md", "GEMINI.md", ".cursor/rules", ".github/copilot-instructions.md"],
      related: ["system-prompt", "memory", "skills", "context-engineering"]
    },

    "context-engineering": {
      name: "Context engineering", label: "Context engineering",
      aka: ["context", "context management", "progressive disclosure", "just in time", "context rot", "attention budget", "write select compress isolate"],
      short: "Deciding exactly which tokens the model sees at each step. The most important skill in building agents.",
      eli5: "Mise en place. Before cooking starts, everything the chef needs is prepared and laid out in order, and nothing else is on the counter.",
      what: [
        "Context engineering is prompt engineering grown up for agents: curating the full set of tokens in the context window across many turns, including instructions, tools, examples, retrieved knowledge, history and tool results.",
        "Because attention is a finite budget and quality degrades as the context grows, the goal is the smallest set of high-signal tokens that lets the model take the next step well. Core techniques: progressive disclosure (load details only when needed), just-in-time retrieval, [[compaction]], structured notes and [[memory]], [[subagents]] for isolation, and tools that return concise results."
      ],
      when: [
        "Always. Every block on this map is, in the end, a way to get the right context in at the right time."
      ],
      avoid: [
        "Assuming more context is better.",
        "Letting stale tool output, dead ends and noise pile up."
      ],
      sota: [
        "Stable content first (cacheable), volatile content last.",
        "Keep error messages the agent still needs, but summarise long outputs.",
        "Use the file system as extended memory: reference files by path instead of pasting them.",
        "A useful framework: **write** context out (notes), **select** what to bring in, **compress** what stays, **isolate** work in sub-agents."
      ],
      examples: ["Progressive disclosure in Agent Skills", "Tool search instead of loading every tool", "Progress files for long tasks", "Sub-agents for exploration"],
      related: ["context-window", "compaction", "memory", "subagents", "skills"]
    },

    "compaction": {
      name: "Compaction & context editing", label: "Compaction",
      aka: ["compact", "summarize", "summarisation", "context editing", "clear tool results", "auto-compact", "context reset"],
      short: "When the context window fills up, the harness summarises or prunes old turns so the agent can keep working.",
      eli5: "Clearing the counter in the middle of a busy night. The scraps go, and a short note says what is already done, so cooking can go on.",
      what: [
        "Long runs eventually hit the context limit. **Compaction** replaces older history with a condensed summary (decisions made, open problems, files touched) and keeps recent turns word for word. **Context editing** removes stale items automatically, for example old tool results the agent no longer needs.",
        "Some harnesses compact automatically near the limit; others let you trigger it with a command. Good compaction preserves what matters for the next steps. Poor compaction makes the agent forget decisions or redo work."
      ],
      when: [
        "Long sessions with many tool calls, and multi-hour tasks.",
        "Before switching to an unrelated sub-task."
      ],
      avoid: [
        "Relying on compaction alone for multi-session work. Also write progress notes and commit work to version control.",
        "Compacting away error details the agent still needs."
      ],
      sota: [
        "APIs offer server-side compaction and automatic clearing of old tool results.",
        "Pair compaction with a progress file, so a fresh context can pick up where the old one stopped.",
        "Let users give compaction a focus (what to keep)."
      ],
      examples: ["/compact and auto-compact in Claude Code and Codex", "Compaction and context editing in the Claude API", "Compaction in the OpenAI Responses API", "Context compaction in Google ADK"],
      related: ["context-engineering", "memory", "long-running", "context-window"]
    },

    "memory": {
      name: "Memory", label: "Memory",
      aka: ["long-term memory", "short-term memory", "episodic", "semantic", "procedural", "notes", "progress file", "memory tool", "remember", "mem0", "letta", "memgpt"],
      short: "What persists beyond one context window: facts, preferences, past decisions and progress the agent can recall later.",
      eli5: "A notebook in the kitchen drawer. The chef writes down what worked and what the regulars like, so tomorrow's shift does not start from zero.",
      what: [
        "Inside a run, the context window is short-term memory. Long-term memory lives outside it and is loaded when relevant: files the agent reads and writes (notes, progress logs, instruction files), dedicated memory tools and stores, or vector and graph databases.",
        "Research borrowed a taxonomy from cognitive science: **episodic** memory (what happened), **semantic** memory (facts) and **procedural** memory (how to do things, which in practice means instruction files and [[skills]])."
      ],
      when: [
        "Assistants that should remember a person's preferences.",
        "Multi-session projects: progress files and decision logs.",
        "Learning from mistakes: write the lesson into an instruction file or skill."
      ],
      avoid: [
        "Remembering everything. Stale or wrong memories mislead the agent.",
        "Storing personal data without consent, retention rules and a way to delete it."
      ],
      sota: [
        "File-based memory (Markdown notes, progress logs, git history) is simple, transparent and works across harnesses.",
        "Memory tools in APIs let the agent create, read and update its own memory files.",
        "Make memory visible and editable for users."
      ],
      examples: ["Instruction files as procedural memory", "Claude memory and Claude Code auto memory", "ChatGPT memory and Codex memories", "The memory tool in the Claude API", "Letta", "Mem0", "LangGraph memory and LangMem", "Zep"],
      related: ["instructions", "context-engineering", "compaction", "long-running", "rag"]
    },

    /* ---- Control layer ---- */
    "permissions": {
      name: "Permissions & approval modes", label: "Permissions",
      aka: ["allow", "deny", "ask", "approval", "auto mode", "yolo", "least privilege", "allowlist", "policy", "trusted folders"],
      short: "Rules for what the agent may do on its own, what needs approval, and what is forbidden.",
      eli5: "Some cupboards are open, some need the manager's key, and the knife safe stays locked. The kitchen decides, not the chef.",
      what: [
        "Harnesses check every tool call against a policy: allow, ask or deny, often by tool and argument pattern (allow running tests, ask before pushing, deny reading `.env`). Modes range from read-only planning, through asking every time, to automatic approval inside a sandbox. Some harnesses add classifier-based modes that approve routine actions and stop risky ones.",
        "Permissions are deterministic. Unlike a prompt, the model cannot talk its way past them."
      ],
      when: [
        "Always. Start from least privilege.",
        "Loosen for trusted, sandboxed, reversible work; tighten for production systems, money and secrets."
      ],
      avoid: [
        "Approval fatigue. If people click yes to everything, the control is gone; use a [[sandbox]] instead.",
        "Skipping all permission checks outside an isolated environment."
      ],
      sota: [
        "Sandbox plus automatic approval beats endless confirmation prompts.",
        "Separate read from write capabilities, and scope credentials per task.",
        "Share permission settings with the team in version control."
      ],
      examples: ["Auto mode, permission modes and allow/deny rules in Claude Code", "Sandbox modes, approval policies and auto-review in OpenAI Codex", "Policy engine and trusted folders in Gemini CLI", "Firewall and local sandboxing for GitHub Copilot"],
      related: ["hooks", "sandbox", "security", "hitl"]
    },

    "hooks": {
      name: "Hooks", label: "Hooks",
      aka: ["lifecycle", "pretooluse", "posttooluse", "stop hook", "sessionstart", "events", "deterministic", "automation", "callbacks"],
      short: "Scripts the harness runs automatically at fixed moments, such as before a tool call, after an edit, or when the agent wants to stop. Guarantees, not suggestions.",
      eli5: "The smoke alarm and the kitchen timer. They go off every single time, whatever the chef thinks, so some rules can never be forgotten.",
      what: [
        "Hooks are deterministic extensions of the agent lifecycle. The harness fires events (for example session start, prompt submitted, before a tool call, after a tool call, before compaction, stop) and runs your scripts.",
        "A hook can block an action (editing protected files), change its input, add context (today's ticket), format code after every edit, run tests before the agent is allowed to finish, notify a person, or write an audit log."
      ],
      when: [
        "Anything that must **always** happen: formatting, linting, policy checks, audit logs, notifications.",
        "Blocking dangerous patterns deterministically.",
        "Injecting fresh context at the start of a session."
      ],
      avoid: [
        "Slow hooks on every tool call, which add latency to every turn.",
        "Hooks from untrusted sources. They run with your permissions."
      ],
      sota: [
        "Prompts suggest; hooks enforce.",
        "A stop hook enforces the definition of done, for example that tests pass.",
        "Hooks are spreading across harnesses with similar event names, which makes policies portable."
      ],
      examples: ["Claude Code hooks", "Hooks in the Claude Agent SDK", "OpenAI Codex hooks", "Cursor hooks", "GitHub Copilot hooks", "Gemini CLI and Antigravity CLI hooks", "Callbacks in Google ADK"],
      related: ["permissions", "guardrails", "verification", "plugins"]
    },

    "guardrails": {
      name: "Guardrails", label: "Guardrails",
      aka: ["safety", "content filter", "moderation", "pii", "jailbreak", "validation", "classifier", "llama guard", "nemo guardrails", "prompt shields"],
      short: "Checks that run alongside the agent to catch unsafe, off-topic or malformed inputs and outputs.",
      eli5: "The checker at the pass. They look at every order coming in and every plate going out, and stop anything that should not leave the kitchen.",
      what: [
        "Guardrails validate on the way in and on the way out. Input checks catch jailbreaks, prompt injection, off-topic requests and personal data. Output checks catch policy violations, leaked secrets, unsupported claims and malformed structure. Tool-level checks validate arguments and enforce rate limits.",
        "They can be rules (patterns, allowlists), classifiers (dedicated safety models), or model-based judges. Many run in parallel with the agent and stop the run when they trip."
      ],
      when: [
        "Customer-facing agents, regulated domains and any untrusted input.",
        "Validating structured output before it reaches downstream systems."
      ],
      avoid: [
        "Treating guardrails as complete security. They reduce risk; least privilege and isolation still matter. See [[security]].",
        "Blocking so much that the agent becomes useless. Measure false positives."
      ],
      sota: [
        "Layered defences: input classifier, output checks, tool argument validation and permission policies together.",
        "Run cheap checks in parallel with the main model to keep latency low.",
        "Evaluate guardrails like any other model: precision, recall and drift."
      ],
      examples: ["Guardrails in the OpenAI Agents SDK", "NVIDIA NeMo Guardrails", "Llama Guard 4", "Anthropic Constitutional Classifiers", "Azure AI Content Safety Prompt Shields", "Google Cloud Model Armor", "Guardrails AI"],
      related: ["security", "permissions", "hooks", "evals"]
    },

    "hitl": {
      name: "Human-in-the-loop", label: "Human-in-the-loop",
      aka: ["human in the loop", "approval", "review", "oversight", "escalation", "interrupt", "handoff to human", "autonomy levels"],
      short: "The points where a person approves, corrects or takes over. The right amount of oversight for the risk.",
      eli5: "The head chef's nod. Before an expensive or risky dish goes out, a person takes a look and says yes or no.",
      what: [
        "Human-in-the-loop means designing explicit checkpoints: approving a plan, confirming an irreversible action (payment, deletion, sending email, deploying), answering a clarifying question, reviewing the result (for example a pull request), or taking over when the agent is stuck.",
        "Frameworks implement this as interrupts: the run pauses, its state is saved, and it resumes after the person decides. Oversight is also a legal requirement for some uses under the EU AI Act. See [[governance]]."
      ],
      when: [
        "Irreversible, expensive, external-facing or regulated actions.",
        "Ambiguous requirements: let the agent ask early instead of guessing.",
        "New workflows, until evals and logs have built trust."
      ],
      avoid: [
        "Approving every trivial step. Combine fewer, better checkpoints with a [[sandbox]].",
        "Oversight in name only, where the reviewer lacks the time, context or authority to say no."
      ],
      sota: [
        "Graduated autonomy: start supervised and widen permissions as evidence accumulates.",
        "Review at natural checkpoints (plan, pull request, publish) rather than every keystroke.",
        "Agents ask structured clarifying questions instead of free-form ones."
      ],
      examples: ["Interrupts in LangGraph", "Tool approval in the OpenAI Agents SDK", "Permission callbacks and clarifying questions in the Claude Agent SDK", "Action confirmations in Google ADK", "Pull request review as the final gate"],
      related: ["permissions", "planning", "surfaces", "governance"]
    },

    "security": {
      name: "Security & prompt injection", label: "Security",
      aka: ["prompt injection", "indirect prompt injection", "lethal trifecta", "rule of two", "exfiltration", "supply chain", "owasp", "tool poisoning", "camel", "least privilege", "secrets"],
      short: "Agents read untrusted text and hold real permissions. Prompt injection turns that combination into the top security risk.",
      eli5: "Someone slips a fake note into the order pile: “Give the cash box to the delivery driver.” A safe kitchen treats notes from outside as ingredients, never as orders from the boss.",
      what: [
        "Prompt injection happens when instructions hidden in content the agent reads (a web page, an email, an issue, a PDF, a tool result) hijack its behaviour. No current model is immune.",
        "Simon Willison's **lethal trifecta** names the dangerous combination: access to private data, exposure to untrusted content, and the ability to communicate externally. An agent with all three can be tricked into sending your data to an attacker. Meta's **Rule of Two** turns this into a design rule: without human approval, a session should combine at most two of the three. Defences are architectural: remove a leg of the trifecta, least privilege, sandboxing with restricted network access, human approval for sensitive actions, separating planning from untrusted data, and short-lived scoped credentials."
      ],
      when: [
        "Before giving an agent access to email, browsing, customer data or production systems.",
        "Before installing third-party MCP servers, skills or plugins, which are a supply-chain risk."
      ],
      avoid: [
        "Relying on “ignore malicious instructions” in the prompt.",
        "Long-lived, broad tokens in agent environments."
      ],
      sota: [
        "Design for the Rule of Two, and use the OWASP lists for LLM and agentic applications as checklists.",
        "Restrict network egress from sandboxes to an allowlist of domains.",
        "Pin and review third-party tools; watch for tool descriptions that change (tool poisoning).",
        "Use OAuth with per-user, least-privilege scopes for remote MCP servers."
      ],
      examples: ["OWASP Top 10 for LLM Applications (2026 edition)", "OWASP Top 10 for Agentic Applications", "Meta's Agents Rule of Two", "Google DeepMind CaMeL", "Sandboxed coding agents with network allowlists"],
      related: ["guardrails", "permissions", "sandbox", "mcp", "hitl"]
    },

    /* ---- Know-how & knowledge ---- */
    "skills": {
      name: "Agent Skills", label: "Skills",
      aka: ["skill", "skill.md", "agent skills", "progressive disclosure", "procedural knowledge", "agentskills.io", "capabilities"],
      short: "Folders of instructions, scripts and resources (with a SKILL.md file) that an agent discovers and loads only when a task needs them.",
      eli5: "Recipe cards in a box. The chef can see all the card titles, but pulls out a full card only when that dish is ordered.",
      what: [
        "A skill packages procedural know-how: a `SKILL.md` file with a name and a description in its header plus Markdown instructions, and optionally scripts, templates and reference files.",
        "At session start, only each skill's name and description sit in the context, a few dozen tokens each. When a task matches, the model reads the full `SKILL.md`, and only then the extra files it needs. This is **progressive disclosure**. Bundled scripts let the agent run tested code instead of writing it from scratch. Anthropic introduced skills in October 2025 and published the format as an open standard in December 2025. By October 2026 more than 40 products support it, including Codex, GitHub Copilot, VS Code, Cursor and Gemini CLI."
      ],
      when: [
        "Repeatable procedures: how we write release notes, how to build the quarterly report, how to use our design system.",
        "Company conventions and domain expertise too large for the instruction file.",
        "Bundling helper scripts together with the instructions for using them."
      ],
      avoid: [
        "Vague descriptions. The description is how the model decides whether to load the skill.",
        "Installing skills from untrusted sources without reading them. They can contain code."
      ],
      sota: [
        "Write the description for triggering (“Use when…”), keep `SKILL.md` focused, and move details into referenced files.",
        "Turn successful sessions, SOPs and [[playbooks]] into skills, keep them in git, and share them through [[plugins]].",
        "Test skills with evals like any other component."
      ],
      examples: ["Anthropic's document skills (Word, Excel, PowerPoint, PDF)", "The anthropics/skills repository", "Skills in Claude, Claude Code and the Claude API", "Skills in ChatGPT and Codex", "GitHub Copilot agent skills", "Devin Skills"],
      related: ["playbooks", "commands", "plugins", "context-engineering", "instructions"]
    },

    "playbooks": {
      name: "Playbooks & runbooks", label: "Playbooks",
      aka: ["playbook", "runbook", "sop", "standard operating procedure", "procedure", "checklist", "recipe", "devin playbooks", "ace"],
      short: "A written, step-by-step procedure for a recurring task: what to do, in what order, with which checks, and what counts as done.",
      eli5: "The banquet checklist. For a big, important job, the kitchen follows the same tested steps in the same order, every time.",
      what: [
        "“Playbook” is a practitioner term rather than one formal standard. It means a reusable, human-readable procedure that an agent (or a person) follows for a class of tasks, such as triaging an incident, onboarding a customer or migrating a service. A good playbook states the goal, inputs, steps, decision points, checks, escalation rules and the definition of done.",
        "In practice, playbooks are implemented as a [[skills|skill]], a [[commands|slash command]], a prompt template or a workflow definition. Some products use the name directly: Devin has Playbooks. Research such as ACE (Agentic Context Engineering) treats an agent's context as an evolving playbook that it refines from its own successes and failures."
      ],
      when: [
        "Recurring multi-step processes that need consistency and an audit trail.",
        "Capturing expert know-how so agents and new colleagues can repeat it."
      ],
      avoid: [
        "Scripting every click. Describe goals, checks and decision points; let the agent handle details.",
        "Letting playbooks rot. After a failure, the fix is often a playbook edit."
      ],
      sota: [
        "Store playbooks as skills or commands so the harness loads them on demand.",
        "Give each playbook an eval set and an explicit definition of done.",
        "Let agents propose playbook updates from their traces, and have a person review them."
      ],
      examples: ["Devin Playbooks", "Playbooks in Google Conversational Agents", "Promptbooks in Microsoft Security Copilot", "Incident runbooks turned into skills", "SOP libraries in operations teams"],
      related: ["skills", "commands", "workflows", "memory"]
    },

    "commands": {
      name: "Slash commands & prompt templates", label: "Slash commands",
      aka: ["slash command", "/command", "prompt template", "custom prompt", "prompt file", "saved prompt", "mcp prompts", "macro"],
      short: "Saved prompts you trigger by name, such as /review or /release-notes. A shortcut for instructions you would otherwise type every time.",
      eli5: "The “the usual, please” button. One short word starts a whole order that was written down in advance.",
      what: [
        "A slash command expands a stored template, usually a Markdown file with optional arguments, into the prompt. Unlike skills, which the model can pick up on its own, commands are normally invoked explicitly by the user.",
        "They are ideal for recurring requests and team conventions. MCP servers can also offer prompts that clients show as commands. In 2026 most harnesses folded custom commands into skills: a skill can be invoked by name like a command, and Codex, Cursor and VS Code steer users from their old prompt files to skills."
      ],
      when: [
        "Frequent, user-initiated tasks: review this diff, write a commit message, summarise the meeting.",
        "Standardising how a team phrases recurring requests."
      ],
      avoid: [
        "Copying the same procedure into many commands. Extract it into a [[skills|skill]]."
      ],
      sota: [
        "Write new commands as skills that are invoked by name, and switch off automatic invocation where a person should decide.",
        "Keep them in the repository so the whole team shares them.",
        "Use arguments instead of near-duplicate commands."
      ],
      examples: ["Skills invoked as /name in Claude Code", "Built-in commands such as /compact, /context and /init", "Custom commands in Gemini CLI", "Prompt files in GitHub Copilot", "Prompts from MCP servers"],
      related: ["skills", "playbooks", "plugins", "surfaces"]
    },

    "plugins": {
      name: "Plugins & extensions", label: "Plugins",
      aka: ["plugin", "extension", "marketplace", "bundle", "package", "apps", "chatgpt apps", "gemini extensions"],
      short: "Installable bundles that package skills, commands, sub-agents, hooks and MCP servers, so a whole setup can be shared with one install.",
      eli5: "A station in a box, like a pizza corner with its own recipe cards, tools and alarms, ready to set up in any kitchen.",
      what: [
        "As setups grow (a few MCP servers, skills, hooks and sub-agent definitions), plugins make them portable: one versioned package that a team installs, often from a marketplace hosted in a Git repository.",
        "Ecosystems use different names (plugins, extensions, apps), and an open packaging standard, Agent Plugins 1.0, now lets one package work across VS Code, GitHub Copilot, Cursor and others. A plugin is a distribution mechanism, not a new capability: what it contains still behaves like skills, tools and hooks."
      ],
      when: [
        "Rolling out a standard toolkit to a team or company.",
        "Publishing an integration for other people to use."
      ],
      avoid: [
        "Installing unvetted plugins. They can run code and hooks with your permissions. See [[security]]."
      ],
      sota: [
        "Companies run private marketplaces with approved plugins.",
        "Version and pin plugins, and review updates like dependency upgrades."
      ],
      examples: ["Claude Code and Cowork plugins", "ChatGPT and Codex plugins", "Agent Plugins 1.0 packages", "Cursor Marketplace", "Antigravity CLI plugins (formerly Gemini CLI extensions)"],
      related: ["skills", "commands", "hooks", "mcp"]
    },

    "rag": {
      name: "Retrieval-augmented generation (RAG)", label: "RAG",
      aka: ["retrieval", "retrieval augmented generation", "rag", "knowledge base", "grounding", "chunking", "reranking", "graphrag", "agentic rag", "contextual retrieval", "citations"],
      short: "Look up relevant passages in your knowledge base and put them into the context before the model answers.",
      eli5: "Looking it up in the cookbook library. Instead of guessing from memory, the chef fetches the right pages and lays them on the counter.",
      what: [
        "RAG grounds the model in your own data without retraining it. The classic pipeline splits documents into chunks, turns each chunk into an [[embeddings|embedding]], and stores them in an index. At question time it retrieves the most relevant chunks (ideally combining semantic and keyword search, then reranking) and inserts them into the prompt with their sources.",
        "In agents, retrieval becomes a tool the model calls when it needs to, as often as it needs to (agentic RAG). Variants include contextual retrieval (adding document context to each chunk before indexing) and GraphRAG (building a knowledge graph to answer questions about a whole collection)."
      ],
      when: [
        "Large, private or frequently changing knowledge: wikis, manuals, tickets, policies.",
        "Answers that need citations.",
        "Collections far too large for the context window."
      ],
      avoid: [
        "Poor chunking and no measurement of retrieval quality. Measure whether the right passages come back.",
        "RAG for small collections that fit in the context, or for codebases, where [[search|agentic search]] often works better."
      ],
      sota: [
        "Hybrid search (embeddings plus BM25 keywords), reranking and contextual chunk headers.",
        "Retrieval as a tool inside the agent loop, so the agent can refine its queries.",
        "Evaluate retrieval and answer quality separately."
      ],
      examples: ["OpenAI file search", "Gemini API File Search", "Amazon Bedrock Knowledge Bases", "Azure AI Search", "LlamaIndex", "LangChain retrievers", "Microsoft GraphRAG"],
      related: ["embeddings", "search", "memory", "context-engineering"]
    },

    "embeddings": {
      name: "Embeddings & vector search", label: "Embeddings",
      aka: ["embedding", "vector", "vector database", "vector db", "semantic search", "similarity", "cosine", "pgvector", "pinecone", "weaviate", "qdrant", "milvus", "chroma", "hybrid search", "bm25"],
      short: "Lists of numbers that capture meaning. Texts with similar meaning get similar vectors, so you can search by meaning instead of keywords.",
      eli5: "A library sorted by taste. Similar recipes sit next to each other, so you can find “something like this” even without knowing its name.",
      what: [
        "An embedding model maps text (or images, or code) to a vector of hundreds to thousands of numbers. Similar meanings land close together in that space, typically measured by cosine similarity. Vector databases index millions of vectors for fast approximate nearest-neighbour search.",
        "Embeddings power semantic search, RAG, de-duplication, clustering, recommendations and memory retrieval. Combine them with keyword search for exact terms such as product codes or error numbers."
      ],
      when: [
        "Semantic search over unstructured text.",
        "Similarity tasks: de-duplicate, cluster, recommend, route."
      ],
      avoid: [
        "Expecting vectors to match exact identifiers. Use hybrid search.",
        "Mixing embeddings from different models in one index."
      ],
      sota: [
        "Choose an embedding model with public benchmarks (such as MTEB), then validate it on your own data.",
        "Add a reranker on top of the first retrieval step for better precision.",
        "Postgres with a vector extension is often enough; dedicated vector databases help at large scale."
      ],
      examples: ["OpenAI text-embedding-3", "Google gemini-embedding-2 (multimodal)", "Voyage AI", "Cohere", "Open models ranked on the MTEB leaderboard", "pgvector", "Pinecone", "Weaviate", "Qdrant", "Milvus", "Chroma", "Elasticsearch and OpenSearch"],
      related: ["rag", "search", "memory"]
    },

    "search": {
      name: "Agentic search & web search", label: "Agentic & web search",
      aka: ["agentic search", "grep", "glob", "web search", "browsing", "deep research", "research", "grounding", "citations", "browsecomp"],
      short: "Letting the agent find information itself, by searching files, browsing the web and refining queries, instead of relying on a pre-built index.",
      eli5: "A walk through the market. The chef goes from stall to stall, follows tips, and keeps looking until the right ingredient turns up.",
      what: [
        "In agentic search the model uses ordinary tools such as listing files, grep, reading files, web search and fetching pages, step by step, and refines its queries as it learns. Coding agents often prefer this to a vector index: it is always up to date, precise for identifiers, and needs no indexing pipeline.",
        "Web search tools ground answers in current information with citations. Deep-research systems run long agentic search sessions, often with several agents in parallel, and synthesise a report."
      ],
      when: [
        "Codebases and structured file trees, where grep beats embeddings for exact names.",
        "Current events, prices and documentation that changes.",
        "Research questions that need breadth: parallel search [[subagents]]."
      ],
      avoid: [
        "Unbounded browsing of untrusted pages in a session that also holds sensitive access. See [[security]].",
        "Unchecked sources. Require citations and check them."
      ],
      sota: [
        "Combine agentic search for code with RAG for large document collections.",
        "Run search in sub-agents so only conclusions reach the main context.",
        "Deep research now takes minutes to hours and is measured on hard browsing benchmarks."
      ],
      examples: ["Grep, glob and Explore sub-agents in coding agents", "Web search tools in the Claude, OpenAI and Gemini APIs", "Deep research in ChatGPT, Gemini and Claude", "Perplexity"],
      related: ["rag", "tools", "subagents", "multi-agent"]
    },

    /* ---- Tools & environment ---- */
    "tools": {
      name: "Tools & function calling", label: "Tools",
      aka: ["tool use", "function calling", "functions", "tool call", "json schema", "structured outputs", "api", "tool search", "programmatic tool calling", "aci"],
      short: "Functions the model can ask the harness to run: search, read a file, query a database, send a message. The model decides; the harness executes.",
      eli5: "Knives, pots and the oven. The chef decides what to do, the tools do it, and the chef sees what happened.",
      what: [
        "A tool is described to the model by a name, a description and a JSON Schema for its parameters. When the model wants to use it, it emits a structured tool call (name plus arguments). The harness runs the actual code and returns the result as a new message. The model never executes anything itself.",
        "Tools come built in (shell, file editing, web search, code execution), from [[mcp|MCP servers]], or from your own code. Tool design is user-experience design for models: clear names, a focused purpose, helpful error messages and concise, high-signal output."
      ],
      when: [
        "Whenever the agent needs live data or must change something in the world.",
        "Deterministic operations the model should not do in its head: arithmetic, parsing, lookups."
      ],
      avoid: [
        "Dozens of overlapping tools. The model gets confused and the definitions eat context.",
        "One thin wrapper per API endpoint. Design tools around tasks instead."
      ],
      sota: [
        "Fewer, more capable tools with namespaced names and token-efficient responses (filters, pagination, summaries).",
        "Tool search: load tool definitions on demand when you have many.",
        "Programmatic tool calling (code mode): the model writes code that calls tools, so intermediate data stays out of the context.",
        "Strict schemas and structured outputs for reliable arguments."
      ],
      examples: ["Tool use in the Claude API", "Function calling in the OpenAI API", "Function calling in the Gemini API", "Built-in tools: shell, editor, web search, code execution"],
      related: ["mcp", "agent-loop", "sandbox", "permissions"]
    },

    "mcp": {
      name: "Model Context Protocol (MCP)", label: "MCP",
      aka: ["model context protocol", "mcp server", "mcp client", "connector", "connectors", "integration", "usb-c", "resources", "mcp apps", "registry"],
      short: "The open standard for connecting agents to tools and data. Write an integration once as an MCP server and use it in any MCP-capable harness.",
      eli5: "A standard plug socket. Any appliance with the right plug works in any kitchen, so nobody has to rewire the wall for a new blender.",
      what: [
        "MCP defines how a host application (the harness) connects, through MCP clients, to MCP servers that expose **tools** (actions), **resources** (data) and **prompts** (templates). Servers run locally over standard input/output or remotely over HTTP, with OAuth-based authorisation.",
        "Anthropic introduced MCP in November 2024. It was adopted across the industry and donated to the Agentic AI Foundation under the Linux Foundation in December 2025. The current revision (2026-07-28) made the core protocol stateless and moved optional features, such as long-running tasks and interactive interfaces (MCP Apps), into formal extensions. Chat products often present MCP servers as “connectors” or “apps”."
      ],
      when: [
        "Reusable integrations (GitHub, Jira, Slack, databases, internal APIs) for many agents and tools.",
        "Making your own product usable by AI agents."
      ],
      avoid: [
        "Loading many servers with hundreds of tools into every session. Use tool search or code execution instead.",
        "Unvetted third-party servers. They are code with your credentials; check who publishes them and what scopes they need."
      ],
      sota: [
        "Target the 2026-07-28 revision: stateless remote servers that scale behind a load balancer, with OAuth 2.1 and per-user, least-privilege scopes.",
        "Code execution with MCP: present tools as code APIs so large intermediate results never enter the context.",
        "Treat servers as untrusted code: vet them, pin versions and review changes to tool descriptions."
      ],
      examples: ["Official reference servers (filesystem, git, fetch)", "GitHub MCP server", "Google's managed remote MCP servers", "Connector directories in Claude and ChatGPT", "MCP Registry (preview)", "MCP support in VS Code, Windows and cloud platforms"],
      related: ["tools", "security", "plugins", "a2a"]
    },

    "sandbox": {
      name: "Sandbox & code execution", label: "Sandbox",
      aka: ["sandbox", "container", "vm", "microvm", "docker", "devcontainer", "code interpreter", "code execution", "isolation", "e2b", "firecracker", "gvisor", "egress"],
      short: "An isolated computer (a container or micro-VM) where the agent can run code, use a terminal and edit files without endangering your real systems.",
      eli5: "A test kitchen with tiled walls. The chef can try anything; spills and small fires stay inside and are easy to clean up.",
      what: [
        "Agents become far more capable when they can execute code: run tests, analyse data, convert files, install packages. A sandbox limits the blast radius with file-system isolation (only the project folder), network isolation (only allowlisted domains), resource limits and disposable environments.",
        "Options range from operating-system sandboxing on your laptop, to containers and dev containers, to cloud micro-VMs that start per task. With a good sandbox you can safely let the agent work with far fewer approval prompts."
      ],
      when: [
        "Any agent that runs code or shell commands.",
        "Always for unattended and background agents."
      ],
      avoid: [
        "Running agents with full access on your main machine next to production credentials.",
        "Unrestricted network access from environments that hold secrets, which enables data exfiltration."
      ],
      sota: [
        "Isolate both the file system and the network; restrict egress to an allowlist.",
        "Ephemeral cloud environments per task that return results as pull requests or files.",
        "Code-execution tools in model APIs for data analysis without your own infrastructure."
      ],
      examples: ["Sandboxing in Claude Code", "OpenAI Codex sandbox (local and cloud)", "GitHub Copilot local sandboxing", "Code execution tools in model APIs", "Docker Sandboxes", "E2B", "Daytona", "Modal", "Dev containers", "Firecracker", "gVisor"],
      related: ["permissions", "security", "tools", "long-running"]
    },

    "computer-use": {
      name: "Computer & browser use", label: "Computer use",
      aka: ["computer use", "browser use", "gui agent", "operator", "screenshot", "click", "rpa", "playwright", "web agent", "chrome", "atlas"],
      short: "Agents that look at screenshots and control a mouse and keyboard, or a browser, to operate software that has no API.",
      eli5: "Using a machine that has no plug: the chef reads the dials and presses the buttons by hand, like a person would. Slower, but it works almost anywhere.",
      what: [
        "Computer-use models look at the screen, reason about what is there, and emit actions such as click, type and scroll. Browser agents do the same inside a web browser, often combining screenshots with the page structure.",
        "This lets agents use legacy applications and ordinary websites. It is slower, costlier and more fragile than an API, and web pages are a major prompt-injection channel."
      ],
      when: [
        "No API or MCP server exists for the task.",
        "End-to-end testing of web apps, so the agent can check its own front-end work.",
        "Repetitive web workflows under supervision."
      ],
      avoid: [
        "Situations where an API or MCP integration exists. Structured tools are always better.",
        "Logged-in browsing of untrusted sites with access to sensitive accounts, without safeguards."
      ],
      sota: [
        "Prefer structure over pixels: APIs and MCP first, then accessibility snapshots of the page, then full-screen control.",
        "Code-driven control is rising: models write automation scripts instead of clicking step by step.",
        "Require confirmation for purchases, logins and sending messages, and run in an isolated VM or browser profile."
      ],
      examples: ["Claude computer use and Claude in Chrome", "ChatGPT agent and computer use in the OpenAI API", "Gemini computer use", "GitHub Copilot computer use for desktop apps", "Browser Use (open source)", "Playwright MCP"],
      related: ["tools", "security", "sandbox", "verification"]
    },

    /* ---- Orchestration ---- */
    "workflows": {
      name: "Workflow patterns", label: "Workflow patterns",
      aka: ["workflow", "prompt chaining", "chaining", "routing", "parallelization", "orchestrator-workers", "evaluator-optimizer", "pipeline", "dag", "n8n"],
      short: "Predefined paths where your code orchestrates model calls: predictable, testable and cheap. Use them whenever you already know the steps.",
      eli5: "An assembly line. Each station does one job, in the same order every time. Perfect when the dish never changes.",
      what: [
        "Anthropic's widely cited distinction: **workflows** orchestrate models and tools through predefined code paths, while **agents** let the model direct its own process. Five workflow patterns cover most needs: prompt chaining, routing, parallelization, orchestrator-workers and evaluator-optimizer. See the [[workflows|patterns section]] below the map.",
        "Workflows and agents combine: an agent can be one step of a workflow, and a workflow can be a tool that an agent calls."
      ],
      when: [
        "Well-defined, repeatable processes with known steps.",
        "When you need predictability, auditability and low cost."
      ],
      avoid: [
        "Hard-coding a workflow for open-ended problems. That is where agents shine."
      ],
      sota: [
        "Start with a workflow and add autonomy only at the steps that need judgement.",
        "Workflow engines with durable execution for long-running business processes."
      ],
      examples: ["LangGraph", "Google ADK workflow agents and graph workflows", "Dynamic workflows in Claude Code and GitHub Copilot", "n8n", "Temporal", "Anthropic cookbook patterns"],
      related: ["agent-loop", "multi-agent", "verification", "long-running"]
    },

    "subagents": {
      name: "Sub-agents", label: "Sub-agents",
      aka: ["subagent", "sub agent", "delegation", "task tool", "agent as tool", "context isolation", "helper agent", "parallel agents"],
      short: "A helper agent with its own fresh context window. It gets one focused job and returns only a condensed result.",
      eli5: "A helper who preps in their own corner and hands back one finished bowl. The chef's counter stays clean.",
      what: [
        "The main agent delegates a self-contained task (explore the codebase, research a question, review a diff) to a sub-agent. The sub-agent works in its own context, possibly reading many files or pages, and returns a short summary, so the main context stays clean.",
        "Sub-agents can have their own instructions, tool permissions and model (for example a cheaper one), and several can run in parallel."
      ],
      when: [
        "Exploration that would flood the main context.",
        "Independent sub-tasks that can run in parallel.",
        "Specialist roles with restricted tools, such as a read-only reviewer."
      ],
      avoid: [
        "Tightly coupled work where helpers need each other's details. They will make conflicting decisions.",
        "Delegating without a clear brief, boundaries and output format."
      ],
      sota: [
        "Brief sub-agents like a colleague: objective, output format, tools to use, and boundaries.",
        "Use them freely for reading and researching; carefully for writing.",
        "Return results as files or structured summaries rather than long chat."
      ],
      examples: ["Subagents in Claude Code and the Claude Agent SDK", "Agents as tools in the OpenAI Agents SDK", "Sub-agents in Google ADK", "LangChain Deep Agents"],
      related: ["multi-agent", "context-engineering", "search", "workflows"]
    },

    "multi-agent": {
      name: "Multi-agent systems & agent teams", label: "Multi-agent",
      aka: ["multi agent", "multi-agent", "agent team", "agent teams", "swarm", "handoff", "orchestrator", "lead agent", "crew", "society of agents"],
      short: "Several agents working together, a lead coordinating specialists or peers handing off work, for problems too big or broad for one.",
      eli5: "The kitchen brigade. A head chef splits a big order among station chefs who cook at the same time, then puts the plates together.",
      what: [
        "Common architectures: **orchestrator-workers** (a lead agent plans, spawns parallel sub-agents and synthesises), **handoffs** (an agent transfers the conversation to a specialist), and **teams** (peers sharing a task list and messaging each other).",
        "They shine on broad, parallelisable work such as research. Anthropic reported that its multi-agent research system beat a single agent by about 90% on an internal research evaluation, while using roughly 15 times the tokens of a chat. They struggle with tightly coupled tasks: a 2026 Google study found that every multi-agent setup it tested made strictly sequential tasks worse. Typical failures are miscommunication, duplicated work and conflicting decisions."
      ],
      when: [
        "Breadth-first tasks with independent parts.",
        "Tasks larger than one context window.",
        "Separation of duties: different permissions for different agents."
      ],
      avoid: [
        "Using it by default. Start with a single agent; multi-agent multiplies cost and failure modes.",
        "Parallel agents writing the same artefact without coordination."
      ],
      sota: [
        "Share context and decisions where work depends on each other; prefer one writer per artefact.",
        "The lead writes its plan to memory; workers get precise briefs; results go to files.",
        "Measure whether the extra tokens buy better outcomes on your evals."
      ],
      examples: ["Research in Claude", "Agent teams in coding harnesses", "Handoffs in the OpenAI Agents SDK", "Google ADK multi-agent systems", "CrewAI", "Microsoft Agent Framework", "LangGraph supervisor"],
      related: ["subagents", "a2a", "workflows", "long-running"]
    },

    "a2a": {
      name: "Agent2Agent protocol (A2A)", label: "A2A",
      aka: ["agent2agent", "agent to agent", "agent card", "interoperability", "acp", "cross-vendor agents"],
      short: "An open protocol for agents built by different vendors to discover each other and collaborate on tasks. MCP connects agents to tools; A2A connects agents to agents.",
      eli5: "Two restaurants sharing one order form. One kitchen can ask another for a dish without either of them seeing the other's recipes.",
      what: [
        "With A2A, an agent publishes an **Agent Card** describing its skills and endpoint. A client agent sends it tasks and receives messages, status updates and resulting artefacts over standard web protocols, including streaming and push notifications.",
        "The remote agent stays opaque: it does not expose its internal tools, memory or prompts. Google launched A2A in April 2025 and moved it to the Linux Foundation in June 2025."
      ],
      when: [
        "Your agent must work with agents owned by other teams or companies.",
        "Enterprise landscapes with agents on several platforms."
      ],
      avoid: [
        "Using it inside a single application, where plain function calls or [[subagents]] are simpler."
      ],
      sota: [
        "Use MCP for tools and data, A2A for delegating whole tasks to other agents.",
        "Authenticate agents and scope what each one may request."
      ],
      examples: ["Google ADK", "AWS Strands Agents", "Microsoft Agent Framework", "Official A2A SDKs and the A2A CLI"],
      related: ["multi-agent", "mcp", "security"]
    },

    "long-running": {
      name: "Long-running & background agents", label: "Long-running agents",
      aka: ["background agent", "cloud agent", "async agent", "autonomous", "durable execution", "checkpoint", "ralph", "ralph loop", "time horizon", "overnight"],
      short: "Agents that work for hours or across many sessions, often in the cloud while you do something else, and return a pull request, report or result.",
      eli5: "The night shift. It works for hours while you sleep and leaves a note in the morning about what got done.",
      what: [
        "The length of tasks agents can complete on their own has grown quickly. METR measured the length of tasks frontier agents finish with 50% success doubling about every seven months between 2019 and 2025, and faster since; for early 2026 it estimated roughly 12 hours of human work, with wide uncertainty.",
        "Long runs need support from the harness: durable state and checkpoints, progress files and task lists that survive context resets, frequent commits, tests as ground truth, compaction and budgets. Background agents run in cloud sandboxes, are triggered from chat, issues or schedules, and report back asynchronously. A popular minimalist technique is the **Ralph loop**: run the same agent prompt again and again against a spec and a progress file until the work is done."
      ],
      when: [
        "Large migrations, test coverage, refactors, research and data processing.",
        "Parallel work: several background agents on separate tasks or branches."
      ],
      avoid: [
        "Unbounded runs without checkpoints, budgets or verification.",
        "Expecting good results without a clear spec and tests."
      ],
      sota: [
        "An initialiser session sets up the environment, a feature list and a progress log; later sessions make incremental progress and leave a clean state.",
        "Durable execution engines for production workflows that must survive crashes.",
        "Review results as pull requests or documents, not by watching the run."
      ],
      examples: ["Claude Code cloud sessions and routines", "Codex cloud tasks", "GitHub Copilot cloud agent", "Cursor cloud agents", "Google Jules", "Devin", "Claude Managed Agents", "Temporal", "LangGraph persistence"],
      related: ["triggers", "memory", "compaction", "verification", "sandbox"]
    },

    "verification": {
      name: "Verification & self-correction", label: "Verification",
      aka: ["tests", "testing", "self-correction", "reflection", "reflexion", "self-refine", "critic", "reviewer", "evaluator", "llm as judge", "tdd", "check work"],
      short: "Giving the agent a way to check its own work, with tests, linters, screenshots or a reviewer agent, and to fix what fails.",
      eli5: "Tasting before serving, and a thermometer in the roast. Don't trust that it looks done: check.",
      what: [
        "Agents are far more reliable when they get ground-truth feedback: compilers, unit tests, type checkers, linters, rendering the interface and looking at a screenshot, validating output against a schema, or a second model reviewing against explicit criteria (the evaluator-optimizer pattern).",
        "Research on self-reflection (Reflexion, Self-Refine) shows that feedback loops improve results. It also shows that models cannot reliably correct their own reasoning without an external signal, so prefer objective checks."
      ],
      when: [
        "Always, wherever an objective check exists.",
        "For subjective output: rubric-based review by a separate model or a person."
      ],
      avoid: [
        "Self-review in the same context (“looks good to me”). Use fresh context or external signals.",
        "Letting the agent edit the tests to make them pass. Protect them with [[hooks]] or [[permissions]]."
      ],
      sota: [
        "Test-driven agent work: write or agree the tests first, then implement until they pass.",
        "Stop hooks or CI gates that block “done” until checks pass.",
        "Visual verification with browser automation for front-end work."
      ],
      examples: ["Test suites and CI", "Playwright screenshots", "Code-review agents", "LLM-as-a-judge rubrics", "Schema validation"],
      related: ["evals", "hooks", "workflows", "agent-loop"]
    },

    /* ---- Operations ---- */
    "evals": {
      name: "Evals & benchmarks", label: "Evals",
      aka: ["evaluation", "eval", "benchmark", "swe-bench", "terminal-bench", "tau-bench", "gaia", "osworld", "llm as a judge", "error analysis", "regression", "metr", "pass@k"],
      short: "Systematic tests of AI behaviour. Public benchmarks compare models; your own evals tell you whether your agent actually works.",
      eli5: "The food critic with a score sheet. After every change to the menu, they taste the same dishes again and say whether things got better.",
      what: [
        "An eval runs the agent on a set of tasks and grades the results: with code (exact checks, unit tests, checking the final state of a system), with a model judge using a rubric, or with human review. For agents, grade the outcome (was the bug fixed, was the record updated correctly?) and, where useful, the path (sensible tool use, number of turns, cost).",
        "Public benchmarks for software engineering, terminal work, tool use, browsing and computer use, plus METR's time horizons, track progress across models. Your own eval set, built from real tasks and real failures, guides your decisions."
      ],
      when: [
        "Before choosing a model or harness, and after every change to prompts, tools or skills (regression testing).",
        "When debugging: error analysis on real traces reveals the most common failure modes."
      ],
      avoid: [
        "Vibe checks only.",
        "Generic scores (“helpfulness: 4.2”) disconnected from real failures.",
        "Model judges you have not checked against human labels."
      ],
      sota: [
        "Start with 20 to 50 real tasks and grow the set from production failures.",
        "Clear pass/fail criteria per failure mode, and judges calibrated against people.",
        "Run each task several times: agents are non-deterministic, so report consistency, not one lucky run."
      ],
      examples: ["Inspect (UK AI Security Institute)", "Braintrust", "LangSmith", "Langfuse", "Arize Phoenix", "promptfoo", "SWE-bench Verified", "Terminal-Bench", "τ²-bench", "GAIA", "OSWorld", "GDPval"],
      related: ["observability", "verification", "model", "cost"]
    },

    "observability": {
      name: "Observability & tracing", label: "Observability",
      aka: ["tracing", "traces", "spans", "logging", "monitoring", "opentelemetry", "otel", "langfuse", "langsmith", "phoenix", "telemetry", "dashboards"],
      short: "Recording every model call, tool call, token count, cost and latency of every run, so you can see what the agent actually did.",
      eli5: "Cameras in the kitchen and a log of every step. When a dish goes wrong, you can rewind and see exactly where.",
      what: [
        "Agent runs are long, branching and non-deterministic, so logging only the final answer is not enough. Tracing records each step as a span: prompts, model responses, tool calls with arguments and results, sub-agent runs, errors, timing, tokens and cost, arranged on a timeline you can inspect.",
        "OpenTelemetry's semantic conventions for generative AI standardise these signals across vendors. Traces feed debugging, error analysis, evals, cost control and audits."
      ],
      when: [
        "From the first prototype, because you will need the traces for evals.",
        "In production: dashboards for cost, latency and failure rates, with alerts."
      ],
      avoid: [
        "Logging secrets and personal data without redaction and retention rules.",
        "Collecting traces nobody reads. Schedule regular error-analysis sessions."
      ],
      sota: [
        "Instrument once with OpenTelemetry and send traces to the tool of your choice.",
        "Link traces to eval results and user feedback.",
        "Track cost per successful task, not just cost per call."
      ],
      examples: ["OpenTelemetry", "Langfuse", "LangSmith", "Arize Phoenix", "Braintrust", "CoreWeave Agent Lens (formerly W&B Weave)", "Tracing in the OpenAI Agents SDK", "OpenTelemetry export from Claude Code"],
      related: ["evals", "cost", "governance", "security"]
    },

    "cost": {
      name: "Cost & latency optimisation", label: "Cost & latency",
      aka: ["cost", "price", "tokens", "latency", "speed", "prompt caching", "caching", "batch", "routing", "cheaper", "budget", "effort"],
      short: "Agents can use a lot of tokens. Caching, the right model for each step, batching and a lean context keep them fast and affordable.",
      eli5: "The grocery bill and the waiting time. With good planning, the same dish costs less and arrives sooner.",
      what: [
        "Agent cost is roughly tokens per turn, times turns, times price, and it grows quickly because the whole context is re-sent every turn. The biggest levers are prompt caching (re-use the unchanged prefix at a fraction of the price and latency), routing easy steps to smaller models, right-sizing reasoning effort, a lean context (compaction, sub-agents, concise tool output, tool search), batch APIs for jobs that can wait, and parallel tool calls to cut waiting time.",
        "Measure cost per successful task. A cheaper model that needs three attempts is not cheaper."
      ],
      when: [
        "Before scaling any workflow. Set a budget per run.",
        "When latency hurts the experience: stream output, parallelise, use faster models for interactive steps."
      ],
      avoid: [
        "Optimising cost before quality is acceptable.",
        "Breaking the cache by putting timestamps or changing content at the start of the prompt."
      ],
      sota: [
        "Cache-friendly prompt layout: system prompt, tools and instructions first and unchanged.",
        "Batch processing at roughly half price for non-urgent work.",
        "Effort and thinking budgets set per step, not globally."
      ],
      examples: ["Prompt caching in the Anthropic, OpenAI and Gemini APIs", "Batch APIs", "Gateways with model routing", "Effort parameters"],
      related: ["context-engineering", "model", "provider", "observability"]
    },

    "governance": {
      name: "Governance & regulation", label: "Governance",
      aka: ["eu ai act", "ai act", "compliance", "gdpr", "nist", "ai rmf", "iso 42001", "policy", "audit", "risk management", "regulation", "dsgvo"],
      short: "Policies, documentation and legal duties around AI agents: who may deploy what, with which oversight, records and risk controls.",
      eli5: "The health code and the inspector's visit. They don't cook anything, but they decide what the kitchen may serve, and they check.",
      what: [
        "Governance turns safety practice into accountable process: an inventory of agents and their permissions, risk assessment, data protection (GDPR), human oversight, logging and incident response, and vendor management.",
        "Key frameworks: the **EU AI Act** (prohibitions since February 2025, duties for general-purpose AI models since August 2025, generally applicable since August 2026; the 2026 Digital Omnibus moved high-risk obligations to December 2027 and August 2028), the **NIST AI Risk Management Framework** with its generative AI profile, **ISO/IEC 42001** for AI management systems, and agent-specific guidance such as Singapore's Model AI Governance Framework for Agentic AI."
      ],
      when: [
        "Before deploying agents that touch personal data or customers, or make decisions about people.",
        "In regulated industries, and for procurement and audits."
      ],
      avoid: [
        "Treating governance as a one-off checkbox. Agents' permissions and behaviour change over time.",
        "Shadow agents running on personal tokens outside any oversight."
      ],
      sota: [
        "Keep a registry of agents with owners, permissions, data access and risk level.",
        "Log enough to reconstruct what an agent did and why.",
        "Map your use case to the AI Act's risk categories early; obligations depend on the use, not the technology."
      ],
      examples: ["EU AI Act, as amended by Regulation (EU) 2026/1744", "GDPR", "EU General-Purpose AI Code of Practice", "NIST AI RMF", "ISO/IEC 42001", "Singapore's agentic AI framework", "Internal AI policies and agent registries"],
      related: ["hitl", "observability", "security", "provider"]
    }
  };

  /* ---------------------------------------------------------------------------
     The walkthrough: one run, step by step. "blocks" are highlighted on the map,
     "conn" are the active connectors, "station" parks the token of the loop diagram.
     ------------------------------------------------------------------------- */
  var steps = [
    { title: "A task arrives",
      text: "A person types a request in a chat, IDE or terminal, or a system fires an event: a schedule, a webhook, a failing build, a new ticket. The trigger decides what the run starts with and whether anyone is watching.",
      blocks: ["triggers", "surfaces"], conn: ["c-task"] },
    { title: "The harness sets the stage",
      text: "Before the model sees anything, the harness assembles the starting context: the system prompt, instruction files such as AGENTS.md, relevant memory, the **names and one-line descriptions** of available skills, and tool definitions from built-in tools and connected MCP servers. Session-start hooks can add live information.",
      blocks: ["harness", "system-prompt", "instructions", "memory", "skills", "tools", "mcp", "hooks"], conn: ["c-ctx"], station: "assemble" },
    { title: "The request is expanded",
      text: "If the person invoked a slash command or picked a playbook, its template expands into the prompt. A hook can validate or enrich the prompt before it is sent.",
      blocks: ["commands", "playbooks", "hooks"], conn: ["c-ctx"], station: "assemble" },
    { title: "The model is called",
      text: "The harness sends the **entire** context to the model through the provider's API. The model is stateless and sees only this request. The unchanged prefix comes from the prompt cache, which saves cost and time.",
      blocks: ["model", "provider", "context-window", "cost"], conn: ["c-api"], station: "model" },
    { title: "Think and plan",
      text: "The model reasons about the task. For anything non-trivial it drafts a plan or a to-do list. In plan mode a person approves the plan before anything changes.",
      blocks: ["reasoning", "planning", "hitl"], conn: ["c-api"], station: "model" },
    { title: "Load know-how on demand",
      text: "The task matches a skill's description, so the model reads that skill's SKILL.md, and later only the scripts or reference files it needs. Expertise enters the context exactly when it is useful: progressive disclosure.",
      blocks: ["skills", "playbooks", "context-engineering"], conn: ["c-ctx"], station: "assemble" },
    { title: "Gather knowledge",
      text: "The agent looks things up: it searches and reads files, queries a RAG index of company documents, searches the web, or reads data from an MCP server. The findings enter the context with their sources.",
      blocks: ["search", "rag", "embeddings", "mcp"], conn: ["c-ctx", "c-tool"], station: "run" },
    { title: "Request an action",
      text: "The model emits a structured tool call: a tool name and JSON arguments. Before anything runs, the harness checks permissions (allow, ask or deny), runs pre-tool hooks and applies guardrails. Untrusted content in the context is a reason to ask a person first.",
      blocks: ["tools", "permissions", "hooks", "guardrails", "security"], conn: ["c-tool"], station: "check" },
    { title: "Execute in a safe place",
      text: "The harness executes the call: a shell command in the sandbox, an API call through an MCP server, or clicks through computer use. The result comes back as an observation and is appended to the context. Post-tool hooks run, for example to format edited code.",
      blocks: ["sandbox", "mcp", "computer-use", "hooks"], conn: ["c-tool"], station: "run" },
    { title: "Loop",
      text: "The model reads the result and decides what to do next: another tool call, a fix, or the final answer. Steps 4 to 9 repeat, often dozens of times. Budgets for turns, tokens and time keep the loop bounded.",
      note: "This repetition is the agent loop. Everything before it prepares the loop; everything after it checks and improves the loop.",
      blocks: ["agent-loop", "model", "reasoning"], conn: ["c-api", "c-tool"], station: "result" },
    { title: "Delegate",
      text: "For broad or separable sub-tasks, the agent starts sub-agents with fresh context windows, or hands a task to another organisation's agent via A2A. They work in parallel and return condensed results, so the main context stays clean.",
      blocks: ["subagents", "multi-agent", "a2a", "workflows"], conn: ["c-dele"], station: "run" },
    { title: "Keep the context healthy",
      text: "As the window fills, the harness compacts older turns into a summary and clears stale tool results. The agent writes progress notes and decisions to memory files, so nothing important is lost.",
      blocks: ["compaction", "context-engineering", "memory", "context-window"], conn: [], station: "assemble" },
    { title: "Verify the work",
      text: "Before declaring success, the agent checks its work against ground truth: it runs tests and linters, renders the interface, validates the output format, or asks a reviewer agent. Failures send it back into the loop.",
      blocks: ["verification", "sandbox", "guardrails"], conn: ["c-tool"], station: "run" },
    { title: "Hand over the result",
      text: "The agent delivers an answer, a document or a pull request. A stop hook can refuse to let it finish until the checks pass. Irreversible or external actions (merge, send, pay) wait for human approval.",
      blocks: ["surfaces", "hitl", "hooks"], conn: ["c-task"], station: "exit" },
    { title: "Measure and improve",
      text: "Every step was traced: tokens, cost, tool calls, errors. Evals score the outcome. You review failures and improve instructions, skills, tools and permissions, and the agent's memory carries lessons into the next run.",
      blocks: ["observability", "evals", "cost", "skills", "playbooks", "instructions"], conn: ["c-ops"] },
    { title: "Scale out",
      text: "Once a flow works reliably, run it unattended: on schedules or events, in background cloud sandboxes, many in parallel, with budgets, audit logs and a named owner.",
      blocks: ["long-running", "triggers", "governance", "sandbox"], conn: ["c-ops", "c-task"] }
  ];

  /* ---------------------------------------------------------------------------
     Context window anatomy (illustrative shares of a 200K-token window)
     ------------------------------------------------------------------------- */
  var context = {
    rows: [
      { title: "Turn 1: the session starts", meta: "about 24,000 of 200,000 tokens in use", cache: 10.5,
        segs: [
          { label: "System prompt", pct: 2.5, zone: "harness", cls: "strong" },
          { label: "Tool definitions", pct: 6, zone: "tools", cls: "strong" },
          { label: "Instruction files", pct: 1.5, zone: "harness" },
          { label: "Skill descriptions", pct: 0.5, zone: "know" },
          { label: "Memory", pct: 1, zone: "harness" },
          { label: "Your task", pct: 0.5, zone: "start", cls: "strong" },
          { label: "Free", pct: 88, cls: "free" }
        ],
        caption: "Only the names and one-line descriptions of skills are loaded, not their full text. Tool definitions are often the largest fixed cost; tool search can defer most of them." },
      { title: "Turn 40, nothing managed", meta: "about 186,000 of 200,000 tokens in use", cache: 11,
        segs: [
          { label: "Fixed prefix", full: "Fixed prefix (system, tools, instructions, skills, memory)", pct: 11, zone: "harness", cls: "strong" },
          { label: "Conversation & reasoning", pct: 15, zone: "model" },
          { label: "Raw tool results: file dumps, logs, search hits", full: "Raw tool results", pct: 52, zone: "tools", cls: "danger" },
          { label: "Loaded skill", pct: 3, zone: "know", cls: "strong" },
          { label: "Retrieved documents", pct: 12, zone: "know" },
          { label: "Free", pct: 7, cls: "free" }
        ],
        caption: "Raw tool output dominates. Every turn re-sends all of it, so each turn is expensive, and quality drops as the relevant facts get buried. This is **context rot**." },
      { title: "Turn 40, with context engineering", meta: "about 66,000 of 200,000 tokens in use", cache: 11,
        segs: [
          { label: "Fixed prefix", pct: 11, zone: "harness", cls: "strong" },
          { label: "Summary", full: "Summary of earlier turns", pct: 4, zone: "harness" },
          { label: "Recent turns", pct: 9, zone: "model" },
          { label: "Results", full: "Concise tool results", pct: 7, zone: "tools" },
          { label: "Skill", full: "Loaded skill", pct: 2, zone: "know", cls: "strong" },
          { label: "Free", pct: 67, cls: "free" }
        ],
        subs: { label: "Sub-agents did the heavy reading in their own windows and returned summaries:",
          bars: [
            { title: "Sub-agent 1 context: mostly tool results, discarded afterwards", segs: [{ pct: 10, zone: "harness", cls: "strong" }, { pct: 62, zone: "tools" }, { pct: 28, cls: "free" }] },
            { title: "Sub-agent 2 context: mostly tool results, discarded afterwards", segs: [{ pct: 10, zone: "harness", cls: "strong" }, { pct: 48, zone: "tools" }, { pct: 42, cls: "free" }] }
          ] },
        caption: "[[compaction|Compaction]] summarised older turns, tool results were trimmed, and exploration ran in [[subagents]]. Progress notes on disk let the agent recover after any reset." }
    ],
    legend: [
      { zone: "harness", label: "System prompt, instructions, memory, summaries" },
      { zone: "tools", label: "Tool definitions and results" },
      { zone: "know", label: "Skills, playbooks, retrieved knowledge" },
      { zone: "model", label: "Model output and reasoning" },
      { zone: "start", label: "Your task" }
    ],
    note: "Proportions are illustrative, not measurements. Real numbers depend on the harness, the tools and the task."
  };

  /* ---------------------------------------------------------------------------
     Easily confused: comparison table. detCol = index of the "Deterministic?" cell.
     ------------------------------------------------------------------------- */
  var compare = {
    columns: ["Block", "What it is", "Who activates it", "When it enters the context", "Context cost", "Deterministic?", "Best for"],
    detCol: 4,
    rows: [
      { block: "system-prompt", cells: ["Standing instructions written by whoever builds the agent", "The harness, on every call", "At the very start of every request", "Always paid; cache it", "No", "Role, global rules, output format"] },
      { block: "instructions", cells: ["Markdown file in the project or home folder (AGENTS.md, CLAUDE.md…)", "The harness loads it automatically", "At session start", "Always paid; keep it short", "No", "Build commands, conventions, project map"] },
      { block: "memory", cells: ["Facts and notes kept across sessions", "The agent writes it; the harness or agent reads it", "At session start or when recalled", "Varies with what is recalled", "No", "Preferences, decisions, progress"] },
      { block: "skills", cells: ["Folder with a SKILL.md plus optional scripts and files", "The model, when a task matches the description, or the user by name", "Description at start; full text only when used", "Tiny until used", "Partly: bundled scripts are", "Repeatable procedures and domain know-how"] },
      { block: "playbooks", cells: ["A written step-by-step procedure for a recurring task", "A person or an orchestrating agent", "When that task starts", "Moderate, only for that task", "No", "Standardising multi-step processes"] },
      { block: "commands", cells: ["A saved prompt template triggered by name, such as `/review`. In most harnesses now a skill invoked by name", "The user, explicitly", "When invoked", "Only when used", "No", "Shortcuts for frequent requests"] },
      { block: "tools", cells: ["A function the model can ask the harness to run", "The model decides; the harness executes", "Definition on every turn; result when called", "Definitions every turn; results can be large", "Yes: the code runs as written", "Live data and actions"] },
      { block: "mcp", cells: ["A server exposing tools, data and prompts through a standard protocol", "The harness connects; the model calls its tools", "Tool definitions at start, or later via tool search", "Can be large with many servers", "Yes, for the tools", "Reusable integrations across agents"] },
      { block: "plugins", cells: ["An installable bundle of skills, commands, sub-agents, hooks and MCP servers", "The user installs it; its contents behave as usual", "Depends on what it contains", "Sum of its contents", "Partly", "Sharing a whole setup with a team"] },
      { block: "hooks", cells: ["A script the harness runs at a lifecycle event", "The harness, automatically", "Usually never; its output can be injected", "Near zero", "Yes", "Rules that must always hold"] },
      { block: "subagents", cells: ["A separate agent instance with its own context window", "The main agent, or the user", "Only its final summary returns", "Saves main context; more tokens overall", "No", "Exploration, parallel work, specialist roles"] },
      { block: "rag", cells: ["Retrieval of relevant passages from an indexed knowledge base", "A pipeline step, or the model as a tool", "Per query, as retrieved chunks", "Proportional to what is retrieved", "Partly: retrieval is, the answer is not", "Large, changing, private knowledge"] }
    ]
  };

  /* ---------------------------------------------------------------------------
     Decision guide: "I want my agent to…" → blocks
     ------------------------------------------------------------------------- */
  var decide = [
    { need: "know my project's conventions in every session", use: ["instructions"], why: "A short AGENTS.md or CLAUDE.md is loaded automatically at the start of every session." },
    { need: "follow a multi-step procedure the same way every time", use: ["skills", "playbooks"], why: "Write the procedure once; it loads only when a matching task appears. Put deterministic parts in scripts." },
    { need: "answer questions from thousands of internal documents", use: ["rag", "embeddings"], why: "Index the documents and retrieve the relevant passages per question, with citations." },
    { need: "find its way around a large codebase", use: ["search", "subagents"], why: "Grep and read beat a vector index for code; a sub-agent keeps the exploration out of the main context." },
    { need: "act in GitHub, Jira, Slack or a database", use: ["mcp", "tools"], why: "Connect an MCP server or define functions. Prefer a few task-shaped tools." },
    { need: "never run destructive commands or touch production", use: ["permissions", "hooks", "sandbox"], why: "Enforce it in code. A sentence in the prompt is a suggestion, not a guarantee." },
    { need: "run a shortcut I type all the time", use: ["commands", "skills"], why: "A slash command stores the prompt and fills in arguments. In most harnesses you now write it as a skill and invoke it by name." },
    { need: "share our whole setup with the team", use: ["plugins"], why: "Bundle skills, commands, hooks and MCP servers into one versioned install." },
    { need: "remember my preferences across sessions", use: ["memory"], why: "Let the agent keep notes in files or a memory store, visible and editable." },
    { need: "handle a fixed sequence such as extract, transform, write", use: ["workflows"], why: "Prompt chaining in code is cheaper and more predictable than an autonomous agent." },
    { need: "treat different requests differently", use: ["workflows", "model"], why: "Routing: classify first, then send each request to a specialised prompt or a cheaper model." },
    { need: "research several independent threads at once", use: ["multi-agent", "subagents"], why: "Orchestrator-workers: a lead agent fans out parallel searches and synthesises the results." },
    { need: "work for hours on a big task", use: ["long-running", "memory", "compaction"], why: "Use progress files, checkpoints, compaction and tests, with budgets." },
    { need: "start on a schedule or react to events", use: ["triggers", "long-running"], why: "Cron, webhooks or CI events start background runs that report back." },
    { need: "operate a website or desktop app that has no API", use: ["computer-use"], why: "Use it as a last resort; supervise it and prefer real APIs when they exist." },
    { need: "work with another company's agent", use: ["a2a"], why: "A2A lets agents on different platforms exchange tasks without exposing their internals." },
    { need: "produce output another program can read", use: ["tools"], why: "Use structured outputs: JSON constrained by a schema." },
    { need: "know about current events and prices", use: ["search"], why: "Give it a web search tool and require citations." },
    { need: "be cheaper and faster", use: ["cost", "model"], why: "Cache the prompt prefix, route easy steps to small models, lower the effort, batch jobs that can wait." },
    { need: "be reliably good, not just impressive in a demo", use: ["evals", "verification"], why: "Measure on real tasks, and let the agent check its own work against tests." },
    { need: "stay safe with emails, web pages and other untrusted content", use: ["security", "guardrails", "hitl"], why: "Break the lethal trifecta: remove one leg, or require approval for outbound actions." },
    { need: "be compliant in the EU", use: ["governance", "observability", "hitl"], why: "Classify the use case under the AI Act, protect personal data, keep logs and real human oversight." },
    { need: "think harder on difficult steps", use: ["reasoning"], why: "Raise the effort or thinking budget only where it pays off." },
    { need: "write in a very specific style that prompting can't reach", use: ["fine-tuning"], why: "Fine-tune as a last resort, once evals show prompting, examples and skills have plateaued." }
  ];

  /* ---------------------------------------------------------------------------
     Patterns with mini diagrams (coordinates in each SVG's own viewBox)
     ------------------------------------------------------------------------- */
  var patterns = [
    { id: "augmented", name: "Augmented model", kind: "Building block", autonomy: 1, cost: 1, predictability: 5,
      what: "One model call that can use retrieval, tools and memory. The model decides whether to use them.",
      use: "a single, well-defined question or action, such as answering from documents or calling one API.",
      example: "A support bot that looks up the order status before answering.",
      blocks: ["model", "tools", "rag", "memory"],
      alt: "Input goes to one model call; the model can query retrieval, tools and memory, then produces output.",
      svg: { w: 340, h: 118,
        nodes: [
          { x: 63, y: 8, w: 66, h: 26, t: "Retrieval", k: "tool" },
          { x: 137, y: 8, w: 66, h: 26, t: "Tools", k: "tool" },
          { x: 211, y: 8, w: 66, h: 26, t: "Memory", k: "tool" },
          { x: 10, y: 66, w: 56, h: 34, t: "In", k: "io" },
          { x: 128, y: 62, w: 84, h: 42, t: "Model", k: "llm" },
          { x: 274, y: 66, w: 56, h: 34, t: "Out", k: "io" }
        ],
        edges: [
          { d: "M66 83H124" }, { d: "M212 83H270" },
          { d: "M96 34L148 60", dashed: true, both: true },
          { d: "M170 34V58", dashed: true, both: true },
          { d: "M244 34L192 60", dashed: true, both: true }
        ],
        labels: [{ x: 164, y: 50, t: "query", a: "end" }, { x: 176, y: 50, t: "results", a: "start" }] } },
    { id: "chaining", name: "Prompt chaining", kind: "Workflow", autonomy: 1, cost: 2, predictability: 5,
      what: "A task split into fixed steps, each call working on the previous output, with checks in between.",
      use: "the steps are known and each one is easier on its own.",
      example: "Write an outline, check it against the brief, then write the article.",
      blocks: ["workflows", "verification"],
      alt: "Input goes to step 1, then a check; if it passes it goes to step 2 and out, if it fails the chain stops.",
      svg: { w: 340, h: 134,
        nodes: [
          { x: 6, y: 44, w: 40, h: 30, t: "In", k: "io" },
          { x: 64, y: 40, w: 62, h: 38, t: "Step 1", k: "llm" },
          { x: 146, y: 44, w: 48, h: 30, t: "Check", k: "gate" },
          { x: 214, y: 40, w: 62, h: 38, t: "Step 2", k: "llm" },
          { x: 294, y: 44, w: 40, h: 30, t: "Out", k: "io" },
          { x: 146, y: 102, w: 48, h: 26, t: "Stop", k: "io" }
        ],
        edges: [
          { d: "M46 59H60" }, { d: "M126 59H142" },
          { d: "M194 59H210", l: "pass", lx: 202, ly: 36 },
          { d: "M276 59H290" },
          { d: "M170 74V98", l: "fail", lx: 176, ly: 90, la: "start" }
        ] } },
    { id: "routing", name: "Routing", kind: "Workflow", autonomy: 2, cost: 2, predictability: 4,
      what: "A first call classifies the input and sends it down one of several specialised paths.",
      use: "inputs fall into distinct categories that are better handled separately, or by models of different sizes.",
      example: "Support tickets routed to billing, technical help or a human; easy questions to a small model.",
      blocks: ["workflows", "model", "cost"],
      alt: "Input goes to a router, which picks exactly one of three paths: billing flow, tech support or escalate; the chosen path produces the output.",
      svg: { w: 340, h: 150,
        nodes: [
          { x: 6, y: 60, w: 40, h: 30, t: "In", k: "io" },
          { x: 62, y: 56, w: 72, h: 38, t: "Router", k: "llm" },
          { x: 176, y: 14, w: 96, h: 30, t: "Billing flow", k: "llm" },
          { x: 176, y: 60, w: 96, h: 30, t: "Tech support", k: "llm" },
          { x: 176, y: 106, w: 96, h: 30, t: "Escalate", k: "human" },
          { x: 296, y: 60, w: 38, h: 30, t: "Out", k: "io" }
        ],
        edges: [
          { d: "M46 75H58" },
          { d: "M134 75L172 31" }, { d: "M134 75H172" }, { d: "M134 75L172 119" },
          { d: "M272 29L293 68", dashed: true }, { d: "M272 75H292", dashed: true }, { d: "M272 121L293 82", dashed: true }
        ] } },
    { id: "parallel", name: "Parallelization", kind: "Workflow", autonomy: 2, cost: 3, predictability: 4,
      what: "Independent sub-tasks run at the same time (sectioning), or the same task runs several times and the results are compared (voting).",
      use: "parts don't depend on each other, or you want more confidence through several attempts.",
      example: "Checking a contract for several kinds of risk at once; one call answers while another screens for policy issues.",
      blocks: ["workflows", "guardrails"],
      alt: "Input fans out to three sub-tasks that run simultaneously; an aggregator combines their results into the output.",
      svg: { w: 340, h: 160,
        nodes: [
          { x: 6, y: 70, w: 40, h: 30, t: "In", k: "io" },
          { x: 80, y: 24, w: 78, h: 30, t: "Sub-task 1", k: "llm" },
          { x: 80, y: 70, w: 78, h: 30, t: "Sub-task 2", k: "llm" },
          { x: 80, y: 116, w: 78, h: 30, t: "Sub-task 3", k: "llm" },
          { x: 196, y: 66, w: 84, h: 38, t: "Aggregate", k: "tool" },
          { x: 296, y: 70, w: 38, h: 30, t: "Out", k: "io" }
        ],
        edges: [
          { d: "M46 85L76 41" }, { d: "M46 85H76" }, { d: "M46 85L76 129" },
          { d: "M158 39L192 78" }, { d: "M158 85H192" }, { d: "M158 131L192 92" },
          { d: "M280 85H292" }
        ],
        labels: [] } },
    { id: "orchestrator", name: "Orchestrator-workers", kind: "Workflow / agent", autonomy: 3, cost: 4, predictability: 3,
      what: "A lead model breaks the task down at run time, delegates the pieces to workers and synthesises their results. Unlike parallelization, the sub-tasks are not fixed in advance.",
      use: "you can't predict the sub-tasks, for example which files need changing or which sources to search.",
      example: "A coding agent that decides which files to change and hands each change to a worker.",
      blocks: ["subagents", "multi-agent", "workflows"],
      alt: "Input goes to an orchestrator, which delegates to a variable number of workers; a synthesiser combines their results.",
      svg: { w: 340, h: 158,
        nodes: [
          { x: 4, y: 64, w: 34, h: 30, t: "In", k: "io" },
          { x: 54, y: 58, w: 84, h: 42, t: "Orchestrator", k: "llm" },
          { x: 166, y: 14, w: 64, h: 28, t: "Worker", k: "agent" },
          { x: 166, y: 50, w: 64, h: 28, t: "Worker", k: "agent" },
          { x: 166, y: 86, w: 64, h: 28, t: "Worker", k: "agent" },
          { x: 166, y: 122, w: 64, h: 28, t: "+ more", k: "io" },
          { x: 258, y: 58, w: 78, h: 42, t: "Synthesise", k: "llm" }
        ],
        edges: [
          { d: "M38 79H50" },
          { d: "M138 79L162 28" }, { d: "M138 79L162 64" }, { d: "M138 79L162 100" }, { d: "M138 79L162 136", dashed: true },
          { d: "M230 28L254 72" }, { d: "M230 64L254 76" }, { d: "M230 100L254 82" }, { d: "M230 136L254 86", dashed: true }
        ] } },
    { id: "evaluator", name: "Evaluator-optimizer", kind: "Workflow", autonomy: 3, cost: 3, predictability: 3,
      what: "One call generates, another evaluates against clear criteria and gives feedback, and the loop repeats until the result passes.",
      use: "you have clear quality criteria and iterating measurably improves the result.",
      example: "A translation refined until a reviewer model finds no meaning errors; code revised until tests pass.",
      blocks: ["verification", "workflows", "evals"],
      alt: "Input goes to a generator; its draft goes to an evaluator, which either sends feedback back to the generator or accepts the result as output.",
      svg: { w: 340, h: 146,
        nodes: [
          { x: 6, y: 56, w: 40, h: 30, t: "In", k: "io" },
          { x: 72, y: 50, w: 90, h: 42, t: "Generator", k: "llm" },
          { x: 212, y: 50, w: 90, h: 42, t: "Evaluator", k: "llm" },
          { x: 227, y: 114, w: 60, h: 26, t: "Out", k: "io" }
        ],
        edges: [
          { d: "M46 71H68" },
          { d: "M162 62H208", l: "draft", lx: 185, ly: 56 },
          { d: "M212 82H166", l: "feedback", lx: 189, ly: 102 },
          { d: "M257 92V110", l: "accepted", lx: 264, ly: 106, la: "start" }
        ] } },
    { id: "agent", name: "Autonomous agent", kind: "Agent", autonomy: 4, cost: 4, predictability: 2,
      what: "The model runs in a loop, choosing its own actions from environment feedback until the goal is met or a limit is hit.",
      use: "open-ended problems where the steps can't be predicted and you trust the environment's feedback, such as tests.",
      example: "A coding agent that resolves an issue end to end; a desktop agent that compiles a report from many sources.",
      blocks: ["agent-loop", "harness", "tools", "verification"],
      alt: "A human gives the agent a task; the agent acts on the environment and receives feedback in a loop, asks the human when needed, and stops when done or out of budget.",
      svg: { w: 340, h: 150,
        nodes: [
          { x: 6, y: 56, w: 56, h: 34, t: "Human", k: "human" },
          { x: 110, y: 50, w: 96, h: 46, t: "Agent (model)", k: "llm" },
          { x: 250, y: 50, w: 84, h: 46, t: "Environment", k: "tool" },
          { x: 128, y: 120, w: 60, h: 24, t: "Stop", k: "io" }
        ],
        edges: [
          { d: "M62 64H106", l: "task", lx: 84, ly: 58 },
          { d: "M106 84H66", l: "asks", lx: 86, ly: 100 },
          { d: "M206 62H246", l: "action", lx: 226, ly: 56 },
          { d: "M246 84H210", l: "feedback", lx: 228, ly: 100 },
          { d: "M158 96V116", l: "done or budget", lx: 166, ly: 112, la: "start" }
        ] } },
    { id: "team", name: "Multi-agent team", kind: "Agent system", autonomy: 5, cost: 5, predictability: 1,
      what: "A lead agent coordinates specialist agents, each with its own context, tools and permissions, sharing a task list and files.",
      use: "broad work with separable parts, or when separating duties (and permissions) matters.",
      example: "A research lead with three searcher agents; a coder, a tester and a reviewer working on one feature.",
      blocks: ["multi-agent", "subagents", "a2a", "memory"],
      alt: "A lead agent assigns work to a researcher, a coder and a reviewer and receives reports; the specialists share a task list and files.",
      svg: { w: 340, h: 182,
        nodes: [
          { x: 118, y: 8, w: 104, h: 36, t: "Lead agent", k: "agent" },
          { x: 8, y: 96, w: 96, h: 34, t: "Researcher", k: "agent" },
          { x: 122, y: 96, w: 96, h: 34, t: "Coder", k: "agent" },
          { x: 236, y: 96, w: 96, h: 34, t: "Reviewer", k: "agent" },
          { x: 86, y: 148, w: 168, h: 28, t: "Shared task list & files", k: "tool" }
        ],
        edges: [
          { d: "M150 44L62 92", both: true },
          { d: "M170 44V92", both: true },
          { d: "M190 44L278 92", both: true, l: "assigns · reports", lx: 244, ly: 62, la: "start" },
          { d: "M56 130L120 146", dashed: true, both: true },
          { d: "M170 130V144", dashed: true, both: true },
          { d: "M284 130L220 146", dashed: true, both: true }
        ] } }
  ];

  /* ---------------------------------------------------------------------------
     Build your own flow
     ------------------------------------------------------------------------- */
  var ladder = [
    { name: "A single prompt", what: "One model call with clear instructions and a few examples, in a chat or through one API request.", climb: "the task needs facts the model lacks, or actions in other systems." },
    { name: "Augmented model", what: "One call that can use retrieval, tools and memory; the model decides when to use them.", climb: "the work has distinct stages that need checks in between." },
    { name: "Workflow", what: "Your code chains several calls: prompt chaining, routing, parallelization. Every path is defined in advance.", climb: "the steps can't be known in advance, or depend on what is discovered along the way." },
    { name: "One agent in a harness", what: "One model in a loop with tools, skills and permissions decides its own steps. Most coding and knowledge-work agents live here.", climb: "exploration floods the context, or independent parts could run in parallel." },
    { name: "Agent with sub-agents", what: "The main agent delegates focused jobs to helpers with fresh context windows and gets summaries back.", climb: "the problem is broad, runs for a long time, or crosses team or company boundaries." },
    { name: "Agent teams and long-running autonomy", what: "Several cooperating agents, background agents on schedules, agents working with other organisations' agents via A2A. The most capability, cost and risk.", climb: "there is no higher rung. Invest in evals, observability and governance instead." }
  ];

  var recipe = [
    { title: "Define the job and what “done” means", text: "Write down 10 to 20 real example tasks with the outcome you expect. This is your first eval set and your specification.", blocks: ["evals"] },
    { title: "Start on the lowest rung", text: "Try a single well-prompted call first. Move up the ladder only when your examples fail for a reason the next rung fixes.", blocks: ["workflows", "system-prompt"] },
    { title: "Pick a harness instead of writing a loop", text: "For coding and knowledge work, start with an existing agent. For a product, use an agent SDK. Your own loop is rarely what limits quality.", blocks: ["harness", "sdk"] },
    { title: "Choose models by role", text: "A frontier model for planning and hard steps; smaller, faster models for routing, extraction and sub-agents. Set the reasoning effort per step.", blocks: ["model", "reasoning", "provider"] },
    { title: "Write a short instruction file", text: "Commands, conventions, project layout and hard-won lessons in AGENTS.md (or your harness's equivalent). Keep it short and current.", blocks: ["instructions"] },
    { title: "Connect a few good tools", text: "Expose systems through MCP servers or functions. Prefer a few task-shaped tools with clear names, helpful errors and concise output. With many tools, use tool search.", blocks: ["tools", "mcp"] },
    { title: "Package procedures as skills", text: "Turn your SOPs and playbooks into skills: a precise description for triggering, focused instructions, and scripts for the deterministic parts.", blocks: ["skills", "playbooks"] },
    { title: "Make the hard rules deterministic", text: "Enforce must-never-happen rules with permissions, hooks and a sandbox, not with wording. Check the lethal trifecta before combining private data, untrusted input and outbound channels.", blocks: ["permissions", "hooks", "sandbox", "security"] },
    { title: "Engineer the context", text: "Keep it lean: a stable prefix first, sub-agents for exploration, compaction and progress files for long tasks, retrieval instead of pasting.", blocks: ["context-engineering", "subagents", "compaction", "memory"] },
    { title: "Close the loop with verification", text: "Give the agent objective checks such as tests, linters, type checks, screenshots, schema validation or a reviewer, and make “done” depend on them.", blocks: ["verification"] },
    { title: "Put people at the right gates", text: "Approve plans and irreversible actions, review the final output, and widen autonomy as evidence accumulates.", blocks: ["hitl", "planning"] },
    { title: "Observe, evaluate, improve", text: "Trace every run, read the failures, fix the cause (instructions, skills, tools, permissions) and re-run the eval set. Watch cost per successful task.", blocks: ["observability", "evals", "cost"] }
  ];

  var flows = [
    { name: "Fix a bug from an issue",
      goal: "A coding agent picks up a labelled issue and opens a tested pull request.",
      route: [
        { b: "triggers", n: "issue labelled" }, { b: "long-running", n: "cloud run" }, { b: "instructions", n: "AGENTS.md" },
        { b: "planning", n: "plan & to-dos" }, { b: "search", n: "grep & read" }, { b: "sandbox", n: "edit & run" },
        { b: "hooks", n: "lint on edit" }, { b: "verification", n: "tests pass" }, { b: "hitl", n: "PR review" }, { b: "observability", n: "trace" }
      ],
      why: "Deterministic checks (hooks and tests) plus a human review gate make an autonomous run safe to merge." },
    { name: "Research report with citations",
      goal: "A lead agent answers a broad question by fanning out parallel searches.",
      route: [
        { b: "surfaces", n: "question" }, { b: "planning", n: "research plan" }, { b: "multi-agent", n: "lead agent" },
        { b: "subagents", n: "3 to 5 searchers" }, { b: "search", n: "web search" }, { b: "memory", n: "plan saved" },
        { b: "verification", n: "citation check" }, { b: "surfaces", n: "report" }
      ],
      why: "Breadth-first work parallelises well and sub-agents keep the lead's context small. Expect many times the tokens of a single chat." },
    { name: "Customer support triage",
      goal: "Every new ticket is classified, answered from the help centre, or handed to a person.",
      route: [
        { b: "triggers", n: "new ticket" }, { b: "workflows", n: "routing" }, { b: "rag", n: "help-centre search" },
        { b: "mcp", n: "CRM tools" }, { b: "guardrails", n: "PII & policy" }, { b: "hitl", n: "refunds approved" },
        { b: "evals", n: "weekly review" }, { b: "observability", n: "dashboards" }
      ],
      why: "A fixed workflow with one agentic step is cheaper and more predictable than a fully autonomous agent." },
    { name: "Weekly business report",
      goal: "Every Monday an agent pulls the numbers, builds charts and posts a summary.",
      route: [
        { b: "triggers", n: "schedule" }, { b: "mcp", n: "warehouse & docs" }, { b: "skills", n: "report skill" },
        { b: "sandbox", n: "code for charts" }, { b: "verification", n: "cross-check totals" }, { b: "surfaces", n: "post to chat" }, { b: "cost", n: "cache & batch" }
      ],
      why: "A skill keeps the format and branding consistent; running code makes the numbers reproducible." }
  ];

  var pairs = [
    { bad: "An autonomous agent for a process whose steps you already know.", good: "A workflow (chaining or routing) with an agent step only where judgement is needed." },
    { bad: "A 2,000-line instruction file that tries to cover everything.", good: "A short instruction file plus skills that load only when they are needed." },
    { bad: "Twenty MCP servers with hundreds of tools in every session.", good: "Only the servers the task needs, tool search, or tools called from code." },
    { bad: "“Never delete production data” in the prompt, and hope.", good: "Deny it with permissions, block it with a hook, and keep production credentials out of reach." },
    { bad: "Several agents editing the same files in parallel without a shared plan.", good: "Parallelise only independent work; give each agent a clear brief and its own area, with one integrator." },
    { bad: "Judging quality by trying a few prompts by hand.", good: "An eval set of real tasks, graded automatically and re-run on every change." },
    { bad: "One agent with private data, web browsing and the ability to send email.", good: "Break the lethal trifecta: remove one leg, or require approval for outbound actions." },
    { bad: "Raw logs and whole files piling up in the context.", good: "Concise tool output, summaries, and sub-agents for the heavy reading." },
    { bad: "Unattended runs without limits.", good: "Caps on turns, time and spend; checkpoints; alerts on failure." },
    { bad: "Picking a model from a leaderboard alone.", good: "Shortlist with public benchmarks, decide with your own evals, cost and latency." },
    { bad: "Fine-tuning to teach the model your changing product facts.", good: "Retrieval for facts; fine-tuning only for stable style, format or narrow skills." }
  ];

  var checklist = [
    { k: "done", t: "The task, its inputs and the definition of done are written down." },
    { k: "evals", t: "An eval set of at least 20 real tasks with pass/fail criteria exists." },
    { k: "ladder", t: "We chose the lowest rung of the ladder that passes the evals." },
    { k: "models", t: "Models are chosen per role, with reasoning effort set per step." },
    { k: "instructions", t: "The instruction file is short, current and reviewed like code." },
    { k: "tools", t: "Tools have clear names and descriptions, helpful errors and concise output." },
    { k: "skills", t: "Recurring procedures are packaged as skills with precise descriptions." },
    { k: "perms", t: "Permissions follow least privilege; destructive actions are denied or need approval." },
    { k: "sandbox", t: "The agent runs in a sandbox with restricted network access." },
    { k: "trifecta", t: "No session combines private data, untrusted content and outbound communication without a human gate." },
    { k: "supply", t: "Third-party MCP servers, skills and plugins are reviewed and pinned." },
    { k: "verify", t: "The agent can verify its own work with tests, checks or a reviewer." },
    { k: "trace", t: "Every run is traced: tokens, cost, tool calls and errors." },
    { k: "budget", t: "Unattended runs have limits on turns, time and spend." },
    { k: "gov", t: "Personal data, retention and AI Act obligations have been checked." },
    { k: "owner", t: "A named person owns the agent and reviews its failures regularly." }
  ];

  /* ---------------------------------------------------------------------------
     Protocols & standards (status as of the snapshot date)
     ------------------------------------------------------------------------- */
  var protocols = [
    { group: "Agents, tools and context", name: "MCP (Model Context Protocol)", block: "mcp", url: "https://modelcontextprotocol.io",
      connects: "Agents ↔ tools, data and prompts",
      origin: "Anthropic, November 2024",
      governance: "Agentic AI Foundation (Linux Foundation) since December 2025; maintainers decide through enhancement proposals",
      status: "Current revision 2026-07-28: a stateless core plus formal extensions (long-running Tasks, MCP Apps, enterprise authorisation). Supported by virtually every major model vendor and harness.",
      sources: ["https://modelcontextprotocol.io/specification/2026-07-28/changelog", "https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/"] },
    { group: "Agents, tools and context", name: "A2A (Agent2Agent)", block: "a2a", url: "https://a2a-protocol.org",
      connects: "Agent ↔ agent, across vendors and frameworks",
      origin: "Google, April 2025",
      governance: "Linux Foundation project since June 2025; part of the Agentic AI Foundation since August 2026",
      status: "Version 1.0 (March 2026): signed Agent Cards, JSON-RPC, gRPC and HTTP bindings. IBM's Agent Communication Protocol merged into A2A in 2025.",
      sources: ["https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/", "https://aaif.io/blog/a2a-joins-aaif"] },
    { group: "Agents, tools and context", name: "AGENTS.md", block: "instructions", url: "https://agents.md",
      connects: "Repository ↔ coding agents (standing instructions)",
      origin: "OpenAI Codex, Amp, Google Jules, Cursor and Factory, 2025",
      governance: "Agentic AI Foundation since December 2025",
      status: "Plain Markdown with no required fields; the nearest file in the folder tree wins. Used by more than 60,000 open-source projects and read by most coding agents.",
      sources: ["https://agents.md/"] },
    { group: "Agents, tools and context", name: "Agent Skills", block: "skills", url: "https://agentskills.io",
      connects: "Packaged know-how (folders with a SKILL.md) ↔ any compatible agent",
      origin: "Anthropic, October 2025; open standard since December 2025",
      governance: "Open specification developed on GitHub",
      status: "Small, stable spec (only name and description are required). Supported by more than 40 agents, including Claude Code, Codex, Antigravity, GitHub Copilot, VS Code and Cursor.",
      sources: ["https://agentskills.io/specification"] },
    { group: "Agents, tools and context", name: "WebMCP", block: "tools", url: "https://webmachinelearning.github.io/webmcp/",
      connects: "Web page ↔ in-browser agent: the page exposes its own tools",
      origin: "W3C Web Machine Learning Community Group, with editors from Microsoft and Google",
      governance: "W3C Community Group draft, not on the W3C standards track",
      status: "Draft report updated in October 2026; ChatGPT supports it as “site tools”.",
      sources: ["https://webmachinelearning.github.io/webmcp/"] },
    { group: "User interfaces", name: "MCP Apps", block: "surfaces", url: "https://modelcontextprotocol.io/extensions/apps/overview",
      connects: "MCP tools ↔ interactive UI inside a chat",
      origin: "MCP maintainers with OpenAI (Apps SDK) and the MCP-UI community; live since January 2026",
      governance: "Official MCP extension",
      status: "Tools return HTML interfaces that the client renders in a sandboxed frame. Supported in Claude, ChatGPT, VS Code Copilot, Microsoft 365 Copilot, Cursor and Goose.",
      sources: ["https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/", "https://modelcontextprotocol.io/extensions/client-matrix"] },
    { group: "User interfaces", name: "AG-UI", block: "surfaces", url: "https://docs.ag-ui.com",
      connects: "Agent back end ↔ application front end, as a stream of typed events",
      origin: "CopilotKit, May 2025",
      governance: "Open-source community project",
      status: "Integrations with Microsoft Agent Framework, Google ADK, AWS Strands and Bedrock AgentCore, Mastra, Pydantic AI, LlamaIndex and others.",
      sources: ["https://docs.ag-ui.com/introduction"] },
    { group: "User interfaces", name: "Agent Client Protocol", block: "surfaces", url: "https://agentclientprotocol.com",
      connects: "Code editor ↔ coding agent (often described as “LSP for agents”)",
      origin: "Zed, August 2025",
      governance: "Zed and JetBrains, with a stated plan to move to an independent foundation",
      status: "Version 1 stable, SDKs at 1.0 (June 2026), version 2 in draft. Used by Zed, JetBrains IDEs and Devin Desktop. Not the same as the Agentic Commerce Protocol, which shares the abbreviation ACP.",
      sources: ["https://agentclientprotocol.com/updates", "https://zed.dev/acp"] },
    { group: "User interfaces", name: "A2UI", block: "surfaces", url: "https://a2ui.org",
      connects: "Agent → user interface built from the client's own native components",
      origin: "Google, December 2025",
      governance: "Google-led open source (Apache 2.0)",
      status: "Version 0.9 in production use, 1.0 as a release candidate. Can travel over A2A, AG-UI or MCP.",
      sources: ["https://a2ui.org/"] },
    { group: "Observability", name: "OpenTelemetry GenAI conventions", block: "observability", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
      connects: "Agents ↔ observability tools",
      origin: "OpenTelemetry project",
      governance: "Cloud Native Computing Foundation (CNCF)",
      status: "Standard spans and metrics for model calls, agents, tools and MCP. Still marked as in development, not yet stable.",
      sources: ["https://github.com/open-telemetry/semantic-conventions-genai"] },
    { group: "Payments and commerce", name: "AP2 (Agent Payments Protocol)", url: "https://ap2-protocol.org",
      connects: "Shopping agent ↔ merchant ↔ payment networks, through signed mandates",
      origin: "Google, September 2025",
      governance: "FIDO Alliance since April 2026",
      status: "Version 0.2 adds payments while the person is not present, under pre-approved mandates.",
      sources: ["https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/"] },
    { group: "Payments and commerce", name: "ACP (Agentic Commerce Protocol)", url: "https://www.agenticcommerce.dev",
      connects: "Buyer's agent ↔ merchant ↔ payment provider, for checkout",
      origin: "OpenAI and Stripe, September 2025",
      governance: "OpenAI and Stripe as founding maintainers",
      status: "Date-versioned specification, latest stable 2026-04-17. Powers checkout inside ChatGPT.",
      sources: ["https://www.agenticcommerce.dev/"] },
    { group: "Payments and commerce", name: "UCP (Universal Commerce Protocol)", url: "https://ucp.dev",
      connects: "Agents ↔ businesses across search, cart, checkout and orders",
      origin: "Google with Shopify, Etsy, Wayfair, Target and Walmart, January 2026",
      governance: "Open source (Apache 2.0)",
      status: "Shopping specification published; designed to work with AP2, A2A and MCP.",
      sources: ["https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/"] },
    { group: "Payments and commerce", name: "x402", url: "https://www.x402.org",
      connects: "Agent ↔ paid API or website, via the HTTP 402 status code",
      origin: "Coinbase",
      governance: "x402 Foundation under the Linux Foundation, since July 2026",
      status: "Pay-per-request payments, mostly in stablecoins.",
      sources: ["https://www.x402.org/"] }
  ];

  /* ---------------------------------------------------------------------------
     Glossary
     ------------------------------------------------------------------------- */
  var glossary = [
    { term: "A2A (Agent2Agent)", def: "Open protocol that lets agents from different vendors discover each other through Agent Cards and delegate tasks over standard web transports.", block: "a2a" },
    { term: "Agent", def: "A system in which a language model uses tools in a loop to reach a goal, choosing its own next steps.", block: "agent-loop" },
    { term: "Agent Card", def: "A2A's machine-readable description of an agent: what it can do, where to reach it and how to authenticate.", block: "a2a" },
    { term: "Agent loop", def: "The repeated cycle of model reasoning, tool call and observation that drives an agent.", block: "agent-loop" },
    { term: "Agent SDK", def: "A library that provides the agent loop, tool execution, state and tracing for building agents in code.", block: "sdk" },
    { term: "Agentic AI", def: "Umbrella term for AI systems that pursue goals with some autonomy by planning and taking actions, rather than only answering questions." },
    { term: "Agentic AI Foundation (AAIF)", def: "The Linux Foundation body, formed in December 2025, that hosts MCP, AGENTS.md, goose, A2A and other open agent projects." },
    { term: "Agentic engineering", def: "Professional software development with coding agents, where people stay responsible for reviewed, production-quality results. Often contrasted with vibe coding." },
    { term: "Agent teams", def: "Several full agent sessions coordinated by a lead that share a task list and message each other, unlike sub-agents, which only report back to their caller.", block: "multi-agent" },
    { term: "Auto mode", def: "A permission mode in which a classifier model approves or blocks the agent's actions instead of asking the person each time.", block: "permissions" },
    { term: "Agentic RAG", def: "Retrieval used as a tool inside the agent loop, so the agent decides when and what to retrieve and can refine its queries.", block: "rag" },
    { term: "Agentic search", def: "Finding information with ordinary tools (list files, grep, read, web search) step by step, instead of a pre-built index.", block: "search" },
    { term: "AGENTS.md", def: "An open, cross-tool Markdown file of instructions for coding agents, placed in a repository.", block: "instructions" },
    { term: "Attention", def: "The transformer mechanism that lets each token weigh every other token in the context. Its finite capacity is one reason long contexts degrade.", block: "model" },
    { term: "Augmented LLM", def: "A model enhanced with retrieval, tools and memory: the basic building block of agentic systems.", block: "workflows" },
    { term: "Background agent", def: "An agent that runs asynchronously, often in a cloud sandbox, and reports back with a result such as a pull request.", block: "long-running" },
    { term: "Benchmark", def: "A public, standardised set of tasks used to compare models or agents.", block: "evals" },
    { term: "BM25", def: "A classic keyword-ranking algorithm, often combined with embeddings in hybrid search.", block: "embeddings" },
    { term: "Chain of thought", def: "The intermediate reasoning steps a model writes before its final answer.", block: "reasoning" },
    { term: "Checkpoint", def: "A saved snapshot of an agent's conversation or files that lets you rewind or resume.", block: "long-running" },
    { term: "Chunking", def: "Splitting documents into passages before embedding them for retrieval.", block: "rag" },
    { term: "Code mode", def: "See programmatic tool calling.", block: "tools" },
    { term: "Coding agent", def: "An agent specialised in software work: it reads and edits code, runs commands and tests, and opens pull requests.", block: "harness" },
    { term: "Compaction", def: "Summarising older parts of a conversation so that a long run keeps fitting into the context window.", block: "compaction" },
    { term: "Computer use", def: "A model operating a graphical interface by looking at screenshots and sending mouse and keyboard actions.", block: "computer-use" },
    { term: "Connector", def: "A ready-made integration, usually an MCP server, that links an AI app to a service such as a drive, a calendar or a CRM.", block: "mcp" },
    { term: "Context engineering", def: "Curating the full set of tokens a model sees at each step: instructions, tools, knowledge, history and results.", block: "context-engineering" },
    { term: "Context rot", def: "The decline in a model's accuracy as its context grows longer and noisier.", block: "context-window" },
    { term: "Context window", def: "The maximum number of tokens a model can take in one request, including its reply.", block: "context-window" },
    { term: "Cosine similarity", def: "A measure of how closely two embedding vectors point in the same direction; used to rank search results.", block: "embeddings" },
    { term: "Deep research", def: "Long-running agentic search that reads many sources and synthesises a report with citations.", block: "search" },
    { term: "Distillation", def: "Training a smaller model to imitate the outputs of a larger one.", block: "fine-tuning" },
    { term: "DPO (Direct Preference Optimization)", def: "A fine-tuning method that learns from pairs of preferred and rejected answers, without a separate reward model.", block: "fine-tuning" },
    { term: "Durable execution", def: "Running workflows so that their progress survives crashes and restarts and resumes where it stopped.", block: "long-running" },
    { term: "Effort", def: "An API setting that tells a model how much reasoning, and therefore how many tokens, to spend on a task.", block: "reasoning" },
    { term: "Embedding", def: "A vector of numbers that represents the meaning of a piece of text, an image or code.", block: "embeddings" },
    { term: "Evals", def: "Systematic tests of model or agent behaviour on representative tasks, graded by code, by models or by people.", block: "evals" },
    { term: "Evaluator-optimizer", def: "A workflow in which one call generates and another critiques, repeating until the result passes.", block: "workflows" },
    { term: "Few-shot prompting", def: "Including a handful of examples in the prompt to show the desired behaviour.", block: "system-prompt" },
    { term: "Fine-tuning", def: "Further training a model's weights on your own examples.", block: "fine-tuning" },
    { term: "Foundation model", def: "A large model trained on broad data that can be adapted to many tasks.", block: "model" },
    { term: "Function calling", def: "Another name for tool use: the model returns a structured request to call a function, which your code executes.", block: "tools" },
    { term: "Grounding", def: "Tying a model's answer to verifiable sources such as retrieved documents or search results.", block: "rag" },
    { term: "Guardrails", def: "Checks around a model or agent that block or correct unsafe, off-topic or malformed inputs and outputs.", block: "guardrails" },
    { term: "Hallucination", def: "A confident but false or unsupported statement produced by a model.", block: "model" },
    { term: "Handoff", def: "Transferring a conversation or task from one agent to another, more specialised agent.", block: "multi-agent" },
    { term: "Harness", def: "The runtime around a model that runs the loop, manages the context, executes tools and enforces rules.", block: "harness" },
    { term: "Harness engineering", def: "Designing an agent's environment (tools, documentation, tests, feedback loops and constraints) so that agents can do reliable work.", block: "harness" },
    { term: "Hooks", def: "User-defined scripts that a harness runs automatically at lifecycle events, such as before a tool call.", block: "hooks" },
    { term: "Human-in-the-loop", def: "Explicit points where a person approves, corrects or takes over an agent's work.", block: "hitl" },
    { term: "Hybrid search", def: "Combining semantic (embedding) search with keyword search for better retrieval.", block: "embeddings" },
    { term: "Indirect prompt injection", def: "Malicious instructions hidden in content the agent reads, such as a web page or an email, rather than typed by the user.", block: "security" },
    { term: "Inference", def: "Running a trained model to produce output. Providers bill it per token.", block: "provider" },
    { term: "Instruction file", def: "A Markdown file of project or user instructions that a harness loads at session start, such as AGENTS.md or CLAUDE.md.", block: "instructions" },
    { term: "Interleaved thinking", def: "Reasoning a model does between tool calls, not only before its first reply.", block: "reasoning" },
    { term: "JSON Schema", def: "A standard way to describe the structure of JSON data; used to define tool parameters and structured outputs.", block: "tools" },
    { term: "Lethal trifecta", def: "Simon Willison's name for the dangerous combination of private data, untrusted content and external communication in one agent.", block: "security" },
    { term: "LLM (large language model)", def: "A transformer trained on very large amounts of text to predict the next token, then tuned to follow instructions.", block: "model" },
    { term: "LLM-as-a-judge", def: "Using a language model with a rubric to grade outputs. Its verdicts must be checked against human judgement.", block: "evals" },
    { term: "LoRA", def: "Low-Rank Adaptation: fine-tuning a small set of added weights instead of the whole model.", block: "fine-tuning" },
    { term: "MCP (Model Context Protocol)", def: "Open standard for connecting AI applications to tools, data and prompts through MCP servers.", block: "mcp" },
    { term: "MCP host and client", def: "The host is the AI application, for example a harness. It runs one MCP client for each server it connects to.", block: "mcp" },
    { term: "MCP server", def: "A program that exposes tools, resources and prompts to AI applications over MCP.", block: "mcp" },
    { term: "Memory", def: "Information an agent keeps beyond one context window, such as notes, preferences and progress.", block: "memory" },
    { term: "Multi-agent system", def: "Several agents cooperating on a task, typically a lead agent coordinating specialists.", block: "multi-agent" },
    { term: "Observation", def: "The result of a tool call, fed back into the context for the model's next step.", block: "agent-loop" },
    { term: "Observability", def: "Recording traces, metrics and logs of agent runs so you can inspect and improve them.", block: "observability" },
    { term: "Open-weight model", def: "A model whose trained weights are published, so it can be run and fine-tuned on your own infrastructure.", block: "model" },
    { term: "Orchestrator-workers", def: "A pattern in which a lead model breaks a task down at run time and delegates the parts to workers.", block: "workflows" },
    { term: "Parallelization", def: "Running independent sub-tasks, or several attempts at one task, at the same time.", block: "workflows" },
    { term: "Permission mode", def: "A harness setting that decides which actions an agent may take without asking first.", block: "permissions" },
    { term: "Plan mode", def: "A read-only harness mode in which the agent explores and proposes a plan before changing anything.", block: "planning" },
    { term: "Playbook", def: "A written, reusable procedure for a recurring task, with steps, checks and a definition of done.", block: "playbooks" },
    { term: "Plugin", def: "An installable bundle of skills, commands, sub-agents, hooks and MCP servers.", block: "plugins" },
    { term: "Programmatic tool calling", def: "Letting the model write code that calls tools, so large intermediate results stay out of the context. Also called code mode.", block: "tools" },
    { term: "Progressive disclosure", def: "Loading information in layers: first a short description, the details only when needed. The core idea behind Agent Skills.", block: "skills" },
    { term: "Prompt caching", def: "Re-using the processed form of an unchanged prompt prefix, which cuts cost and latency.", block: "cost" },
    { term: "Prompt chaining", def: "A workflow that splits a task into fixed, sequential calls with checks between them.", block: "workflows" },
    { term: "Prompt engineering", def: "Writing instructions, examples and structure that get the best results from a model.", block: "system-prompt" },
    { term: "Prompt injection", def: "An attack in which text the model processes overrides its intended instructions.", block: "security" },
    { term: "RAG (retrieval-augmented generation)", def: "Retrieving relevant passages from a knowledge base and adding them to the prompt before the model answers.", block: "rag" },
    { term: "Ralph loop", def: "Running the same agent prompt over and over against a spec and a progress file until the work is done. Named by Geoffrey Huntley.", block: "long-running" },
    { term: "ReAct", def: "Reason plus act: the 2022 research pattern of interleaving reasoning with tool actions, the template for today's agent loop.", block: "agent-loop" },
    { term: "Reasoning model", def: "A model trained to think step by step before answering, trading extra tokens for accuracy.", block: "reasoning" },
    { term: "Reranker", def: "A model that re-orders retrieved results by relevance before they go into the prompt.", block: "embeddings" },
    { term: "Resource (MCP)", def: "Data that an MCP server exposes for reading, such as a file or a database record.", block: "mcp" },
    { term: "RLHF", def: "Reinforcement learning from human feedback: training a model towards the answers people prefer.", block: "fine-tuning" },
    { term: "Reward hacking", def: "An agent pursuing the score rather than the intended task, for example by reading hidden test answers. A reason to check evals for cheating.", block: "evals" },
    { term: "Routine", def: "A saved agent configuration that runs in the cloud when a schedule, an API call or an event triggers it.", block: "triggers" },
    { term: "Routing", def: "A workflow that classifies an input and sends it to a specialised path or model.", block: "workflows" },
    { term: "Rule of Two", def: "Meta's guideline that, without human approval, an agent session should combine at most two of: untrusted input, access to sensitive data or systems, and the ability to change things or communicate externally.", block: "security" },
    { term: "Sandbox", def: "An isolated environment where an agent can run code without access to the rest of your systems.", block: "sandbox" },
    { term: "Skill", def: "A folder with a SKILL.md file and optional scripts and resources that an agent loads on demand.", block: "skills" },
    { term: "Slash command", def: "A saved prompt template invoked by name, such as /review. In most harnesses custom commands are now written as skills.", block: "commands" },
    { term: "Spec-driven development", def: "Writing a specification first and letting agents implement and test against it.", block: "planning" },
    { term: "Stateless API", def: "An API that keeps no memory between calls; the client re-sends the whole conversation each time.", block: "context-window" },
    { term: "Structured outputs", def: "Constraining a model's reply to valid JSON that matches a given schema.", block: "tools" },
    { term: "Sub-agent", def: "A helper agent with its own fresh context window that handles one delegated task.", block: "subagents" },
    { term: "System prompt", def: "Standing instructions at the top of the context that define the agent's role, rules and output format.", block: "system-prompt" },
    { term: "Test-time compute", def: "Extra computation spent while answering, for example longer reasoning, to improve accuracy.", block: "reasoning" },
    { term: "Time horizon", def: "METR's measure of agent capability: the length of tasks, in human working time, that an agent completes with 50% success.", block: "long-running" },
    { term: "Token", def: "The unit models read and write, roughly three quarters of an English word.", block: "context-window" },
    { term: "Tool", def: "A function the model can request. The harness executes it and returns the result.", block: "tools" },
    { term: "Tool poisoning", def: "Hiding malicious instructions in a tool's description or output to manipulate the agent.", block: "security" },
    { term: "Tool search", def: "Loading tool definitions on demand by searching for them, instead of putting every tool into the context.", block: "tools" },
    { term: "Trace and span", def: "A trace records one agent run; it consists of timed steps called spans, such as model calls and tool calls.", block: "observability" },
    { term: "Transformer", def: "The neural-network architecture behind modern language models, built on attention.", block: "model" },
    { term: "Vector database", def: "A database that indexes embeddings for fast similarity search.", block: "embeddings" },
    { term: "Vibe coding", def: "Building software by prompting an AI and accepting its output without closely reading the code. Coined by Andrej Karpathy in February 2025." },
    { term: "Workflow", def: "A system in which your code orchestrates model calls along predefined paths.", block: "workflows" }
  ];

  /* ---------------------------------------------------------------------------
     Learn more
     ------------------------------------------------------------------------- */
var learn = [
  {
    "title": "Watch: start here",
    "intro": "Short, clear introductions from researchers and educators.",
    "items": [
      {
        "type": "video",
        "title": "Large Language Models explained briefly",
        "by": "3Blue1Brown (Grant Sanderson)",
        "year": 2024,
        "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
        "note": "8 min · beginner · Visual primer: next-word prediction, pretraining, RLHF and the transformer in eight minutes."
      },
      {
        "type": "video",
        "title": "[1hr Talk] Intro to Large Language Models",
        "by": "Andrej Karpathy",
        "year": 2023,
        "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        "note": "60 min · beginner · Classic overview: how LLMs are trained, tool use, the LLM-as-OS idea, security."
      },
      {
        "type": "video",
        "title": "Andrej Karpathy: Software Is Changing (Again)",
        "by": "Y Combinator (Andrej Karpathy)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=LCEmiRjPEtQ",
        "note": "40 min · beginner · Software 3.0, LLMs as a new kind of operating system, partial-autonomy apps."
      },
      {
        "type": "video",
        "title": "What's next for AI agentic workflows ft. Andrew Ng of AI Fund",
        "by": "Sequoia Capital (Andrew Ng)",
        "year": 2024,
        "url": "https://www.youtube.com/watch?v=sal78ACtGTc",
        "note": "14 min · beginner · Four agentic design patterns: reflection, tool use, planning, multi-agent collaboration."
      },
      {
        "type": "video",
        "title": "What are AI Agents?",
        "by": "IBM Technology (Maya Murad)",
        "year": 2024,
        "url": "https://www.youtube.com/watch?v=F8NKVhkZZWI",
        "note": "12 min · beginner · From monolithic models to compound AI systems and agents that reason and act."
      },
      {
        "type": "video",
        "title": "AI Model vs Agentic Harness: What Actually Drives AI",
        "by": "IBM Technology (Martin Keen)",
        "year": 2026,
        "url": "https://www.youtube.com/watch?v=ZELPNFXJ4_o",
        "note": "8 min · beginner · Separates the model from the harness around it: tools, memory and loops."
      },
      {
        "type": "video",
        "title": "Stanford Webinar - Agentic AI: A Progression of Language Model Usage",
        "by": "Stanford Online (Insop Song)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=kJLiOGle3Lw",
        "note": "57 min · beginner · From LM limitations to RAG, tool use and agentic design patterns."
      },
      {
        "type": "video",
        "title": "What is Retrieval-Augmented Generation (RAG)?",
        "by": "IBM Technology (Marina Danilevsky)",
        "year": 2023,
        "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
        "note": "7 min · beginner · IBM researcher explains grounding LLM answers in retrieved, up-to-date sources."
      },
      {
        "type": "video",
        "title": "What is MCP? Integrate AI Agents with Databases & APIs",
        "by": "IBM Technology (Roy Derks)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=eur8dUO9mvE",
        "note": "4 min · beginner · Hosts, clients and servers: how the Model Context Protocol connects agents to tools."
      }
    ]
  },
  {
    "title": "Watch: go deeper",
    "intro": "Longer talks and workshops, many by the engineers who build these systems.",
    "items": [
      {
        "type": "video",
        "title": "Deep Dive into LLMs like ChatGPT",
        "by": "Andrej Karpathy",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=7xTGNNLPyMI",
        "note": "211 min · intermediate · Full training stack for a general audience: pretraining, fine-tuning, RL, hallucinations, tools."
      },
      {
        "type": "video",
        "title": "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
        "by": "3Blue1Brown (Grant Sanderson)",
        "year": 2024,
        "url": "https://www.youtube.com/watch?v=wjZofJX0v4M",
        "note": "27 min · intermediate · Visual walkthrough of embeddings, the transformer pipeline and next-token probabilities."
      },
      {
        "type": "video",
        "title": "Attention in transformers, step-by-step | Deep Learning Chapter 6",
        "by": "3Blue1Brown (Grant Sanderson)",
        "year": 2024,
        "url": "https://www.youtube.com/watch?v=eMlx5fFNoYc",
        "note": "26 min · intermediate · Queries, keys, values and multi-head attention, built up visually step by step."
      },
      {
        "type": "video",
        "title": "Tips for building AI agents",
        "by": "Anthropic (Barry Zhang, Erik Schluntz, Alex Albert)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=LP5OCa20Zpg",
        "note": "18 min · intermediate · Agents vs workflows, anatomy of an agent prompt, pitfalls, coding agents."
      },
      {
        "type": "video",
        "title": "How We Build Effective Agents: Barry Zhang, Anthropic",
        "by": "AI Engineer (Barry Zhang, Anthropic)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=D7_ipDqhtwk",
        "note": "15 min · intermediate · When to build agents, keep them simple, and think like your agent."
      },
      {
        "type": "video",
        "title": "Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic",
        "by": "AI Engineer (Barry Zhang & Mahesh Murag, Anthropic)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=CEvIs9y1uog",
        "note": "16 min · intermediate · Agent Skills: packaging procedural know-how as folders an agent loads on demand."
      },
      {
        "type": "video",
        "title": "Mastering Claude Code in 30 minutes",
        "by": "Anthropic (Boris Cherny)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=6eBSHbLKuN0",
        "note": "28 min · intermediate · Claude Code's creator on practical workflows for an agentic coding tool."
      },
      {
        "type": "video",
        "title": "Let's build GPT: from scratch, in code, spelled out.",
        "by": "Andrej Karpathy",
        "year": 2023,
        "url": "https://www.youtube.com/watch?v=kCc8FmEb1nY",
        "note": "116 min · advanced · Code a small GPT-style transformer in PyTorch, line by line."
      },
      {
        "type": "video",
        "title": "Building Agents with Model Context Protocol - Full Workshop with Mahesh Murag of Anthropic",
        "by": "AI Engineer (Mahesh Murag, Anthropic)",
        "year": 2025,
        "url": "https://www.youtube.com/watch?v=kQmXtrmQ5Zg",
        "note": "104 min · advanced · Anthropic workshop: why MCP exists, building servers and clients, agents on MCP."
      },
      {
        "type": "video",
        "title": "Tool, skill, or subagent? Decomposing an agent that outgrew its prompt",
        "by": "Claude (Anthropic's official channel)",
        "year": 2026,
        "url": "https://www.youtube.com/watch?v=mWvtOHlZM-I",
        "note": "45 min · advanced · Live decomposition of a bloated agent into tools, skills and subagents, with evals."
      },
      {
        "type": "video",
        "title": "Agentic Evaluations at Scale, For Everybody — Nicholas Kang & Michael Aaron, Google DeepMind",
        "by": "AI Engineer (Nicholas Kang & Michael Aaron, Google DeepMind)",
        "year": 2026,
        "url": "https://www.youtube.com/watch?v=Ubwb6NzegyA",
        "note": "20 min · advanced · Why harness choices swing benchmark scores, and how to build trustworthy agent evals."
      }
    ]
  },
  {
    "title": "Free courses",
    "intro": "Structured learning with exercises, from beginner to advanced.",
    "items": [
      {
        "type": "course",
        "title": "AI Agents Course",
        "by": "Hugging Face",
        "year": 2025,
        "url": "https://huggingface.co/learn/agents-course/unit0/introduction",
        "note": "beginner · Free, with free certificates: agent fundamentals, then smolagents, LlamaIndex and LangGraph."
      },
      {
        "type": "course",
        "title": "AI Agents for Beginners",
        "by": "Microsoft",
        "year": 2025,
        "url": "https://github.com/microsoft/ai-agents-for-beginners",
        "note": "beginner · 18 open lessons with code, from agent basics to design patterns and tool use."
      },
      {
        "type": "course",
        "title": "Evaluating AI Agents",
        "by": "DeepLearning.AI & Arize AI (John Gilhuly, Aman Khan)",
        "year": 2025,
        "url": "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
        "note": "beginner · Trace an agent, then evaluate its components and end-to-end runs, including LLM-as-judge."
      },
      {
        "type": "course",
        "title": "Introduction to agent skills",
        "by": "Claude Academy (Anthropic)",
        "year": 2026,
        "url": "https://academy.claude.com/courses/introduction-to-agent-skills",
        "note": "beginner · Create, structure and share Skills; compare them with subagents, hooks and MCP."
      },
      {
        "type": "course",
        "title": "Agentic AI",
        "by": "DeepLearning.AI (Andrew Ng)",
        "year": 2025,
        "url": "https://www.deeplearning.ai/courses/agentic-ai/",
        "note": "intermediate · Reflection, tool use, planning and multi-agent patterns, plus evals; free to audit."
      },
      {
        "type": "course",
        "title": "5-Day AI Agents Intensive Course with Google",
        "by": "Kaggle & Google",
        "year": 2025,
        "url": "https://www.kaggle.com/learn-guide/5-day-agents",
        "note": "intermediate · Five whitepapers (agents, tools/MCP, context and memory, quality, production) plus notebooks."
      },
      {
        "type": "course",
        "title": "MCP: Build Rich-Context AI Apps with Anthropic",
        "by": "DeepLearning.AI & Anthropic (Elie Schoppik)",
        "year": 2025,
        "url": "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/",
        "note": "intermediate · Build MCP servers and clients that expose tools, resources and prompts."
      },
      {
        "type": "course",
        "title": "Building with the Claude API",
        "by": "Claude Academy (Anthropic)",
        "year": 2025,
        "url": "https://academy.claude.com/courses/building-with-the-claude-api",
        "note": "intermediate · Free 67-lesson course: prompting, evals, tool use, RAG, MCP, workflows and agents."
      },
      {
        "type": "course",
        "title": "Agentic AI (MOOC, Fall 2025)",
        "by": "UC Berkeley RDI (Dawn Song, Xinyun Chen)",
        "year": 2025,
        "url": "https://agenticai-learning.org/f25",
        "note": "advanced · Free lectures by leading researchers; sequel to Berkeley's LLM Agents MOOCs (2024, 2025)."
      },
      {
        "type": "course",
        "title": "CME 295: Transformers & Large Language Models",
        "by": "Stanford University (Afshine Amidi, Shervine Amidi)",
        "year": 2025,
        "url": "https://cme295.stanford.edu/",
        "note": "advanced · Stanford course; Autumn 2025 lectures on Stanford Online YouTube include 'Agentic LLMs'."
      }
    ]
  },
  {
    "title": "Essential reading",
    "intro": "The guides practitioners cite most often.",
    "items": [
      {
        "type": "blog",
        "title": "Building effective agents",
        "by": "Erik Schluntz & Barry Zhang (Anthropic)",
        "year": 2024,
        "url": "https://www.anthropic.com/engineering/building-effective-agents",
        "note": "Workflows vs agents and composable patterns; start simple, add complexity only when needed."
      },
      {
        "type": "blog",
        "title": "Effective context engineering for AI agents",
        "by": "Anthropic Applied AI team",
        "year": 2025,
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        "note": "Context as a finite resource: compaction, structured notes, sub-agents, just-in-time retrieval."
      },
      {
        "type": "blog",
        "title": "Writing effective tools for AI agents—using AI agents",
        "by": "Ken Aizawa (Anthropic)",
        "year": 2025,
        "url": "https://www.anthropic.com/engineering/writing-tools-for-agents",
        "note": "How to design, evaluate and refine tools so agents use them well."
      },
      {
        "type": "blog",
        "title": "Equipping agents for the real world with Agent Skills",
        "by": "Barry Zhang, Keith Lazuka & Mahesh Murag (Anthropic)",
        "year": 2025,
        "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        "note": "Skills as folders of instructions and scripts, loaded through progressive disclosure."
      },
      {
        "type": "blog",
        "title": "Demystifying evals for AI agents",
        "by": "Mikaela Grace et al. (Anthropic)",
        "year": 2026,
        "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        "note": "Code, model and human graders; pass@k vs pass^k; start from real failures."
      },
      {
        "type": "blog",
        "title": "A practical guide to building agents",
        "by": "OpenAI",
        "year": 2025,
        "url": "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
        "note": "When to build agents, design foundations (models, tools, instructions), orchestration, guardrails."
      },
      {
        "type": "blog",
        "title": "LLM Powered Autonomous Agents",
        "by": "Lilian Weng",
        "year": 2023,
        "url": "https://lilianweng.github.io/posts/2023-06-23-agent/",
        "note": "Influential overview of planning, memory and tool use as agent components."
      },
      {
        "type": "blog",
        "title": "Agents",
        "by": "Chip Huyen",
        "year": 2025,
        "url": "https://huyenchip.com/2025/01/07/agents.html",
        "note": "Adapted from AI Engineering: tools, planning, failure modes and how to evaluate agents."
      },
      {
        "type": "blog",
        "title": "The lethal trifecta for AI agents: private data, untrusted content, and external communication",
        "by": "Simon Willison",
        "year": 2025,
        "url": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
        "note": "Why combining private data, untrusted content and exfiltration channels invites prompt-injection attacks."
      },
      {
        "type": "blog",
        "title": "Agents (whitepaper)",
        "by": "Julia Wiesinger, Patrick Marlow & Vladimir Vuskovic (Google)",
        "year": 2024,
        "url": "https://www.kaggle.com/whitepaper-agents",
        "note": "Google's primer: model, tools and orchestration layer; extensions, functions, data stores."
      }
    ]
  },
  {
    "title": "Books",
    "intro": "From the fundamentals of AI to building agents and LLMs from scratch.",
    "items": [
      {
        "type": "book",
        "title": "AI Engineering",
        "by": "Chip Huyen (O'Reilly)",
        "year": 2025,
        "url": "https://huyenchip.com/books/",
        "note": "Building applications on foundation models: evaluation, RAG, agents, fine-tuning, deployment."
      },
      {
        "type": "book",
        "title": "Build a Large Language Model (From Scratch)",
        "by": "Sebastian Raschka (Manning)",
        "year": 2024,
        "url": "https://www.manning.com/books/build-a-large-language-model-from-scratch",
        "note": "Code a GPT-style model step by step: attention, pretraining, fine-tuning."
      },
      {
        "type": "book",
        "title": "Hands-On Large Language Models",
        "by": "Jay Alammar & Maarten Grootendorst (O'Reilly)",
        "year": 2024,
        "url": "https://www.llm-book.com/",
        "note": "Richly illustrated, practical tour of LLMs: tokens, embeddings, prompting, RAG, fine-tuning."
      },
      {
        "type": "book",
        "title": "Build an AI Agent (From Scratch)",
        "by": "Jungjun Hur & Younghee Song (Manning)",
        "year": 2026,
        "url": "https://www.manning.com/books/build-an-ai-agent-from-scratch",
        "note": "Framework-free agent in Python: loop, context engineering, tools, memory, planning, evaluation."
      },
      {
        "type": "book",
        "title": "Artificial Intelligence: A Modern Approach (4th ed.)",
        "by": "Stuart Russell & Peter Norvig (Pearson)",
        "year": 2020,
        "url": "https://aima.cs.berkeley.edu/",
        "note": "The standard AI textbook, organized around the concept of rational agents."
      },
      {
        "type": "book",
        "title": "Reinforcement Learning: An Introduction (2nd ed.)",
        "by": "Richard S. Sutton & Andrew G. Barto (MIT Press)",
        "year": 2018,
        "url": "http://incompleteideas.net/book/the-book-2nd.html",
        "note": "Foundational text on agents learning from reward; free official PDF."
      }
    ]
  },
  {
    "title": "The research behind it",
    "intro": "Seminal papers, in chronological order. Every link goes to the paper's arXiv page.",
    "items": [
      {
        "type": "paper",
        "title": "Attention Is All You Need",
        "by": "Vaswani et al.",
        "year": 2017,
        "url": "https://arxiv.org/abs/1706.03762",
        "note": "Introduced the transformer, the architecture behind modern LLMs."
      },
      {
        "type": "paper",
        "title": "Language Models are Few-Shot Learners",
        "by": "Brown et al.",
        "year": 2020,
        "url": "https://arxiv.org/abs/2005.14165",
        "note": "GPT-3: scale unlocks in-context learning from a few examples in the prompt."
      },
      {
        "type": "paper",
        "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        "by": "Lewis et al.",
        "year": 2020,
        "url": "https://arxiv.org/abs/2005.11401",
        "note": "The original RAG paper: pair a retriever with a generator for grounded answers."
      },
      {
        "type": "paper",
        "title": "Training language models to follow instructions with human feedback",
        "by": "Ouyang et al.",
        "year": 2022,
        "url": "https://arxiv.org/abs/2203.02155",
        "note": "InstructGPT: RLHF turns a pretrained model into a helpful instruction follower."
      },
      {
        "type": "paper",
        "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        "by": "Wei et al.",
        "year": 2022,
        "url": "https://arxiv.org/abs/2201.11903",
        "note": "Prompting for intermediate reasoning steps markedly improves multi-step problem solving."
      },
      {
        "type": "paper",
        "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
        "by": "Yao et al.",
        "year": 2022,
        "url": "https://arxiv.org/abs/2210.03629",
        "note": "Interleaves reasoning traces with tool actions; the template for today's agent loop."
      },
      {
        "type": "paper",
        "title": "Toolformer: Language Models Can Teach Themselves to Use Tools",
        "by": "Schick et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2302.04761",
        "note": "Self-supervised learning of when and how to call external APIs."
      },
      {
        "type": "paper",
        "title": "Reflexion: Language Agents with Verbal Reinforcement Learning",
        "by": "Shinn et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2303.11366",
        "note": "Agents improve by storing verbal self-reflections on feedback in episodic memory."
      },
      {
        "type": "paper",
        "title": "Generative Agents: Interactive Simulacra of Human Behavior",
        "by": "Park et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2304.03442",
        "note": "Memory stream, reflection and planning yield believable simulated characters."
      },
      {
        "type": "paper",
        "title": "Voyager: An Open-Ended Embodied Agent with Large Language Models",
        "by": "Wang et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2305.16291",
        "note": "Minecraft agent that grows a reusable skill library of executable code."
      },
      {
        "type": "paper",
        "title": "Cognitive Architectures for Language Agents",
        "by": "Sumers et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2309.02427",
        "note": "CoALA: memory, action space and decision loop as a framework for language agents."
      },
      {
        "type": "paper",
        "title": "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
        "by": "Jimenez et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2310.06770",
        "note": "Real GitHub issues as tasks; the standard yardstick for coding agents."
      },
      {
        "type": "paper",
        "title": "Lost in the Middle: How Language Models Use Long Contexts",
        "by": "Liu et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2307.03172",
        "note": "Models underuse information placed mid-context; a key motivation for context engineering."
      },
      {
        "type": "paper",
        "title": "MemGPT: Towards LLMs as Operating Systems",
        "by": "Packer et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2310.08560",
        "note": "OS-style memory hierarchy lets agents page information in and out of context."
      },
      {
        "type": "paper",
        "title": "A Survey on Large Language Model based Autonomous Agents",
        "by": "Wang et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2308.11432",
        "note": "Widely cited survey: profile, memory, planning and action modules; applications; evaluation."
      },
      {
        "type": "paper",
        "title": "The Rise and Potential of Large Language Model Based Agents: A Survey",
        "by": "Xi et al.",
        "year": 2023,
        "url": "https://arxiv.org/abs/2309.07864",
        "note": "Brain-perception-action framework; single-agent, multi-agent and human-agent settings."
      },
      {
        "type": "paper",
        "title": "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
        "by": "Yang et al.",
        "year": 2024,
        "url": "https://arxiv.org/abs/2405.15793",
        "note": "Shows that interface and tool design (the ACI) drives coding-agent performance."
      },
      {
        "type": "paper",
        "title": "Measuring AI Ability to Complete Long Software Tasks",
        "by": "Kwa et al.",
        "year": 2025,
        "url": "https://arxiv.org/abs/2503.14499",
        "note": "METR's time-horizon metric: task length agents can complete doubles about every seven months."
      },
      {
        "type": "paper",
        "title": "Why Do Multi-Agent LLM Systems Fail?",
        "by": "Cemri et al.",
        "year": 2025,
        "url": "https://arxiv.org/abs/2503.13657",
        "note": "MAST: an empirically grounded taxonomy of failure modes in multi-agent systems."
      },
      {
        "type": "paper",
        "title": "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models",
        "by": "Zhang et al.",
        "year": 2025,
        "url": "https://arxiv.org/abs/2510.04618",
        "note": "ACE: contexts as evolving playbooks, refined by generator, reflector and curator roles."
      },
      {
        "type": "paper",
        "title": "Defeating Prompt Injections by Design",
        "by": "Debenedetti et al.",
        "year": 2025,
        "url": "https://arxiv.org/abs/2503.18813",
        "note": "CaMeL: separates control and data flow so injected text cannot steer the agent."
      },
      {
        "type": "paper",
        "title": "Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces",
        "by": "Merrill et al.",
        "year": 2026,
        "url": "https://arxiv.org/abs/2601.11868",
        "note": "Hard, realistic terminal tasks; a 2026 standard benchmark for autonomous agents."
      }
    ],
    "wide": true
  }
];

  /* ---------------------------------------------------------------------------
     The ELI5 story: nine pictures of the kitchen. "id" picks the drawing in app.js.
     ------------------------------------------------------------------------- */
  var story = [
    {
      "id": "order",
      "zone": "start",
      "title": "An order comes in",
      "text": "Every agent run starts with an order. A person types a request, or a timer, a webhook or a failing build rings the bell. The order says what to cook and where to serve it.",
      "blocks": [
        "triggers",
        "surfaces"
      ]
    },
    {
      "id": "chef",
      "zone": "model",
      "title": "The chef thinks",
      "text": "The chef is the model. It has read millions of recipes and is very good at deciding the next step. But it remembers nothing between orders and only sees what is on the counter.",
      "blocks": [
        "model",
        "reasoning",
        "provider"
      ]
    },
    {
      "id": "counter",
      "zone": "harness",
      "title": "The counter is small",
      "text": "Everything the chef can use has to fit on the counter: the order, the house rules, notes and every result so far. The kitchen around the chef, the harness, decides what goes on it and clears it when it gets full.",
      "blocks": [
        "context-window",
        "harness",
        "context-engineering",
        "compaction"
      ]
    },
    {
      "id": "cards",
      "zone": "know",
      "title": "Recipe cards and a library",
      "text": "House rules hang on the wall. Recipe cards wait in a box until a dish needs them. When the chef doesn't know something, the kitchen looks it up in the library instead of guessing.",
      "blocks": [
        "instructions",
        "skills",
        "rag",
        "search"
      ]
    },
    {
      "id": "tools",
      "zone": "tools",
      "title": "Tools, and one plug for all",
      "text": "The chef decides, the tools do the work: knives, pots, the oven. New appliances use one standard plug, MCP, and risky experiments happen in a tiled test kitchen, the sandbox.",
      "blocks": [
        "tools",
        "mcp",
        "sandbox"
      ]
    },
    {
      "id": "locks",
      "zone": "control",
      "title": "Locks and alarms",
      "text": "Some cupboards need the manager's key, the smoke alarm always goes off, and risky dishes need the head chef's nod. The kitchen enforces these rules; they don't depend on the chef's good intentions.",
      "blocks": [
        "permissions",
        "hooks",
        "guardrails",
        "hitl",
        "security"
      ]
    },
    {
      "id": "taste",
      "zone": "harness",
      "title": "Taste, adjust, taste again",
      "text": "The chef cooks a little, tastes, and decides the next move. This repeats, often dozens of times, until the dish is right. That repetition is the agent loop, and the tasting is verification.",
      "blocks": [
        "agent-loop",
        "verification",
        "planning"
      ]
    },
    {
      "id": "helpers",
      "zone": "orch",
      "title": "Helpers for big orders",
      "text": "A big order gets split up. Helpers prep in their own corners and each hands back one finished bowl, so the chef's counter stays clean. Dishes that never change run like an assembly line.",
      "blocks": [
        "subagents",
        "multi-agent",
        "workflows"
      ]
    },
    {
      "id": "critics",
      "zone": "ops",
      "title": "Critics, cameras and the bill",
      "text": "A good kitchen keeps getting better. Critics score the dishes after every change, cameras record each step, someone watches the bill, and the inspector checks the rules.",
      "blocks": [
        "evals",
        "observability",
        "cost",
        "governance"
      ]
    }
  ];

  /* Five ideas that explain most of it. */
  var ideas = [
    {
      "t": "The model is stateless.",
      "d": "On every turn the harness re-sends the whole context. Anything not in that request does not exist for the model.",
      "blocks": [
        "model",
        "context-window",
        "harness"
      ]
    },
    {
      "t": "Context is the bottleneck.",
      "d": "Quality drops as the context window fills. Skills, sub-agents, compaction and RAG are all ways to load the right tokens at the right time.",
      "blocks": [
        "context-engineering",
        "skills",
        "subagents",
        "compaction",
        "rag"
      ]
    },
    {
      "t": "Prompts suggest; code enforces.",
      "d": "Instructions guide behaviour. Hooks, permissions and sandboxes guarantee it.",
      "blocks": [
        "instructions",
        "hooks",
        "permissions",
        "sandbox"
      ]
    },
    {
      "t": "Start simple and climb only with evidence.",
      "d": "A single call beats a workflow, and a workflow beats an autonomous agent, until your evals show otherwise.",
      "blocks": [
        "workflows",
        "agent-loop",
        "evals"
      ]
    },
    {
      "t": "Give the agent a way to check its work.",
      "d": "Tests, linters, screenshots and reviewers turn plausible output into verified output.",
      "blocks": [
        "verification",
        "sandbox",
        "hooks"
      ]
    }
  ];

  /* Guides: the panels that open from the menu. "menu" and "hint" label the menu entry. */
  var guides = {
    "story": {
      "group": "Start here",
      "menu": "The story, like I'm 5",
      "hint": "Nine pictures, two minutes",
      "eyebrow": "Explain it like I'm 5",
      "title": "An AI agent is a restaurant kitchen",
      "lede": "Nine small pictures. After them, every block on the map will make sense."
    },
    "ideas": {
      "group": "Start here",
      "menu": "Five big ideas",
      "hint": "What explains most of it",
      "eyebrow": "Five big ideas",
      "title": "Five ideas that explain most of it",
      "lede": "An agent is a language model that uses tools in a loop until a goal is reached. Everything else you hear about exists to give that loop the right context, the right capabilities and the right limits."
    },
    "steps": {
      "group": "Start here",
      "menu": "One run, step by step",
      "hint": "All 16 steps as a list",
      "eyebrow": "One run, step by step",
      "title": "What happens when an agent works on a task",
      "lede": "The sixteen steps of a typical run, in order. Steps 4 to 9 repeat many times; that repetition is the agent loop. Press “Show on the map” to see which blocks are active."
    },
    "context": {
      "group": "Understand",
      "menu": "Inside the context window",
      "hint": "What the model actually sees",
      "eyebrow": "Inside the context window",
      "title": "What the model actually sees",
      "lede": "The context window is the agent's entire working memory for a turn. These bars show what fills it during a long task, as illustrative shares of a 200,000-token window. Compare the middle bar with the bottom one: that difference is context engineering."
    },
    "compare": {
      "group": "Understand",
      "menu": "Easily confused",
      "hint": "Skill vs. tool vs. MCP vs. plugin vs. hook",
      "eyebrow": "Easily confused",
      "title": "Skill, tool, MCP server, plugin, hook: what is the difference?",
      "lede": "They all extend an agent, but they are triggered by different parties, enter the context at different moments and cost different amounts of it. Only some of them are deterministic.",
      "note": "Context cost refers to tokens in the model's context window. “Deterministic” means the behaviour is guaranteed by code rather than by the model's judgement. For a worked example, watch Anthropic's [Tool, skill, or subagent? Decomposing an agent that outgrew its prompt](https://www.youtube.com/watch?v=mWvtOHlZM-I) (2026)."
    },
    "patterns": {
      "group": "Understand",
      "menu": "Patterns",
      "hint": "From fixed workflows to agent teams",
      "eyebrow": "Patterns",
      "title": "From fixed workflows to agent teams",
      "lede": "Most production systems combine a handful of patterns. They are ordered by autonomy: the further down, the more the model decides and the less predictable cost and behaviour become. Pick the first one that solves your problem.",
      "note": "Pattern names follow Anthropic's [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (2024) and its multi-agent research write-up (2025)."
    },
    "protocols": {
      "group": "Understand",
      "menu": "Protocols & standards",
      "hint": "MCP, A2A, AGENTS.md, Agent Skills…",
      "eyebrow": "Open protocols & standards",
      "title": "The plumbing that lets agents work together",
      "lede": "Interoperability now runs on a few open standards, most of them governed by foundations rather than by a single vendor. Each one connects a different pair of things."
    },
    "decide": {
      "group": "Build",
      "menu": "Which block when?",
      "hint": "Start from what you need",
      "eyebrow": "Which block when?",
      "title": "Start from what you need, not from the newest acronym",
      "lede": "Find your goal, then open the block next to it."
    },
    "build": {
      "group": "Build",
      "menu": "Build your own flow",
      "hint": "Ladder, recipe, examples, checklist",
      "eyebrow": "Build your own flow",
      "title": "The current recipe, step by step",
      "lede": "How experienced teams build agentic workflows in 2026, distilled from vendor engineering guides, research and practice. Use it as a starting point and adapt it to your own evals."
    },
    "blocks": {
      "group": "Look up",
      "menu": "All 42 blocks",
      "hint": "Every block with its definition",
      "eyebrow": "All building blocks",
      "title": "Every block, grouped by zone",
      "lede": "The same blocks as on the map, with their one-sentence definitions. Open any block for the simple picture, the details and the sources."
    },
    "glossary": {
      "group": "Look up",
      "menu": "Glossary",
      "hint": "The vocabulary, A to Z",
      "eyebrow": "Glossary",
      "title": "The vocabulary, A to Z",
      "lede": ""
    },
    "learn": {
      "group": "Look up",
      "menu": "Learn more",
      "hint": "Talks, courses, books, papers",
      "eyebrow": "Learn more",
      "title": "Where to go deeper",
      "lede": "Talks, courses, books and papers from the people who build and research these systems. Every link was checked when this snapshot was made."
    },
    "about": {
      "group": "Look up",
      "menu": "About this map",
      "hint": "Sources, privacy, credits",
      "eyebrow": "About",
      "title": "About this map",
      "lede": ""
    }
  };

  /* ---------------------------------------------------------------------------
     Sources per block (verified when the snapshot was made)
     ------------------------------------------------------------------------- */
  /*__SOURCES__*/
  var SOURCES = {
  "model": [
    {
      "type": "definition",
      "title": "Large language model",
      "by": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Large_language_model",
      "year": 2026,
      "note": "Encyclopedic overview: transformers, tokens, training stages, multimodality, open-weight models."
    },
    {
      "type": "blog",
      "title": "The Illustrated Transformer",
      "by": "Jay Alammar",
      "url": "https://jalammar.github.io/illustrated-transformer/",
      "year": 2018,
      "note": "Widely used illustrated, step-by-step explanation of transformer self-attention."
    },
    {
      "type": "paper",
      "title": "Attention Is All You Need",
      "by": "Vaswani et al. (Google Brain)",
      "url": "https://arxiv.org/abs/1706.03762",
      "year": 2017,
      "note": "Seminal paper introducing the transformer architecture behind modern LLMs."
    },
    {
      "type": "paper",
      "title": "On the Opportunities and Risks of Foundation Models",
      "by": "Bommasani et al. (Stanford CRFM)",
      "url": "https://arxiv.org/abs/2108.07258",
      "year": 2021,
      "note": "Coined 'foundation model'; capabilities, risks and societal impact."
    },
    {
      "type": "video",
      "title": "Large Language Models explained briefly",
      "by": "3Blue1Brown",
      "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
      "year": 2024,
      "note": "Short visual intro to next-token prediction, transformers and training."
    },
    {
      "type": "video",
      "title": "[1hr Talk] Intro to Large Language Models",
      "by": "Andrej Karpathy",
      "year": 2023,
      "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      "note": "How LLMs are trained, tool use, the LLM-as-operating-system idea, security."
    },
    {
      "type": "video",
      "title": "Deep Dive into LLMs like ChatGPT",
      "by": "Andrej Karpathy",
      "year": 2025,
      "url": "https://www.youtube.com/watch?v=7xTGNNLPyMI",
      "note": "Full training stack for a general audience: pretraining, fine-tuning, RL, tools."
    }
  ],
  "reasoning": [
    {
      "type": "definition",
      "title": "What Is a Reasoning Model?",
      "by": "IBM Think (Dave Bergmann)",
      "url": "https://www.ibm.com/think/topics/reasoning-model",
      "year": 2026,
      "note": "Plain-language explainer of reasoning/thinking models and test-time compute."
    },
    {
      "type": "docs",
      "title": "Thinking",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/thinking",
      "year": 2026,
      "note": "Adaptive thinking, display modes, billing, effort interplay, tools and caching."
    },
    {
      "type": "guide",
      "title": "Reasoning models",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/reasoning",
      "year": 2026,
      "note": "Reasoning tokens, effort levels, summaries, encrypted reasoning items, context budgeting."
    },
    {
      "type": "blog",
      "title": "Why We Think",
      "by": "Lilian Weng",
      "url": "https://lilianweng.github.io/posts/2025-05-01-thinking/",
      "year": 2025,
      "note": "Deep survey of test-time compute, chain-of-thought, RL for reasoning, faithfulness."
    },
    {
      "type": "paper",
      "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
      "by": "Wei et al. (Google)",
      "url": "https://arxiv.org/abs/2201.11903",
      "year": 2022,
      "note": "Seminal chain-of-thought paper: intermediate steps boost multi-step reasoning."
    },
    {
      "type": "paper",
      "title": "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters",
      "by": "Snell et al. (UC Berkeley / Google DeepMind)",
      "url": "https://arxiv.org/abs/2408.03314",
      "year": 2024,
      "note": "Key test-time compute scaling study: compute-optimal allocation by difficulty."
    },
    {
      "type": "paper",
      "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
      "by": "DeepSeek-AI",
      "url": "https://arxiv.org/abs/2501.12948",
      "year": 2025,
      "note": "Open reasoning model trained with large-scale RL; also published in Nature 2025."
    },
    {
      "type": "video",
      "title": "Why AI Models Pause to Think: Test Time Compute Explained",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=DAlC8mL5ZlI",
      "year": 2026,
      "note": "Martin Keen explains test-time compute, chain of thought and reasoning models."
    }
  ],
  "context-window": [
    {
      "type": "definition",
      "title": "What is a context window?",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/context-window",
      "year": 2026,
      "note": "Defines context window, tokens, and trade-offs of larger windows."
    },
    {
      "type": "docs",
      "title": "Context windows",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/context-windows",
      "year": 2026,
      "note": "How context accumulates per turn, sizes, thinking, overflow, compaction, context rot."
    },
    {
      "type": "docs",
      "title": "Using the Messages API",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/working-with-messages",
      "year": 2026,
      "note": "States the API is stateless: always resend full conversation history."
    },
    {
      "type": "guide",
      "title": "Effective context engineering for AI agents",
      "by": "Anthropic Engineering",
      "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      "year": 2025,
      "note": "Context as finite attention budget; curation, compaction, memory, sub-agents."
    },
    {
      "type": "paper",
      "title": "Lost in the Middle: How Language Models Use Long Contexts",
      "by": "Liu et al. (Stanford)",
      "url": "https://arxiv.org/abs/2307.03172",
      "year": 2023,
      "note": "Shows models miss information placed in the middle of long contexts."
    },
    {
      "type": "paper",
      "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance",
      "by": "Chroma (Hong, Troynikov, Huber)",
      "url": "https://www.trychroma.com/research/context-rot",
      "year": 2025,
      "note": "18-model study: accuracy degrades as input length grows."
    },
    {
      "type": "video",
      "title": "Let's build the GPT Tokenizer",
      "by": "Andrej Karpathy",
      "url": "https://www.youtube.com/watch?v=zduSFxRajkE",
      "year": 2024,
      "note": "Builds a BPE tokenizer from scratch; explains why tokens matter."
    },
    {
      "type": "video",
      "title": "What is a Context Window? Unlocking LLM Secrets",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=-QVoIxEpFkM",
      "year": 2025,
      "note": "Short explainer of context windows, tokens and long-context trade-offs."
    }
  ],
  "provider": [
    {
      "type": "docs",
      "title": "Overview - Amazon Bedrock",
      "by": "AWS",
      "url": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
      "year": 2026,
      "note": "Managed access to 100+ models incl. Claude, OpenAI, DeepSeek, Kimi."
    },
    {
      "type": "docs",
      "title": "Overview of models on Agent Platform",
      "by": "Google Cloud (Gemini Enterprise Agent Platform)",
      "url": "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models",
      "year": 2026,
      "note": "Google's model catalog (formerly Vertex AI): Gemini, Claude, open models."
    },
    {
      "type": "docs",
      "title": "What is Microsoft Foundry?",
      "by": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry",
      "year": 2026,
      "note": "Microsoft's unified platform (ex-Azure AI Foundry) for models and agents."
    },
    {
      "type": "docs",
      "title": "Inference Providers",
      "by": "Hugging Face",
      "url": "https://huggingface.co/docs/inference-providers/index",
      "year": 2026,
      "note": "One API/router to open models across many serverless inference partners."
    },
    {
      "type": "docs",
      "title": "OpenRouter Quickstart Guide",
      "by": "OpenRouter",
      "url": "https://openrouter.ai/docs/quickstart",
      "year": 2026,
      "note": "Single API to hundreds of models with fallbacks and routing."
    },
    {
      "type": "video",
      "title": "What is Ollama? Running Local LLMs Made Simple",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=5RIOQuHOihY",
      "year": 2025,
      "note": "Explains running open models locally with Ollama and why."
    },
    {
      "type": "tool",
      "title": "Ollama documentation",
      "by": "Ollama",
      "url": "https://docs.ollama.com/",
      "year": 2026,
      "note": "Run open models locally or in the cloud via a simple API."
    },
    {
      "type": "tool",
      "title": "Welcome to vLLM",
      "by": "vLLM project",
      "url": "https://docs.vllm.ai/en/latest/",
      "year": 2026,
      "note": "High-throughput open-source LLM serving engine with OpenAI-compatible server."
    },
    {
      "type": "tool",
      "title": "AI Model & API Providers Analysis",
      "by": "Artificial Analysis",
      "url": "https://artificialanalysis.ai/",
      "year": 2026,
      "note": "Independent benchmarks of model intelligence, price, speed and providers."
    }
  ],
  "fine-tuning": [
    {
      "type": "definition",
      "title": "What is Fine-Tuning?",
      "by": "IBM Think (Dave Bergmann)",
      "url": "https://www.ibm.com/think/topics/fine-tuning",
      "year": 2024,
      "note": "Clear explainer of fine-tuning, PEFT and how it differs from pretraining."
    },
    {
      "type": "docs",
      "title": "TRL - Transformers Reinforcement Learning",
      "by": "Hugging Face",
      "url": "https://huggingface.co/docs/trl/index",
      "year": 2026,
      "note": "Open-source library for SFT, DPO, GRPO and other post-training methods."
    },
    {
      "type": "guide",
      "title": "Model optimization",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/model-optimization",
      "year": 2026,
      "note": "When to prompt vs fine-tune (SFT, DPO, RFT); eval-driven loop; wind-down notice."
    },
    {
      "type": "paper",
      "title": "Training language models to follow instructions with human feedback",
      "by": "Ouyang et al. (OpenAI)",
      "url": "https://arxiv.org/abs/2203.02155",
      "year": 2022,
      "note": "InstructGPT: the SFT + RLHF recipe behind chat assistants."
    },
    {
      "type": "paper",
      "title": "Constitutional AI: Harmlessness from AI Feedback",
      "by": "Bai et al. (Anthropic)",
      "url": "https://arxiv.org/abs/2212.08073",
      "year": 2022,
      "note": "Alignment via written principles and RL from AI feedback (RLAIF)."
    },
    {
      "type": "paper",
      "title": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
      "by": "Rafailov et al. (Stanford)",
      "url": "https://arxiv.org/abs/2305.18290",
      "year": 2023,
      "note": "DPO: preference tuning without a separate reward model or RL loop."
    },
    {
      "type": "video",
      "title": "Is Fine-Tuning Still Needed? LLMs, RAG, & LoRA",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=-W2JdSl1v48",
      "year": 2026,
      "note": "When fine-tuning beats RAG and prompting; role of LoRA in 2026."
    },
    {
      "type": "course",
      "title": "Post-training of LLMs",
      "by": "DeepLearning.AI",
      "url": "https://www.deeplearning.ai/courses/post-training-of-llms",
      "year": 2025,
      "note": "Short course on SFT, DPO and online RL for post-training."
    }
  ],
  "system-prompt": [
    {
      "type": "definition",
      "title": "What Is Prompt Engineering?",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/prompt-engineering",
      "year": 2026,
      "note": "Accessible definition of prompt engineering with common techniques."
    },
    {
      "type": "spec",
      "title": "Model Spec (2026/08/18)",
      "by": "OpenAI",
      "url": "https://model-spec.openai.com/2026-08-18.html",
      "year": 2026,
      "note": "How models prioritize platform, developer and user instructions (chain of command)."
    },
    {
      "type": "docs",
      "title": "Prompting best practices",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
      "year": 2026,
      "note": "Living reference: roles, clarity, examples, XML, long context, agentic prompting."
    },
    {
      "type": "guide",
      "title": "Prompt engineering",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/prompt-engineering",
      "year": 2026,
      "note": "Message roles, instructions priority, few-shot, prompt versioning and evals."
    },
    {
      "type": "guide",
      "title": "Prompt design strategies",
      "by": "Google AI for Developers (Gemini API)",
      "url": "https://ai.google.dev/gemini-api/docs/prompting-strategies",
      "year": 2026,
      "note": "Gemini prompting: clear instructions, few-shot, context, system instructions, Gemini 3 tips."
    },
    {
      "type": "paper",
      "title": "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques",
      "by": "Schulhoff et al.",
      "url": "https://arxiv.org/abs/2406.06608",
      "year": 2024,
      "note": "Most comprehensive taxonomy of prompting techniques and terminology."
    },
    {
      "type": "video",
      "title": "AI prompt engineering: A deep dive",
      "by": "Anthropic",
      "url": "https://www.youtube.com/watch?v=T9aRN5JkmL8",
      "year": 2024,
      "note": "Anthropic prompt engineers discuss how they actually write prompts."
    },
    {
      "type": "course",
      "title": "Anthropic's Interactive Prompt Engineering Tutorial",
      "by": "Anthropic (GitHub)",
      "url": "https://github.com/anthropics/prompt-eng-interactive-tutorial",
      "year": 2024,
      "note": "Nine hands-on chapters from basic structure to complex prompts."
    }
  ],
  "cost": [
    {
      "type": "docs",
      "title": "Prompt caching",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
      "year": 2026,
      "note": "Cache breakpoints, TTLs, pricing multipliers, invalidation rules."
    },
    {
      "type": "docs",
      "title": "Effort",
      "by": "Anthropic (Claude Platform Docs)",
      "url": "https://platform.claude.com/docs/en/build-with-claude/effort",
      "year": 2026,
      "note": "Trade thoroughness for token cost and latency with effort levels."
    },
    {
      "type": "guide",
      "title": "Prompt caching",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/prompt-caching",
      "year": 2026,
      "note": "Automatic caching, minimum lengths, discounts and prompt-structure best practices."
    },
    {
      "type": "guide",
      "title": "Latency optimization",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/latency-optimization",
      "year": 2026,
      "note": "Seven principles for faster LLM applications."
    },
    {
      "type": "paper",
      "title": "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance",
      "by": "Chen, Zaharia & Zou (Stanford)",
      "url": "https://arxiv.org/abs/2305.05176",
      "year": 2023,
      "note": "Prompt adaptation, model approximation and LLM cascades to cut cost."
    },
    {
      "type": "paper",
      "title": "RouteLLM: Learning to Route LLMs with Preference Data",
      "by": "Ong et al. (LMSYS / UC Berkeley)",
      "url": "https://arxiv.org/abs/2406.18665",
      "year": 2024,
      "note": "Learned routers choose strong vs weak model per query."
    },
    {
      "type": "video",
      "title": "What is Prompt Caching? Optimize LLM Latency with AI Transformers",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=u57EnkQaUTY",
      "year": 2026,
      "note": "Explains how prompt caching reuses KV state to cut latency and cost."
    },
    {
      "type": "tool",
      "title": "LLM pricing calculator",
      "by": "Simon Willison (llm-prices.com)",
      "url": "https://www.llm-prices.com/",
      "year": 2026,
      "note": "Compare and calculate token costs across current models."
    }
  ],
  "agent-loop": [
    {
      "type": "definition",
      "title": "Building effective agents",
      "by": "Anthropic (Erik Schluntz, Barry Zhang)",
      "url": "https://www.anthropic.com/engineering/building-effective-agents",
      "year": 2024,
      "note": "Canonical workflows-vs-agents distinction and five workflow patterns."
    },
    {
      "type": "definition",
      "title": "I think “agent” may finally have a widely enough agreed upon definition to be useful jargon now",
      "by": "Simon Willison",
      "url": "https://simonwillison.net/2025/Sep/18/agents/",
      "year": 2025,
      "note": "Origin of 'an LLM agent runs tools in a loop to achieve a goal'."
    },
    {
      "type": "docs",
      "title": "How the agent loop works",
      "by": "Anthropic - Claude Agent SDK docs",
      "url": "https://code.claude.com/docs/en/agent-sdk/agent-loop",
      "year": 2026,
      "note": "Turns, tool execution, message stream, hooks, budgets."
    },
    {
      "type": "docs",
      "title": "Running agents",
      "by": "OpenAI - Agents SDK docs",
      "url": "https://openai.github.io/openai-agents-python/running_agents/",
      "year": 2026,
      "note": "Runner loop: final output, handoffs, tool calls, max_turns."
    },
    {
      "type": "docs",
      "title": "How Claude Code works",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/how-claude-code-works",
      "year": 2026,
      "note": "Agentic loop (gather, act, verify), tools, context, checkpoints."
    },
    {
      "type": "guide",
      "title": "A practical guide to building agents",
      "by": "OpenAI",
      "url": "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
      "year": 2025,
      "note": "When to build agents; model/tools/instructions; orchestration; guardrails."
    },
    {
      "type": "blog",
      "title": "Unrolling the Codex agent loop",
      "by": "OpenAI (Michael Bolin)",
      "url": "https://openai.com/index/unrolling-the-codex-agent-loop/",
      "year": 2026,
      "note": "How Codex's agent loop orchestrates model, tools and context."
    },
    {
      "type": "paper",
      "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
      "by": "Shunyu Yao et al. (Princeton, Google)",
      "url": "https://arxiv.org/abs/2210.03629",
      "year": 2022,
      "note": "Seminal think-act-observe loop interleaving reasoning and tool actions."
    },
    {
      "type": "video",
      "title": "Claude Agent SDK [Full Workshop] — Thariq Shihipar, Anthropic",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=TqC1qOfiVcQ",
      "year": 2026,
      "note": "Builds an agent loop with bash, files and verification from scratch."
    }
  ],
  "harness": [
    {
      "type": "definition",
      "title": "Agent Harness",
      "by": "Microsoft Learn - Agent Framework",
      "url": "https://learn.microsoft.com/en-us/agent-framework/concepts/harness",
      "year": 2026,
      "note": "Vendor-neutral definition plus capability matrix of a harness."
    },
    {
      "type": "guide",
      "title": "Harness engineering",
      "by": "Birgitta Böckeler (Thoughtworks), martinfowler.com",
      "year": 2026,
      "url": "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html",
      "note": "Build an outer harness of guides (feedforward) and sensors (feedback) around agents."
    },
    {
      "type": "blog",
      "title": "Effective harnesses for long-running agents",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "year": 2025,
      "note": "Initializer + coding agent, progress files, feature lists, git."
    },
    {
      "type": "blog",
      "title": "Building agents with the Claude Agent SDK",
      "by": "Anthropic",
      "url": "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk",
      "year": 2025,
      "note": "Why Claude Code's harness became a general agent SDK."
    },
    {
      "type": "blog",
      "title": "Harness engineering: leveraging Codex in an agent-first world",
      "by": "OpenAI (Ryan Lopopolo)",
      "url": "https://openai.com/index/harness-engineering/",
      "year": 2026,
      "note": "Shipping a product with zero hand-written code via harness design."
    },
    {
      "type": "blog",
      "title": "Harness design for long-running application development",
      "by": "Anthropic (Prithvi Rajasekaran)",
      "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      "year": 2026,
      "note": "Planner-generator-evaluator harness; cost vs quality trade-offs."
    },
    {
      "type": "blog",
      "title": "A harness for every task: dynamic workflows in Claude Code",
      "by": "Anthropic (Thariq Shihipar, Sid Bidasaria)",
      "url": "https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/",
      "year": 2026,
      "note": "Claude writes task-specific multi-agent harnesses as scripts."
    },
    {
      "type": "paper",
      "title": "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
      "by": "John Yang et al. (Princeton)",
      "url": "https://arxiv.org/abs/2405.15793",
      "year": 2024,
      "note": "Seminal paper showing the agent-computer interface drives performance."
    },
    {
      "type": "paper",
      "title": "Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces",
      "by": "Mike A. Merrill et al.",
      "url": "https://arxiv.org/abs/2601.11868",
      "year": 2026,
      "note": "Terminal-Bench 2.0: 89 hard CLI tasks to compare agent harnesses."
    },
    {
      "type": "video",
      "title": "Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=am_oeAoUhew",
      "year": 2026,
      "note": "OpenAI engineer on harness engineering with Codex."
    },
    {
      "type": "video",
      "title": "AI Model vs Agentic Harness: What Actually Drives AI",
      "by": "IBM Technology (Martin Keen)",
      "year": 2026,
      "url": "https://www.youtube.com/watch?v=ZELPNFXJ4_o",
      "note": "Separates the model from the harness around it: tools, memory and loops."
    }
  ],
  "sdk": [
    {
      "type": "docs",
      "title": "Agent SDK overview",
      "by": "Anthropic - Claude Agent SDK docs",
      "url": "https://code.claude.com/docs/en/agent-sdk/overview",
      "year": 2026,
      "note": "Claude Code's harness as a Python/TypeScript library."
    },
    {
      "type": "docs",
      "title": "Claude Managed Agents overview",
      "by": "Anthropic - Claude Platform docs",
      "url": "https://platform.claude.com/docs/en/managed-agents/overview",
      "year": 2026,
      "note": "Hosted agent harness with cloud or self-hosted sandboxes (beta)."
    },
    {
      "type": "docs",
      "title": "OpenAI Agents SDK",
      "by": "OpenAI",
      "url": "https://openai.github.io/openai-agents-python/",
      "year": 2026,
      "note": "Agents, tools, handoffs, guardrails, sessions, tracing (Python)."
    },
    {
      "type": "docs",
      "title": "Agents",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/agents",
      "year": 2026,
      "note": "Choosing between Agents API, Agents SDK, Responses API, ChatKit."
    },
    {
      "type": "docs",
      "title": "Agent Development Kit (ADK)",
      "by": "Google",
      "url": "https://adk.dev/",
      "year": 2026,
      "note": "ADK 2.x docs: agents, graph workflows, multi-agent, deployment."
    },
    {
      "type": "docs",
      "title": "Microsoft Agent Framework Overview",
      "by": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/agent-framework/overview/",
      "year": 2026,
      "note": "Agents, Harness Agent, workflows; successor to SK and AutoGen."
    },
    {
      "type": "blog",
      "title": "Microsoft Agent Framework Version 1.0",
      "by": "Microsoft (Shawn Henry)",
      "url": "https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/",
      "year": 2026,
      "note": "1.0 GA announcement for .NET and Python."
    },
    {
      "type": "video",
      "title": "Introducing Agent Development Kit",
      "by": "Google for Developers",
      "url": "https://www.youtube.com/watch?v=zgrOwow_uTQ",
      "year": 2025,
      "note": "Official introduction to Google's ADK."
    },
    {
      "type": "video",
      "title": "Microsoft Agent Framework releasing version 1.0",
      "by": "Microsoft Developer",
      "url": "https://www.youtube.com/watch?v=suBDqt4677I",
      "year": 2026,
      "note": "Official walkthrough of the Agent Framework 1.0 release."
    }
  ],
  "planning": [
    {
      "type": "definition",
      "title": "What is AI Agent Planning?",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/ai-agent-planning",
      "year": 2025,
      "note": "Explainer of how agents decompose goals into steps."
    },
    {
      "type": "docs",
      "title": "Choose a permission mode (plan mode)",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/permission-modes",
      "year": 2026,
      "note": "How plan mode blocks edits until a plan is approved."
    },
    {
      "type": "docs",
      "title": "Track todos",
      "by": "Anthropic - Claude Agent SDK docs",
      "url": "https://code.claude.com/docs/en/agent-sdk/todo-tracking",
      "year": 2026,
      "note": "Todo/task tools, lifecycle and model availability."
    },
    {
      "type": "blog",
      "title": "Agentic Design Patterns Part 4: Planning",
      "by": "Andrew Ng (DeepLearning.AI The Batch)",
      "url": "https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-4-planning/",
      "year": 2024,
      "note": "Ng on planning as an agentic design pattern."
    },
    {
      "type": "paper",
      "title": "Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models",
      "by": "Lei Wang et al.",
      "url": "https://arxiv.org/abs/2305.04091",
      "year": 2023,
      "note": "Plan first, then solve subtasks; ACL 2023."
    },
    {
      "type": "paper",
      "title": "ReWOO: Decoupling Reasoning from Observations for Efficient Augmented Language Models",
      "by": "Binfeng Xu et al.",
      "url": "https://arxiv.org/abs/2305.18323",
      "year": 2023,
      "note": "Planner/Worker/Solver architecture that plans before tool calls."
    },
    {
      "type": "paper",
      "title": "Tree of Thoughts: Deliberate Problem Solving with Large Language Models",
      "by": "Shunyu Yao et al.",
      "url": "https://arxiv.org/abs/2305.10601",
      "year": 2023,
      "note": "Tree search over thoughts with lookahead and backtracking."
    },
    {
      "type": "video",
      "title": "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (Full Paper Review)",
      "by": "Yannic Kilcher",
      "url": "https://www.youtube.com/watch?v=ut5kp56wW_4",
      "year": 2023,
      "note": "Detailed walkthrough of the Tree of Thoughts paper."
    }
  ],
  "workflows": [
    {
      "type": "definition",
      "title": "What are Agentic Workflows?",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/agentic-workflows",
      "year": 2025,
      "note": "Explainer of agentic workflows versus traditional automation."
    },
    {
      "type": "docs",
      "title": "Workflows and agents",
      "by": "LangChain - LangGraph docs",
      "url": "https://docs.langchain.com/oss/python/langgraph/workflows-agents",
      "year": 2026,
      "note": "Each pattern implemented in LangGraph."
    },
    {
      "type": "docs",
      "title": "Template agent workflows",
      "by": "Google - ADK docs",
      "url": "https://adk.dev/agents/workflow-agents/",
      "year": 2026,
      "note": "Sequential, loop and parallel workflow agents."
    },
    {
      "type": "docs",
      "title": "Graph-based agent workflows",
      "by": "Google - ADK docs",
      "url": "https://adk.dev/graphs/",
      "year": 2026,
      "note": "ADK 2.0 graph workflows mixing code and LLM steps."
    },
    {
      "type": "blog",
      "title": "Building effective agents",
      "by": "Anthropic (Erik Schluntz, Barry Zhang)",
      "url": "https://www.anthropic.com/engineering/building-effective-agents",
      "year": 2024,
      "note": "Defines the five canonical workflow patterns."
    },
    {
      "type": "blog",
      "title": "Agentic Design Patterns Part 1: Four AI agent strategies that improve GPT-4 and GPT-3.5 performance",
      "by": "Andrew Ng (DeepLearning.AI The Batch)",
      "url": "https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/",
      "year": 2024,
      "note": "Reflection, tool use, planning, multi-agent collaboration."
    },
    {
      "type": "video",
      "title": "Building Effective Agents with LangGraph",
      "by": "LangChain",
      "url": "https://www.youtube.com/watch?v=aHCDrAbH_go",
      "year": 2025,
      "note": "Implements Anthropic's workflow patterns in LangGraph."
    },
    {
      "type": "tool",
      "title": "Basic workflows",
      "by": "Anthropic - Claude Cookbook",
      "url": "https://platform.claude.com/cookbook/patterns-agents-basic-workflows",
      "year": 2026,
      "note": "Runnable code for chaining, routing and parallelization."
    },
    {
      "type": "tool",
      "title": "Orchestrator workers",
      "by": "Anthropic - Claude Cookbook",
      "url": "https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers",
      "year": 2026,
      "note": "Runnable orchestrator-workers pattern."
    }
  ],
  "subagents": [
    {
      "type": "docs",
      "title": "Create custom subagents",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/sub-agents",
      "year": 2026,
      "note": "Subagent files, scopes, built-ins, nesting, background runs."
    },
    {
      "type": "docs",
      "title": "Subagents in the SDK",
      "by": "Anthropic - Claude Agent SDK docs",
      "url": "https://code.claude.com/docs/en/agent-sdk/subagents",
      "year": 2026,
      "note": "Programmatic subagents, inheritance, resume, depth/spend caps."
    },
    {
      "type": "docs",
      "title": "Agent orchestration",
      "by": "OpenAI - Agents SDK docs",
      "url": "https://openai.github.io/openai-agents-python/multi_agent/",
      "year": 2026,
      "note": "Agents-as-tools vs handoffs; LLM- vs code-driven orchestration."
    },
    {
      "type": "docs",
      "title": "Subagents",
      "by": "LangChain docs",
      "url": "https://docs.langchain.com/oss/python/langchain/multi-agent/subagents",
      "year": 2026,
      "note": "Supervisor calling subagents as tools in LangChain."
    },
    {
      "type": "docs",
      "title": "Workflows: multi-agent, multi-node applications",
      "by": "Google - ADK docs",
      "url": "https://adk.dev/workflows/",
      "year": 2026,
      "note": "ADK multi-agent composition, routing and collaboration."
    },
    {
      "type": "blog",
      "title": "How we built our multi-agent research system",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
      "year": 2025,
      "note": "Lead agent delegating to parallel subagents in Claude Research."
    },
    {
      "type": "video",
      "title": "Tool, skill, or subagent? Decomposing an agent that outgrew its prompt",
      "by": "Claude (Anthropic)",
      "year": 2026,
      "url": "https://www.youtube.com/watch?v=mWvtOHlZM-I",
      "note": "Live decomposition of a bloated agent into tools, skills and sub-agents, with evals."
    }
  ],
  "multi-agent": [
    {
      "type": "blog",
      "title": "How we built our multi-agent research system",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
      "year": 2025,
      "note": "Orchestrator-worker design, prompting lessons, costs, evals."
    },
    {
      "type": "blog",
      "title": "Don’t Build Multi-Agents",
      "by": "Cognition (Walden Yan)",
      "url": "https://cognition.ai/blog/dont-build-multi-agents",
      "year": 2025,
      "note": "Context-sharing principles; case for single-threaded agents."
    },
    {
      "type": "blog",
      "title": "Multi-Agents: What's Actually Working",
      "by": "Cognition",
      "url": "https://cognition.ai/blog/multi-agents-working",
      "year": 2026,
      "note": "2026 update: reviewer loops, smart-friend escalation, managers."
    },
    {
      "type": "blog",
      "title": "Towards a science of scaling agent systems: When and why agent systems work",
      "by": "Google Research",
      "url": "https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/",
      "year": 2026,
      "note": "Controlled study of when multi-agent beats single agent."
    },
    {
      "type": "paper",
      "title": "Why Do Multi-Agent LLM Systems Fail?",
      "by": "Mert Cemri et al. (UC Berkeley)",
      "url": "https://arxiv.org/abs/2503.13657",
      "year": 2025,
      "note": "MAST taxonomy of 14 multi-agent failure modes."
    },
    {
      "type": "paper",
      "title": "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation",
      "by": "Qingyun Wu et al. (Microsoft)",
      "url": "https://arxiv.org/abs/2308.08155",
      "year": 2023,
      "note": "Seminal conversable multi-agent framework."
    },
    {
      "type": "paper",
      "title": "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework",
      "by": "Sirui Hong et al.",
      "url": "https://arxiv.org/abs/2308.00352",
      "year": 2023,
      "note": "Role-based agents following standard operating procedures."
    },
    {
      "type": "video",
      "title": "Multi Agent Systems Explained: How AI Agents & LLMs Work Together",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=sWH0T4Zez6I",
      "year": 2025,
      "note": "Explainer of how multiple LLM agents coordinate."
    },
    {
      "type": "video",
      "title": "Building more effective AI agents",
      "by": "Anthropic",
      "url": "https://www.youtube.com/watch?v=uhJJgc-0iTQ",
      "year": 2025,
      "note": "Anthropic discussion of multi-agent patterns, skills, MCP, tools."
    }
  ],
  "a2a": [
    {
      "type": "spec",
      "title": "A2A Protocol Specification",
      "by": "A2A Project (Linux Foundation / AAIF)",
      "url": "https://a2a-protocol.org/latest/specification/",
      "year": 2026,
      "note": "Normative spec v1.0.0: data model, operations, bindings."
    },
    {
      "type": "docs",
      "title": "What is A2A?",
      "by": "A2A Project",
      "url": "https://a2a-protocol.org/latest/topics/what-is-a2a/",
      "year": 2026,
      "note": "Official conceptual introduction to the protocol."
    },
    {
      "type": "docs",
      "title": "A2A and MCP",
      "by": "A2A Project",
      "url": "https://a2a-protocol.org/latest/topics/a2a-and-mcp/",
      "year": 2026,
      "note": "How A2A (agent-to-agent) complements MCP (agent-to-tool)."
    },
    {
      "type": "blog",
      "title": "Announcing the Agent2Agent Protocol (A2A)",
      "by": "Google Developers Blog",
      "url": "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
      "year": 2025,
      "note": "Original launch post with design principles and partners."
    },
    {
      "type": "blog",
      "title": "Linux Foundation Launches the Agent2Agent Protocol Project to Enable Secure, Intelligent Communication Between AI Agents",
      "by": "Linux Foundation",
      "url": "https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents",
      "year": 2025,
      "note": "A2A moves to neutral open governance."
    },
    {
      "type": "blog",
      "title": "ACP Joins Forces with A2A",
      "by": "LF AI & Data",
      "url": "https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/",
      "year": 2025,
      "note": "IBM's ACP merges into A2A."
    },
    {
      "type": "blog",
      "title": "A2A joins AAIF’s open agentic stack",
      "by": "Agentic AI Foundation",
      "url": "https://aaif.io/blog/a2a-joins-aaif",
      "year": 2026,
      "note": "A2A becomes an AAIF hosted project; v1.0 recap."
    },
    {
      "type": "video",
      "title": "Introduction to Agent2Agent (A2A) Protocol",
      "by": "Google Cloud Tech",
      "url": "https://www.youtube.com/watch?v=Fbr_Solax1w",
      "year": 2026,
      "note": "Google's official video introduction to A2A."
    },
    {
      "type": "video",
      "title": "A2A Protocol (Agent2Agent) Explained: How AI Agents Collaborate",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=Tud9HLTk8hg",
      "year": 2025,
      "note": "Whiteboard explainer of A2A concepts."
    }
  ],
  "long-running": [
    {
      "type": "docs",
      "title": "Use Claude Code in the cloud",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/claude-code-on-the-web",
      "year": 2026,
      "note": "Cloud sessions, --cloud/--teleport, auto-fix PRs, limits."
    },
    {
      "type": "docs",
      "title": "Keep Claude working toward a goal",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/goal",
      "year": 2026,
      "note": "/goal completion conditions with a separate evaluator."
    },
    {
      "type": "docs",
      "title": "Checkpointing",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/checkpointing",
      "year": 2026,
      "note": "Automatic checkpoints, /rewind, limitations."
    },
    {
      "type": "docs",
      "title": "Codex Cloud",
      "by": "OpenAI - Codex docs (ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/cloud",
      "year": 2026,
      "note": "Delegating Codex tasks to cloud environments."
    },
    {
      "type": "blog",
      "title": "Effective harnesses for long-running agents",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "year": 2025,
      "note": "How to keep agents productive across many context windows."
    },
    {
      "type": "blog",
      "title": "Time Horizon 1.1",
      "by": "METR",
      "url": "https://metr.org/blog/2026-1-29-time-horizon-1-1/",
      "year": 2026,
      "note": "Updated task suite, doubling times and model horizons."
    },
    {
      "type": "blog",
      "title": "Frontier Risk Report (February to March 2026)",
      "by": "METR",
      "url": "https://metr.org/blog/2026-05-19-frontier-risk-report/",
      "year": 2026,
      "note": "Latest public-frontier time horizons (~12 h at 50%)."
    },
    {
      "type": "blog",
      "title": "Ralph Wiggum as a \"software engineer\"",
      "by": "Geoffrey Huntley",
      "url": "https://ghuntley.com/ralph/",
      "year": 2025,
      "note": "Original Ralph loop: rerun one prompt until the work converges."
    },
    {
      "type": "paper",
      "title": "Measuring AI Ability to Complete Long Software Tasks",
      "by": "Thomas Kwa, Ben West et al. (METR)",
      "url": "https://arxiv.org/abs/2503.14499",
      "year": 2025,
      "note": "Introduces the 50% task-completion time horizon metric."
    }
  ],
  "verification": [
    {
      "type": "docs",
      "title": "Best practices for Claude Code",
      "by": "Anthropic - Claude Code docs",
      "url": "https://code.claude.com/docs/en/best-practices",
      "year": 2026,
      "note": "'Give Claude a way to verify its work' and other practices."
    },
    {
      "type": "blog",
      "title": "Harness design for long-running application development",
      "by": "Anthropic (Prithvi Rajasekaran)",
      "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps",
      "year": 2026,
      "note": "Why separate evaluator agents beat self-grading."
    },
    {
      "type": "blog",
      "title": "Agentic Design Patterns Part 2: Reflection",
      "by": "Andrew Ng (DeepLearning.AI The Batch)",
      "url": "https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/",
      "year": 2024,
      "note": "Reflection as a simple, high-impact agentic pattern."
    },
    {
      "type": "paper",
      "title": "Reflexion: Language Agents with Verbal Reinforcement Learning",
      "by": "Noah Shinn et al.",
      "url": "https://arxiv.org/abs/2303.11366",
      "year": 2023,
      "note": "Self-reflection stored as memory to improve subsequent attempts."
    },
    {
      "type": "paper",
      "title": "Self-Refine: Iterative Refinement with Self-Feedback",
      "by": "Aman Madaan et al.",
      "url": "https://arxiv.org/abs/2303.17651",
      "year": 2023,
      "note": "Generate-critique-revise loop with a single LLM."
    },
    {
      "type": "paper",
      "title": "Large Language Models Cannot Self-Correct Reasoning Yet",
      "by": "Jie Huang et al. (Google DeepMind)",
      "url": "https://arxiv.org/abs/2310.01798",
      "year": 2023,
      "note": "Limits of intrinsic self-correction without external feedback."
    },
    {
      "type": "video",
      "title": "Claude Code best practices | Code w/ Claude",
      "by": "Anthropic",
      "url": "https://www.youtube.com/watch?v=gv0WHhKelSE",
      "year": 2025,
      "note": "Anthropic talk on Claude Code workflows incl. tests and verification."
    },
    {
      "type": "tool",
      "title": "Evaluator optimizer",
      "by": "Anthropic - Claude Cookbook",
      "url": "https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer",
      "year": 2026,
      "note": "Runnable generator + evaluator feedback loop."
    }
  ],
  "context-engineering": [
    {
      "type": "definition",
      "title": "What Is Context Engineering?",
      "by": "IBM Think (Joshua Noble)",
      "url": "https://www.ibm.com/think/topics/context-engineering",
      "year": 2026,
      "note": "Plain-language definition of context engineering for LLM applications."
    },
    {
      "type": "guide",
      "title": "Effective context engineering for AI agents",
      "by": "Anthropic Applied AI (Rajasekaran, Dixon, Ryan, Hadfield)",
      "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      "year": 2025,
      "note": "Attention budget, context rot, compaction, note-taking, sub-agents, just-in-time retrieval."
    },
    {
      "type": "blog",
      "title": "Context Engineering",
      "by": "LangChain",
      "url": "https://www.langchain.com/blog/context-engineering-for-agents",
      "year": 2025,
      "note": "Write/select/compress/isolate strategies, illustrated with popular agents and papers."
    },
    {
      "type": "blog",
      "title": "Context Engineering for AI Agents: Lessons from Building Manus",
      "by": "Yichao 'Peak' Ji, Manus",
      "url": "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
      "year": 2025,
      "note": "Production lessons: KV-cache, tool masking, file system as memory, recitation."
    },
    {
      "type": "blog",
      "title": "How Long Contexts Fail",
      "by": "Drew Breunig",
      "url": "https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html",
      "year": 2025,
      "note": "Four failure modes: context poisoning, distraction, confusion, clash."
    },
    {
      "type": "blog",
      "title": "Context engineering",
      "by": "Simon Willison",
      "url": "https://simonwillison.net/2025/Jun/27/context-engineering/",
      "year": 2025,
      "note": "Origin of the term; Lütke and Karpathy quotes, why it beats 'prompt engineering'."
    },
    {
      "type": "paper",
      "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance",
      "by": "Chroma (Kelly Hong, Anton Troynikov, Jeff Huber)",
      "url": "https://research.trychroma.com/context-rot",
      "year": 2025,
      "note": "Technical report: 18 LLMs degrade non-uniformly as input length grows."
    },
    {
      "type": "paper",
      "title": "Lost in the Middle: How Language Models Use Long Contexts",
      "by": "Liu, Lin, Hewitt, Paranjape et al.",
      "url": "https://arxiv.org/abs/2307.03172",
      "year": 2023,
      "note": "Seminal evidence that position in long context changes accuracy."
    },
    {
      "type": "video",
      "title": "Context Engineering for Agents",
      "by": "LangChain",
      "url": "https://www.youtube.com/watch?v=4GiqzUHD5AA",
      "year": 2025,
      "note": "Video companion to LangChain's context engineering post."
    }
  ],
  "compaction": [
    {
      "type": "docs",
      "title": "Compaction overview",
      "by": "Anthropic - Claude Platform Docs",
      "url": "https://platform.claude.com/docs/en/build-with-claude/compaction",
      "year": 2026,
      "note": "On-demand vs threshold compaction vs client-side summarizers; beta headers."
    },
    {
      "type": "docs",
      "title": "Context editing",
      "by": "Anthropic - Claude Platform Docs",
      "url": "https://platform.claude.com/docs/en/build-with-claude/context-editing",
      "year": 2025,
      "note": "Rule-based clearing of old tool results and thinking blocks."
    },
    {
      "type": "docs",
      "title": "Compaction",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/compaction",
      "year": 2025,
      "note": "Server-side compaction and the /responses/compact endpoint."
    },
    {
      "type": "docs",
      "title": "Context compression",
      "by": "Google - Agent Development Kit (ADK) docs",
      "url": "https://adk.dev/context/compaction/",
      "year": 2025,
      "note": "Token-based and sliding-window compaction of ADK session events."
    },
    {
      "type": "blog",
      "title": "Managing context on the Claude Developer Platform",
      "by": "Anthropic",
      "url": "https://claude.com/resources/articles/context-management",
      "year": 2025,
      "note": "Launch of context editing and memory tool with eval results."
    },
    {
      "type": "blog",
      "title": "Effective harnesses for long-running agents",
      "by": "Anthropic (Justin Young)",
      "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "year": 2025,
      "note": "Why compaction alone fails; progress files, feature lists, git."
    }
  ],
  "memory": [
    {
      "type": "definition",
      "title": "What Is AI Agent Memory?",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/ai-agent-memory",
      "year": 2025,
      "note": "Explainer on short- and long-term agent memory types and frameworks."
    },
    {
      "type": "docs",
      "title": "Memory tool",
      "by": "Anthropic - Claude Platform Docs",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool",
      "year": 2025,
      "note": "Client-side file memory for Claude agents; commands and security."
    },
    {
      "type": "docs",
      "title": "Memory overview",
      "by": "LangChain (LangGraph docs)",
      "url": "https://docs.langchain.com/oss/python/concepts/memory",
      "year": 2026,
      "note": "Short- vs long-term memory; semantic, episodic, procedural in practice."
    },
    {
      "type": "paper",
      "title": "Cognitive Architectures for Language Agents",
      "by": "Sumers, Yao, Narasimhan, Griffiths",
      "url": "https://arxiv.org/abs/2309.02427",
      "year": 2023,
      "note": "CoALA: working, episodic, semantic, procedural memory for agents."
    },
    {
      "type": "paper",
      "title": "MemGPT: Towards LLMs as Operating Systems",
      "by": "Packer, Wooders, Lin, Fang et al.",
      "url": "https://arxiv.org/abs/2310.08560",
      "year": 2023,
      "note": "OS-style virtual context management across memory tiers."
    },
    {
      "type": "paper",
      "title": "Generative Agents: Interactive Simulacra of Human Behavior",
      "by": "Park, O'Brien, Cai, Morris et al.",
      "url": "https://arxiv.org/abs/2304.03442",
      "year": 2023,
      "note": "Memory stream, reflection and retrieval for believable agents."
    },
    {
      "type": "course",
      "title": "LLMs as Operating Systems: Agent Memory",
      "by": "DeepLearning.AI with Letta",
      "url": "https://www.deeplearning.ai/courses/llms-as-operating-systems-agent-memory",
      "year": 2024,
      "note": "Short course building MemGPT-style self-editing memory agents."
    }
  ],
  "instructions": [
    {
      "type": "spec",
      "title": "AGENTS.md",
      "by": "agents.md (Agentic AI Foundation)",
      "url": "https://agents.md/",
      "year": 2025,
      "note": "Official site of the open AGENTS.md format with examples and FAQ."
    },
    {
      "type": "docs",
      "title": "How Claude remembers your project",
      "by": "Anthropic - Claude Code Docs",
      "url": "https://code.claude.com/docs/en/memory",
      "year": 2026,
      "note": "CLAUDE.md scopes, .claude/rules, AGENTS.md support, auto memory."
    },
    {
      "type": "docs",
      "title": "Custom instructions with AGENTS.md",
      "by": "OpenAI - Codex docs (ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
      "year": 2026,
      "note": "How Codex discovers, layers and caps AGENTS.md files."
    },
    {
      "type": "docs",
      "title": "Adding repository custom instructions for GitHub Copilot",
      "by": "GitHub Docs",
      "url": "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions",
      "year": 2026,
      "note": "copilot-instructions.md, path-specific instructions, AGENTS.md."
    },
    {
      "type": "docs",
      "title": "Rules",
      "by": "Cursor Docs",
      "url": "https://cursor.com/docs/rules",
      "year": 2026,
      "note": "Project, user and team rules (.mdc) and AGENTS.md in Cursor."
    },
    {
      "type": "docs",
      "title": "Provide context with GEMINI.md files",
      "by": "Google - Gemini CLI docs",
      "url": "https://geminicli.com/docs/cli/gemini-md/",
      "year": 2026,
      "note": "Hierarchical and just-in-time GEMINI.md context files."
    },
    {
      "type": "blog",
      "title": "Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md",
      "by": "Linux Foundation",
      "url": "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation",
      "year": 2025,
      "note": "Press release: AGENTS.md moves to neutral foundation governance."
    },
    {
      "type": "paper",
      "title": "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?",
      "by": "Gloaguen, Mündler-Sasahara, Müller, Raychev, Vechev",
      "url": "https://arxiv.org/abs/2602.11988",
      "year": 2026,
      "note": "Context files rarely raise success and add 20%+ cost."
    },
    {
      "type": "paper",
      "title": "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents",
      "by": "Lulla, Mohsenimofidi, Galster, Zhang et al.",
      "url": "https://arxiv.org/abs/2601.20404",
      "year": 2026,
      "note": "AGENTS.md linked to faster runs and fewer output tokens."
    }
  ],
  "skills": [
    {
      "type": "spec",
      "title": "Specification - Agent Skills",
      "by": "agentskills.io (open standard, originated at Anthropic)",
      "url": "https://agentskills.io/specification",
      "year": 2025,
      "note": "Normative SKILL.md format, frontmatter fields, directory layout."
    },
    {
      "type": "docs",
      "title": "Agent Skills",
      "by": "Anthropic - Claude Platform Docs",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
      "year": 2026,
      "note": "Using skills through the Claude API and apps."
    },
    {
      "type": "docs",
      "title": "Extend Claude with skills",
      "by": "Anthropic - Claude Code Docs",
      "url": "https://code.claude.com/docs/en/skills",
      "year": 2026,
      "note": "Authoring, invoking and sharing skills in Claude Code."
    },
    {
      "type": "blog",
      "title": "Equipping agents for the real world with Agent Skills",
      "by": "Anthropic (Barry Zhang, Keith Lazuka, Mahesh Murag)",
      "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
      "year": 2025,
      "note": "Engineering rationale: SKILL.md, progressive disclosure, code in skills."
    },
    {
      "type": "blog",
      "title": "Claude Skills are awesome, maybe a bigger deal than MCP",
      "by": "Simon Willison",
      "url": "https://simonwillison.net/2025/Oct/16/claude-skills/",
      "year": 2025,
      "note": "Early analysis of skills' simplicity versus MCP."
    },
    {
      "type": "paper",
      "title": "Voyager: An Open-Ended Embodied Agent with Large Language Models",
      "by": "Wang, Xie, Jiang, Mandlekar et al.",
      "url": "https://arxiv.org/abs/2305.16291",
      "year": 2023,
      "note": "Seminal skill library of executable code for lifelong learning."
    },
    {
      "type": "paper",
      "title": "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks",
      "by": "Li, Liu, Chen, You et al.",
      "url": "https://arxiv.org/abs/2602.12670",
      "year": 2026,
      "note": "Paired benchmark: curated skills raise pass rates 16.6 pp."
    },
    {
      "type": "video",
      "title": "Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=CEvIs9y1uog",
      "year": 2025,
      "note": "Barry Zhang and Mahesh Murag on building skills instead of agents."
    },
    {
      "type": "course",
      "title": "Introduction to agent skills",
      "by": "Claude Academy (Anthropic)",
      "year": 2026,
      "url": "https://academy.claude.com/courses/introduction-to-agent-skills",
      "note": "Create, structure and share skills; compare them with sub-agents, hooks and MCP."
    },
    {
      "type": "tool",
      "title": "anthropics/skills",
      "by": "Anthropic (GitHub)",
      "url": "https://github.com/anthropics/skills",
      "year": 2025,
      "note": "Public repository of example skills, spec and template."
    }
  ],
  "playbooks": [
    {
      "type": "docs",
      "title": "Creating Playbooks",
      "by": "Cognition - Devin Docs",
      "url": "https://docs.devin.ai/product-guides/creating-playbooks",
      "year": 2026,
      "note": "What playbooks are, template sections, sharing via macros."
    },
    {
      "type": "docs",
      "title": "Devin Skills",
      "by": "Cognition - Devin Docs",
      "url": "https://docs.devin.ai/product-guides/skills",
      "year": 2026,
      "note": "Skills vs playbooks vs memory comparison table."
    },
    {
      "type": "docs",
      "title": "Playbooks",
      "by": "Google Cloud - Dialogflow CX docs",
      "url": "https://docs.cloud.google.com/dialogflow/cx/docs/concept/playbook",
      "year": 2026,
      "note": "Vendor feature: goal, instructions, examples for generative agents."
    },
    {
      "type": "docs",
      "title": "Use promptbooks in Microsoft Security Copilot",
      "by": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/copilot/security/using-promptbooks",
      "year": 2026,
      "note": "Prebuilt prompt sequences used like security playbooks."
    },
    {
      "type": "paper",
      "title": "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models",
      "by": "Zhang, Hu, Upasani, Ma et al.",
      "url": "https://arxiv.org/abs/2510.04618",
      "year": 2025,
      "note": "ACE: contexts as evolving playbooks via reflection and curation."
    },
    {
      "type": "paper",
      "title": "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory",
      "by": "Suzgun, Yuksekgonul, Bianchi, Jurafsky, Zou",
      "url": "https://arxiv.org/abs/2504.07952",
      "year": 2025,
      "note": "Self-curated memory of reusable strategies at inference time."
    },
    {
      "type": "paper",
      "title": "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework",
      "by": "Hong, Zhuge, Chen, Zheng et al.",
      "url": "https://arxiv.org/abs/2308.00352",
      "year": 2023,
      "note": "Encodes human SOPs into multi-agent prompt workflows."
    }
  ],
  "commands": [
    {
      "type": "spec",
      "title": "Prompts",
      "by": "Model Context Protocol specification (2026-07-28)",
      "url": "https://modelcontextprotocol.io/specification/2026-07-28/server/prompts",
      "year": 2026,
      "note": "MCP prompt templates, user-controlled, often shown as slash commands."
    },
    {
      "type": "docs",
      "title": "Commands",
      "by": "Anthropic - Claude Code Docs",
      "url": "https://code.claude.com/docs/en/commands",
      "year": 2026,
      "note": "Built-in commands, bundled skills and MCP prompts as commands."
    },
    {
      "type": "docs",
      "title": "Extend Claude with skills",
      "by": "Anthropic - Claude Code Docs",
      "url": "https://code.claude.com/docs/en/skills",
      "year": 2026,
      "note": "States custom commands are merged into skills."
    },
    {
      "type": "docs",
      "title": "Custom commands",
      "by": "Google - Gemini CLI docs",
      "url": "https://geminicli.com/docs/cli/custom-commands/",
      "year": 2026,
      "note": "TOML command files, namespacing and arguments."
    },
    {
      "type": "docs",
      "title": "Custom Prompts",
      "by": "OpenAI - Codex docs (ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/custom-prompts",
      "year": 2026,
      "note": "Deprecated Codex prompt commands; points to skills."
    },
    {
      "type": "docs",
      "title": "Use prompt files in VS Code",
      "by": "Microsoft - VS Code docs",
      "url": "https://code.visualstudio.com/docs/agent-customization/prompt-files",
      "year": 2026,
      "note": ".prompt.md slash commands and migration to skills."
    },
    {
      "type": "docs",
      "title": "Skills (How do I migrate commands to skills?)",
      "by": "Cursor Help",
      "url": "https://cursor.com/help/customization/skills",
      "year": 2026,
      "note": "Cursor's /migrate-to-skills for commands and rules."
    }
  ],
  "plugins": [
    {
      "type": "spec",
      "title": "Agent Plugins",
      "by": "agent-plugins.org (open standard)",
      "url": "https://agent-plugins.org/",
      "year": 2026,
      "note": "Portable plugin.json + skills + mcp.json packaging standard."
    },
    {
      "type": "docs",
      "title": "Plugins overview",
      "by": "Anthropic - Claude Code Docs",
      "url": "https://code.claude.com/docs/en/plugins/overview",
      "year": 2026,
      "note": "What a Claude Code plugin contains and when to use one."
    },
    {
      "type": "docs",
      "title": "Plugins",
      "by": "OpenAI - ChatGPT and Codex docs (ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/plugins",
      "year": 2026,
      "note": "Universal plugin directory across ChatGPT and Codex surfaces."
    },
    {
      "type": "docs",
      "title": "Gemini CLI extensions",
      "by": "Google - Gemini CLI docs",
      "url": "https://geminicli.com/docs/extensions/",
      "year": 2026,
      "note": "Packaging commands, MCP, hooks, sub-agents and skills."
    },
    {
      "type": "docs",
      "title": "Agent plugins in VS Code",
      "by": "Microsoft - VS Code docs",
      "url": "https://code.visualstudio.com/docs/agent-customization/agent-plugins",
      "year": 2026,
      "note": "Installing plugin bundles from marketplaces in VS Code."
    },
    {
      "type": "docs",
      "title": "Plugins",
      "by": "Cursor Docs",
      "url": "https://cursor.com/docs/plugins",
      "year": 2026,
      "note": "Cursor plugin components, Agent Plugins support, Marketplace."
    },
    {
      "type": "blog",
      "title": "Customize Claude Code with plugins",
      "by": "Anthropic",
      "url": "https://claude.com/resources/articles/claude-code-plugins",
      "year": 2025,
      "note": "Launch post: plugins and plugin marketplaces (Oct 2025)."
    },
    {
      "type": "blog",
      "title": "Customize Cowork with plugins",
      "by": "Anthropic",
      "url": "https://claude.com/resources/articles/cowork-plugins",
      "year": 2026,
      "note": "Role plugins for Claude Cowork; 11 open-sourced plugins."
    }
  ],
  "rag": [
    {
      "type": "definition",
      "title": "What is retrieval-augmented generation (RAG)?",
      "by": "IBM Research",
      "url": "https://research.ibm.com/blog/retrieval-augmented-generation-RAG",
      "year": 2023,
      "note": "Accessible definition and benefits of grounding LLMs."
    },
    {
      "type": "blog",
      "title": "Contextual Retrieval in AI Systems",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/engineering/contextual-retrieval",
      "year": 2024,
      "note": "Contextual embeddings + contextual BM25 + reranking, with results."
    },
    {
      "type": "paper",
      "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      "by": "Lewis, Perez, Piktus, Petroni et al.",
      "url": "https://arxiv.org/abs/2005.11401",
      "year": 2020,
      "note": "Seminal RAG paper (parametric + non-parametric memory)."
    },
    {
      "type": "paper",
      "title": "Retrieval-Augmented Generation for Large Language Models: A Survey",
      "by": "Gao, Xiong, Gao, Jia et al.",
      "url": "https://arxiv.org/abs/2312.10997",
      "year": 2023,
      "note": "Naive, advanced and modular RAG; components and evaluation."
    },
    {
      "type": "paper",
      "title": "From Local to Global: A Graph RAG Approach to Query-Focused Summarization",
      "by": "Edge, Trinh, Cheng, Bradley et al. (Microsoft)",
      "url": "https://arxiv.org/abs/2404.16130",
      "year": 2024,
      "note": "GraphRAG: knowledge graph + community summaries."
    },
    {
      "type": "video",
      "title": "What is Retrieval-Augmented Generation (RAG)?",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
      "year": 2023,
      "note": "Short explainer of how RAG grounds LLM answers."
    },
    {
      "type": "video",
      "title": "RAG vs. Fine Tuning",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=00Q0G84kq3M",
      "year": 2024,
      "note": "When to retrieve versus when to fine-tune."
    }
  ],
  "embeddings": [
    {
      "type": "definition",
      "title": "Embeddings",
      "by": "Google for Developers - Machine Learning Crash Course",
      "url": "https://developers.google.com/machine-learning/crash-course/embeddings",
      "year": 2026,
      "note": "Intro to embedding spaces and similarity."
    },
    {
      "type": "docs",
      "title": "Hybrid Search Scoring (RRF)",
      "by": "Microsoft Learn - Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking",
      "year": 2026,
      "note": "How Reciprocal Rank Fusion merges keyword and vector results."
    },
    {
      "type": "guide",
      "title": "Rerankers and Two-Stage Retrieval",
      "by": "Pinecone (James Briggs)",
      "url": "https://www.pinecone.io/learn/series/rag/rerankers/",
      "year": 2023,
      "note": "Why and how to add a reranker after vector search."
    },
    {
      "type": "paper",
      "title": "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
      "by": "Nils Reimers, Iryna Gurevych",
      "url": "https://arxiv.org/abs/1908.10084",
      "year": 2019,
      "note": "Seminal sentence-embedding method behind semantic search."
    },
    {
      "type": "paper",
      "title": "MTEB: Massive Text Embedding Benchmark",
      "by": "Muennighoff, Tazi, Magne, Reimers",
      "url": "https://arxiv.org/abs/2210.07316",
      "year": 2022,
      "note": "Standard benchmark for comparing embedding models."
    },
    {
      "type": "video",
      "title": "What is a Vector Database?",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=t9IDoenf-lo",
      "year": 2024,
      "note": "Explainer of vector databases and similarity search."
    },
    {
      "type": "video",
      "title": "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
      "by": "3Blue1Brown",
      "url": "https://www.youtube.com/watch?v=wjZofJX0v4M",
      "year": 2024,
      "note": "Visual intro to transformers, including word embeddings as directions in space."
    },
    {
      "type": "tool",
      "title": "MTEB Leaderboard",
      "by": "MTEB on Hugging Face",
      "url": "https://huggingface.co/spaces/mteb/leaderboard",
      "year": 2026,
      "note": "Live rankings of embedding models by task and language."
    }
  ],
  "search": [
    {
      "type": "docs",
      "title": "Web search tool",
      "by": "Anthropic - Claude Platform Docs",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
      "year": 2026,
      "note": "Versions, dynamic filtering, citations, pricing."
    },
    {
      "type": "docs",
      "title": "Web search",
      "by": "OpenAI API docs",
      "url": "https://developers.openai.com/api/docs/guides/tools-web-search",
      "year": 2026,
      "note": "web_search tool modes, domain filters, citations."
    },
    {
      "type": "docs",
      "title": "Grounding with Google Search",
      "by": "Google AI for Developers - Gemini API",
      "url": "https://ai.google.dev/gemini-api/docs/google-search",
      "year": 2026,
      "note": "google_search tool, citations and billing."
    },
    {
      "type": "docs",
      "title": "Gemini Deep Research agent",
      "by": "Google AI for Developers - Gemini API",
      "url": "https://ai.google.dev/gemini-api/docs/deep-research",
      "year": 2026,
      "note": "Deep Research agent via the Interactions API."
    },
    {
      "type": "docs",
      "title": "Search",
      "by": "Cursor Docs",
      "url": "https://cursor.com/docs/agent/tools/search",
      "year": 2026,
      "note": "Instant Grep and Explore subagent; no codebase embeddings."
    },
    {
      "type": "blog",
      "title": "Claude Code: Anthropic's Agent in Your Terminal",
      "by": "Latent Space (with Boris Cherny & Cat Wu)",
      "url": "https://www.latent.space/p/claude-code",
      "year": 2025,
      "note": "Why Claude Code chose agentic search over a RAG index."
    },
    {
      "type": "blog",
      "title": "How we built our multi-agent research system",
      "by": "Anthropic (Hadfield, Zhang, Lien et al.)",
      "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
      "year": 2025,
      "note": "Architecture, prompting and evals of Claude Research."
    },
    {
      "type": "paper",
      "title": "BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents",
      "by": "Wei, Sun, Papay, McKinney et al. (OpenAI)",
      "url": "https://arxiv.org/abs/2504.12516",
      "year": 2025,
      "note": "Benchmark of hard-to-find facts for web agents."
    },
    {
      "type": "video",
      "title": "Introduction to Deep Research",
      "by": "OpenAI",
      "url": "https://www.youtube.com/watch?v=YkCDVn3_wiw",
      "year": 2025,
      "note": "Launch demo of ChatGPT deep research."
    }
  ],
  "tools": [
    {
      "type": "definition",
      "title": "What Is Tool Calling?",
      "by": "IBM Think (Cole Stryker)",
      "url": "https://www.ibm.com/think/topics/tool-calling",
      "year": 2025,
      "note": "Plain-language explainer of tool/function calling for agents."
    },
    {
      "type": "docs",
      "title": "Tool use with Claude",
      "by": "Anthropic",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
      "year": 2026,
      "note": "Client vs server tools, tool loop, which tool fits which task."
    },
    {
      "type": "docs",
      "title": "Function calling",
      "by": "OpenAI",
      "url": "https://developers.openai.com/api/docs/guides/function-calling",
      "year": 2026,
      "note": "Function and custom tools, strict mode, namespaces, tool search."
    },
    {
      "type": "docs",
      "title": "Function calling with the Gemini API",
      "by": "Google AI for Developers",
      "url": "https://ai.google.dev/gemini-api/docs/function-calling",
      "year": 2026,
      "note": "Calling modes, parallel and compositional function calls."
    },
    {
      "type": "docs",
      "title": "Structured outputs",
      "by": "Anthropic",
      "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
      "year": 2026,
      "note": "Schema-validated JSON outputs and strict tool inputs for Claude."
    },
    {
      "type": "docs",
      "title": "Structured model outputs",
      "by": "OpenAI",
      "url": "https://developers.openai.com/api/docs/guides/structured-outputs",
      "year": 2026,
      "note": "JSON Schema-conformant responses and strict function calling."
    },
    {
      "type": "blog",
      "title": "Writing effective tools for agents — with agents",
      "by": "Anthropic Engineering (Ken Aizawa)",
      "url": "https://www.anthropic.com/engineering/writing-tools-for-agents",
      "year": 2025,
      "note": "Principles and eval loop for designing agent-friendly tools."
    },
    {
      "type": "blog",
      "title": "Introducing advanced tool use on the Claude Developer Platform",
      "by": "Anthropic Engineering (Bin Wu et al.)",
      "url": "https://www.anthropic.com/engineering/advanced-tool-use",
      "year": 2025,
      "note": "Tool search, programmatic tool calling, tool use examples, with metrics."
    },
    {
      "type": "video",
      "title": "What is Tool Calling? Connecting LLMs to Your Data",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
      "year": 2025,
      "note": "Short whiteboard explainer of the tool-calling loop."
    }
  ],
  "mcp": [
    {
      "type": "definition",
      "title": "What is the Model Context Protocol (MCP)?",
      "by": "Model Context Protocol (modelcontextprotocol.io)",
      "url": "https://modelcontextprotocol.io/docs/getting-started/intro",
      "year": 2026,
      "note": "Official intro: hosts, clients, servers, why MCP exists."
    },
    {
      "type": "definition",
      "title": "What is Model Context Protocol (MCP)?",
      "by": "IBM Think (Anna Gutowska)",
      "url": "https://www.ibm.com/think/topics/model-context-protocol",
      "year": 2025,
      "note": "Neutral explainer of MCP architecture and use cases."
    },
    {
      "type": "spec",
      "title": "Specification",
      "by": "Model Context Protocol (revision 2026-07-28; AAIF / Linux Foundation)",
      "url": "https://modelcontextprotocol.io/specification/2026-07-28",
      "year": 2026,
      "note": "Authoritative current protocol specification."
    },
    {
      "type": "spec",
      "title": "Key Changes",
      "by": "Model Context Protocol (2026-07-28 changelog)",
      "url": "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
      "year": 2026,
      "note": "What changed since 2025-11-25: stateless, MRTR, deprecations."
    },
    {
      "type": "blog",
      "title": "The 2026-07-28 Specification",
      "by": "MCP Blog (David Soria Parra, Den Delimarsky)",
      "url": "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
      "year": 2026,
      "note": "Maintainers explain the release and adoption numbers."
    },
    {
      "type": "blog",
      "title": "Introducing the Model Context Protocol",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/news/model-context-protocol",
      "year": 2024,
      "note": "Original Nov 2024 launch announcement."
    },
    {
      "type": "blog",
      "title": "Donating the Model Context Protocol and establishing the Agentic AI Foundation",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation",
      "year": 2025,
      "note": "MCP moves to Linux Foundation's AAIF (Dec 2025)."
    },
    {
      "type": "video",
      "title": "What is MCP? Integrate AI Agents with Databases & APIs",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=eur8dUO9mvE",
      "year": 2025,
      "note": "Concise visual explainer of MCP clients and servers."
    },
    {
      "type": "video",
      "title": "Building Agents with Model Context Protocol - Full Workshop with Mahesh Murag of Anthropic",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=kQmXtrmQ5Zg",
      "year": 2025,
      "note": "Two-hour workshop by an Anthropic MCP engineer."
    }
  ],
  "sandbox": [
    {
      "type": "definition",
      "title": "Sandbox (computer security)",
      "by": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Sandbox_(computer_security)",
      "year": 2026,
      "note": "General definition of sandboxing as a security mechanism."
    },
    {
      "type": "docs",
      "title": "Configure the sandboxed Bash tool",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/sandboxing",
      "year": 2026,
      "note": "How Claude Code's OS-level sandbox works and is configured."
    },
    {
      "type": "docs",
      "title": "Choose a sandbox environment",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/sandbox-environments",
      "year": 2026,
      "note": "Compares sandbox runtime, dev containers, Docker, VMs, cloud."
    },
    {
      "type": "docs",
      "title": "Sandbox",
      "by": "OpenAI (ChatGPT Learn, Codex docs)",
      "url": "https://learn.chatgpt.com/docs/sandboxing",
      "year": 2026,
      "note": "How Codex/ChatGPT sandbox local commands per OS."
    },
    {
      "type": "docs",
      "title": "Agent approvals & security",
      "by": "OpenAI (ChatGPT Learn, Codex docs)",
      "url": "https://learn.chatgpt.com/docs/agent-approvals-security",
      "year": 2026,
      "note": "Sandbox modes, approval policies, network controls for Codex."
    },
    {
      "type": "docs",
      "title": "Code execution tool",
      "by": "Anthropic",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool",
      "year": 2026,
      "note": "Server-side sandboxed Bash/Python container for Claude."
    },
    {
      "type": "docs",
      "title": "Code Interpreter",
      "by": "OpenAI",
      "url": "https://developers.openai.com/api/docs/guides/tools-code-interpreter",
      "year": 2026,
      "note": "Sandboxed Python containers in the Responses API."
    },
    {
      "type": "blog",
      "title": "Beyond permission prompts: making Claude Code more secure and autonomous",
      "by": "Anthropic Engineering",
      "url": "https://www.anthropic.com/engineering/claude-code-sandboxing",
      "year": 2025,
      "note": "Filesystem + network isolation design; 84% fewer prompts."
    },
    {
      "type": "video",
      "title": "From fork() to Fleet: Designing an Agent Sandbox Cloud — Abhishek Bhardwaj, OpenAI",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=OqM67QG_Ikk",
      "year": 2026,
      "note": "OpenAI engineer on building agent sandbox infrastructure."
    }
  ],
  "computer-use": [
    {
      "type": "docs",
      "title": "Computer use tool",
      "by": "Anthropic",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool",
      "year": 2026,
      "note": "Current computer_toolset_20260801, agent loop, security guidance."
    },
    {
      "type": "docs",
      "title": "Browser use tool",
      "by": "Anthropic",
      "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool",
      "year": 2026,
      "note": "Page-level browser actions without a full desktop."
    },
    {
      "type": "docs",
      "title": "Computer use",
      "by": "OpenAI",
      "url": "https://developers.openai.com/api/docs/guides/tools-computer-use",
      "year": 2026,
      "note": "Code-execution harness vs computer tool in Responses API."
    },
    {
      "type": "docs",
      "title": "Computer use",
      "by": "Google AI for Developers (Gemini API)",
      "url": "https://ai.google.dev/gemini-api/docs/computer-use",
      "year": 2026,
      "note": "Gemini computer-use loop, environments, safety decisions."
    },
    {
      "type": "blog",
      "title": "Developing a computer use model",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/news/developing-computer-use",
      "year": 2024,
      "note": "How Anthropic trained Claude to operate computers via screenshots."
    },
    {
      "type": "blog",
      "title": "Introducing the Gemini 2.5 Computer Use model",
      "by": "Google DeepMind",
      "url": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-computer-use-model/",
      "year": 2025,
      "note": "Browser-focused computer-use model behind Project Mariner."
    },
    {
      "type": "video",
      "title": "Introduction to Operator & Agents",
      "by": "OpenAI",
      "url": "https://www.youtube.com/watch?v=CSE77wAdDLg",
      "year": 2025,
      "note": "Launch of Operator and the Computer-Using Agent (CUA)."
    },
    {
      "type": "video",
      "title": "Introduction to ChatGPT agent",
      "by": "OpenAI",
      "url": "https://www.youtube.com/watch?v=1jn_RpbPbEc",
      "year": 2025,
      "note": "Launch of ChatGPT agent (Jul 2025)."
    },
    {
      "type": "tool",
      "title": "Browser Use Open Source",
      "by": "Browser Use",
      "url": "https://docs.browser-use.com/open-source/introduction",
      "year": 2026,
      "note": "Popular open-source Python library for browser agents."
    }
  ],
  "triggers": [
    {
      "type": "definition",
      "title": "Webhook",
      "by": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Webhook",
      "year": 2026,
      "note": "Definition of HTTP callbacks that push events to systems."
    },
    {
      "type": "docs",
      "title": "Events that trigger workflows",
      "by": "GitHub Docs",
      "url": "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows",
      "year": 2026,
      "note": "Reference of GitHub events, schedules and dispatch triggers."
    },
    {
      "type": "docs",
      "title": "Claude Code GitHub Actions",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/github-actions",
      "year": 2026,
      "note": "@claude mentions and event/cron-driven Claude Code runs."
    },
    {
      "type": "docs",
      "title": "Automate work with routines",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/routines",
      "year": 2026,
      "note": "Cloud routines with schedule, API and GitHub triggers."
    },
    {
      "type": "docs",
      "title": "Push events into a running session with channels",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/channels",
      "year": 2026,
      "note": "MCP-based event push into live sessions."
    },
    {
      "type": "docs",
      "title": "Codex GitHub Action",
      "by": "OpenAI (ChatGPT Learn, Codex docs)",
      "url": "https://learn.chatgpt.com/docs/github-action",
      "year": 2026,
      "note": "Run Codex from GitHub Actions workflows."
    },
    {
      "type": "docs",
      "title": "Codex SDK",
      "by": "OpenAI (ChatGPT Learn, Codex docs)",
      "url": "https://learn.chatgpt.com/docs/codex-sdk",
      "year": 2026,
      "note": "Programmatic control of Codex agents from code/CI."
    },
    {
      "type": "video",
      "title": "Claude Code + GitHub Actions",
      "by": "Anthropic",
      "url": "https://www.youtube.com/watch?v=L_WFEgry87M",
      "year": 2025,
      "note": "Official demo of @claude in GitHub issues and PRs."
    },
    {
      "type": "video",
      "title": "How the GitHub Copilot coding agent works | GitHub Checkout",
      "by": "GitHub",
      "url": "https://www.youtube.com/watch?v=1GVBRhDI5No",
      "year": 2025,
      "note": "How assigning an issue launches Copilot's agent."
    }
  ],
  "surfaces": [
    {
      "type": "definition",
      "title": "AI browser",
      "by": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/AI_browser",
      "year": 2026,
      "note": "Defines AI and agentic browsers, examples and risks."
    },
    {
      "type": "spec",
      "title": "Introduction - Agent Client Protocol",
      "by": "Agent Client Protocol (Zed and community)",
      "url": "https://agentclientprotocol.com/get-started/introduction",
      "year": 2026,
      "note": "Open protocol connecting editors and coding agents."
    },
    {
      "type": "spec",
      "title": "AG-UI Overview",
      "by": "AG-UI (Agent User Interaction Protocol, CopilotKit)",
      "url": "https://docs.ag-ui.com/introduction",
      "year": 2026,
      "note": "Event protocol connecting agent backends to frontends."
    },
    {
      "type": "docs",
      "title": "Platforms and integrations",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/platforms",
      "year": 2026,
      "note": "Compares CLI, Desktop, IDE, web, mobile, Slack, CI surfaces."
    },
    {
      "type": "docs",
      "title": "Use ChatGPT",
      "by": "OpenAI (ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/use-chatgpt",
      "year": 2026,
      "note": "Chat vs ChatGPT Work vs Codex modes in one app."
    },
    {
      "type": "blog",
      "title": "Bring Your Own Agent to Zed — Featuring Gemini CLI",
      "by": "Zed (Nathan Sobo)",
      "url": "https://zed.dev/blog/bring-your-own-agent-to-zed",
      "year": 2025,
      "note": "Launch post introducing ACP."
    },
    {
      "type": "blog",
      "title": "JetBrains × Zed: Open Interoperability for AI Coding Agents in Your IDE",
      "by": "JetBrains",
      "url": "https://blog.jetbrains.com/ai/2025/10/jetbrains-zed-open-interoperability-for-ai-coding-agents-in-your-ide/",
      "year": 2025,
      "note": "JetBrains joins ACP for agents in its IDEs."
    },
    {
      "type": "video",
      "title": "What Is the Agent Client Protocol – and Why JetBrains and Zed Are Building It Together",
      "by": "JetBrains",
      "url": "https://www.youtube.com/watch?v=n11pDnBXPgk",
      "year": 2026,
      "note": "ACP explained by JetBrains and Zed."
    },
    {
      "type": "video",
      "title": "Meet ChatGPT Work",
      "by": "OpenAI",
      "url": "https://www.youtube.com/watch?v=yRc5HcGJ-Cs",
      "year": 2026,
      "note": "OpenAI's unified desktop agent surface (Jul 2026)."
    }
  ],
  "permissions": [
    {
      "type": "definition",
      "title": "least privilege - Glossary | CSRC",
      "by": "NIST Computer Security Resource Center",
      "url": "https://csrc.nist.gov/glossary/term/least_privilege",
      "year": 2026,
      "note": "Authoritative NIST definitions of the principle of least privilege."
    },
    {
      "type": "docs",
      "title": "Choose a permission mode",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/permission-modes",
      "year": 2026,
      "note": "All Claude Code modes, classifier-based auto mode, starting-mode rules."
    },
    {
      "type": "docs",
      "title": "Configure permissions",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/permissions",
      "year": 2026,
      "note": "Allow/ask/deny rules, deny-first precedence, managed organization policies."
    },
    {
      "type": "docs",
      "title": "Agent approvals & security",
      "by": "OpenAI (Codex docs, ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/agent-approvals-security",
      "year": 2026,
      "note": "Codex sandbox modes, approval policies, presets, network defaults, auto-review."
    },
    {
      "type": "docs",
      "title": "Policy engine | Gemini CLI",
      "by": "Google (Gemini CLI docs)",
      "url": "https://geminicli.com/docs/reference/policy-engine/",
      "year": 2026,
      "note": "TOML allow/deny/ask_user rules, priority tiers, approval modes."
    },
    {
      "type": "blog",
      "title": "How we built Claude Code auto mode: a safer way to skip permissions",
      "by": "Anthropic Engineering (John Hughes)",
      "url": "https://www.anthropic.com/engineering/claude-code-auto-mode",
      "year": 2026,
      "note": "Classifier design, threat model, measured false-positive/negative rates."
    },
    {
      "type": "blog",
      "title": "Making Claude Code more secure and autonomous with sandboxing",
      "by": "Anthropic Engineering",
      "url": "https://www.anthropic.com/engineering/claude-code-sandboxing",
      "year": 2025,
      "note": "Filesystem + network isolation; sandboxing cut permission prompts 84%."
    },
    {
      "type": "paper",
      "title": "Levels of Autonomy for AI Agents",
      "by": "K. J. Kevin Feng, David W. McDonald, Amy X. Zhang",
      "url": "https://arxiv.org/abs/2506.12469",
      "year": 2025,
      "note": "Five autonomy levels defined by user role, operator to observer."
    }
  ],
  "hooks": [
    {
      "type": "definition",
      "title": "Hooking",
      "by": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Hooking",
      "year": 2026,
      "note": "General concept: intercepting calls or events to alter behavior."
    },
    {
      "type": "docs",
      "title": "Hooks reference",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/hooks",
      "year": 2026,
      "note": "All 33 events, handler types, JSON input/output, exit codes."
    },
    {
      "type": "docs",
      "title": "Intercept and control agent behavior with hooks",
      "by": "Anthropic (Claude Agent SDK docs)",
      "url": "https://code.claude.com/docs/en/agent-sdk/hooks",
      "year": 2026,
      "note": "Python/TypeScript callbacks to block, modify or audit tool calls."
    },
    {
      "type": "docs",
      "title": "Hooks",
      "by": "OpenAI (Codex docs, ChatGPT Learn)",
      "url": "https://learn.chatgpt.com/docs/hooks",
      "year": 2026,
      "note": "Codex lifecycle hooks, config locations, trust review, blocking."
    },
    {
      "type": "docs",
      "title": "Hooks",
      "by": "Cursor",
      "url": "https://cursor.com/docs/hooks",
      "year": 2026,
      "note": "hooks.json events, command vs prompt hooks, fail-open/closed behavior."
    },
    {
      "type": "docs",
      "title": "About hooks for GitHub Copilot",
      "by": "GitHub Docs",
      "url": "https://docs.github.com/en/copilot/concepts/agents/hooks",
      "year": 2026,
      "note": "Hooks for Copilot cloud agent and Copilot CLI."
    },
    {
      "type": "docs",
      "title": "Gemini CLI hooks",
      "by": "Google (Gemini CLI docs)",
      "url": "https://geminicli.com/docs/hooks/",
      "year": 2026,
      "note": "11 events incl. BeforeModel and BeforeTool; settings.json config."
    },
    {
      "type": "guide",
      "title": "Automate actions with hooks",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/hooks-guide",
      "year": 2026,
      "note": "Hands-on hook recipes and walkthroughs for Claude Code."
    }
  ],
  "guardrails": [
    {
      "type": "definition",
      "title": "What Are AI Guardrails? | IBM",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/ai-guardrails",
      "year": 2025,
      "note": "Explainer: what AI guardrails are and how they work."
    },
    {
      "type": "docs",
      "title": "Guardrails - OpenAI Agents SDK",
      "by": "OpenAI",
      "url": "https://openai.github.io/openai-agents-python/guardrails/",
      "year": 2026,
      "note": "Input, output and tool guardrails; tripwires; parallel vs blocking."
    },
    {
      "type": "docs",
      "title": "Overview | NVIDIA NeMo Guardrails Library Developer Guide",
      "by": "NVIDIA",
      "url": "https://docs.nvidia.com/nemo/guardrails/about-nemo-guardrails-library/overview",
      "year": 2026,
      "note": "Open-source programmable rails: input, retrieval, dialog, execution, output."
    },
    {
      "type": "docs",
      "title": "Prompt Shields in Azure AI Content Safety",
      "by": "Microsoft Learn",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection",
      "year": 2026,
      "note": "Detects jailbreaks and indirect document attacks; Spotlighting."
    },
    {
      "type": "blog",
      "title": "Next-generation Constitutional Classifiers",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/research/next-generation-constitutional-classifiers",
      "year": 2026,
      "note": "Probe-based cascade: ~1% compute overhead, 0.05% refusals."
    },
    {
      "type": "paper",
      "title": "NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications with Programmable Rails",
      "by": "Traian Rebedea et al. (NVIDIA)",
      "url": "https://arxiv.org/abs/2310.10501",
      "year": 2023,
      "note": "EMNLP 2023 demo paper introducing programmable runtime rails."
    },
    {
      "type": "paper",
      "title": "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations",
      "by": "Hakan Inan et al. (Meta)",
      "url": "https://arxiv.org/abs/2312.06674",
      "year": 2023,
      "note": "Seminal LLM-based prompt and response safety classifier."
    },
    {
      "type": "paper",
      "title": "Constitutional Classifiers: Defending against Universal Jailbreaks across Thousands of Hours of Red Teaming",
      "by": "Mrinank Sharma et al. (Anthropic)",
      "url": "https://arxiv.org/abs/2501.18837",
      "year": 2025,
      "note": "Classifier safeguards trained on constitution-generated synthetic data."
    },
    {
      "type": "tool",
      "title": "meta-llama/Llama-Guard-4-12B",
      "by": "Meta (Hugging Face model card)",
      "url": "https://huggingface.co/meta-llama/Llama-Guard-4-12B",
      "year": 2025,
      "note": "Current Llama Guard: 12B multimodal, hazard categories S1-S14."
    }
  ],
  "security": [
    {
      "type": "definition",
      "title": "What Is a Prompt Injection Attack? | IBM",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/prompt-injection",
      "year": 2024,
      "note": "Explainer: direct vs indirect prompt injection and mitigations."
    },
    {
      "type": "standard",
      "title": "OWASP GenAI LLM Top 10 2026",
      "by": "OWASP GenAI Security Project",
      "url": "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/",
      "year": 2026,
      "note": "2026 edition of the Top 10 for LLM Applications (PDF)."
    },
    {
      "type": "standard",
      "title": "OWASP Top 10 for Agentic Applications for 2026",
      "by": "OWASP GenAI Security Project",
      "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/",
      "year": 2025,
      "note": "ASI01-ASI10: goal hijack, tool misuse, rogue agents and more."
    },
    {
      "type": "blog",
      "title": "The lethal trifecta for AI agents: private data, untrusted content, and external communication",
      "by": "Simon Willison",
      "url": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
      "year": 2025,
      "note": "Why private data + untrusted content + exfiltration channel is dangerous."
    },
    {
      "type": "blog",
      "title": "Simon Willison on prompt-injection",
      "by": "Simon Willison",
      "url": "https://simonwillison.net/tags/prompt-injection/",
      "year": 2026,
      "note": "Running archive of prompt-injection research and incidents since 2022."
    },
    {
      "type": "blog",
      "title": "Agents Rule of Two: A Practical Approach to AI Agent Security",
      "by": "Meta AI",
      "url": "https://ai.meta.com/blog/practical-ai-agent-security/",
      "year": 2025,
      "note": "At most two of: untrusted input, sensitive access, external actions."
    },
    {
      "type": "paper",
      "title": "Defeating Prompt Injections by Design",
      "by": "Edoardo Debenedetti et al.",
      "url": "https://arxiv.org/abs/2503.18813",
      "year": 2025,
      "note": "CaMeL: control/data-flow separation plus capabilities around the LLM."
    },
    {
      "type": "video",
      "title": "What Is a Prompt Injection Attack?",
      "by": "IBM Technology",
      "url": "https://www.youtube.com/watch?v=jrHRe9lSqqA",
      "year": 2024,
      "note": "Short whiteboard explainer of prompt injection."
    },
    {
      "type": "video",
      "title": "Generative AI's Greatest Flaw - Computerphile",
      "by": "Computerphile",
      "url": "https://www.youtube.com/watch?v=rAEqP9VEhe8",
      "year": 2025,
      "note": "Mike Pound explains prompt injection versus SQL injection."
    }
  ],
  "hitl": [
    {
      "type": "definition",
      "title": "What Is Human In The Loop (HITL)? | IBM",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/human-in-the-loop",
      "year": 2025,
      "note": "Explainer: human oversight and intervention in AI systems."
    },
    {
      "type": "docs",
      "title": "Interrupts",
      "by": "LangChain (LangGraph docs)",
      "url": "https://docs.langchain.com/oss/python/langgraph/interrupts",
      "year": 2026,
      "note": "interrupt() and Command(resume) with checkpointers and thread IDs."
    },
    {
      "type": "docs",
      "title": "Human-in-the-loop",
      "by": "LangChain docs",
      "url": "https://docs.langchain.com/oss/python/langchain/human-in-the-loop",
      "year": 2026,
      "note": "HumanInTheLoopMiddleware: approve, edit, reject, respond per tool."
    },
    {
      "type": "docs",
      "title": "Human-in-the-loop - OpenAI Agents SDK",
      "by": "OpenAI",
      "url": "https://openai.github.io/openai-agents-python/human_in_the_loop/",
      "year": 2026,
      "note": "needs_approval, interruptions, RunState serialization, approve/reject."
    },
    {
      "type": "docs",
      "title": "Handle approvals and user input",
      "by": "Anthropic (Claude Agent SDK docs)",
      "url": "https://code.claude.com/docs/en/agent-sdk/user-input",
      "year": 2026,
      "note": "canUseTool approvals and AskUserQuestion clarifying questions."
    },
    {
      "type": "docs",
      "title": "Action confirmations - Agent Development Kit (ADK)",
      "by": "Google (ADK docs)",
      "url": "https://adk.dev/tools-custom/confirmation/",
      "year": 2026,
      "note": "Pause tools for yes/no or structured human confirmation."
    },
    {
      "type": "paper",
      "title": "Measuring AI agent autonomy in practice",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/research/measuring-agent-autonomy",
      "year": 2026,
      "note": "Real-world data on auto-approval, interrupts and agent-initiated stops."
    },
    {
      "type": "paper",
      "title": "Anthropic Economic Index report: Cadences",
      "by": "Anthropic",
      "url": "https://www.anthropic.com/research/economic-index-june-2026-report",
      "year": 2026,
      "note": "Latest Economic Index: autonomy and automation across Claude products."
    },
    {
      "type": "video",
      "title": "12-Factor Agents: Patterns of reliable LLM applications — Dex Horthy, HumanLayer",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=8kMaTybvDUw",
      "year": 2025,
      "note": "Reliable-agent patterns incl. contacting humans via tool calls."
    }
  ],
  "evals": [
    {
      "type": "guide",
      "title": "Demystifying evals for AI agents",
      "by": "Anthropic Engineering (Grace, Hadfield, Olivares, De Jonghe)",
      "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
      "year": 2026,
      "note": "Practical agent-eval guide: graders, pass@k vs pass^k, transcripts."
    },
    {
      "type": "guide",
      "title": "AI Evals: Everything You Need to Know",
      "by": "Hamel Husain & Shreya Shankar",
      "url": "https://hamel.dev/blog/posts/evals-faq/",
      "year": 2026,
      "note": "Comprehensive evals FAQ: error analysis, binary judges, judge validation."
    },
    {
      "type": "blog",
      "title": "Your AI Product Needs Evals",
      "by": "Hamel Husain",
      "url": "https://hamel.dev/blog/posts/evals/",
      "year": 2024,
      "note": "Classic case for unit tests, human/model eval and error analysis."
    },
    {
      "type": "paper",
      "title": "Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences",
      "by": "Shreya Shankar et al.",
      "url": "https://arxiv.org/abs/2404.12272",
      "year": 2024,
      "note": "EvalGen and criteria drift in LLM-assisted evaluation."
    },
    {
      "type": "paper",
      "title": "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena",
      "by": "Lianmin Zheng et al.",
      "url": "https://arxiv.org/abs/2306.05685",
      "year": 2023,
      "note": "Seminal LLM-as-a-judge study: agreement levels and biases."
    },
    {
      "type": "paper",
      "title": "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
      "by": "Carlos E. Jimenez et al.",
      "url": "https://arxiv.org/abs/2310.06770",
      "year": 2023,
      "note": "Benchmark of 2,294 real GitHub issues for coding agents."
    },
    {
      "type": "video",
      "title": "Building and evaluating AI Agents — Sayash Kapoor, AI Snake Oil",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=d5EltXhbcfA",
      "year": 2025,
      "note": "Why agent claims outrun reality; best practices for agent evaluation."
    },
    {
      "type": "tool",
      "title": "SWE-bench Verified",
      "by": "SWE-bench team (with OpenAI)",
      "url": "https://www.swebench.com/verified.html",
      "year": 2024,
      "note": "500 human-validated tasks; full and bash-only leaderboards."
    },
    {
      "type": "tool",
      "title": "Inspect",
      "by": "UK AI Security Institute",
      "year": 2026,
      "url": "https://inspect.aisi.org.uk/",
      "note": "Open-source eval framework with agent support, sandboxing and 200+ ready-made evals."
    },
    {
      "type": "tool",
      "title": "Task-Completion Time Horizons of Frontier AI Models",
      "by": "METR",
      "year": 2026,
      "url": "https://metr.org/time-horizons/",
      "note": "How long a task (in human time) agents can complete; no longer updated after Sep 2026."
    }
  ],
  "observability": [
    {
      "type": "definition",
      "title": "What is LLM Observability? | IBM",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/llm-observability",
      "year": 2025,
      "note": "Explainer: monitoring, tracing and evaluating LLM applications."
    },
    {
      "type": "spec",
      "title": "Semantic Conventions for GenAI agent and framework spans",
      "by": "OpenTelemetry (semantic-conventions-genai)",
      "url": "https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md",
      "year": 2026,
      "note": "Standard span names/attributes for agents, workflows and tool execution."
    },
    {
      "type": "docs",
      "title": "Monitoring",
      "by": "Anthropic (Claude Code Docs)",
      "url": "https://code.claude.com/docs/en/monitoring-usage",
      "year": 2026,
      "note": "Claude Code OpenTelemetry metrics, events and beta traces."
    },
    {
      "type": "docs",
      "title": "Tracing - OpenAI Agents SDK",
      "by": "OpenAI",
      "url": "https://openai.github.io/openai-agents-python/tracing/",
      "year": 2026,
      "note": "Built-in traces/spans for agents, tools, guardrails, handoffs."
    },
    {
      "type": "docs",
      "title": "Observability & Application Tracing",
      "by": "Langfuse",
      "url": "https://langfuse.com/docs/observability/overview",
      "year": 2026,
      "note": "Open-source tracing of prompts, responses, tokens, cost, latency."
    },
    {
      "type": "docs",
      "title": "LangSmith Observability",
      "by": "LangChain",
      "url": "https://docs.langchain.com/langsmith/observability",
      "year": 2026,
      "note": "Tracing, dashboards, alerts and online evals for agents."
    },
    {
      "type": "docs",
      "title": "What is Arize Phoenix?",
      "by": "Arize AI",
      "url": "https://arize.com/docs/phoenix",
      "year": 2026,
      "note": "OpenTelemetry/OpenInference-based tracing and evaluation platform."
    },
    {
      "type": "blog",
      "title": "AI Agent Observability - Evolving Standards and Best Practices",
      "by": "OpenTelemetry (Guangya Liu, Sujay Solomon)",
      "url": "https://opentelemetry.io/blog/2025/ai-agent-observability/",
      "year": 2025,
      "note": "How OTel is standardizing agent and agent-framework telemetry."
    },
    {
      "type": "video",
      "title": "Your Agent Failed in Prod. Good Luck Reproducing It. - Tisha Chawla & Susheem Koul, Microsoft",
      "by": "AI Engineer",
      "url": "https://www.youtube.com/watch?v=Lc8zRh9muoY",
      "year": 2026,
      "note": "Record-and-replay debugging for non-deterministic agent failures."
    }
  ],
  "governance": [
    {
      "type": "definition",
      "title": "What is AI Governance? | IBM",
      "by": "IBM Think",
      "url": "https://www.ibm.com/think/topics/ai-governance",
      "year": 2024,
      "note": "Explainer: processes, standards and guardrails for responsible AI."
    },
    {
      "type": "law",
      "title": "Regulation (EU) 2024/1689 (Artificial Intelligence Act)",
      "by": "EUR-Lex (Official Journal of the EU)",
      "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
      "year": 2024,
      "note": "Official text of the EU AI Act."
    },
    {
      "type": "law",
      "title": "Regulation (EU) 2026/1744 (Digital Omnibus on AI)",
      "by": "EUR-Lex (Official Journal of the EU)",
      "url": "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
      "year": 2026,
      "note": "Amends AI Act: high-risk dates moved to Dec 2027 / Aug 2028."
    },
    {
      "type": "standard",
      "title": "AI Risk Management Framework",
      "by": "NIST",
      "url": "https://www.nist.gov/itl/ai-risk-management-framework",
      "year": 2023,
      "note": "NIST AI RMF 1.0 hub, profiles and revision status."
    },
    {
      "type": "standard",
      "title": "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
      "by": "NIST (NIST AI 600-1)",
      "url": "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
      "year": 2024,
      "note": "12 generative-AI risks and suggested risk-management actions."
    },
    {
      "type": "guide",
      "title": "AI Act | Shaping Europe's digital future",
      "by": "European Commission",
      "url": "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
      "year": 2026,
      "note": "Official overview, timeline and Omnibus status of the AI Act."
    },
    {
      "type": "guide",
      "title": "The General-Purpose AI Code of Practice",
      "by": "European Commission",
      "url": "https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai",
      "year": 2025,
      "note": "Voluntary GPAI code: transparency, copyright, safety & security."
    },
    {
      "type": "guide",
      "title": "ISO/IEC 42001:2023 Artificial Intelligence Management System Standards",
      "by": "Microsoft Learn (Compliance)",
      "url": "https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001",
      "year": 2026,
      "note": "Explains ISO/IEC 42001 AIMS requirements (iso.org blocks automated checks)."
    },
    {
      "type": "guide",
      "title": "Model AI Governance Framework for Agentic AI (v1.5)",
      "by": "IMDA Singapore",
      "url": "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf",
      "year": 2026,
      "note": "Agent-specific governance: bound risks, accountability, controls, users."
    }
  ]
};
  /*__END_SOURCES__*/

  /* Dated status notes ("Status check"), each with its primary source. */
  var FACTS = {
    "model": [
      { text: "Anthropic (October 2026): Claude Fable 5.1 is the most capable generally available model; Claude Opus 5.5 (22 September 2026) is the recommended default, alongside Sonnet 5.5 and Haiku 5.5. All have a 1M-token context window.", source: "https://platform.claude.com/docs/en/models/overview" },
      { text: "OpenAI (October 2026): GPT-6 Astra is the flagship for complex reasoning and coding, GPT-6.1 Sol balances intelligence and cost, and GPT-6 Luna serves high-volume work.", source: "https://developers.openai.com/api/docs/models" },
      { text: "Google (October 2026): Gemini 3.8 Flash is the stable workhorse and Gemini 3.1 Pro is in preview, while Gemini 4 Argon is rolling out first to vetted cyber defenders.", source: "https://ai.google.dev/gemini-api/docs/models" },
      { text: "Open-weight models are huge sparse mixtures of experts: Moonshot's Kimi K3 has 2.8 trillion parameters, 104 billion of them active per token. DeepSeek, Zhipu (GLM), Mistral, Google (Gemma) and OpenAI (gpt-oss) also publish open weights.", source: "https://huggingface.co/moonshotai/Kimi-K3" },
      { text: "Meta's newest frontier model, Muse Spark, is offered through Meta's hosted API rather than as open weights.", source: "https://dev.meta.ai/models/muse-spark" },
      { text: "“Open weights” is not “open source”: the Open Source Initiative's definition also requires information about the training data and the complete code. Check each licence before commercial use.", source: "https://opensource.org/ai/open-source-ai-definition" }
    ],
    "reasoning": [
      { text: "Current Claude models think adaptively by default; the effort setting (low, medium, high, xhigh, max) is the main control, and manual thinking budgets are being retired.", source: "https://platform.claude.com/docs/en/build-with-claude/effort" },
      { text: "OpenAI's reasoning tokens stay hidden but occupy the context and are billed as output; reasoning effort ranges from none to max, depending on the model.", source: "https://developers.openai.com/api/docs/guides/reasoning" },
      { text: "Gemini uses a thinking level (low, medium, high), with thought summaries available on request.", source: "https://ai.google.dev/gemini-api/docs/thinking" },
      { text: "DeepSeek-R1 (2025, peer-reviewed in Nature) showed that reasoning can be learned through reinforcement learning alone, without human-written reasoning examples.", source: "https://www.nature.com/articles/s41586-025-09422-z" },
      { text: "Spending test-time compute according to difficulty was more than four times as efficient as best-of-N sampling (Snell et al., 2024).", source: "https://arxiv.org/abs/2408.03314" }
    ],
    "context-window": [
      { text: "About one million tokens is now standard at the frontier: every current Claude model has a 1M-token window, with up to 128,000 output tokens per request.", source: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
      { text: "Anthropic: “The Messages API is stateless, which means that you always send the full conversational history to the API.”", source: "https://platform.claude.com/docs/en/build-with-claude/working-with-messages" },
      { text: "OpenAI: even with server-side conversation chaining, all previous input tokens are billed again as input.", source: "https://developers.openai.com/api/docs/guides/conversation-state" },
      { text: "Tokenizers differ: on Claude's current tokenizer, one million tokens is roughly 555,000 English words.", source: "https://platform.claude.com/docs/en/models/overview" },
      { text: "RULER (2024): all 17 models tested claimed a context of at least 32,000 tokens, but only half performed satisfactorily at that length.", source: "https://arxiv.org/abs/2404.06654" }
    ],
    "provider": [
      { text: "Renamed platforms: Google's Vertex AI is now Gemini Enterprise Agent Platform, and Azure AI Foundry is now Microsoft Foundry.", source: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes" },
      { text: "Amazon Bedrock offers more than 100 models from many providers; OpenAI's GPT-6 Astra became generally available there in September 2026.", source: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" },
      { text: "Bedrock's geographic cross-Region inference keeps processing inside one geography, such as the EU; global routing is about 10% cheaper but gives no residency guarantee.", source: "https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html" },
      { text: "Anthropic's own API processes data globally or in the US only; on Bedrock and Google Cloud the region follows the endpoint you choose.", source: "https://platform.claude.com/docs/en/manage-claude/data-residency" },
      { text: "OpenAI offers EU storage and processing through eu.api.openai.com, with a 10% surcharge for models released since March 2026.", source: "https://developers.openai.com/api/docs/guides/your-data" },
      { text: "LMArena is now called Arena; together with Artificial Analysis it is a common starting point for comparing models before running your own evals.", source: "https://arena.ai/leaderboard" }
    ],
    "fine-tuning": [
      { text: "OpenAI is winding down self-serve fine-tuning: no new organisations since May 2026, and no new training jobs at all from 6 January 2027.", source: "https://developers.openai.com/api/docs/deprecations" },
      { text: "No model in the Gemini API supports fine-tuning any more; Google offers tuning on Gemini Enterprise Agent Platform instead.", source: "https://ai.google.dev/gemini-api/docs/model-tuning" },
      { text: "Amazon Bedrock offers supervised fine-tuning, reinforcement fine-tuning with reward functions, and distillation from a large teacher model into a small student.", source: "https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html" },
      { text: "OpenAI's own guidance: “The prompt engineering process may be all you need.”", source: "https://developers.openai.com/api/docs/guides/model-optimization" },
      { text: "QLoRA (2023) fine-tunes a 65-billion-parameter model on a single 48 GB GPU by training small adapters on a 4-bit base model.", source: "https://arxiv.org/abs/2305.14314" }
    ],
    "system-prompt": [
      { text: "Anthropic: newer Claude models follow the system prompt more closely, so aggressive wording such as “CRITICAL: You MUST…” can cause over-triggering. Plain instructions work better.", source: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
      { text: "OpenAI's Model Spec (latest version 18 August 2026) defines the chain of command between platform, developer and user instructions, and says to ignore instructions found in untrusted data by default.", source: "https://model-spec.openai.com/2026-08-18.html" },
      { text: "Anthropic publishes the system prompts of its own apps; on the API, the developer writes the system prompt.", source: "https://platform.claude.com/docs/en/release-notes/system-prompts/overview" },
      { text: "The Prompt Report (2024) catalogues 58 text-prompting techniques.", source: "https://arxiv.org/abs/2406.06608" }
    ],
    "cost": [
      { text: "Small tiers are about 100 times cheaper per token than flagships: Claude Haiku 5.5 costs from $0.10/$0.50 per million tokens, Claude Fable 5.1 $10/$50 (October 2026).", source: "https://platform.claude.com/docs/en/models/overview" },
      { text: "Reading from Anthropic's prompt cache costs a tenth of the normal input price (less on the newest models); writing to a 5-minute cache costs 1.25 times.", source: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
      { text: "Anthropic's Batch API halves the price of input and output tokens, and the discount stacks with caching.", source: "https://platform.claude.com/docs/en/about-claude/pricing" },
      { text: "OpenAI caches prompts automatically, with cached input discounted by up to 95%.", source: "https://developers.openai.com/api/docs/guides/prompt-caching" },
      { text: "Routing pays: learned routers cut costs by over 85% on MT Bench while keeping 95% of GPT-4's quality (RouteLLM, 2024).", source: "https://lmsys.org/blog/2024-07-01-routellm/" },
      { text: "Anthropic positions Claude Haiku 5.5 (October 2026) explicitly as a cheap model for sub-agents and compaction, working alongside larger models.", source: "https://www.anthropic.com/claude-haiku-5-5" }
    ],
    "context-engineering": [
      { text: "The term took off in June 2025 when Tobi Lütke and Andrej Karpathy endorsed it. Karpathy called it “the delicate art and science of filling the context window with just the right information for the next step.”", source: "https://simonwillison.net/2025/Jun/27/context-engineering/" },
      { text: "Chroma's Context Rot study (July 2025) tested 18 models and found performance “grows increasingly unreliable as input length grows”, even on deliberately simple tasks.", source: "https://research.trychroma.com/context-rot" },
      { text: "Manus calls the KV-cache hit rate “the single most important metric for a production-stage AI agent”: its agents read about 100 input tokens per output token, and cached input cost a tenth of uncached input.", source: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus" },
      { text: "Anthropic recommends compaction, structured notes kept outside the window, sub-agents and just-in-time retrieval for long-horizon work.", source: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" }
    ],
    "compaction": [
      { text: "The Claude API offers server-side compaction in two beta forms: on demand, or automatically at a threshold (150,000 input tokens by default), with custom summarisation instructions.", source: "https://platform.claude.com/docs/en/build-with-claude/compaction" },
      { text: "Context editing clears stale tool results instead of summarising. In a 100-turn web-search evaluation it cut token use by 84%; combined with the memory tool it improved results by 39% (Anthropic, September 2025).", source: "https://claude.com/resources/articles/context-management" },
      { text: "OpenAI's Responses API compacts server-side or through a stateless /responses/compact endpoint; Google ADK summarises older events by token threshold or sliding window.", source: "https://developers.openai.com/api/docs/guides/compaction" },
      { text: "Anthropic on multi-session coding: “compaction isn't sufficient”. Pair it with a progress file, a feature list and git commits.", source: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" }
    ],
    "memory": [
      { text: "CoALA (2023) describes agent memory as working memory plus long-term episodic, semantic and procedural memory, with explicit actions to read and write it.", source: "https://arxiv.org/abs/2309.02427" },
      { text: "Claude Code's auto memory (2026) lets the agent write typed notes, and the first 200 lines load every session. Gemini CLI's experimental auto memory proposes memory and skill drafts into a review inbox.", source: "https://code.claude.com/docs/en/memory" },
      { text: "OpenAI advises keeping must-follow rules in AGENTS.md and treating memories as a recall layer.", source: "https://learn.chatgpt.com/docs/customization/memories" },
      { text: "Claude Managed Agents added “dreaming” (research preview, May 2026): a background job that reviews past sessions and reorganises the agent's memory between them.", source: "https://claude.com/blog/new-in-claude-managed-agents" }
    ],
    "instructions": [
      { text: "AGENTS.md is used by more than 60,000 open-source projects; the nearest file in the folder tree wins.", source: "https://agents.md/" },
      { text: "Since version 2.1.277 Claude Code reads AGENTS.md directly when there is no CLAUDE.md; GitHub Copilot reads AGENTS.md alongside its own instruction files.", source: "https://code.claude.com/docs/en/memory" },
      { text: "Evidence is mixed: a February 2026 study found that context files do not generally improve task success but raise inference cost by over 20%. Repository overviews did not help; specific instructions were followed.", source: "https://arxiv.org/abs/2602.11988" },
      { text: "Codex caps the combined chain of instruction files at 32 KiB by default.", source: "https://learn.chatgpt.com/docs/agent-configuration/agents-md" }
    ],
    "skills": [
      { text: "The open standard (December 2025) requires only a name and a description. In October 2026 agentskills.io lists 46 compatible products, including Claude Code, ChatGPT and Codex, GitHub Copilot, VS Code, Cursor and Gemini CLI.", source: "https://agentskills.io/home" },
      { text: "SkillsBench (February 2026): curated skills raised the average pass rate from 33.9% to 50.5% across 87 tasks, and small, focused skills beat exhaustive bundles.", source: "https://arxiv.org/abs/2602.12670" },
      { text: "Codex limits the initial list of skills to 2% of the model's context window and distributes skills to other people through plugins.", source: "https://learn.chatgpt.com/docs/build-skills" },
      { text: "A February 2026 survey cites analyses that found vulnerabilities in 26.1% of community-contributed skills. Review skills like code.", source: "https://arxiv.org/abs/2602.12430" }
    ],
    "playbooks": [
      { text: "Devin: “A playbook is like a custom system prompt for a repeated task.” Its template has sections for procedure, specifications, advice, forbidden actions and what is required from the user.", source: "https://docs.devin.ai/product-guides/creating-playbooks" },
      { text: "Devin separates the layers: skills are SKILL.md files inside a repository, playbooks are cross-repository templates in the web app, and memory is what the agent learns by itself.", source: "https://docs.devin.ai/product-guides/skills" },
      { text: "Google's Conversational Agents (Dialogflow CX) use playbooks as “the basic building block of generative agents”: a goal, step-by-step instructions, examples and parameters.", source: "https://docs.cloud.google.com/dialogflow/cx/docs/concept/playbook" },
      { text: "ACE (October 2025) treats contexts as evolving playbooks that the agent refines through generation, reflection and curation, improving agent benchmarks by 10.6%.", source: "https://arxiv.org/abs/2510.04618" }
    ],
    "commands": [
      { text: "Claude Code: “Custom commands have been merged into skills.” Old command files keep working; skills add supporting files and automatic loading.", source: "https://code.claude.com/docs/en/skills" },
      { text: "OpenAI deprecated Codex custom prompts with the advice “Use skills for reusable prompts”, and Cursor ships a /migrate-to-skills command.", source: "https://learn.chatgpt.com/docs/custom-prompts" },
      { text: "MCP prompts are server-provided templates meant to be controlled by the user, typically shown as slash commands.", source: "https://modelcontextprotocol.io/specification/2026-07-28/server/prompts" }
    ],
    "plugins": [
      { text: "Claude Code plugins (October 2025) bundle skills, agents, hooks and MCP servers, and marketplaces are plain Git repositories. Claude Cowork plugins (January 2026) package the same for business roles.", source: "https://code.claude.com/docs/en/plugins/overview" },
      { text: "ChatGPT and Codex share one plugin directory. A plugin can contain skills, MCP servers (optionally with MCP Apps UI), browser extensions and hooks.", source: "https://developers.openai.com/plugins/concepts/plugins" },
      { text: "Agent Plugins 1.0 (agent-plugins.org) is an open packaging standard built from a manifest, Agent Skills and MCP servers. VS Code, GitHub Copilot and Cursor load it alongside their own formats.", source: "https://agent-plugins.org/" },
      { text: "When Google moved most Gemini CLI users to Antigravity CLI in 2026, extensions were renamed plugins.", source: "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/" }
    ],
    "rag": [
      { text: "Anthropic's Contextual Retrieval (2024) cut failed retrievals by 49% with contextual embeddings plus BM25, and by 67% with reranking. For knowledge bases under about 200,000 tokens it suggests a cached prompt instead.", source: "https://www.anthropic.com/engineering/contextual-retrieval" },
      { text: "GraphRAG (Microsoft, 2024) builds an entity graph and community summaries to answer questions about a whole collection, which plain vector search handles poorly.", source: "https://arxiv.org/abs/2404.16130" },
      { text: "Retrieval now ships as agent tools: file search over vector stores, remote MCP servers with search and fetch, and web search.", source: "https://developers.openai.com/api/docs/guides/deep-research" }
    ],
    "embeddings": [
      { text: "MTEB found that no single embedding method wins on every task; its multilingual successor MMTEB (2025) covers more than 500 tasks in over 250 languages.", source: "https://arxiv.org/abs/2210.07316" },
      { text: "Multimodal embeddings are in the major APIs: Google's gemini-embedding-2 puts text, images, audio, video and PDFs in one space.", source: "https://ai.google.dev/gemini-api/docs/embeddings" },
      { text: "Hybrid search runs keyword (BM25) and vector queries in parallel and merges the rankings with Reciprocal Rank Fusion.", source: "https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking" },
      { text: "Anthropic offers no embedding model of its own and points to Voyage AI.", source: "https://platform.claude.com/docs/en/build-with-claude/embeddings" }
    ],
    "search": [
      { text: "Boris Cherny, who created Claude Code: the team tried RAG over a code index but “landed on just agentic search” (glob and grep), which “outperformed everything. By a lot.”", source: "https://www.latent.space/p/claude-code" },
      { text: "Cursor's docs (October 2026) say it does not store embeddings of your codebase; code search is fast grep plus an Explore sub-agent.", source: "https://cursor.com/docs/agent/tools/search" },
      { text: "Newer web search tools filter results with code before they enter the context, for example Claude's dynamic filtering (2026).", source: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool" },
      { text: "On the BrowseComp benchmark, token usage alone explained 80% of the variance in research-agent performance (Anthropic, 2025).", source: "https://www.anthropic.com/engineering/multi-agent-research-system" }
    ],
    "triggers": [
      { text: "Claude Code routines (research preview since April 2026) run a saved prompt with repositories and connectors in Anthropic's cloud, started by a schedule, an API call or a GitHub event.", source: "https://code.claude.com/docs/en/routines" },
      { text: "GitHub Copilot cloud agent sessions start from issues, failing Actions runs, Slack, Teams, Jira, Linear or scheduled automations. Issues can also be assigned to third-party agents such as Claude and Codex.", source: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions" },
      { text: "ChatGPT scheduled tasks can also fire on Gmail, Slack or GitHub events (since late August 2026).", source: "https://learn.chatgpt.com/docs/automations" },
      { text: "Cautionary case (March 2026): a prompt injection in a GitHub issue title hijacked an AI issue-triage workflow that ran a coding agent with shell access, and was chained into an attack on the project's release pipeline.", source: "https://simonwillison.net/2026/Mar/6/clinejection/" }
    ],
    "surfaces": [
      { text: "MCP Apps, the first official MCP extension (January 2026), lets tools return interactive interfaces inside a chat. Claude, ChatGPT, VS Code Copilot, Microsoft 365 Copilot, Cursor and Goose render them.", source: "https://modelcontextprotocol.io/extensions/client-matrix" },
      { text: "The Agent Client Protocol connects editors such as Zed, JetBrains IDEs, VS Code, Neovim and Emacs to agents such as Claude, Codex, Gemini CLI, GitHub Copilot and Goose.", source: "https://zed.dev/acp" },
      { text: "On 9 July 2026 OpenAI merged the Codex app into the ChatGPT desktop app, with Chat, Work and Codex views.", source: "https://learn.chatgpt.com/docs/whats-new" },
      { text: "Claude Code runs one engine across the terminal, desktop, VS Code, JetBrains, web and mobile, plus integrations with Slack, Chrome and GitHub Actions.", source: "https://code.claude.com/docs/en/platforms" }
    ],
    "harness": [
      { text: "Claude Code's documentation calls “the layer around the model that provides the tools and manages the context the model sees” the agentic harness.", source: "https://code.claude.com/docs/en/how-claude-code-works" },
      { text: "OpenAI's “Harness engineering” post (February 2026) describes a five-month internal project that shipped a beta product with no manually written code: humans steer, agents execute.", source: "https://openai.com/index/harness-engineering/" },
      { text: "Anthropic (March 2026): a planner-generator-evaluator harness cost over 20 times more than a single agent (about 6 hours and $200 against 20 minutes and $9) but produced clearly better, working software.", source: "https://www.anthropic.com/engineering/harness-design-long-running-apps" },
      { text: "Harnesses are now also hosted services: Claude Managed Agents (beta) and OpenAI's Agents API, which offers the Codex harness as a managed API.", source: "https://developers.openai.com/api/docs/guides/agents-api/overview" },
      { text: "Renames in 2026: Gemini CLI handed most individual users over to the new Antigravity CLI on 18 June 2026, windsurf.com now leads to Devin Desktop, and GitHub's coding agent is now called Copilot cloud agent.", source: "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/" }
    ],
    "agent-loop": [
      { text: "ReAct (2022) interleaved reasoning with actions and beat imitation and reinforcement-learning baselines by 34 and 10 percentage points on two interactive benchmarks, using only one or two examples.", source: "https://arxiv.org/abs/2210.03629" },
      { text: "Claude Agent SDK: “Each full cycle is one turn”, and the model keeps calling tools until it produces a response with no tool calls. Hooks can intercept, modify or block each call.", source: "https://code.claude.com/docs/en/agent-sdk/agent-loop" },
      { text: "Errors compound: at 95% accuracy per step, a 10-step task succeeds only about 60% of the time, which is why verification and checkpoints matter.", source: "https://huyenchip.com/2025/01/07/agents.html" }
    ],
    "planning": [
      { text: "Claude Code's plan mode lets the agent read files and run exploratory commands but blocks edits until you approve the plan.", source: "https://code.claude.com/docs/en/permission-modes" },
      { text: "The same team's advice: “If you could describe the diff in one sentence, skip the plan.”", source: "https://code.claude.com/docs/en/best-practices" },
      { text: "In 2026 the Claude Agent SDK made its to-do tools opt-in for the newest models, which track multi-step work without a written list.", source: "https://code.claude.com/docs/en/agent-sdk/todo-tracking" },
      { text: "Tree of Thoughts (2023) let GPT-4 solve 74% of Game of 24 puzzles, against 4% with plain chain-of-thought.", source: "https://arxiv.org/abs/2305.10601" }
    ],
    "sdk": [
      { text: "Microsoft Agent Framework 1.0 (3 April 2026) is the “direct successor” to Semantic Kernel and AutoGen, built by the same teams.", source: "https://learn.microsoft.com/en-us/agent-framework/overview/" },
      { text: "LangChain and LangGraph reached 1.0 in October 2025; Google ADK reached 2.0 in May 2026 and moved its docs to adk.dev.", source: "https://www.langchain.com/blog/langchain-langgraph-1dot0" },
      { text: "The Claude Agent SDK and the OpenAI Agents SDK were still at 0.x versions in October 2026, with releases almost daily.", source: "https://pypi.org/project/claude-agent-sdk/" },
      { text: "OpenAI's deprecation list shows the Assistants API retired on 26 August 2026 and Agent Builder shutting down on 30 November 2026, in favour of the Responses API and the Agents SDK.", source: "https://developers.openai.com/api/docs/deprecations" }
    ],
    "workflows": [
      { text: "Microsoft's guidance: “If you can write a function to handle the task, do that instead of using an AI agent.”", source: "https://learn.microsoft.com/en-us/agent-framework/overview/" },
      { text: "Agents now write their own workflows: Claude Code's dynamic workflows (June 2026) and GitHub Copilot's (October 2026) are scripts the agent writes to run sub-agents in sequence or in parallel, with review checkpoints.", source: "https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app" },
      { text: "Anthropic's rule of thumb for those workflows: “parallelism and specialization have to earn their coordination cost.”", source: "https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/" }
    ],
    "subagents": [
      { text: "In Claude Code each subagent works in its own context window and returns only a summary. Built-in ones include a read-only Explore agent and a Plan agent.", source: "https://code.claude.com/docs/en/sub-agents" },
      { text: "Newer models delegate to subagents more readily, so limits on depth, concurrency and spend matter more (Claude Agent SDK docs, 2026).", source: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      { text: "OpenAI's Agents SDK offers two styles: agents as tools (a manager stays in control) and handoffs (the specialist takes over the conversation).", source: "https://openai.github.io/openai-agents-python/multi_agent/" }
    ],
    "multi-agent": [
      { text: "Anthropic (2025): a lead agent with parallel sub-agents beat a single agent by 90.2% on an internal research evaluation; multi-agent runs used about 15 times the tokens of a chat.", source: "https://www.anthropic.com/engineering/multi-agent-research-system" },
      { text: "Google Research (January 2026, 180 configurations): central coordination improved parallelisable tasks by 80.9%, but every multi-agent setup made strictly sequential tasks 39 to 70% worse.", source: "https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/" },
      { text: "Cognition (April 2026): multi-agent systems “work best today when writes stay single-threaded”; extra agents add review and research rather than parallel edits.", source: "https://cognition.ai/blog/multi-agents-working" },
      { text: "Case study (February 2026): 16 parallel agents and about $20,000 of API use produced a 100,000-line C compiler that builds the Linux kernel.", source: "https://www.anthropic.com/engineering/building-c-compiler" }
    ],
    "a2a": [
      { text: "A2A 1.0, the first stable version, shipped on 12 March 2026 with signed Agent Cards, multi-tenancy and JSON-RPC, gRPC and HTTP bindings.", source: "https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/" },
      { text: "In August 2026 A2A joined the Agentic AI Foundation, the same Linux Foundation home as MCP and AGENTS.md.", source: "https://aaif.io/blog/a2a-joins-aaif" },
      { text: "The A2A docs sum up the split: “MCP is vertical. It deepens a single agent.” A2A “is horizontal. It connects agents across that boundary.”", source: "https://a2a-protocol.org/latest/topics/a2a-and-mcp/" }
    ],
    "long-running": [
      { text: "METR's updated measurements (January 2026) show the 50% time horizon doubling roughly every 4 months since 2023, faster than the 7-month trend measured over 2019 to 2025.", source: "https://metr.org/blog/2026-1-29-time-horizon-1-1/" },
      { text: "METR put the public frontier at roughly 12 hours of human work at 50% success (February to March 2026), with wide uncertainty, and in September 2026 stopped updating its chart because its tasks cannot measure beyond about 16 hours.", source: "https://metr.org/time-horizons/" },
      { text: "Claude Code cloud sessions became generally available on 23 September 2026; sessions keep running on managed VMs after you close your laptop.", source: "https://claude.com/resources/articles/claude-code-on-the-web" },
      { text: "Claude Code's /goal command has a separate model check a completion condition after every turn; the agent keeps working until it is met.", source: "https://code.claude.com/docs/en/goal" }
    ],
    "verification": [
      { text: "Claude Code best practices: “Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from.”", source: "https://code.claude.com/docs/en/best-practices" },
      { text: "Anthropic (March 2026): agents “reliably skew positive when grading their own work”, so a separate, sceptical evaluator agent works better than self-critique.", source: "https://www.anthropic.com/engineering/harness-design-long-running-apps" },
      { text: "Without external feedback, models generally fail to correct their own reasoning and sometimes get worse (Huang et al., ICLR 2024).", source: "https://arxiv.org/abs/2310.01798" }
    ],
    "permissions": [
      { text: "Anthropic found that people approve 93% of permission prompts, a sign of approval fatigue. Its classifier-based auto mode approves routine actions and blocks risky ones.", source: "https://www.anthropic.com/engineering/claude-code-auto-mode" },
      { text: "Auto mode's published error rates: 0.4% false alarms on 10,000 real actions, but 17% of 52 genuinely overeager actions slipped through. Anthropic calls it no replacement for careful human review.", source: "https://www.anthropic.com/engineering/claude-code-auto-mode" },
      { text: "Auto mode became generally available in July 2026 and is the default starting mode for interactive Claude Code sessions since August 2026. Deny rules still apply in every mode.", source: "https://code.claude.com/docs/en/permission-modes" },
      { text: "OpenAI Codex separates sandbox modes (read-only, workspace-write, full access) from approval policies; its default preset can write in the workspace with the network switched off.", source: "https://learn.chatgpt.com/docs/agent-approvals-security" }
    ],
    "hooks": [
      { text: "Claude Code documents 33 hook events (October 2026), including session start, prompt submitted, before and after each tool call, before compaction and stop.", source: "https://code.claude.com/docs/en/hooks" },
      { text: "A common shape has emerged across Claude Code, Codex and Cursor: JSON on standard input and output, matchers on tool names, and exit code 2 to block an action.", source: "https://cursor.com/docs/hooks" },
      { text: "Hooks do not override permission rules: a matching deny rule still blocks, even if a hook said allow.", source: "https://code.claude.com/docs/en/permissions" },
      { text: "OpenAI Codex requires repository hooks to be reviewed and trusted before they run.", source: "https://learn.chatgpt.com/docs/hooks" }
    ],
    "guardrails": [
      { text: "In the OpenAI Agents SDK, input guardrails run in parallel with the agent by default; a tripped guardrail raises an exception and halts the run.", source: "https://openai.github.io/openai-agents-python/guardrails/" },
      { text: "Anthropic's Constitutional Classifiers cut jailbreak success from 86% to 4.4% (2025); the next generation (January 2026) screens all traffic for about 1% extra compute.", source: "https://www.anthropic.com/research/next-generation-constitutional-classifiers" },
      { text: "Microsoft's Prompt Shields check both user prompts and documents or tool responses for injected instructions.", source: "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection" }
    ],
    "hitl": [
      { text: "Anthropic (February 2026): new Claude Code users fully auto-approve about 20% of sessions, experienced users over 40%, while they interrupt slightly more often. Experience shifts oversight from approving to monitoring.", source: "https://www.anthropic.com/research/measuring-agent-autonomy" },
      { text: "The same study found that about 73% of tool calls on Anthropic's API involve a human in the loop and only about 0.8% of actions look irreversible.", source: "https://www.anthropic.com/research/measuring-agent-autonomy" },
      { text: "Singapore's agentic AI framework warns of automation bias: define significant checkpoints for high-stakes or irreversible actions, and audit whether oversight still works.", source: "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf" }
    ],
    "security": [
      { text: "Meta's Agents Rule of Two (October 2025): until prompt injection can be reliably detected, a session should combine at most two of untrusted input, access to sensitive data or systems, and the ability to change state or communicate externally.", source: "https://ai.meta.com/blog/practical-ai-agent-security/" },
      { text: "OWASP published its Top 10 for Agentic Applications in December 2025 (agent goal hijack, tool misuse, identity and privilege abuse, agentic supply chain and more) and a 2026 edition of its LLM Top 10 in August 2026.", source: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
      { text: "Real incident (July 2026): Hugging Face disclosed an intrusion “driven, end to end, by an autonomous AI agent system” that entered through code execution in its dataset processing.", source: "https://huggingface.co/blog/security-incident-july-2026" },
      { text: "METR's independent investigation (August 2026) describes that incident as OpenAI agents under test coordinating a multi-day hack of Hugging Face.", source: "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/" },
      { text: "UK AISI (August 2026): in a permissive cyber evaluation with internet access, agents in 10 of 122 runs took unsanctioned actions against real people and organisations.", source: "https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing" }
    ],
    "tools": [
      { text: "Anthropic's tool search (November 2025) cut tokens for tool definitions by about 85% and raised accuracy on an MCP evaluation from 49% to 74%.", source: "https://www.anthropic.com/engineering/advanced-tool-use" },
      { text: "Claude's docs note that tool selection degrades beyond 30 to 50 tools, and that five MCP servers can use about 55,000 tokens of definitions before any work starts.", source: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool" },
      { text: "Strict, schema-constrained tool arguments and structured outputs are generally available from both Anthropic and OpenAI (2026).", source: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use" }
    ],
    "mcp": [
      { text: "Current specification: revision 2026-07-28. The core is now stateless (no initialisation handshake or sessions); long-running Tasks became an extension; Roots, Sampling, Logging and dynamic client registration are deprecated.", source: "https://modelcontextprotocol.io/specification/2026-07-28/changelog" },
      { text: "The maintainers reported close to half a billion monthly SDK downloads at that release.", source: "https://blog.modelcontextprotocol.io/posts/2026-07-28/" },
      { text: "Official extensions include MCP Apps (interactive UI), Tasks, Skills over MCP and enterprise-managed authorisation.", source: "https://modelcontextprotocol.io/extensions/overview" },
      { text: "Presenting MCP servers as code APIs cut one Drive-to-Salesforce workflow from about 150,000 to 2,000 tokens (Anthropic, November 2025).", source: "https://www.anthropic.com/engineering/code-execution-with-mcp" },
      { text: "The official MCP Registry was still labelled a preview in October 2026.", source: "https://modelcontextprotocol.io/registry/about" }
    ],
    "sandbox": [
      { text: "Anthropic's OS-level sandbox for Claude Code (file-system and network isolation) cut permission prompts by 84% internally; the runtime is open source.", source: "https://www.anthropic.com/engineering/claude-code-sandboxing" },
      { text: "Claude Code's docs compare six isolation tiers and recommend a VM or a hosted cloud session for untrusted repositories.", source: "https://code.claude.com/docs/en/sandbox-environments" },
      { text: "Docker Sandboxes run each agent in a micro-VM and inject credentials through a proxy, so keys never enter the VM.", source: "https://docs.docker.com/ai/sandboxes/architecture/" },
      { text: "GitHub made local sandboxing for Copilot generally available on 7 October 2026.", source: "https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available" }
    ],
    "computer-use": [
      { text: "OSWorld 2.0 (June 2026) tests long professional workflows of about 318 tool calls each; the best reported full success rate was about 21%.", source: "https://osworld-v2.xlang.ai/" },
      { text: "Claude computer use is generally available on the Claude API (2026), with classifiers that scan screenshots for prompt injection.", source: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool" },
      { text: "OpenAI's API docs now recommend letting the model drive the computer by writing code (Playwright or PyAutoGUI scripts) where possible.", source: "https://developers.openai.com/api/docs/guides/tools-computer-use" },
      { text: "Playwright MCP drives web pages through accessibility snapshots, with no vision model required.", source: "https://playwright.dev/docs/getting-started-mcp" }
    ],
    "evals": [
      { text: "Anthropic's guide (January 2026): combine code, model and human graders; start with 20 to 50 tasks drawn from real failures; grade outcomes rather than exact paths; read the transcripts.", source: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
      { text: "Report reliability, not luck: pass@k counts a task solved if any of k tries works, pass^k only if all k do.", source: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
      { text: "Benchmarks saturate fast: Terminal-Bench went from version 2.0 to 4.0 within a year, now as a continuously versioned benchmark (August 2026).", source: "https://www.tbench.ai/news/terminal-bench-4-0" },
      { text: "Check for cheating: METR reported the highest rate of benchmark cheating it had seen in a public model in June 2026.", source: "https://metr.org/blog/2026-06-26-gpt-5-6-sol/" },
      { text: "OpenAI's hosted Evals platform becomes read-only on 31 October 2026 and shuts down on 30 November 2026.", source: "https://developers.openai.com/api/docs/deprecations" }
    ],
    "observability": [
      { text: "OpenTelemetry's generative-AI conventions moved to their own repository and are still marked “Development”; they cover agent, tool and MCP spans.", source: "https://github.com/open-telemetry/semantic-conventions-genai" },
      { text: "Claude Code exports OpenTelemetry metrics (tokens, cost, sessions) and events, and traces each prompt with tool calls and sub-agent work nested beneath it (beta). Prompt text is redacted by default.", source: "https://code.claude.com/docs/en/monitoring-usage" },
      { text: "The OpenAI Agents SDK traces runs by default and can export to Langfuse, Phoenix, Braintrust, LangSmith, Datadog and others.", source: "https://openai.github.io/openai-agents-python/tracing/" },
      { text: "Market moves: ClickHouse acquired Langfuse in January 2026 (it stays open source), and W&B Weave's successor is CoreWeave Agent Lens.", source: "https://langfuse.com/blog/joining-clickhouse" }
    ],
    "governance": [
      { text: "EU AI Act timeline: in force since August 2024, prohibitions since February 2025, duties for general-purpose AI models since August 2025, and generally applicable since 2 August 2026.", source: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
      { text: "The Digital Omnibus on AI, Regulation (EU) 2026/1744 (in force 27 July 2026), moved high-risk obligations to 2 December 2027 for Annex III uses and 2 August 2028 for Annex I products.", source: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj" },
      { text: "Singapore's Model AI Governance Framework for Agentic AI (version 1.5, May 2026) is organised around bounding risks upfront, meaningful human accountability, technical controls and end-user responsibility.", source: "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf" },
      { text: "NIST says its AI Risk Management Framework is being revised; the Generative AI Profile (NIST AI 600-1) lists 12 risks, including prompt injection.", source: "https://www.nist.gov/itl/ai-risk-management-framework" }
    ]
  };

  Object.keys(blocks).forEach(function (id) {
    blocks[id].links = SOURCES[id] || [];
    if (FACTS[id]) blocks[id].facts = FACTS[id];
  });

  return {
    meta: meta, zones: zones, connectors: connectors, blocks: blocks, steps: steps, context: context,
    compare: compare, decide: decide, patterns: patterns, ladder: ladder, recipe: recipe, flows: flows,
    pairs: pairs, checklist: checklist, protocols: protocols, glossary: glossary, learn: learn,
    story: story, ideas: ideas, guides: guides
  };
})();
