/* Agentic AI, Explained (v4): the smaller texts of both voices: the hero line, the five things to remember, the
   labels of the figures and of the map, and the headings of the page. The chapters and entries are in the other
   voice-*.js files. The kitchen voice (AE3.kitchen) uses only the restaurant kitchen; the technical voice (AE3.tech)
   uses no picture at all. Inline markup: `code`, **bold**, [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};
  var T = AE3.tech = AE3.tech || {};

  /* ---------- Kitchen ---------- */
  K.hero = {
    line: "An AI agent is like a chef who has read every cookbook, remembers nothing, and cooks step by step with the tools you hand over.",
    task: "Find the three cheapest market stalls for 20 kilos of tomatoes for Saturday, write them into the order book, and place the order at the best one once I say OK.",
    short: "the Saturday tomatoes"
  };
  K.recap = [
    { t: "The chef remembers nothing.", d: "Each order is forgotten the moment it is served. Only what is on the counter right now counts, plus what the chef learned from the cookbooks." },
    { t: "The counter is the bottleneck.", d: "It is small, and clutter hides what matters. Recipe cards, the cookbook shelf and the notebook bring the right thing at the right time; helpers keep the counter clean." },
    { t: "A rule asks; a lock holds.", d: "A rule on the wall asks the chef politely. A lock on the cupboard cannot be talked round. Put the dangerous things behind locks." },
    { t: "Start simple.", d: "One order ticket beats a fixed recipe, and a fixed recipe beats a chef who improvises, until the taste panel shows you need more." },
    { t: "Taste before serving.", d: "Tasting every dish, and letting a second cook taste it too, turns a plausible dish into a good one." }
  ];
  K.figures = {
    contextBars: [
      {
        title: "A cluttered counter, after a long evening",
        caption: "After a long evening, old tickets, piles of recipe pages and long notes cover most of the counter. The chef has to read all of it again before every move, so everything slows down, costs more, and the facts that matter get buried.",
        segs: ["Standing orders", "Old tickets", "Piles of recipe pages", "Extra notes", "Free"]
      },
      {
        title: "A tidy counter, same evening",
        caption: "The same evening after tidying: old tickets shortened to a summary, only the pages that matter, and the owner's key wishes kept. Two thirds of the counter stay free.",
        segs: ["Standing orders", "Summary of the evening", "Latest tickets", "Only the useful pages", "Owner's key wishes", "Free"]
      }
    ]
  };
  K.map = {
    you: "give the order and check the dish",
    conns: {
      cA: { label: "reads the counter", sub: "says the next step" },
      cB: { label: "uses a tool", sub: "result comes back" },
      cC: { label: "taken out when needed", sub: "rules, recipes, notes" },
      cD: { label: "hands over a task", sub: "one bowl comes back" }
    },
    loop: {
      center: "the tasting loop", sub: "repeat until done",
      exitWide: "no tool needed: final answer", exitNarrow: "final answer",
      stations: [
        { name: ["Fill", "the counter"], sub: "ticket, rules, results" },
        { name: ["Chef", "decides"], sub: "answer, or use a tool?" },
        { name: ["Check", "the lock"], sub: "is it allowed?" },
        { name: ["Use", "the tool"], sub: "market phone, order book" },
        { name: ["Add", "the result"], sub: "back on the counter" }
      ],
      aria: "The tasting loop: the counter is filled, the chef decides, the lock is checked, the tool is used and its result goes back on the counter; then the next round starts. When the chef needs no tool, the loop ends with the final answer. Open the agent loop."
    }
  };
  K.ui = {
    hub: "The whole kitchen",
    lead: "In the kitchen", text: "Who does what", example: "On Saturday", terms: "The real words",
    entryLead: "In the kitchen", how: "How it works in the kitchen", ex: "On Saturday", forYou: "What it means for you",
    realThing: "Want the real thing?", realThingText: "The technical version has no pictures: the mechanism, the details, dated facts and sources.",
    switchTo: "Show the technical version"
  };

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
    text: "How it works", example: "In our example", terms: "Terms in this chapter",
    entryLead: "In one sentence", how: "How it works", ex: "In our example", forYou: "What it means for you", details: "Details"
  };
})(window.AE3);
