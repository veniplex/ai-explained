/* Demo "Who does what in a tool call": a scripted run of one tool call between the model, the harness and the tool, with a call that can be broken. */
(function () {
  "use strict";
  V3.demos.define("tool-call", function (c) {
    var h = c.h;
    var mode = "valid", at = 0;
    var SCHEMA = { name: "get_weather", description: "Current weather for a city", input_schema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] } };
    function call() { return mode === "valid" ? { city: "Lisbon" } : mode === "missing" ? { town: "Lisbon" } : { city: ["Lisbon"] }; }
    function problem() { return mode === "missing" ? "input.city is required" : mode === "type" ? "input.city must be a string" : null; }
    function json(o) { return JSON.stringify(o, null, 2); }

    // Each step: who acts, a title, what happens, and the message that travels.
    function steps() {
      var bad = problem(), s = [];
      s.push({ who: "harness", to: "model", title: "The harness sends the request", text: "It sends the conversation and the list of tools the model may use. Each tool is a name, a description and a schema for its inputs. The model has no tools of its own: it only gets to read this list.",
        msg: { messages: [{ role: "user", content: "Is it raining in Lisbon?" }], tools: [SCHEMA] } });
      s.push({ who: "model", to: "harness", title: "The model writes a call. It does not run anything", text: "It replies with text that names a tool and fills in its inputs, and it stops there. " + (bad ? "This time it wrote the call wrongly." : "Here the call is well formed."),
        msg: { stop_reason: "tool_use", content: [{ type: "tool_use", id: "call_1", name: "get_weather", input: call() }] } });
      s.push({ who: "harness", to: "harness", title: "The harness checks the call against the schema", text: bad ? "The schema says the field city is required and must be a string. The call breaks that, so the harness refuses to run it." : "The call has the field city, and it is a string. The harness also checks its permission rules here, and asks you first if a rule says so.",
        msg: bad ? { valid: false, error: bad } : { valid: true, checked: ["city is present", "city is a string", "permission rule: allow"] } });
      if (bad) {
        s.push({ who: "harness", to: "model", title: "Nothing runs. The error goes back to the model", text: "The harness sends the error back as the result of the call, so that the model can read it and try again.",
          msg: { role: "user", content: [{ type: "tool_result", tool_use_id: "call_1", is_error: true, content: bad }] } });
        s.push({ who: "model", to: "harness", title: "The model tries again", text: "It reads the error and writes a corrected call. The loop goes on from the check, with the right input this time.",
          msg: { stop_reason: "tool_use", content: [{ type: "tool_use", id: "call_2", name: "get_weather", input: { city: "Lisbon" } }] } });
      } else {
        s.push({ who: "tool", to: "harness", title: "The harness runs the tool", text: "The tool is ordinary code that the harness calls. It runs there, on the harness's side, with whatever access the harness gives it. The result comes back to the harness, not to the model.",
          msg: { temp_c: 17, raining: false } });
        s.push({ who: "harness", to: "model", title: "The result goes back, and the model answers", text: "The harness adds the result to the conversation and calls the model again. Only now does the model say something to you.",
          msg: { role: "user", content: [{ type: "tool_result", tool_use_id: "call_1", content: "{\"temp_c\": 17, \"raining\": false}" }] }, then: "Model: \"No, it is dry in Lisbon right now, 17 degrees.\"" });
      }
      return s;
    }

    var actors = h("ol", { class: "dm-tc-actors", "aria-hidden": "true" }), title = h("h4", { class: "dm-tc-title" }), text = h("p", { class: "dm-tc-text", "aria-live": "polite" }), pre = h("pre", { class: "code dm-tc-pre" }), then = h("p", { class: "dm-tc-then" });
    var st = c.stepper(function (i) { at = i; draw(); });
    var picker = c.pick("What the model writes", [["valid", "A good call"], ["missing", "A wrong field name"], ["type", "A wrong type"]], "valid", function (v) { mode = v; at = Math.min(at, 1); draw(); });
    var NAMES = { model: "Model", harness: "Harness", tool: "Tool" };
    function draw() {
      var all = steps(), s = all[at];
      c.sk.clear(actors);
      ["model", "harness", "tool"].forEach(function (a) { actors.appendChild(h("li", { class: "dm-tc-actor" + (a === s.who ? " is-now" : "") + (a === s.to && a !== s.who ? " is-to" : "") }, NAMES[a], a === s.who ? h("small", null, a === "harness" && s.to === "harness" ? "acts" : "acts") : (a === s.to ? h("small", null, "receives") : null))); });
      title.textContent = (at + 1) + ". " + s.title;
      text.textContent = s.text;
      pre.textContent = json(s.msg);
      then.textContent = s.then || "";
      then.hidden = !s.then;
      st.set(at, all.length);
    }
    c.body.appendChild(picker);
    c.body.appendChild(st.el);
    c.body.appendChild(actors);
    c.body.appendChild(title);
    c.body.appendChild(text);
    c.body.appendChild(pre);
    c.body.appendChild(then);
    draw();
  });
})();
