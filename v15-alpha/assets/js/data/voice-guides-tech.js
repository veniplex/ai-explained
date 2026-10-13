/* AI explained (v15): the ledes of the guides in the technical voice. */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var T = AE3.tech = AE3.tech || {};

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
