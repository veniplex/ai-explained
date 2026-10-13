/* Agentic AI, Explained (v13): the smaller texts of the kitchen voice: the hero line, the five things to remember, the labels of the figures and of the map, and the headings of the page. It uses only the restaurant kitchen. Inline markup: `code`, **bold**, [[entry-id|label]], [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};

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
    realThing: "Want the real thing?", realThingText: "The technical page has no pictures: the mechanism, the details, dated facts and sources.",
    switchTo: "Open the technical page"
  };
})(window.AE3);
