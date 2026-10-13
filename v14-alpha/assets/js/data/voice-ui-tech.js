/* AI explained (v14): the smaller texts of the technical voice: the hero line, the five things to remember, the labels of the figures and of the map, and the headings of the page. It uses no picture at all. Inline markup: `code`, **bold**, [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var T = AE3.tech = AE3.tech || {};

  /* ---------- Technical ---------- */
  T.hero = {
    line: "An AI agent is a language model that calls tools in a loop until a goal is reached. Four parts make it work: model, context, tools and loop.",
    task: "Find the three cheapest flights to Lisbon in May, put them in my travel sheet, and book the best one once I say OK.",
    short: "the Lisbon flights"
  };
  T.recap = [
    { t: "The model is stateless.", d: "It sees only the context of the current request, plus what it learned in training. The application resends whatever it needs with every call." },
    { t: "Context is the bottleneck.", d: "Quality drops as the window fills with irrelevant text. Skills, retrieval and memory bring the right material at the right time; sub-agents keep the main context clean." },
    { t: "Prompts suggest; code enforces.", d: "Instructions guide the model, but injected text can override them. Permissions, hooks and sandboxes are enforced by code in the harness." },
    { t: "Start simple.", d: "A single prompt beats a fixed workflow, and a fixed workflow beats an agent that picks its own steps, until evals show you need more." },
    { t: "Verify the output.", d: "Tests, checks and a second pass turn plausible answers into verified ones." }
  ];
  T.figures = {
    contextBars: [
      {
        title: "A cluttered context window, after a long conversation",
        caption: "After a long conversation, old messages and pasted documents fill most of the window. The whole context is processed again on every request, so latency and cost grow and the details that matter get diluted.",
        segs: ["System prompt", "Old messages", "Pasted documents and long tool output", "Extra notes", "Free"]
      },
      {
        title: "A curated context window, same conversation",
        caption: "The same conversation after compaction: older turns summarised, only the relevant documents kept, and the key facts retained. Two thirds of the window stay free.",
        segs: ["System prompt", "Summary of the conversation", "Latest messages", "Only relevant documents", "Key facts", "Free"]
      }
    ]
  };
  T.map = {
    you: "give the task and review the result",
    conns: {
      cA: { label: "reads the context", sub: "picks the next step" },
      cB: { label: "tool call", sub: "result returned" },
      cC: { label: "loaded when needed", sub: "instructions, skills, notes" },
      cD: { label: "task delegated", sub: "summary returned" }
    },
    loop: {
      center: "the agent loop", sub: "repeat until done",
      exitWide: "no tool call: final answer", exitNarrow: "final answer",
      stations: [
        { name: ["Assemble", "the context"], sub: "task, rules, results" },
        { name: ["Model", "decides"], sub: "answer, or tool call?" },
        { name: ["Check", "permission"], sub: "is it allowed?" },
        { name: ["Run", "the tool"], sub: "search, sheet, code" },
        { name: ["Append", "the result"], sub: "to the context" }
      ],
      aria: "The agent loop: the context is assembled, the model decides, the action is checked against the permissions, the tool runs and its result is appended to the context; then the next turn starts. A reply without a tool call ends the loop with the final answer. Open the agent loop."
    }
  };
  T.ui = {
    hub: "The whole system",
    text: "How it works", example: "Example: the Lisbon trip", terms: "Terms in this chapter",
    entryLead: "In one sentence", how: "How it works", ex: "Example: the Lisbon trip", forYou: "What it means for you", details: "Deep dive"
  };
})(window.AE3);
