/* AI explained (v17): the content of the guides: easily confused, build your own, glossary, learn more. */
/* Content of the guides: easily confused, build your own, glossary and learn more. */
window.AE3 = window.AE3 || {};
window.AE3.guides = {
  "compare": {
    "columns": [
      "Concept",
      "What it is",
      "Who activates it",
      "When it enters the context",
      "Context cost",
      "Deterministic?",
      "Best for"
    ],
    "detCol": 4,
    "rows": [
      {
        "name": "System prompt",
        "entry": "prompt",
        "cells": [
          "Standing instructions written by whoever builds the agent",
          "The harness, on every call",
          "At the very start of every request",
          "Always paid; cache it",
          "No",
          "Role, global rules, output format"
        ]
      },
      {
        "name": "Instruction files",
        "entry": "instructions",
        "cells": [
          "Markdown file in the project or home folder (AGENTS.md, CLAUDE.md…)",
          "The harness loads it automatically",
          "At the start of every chat or job",
          "Always paid; keep it short",
          "No",
          "Build commands, conventions, project map"
        ]
      },
      {
        "name": "Memory",
        "entry": "memory",
        "cells": [
          "Facts and notes kept from one chat or job to the next",
          "The agent writes it; the harness or agent reads it",
          "At the start of a chat or job, or when recalled",
          "Varies with what is recalled",
          "No",
          "Preferences, decisions, progress"
        ]
      },
      {
        "name": "Skills",
        "entry": "skills",
        "cells": [
          "Folder with a SKILL.md plus optional scripts and files",
          "The model, when a task matches the description, or the user by name",
          "Description at start; full text only when used",
          "Tiny until used",
          "Partly: bundled scripts are",
          "Repeatable procedures and domain know-how"
        ]
      },
      {
        "name": "Playbooks",
        "entry": "skills",
        "cells": [
          "A written step-by-step procedure for a recurring task",
          "A person or an orchestrating agent",
          "When that task starts",
          "Moderate, only for that task",
          "No",
          "Standardising multi-step processes"
        ]
      },
      {
        "name": "Slash commands",
        "entry": "skills",
        "cells": [
          "A saved prompt template triggered by name, such as `/review`. In Claude Code these are now merged into skills, invoked by name",
          "The user, explicitly",
          "When invoked",
          "Only when used",
          "No",
          "Shortcuts for frequent requests"
        ]
      },
      {
        "name": "Tools",
        "entry": "tools",
        "cells": [
          "A function the model can ask the harness to run",
          "The model decides; the harness executes",
          "Definition on every turn; result when called",
          "Definitions every turn; results can be large",
          "Yes: the code runs as written",
          "Live data and actions"
        ]
      },
      {
        "name": "MCP",
        "entry": "mcp",
        "cells": [
          "A server exposing tools, data and prompts through a standard protocol",
          "The harness connects; the model calls its tools",
          "Tool definitions at start, or later via tool search",
          "Can be large with many servers",
          "Yes, for the tools",
          "Reusable integrations across agents"
        ]
      },
      {
        "name": "Plugins",
        "entry": "skills",
        "cells": [
          "An installable bundle of skills, commands, sub-agents, hooks and MCP servers",
          "The user installs it; its contents behave as usual",
          "Depends on what it contains",
          "Sum of its contents",
          "Partly",
          "Sharing a whole setup with a team"
        ]
      },
      {
        "name": "Hooks",
        "entry": "hooks",
        "cells": [
          "A script the harness runs at a lifecycle event",
          "The harness, automatically",
          "Usually never; its output can be injected",
          "Near zero",
          "Yes for a command hook, which runs your code. The prompt and agent hook types ask a model, so they are not",
          "Rules that must always hold"
        ]
      },
      {
        "name": "Sub-agents",
        "entry": "team",
        "cells": [
          "A separate agent instance with its own context window",
          "The main agent, or the user",
          "Only its final summary returns",
          "Saves main context; more tokens overall",
          "No",
          "Exploration, parallel work, specialist roles"
        ]
      },
      {
        "name": "RAG",
        "entry": "knowledge",
        "cells": [
          "Retrieval of relevant passages from an indexed knowledge base",
          "A pipeline step, or the model as a tool",
          "Per query, as retrieved chunks",
          "Proportional to what is retrieved",
          "Partly: retrieval is, the answer is not",
          "Large, changing, private knowledge"
        ]
      }
    ]
  },
  "build": {
    "ladder": [
      {
        "name": "A single prompt",
        "what": "One model call with clear instructions and a few examples, in a chat or through one API request.",
        "climb": "the task needs facts the model lacks, or actions in other systems."
      },
      {
        "name": "Augmented model",
        "what": "One call that can use retrieval, tools and memory; the model decides when to use them.",
        "climb": "the work has distinct stages that need checks in between."
      },
      {
        "name": "Workflow",
        "what": "Your code chains several calls: prompt chaining, routing, parallelization. Every path is defined in advance.",
        "climb": "the steps can't be known in advance, or depend on what is discovered along the way."
      },
      {
        "name": "One agent in a harness",
        "what": "One model in a loop with tools, skills and permissions decides its own steps. Most coding and knowledge-work agents live here.",
        "climb": "exploration floods the context, or independent parts could run in parallel."
      },
      {
        "name": "Agent with sub-agents",
        "what": "The main agent delegates focused jobs to helpers with fresh context windows and gets summaries back.",
        "climb": "the problem is broad, runs for a long time, or crosses team or company boundaries."
      },
      {
        "name": "Agent teams and long-running autonomy",
        "what": "Several cooperating agents, background agents on schedules, agents working with other organisations' agents via A2A. The most capability, cost and risk.",
        "climb": "there is no higher rung. Invest in evals, observability and governance instead."
      }
    ],
    "recipe": [
      {
        "title": "Define the job and what “done” means",
        "text": "Write down 20 to 50 real example tasks with the outcome you expect, drawn from real use and real failures where you can. This is your first eval set and your specification.",
        "entries": [
          "evals"
        ]
      },
      {
        "title": "Start on the lowest rung",
        "text": "Try a single well-prompted call first. Move up the ladder only when your examples fail for a reason the next rung fixes.",
        "entries": [
          "team",
          "prompt"
        ]
      },
      {
        "title": "Pick a harness instead of writing a loop",
        "text": "For coding and knowledge work, start with an existing agent. For a product, use an agent SDK. Your own loop is rarely what limits quality.",
        "entries": [
          "harness"
        ]
      },
      {
        "title": "Choose models by role",
        "text": "A frontier model for planning and hard steps; smaller, faster models for routing, extraction and sub-agents. Set the reasoning effort per step.",
        "entries": [
          "model",
          "reasoning",
          "cost"
        ]
      },
      {
        "title": "Write a short instruction file",
        "text": "Commands, conventions, project layout and hard-won lessons in AGENTS.md (or your harness's equivalent). Keep it short and current.",
        "entries": [
          "instructions"
        ]
      },
      {
        "title": "Connect a few good tools",
        "text": "Expose systems through MCP servers or functions. Prefer a few task-shaped tools with clear names, helpful errors and concise output. With many tools, use tool search.",
        "entries": [
          "tools",
          "mcp"
        ]
      },
      {
        "title": "Package procedures as skills",
        "text": "Turn your SOPs and playbooks into skills: a precise description for triggering, focused instructions, and scripts for the deterministic parts.",
        "entries": [
          "skills"
        ]
      },
      {
        "title": "Make the hard rules deterministic",
        "text": "Enforce must-never-happen rules with permissions, hooks and a sandbox, not with wording. Check the lethal trifecta before combining private data, untrusted input and outbound channels.",
        "entries": [
          "permissions",
          "hooks",
          "sandbox",
          "security"
        ]
      },
      {
        "title": "Engineer the context",
        "text": "Keep it lean: a stable prefix first, sub-agents for exploration, compaction and progress files for long tasks, retrieval instead of pasting.",
        "entries": [
          "context",
          "team",
          "memory"
        ]
      },
      {
        "title": "Close the loop with verification",
        "text": "Give the agent objective checks such as tests, linters, type checks, screenshots, schema validation or a reviewer, and make “done” depend on them.",
        "entries": [
          "agent-loop"
        ]
      },
      {
        "title": "Put people at the right gates",
        "text": "Approve plans and irreversible actions, review the final output, and widen autonomy as evidence accumulates.",
        "entries": [
          "permissions",
          "agent-loop"
        ]
      },
      {
        "title": "Observe, evaluate, improve",
        "text": "Trace every run, read the failures, fix the cause (instructions, skills, tools, permissions) and re-run the eval set. Watch cost per successful task.",
        "entries": [
          "evals",
          "cost"
        ]
      }
    ],
    "patterns": [
      {
        "id": "augmented",
        "name": "Augmented model",
        "kind": "Building block",
        "autonomy": 1,
        "cost": 1,
        "predictability": 5,
        "what": "One model call that can use retrieval, tools and memory. The model decides whether to use them.",
        "use": "a single, well-defined question or action, such as answering from documents or calling one API.",
        "example": "A support bot that looks up the order status before answering.",
        "alt": "Input goes to one model call; the model can query retrieval, tools and memory, then produces output.",
        "svg": {
          "w": 340,
          "h": 118,
          "nodes": [
            {
              "x": 63,
              "y": 8,
              "w": 66,
              "h": 26,
              "t": "Retrieval",
              "k": "tool"
            },
            {
              "x": 137,
              "y": 8,
              "w": 66,
              "h": 26,
              "t": "Tools",
              "k": "tool"
            },
            {
              "x": 211,
              "y": 8,
              "w": 66,
              "h": 26,
              "t": "Memory",
              "k": "tool"
            },
            {
              "x": 10,
              "y": 66,
              "w": 56,
              "h": 34,
              "t": "In",
              "k": "io"
            },
            {
              "x": 128,
              "y": 62,
              "w": 84,
              "h": 42,
              "t": "Model",
              "k": "llm"
            },
            {
              "x": 274,
              "y": 66,
              "w": 56,
              "h": 34,
              "t": "Out",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M66 83H124"
            },
            {
              "d": "M212 83H270"
            },
            {
              "d": "M96 34L148 60",
              "dashed": true,
              "both": true
            },
            {
              "d": "M170 34V58",
              "dashed": true,
              "both": true
            },
            {
              "d": "M244 34L192 60",
              "dashed": true,
              "both": true
            }
          ],
          "labels": [
            {
              "x": 164,
              "y": 50,
              "t": "query",
              "a": "end"
            },
            {
              "x": 176,
              "y": 50,
              "t": "results",
              "a": "start"
            }
          ]
        },
        "entries": [
          "model",
          "tools",
          "knowledge",
          "memory"
        ]
      },
      {
        "id": "chaining",
        "name": "Prompt chaining",
        "kind": "Workflow",
        "autonomy": 1,
        "cost": 2,
        "predictability": 5,
        "what": "A task split into fixed steps, each call working on the previous output, with checks in between.",
        "use": "the steps are known and each one is easier on its own.",
        "example": "Write an outline, check it against the brief, then write the article.",
        "alt": "Input goes to step 1, then a check; if it passes it goes to step 2 and out, if it fails the chain stops.",
        "svg": {
          "w": 340,
          "h": 134,
          "nodes": [
            {
              "x": 6,
              "y": 44,
              "w": 40,
              "h": 30,
              "t": "In",
              "k": "io"
            },
            {
              "x": 64,
              "y": 40,
              "w": 62,
              "h": 38,
              "t": "Step 1",
              "k": "llm"
            },
            {
              "x": 146,
              "y": 44,
              "w": 48,
              "h": 30,
              "t": "Check",
              "k": "gate"
            },
            {
              "x": 214,
              "y": 40,
              "w": 62,
              "h": 38,
              "t": "Step 2",
              "k": "llm"
            },
            {
              "x": 294,
              "y": 44,
              "w": 40,
              "h": 30,
              "t": "Out",
              "k": "io"
            },
            {
              "x": 146,
              "y": 102,
              "w": 48,
              "h": 26,
              "t": "Stop",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M46 59H60"
            },
            {
              "d": "M126 59H142"
            },
            {
              "d": "M194 59H210",
              "l": "pass",
              "lx": 202,
              "ly": 36
            },
            {
              "d": "M276 59H290"
            },
            {
              "d": "M170 74V98",
              "l": "fail",
              "lx": 176,
              "ly": 90,
              "la": "start"
            }
          ]
        },
        "entries": [
          "team",
          "agent-loop"
        ]
      },
      {
        "id": "routing",
        "name": "Routing",
        "kind": "Workflow",
        "autonomy": 2,
        "cost": 2,
        "predictability": 4,
        "what": "A first call classifies the input and sends it down one of several specialised paths.",
        "use": "inputs fall into distinct categories that are better handled separately, or by models of different sizes.",
        "example": "Support tickets routed to billing, technical help or a human; easy questions to a small model.",
        "alt": "Input goes to a router, which picks exactly one of three paths: billing flow, tech support or escalate; the chosen path produces the output.",
        "svg": {
          "w": 340,
          "h": 150,
          "nodes": [
            {
              "x": 6,
              "y": 60,
              "w": 40,
              "h": 30,
              "t": "In",
              "k": "io"
            },
            {
              "x": 62,
              "y": 56,
              "w": 72,
              "h": 38,
              "t": "Router",
              "k": "llm"
            },
            {
              "x": 176,
              "y": 14,
              "w": 96,
              "h": 30,
              "t": "Billing flow",
              "k": "llm"
            },
            {
              "x": 176,
              "y": 60,
              "w": 96,
              "h": 30,
              "t": "Tech support",
              "k": "llm"
            },
            {
              "x": 176,
              "y": 106,
              "w": 96,
              "h": 30,
              "t": "Escalate",
              "k": "human"
            },
            {
              "x": 296,
              "y": 60,
              "w": 38,
              "h": 30,
              "t": "Out",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M46 75H58"
            },
            {
              "d": "M134 75L172 31"
            },
            {
              "d": "M134 75H172"
            },
            {
              "d": "M134 75L172 119"
            },
            {
              "d": "M272 29L293 68",
              "dashed": true
            },
            {
              "d": "M272 75H292",
              "dashed": true
            },
            {
              "d": "M272 121L293 82",
              "dashed": true
            }
          ]
        },
        "entries": [
          "team",
          "model",
          "cost"
        ]
      },
      {
        "id": "parallel",
        "name": "Parallelization",
        "kind": "Workflow",
        "autonomy": 2,
        "cost": 3,
        "predictability": 4,
        "what": "Independent sub-tasks run at the same time (sectioning), or the same task runs several times and the results are compared (voting).",
        "use": "parts don't depend on each other, or you want more confidence through several attempts.",
        "example": "Checking a contract for several kinds of risk at once; one call answers while another screens for policy issues.",
        "alt": "Input fans out to three sub-tasks that run simultaneously; an aggregator combines their results into the output.",
        "svg": {
          "w": 340,
          "h": 160,
          "nodes": [
            {
              "x": 6,
              "y": 70,
              "w": 40,
              "h": 30,
              "t": "In",
              "k": "io"
            },
            {
              "x": 80,
              "y": 24,
              "w": 78,
              "h": 30,
              "t": "Sub-task 1",
              "k": "llm"
            },
            {
              "x": 80,
              "y": 70,
              "w": 78,
              "h": 30,
              "t": "Sub-task 2",
              "k": "llm"
            },
            {
              "x": 80,
              "y": 116,
              "w": 78,
              "h": 30,
              "t": "Sub-task 3",
              "k": "llm"
            },
            {
              "x": 196,
              "y": 66,
              "w": 84,
              "h": 38,
              "t": "Aggregate",
              "k": "tool"
            },
            {
              "x": 296,
              "y": 70,
              "w": 38,
              "h": 30,
              "t": "Out",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M46 85L76 41"
            },
            {
              "d": "M46 85H76"
            },
            {
              "d": "M46 85L76 129"
            },
            {
              "d": "M158 39L192 78"
            },
            {
              "d": "M158 85H192"
            },
            {
              "d": "M158 131L192 92"
            },
            {
              "d": "M280 85H292"
            }
          ],
          "labels": []
        },
        "entries": [
          "team",
          "hooks"
        ]
      },
      {
        "id": "orchestrator",
        "name": "Orchestrator-workers",
        "kind": "Workflow / agent",
        "autonomy": 3,
        "cost": 4,
        "predictability": 3,
        "what": "A lead model breaks the task down at run time, delegates the pieces to workers and synthesises their results. Unlike parallelization, the sub-tasks are not fixed in advance.",
        "use": "you can't predict the sub-tasks, for example which files need changing or which sources to search.",
        "example": "A coding agent that decides which files to change and hands each change to a worker.",
        "alt": "Input goes to an orchestrator, which delegates to a variable number of workers; a synthesiser combines their results.",
        "svg": {
          "w": 340,
          "h": 158,
          "nodes": [
            {
              "x": 4,
              "y": 64,
              "w": 34,
              "h": 30,
              "t": "In",
              "k": "io"
            },
            {
              "x": 54,
              "y": 58,
              "w": 84,
              "h": 42,
              "t": "Orchestrator",
              "k": "llm"
            },
            {
              "x": 166,
              "y": 14,
              "w": 64,
              "h": 28,
              "t": "Worker",
              "k": "agent"
            },
            {
              "x": 166,
              "y": 50,
              "w": 64,
              "h": 28,
              "t": "Worker",
              "k": "agent"
            },
            {
              "x": 166,
              "y": 86,
              "w": 64,
              "h": 28,
              "t": "Worker",
              "k": "agent"
            },
            {
              "x": 166,
              "y": 122,
              "w": 64,
              "h": 28,
              "t": "+ more",
              "k": "io"
            },
            {
              "x": 258,
              "y": 58,
              "w": 78,
              "h": 42,
              "t": "Synthesise",
              "k": "llm"
            }
          ],
          "edges": [
            {
              "d": "M38 79H50"
            },
            {
              "d": "M138 79L162 28"
            },
            {
              "d": "M138 79L162 64"
            },
            {
              "d": "M138 79L162 100"
            },
            {
              "d": "M138 79L162 136",
              "dashed": true
            },
            {
              "d": "M230 28L254 72"
            },
            {
              "d": "M230 64L254 76"
            },
            {
              "d": "M230 100L254 82"
            },
            {
              "d": "M230 136L254 86",
              "dashed": true
            }
          ]
        },
        "entries": [
          "team"
        ]
      },
      {
        "id": "evaluator",
        "name": "Evaluator-optimizer",
        "kind": "Workflow",
        "autonomy": 3,
        "cost": 3,
        "predictability": 3,
        "what": "One call generates, another evaluates against clear criteria and gives feedback, and the loop repeats until the result passes.",
        "use": "you have clear quality criteria and iterating measurably improves the result.",
        "example": "A translation refined until a reviewer model finds no meaning errors; code revised until tests pass.",
        "alt": "Input goes to a generator; its draft goes to an evaluator, which either sends feedback back to the generator or accepts the result as output.",
        "svg": {
          "w": 340,
          "h": 146,
          "nodes": [
            {
              "x": 6,
              "y": 56,
              "w": 40,
              "h": 30,
              "t": "In",
              "k": "io"
            },
            {
              "x": 72,
              "y": 50,
              "w": 90,
              "h": 42,
              "t": "Generator",
              "k": "llm"
            },
            {
              "x": 212,
              "y": 50,
              "w": 90,
              "h": 42,
              "t": "Evaluator",
              "k": "llm"
            },
            {
              "x": 227,
              "y": 114,
              "w": 60,
              "h": 26,
              "t": "Out",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M46 71H68"
            },
            {
              "d": "M162 62H208",
              "l": "draft",
              "lx": 185,
              "ly": 56
            },
            {
              "d": "M212 82H166",
              "l": "feedback",
              "lx": 189,
              "ly": 102
            },
            {
              "d": "M257 92V110",
              "l": "accepted",
              "lx": 264,
              "ly": 106,
              "la": "start"
            }
          ]
        },
        "entries": [
          "agent-loop",
          "team",
          "evals"
        ]
      },
      {
        "id": "agent",
        "name": "Autonomous agent",
        "kind": "Agent",
        "autonomy": 4,
        "cost": 4,
        "predictability": 2,
        "what": "The model runs in a loop, choosing its own actions from environment feedback until the goal is met or a limit is hit.",
        "use": "open-ended problems where the steps can't be predicted and you trust the environment's feedback, such as tests.",
        "example": "A coding agent that resolves an issue end to end; a desktop agent that compiles a report from many sources.",
        "alt": "A human gives the agent a task; the agent acts on the environment and receives feedback in a loop, asks the human when needed, and stops when done or out of budget.",
        "svg": {
          "w": 340,
          "h": 150,
          "nodes": [
            {
              "x": 6,
              "y": 56,
              "w": 56,
              "h": 34,
              "t": "Human",
              "k": "human"
            },
            {
              "x": 110,
              "y": 50,
              "w": 96,
              "h": 46,
              "t": "Agent (model)",
              "k": "llm"
            },
            {
              "x": 250,
              "y": 50,
              "w": 84,
              "h": 46,
              "t": "Environment",
              "k": "tool"
            },
            {
              "x": 128,
              "y": 120,
              "w": 60,
              "h": 24,
              "t": "Stop",
              "k": "io"
            }
          ],
          "edges": [
            {
              "d": "M62 64H106",
              "l": "task",
              "lx": 84,
              "ly": 58
            },
            {
              "d": "M106 84H66",
              "l": "asks",
              "lx": 86,
              "ly": 100
            },
            {
              "d": "M206 62H246",
              "l": "action",
              "lx": 226,
              "ly": 56
            },
            {
              "d": "M246 84H210",
              "l": "feedback",
              "lx": 228,
              "ly": 100
            },
            {
              "d": "M158 96V116",
              "l": "done or budget",
              "lx": 166,
              "ly": 112,
              "la": "start"
            }
          ]
        },
        "entries": [
          "agent-loop",
          "harness",
          "tools"
        ]
      },
      {
        "id": "team",
        "name": "Multi-agent team",
        "kind": "Agent system",
        "autonomy": 5,
        "cost": 5,
        "predictability": 1,
        "what": "A lead agent coordinates specialist agents, each with its own context, tools and permissions, sharing a task list and files.",
        "use": "broad work with separable parts, or when separating duties (and permissions) matters.",
        "example": "A research lead with three searcher agents; a coder, a tester and a reviewer working on one feature.",
        "alt": "A lead agent assigns work to a researcher, a coder and a reviewer and receives reports; the specialists share a task list and files.",
        "svg": {
          "w": 340,
          "h": 182,
          "nodes": [
            {
              "x": 118,
              "y": 8,
              "w": 104,
              "h": 36,
              "t": "Lead agent",
              "k": "agent"
            },
            {
              "x": 8,
              "y": 96,
              "w": 96,
              "h": 34,
              "t": "Researcher",
              "k": "agent"
            },
            {
              "x": 122,
              "y": 96,
              "w": 96,
              "h": 34,
              "t": "Coder",
              "k": "agent"
            },
            {
              "x": 236,
              "y": 96,
              "w": 96,
              "h": 34,
              "t": "Reviewer",
              "k": "agent"
            },
            {
              "x": 86,
              "y": 148,
              "w": 168,
              "h": 28,
              "t": "Shared task list & files",
              "k": "tool"
            }
          ],
          "edges": [
            {
              "d": "M150 44L62 92",
              "both": true
            },
            {
              "d": "M170 44V92",
              "both": true
            },
            {
              "d": "M190 44L278 92",
              "both": true,
              "l": "assigns · reports",
              "lx": 244,
              "ly": 62,
              "la": "start"
            },
            {
              "d": "M56 130L120 146",
              "dashed": true,
              "both": true
            },
            {
              "d": "M170 130V144",
              "dashed": true,
              "both": true
            },
            {
              "d": "M284 130L220 146",
              "dashed": true,
              "both": true
            }
          ]
        },
        "entries": [
          "team",
          "memory"
        ]
      }
    ],
    "protocols": [
      {
        "group": "Agents, tools and context",
        "name": "MCP (Model Context Protocol)",
        "url": "https://modelcontextprotocol.io",
        "connects": "Agents ↔ tools, data and prompts",
        "origin": "Anthropic, November 2024",
        "governance": "Agentic AI Foundation (Linux Foundation) since December 2025; maintainers decide through enhancement proposals",
        "status": "Current revision 2026-07-28: a stateless core (no protocol-level sessions or initialize handshake), with Tasks, MCP Apps, enterprise-managed authorisation and Skills over MCP as official extensions. Supported by a wide range of clients, including Claude, ChatGPT, Visual Studio Code and Cursor.",
        "sources": [
          "https://modelcontextprotocol.io/specification/versioning",
          "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
          "https://modelcontextprotocol.io/extensions/overview",
          "https://modelcontextprotocol.io",
          "https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/"
        ],
        "entry": "mcp"
      },
      {
        "group": "Agents, tools and context",
        "name": "A2A (Agent2Agent)",
        "url": "https://a2a-protocol.org",
        "connects": "Agent ↔ agent, across vendors and frameworks",
        "origin": "Google, April 2025",
        "governance": "Linux Foundation project since June 2025; part of the Agentic AI Foundation since August 2026",
        "status": "Version 1.0 (March 2026): signed Agent Cards and JSON-RPC, gRPC and HTTP+JSON bindings. IBM's Agent Communication Protocol merged into A2A in August 2025.",
        "sources": [
          "https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/",
          "https://a2a-protocol.org/latest/specification/",
          "https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents",
          "https://aaif.io/blog/a2a-joins-aaif"
        ],
        "entry": "team"
      },
      {
        "group": "Agents, tools and context",
        "name": "AGENTS.md",
        "url": "https://agents.md",
        "connects": "Repository ↔ coding agents (standing instructions)",
        "origin": "OpenAI Codex, Amp, Google Jules, Cursor and Factory, 2025",
        "governance": "Agentic AI Foundation since December 2025",
        "status": "Plain Markdown with no required fields; the nearest file in the folder tree wins. The project site reports more than 60,000 open-source projects using it and lists agents that read it, among them Codex, Jules, Cursor, Gemini CLI, GitHub Copilot and VS Code.",
        "sources": [
          "https://agents.md/"
        ],
        "entry": "instructions"
      },
      {
        "group": "Agents, tools and context",
        "name": "Agent Skills",
        "url": "https://agentskills.io",
        "connects": "Packaged know-how (folders with a SKILL.md) ↔ any compatible agent",
        "origin": "Anthropic, October 2025; published as an open standard in December 2025",
        "governance": "Open specification developed on GitHub",
        "status": "Small spec (only name and description are required in SKILL.md). Its client showcase lists dozens of agent products, including Claude Code, Codex, Gemini CLI, GitHub Copilot, VS Code and Cursor.",
        "sources": [
          "https://agentskills.io/specification",
          "https://agentskills.io"
        ],
        "entry": "skills"
      },
      {
        "group": "Agents, tools and context",
        "name": "WebMCP",
        "url": "https://webmachinelearning.github.io/webmcp/",
        "connects": "Web page ↔ in-browser agent: the page exposes its own tools",
        "origin": "W3C Web Machine Learning Community Group, with editors from Microsoft and Google",
        "governance": "W3C Community Group draft, not on the W3C standards track",
        "status": "Draft Community Group report dated 9 October 2026. The ChatGPT desktop app supports it as “site tools” in its built-in browser.",
        "sources": [
          "https://webmachinelearning.github.io/webmcp/",
          "https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app"
        ],
        "entry": "tools"
      },
      {
        "group": "User interfaces",
        "name": "MCP Apps",
        "url": "https://modelcontextprotocol.io/extensions/apps/overview",
        "connects": "MCP tools ↔ interactive UI inside a chat",
        "origin": "MCP maintainers with OpenAI (Apps SDK) and the MCP-UI community; live since January 2026",
        "governance": "Official MCP extension",
        "status": "Tools return HTML interfaces that the client renders in a sandboxed frame. Supported in Claude, ChatGPT, VS Code Copilot, Microsoft 365 Copilot, Cursor and Goose.",
        "sources": [
          "https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/",
          "https://modelcontextprotocol.io/extensions/client-matrix"
        ],
        "entry": "harness"
      },
      {
        "group": "User interfaces",
        "name": "AG-UI",
        "url": "https://docs.ag-ui.com",
        "connects": "Agent back end ↔ application front end, as a stream of typed events",
        "origin": "CopilotKit, May 2025",
        "governance": "Open-source community project",
        "status": "Its documentation lists supported first-party integrations with Microsoft Agent Framework, Google ADK, AWS Strands Agents and Bedrock AgentCore, Mastra, Pydantic AI, LlamaIndex and others.",
        "sources": [
          "https://docs.ag-ui.com/introduction"
        ],
        "entry": "harness"
      },
      {
        "group": "User interfaces",
        "name": "Agent Client Protocol",
        "url": "https://agentclientprotocol.com",
        "connects": "Code editor ↔ coding agent",
        "origin": "Zed, August 2025",
        "governance": "Jointly governed by Zed and JetBrains, working toward an independent foundation",
        "status": "Version 1 is the documented version; the Rust and TypeScript SDKs reached 1.0 (June 2026) and version 2 is published in draft (July 2026). Editors include Zed, JetBrains IDEs, Visual Studio Code and Neovim; agents include Claude Agent, Codex CLI, Gemini CLI and GitHub Copilot. Not the same as the Agentic Commerce Protocol, which shares the abbreviation ACP.",
        "sources": [
          "https://agentclientprotocol.com/updates",
          "https://agentclientprotocol.com/community/governance",
          "https://zed.dev/acp"
        ],
        "entry": "harness"
      },
      {
        "group": "User interfaces",
        "name": "A2UI",
        "url": "https://a2ui.org",
        "connects": "Agent → user interface built from the client's own native components",
        "origin": "Google, December 2025",
        "governance": "Google-led open source (Apache 2.0)",
        "status": "The project site lists version 0.9.1 as the current production release and 1.0 as a release candidate. Messages can travel over A2A, and the site has guides for MCP and AG-UI.",
        "sources": [
          "https://a2ui.org/"
        ],
        "entry": "harness"
      },
      {
        "group": "Observability",
        "name": "OpenTelemetry GenAI conventions",
        "url": "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
        "connects": "Agents ↔ observability tools",
        "origin": "OpenTelemetry project",
        "governance": "Cloud Native Computing Foundation (CNCF)",
        "status": "Conventions for spans, metrics and events of generative AI clients, agents, tool calls and MCP, now kept in a separate repository. Still marked as in development (October 2026), so attribute names can change.",
        "sources": [
          "https://github.com/open-telemetry/semantic-conventions-genai"
        ],
        "entry": "evals"
      },
      {
        "group": "Payments and commerce",
        "name": "AP2 (Agent Payments Protocol)",
        "url": "https://ap2-protocol.org",
        "connects": "Shopping agent ↔ merchant ↔ payment networks, through signed mandates",
        "origin": "Google, September 2025",
        "governance": "FIDO Alliance since April 2026",
        "status": "Version 0.2 adds payments while the person is not present, under pre-approved mandates.",
        "sources": [
          "https://blog.google/products-and-platforms/platforms/google-pay/agent-payments-protocol-fido-alliance/"
        ]
      },
      {
        "group": "Payments and commerce",
        "name": "ACP (Agentic Commerce Protocol)",
        "url": "https://www.agenticcommerce.dev",
        "connects": "Buyer's agent ↔ merchant ↔ payment provider, for checkout",
        "origin": "OpenAI and Stripe, September 2025",
        "governance": "OpenAI and Stripe as founding maintainers",
        "status": "Date-versioned specification, latest stable 2026-04-17. OpenAI launched Instant Checkout in ChatGPT on it in September 2025.",
        "sources": [
          "https://github.com/agentic-commerce-protocol/agentic-commerce-protocol",
          "https://openai.com/index/buy-it-in-chatgpt/"
        ]
      },
      {
        "group": "Payments and commerce",
        "name": "UCP (Universal Commerce Protocol)",
        "url": "https://ucp.dev",
        "connects": "Agents ↔ businesses across product discovery, checkout and order management",
        "origin": "Google with Shopify, Etsy, Wayfair, Target and Walmart, January 2026",
        "governance": "Open source (Apache 2.0)",
        "status": "Shopping specification published; designed to work with AP2, A2A and MCP.",
        "sources": [
          "https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/"
        ]
      },
      {
        "group": "Payments and commerce",
        "name": "x402",
        "url": "https://www.x402.org",
        "connects": "Agent ↔ paid API or website, via the HTTP 402 status code",
        "origin": "Coinbase",
        "governance": "x402 Foundation under the Linux Foundation, since July 2026",
        "status": "Pay-per-request payments: a server answers with HTTP 402 and the client pays and retries. Stablecoin payments are the primary use case.",
        "sources": [
          "https://www.x402.org/",
          "https://www.linuxfoundation.org/press/linux-foundation-announces-operational-launch-of-x402-foundation-to-standardize-internet-native-payments-for-ai-agents-and-applications"
        ]
      }
    ],
    "flows": [
      {
        "name": "Fix a bug from an issue",
        "goal": "A coding agent picks up a labelled issue and opens a tested pull request.",
        "why": "Deterministic checks (hooks and tests) plus a human review gate make an autonomous run safe to merge.",
        "route": [
          {
            "e": "background",
            "n": "issue labelled"
          },
          {
            "e": "instructions",
            "n": "AGENTS.md"
          },
          {
            "e": "agent-loop",
            "n": "plan & to-dos"
          },
          {
            "e": "knowledge",
            "n": "grep & read"
          },
          {
            "e": "sandbox",
            "n": "edit & run"
          },
          {
            "e": "hooks",
            "n": "lint on edit"
          },
          {
            "e": "agent-loop",
            "n": "tests pass"
          },
          {
            "e": "permissions",
            "n": "PR review"
          },
          {
            "e": "evals",
            "n": "trace"
          }
        ]
      },
      {
        "name": "Research report with citations",
        "goal": "A lead agent answers a broad question by fanning out parallel searches.",
        "why": "Breadth-first work parallelises well and sub-agents keep the lead's context small. Expect many times the tokens of a single chat.",
        "route": [
          {
            "e": "harness",
            "n": "question"
          },
          {
            "e": "agent-loop",
            "n": "research plan"
          },
          {
            "e": "team",
            "n": "lead agent"
          },
          {
            "e": "knowledge",
            "n": "web search"
          },
          {
            "e": "memory",
            "n": "plan saved"
          },
          {
            "e": "agent-loop",
            "n": "citation check"
          },
          {
            "e": "harness",
            "n": "report"
          }
        ]
      },
      {
        "name": "Customer support triage",
        "goal": "Every new ticket is classified, answered from the help centre, or handed to a person.",
        "why": "A fixed workflow with one agentic step is cheaper and more predictable than a fully autonomous agent.",
        "route": [
          {
            "e": "background",
            "n": "new ticket"
          },
          {
            "e": "team",
            "n": "routing"
          },
          {
            "e": "knowledge",
            "n": "help-centre search"
          },
          {
            "e": "mcp",
            "n": "CRM tools"
          },
          {
            "e": "hooks",
            "n": "PII & policy"
          },
          {
            "e": "permissions",
            "n": "refunds approved"
          },
          {
            "e": "evals",
            "n": "weekly review"
          }
        ]
      },
      {
        "name": "Weekly business report",
        "goal": "Every Monday an agent pulls the numbers, builds charts and posts a summary.",
        "why": "A skill keeps the format and branding consistent; running code makes the numbers reproducible.",
        "route": [
          {
            "e": "background",
            "n": "schedule"
          },
          {
            "e": "mcp",
            "n": "warehouse & docs"
          },
          {
            "e": "skills",
            "n": "report skill"
          },
          {
            "e": "sandbox",
            "n": "code for charts"
          },
          {
            "e": "agent-loop",
            "n": "cross-check totals"
          },
          {
            "e": "harness",
            "n": "post to chat"
          },
          {
            "e": "cost",
            "n": "cache & batch"
          }
        ]
      }
    ],
    "checklist": [
      {
        "k": "done",
        "t": "The task, its inputs and the definition of done are written down."
      },
      {
        "k": "evals",
        "t": "An eval set of at least 20 real tasks with pass/fail criteria exists."
      },
      {
        "k": "ladder",
        "t": "We chose the lowest rung of the ladder that passes the evals."
      },
      {
        "k": "models",
        "t": "Models are chosen per role, with reasoning effort set per step."
      },
      {
        "k": "instructions",
        "t": "The instruction file is short, current and reviewed like code."
      },
      {
        "k": "tools",
        "t": "Tools have clear names and descriptions, helpful errors and concise output."
      },
      {
        "k": "skills",
        "t": "Recurring procedures are packaged as skills with precise descriptions."
      },
      {
        "k": "perms",
        "t": "Permissions follow least privilege; destructive actions are denied or need approval."
      },
      {
        "k": "sandbox",
        "t": "The agent runs in a sandbox with restricted network access."
      },
      {
        "k": "trifecta",
        "t": "No chat or job combines private data, untrusted content and outbound communication without a human gate."
      },
      {
        "k": "supply",
        "t": "Third-party MCP servers, skills and plugins are reviewed and pinned."
      },
      {
        "k": "verify",
        "t": "The agent can verify its own work with tests, checks or a reviewer."
      },
      {
        "k": "trace",
        "t": "Every run is traced: tokens, cost, tool calls and errors."
      },
      {
        "k": "budget",
        "t": "Unattended runs have limits on turns, time and spend."
      },
      {
        "k": "gov",
        "t": "Personal data, retention and AI Act obligations have been checked."
      },
      {
        "k": "owner",
        "t": "A named person owns the agent and reviews its failures regularly."
      }
    ]
  },
  "learn": [
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
        }
      ]
    },
    {
      "title": "Free courses",
      "intro": "Free courses, easiest first.",
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
          "note": "6 lessons, about 1 hour; no sign-in needed to start. Create, structure and share Skills; compare them with subagents, hooks and MCP."
        },
        {
          "type": "course",
          "title": "Agentic AI",
          "by": "DeepLearning.AI (Andrew Ng)",
          "year": 2025,
          "url": "https://www.deeplearning.ai/courses/agentic-ai/",
          "note": "intermediate · Reflection, tool use, planning and multi-agent patterns, plus evals; free to audit."
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
          "note": "Building applications on foundation models: evaluation, RAG, agents, fine-tuning, deployment (chapters as listed by the publisher)."
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
        }
      ]
    },
    {
      "title": "The research behind it",
      "intro": "Seminal papers, in chronological order. Every link goes to the paper's arXiv page.",
      "wide": true,
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
          "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
          "by": "Lewis et al.",
          "year": 2020,
          "url": "https://arxiv.org/abs/2005.11401",
          "note": "The original RAG paper: pair a retriever with a generator for grounded answers."
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
          "title": "Training language models to follow instructions with human feedback",
          "by": "Ouyang et al.",
          "year": 2022,
          "url": "https://arxiv.org/abs/2203.02155",
          "note": "InstructGPT: RLHF turns a pretrained model into a helpful instruction follower."
        },
        {
          "type": "paper",
          "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
          "by": "Yao et al.",
          "year": 2022,
          "url": "https://arxiv.org/abs/2210.03629",
          "note": "Interleaves reasoning traces with tool actions; the template for today's agent loop."
        }
      ]
    }
  ]
};
