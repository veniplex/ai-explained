/* AI explained (v17): guides in the technical voice, part c: building an agent, step by step. Plain words, mechanism first, no analogy.
   The views (ladder, twelve steps, patterns, example routes, protocols, checklist) draw the data of guides.js (AE3.guides.build); the sections here explain them. */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var T = AE3.tech = AE3.tech || {};
  T.longGuides = T.longGuides || {};
  Object.assign(T.longGuides, {

    build: {
      lede: "How experienced teams build agents in 2026: start on the lowest rung that could work, climb only when tests show you must, and give the model good tools, firm limits and checks it cannot argue its way past.",
      audience: "For anyone who wants to build an agent, or to decide whether they need one. Most parts need no programming; the two code samples are short and explained line by line. The guide on how an agent works is useful background but not required.",
      expect: [
        "Which level of complexity a task really needs, and the evidence that justifies the next one",
        "The twelve steps from a written definition of done to a traced, evaluated agent",
        "The named patterns between a fixed workflow and a team of agents, and how each one fails",
        "How to design tools a model uses well, and a first loop of about 25 lines with firm limits",
        "Which open protocols to adopt now, and what to check before launch"
      ],
      minutes: 24,
      sections: [
        {
          id: "ladder",
          title: "Start on the lowest rung that could work",
          short: "Systems built on language models come in levels of growing freedom, from one model call to teams of agents. Each level up costs more and is harder to predict, so begin at the bottom and climb only for a reason.",
          text: [
            "The ladder below has six rungs, numbered 0 to 5. Each rung gives the model one more kind of freedom: access to facts and actions through [[tools]] and retrieval (rung 1), several calls in an order your code fixes (rung 2, a [[workflow]]), the choice of its own next step inside an [[agent-loop|agent loop]] (rung 3), the power to hand focused jobs to [[sub-agent|sub-agents]] with their own context (rung 4), and finally many agents working for long periods (rung 5). Every card names the rung, says what it is and ends with **Climb when**: the specific failure that justifies the next rung. Read it as a decision procedure, not as a maturity scale. A team on rung 2 is not behind a team on rung 4. It has a problem whose steps are known.",
            "The reason to start low is arithmetic. Every rung trades predictability, delay and money for flexibility. Anthropic measured that an agent uses about four times the [[token|tokens]] of a chat, and a system of several agents about fifteen times (June 2025). Errors also compound: if each step is right 95 per cent of the time, a run of ten steps is right only about 60 per cent of the time. The more steps the model chooses for itself, the more places there are to go wrong, and the harder the system is to test, because the path differs from run to run. Anthropic's advice is to find the simplest solution possible and to add complexity only when it is needed.",
            "Climb only when your test examples fail for a reason the next rung fixes. The model does not know today's fares: add a tool (rung 1). An outline must be checked before the article is written: chain two calls with a check between them (rung 2). Nobody can say in advance which files a change touches: let the model choose its steps (rung 3). Exploration floods the context: give the searching to sub-agents (rung 4). Fashion and a good demo are not reasons. A Google Research study of 180 agent configurations (January 2026) found that a centrally coordinated team improved a parallelisable finance task by about 81 per cent, while every multi-agent setup it tested made a strictly sequential planning task 39 to 70 per cent worse. OpenAI's practical guide gives the same order: get the most out of a single agent first."
          ],
          view: "ladder",
          callout: { t: "Where the names come from", d: "The rungs and the pattern names follow Anthropic's [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (December 2024) and its write-up of a multi-agent research system (June 2025). Other vendors use other words for the same shapes." },
          example: "For the Lisbon trip, rung 0 invents three plausible flights. Rung 1, with a flight search tool and a spreadsheet tool, is enough when one search and one write do the job. The task belongs on rung 3 only if results regularly force a change of plan: the cheapest date is sold out, the budget is exceeded, and the model must decide on its own to try neighbouring dates or another airport.",
          src: [1, 2, 5, 6]
        },
        {
          id: "twelve-steps",
          title: "Twelve steps to a reliable agent",
          short: "The steps experienced teams follow, in order: write down what done means, start simple, reuse an existing program around the model, then add tools, rules, checks and people where they matter.",
          text: [
            "The list below is the whole method on one page. Each step has a short instruction and links to the main terms it involves. The steps fall into three groups. Steps 1 to 4 decide what to build: the task, the rung, the [[harness]] (the program that runs the loop around the model) and the models. Steps 5 to 9 shape what the model sees and may do: the instruction file, the tools, the [[skills]], the rules enforced in code, and the [[context]]. Steps 10 to 12 keep it reliable over time: verification, human gates, and the cycle of observing and improving. The order matters, because every later decision is tested against what step 1 produces.",
            "Step 1 is the set of [[evals|evaluation tasks]]. Each task has an input, the expected outcome and a grader: a code check (the sheet has three rows, each under budget), a model grading against a written rubric, or a person. Twenty to fifty tasks are a good start: Anthropic's eval guide (January 2026) says that 20 to 50 simple tasks drawn from real failures are enough early on, and its research team began with about 20 queries drawn from real use. The guide also advises grading what the agent produced rather than the exact path it took, and reading the transcripts of failed runs.",
            "Steps 3 to 5 are where teams lose most time by building too much. An [[agent-sdk|agent SDK]] or an existing coding agent already handles streaming, retries, [[compaction]] and permissions, and a home-made loop is rarely what limits quality. For models, OpenAI suggests prototyping with the most capable model on every step to set a baseline, then replacing it with smaller ones where the evals still pass. For the instruction file, short and specific wins: a February 2026 study found that repository context files did not generally raise task success but raised inference cost by over 20 per cent on average. Agents followed the instructions in the files, but repository overviews did not help.",
            "Steps 8 to 12 turn a demo into a system. Rules that must never be broken belong in code: [[permissions]] (what the agent may do without asking), [[hooks]] (your scripts that run before or after each tool call) and a [[sandbox]] (an isolated environment). Before a run combines private data, untrusted input and a way to send data out, the [[lethal-trifecta|lethal trifecta]], add a human gate; Meta's Rule of Two (October 2025) says an agent should satisfy no more than two of these in one session: processing untrustworthy inputs, access to sensitive systems or private data, and the ability to change state or communicate externally. Then make \"done\" depend on a check outside the model, put people where actions cannot be undone, and trace every run."
          ],
          view: "recipe",
          callout: { t: "The most common mistake", d: "Skipping step 1. Without a written set of tasks and graders, every later change, from a new model to a reworded instruction, is judged by impression, and a fix for one case silently breaks three others." },
          src: [1, 2, 5, 7, 17, 18, 19]
        },
        {
          id: "patterns",
          title: "Workflows, agents and the patterns between them",
          short: "A workflow runs steps your code fixed in advance; an agent picks its own next step. Between the two sit a handful of named patterns, each a known shape you can copy and test.",
          text: [
            "Anthropic draws the line this way: workflows are systems in which models and tools are orchestrated through predefined code paths; agents are systems in which the model dynamically directs its own process and tool use. The practical question is who decides the next step, your code or the model. When code decides, every path can be listed and tested. When the model decides, you test outcomes and rely on limits and checks for the rest.",
            "Each card below shows one pattern: a hand-drawn diagram (model calls as boxes, inputs and outputs as ovals, checks and people marked by colour, a dashed arrow for a path that may or may not be taken), its kind, what it does, when to use it and an example. The three meters rate autonomy, cost and predictability from 1 to 5. They are editorial ratings that compare the patterns with each other, not measurements. The cards are ordered by autonomy, and predictability falls as autonomy rises.",
            "To choose, go down the list and stop at the first card that fits. [[prompt-chaining|Prompt chaining]] when the steps are known and a check between them catches errors early. [[routing|Routing]] when inputs fall into clear categories, including the cheap trick of sending easy questions to a small model. [[parallelization|Parallelization]] when parts are independent (sectioning) or several attempts raise confidence (voting). [[orchestrator-workers|Orchestrator-workers]] when the sub-tasks only become clear at run time. [[evaluator-optimizer|Evaluator-optimizer]] when quality criteria are explicit and a second pass measurably helps. An autonomous agent, the [[react|ReAct]] loop of reasoning and acting, when the steps cannot be predicted and the environment gives reliable feedback such as tests. A [[multi-agent-system|team of agents]] last.",
            "Each pattern fails in its own way. A chain without a check passes errors along silently. A router that misclassifies sends a request down the wrong path, so log its decisions and give it a fallback path to a person. Parallel branches can disagree, and the step that merges them must say how conflicts are settled. An orchestrator can over-delegate: early versions of Anthropic's research system spawned 50 sub-agents for simple queries until scaling rules in the prompts said how many to use for which kind of query. An evaluator that is the same model as the generator shares its blind spots, so cap the iterations. Teams multiply errors: in the Google study, independent agents amplified errors 17.2 times, central coordination 4.4 times. Cognition argues for this reason that agents which do not share context make conflicting decisions."
          ],
          view: "patterns",
          src: [1, 2, 5, 6, 22, 25]
        },
        {
          id: "tool-design",
          title: "Designing tools the model can use",
          short: "A tool is a function the model can ask your program to run. Its name, its description and the shape of its inputs are all the model knows about it, so they decide whether it is used well.",
          text: [
            "The model sees a tool only as a name, a description and a [[tool-schema|schema]], a JSON Schema that lists the inputs, their types and which are required. It asks for a call by emitting structured output that fills in those inputs, a mechanism called [[function-calling]], and your code runs it. Anthropic calls this layer the agent-computer interface and reports that on the SWE-bench coding benchmark it spent more time improving the tools than the overall prompt. OpenAI's guide sorts tools into three kinds: data tools that read (search, query), action tools that change something (send, write, book) and orchestration tools, which are other agents called as tools. The action tools are where risk, approval and idempotency matter.",
            "Design tools around tasks, not around the endpoints of an existing API. Anthropic's examples: one `schedule_event` instead of `list_users`, `list_events` and `create_event`; `search_logs` instead of `read_logs`. When several servers are connected, prefixes such as `jira_search` and `asana_search` keep similar tools apart. Overlap hurts more than number: OpenAI notes that some agents handle more than 15 distinct tools while others struggle with fewer than 10 overlapping ones. Definitions also cost tokens on every call. Anthropic measured five servers with 58 tools at about 55,000 tokens before the conversation started; [[tool-search|tool search]], which loads a definition only when the model looks for it, cut that by about 85 per cent (November 2025).",
            "Make wrong calls hard to express. Use [[structured-output|strict schemas]] with enums for closed sets, required fields, fixed formats such as ISO dates and airport codes, and absolute file paths: Anthropic changed a tool to require them after the model kept making mistakes with relative ones. Return only what the next step needs, with readable names rather than opaque ids, and paginate, filter or truncate large results. Claude Code restricts a tool result to 25,000 tokens by default (September 2025). An optional `response_format` input with the values `concise` and `detailed` lets the model choose; in Anthropic's example the concise answer took 72 tokens and the detailed one 206.",
            "An error is just another tool result, and the model reads it as input. \"Error 400\" teaches it nothing, and a stack trace wastes tokens and may leak internals. A good error says what was wrong, what valid input looks like and what to try next, so the next call can succeed. Mark it as an error (most APIs have a flag for this), so the harness can count failures.",
            "Agents retry: after a timeout the model may call the same tool again, and a harness with [[durable-execution|durable execution]] may replay a step after a crash. A tool is **idempotent** when calling it twice has the same effect as calling it once. Reads usually are; writes need help. The common mechanism is an idempotency key: the caller sends a unique key per logical operation, and the server stores the first result and returns it for every repeat. Stripe's v1 API, for example, may remove keys once they are at least 24 hours old, returns the saved response to a retry with the same key, and returns an error if the same key arrives with different parameters. Where no key exists, prefer an upsert keyed by a natural id over an append."
          ],
          code: {
            label: "Illustrative: a task-shaped write tool, and an error the model can act on",
            text: [
              "{ \"name\": \"sheet_upsert_flight\",",
              "  \"description\": \"Add or update one flight in the trip sheet. Rows are keyed by offer_id, so calling twice with the same offer_id changes nothing. Use after search_flights.\",",
              "  \"input_schema\": { \"type\": \"object\",",
              "    \"properties\": {",
              "      \"offer_id\":  { \"type\": \"string\", \"description\": \"The id returned by search_flights\" },",
              "      \"date\":      { \"type\": \"string\", \"format\": \"date\" },",
              "      \"price_eur\": { \"type\": \"number\", \"minimum\": 0 },",
              "      \"cabin\":     { \"type\": \"string\", \"enum\": [\"economy\", \"premium\", \"business\"] } },",
              "    \"required\": [\"offer_id\", \"date\", \"price_eur\"] } }",
              "",
              "// A tool result marked as an error, written for the model to act on",
              "{ \"type\": \"tool_result\", \"tool_use_id\": \"call_7\", \"is_error\": true,",
              "  \"content\": \"Offer F12 has expired (offers last 30 minutes). Call search_flights again for 2026-05-03 and use a new offer_id.\" }"
            ].join("\n")
          },
          example: "For the Lisbon trip, the spreadsheet tool first appended a row on every call. After a timeout the model called it again and the sheet held four flights instead of three. Keying rows by the offer id made the repeat harmless, and the run passed the eval check that the sheet holds exactly three rows.",
          src: [1, 2, 3, 4, 10, 11, 12]
        },
        {
          id: "first-version",
          title: "The first working version",
          short: "The core of an agent is a short loop: ask the model, run the tool it asks for, give it the result, repeat. A first version fits in about 25 lines, as long as it has firm limits.",
          text: [
            "Even if you will use a harness, writing the loop once shows what the harness does for you and where to look when it misbehaves. Agent SDKs run the same cycle. OpenAI's Agents SDK documents it plainly: call the model; if the reply is final output with no tool calls, stop; if it asks for a handoff to another agent, switch; if it asks for tools, run them, append the results and go round again; if the number of turns exceeds `max_turns`, raise `MaxTurnsExceeded`. The pattern goes back to ReAct (2022), which interleaved reasoning with actions.",
            "The sample below is illustrative pseudocode in a Python style, for one provider's message format. It has four exits, and only the first is the normal one: the model answers in plain text, the [[stop-condition|step limit]] is reached, the [[token-budget|token budget]] is spent, or tools fail three times in a row. The last three hand the run to a person with the full history. Anthropic notes that stopping conditions such as a maximum number of iterations are what keep an agent under control, and OpenAI's guide adds that repeated failures and high-risk actions are the two classic reasons to bring in a person.",
            "What the sample leaves out is exactly what a harness adds: streaming output, parallel execution of independent calls, retries with back-off on [[rate-limit|rate limits]], a permission check before each action (it would sit on line 17), compaction when the history grows long, and a [[trace]] of every call. When you need more than two of these, stop extending your own loop and move to an SDK. That is step 3 of the twelve."
          ],
          code: {
            label: "Illustrative: a minimal agent loop with a step limit, a budget and a stop condition (25 lines)",
            text: [
              "MAX_STEPS = 20                                   # 1",
              "MAX_TOKENS = 200_000                             # 2",
              "TOOLS = {\"search_flights\": search_flights, \"sheet_upsert_flight\": sheet_upsert_flight}",
              "",
              "def run(task):                                   # 5",
              "    messages = [{\"role\": \"user\", \"content\": task}]",
              "    used, failures = 0, 0",
              "    for step in range(MAX_STEPS):",
              "        reply = model.create(system=SYSTEM, tools=schemas(TOOLS), messages=messages)",
              "        used += reply.usage.total_tokens         # 10",
              "        messages.append(reply.as_message())",
              "        if reply.stop_reason != \"tool_use\":",
              "            return reply.text                    # normal stop: the answer",
              "        results = []",
              "        for call in reply.tool_calls:            # 15",
              "            if call.name in TOOLS and valid(call):",
              "                out, ok = TOOLS[call.name](**call.input)",
              "            else:",
              "                out, ok = \"Unknown tool or invalid input: \" + call.name, False",
              "            failures = 0 if ok else failures + 1  # 20",
              "            results.append(tool_result(call.id, out, is_error=not ok))",
              "        messages.append({\"role\": \"user\", \"content\": results})",
              "        if used > MAX_TOKENS or failures >= 3:",
              "            return escalate(task, messages, \"budget spent or repeated errors\")",
              "    return escalate(task, messages, \"step limit reached\")  # 25"
            ].join("\n")
          },
          steps: [
            { t: "Lines 1 to 3: the limits and the tools", d: "The step limit and the token budget are constants in code, not wishes in the prompt. The tool table maps each name the model may use to a real function; a name not in the table can never run." },
            { t: "Lines 5 to 7: the state", d: "The whole state of the run is the message list plus two numbers. The model keeps nothing between calls, so this list is resent in full every time." },
            { t: "Lines 8 to 11: one turn", d: "Each pass sends the system prompt, the tool schemas and the history, adds the tokens used, and appends the reply, including any tool calls, to the history." },
            { t: "Lines 12 and 13: the normal stop", d: "If the model did not ask for a tool, it has answered, and the loop returns the text. The stop reason is read from the reply, never guessed from its wording." },
            { t: "Lines 14 to 19: run the calls", d: "Each call is checked against the table and its schema before it runs. An unknown tool or invalid input becomes an error result instead of a crash, so the model can correct itself." },
            { t: "Lines 20 to 22: report back", d: "Consecutive failures are counted and reset on success. Every result carries the id of its call and an error flag, and all results of one turn go back in one message." },
            { t: "Lines 23 to 25: the other exits", d: "A spent budget, three failures in a row or the end of the step limit hand the run and its history to a person instead of letting it continue or fail silently." }
          ],
          example: "Traced on the Lisbon task, such a loop needs a handful of turns: a search, a second search after sold-out dates, the upserts (several calls can go in one turn) and a final answer. Add an eval case where the flight search is switched off: the loop should hit three failures in a row and escalate with a clear reason instead of inventing fares.",
          src: [1, 2, 8, 9, 10, 22]
        },
        {
          id: "routes",
          title: "Four example routes",
          short: "Four common kinds of jobs, each traced from the event that starts it to the check that closes it, showing which building blocks it uses and why the design holds.",
          text: [
            "Each card names a job and its goal, then shows the route of a run from left to right. Every stop links to a main term, and the small note under it says what happens there. The last line explains why the design works. Look at where the checks in code sit (hooks, tests, schema validation), where a person approves something, and where the run leaves a trace.",
            "The four cases cover different rungs. Fixing a bug from an issue is one agent in a harness (rung 3) made safe by tests it cannot argue with and a human review of the pull request. For long jobs of this kind Anthropic's harness keeps a progress file and commits to version control, so a fresh context window can pick up the work (November 2025). The research report is rung 4: parallel sub-agents keep the lead's context small, at about fifteen times the tokens of a chat, and on Anthropic's browsing evaluation token usage alone explained 80 per cent of the variance in performance. Support triage is a workflow with one step that uses the model freely, cheaper and more predictable than a free agent, with refunds behind approval. The weekly report is a scheduled [[background|background job]]: a skill fixes the format and code computes the numbers.",
            "Before writing code for your own job, draw its route the same way: the trigger, the instructions and context it loads, the loop, the tools, the checks in code, the human gate and the trace. If you cannot name the check that proves the job is done, the job is not ready for an agent. Then test the route against the lethal trifecta. Support triage reads untrusted ticket text, can see private customer records and can send replies, so it holds all three and needs a gate, which is why sensitive actions such as refunds wait for approval."
          ],
          view: "flows",
          src: [2, 5, 7, 18, 20]
        },
        {
          id: "protocols",
          title: "Open protocols and standards",
          short: "Protocols are shared agreements on message formats, so an agent built by one company can use tools, other agents or user interfaces built by another without custom glue code.",
          text: [
            "The table groups the protocols by what they connect: agents with tools and context, agents with user interfaces, agents with observability tools, and agents with payment systems. For each it gives the origin, who governs it now and its status at the snapshot, with numbered links to the sources in the last column. Status changes quickly in this area, so every claim carries a date.",
            "Three of them matter for a first build. [[mcp|MCP]] connects an agent to tools and data: an [[mcp-server|MCP server]] lists its tools and runs them on request over [[json-rpc|JSON-RPC]]. Its revision of 28 July 2026 made the core stateless. Use it when a tool is shared by several agents or provided by someone else; for one function inside your own program, plain function calling is simpler. [[agents-md|AGENTS.md]] is a plain Markdown file of instructions in a repository; the nearest file in the folder tree wins. [[skills|Agent Skills]] are folders with a `SKILL.md` whose only required fields are a name and a description; the agent loads the rest only when a task matches the description.",
            "[[a2a|A2A]] connects one agent with another, across vendors and organisations. Each agent publishes an [[agent-card|Agent Card]] that describes what it can do and how to reach it, and version 1.0 (March 2026) signs those cards. MCP gives an agent tools; A2A lets it delegate to another agent it does not control. You need it only at the top rung, when work crosses team or company lines. The OpenTelemetry conventions for generative AI define standard spans for model calls, agent steps and tool calls; they are still marked as in development (October 2026), so pin the version you use. The payment protocols are young and best treated as experimental.",
            "Every server, skill or plugin you connect is code that runs with your credentials. A tool description can carry hidden instructions, which is called [[tool-poisoning|tool poisoning]], and a server can change after you approved it. Review third-party servers and skills before use, pin their versions, give each one the [[least-privilege|least privilege]] it needs, and re-review on update. The checklist below asks for exactly this."
          ],
          view: "protocols",
          src: [13, 14, 15, 16, 21, 24]
        },
        {
          id: "checklist",
          title: "The pre-launch checklist",
          short: "Sixteen statements that should all be true before an agent works for real users or runs without supervision. Each one maps to a step earlier in this guide.",
          text: [
            "Tick the boxes as you go. The ticks are stored only in your own browser and nowhere else, and **Clear all** resets them. The items follow the order of the twelve steps, from the written task to a named owner. The list is not a certification. Each box left empty is a known risk, and launching anyway should be an explicit decision by the person who owns the agent.",
            "Three items are skipped most often. Limits on turns, time and spend for runs nobody watches: without them a confused agent keeps paying for its own confusion. The trifecta item: one job that reads untrusted text, holds private data and can send messages is the combination behind the prompt-injection data leaks that Simon Willison has collected. And the human gate itself, which only works if it is rare. Anthropic reports that Claude Code users approve 93 per cent of permission prompts (March 2026), which it presents as a sign of approval fatigue. Reserve prompts for irreversible or costly actions and use the sandbox, allowlists and hooks for the rest.",
            "After launch the checklist turns into a routine. Trace every run (tokens, cost, tool calls, errors), read a sample of failures every week, turn each new failure into an eval task so it cannot return unnoticed, and re-run the whole set before changing the model, the instructions or a tool. Watch cost per successful task rather than cost per run: a cheaper model that needs three attempts is not cheaper."
          ],
          view: "checklist",
          src: [2, 7, 18, 19, 23, 26]
        }
      ],
      terms: ["agent-loop", "workflow", "harness", "evals", "tools", "tool-schema", "tool-search", "stop-condition", "orchestrator-workers", "multi-agent-system", "mcp", "a2a", "agents-md", "skills", "permissions", "hooks", "sandbox", "lethal-trifecta"],
      sources: [
        "https://www.anthropic.com/engineering/building-effective-agents",
        "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
        "https://www.anthropic.com/engineering/writing-tools-for-agents",
        "https://www.anthropic.com/engineering/advanced-tool-use",
        "https://www.anthropic.com/engineering/multi-agent-research-system",
        "https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/",
        "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        "https://code.claude.com/docs/en/agent-sdk/agent-loop",
        "https://openai.github.io/openai-agents-python/running_agents/",
        "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
        "https://developers.openai.com/api/docs/guides/structured-outputs",
        { type: "docs", title: "Idempotent requests", by: "Stripe API reference", url: "https://docs.stripe.com/api/idempotent_requests", year: 2026 },
        "https://modelcontextprotocol.io/specification/2026-07-28",
        "https://a2a-protocol.org/latest/specification/",
        "https://agents.md/",
        "https://agentskills.io/specification",
        "https://arxiv.org/abs/2602.11988",
        "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
        "https://ai.meta.com/blog/practical-ai-agent-security/",
        "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        { type: "docs", title: "Semantic Conventions for Generative AI (GenAI)", by: "OpenTelemetry project (GitHub repository)", url: "https://github.com/open-telemetry/semantic-conventions-genai", year: 2026 },
        "https://arxiv.org/abs/2210.03629",
        "https://www.anthropic.com/engineering/claude-code-auto-mode",
        "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
        "https://cognition.ai/blog/dont-build-multi-agents",
        "https://code.claude.com/docs/en/permissions"
      ]
    }

  });
})(window.AE3);
