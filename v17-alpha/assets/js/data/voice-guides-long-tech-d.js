/* AI explained (v17): two guides in the technical voice, part d: what tells skills, tools, MCP servers, plugins and hooks apart (compare),
   and the reading list as a route (learn). Plain words, mechanism first, no analogy. */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var T = AE3.tech = AE3.tech || {};
  T.longGuides = T.longGuides || {};
  Object.assign(T.longGuides, {

    "compare": {
      lede: "Skills, tools, MCP servers, plugins, hooks and sub-agents all extend an agent. They differ in who starts them, when they enter the context window, what they cost in tokens and whether code or the model's judgement decides.",
      audience: "Anyone who sets up or builds an agent and meets these words in documentation. No programming is needed to follow it; the configuration samples help if you write such files yourself.",
      expect: [
        "Four questions that tell any kind of agent extension apart",
        "Which things sit in every request, which load only when needed, and what each costs in tokens",
        "What a `SKILL.md`, an MCP tool listing, a plugin folder and a hook configuration look like",
        "When to split work across sub-agents, agent teams or A2A, and what that costs",
        "Which one to reach for first, and the mistakes people make most often"
      ],
      minutes: 21,
      sections: [
        {
          id: "four-questions",
          title: "Why these words get mixed up",
          short: "Many different things extend an AI agent, and documentation uses the words loosely. Four questions separate them: who starts it, when it enters the model's input, what it costs, and whether code or the model decides.",
          text: [
            "An [[agent]] is a [[model|language model]] running in a loop: it reads its input, decides on a step, a program around it carries the step out, and the result goes back into the input. That program is the [[harness]]. Almost everything in this guide is a way to change what the harness puts in front of the model, or what the harness does around it. Because all of it ends up as text in the same input, the [[context|context window]], the words are easy to confuse: a skill, a slash command and a playbook can hold the same Markdown, and a tool, an MCP server and a hook can run the same script.",
            "The differences lie in the mechanics, not in the content. The same rule (\"quote every fare including one cabin bag\") behaves very differently as a line in the system prompt, as a step in a skill, or as a hook that rejects a spreadsheet row without a bag fee. The four questions in the table below separate them, and the next part answers them for twelve common kinds.",
            "The fourth question matters most. A model follows instructions with high probability, not with certainty. If a rule must hold every time, it has to be checked by code that runs whatever the model decides. Vendor documentation says so plainly: instruction files are treated as context, not as enforced configuration, and an action that must always be blocked needs a hook."
          ],
          table: {
            head: ["Question", "What it separates", "Examples"],
            rows: [
              ["Who starts it?", "The harness on every request, the model when it judges it useful, the person by name, or an event in the agent's lifecycle", "System prompt: the harness. Skill: the model or the person. Hook: an event."],
              ["When does it enter the context?", "At the start of every request, only when a task needs it, or never", "Instruction file: every request. Skill body: when used. Hook script: never."],
              ["What does it cost in tokens?", "Input is billed on every request, so anything fixed is paid again and again", "Illustration: a 2,000-token instruction file over 40 requests is 80,000 input tokens."],
              ["Does code or the model decide?", "Deterministic means guaranteed by code; otherwise the model may or may not comply", "Hook: code. Skill text: the model. Tool: the model chooses, the code runs as written."]
            ]
          },
          src: [4, 8, 16]
        },
        {
          id: "overview",
          title: "All of them side by side",
          short: "One table with twelve common kinds of agent extension, answering the four questions for each. Read across a row to see how one kind behaves, or down a column to compare them.",
          text: [
            "Each row is one kind of extension. The columns are the four questions, plus what the thing is and what it suits best. The **Deterministic?** column says whether code guarantees the behaviour. \"Partly\" means that some pieces are code, such as a script bundled with a skill, while the decision to use them is still the model's.",
            "Read the column **When it enters the context** and three groups appear. The system prompt, instruction files and memory are loaded on every request. Skills, playbooks, slash commands and retrieval ([[rag|RAG]]) enter only when a task needs them. Tools, MCP servers and hooks are about acting and enforcing rather than knowing, and sub-agents split the work across separate context windows. Plugins are not a kind of their own: they package the others. The next parts take these groups one at a time, with the file formats and the token arithmetic behind each row."
          ],
          view: "compare-table",
          src: [1, 9, 11, 13, 16, 18]
        },
        {
          id: "always-loaded",
          title: "Always loaded: system prompt, instruction files, memory",
          short: "Some text is placed in front of the model at the start of every request: the developer's standing instructions, project rule files and saved memory. It is always there, so it is always paid for.",
          text: [
            "The [[system-prompt]] is the developer's standing text at the top of the input: role, rules, output format and guidance on when to use which tool. The model API keeps nothing between calls, so the harness sends it again with every request of a run. It is written once and changes rarely, which makes it the best candidate for [[prompt-caching]]: the provider stores the processed form of an unchanged beginning of the input and bills later reads of it at a fraction of the normal input price, a tenth or less on Claude models (October 2026).",
            "[[instructions|Instruction files]] are Markdown files the harness finds on disk and adds at the start of every chat or job. [[agents-md|AGENTS.md]] is the cross-tool format, stewarded by the Agentic AI Foundation and used by more than 60,000 open-source projects; many harnesses also read their own file, such as `CLAUDE.md` or `GEMINI.md`. Files are layered: a personal file, a project file shared in the repository, and files in sub-folders, where the nearest one wins. Some harnesses load a sub-folder's file only once the agent works in that folder, and Codex caps the combined chain at 32 KiB by default (October 2026).",
            "[[memory|Memory]] is what the agent keeps from one chat or job to the next: preferences, decisions, progress. It lives outside the model, in files or a database, and is loaded back. Two shapes are common. An index loaded at the start (Claude Code loads the first 200 lines or 25 KB of its `MEMORY.md`, October 2026) is always paid for. A memory tool, which the model calls to create, read and update its own notes, costs tokens only when used, but depends on the model deciding to look.",
            "The cost is simple multiplication. A run of 40 tool calls is about 40 requests, and everything always loaded is paid in each of them: as an illustration with invented sizes, a 2,000-token instruction file costs 80,000 input tokens before any work is done. Caching lowers the price but not the competition for attention. Every always-loaded line sits next to the task, which is why vendors advise short files; Claude Code suggests under 200 lines per `CLAUDE.md`."
          ],
          code: {
            label: "Illustrative: a short AGENTS.md with only what the agent cannot guess",
            text: [
              "# AGENTS.md",
              "",
              "## Build and test",
              "- Install: `npm ci`",
              "- Test: `npm test` (must pass before any commit)",
              "",
              "## Conventions",
              "- Prices are integers in cents, never floats.",
              "- Dates are ISO 8601, for example 2026-05-14.",
              "",
              "## Do not",
              "- Edit anything under `vendor/`.",
              "- Call the live fares API in tests; use `fixtures/fares.json`."
            ].join("\n")
          },
          callout: { t: "Common mistake", d: "Pasting the whole project wiki into the instruction file. A February 2026 study found that such context files did not generally improve task success but raised inference cost by over 20% on average; repository overviews did not help, while specific instructions were followed. Keep what the agent cannot guess, and move procedures into skills." },
          example: "For the Lisbon trip the always-loaded part is a few lines: the home airport, the budget rule (total price including one cabin bag) and the column layout of the travel sheet. Memory adds \"prefers aisle seats\". Each line is useful on every request of the job, which is the test for whether it belongs here.",
          src: [4, 5, 6, 7, 8, 26]
        },
        {
          id: "on-demand",
          title: "Loaded when needed: skills, slash commands, playbooks",
          short: "Know-how for one kind of task can wait on disk until that task comes up. Until then only a one-line description sits in the model's input, so an agent can carry many of these at little cost.",
          text: [
            "A [[skills|skill]] is a folder with a `SKILL.md` file: YAML front matter (a block of named fields between two `---` lines) followed by Markdown instructions, and optionally `scripts/`, `references/` and `assets/` folders. The open specification at agentskills.io requires two fields. `name` is at most 64 characters of lower-case letters, digits and hyphens and must match the folder name; `description` is at most 1,024 characters and says what the skill does and when to use it. Optional fields are `license`, `compatibility`, `metadata` and an experimental `allowed-tools`.",
            "Skills load in three stages, which is called progressive disclosure. At the start the harness puts only each skill's name and description into the input, about 100 tokens per skill. When a task matches a description, the model reads the full `SKILL.md`; the specification recommends under 5,000 tokens and 500 lines. Files in `references/` or `scripts/` are opened only when the instructions point to them, and a script can be run without its source entering the context, since only its output comes back. By that figure, twenty skills would cost roughly 2,000 tokens per request until one is used.",
            "A skill is started by the model, on its own judgement, or by the person, by name. The model decides from the description alone, so the description is the trigger: write what the skill does and \"Use when ...\" with the words a user would type. Harnesses let you restrict this. In Claude Code, `disable-model-invocation: true` means only the person can start the skill, which suits actions with side effects such as a deploy, and `user-invocable: false` hides it from the person's menu.",
            "A [[slash-command]] is a saved prompt template started by name, such as `/review`, with arguments filled into placeholders. Claude Code states that custom commands have been merged into skills: a command file and a skill of the same name both create the same slash command. MCP servers can offer the same as prompts, which the specification calls user-controlled, giving slash commands as an example of the interface. A [[playbook]] is a written procedure for a recurring task with steps, checks and a definition of done; Devin's documentation compares one to a custom system prompt for a repeated task. Stored as a skill, it loads only when its task starts."
          ],
          code: {
            label: "Illustrative: a skill folder and its SKILL.md (front matter fields from the Agent Skills specification)",
            text: [
              "compare-fares/",
              "├── SKILL.md",
              "├── scripts/total_price.py",
              "└── references/bag-fees.md",
              "",
              "---",
              "name: compare-fares",
              "description: Compares flight offers by total price including bags and seat fees.",
              "  Use when the user asks for the cheapest flights or a fare comparison.",
              "license: Apache-2.0",
              "metadata:",
              "  version: \"1.2\"",
              "---",
              "# Compare fares",
              "1. For each offer, run `scripts/total_price.py <fare-id>`.",
              "2. If an airline is missing from its output, read `references/bag-fees.md`.",
              "3. Return a table: airline, departure, total in euros, cheapest first.",
              "4. Done when every offer has a total and none exceeds the budget."
            ].join("\n")
          },
          callout: { t: "Common mistake", d: "A vague description such as \"Helps with flights\". The model never sees the body until the description matches, so a weak description means the skill is never used, and an over-broad one loads it into tasks where it does not belong. Skills can also contain scripts: read third-party skills before installing them." },
          src: [1, 2, 3, 9, 10]
        },
        {
          id: "plugins",
          title: "Plugins: one install for a whole setup",
          short: "A plugin is not a new kind of extension. It is a package that installs several skills, sub-agents, hooks and MCP servers together, so that a team can share one setup and update it as a unit.",
          text: [
            "A [[plugin]] is a folder with a manifest, a JSON file that names the plugin and describes its parts, plus the parts themselves. In Claude Code the manifest is `.claude-plugin/plugin.json`, and a plugin can hold skills, sub-agent definitions, a hooks file and an `.mcp.json` file that adds MCP servers. Plugins are distributed through marketplaces, which are catalogues kept in ordinary Git repositories or folders. A vendor-neutral Agent Plugins specification (version 1.0.0) defines a shared package format, with a `plugin.json` manifest, for skills and MCP servers; its initial Technical Steering Committee includes core maintainers from Amazon, Cursor, Microsoft, OpenAI and Vercel.",
            "Every part keeps its own behaviour after installation. A skill in a plugin still loads progressively, a hook still fires on its event, an MCP server still adds tools. The context cost of a plugin is therefore the sum of its parts, and it is paid in every session where the plugin is enabled, not only when you use it: the names and descriptions of its skills and agents that the model may start on its own sit in the input on every turn, its MCP servers run alongside the session and its hooks fire at their events. Claude Code shows an estimated context cost for plugins in Anthropic's official marketplace before you install them (October 2026).",
            "A plugin also carries the risk of its parts. It runs code with your user privileges, and an update can change what it does. Read its contents, pin a version, enable it only in projects that need it, and switch off plugins you no longer use."
          ],
          code: {
            label: "Illustrative: a plugin folder in the Claude Code layout",
            text: [
              "travel-tools/",
              "├── .claude-plugin/",
              "│   └── plugin.json     { \"name\": \"travel-tools\", \"version\": \"1.0.0\",",
              "│                         \"description\": \"Fare search, comparison and sheet export\" }",
              "├── skills/",
              "│   └── compare-fares/SKILL.md",
              "├── agents/",
              "│   └── fare-researcher.md",
              "├── hooks/",
              "│   └── hooks.json",
              "└── .mcp.json           (adds the fares MCP server)"
            ].join("\n")
          },
          callout: { t: "Common mistake", d: "Installing a large plugin for one of its skills. Each enabled plugin adds descriptions and tools to every session, and many similar tools make the model choose worse. Copy the one skill you need, or disable the parts you do not use." },
          src: [11, 12]
        },
        {
          id: "tools-and-mcp",
          title: "Things that act: tools and MCP servers",
          short: "A tool is a function the model can ask the harness to run, such as a fare search. An MCP server is a separate program that offers tools to any app that speaks the same open protocol.",
          text: [
            "[[tools|Tools]] are how an agent does things rather than knows things. Each tool is described by a name, a description and a [[tool-schema|JSON Schema]] for its inputs, and these definitions are sent with every request. When the model wants a tool, it emits a structured call with the tool's name and inputs and stops; the harness validates the call, runs the real code and returns the result as a new message. This is [[function-calling]]. Choosing the tool and its arguments is the model's judgement, but the code then runs exactly as written, which is why the table marks the action itself as deterministic.",
            "The [[mcp|Model Context Protocol]] standardises where tools come from. The host application runs one MCP client per server. The [[mcp-server]] answers a `tools/list` request with its tool definitions and a `tools/call` request with results, using JSON-RPC messages, locally over standard input and output or remotely over HTTP. The harness turns each listed tool into an ordinary tool definition, so the model sees no difference. Servers can also offer resources (data to read) and prompts (templates). The current revision, 2026-07-28, made the core stateless, so a server no longer keeps a session per client.",
            "The cost of tools lies in their definitions, which are input on every request whether a tool is used or not. Anthropic described a setup of five MCP servers with 58 tools that used about 55,000 tokens before the conversation starts, and said it has seen tool definitions consume 134,000 tokens internally (November 2025). [[tool-search|Tool search]] keeps only a search tool in the input and loads definitions when needed; Anthropic reported an 85% cut in definition tokens and better tool choice on its MCP evaluation (November 2025). Results cost too, so a tool should return short, filtered output rather than a raw dump.",
            "Tool definitions sit at the very start of the cached part of the input. Adding a server in the middle of a session or reordering tools therefore invalidates the cache for everything after them. The MCP specification says servers should return their tools in a deterministic order, and names prompt cache hit rates as one reason."
          ],
          code: {
            label: "Illustrative: an MCP server's answer to tools/list (shape from the 2026-07-28 specification)",
            text: [
              "{ \"jsonrpc\": \"2.0\", \"id\": 1,",
              "  \"result\": {",
              "    \"resultType\": \"complete\",",
              "    \"tools\": [",
              "      { \"name\": \"search_flights\",",
              "        \"title\": \"Flight search\",",
              "        \"description\": \"Search fares. Returns up to 10 offers, cheapest first.\",",
              "        \"inputSchema\": {",
              "          \"type\": \"object\",",
              "          \"properties\": {",
              "            \"from\":  { \"type\": \"string\", \"description\": \"IATA code, e.g. AMS\" },",
              "            \"to\":    { \"type\": \"string\" },",
              "            \"month\": { \"type\": \"string\" } },",
              "          \"required\": [\"from\", \"to\", \"month\"] } } ],",
              "    \"ttlMs\": 300000, \"cacheScope\": \"public\" } }"
            ].join("\n")
          },
          callout: { t: "Common mistake", d: "Connecting every available server just in case. Each adds definitions to every request, similar tools from different servers confuse tool choice, and each server can reach whatever its account can reach. Its tool descriptions are read by the model, so a malicious one can carry hidden instructions ([[tool-poisoning]]). Connect servers per project, from publishers you trust." },
          example: "For the Lisbon trip, `search_flights` (an invented example name) comes from a fares MCP server and `append_row` (also an example name) from the spreadsheet maker's server. The model asks for `search_flights` with AMS, LIS and May; the server's code queries the fares and returns ten offers. The model never touches the fares system itself.",
          src: [13, 14, 15, 25, 8]
        },
        {
          id: "hooks",
          title: "Things that enforce: hooks",
          short: "A hook is a small script the harness runs automatically at a fixed moment, for example just before a tool is used. It runs whatever the model decides, so it is the place for rules that must always hold.",
          text: [
            "[[hooks|Hooks]] reverse the direction. The model does not choose to call a hook; the harness fires a lifecycle event and runs every hook registered for it. Typical events are the start of a session, a submitted prompt, before and after each tool call, before the context is compacted, and the moment the agent wants to stop. Claude Code documents 33 such events (October 2026). Claude Code and Cursor share a common shape: the event arrives as JSON on standard input, a matcher selects which tools or commands the hook applies to, and exit code 2 blocks the action.",
            "In Claude Code, exit code 0 lets the action proceed. Exit code 2 blocks it on events that can be blocked, and the text on standard error goes back as the reason. Any other code is a non-blocking error, so a script that crashes does not block. A `PreToolUse` hook that exits with 2 stops the tool call; a `Stop` hook that exits with 2 keeps the agent working, which is how a definition of done such as \"the tests pass\" is enforced. A hook can also print JSON with an `additionalContext` string inside `hookSpecificOutput`, which Claude Code adds to the context as a system reminder at the point where the hook fired.",
            "Output is the only way a hook touches the context: the `additionalContext` string, plain text on standard output for a few events such as `SessionStart` and `UserPromptSubmit`, and the standard error text when a hook blocks. The script itself never enters the context, so a hook costs close to zero tokens; its price is time, because a slow hook on every tool call delays every turn. Not every hook is deterministic: Claude Code also offers hook types that ask a model for a decision or start a small agent to check a condition (the agent type is experimental), which bring judgement back in. For a rule that must hold, use a command hook whose logic is plain code. Hooks run with your permissions, so install them only from sources you trust."
          ],
          code: {
            label: "Illustrative: a PreToolUse hook that blocks spreadsheet rows over budget (Claude Code settings format)",
            text: [
              "// .claude/settings.json",
              "// MCP tools are matched as mcp__<server>__<tool>; \"sheets\" and \"append_row\"",
              "// are invented example names, as is the total_eur field read below",
              "{ \"hooks\": {",
              "    \"PreToolUse\": [",
              "      { \"matcher\": \"mcp__sheets__append_row\",",
              "        \"hooks\": [ { \"type\": \"command\",",
              "                     \"command\": \".claude/hooks/check-row.sh\" } ] } ] } }",
              "",
              "# .claude/hooks/check-row.sh  (the event arrives as JSON on stdin)",
              "total=$(jq -r '.tool_input.total_eur')",
              "if [ \"$total\" -gt 450 ]; then",
              "  echo \"Row exceeds the 450 EUR budget\" >&2",
              "  exit 2    # block the call; the reason goes back to the model",
              "fi",
              "exit 0      # let it through"
            ].join("\n")
          },
          callout: { t: "Prompts suggest, code enforces", d: "\"Never write a row over budget\" in the system prompt works most of the time. The hook above works every time, because the check runs outside the model. Use both: the instruction so the model rarely tries, the hook so that a slip cannot get through." },
          src: [16, 17, 4]
        },
        {
          id: "split-work",
          title: "Things that split work: sub-agents, agent teams, A2A",
          short: "Some jobs are better split among several agents, each with its own fresh input. The helpers send back a short result, which keeps the main agent's input small but uses more tokens overall.",
          text: [
            "A [[sub-agent]] is a separate agent instance with its own context window, its own instructions and often a narrower set of tools or a cheaper model. The main agent calls it like a tool, with a written brief, and gets back only its final message. Everything the helper read along the way (search results, files, dead ends) stays in the helper's context. In Claude Code a sub-agent is a Markdown file with front matter (`name`, `description`, optional `tools` and `model`) whose body becomes its system prompt; as with skills, the description decides when the main agent delegates.",
            "The cost cuts both ways. The main context stays small, but every helper pays for its own input, and the brief is all it knows: unless it is a fork of the current conversation, it sees nothing of the parent's conversation. Anthropic's multi-agent research system beat a single agent by about 90% on an internal research evaluation while using about 15 times the tokens of a chat (June 2025). A Google study of 180 agent configurations found that every multi-agent variant degraded performance on a sequential planning benchmark by 39 to 70%, while centralised coordination improved a parallel financial-reasoning benchmark by 80.9% over a single agent (January 2026).",
            "[[agent-teams|Agent teams]] go a step further: several full agents share a task list and message each other, with a lead that assigns work, instead of each helper reporting only to its caller. They suit work whose parts need discussion, and they cost the most. In Claude Code they are experimental and off by default (October 2026). The pattern underneath both is [[orchestrator-workers]]: a lead plans at run time and delegates the parts.",
            "[[a2a|A2A]], the Agent2Agent protocol, crosses the boundary between organisations. A remote agent publishes an [[agent-card]] that describes its skills, address and authentication; other agents send it whole tasks through one of the protocol's bindings (JSON-RPC, gRPC or HTTP with JSON) and receive status updates and results, while its internal state, memory and tools stay hidden. Version 1.0.0 is the latest released version of the specification (October 2026). The A2A project draws the line in one sentence: A2A is about agents partnering on tasks, MCP about agents using capabilities."
          ],
          table: {
            head: ["Kind", "Own context?", "Talks to", "Use for"],
            rows: [
              ["Sub-agent", "Yes, fresh for each task", "Its caller, with a result at the end", "Reading, searching and reviewing, often in parallel"],
              ["Agent team", "Yes, one per member", "Each other, through messages and a shared task list", "Parts that must be discussed or coordinated"],
              ["A2A agent", "Yes, hidden from the caller", "The calling agent, as a task with a lifecycle", "Delegating to another team's or company's agent"]
            ]
          },
          example: "For the Lisbon trip, three sub-agents each check one airline at the same time and return one line each: carrier, departure, total price. The main agent never sees the three sets of web pages, only three lines, so its context stays small for writing the sheet.",
          src: [18, 19, 20, 21, 22]
        },
        {
          id: "which-one",
          title: "Which one do I need?",
          short: "Start from the problem, not from the feature. The steps below match a problem to the lightest thing that solves it, and the list after them names the mistakes people make most often.",
          text: [
            "Each step asks one question; stop at the first yes. The order runs from cheapest and most predictable to most expensive, in line with the common advice to start with the simplest design and add complexity only when tests show it is needed. The talk \"Tool, skill, or subagent? Decomposing an agent that outgrew its prompt\" from the Claude channel is about the same choice."
          ],
          steps: [
            { t: "Must it hold every single time?", d: "Use a hook or a [[permissions|permission]] rule whose logic is code. Add a line to the instructions as well, so the model rarely tries." },
            { t: "Does the model need it on every task?", d: "Put it in the system prompt or the instruction file, in a few precise lines. A fact about the user that changes over time belongs in memory." },
            { t: "Is it a procedure for one kind of task?", d: "Write a skill with a precise description. If only a person should start it, make it invocable by name only, as a slash command." },
            { t: "Does the agent need live data or to change something?", d: "Write a tool. If several apps or agents should share it, or a vendor already offers one, use an MCP server." },
            { t: "Does a side job flood the context, or could parts run in parallel?", d: "Delegate to a sub-agent with a clear brief and a short required answer. Use an agent team only when the parts must talk to each other." },
            { t: "Is the other agent run by another team or company?", d: "Use A2A, and treat its replies as untrusted input." },
            { t: "Do you want to share the whole setup?", d: "Bundle the pieces into a plugin, pin its version and keep it small." }
          ],
          list: [
            "**A rule in the prompt that must never break:** prompts suggest, code enforces. Move it into a hook or a permission.",
            "**Everything always loaded:** a long instruction file is paid on every request and dilutes attention. Move procedures into skills.",
            "**A skill with a vague description:** it never triggers, or triggers everywhere. Name the task and the words a user would use.",
            "**Tool sprawl:** dozens of overlapping tools from many servers cost tens of thousands of tokens and worsen tool choice. Use fewer, task-shaped tools, or tool search.",
            "**Sub-agents for sequential work:** splitting tightly linked steps adds cost and errors. Keep one agent for steps that depend on each other.",
            "**Untrusted bundles:** skills, hooks, plugins and MCP servers can all run code with your access. Read them before installing and pin versions."
          ],
          src: [23, 24, 15, 20, 2]
        }
      ],
      terms: ["system-prompt", "instructions", "agents-md", "memory", "skills", "slash-command", "playbook", "plugin", "tools", "function-calling", "mcp", "mcp-server", "tool-search", "hooks", "sub-agent", "agent-teams", "a2a", "prompt-caching"],
      sources: [
        "https://agentskills.io/specification",
        "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        "https://code.claude.com/docs/en/skills",
        "https://code.claude.com/docs/en/memory",
        "https://agents.md/",
        "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        "https://arxiv.org/abs/2602.11988",
        "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
        "https://modelcontextprotocol.io/specification/2026-07-28/server/prompts",
        "https://docs.devin.ai/product-guides/creating-playbooks",
        "https://code.claude.com/docs/en/plugins/overview",
        "https://agent-plugins.org/",
        "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
        { type: "spec", title: "Tools (MCP specification, revision 2026-07-28)", by: "Model Context Protocol", url: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools", year: 2026 },
        "https://www.anthropic.com/engineering/advanced-tool-use",
        "https://code.claude.com/docs/en/hooks",
        "https://cursor.com/docs/hooks",
        "https://code.claude.com/docs/en/sub-agents",
        "https://www.anthropic.com/engineering/multi-agent-research-system",
        "https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/",
        "https://a2a-protocol.org/latest/specification/",
        "https://a2a-protocol.org/latest/topics/a2a-and-mcp/",
        "https://www.anthropic.com/engineering/building-effective-agents",
        "https://www.youtube.com/watch?v=mWvtOHlZM-I",
        "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
        "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
      ]
    },

    "learn": {
      lede: "The reading list turned into a route: which talks, courses, essays, books and papers to take in, in what order, and how to keep up once you have read them.",
      audience: "Anyone who wants to understand agents properly, from a complete beginner to an engineer. Nothing is assumed at the start; the later groups expect some programming or mathematics, and each part says so.",
      expect: [
        "A week-by-week path through the list, easiest first",
        "What to read if you only have one hour",
        "What each group teaches, what to start with in it and what level it assumes",
        "Where first-hand news appears: specifications, changelogs, vendor documentation and evaluations"
      ],
      minutes: 15,
      sections: [
        {
          id: "how-to-use",
          title: "How to use this list",
          short: "The list has six groups, from short videos to research papers. Follow the path below from the top, and skip ahead only when a part feels easy.",
          text: [
            "The groups run from least to most demanding: short talks, longer talks, free courses, essays by people who build agents, books, and the papers the field rests on. Videos and courses carry a level (beginner or intermediate), and videos a length. You do not need all of it. Most people who build with [[agent|agents]] read the essays closely, take one course with code, and dip into the rest when a question comes up.",
            "Read actively. After each item, write down in two or three sentences what it claimed and what evidence it gave. Where an essay gives a rule (start with the simplest design, keep tool definitions short, test on real failures), try it on a small task of your own, such as an agent that finds three flights to Lisbon within a budget and writes them into a spreadsheet. A rule you have tried sticks; one you have only read does not.",
            "Choose by what you want to do. If you will use agents at work rather than build them, the first two weeks are enough, plus the short course on skills. If you will build them, the courses with code, the evaluation course and the book AI Engineering matter most. If you want to understand the models themselves, spend your time on the long talks, the transformer chapters, the from-scratch books and the papers. Dates matter throughout: the talks from 2023 and 2024 describe models that have since been replaced, but the mechanisms they explain (next-token prediction, the loop, tool calls) still hold."
          ],
          steps: [
            { t: "Week 1", d: "Watch the five talks of the first group, about two and a quarter hours in all. Start with the eight-minute primer on [[model|language models]] and end with the two talks on agents." },
            { t: "Week 2", d: "Read the five essays of Essential reading, in the listed order. They give the vocabulary the rest of the field uses: workflows and agents, [[context-engineering]], tool design, skills and [[evals]]." },
            { t: "Weeks 3 and 4", d: "Take one free course with code. The Hugging Face course plans about three to four hours of work a week, one chapter a week; Microsoft's course has 18 lessons as Python notebooks." },
            { t: "Week 5 and later", d: "Go deeper where your work needs it: the long talks for how models are trained, a book for a complete picture, the papers for where the ideas came from." }
          ],
          callout: { t: "Only one hour?", d: "Watch the eight-minute 3Blue1Brown primer, read Building effective agents, and watch Andrew Ng's 14-minute talk on agentic design patterns. Skip the books, the papers and the long talks for now: they explain how models work inside, which you do not need in order to start building." },
          src: [1, 2, 3, 4, 5]
        },
        {
          id: "watch-start",
          title: "Watch: start here",
          short: "Five short talks that explain what a language model is and what turns one into an agent. No background is needed.",
          text: [
            "This group gives you the picture before the details. Start with 3Blue1Brown's eight-minute primer: it shows a model as a machine that predicts the next [[token]], the small piece of text it works in, and how [[pre-training]] on vast amounts of text and then [[rlhf|training on human feedback]] turn it into an assistant. Andrej Karpathy's one-hour talk covers the same ground more slowly and adds what matters for agents: tool use, the model as the core of a new kind of operating system, and security.",
            "The other three talks are about agents. Karpathy's Software Is Changing (Again) describes applications with partial autonomy, where the person can adjust how much the model does on its own. Andrew Ng's talk names four design patterns (reflection, tool use, planning and multi-agent collaboration) that recur across the whole field. IBM's explainer places agents in the move from single models to compound systems that reason and act. Level: beginner throughout. Anything that stays unclear comes back in the next groups. If you watch only two, take the 3Blue1Brown primer for the model and Andrew Ng's talk for the agent; together they take under half an hour."
          ],
          reading: "Watch: start here",
          src: [1, 6, 7, 3]
        },
        {
          id: "watch-deeper",
          title: "Watch: go deeper",
          short: "Longer talks for a second pass: how models are trained and how the transformer works inside, then how engineers who build agents for a living approach the work.",
          text: [
            "Two kinds of talk sit here. Karpathy's Deep Dive into LLMs, about three and a half hours, follows the full training stack for a general audience, from pre-training to fine-tuning and reinforcement learning, and explains [[hallucination|hallucinations]] and tool use from that angle. The two 3Blue1Brown chapters build up the [[transformer]] and [[attention]] visually, step by step. Watch them to understand why the model processes its whole input on every step, which is the root of most context costs; skip them if you only want to build.",
            "The two talks by Anthropic engineers are short and practical. Tips for building AI agents covers the difference between agents and [[workflow|workflows]], the anatomy of an agent prompt and common pitfalls; Barry Zhang's talk argues for keeping agents simple and for thinking from the agent's point of view, with only what it can see in its context. Watch them straight after the essay Building effective agents, which comes from the same authors. Level: intermediate; the transformer chapters help most if you remember a little linear algebra, but they explain as they go."
          ],
          reading: "Watch: go deeper",
          src: [8, 9, 2]
        },
        {
          id: "courses",
          title: "Free courses",
          short: "Free courses that make you build: write a small agent, give it tools, then trace and test it. Most of them assume basic Python.",
          text: [
            "Reading about agents is not the same as debugging one, so take at least one course here. The Hugging Face AI Agents Course starts with agent fundamentals (tools, thoughts, actions and observations, the cycle behind the [[react|ReAct]] pattern), then implements them in three frameworks: smolagents, LlamaIndex and LangGraph. It plans three to four hours of work a week, assumes basic Python and some idea of language models, and offers free certificates. Microsoft's AI Agents for Beginners has 18 lessons with Python notebooks, from design patterns to [[mcp|MCP]], memory, computer use and security; its samples use Microsoft's own agent framework and an Azure account.",
            "The other three fill gaps. Evaluating AI Agents (DeepLearning.AI with Arize) teaches you to record a [[trace]] of a run and grade both its steps and its result, including with an [[llm-as-judge|LLM as judge]]. Claude Academy's Introduction to agent skills shows how to write and share [[skills]] and how they compare with sub-agents, hooks and MCP. Andrew Ng's Agentic AI course, free to audit, works through the four patterns from his talk plus evaluation, at an intermediate level. Order: one of the first two, then evaluation, then the rest as needed.",
            "Whichever course you take, build its exercises around a task you care about rather than the sample task, and keep a log of what went wrong. The failures you record (a wrong tool chosen, a loop that never stops, a result too long for the context) become your first evaluation set, which is exactly where the evaluation course and the essays start."
          ],
          reading: "Free courses",
          src: [4, 5, 10]
        },
        {
          id: "essential",
          title: "Essential reading",
          short: "Five essays from Anthropic's engineering team that practitioners cite more than anything else. They are short, free and the best value on this page.",
          text: [
            "If you read only one group, read this one, in this order. Building effective agents (2024) separates workflows, where code fixes the path, from agents, which choose their own steps, and names five patterns: prompt chaining, routing, parallelisation, orchestrator-workers and evaluator-optimizer. Its main advice, to start with the simplest design and add complexity only when it measurably helps, runs through every guide on this site. Effective context engineering treats the [[context|context window]] as a finite budget and explains compaction, structured notes, sub-agents and loading information just in time.",
            "The next three are narrower. Writing effective tools explains how to design and test tools so that a model uses them well. Equipping agents with Agent Skills describes skills as folders of instructions and scripts, loaded through progressive disclosure. Demystifying evals for AI agents covers code, model and human graders, the difference between [[pass-at-k|pass@k]] (at least one of k tries succeeds) and pass^k (all k succeed), and why 20 to 50 tasks drawn from real failures are enough to start. Level: beginner to intermediate; no code is needed to follow them, though they make more sense after one course."
          ],
          reading: "Essential reading",
          src: [2, 11, 12]
        },
        {
          id: "books",
          title: "Books",
          short: "Books give a complete, ordered picture, from building applications on top of existing models to coding a model or an agent yourself from scratch.",
          text: [
            "Books are slower than essays but connect the pieces. For people who build products, Chip Huyen's AI Engineering is the one to start with: evaluation, retrieval ([[rag]]), agents, [[fine-tuning]] and deployment, all on top of existing [[foundation-model|foundation models]]. Hands-On Large Language Models by Jay Alammar and Maarten Grootendorst is a richly illustrated, practical tour of tokens, embeddings, prompting, retrieval and fine-tuning, with code.",
            "The two from-scratch books are for readers who learn by writing code. Sebastian Raschka's builds a GPT-style model step by step, from attention to pre-training and fine-tuning. Build an AI Agent (From Scratch) does the same for an agent in Python without a framework: the loop, context, tools, memory, planning and evaluation. Russell and Norvig's Artificial Intelligence: A Modern Approach is the standard university textbook, organised around rational agents; read it for the older, broader meaning of the word agent, not for language models. Level: the from-scratch books assume working Python; the textbook assumes university mathematics. You need at most two: one for building on top of models, and one from-scratch book if you want to see every moving part of a model or an agent with your own eyes."
          ],
          reading: "Books",
          src: [13, 14]
        },
        {
          id: "research",
          title: "The research behind it",
          short: "Five papers, in order of publication, that introduced the ideas behind today's agents. Read the abstract and the first figure first, and the whole paper only when you need the detail.",
          text: [
            "Each paper here started a line of work the field still follows. Attention Is All You Need (2017) introduced the [[transformer]], the architecture of today's language models. The original retrieval-augmented generation paper (2020) paired a retriever with a generator so that answers rest on fetched passages. [[chain-of-thought|Chain-of-thought prompting]] (2022) showed that asking for intermediate steps improves multi-step reasoning. InstructGPT (2022) showed how training on human feedback turns a pre-trained model into one that follows instructions. ReAct (2022) interleaved reasoning with tool actions, which became the template for the [[agent-loop|agent loop]].",
            "Read them in three passes: the abstract, the first figure and the conclusion; then the method; then the experiments, only if you need to judge a claim. For a practitioner the main idea of each fits on a page. ReAct is the one to read in full if you build agents, because its worked examples show the thought, action and observation steps directly. Level: intermediate to advanced; the transformer and InstructGPT papers assume some machine learning, the others are readable with a general technical background. Remember their age: every one of them predates the models you use today, so treat the numbers in their tables as history and the ideas as the part that lasts."
          ],
          reading: "The research behind it",
          src: [16, 15]
        },
        {
          id: "keep-up",
          title: "How to keep up with the field",
          short: "The field changes month by month. Follow the primary sources (specifications, changelogs, vendor documentation and evaluation results) rather than summaries, and check every claim for its date.",
          text: [
            "Most news about agents is second-hand. The fastest reliable route is to the documents that define things. Specifications have changelogs: the [[mcp|MCP]] specification publishes the key changes of each dated revision (the current one is 2026-07-28), the [[a2a|A2A]] specification carries a version number (latest release 1.0.0, October 2026), and the Agent Skills format has a short public specification. When a post says that a protocol now supports something, the changelog tells you whether it is in the core, an optional extension or only a proposal.",
            "Vendor documentation and engineering blogs come second. The release notes of the harness you use tell you when a feature changed its name or behaviour; slash commands being merged into skills is one recent case. Read engineering posts for their numbers and the conditions behind them: who measured, on which tasks, against which baseline.",
            "For claims about capability, look at evaluations rather than announcements. SWE-bench Verified is 500 coding tasks checked by human annotators. METR's time-horizon page reports the length of task, in expert human time, that frontier models complete half the time; it says it is no longer actively updated (last updated 8 September 2026). Public [[benchmark|benchmarks]] age, and test items can leak into training data ([[benchmark-contamination]]), so the most useful evaluation is your own: 20 to 50 real tasks with clear pass criteria, run with an open-source framework such as Inspect, developed by the UK AI Security Institute and Meridian Labs, whenever a model or prompt changes.",
            "A few careful writers save time. Simon Willison's blog tries out new releases and tags its posts by topic, such as prompt injection. Whatever you read, note the month: in this field a fact without a date is a fact you cannot use.",
            "A routine that works: once a month, read the changelog of every specification you depend on and the release notes of your harness. Once a quarter, run your own evaluation set again on the current models, because a newer model can be better on average and worse on your tasks. And when a claim matters for a decision, open the primary source it cites before acting on it; summaries drop the conditions, and the conditions are usually where the claim stops being true."
          ],
          src: [17, 18, 19, 24, 20, 21, 22, 12, 23]
        }
      ],
      terms: ["agent", "model", "transformer", "attention", "react", "agent-loop", "rag", "chain-of-thought", "rlhf", "context-engineering", "evals", "pass-at-k", "benchmark", "benchmark-contamination", "mcp", "a2a", "skills"],
      sources: [
        "https://www.youtube.com/watch?v=LPZh9BOjkQs",
        "https://www.anthropic.com/engineering/building-effective-agents",
        "https://www.youtube.com/watch?v=sal78ACtGTc",
        "https://huggingface.co/learn/agents-course/unit0/introduction",
        "https://github.com/microsoft/ai-agents-for-beginners",
        "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        "https://www.youtube.com/watch?v=LCEmiRjPEtQ",
        "https://www.youtube.com/watch?v=7xTGNNLPyMI",
        "https://www.youtube.com/watch?v=LP5OCa20Zpg",
        "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
        "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        "https://huyenchip.com/books/",
        "https://www.manning.com/books/build-an-ai-agent-from-scratch",
        "https://arxiv.org/abs/2210.03629",
        "https://arxiv.org/abs/1706.03762",
        "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
        "https://a2a-protocol.org/latest/specification/",
        "https://agentskills.io/specification",
        "https://www.swebench.com/verified.html",
        "https://metr.org/time-horizons/",
        "https://inspect.aisi.org.uk/",
        "https://simonwillison.net/tags/prompt-injection/",
        "https://code.claude.com/docs/en/skills"
      ]
    }
  });
})(window.AE3);
