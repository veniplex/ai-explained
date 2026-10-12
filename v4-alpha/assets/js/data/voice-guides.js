/* Agentic AI, Explained (v4): the guides in both voices (kitchen glossary, "easily confused", the build ladder, and the technical ledes). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};
  var T = AE3.tech = AE3.tech || {};

  K.glossary = K.glossary || {};
  Object.assign(K.glossary, {
    "A2A (Agent2Agent)": "A shared standard for how the head chefs of two different restaurants introduce themselves, hand each other orders and report back, whatever kitchens they run.",
    "Agent": "A chef with a counter, tools and a tasting loop: the chef picks each next step, uses the tools and tastes the result until the dish is right.",
    "Agent loop": "Taste, adjust, taste again: the chef plans a step, uses a tool, looks at the result and decides the next step, until the dish is right.",
    "Agent teams": "A brigade of full chefs under one head chef, sharing a list of jobs and talking to each other, unlike helpers who only hand a finished bowl back to whoever asked.",
    "Agentic AI": "The name for kitchens where the chef does more than answer questions: it plans, picks its own steps and takes real actions to get the order done.",
    "Agentic AI Foundation (AAIF)": "A neutral trade body, formed in December 2025, that looks after shared standards many kitchens use, such as the standard plug, the house-rules sheet and the head-chef handover.",
    "Agentic RAG": "The chef decides when to reach for the cookbook shelf or the phone to the market, what to ask, and asks again in new words if an answer falls short.",
    "Agentic search": "The chef finds facts like a cook rummaging: opening drawers, reading labels, phoning the market, one step at a time, instead of using a ready-made index of the shelf.",
    "AGENTS.md": "A shared house-rules sheet for chefs who work on the kitchen's own written procedures, always kept in the same place, so any such chef finds and reads the same rules.",
    "Background agent": "A chef on the night shift who works away from the owner and leaves a finished result, ready for the owner to check and approve in the morning.",
    "Benchmark": "A public set of standard test dishes that many different chefs are all asked to cook, so their results can be compared fairly.",
    "Chain of thought": "The planning notes the chef writes on the counter, step by step, before serving the final answer.",
    "Coding agent": "A chef who specialises in the kitchen's own written procedures: reads them, edits them, runs trial batches and hands back a proposed change for the owner to approve.",
    "Compaction": "When the counter fills up, the chef tidies it: older orders and notes are swapped for a short summary, so a long shift can carry on.",
    "Computer use": "The chef works a till or oven panel built for human hands: it looks at a photograph of the display, then says where to press and what to type.",
    "Connector": "A ready-made plug that links the chef to one outside supplier, such as the market, the diary or the customer book, using the standard plug.",
    "Context engineering": "Choosing with care everything that lies on the counter at each step: house rules, tools, looked-up facts, earlier notes and results, so nothing useless crowds it.",
    "Context rot": "The chef grows sloppier as the counter fills with more and messier clutter, so the notes that matter are harder to find and follow.",
    "Context window": "The size of the counter: the most the chef can have in front of it at once for one order, including the chef's own reply.",
    "Deep research": "A long shift in which the chef phones many markets, reads many sources and, step by step, writes up one report with every claim traced to its source.",
    "Effort": "A dial on the order ticket that tells the chef how long to stop and plan before cooking. More planning gives better results and a bigger bill.",
    "Embedding": "A label made of numbers that captures what a passage means, so the chef can find cookbook pages that mean the same thing without matching the exact words.",
    "Evals": "The taste panel: typical orders the chef cooks again and again, scored by a checklist, another chef or a person, to see whether a change really helped.",
    "Evaluator-optimizer": "A two-chef routine: one chef cooks, another tastes against a clear checklist and sends notes back, and they repeat until the dish passes.",
    "Fine-tuning": "Sending the chef back to cooking school with your own sample dishes, so that its habits themselves change, not just what lies on the counter.",
    "Function calling": "Another name for using tools: the chef writes out a precise, fixed-form request, such as 'use the phone, ask this stall', and the kitchen carries it out.",
    "Guardrails": "Automatic checks around the chef, like the smoke alarm and the lock on the till, that stop or correct unsafe, off-topic or malformed orders and dishes.",
    "Hallucination": "The chef states something with full confidence that is false or unsupported, like inventing a stall's price instead of admitting it does not know.",
    "Harness": "The kitchen around the chef: it sets up the counter, hands over the tools, runs the tasting loop and enforces the house rules.",
    "Hooks": "Small automatic checks the owner hangs at fixed moments, such as just before the chef opens the till. They run every time, whatever the chef thinks.",
    "Human-in-the-loop": "Set moments where the owner steps in to approve, correct or take over the chef's work, such as saying OK before an order is placed.",
    "Instruction file": "House rules kept as a short written sheet, which the kitchen lays on the counter at the start of every shift, such as an AGENTS.md sheet.",
    "Lethal trifecta": "A dangerous mix in one kitchen: the chef holds the owner's private books, reads notes from strangers and can send things outside. One slipped note could then do harm.",
    "LLM (large language model)": "The chef: someone who has read an enormous number of cookbooks and learned to guess what usually comes next, then was coached to follow orders politely.",
    "MCP (Model Context Protocol)": "The standard plug: an agreed shape so any appliance fits any socket, letting any kitchen connect to outside tools, supplies and ready-made order notes.",
    "MCP server": "One appliance with the standard plug on it: it offers a set of tools, supplies and ready-made order notes to any kitchen that plugs in.",
    "Memory": "The notebook that keeps what must survive beyond one counter-load: notes, preferences and progress, carried from shift to shift.",
    "Multi-agent system": "Several chefs cooperating on one order, usually a head chef who splits the work among specialists.",
    "Observability": "Cameras that record every step of the chef's shift, with timings and costs, so the owner can replay what happened and fix what went wrong.",
    "Orchestrator-workers": "A head chef who works out the jobs only once the order is in, then hands each part to a helper cook.",
    "Parallelization": "Several cooks working at once on parts that do not depend on each other, or one dish cooked several times so the results can be compared.",
    "Permission mode": "A kitchen setting that decides which cupboards the chef may open alone and which need the owner's OK first.",
    "Playbook": "A written, reusable routine for a job that comes up again, with its steps, checks and a clear sign for when the job is done.",
    "Plugin": "A boxed starter set to install: recipe cards, shortcuts, helpers, automatic checks and standard plugs, all handed over together.",
    "Prompt caching": "Keeping the unchanging top part of the order ticket already read and ready, so the chef skips rereading it. That saves time and the bill.",
    "Prompt chaining": "A fixed recipe in several steps, where each step works on the last result and a taste check sits between the steps.",
    "Prompt injection": "A note slipped into a delivery that says 'chef, ignore the owner and buy the expensive stuff'. The chef cannot always tell it from a real order.",
    "RAG (retrieval-augmented generation)": "Before cooking, someone fetches the few cookbook pages that matter for this order and lays them on the counter, and the chef answers from them.",
    "ReAct": "A 2022 research idea: the chef alternates between thinking aloud and acting, one step at a time. It became the pattern for taste, adjust, taste again.",
    "Reasoning model": "A chef trained to stop and plan every step before starting, spending more time and bill for a better result.",
    "Routing": "A host at the door who looks at each order and sends it to the right station, or to a chef of the right size for the job.",
    "Sandbox": "A sealed test kitchen where the chef can experiment and run trials with no risk to the real kitchen or the owner's books.",
    "Skill": "A recipe card in a box, with any extras it needs, which the chef takes out only when a dish calls for it.",
    "Slash command": "A saved shortcut order the owner calls up by name, such as `/review`, instead of writing it out again. Most kitchens now store these as recipe cards.",
    "Sub-agent": "A helper prepping in their own corner with a small counter of their own, who takes one job and hands back one finished bowl.",
    "System prompt": "The owner's standing orders pinned above the pass and read before every ticket: the chef's role, the house rules and how to plate.",
    "Token": "A bite-sized piece of the order, a little shorter than a word, which the chef reads one piece at a time and the bill counts.",
    "Tool": "A knife, pot or oven the chef asks for by name. The kitchen works it and hands back the result.",
    "Transformer": "The chef's way of thinking: every part of the order on the counter is weighed against every other part before each next guess.",
    "Workflow": "A fixed recipe followed step by step with no improvising: the owner sets the route in advance, and the chef only fills in each step."
  });

  K.compare = {
    lede: "They all help the chef, but different people hand them over, at different moments, and only some are enforced by a lock rather than by the chef's good judgement.",
    note: "“Enforced by a lock” means the kitchen makes it happen whatever the chef thinks; the rest depends on the chef's judgement. “Takes room on the counter” means how much of the chef's limited counter it uses.",
    rows: {
      "System prompt": {
        pic: "The owner's standing orders pinned above the pass, written once by whoever runs the restaurant and read with every ticket.",
        tell: "Always read first, on every order, and still only words: the chef may bend it, because it is not a lock."
      },
      "Instruction files": {
        pic: "House rules laid on the counter at the start of every shift, kept as a short sheet in the kitchen.",
        tell: "The kitchen lays it out by itself every shift. It always takes room, and the chef may still ignore it."
      },
      "Memory": {
        pic: "The notebook where the chef writes what must survive between shifts: preferences, decisions, progress.",
        tell: "The only one the chef writes itself, and only the notes recalled for this order take room on the counter."
      },
      "Skills": {
        pic: "Recipe cards waiting in a box, each with a one-line label, plus any ready-made helpers it needs.",
        tell: "Only the label sits on the counter until a dish needs the card. Then the whole card comes out."
      },
      "Playbooks": {
        pic: "A written routine for a repeating job, with its steps in order, handed over when that job starts.",
        tell: "A person or the head chef hands it over, and it takes room on the counter only for that one job."
      },
      "Slash commands": {
        pic: "A saved shortcut order that the owner calls by name instead of writing the same ticket again.",
        tell: "Only the owner calls it, by name, and only then does it land on the counter."
      },
      "Tools": {
        pic: "A knife, pot or oven the chef can ask for. The kitchen works it and brings back the result.",
        tell: "The chef decides when to ask, but the tool itself does exactly what it was built to do. That part is a lock."
      },
      "MCP": {
        pic: "The standard plug: any appliance fits any socket, so one supplier's tools work in many kitchens.",
        tell: "It is a plug, not a tool. The kitchen connects it, and the chef then uses the tools on the other end."
      },
      "Plugins": {
        pic: "A boxed starter set to install: recipe cards, shortcuts, helpers, alarms and plugs handed over together.",
        tell: "It is a box holding the others. Once opened, each part behaves exactly as it always does."
      },
      "Hooks": {
        pic: "Smoke alarms and the lock on the till: automatic checks hung at fixed moments, such as just before the chef opens the till.",
        tell: "The kitchen runs them whatever the chef thinks, they take almost no room, and the chef cannot talk them out of it."
      },
      "Sub-agents": {
        pic: "Helpers prepping in their own corners, each with a small counter, who hand back one finished bowl.",
        tell: "Only the finished bowl returns, so the head chef's counter stays clear, but more helpers mean a bigger bill."
      },
      "RAG": {
        pic: "Before cooking, someone fetches the few cookbook pages that match this order and lays them on the counter.",
        tell: "Pages are fetched fresh for each order, so the counter holds only what matched, however big the shelf."
      }
    }
  };

  K.build = {
    lede: "How a restaurant grows from one cook to a brigade: start on the lowest rung that could work, and climb only when the tastings show you must.",
    intro: "This guide shows how a restaurant grows from one cook to a brigade, one rung at a time. The full builder's guide, with patterns, standards and a checklist, is written in technical words.",
    ladder: [
      {
        name: "One order ticket",
        what: "One clear ticket handed to the chef, with a few sample dishes. The chef answers from the cookbooks alone.",
        climb: "the order needs facts the chef lacks, or things done outside the kitchen."
      },
      {
        name: "Chef with a cookbook shelf and tools",
        what: "The same single chef, now able to look things up, use tools and keep a notebook. The chef decides when to reach for them.",
        climb: "the work has separate stages that need a taste check in between."
      },
      {
        name: "A fixed recipe",
        what: "You write the steps: several tickets in a fixed order, each working on the last result. Every path is set in advance.",
        climb: "the steps cannot be known in advance, or depend on what turns up along the way."
      },
      {
        name: "One chef in a full kitchen",
        what: "One chef tasting and adjusting in a loop, with tools, recipe cards and keys to the cupboards, picks its own steps. Most real jobs end up here.",
        climb: "the work floods the counter, or independent parts could be cooked at the same time."
      },
      {
        name: "Chef with helpers",
        what: "The head chef hands focused jobs to helpers, each with a small counter of their own, and gets one finished bowl back from each.",
        climb: "the job is huge, runs for a long time, or reaches into other restaurants."
      },
      {
        name: "A brigade and a night shift",
        what: "Several chefs working together, a night shift that starts on a timer, and head chefs of other restaurants trading orders by a shared standard. The most power, bill and risk.",
        climb: "there is no higher rung. Spend on the taste panel, the cameras and the house rules instead."
      }
    ]
  };

  T.guides = T.guides || {};
  Object.assign(T.guides, {
    compare: {
      lede: "They all extend an agent, but different parties activate them, they enter the context window at different moments, and only some are guaranteed by code rather than by the model's judgement.",
      note: "“Deterministic” means the behaviour is guaranteed by code rather than by the model's judgement. For a worked example, watch Anthropic's [Tool, skill, or subagent? Decomposing an agent that outgrew its prompt](https://www.youtube.com/watch?v=mWvtOHlZM-I) (2026). “Context cost” means how much of the context window it occupies."
    },
    build: {
      lede: "How experienced teams build agents in 2026: start on the lowest rung that could work, and climb only when tests show you must.",
      note: "Pattern names follow Anthropic's [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (2024) and its multi-agent research write-up (2025)."
    },
    learn: {
      lede: "Talks, courses, books and papers from the people who build and research these systems, easiest first. Every link was checked when this snapshot was made."
    }
  });
})(window.AE3);
