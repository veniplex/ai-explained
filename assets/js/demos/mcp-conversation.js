/* Demo "A conversation between client and server": the messages of an MCP client and server, as in the 2026-07-28 revision of the specification
   (no initialize handshake: every request carries its version and identity in _meta). A scripted run; the message shapes follow the specification. */
(function () {
  "use strict";
  V3.demos.define("mcp-conversation", function (c) {
    var h = c.h, mode = "ok", at = 0;
    var META = { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientInfo": { name: "ExampleClient", version: "1.0.0" }, "io.modelcontextprotocol/clientCapabilities": {} };
    var TOOL = { name: "get_weather", description: "Get current weather information for a location", inputSchema: { type: "object", properties: { location: { type: "string", description: "City name or zip code" } }, required: ["location"] } };
    function json(o) { return JSON.stringify(o, null, 2); }

    function steps() {
      var s = [];
      s.push({ from: "client", title: "The client asks what the server offers", text: "This step is optional. Since this revision there is no handshake: every request says which protocol version it speaks and who the client is, in _meta. A client may skip this and call a tool straight away.",
        msg: { jsonrpc: "2.0", id: "discover-1", method: "server/discover", params: { _meta: META } } });
      s.push({ from: "server", title: "The server answers with its versions and abilities", text: "It lists the protocol versions it supports, what it can do (here: tools) and who it is. The client now knows it can ask for tools.",
        msg: { jsonrpc: "2.0", id: "discover-1", result: { resultType: "complete", supportedVersions: ["2026-07-28"], capabilities: { tools: {} }, _meta: { "io.modelcontextprotocol/serverInfo": { name: "ExampleServer", version: "1.0.0" } } } } });
      s.push({ from: "client", title: "The client asks for the list of tools", text: "Each request carries the same _meta; it is left out of the next messages to keep them short.",
        msg: { jsonrpc: "2.0", id: 1, method: "tools/list", params: { _meta: "…the same as above…" } } });
      s.push({ from: "server", title: "The server describes its tools", text: "Each tool has a name, a description and a JSON Schema for its inputs. The host app will show these to the model, which is the only way the model learns what is on offer.",
        msg: { jsonrpc: "2.0", id: 1, result: { resultType: "complete", tools: [TOOL] } } });
      s.push({ from: "model", title: "Between the messages: the model chooses, and you may be asked", text: "Nothing travels on the wire here. The model decides to use get_weather. The specification says there should always be a person who can deny a call, so the host app often asks you first.",
        msg: { model_wants: "get_weather", with: mode === "ok" ? { location: "New York" } : mode === "unknown" ? { tool: "get_wether", location: "New York" } : { location: 10001 } } });
      var name = mode === "unknown" ? "get_wether" : "get_weather", args = mode === "bad" ? { location: 10001 } : { location: "New York" };
      s.push({ from: "client", title: "The client calls the tool", text: mode === "unknown" ? "The model misspelt the tool's name." : mode === "bad" ? "The model sent a number where the schema asks for text." : "The client sends the name and the arguments.",
        msg: { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: name, arguments: args } } });
      if (mode === "ok") {
        s.push({ from: "server", title: "The server runs the tool and returns the result", text: "The result is a list of content items. isError is false, so the call worked. The client passes this to the model.",
          msg: { jsonrpc: "2.0", id: 2, result: { resultType: "complete", content: [{ type: "text", text: "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy" }], isError: false } } });
      } else if (mode === "unknown") {
        s.push({ from: "server", title: "A protocol error: the request itself is wrong", text: "An unknown tool or a malformed request is a JSON-RPC error. These are about the structure of the request, which the model is less likely to be able to fix, so a client may not show them to the model.",
          msg: { jsonrpc: "2.0", id: 2, error: { code: -32602, message: "Unknown tool: get_wether" } } });
      } else {
        s.push({ from: "server", title: "A tool error: the call was fine, the work failed", text: "The request was well formed but the tool could not do the job, for example because of invalid input. It is an ordinary result with isError set, and its text is written so that the model can read it and try again.",
          msg: { jsonrpc: "2.0", id: 2, result: { resultType: "complete", content: [{ type: "text", text: "Invalid location: expected a city name or zip code as text." }], isError: true } } });
      }
      return s;
    }
    var NAMES = { client: "Client (in the app)", model: "Model", server: "MCP server" };
    var actors = h("ol", { class: "dm-tc-actors", "aria-hidden": "true" }), title = h("h4", { class: "dm-tc-title" }), text = h("p", { class: "dm-tc-text", "aria-live": "polite" }), dir = h("p", { class: "dm-mcp-dir" }), pre = h("pre", { class: "code dm-tc-pre" });
    var st = c.stepper(function (i) { at = i; draw(); });
    var picker = c.pick("The call", [["ok", "A good call"], ["unknown", "A tool that does not exist"], ["bad", "Input of the wrong type"]], "ok", function (v) { mode = v; at = Math.min(at, 4); draw(); });
    function draw() {
      var all = steps(), s = all[at];
      c.sk.clear(actors);
      ["client", "model", "server"].forEach(function (a) { actors.appendChild(h("li", { class: "dm-tc-actor" + (a === s.from ? " is-now" : "") }, NAMES[a])); });
      title.textContent = (at + 1) + ". " + s.title;
      text.textContent = s.text;
      dir.textContent = s.from === "client" ? "Client to server" : s.from === "server" ? "Server to client" : "Inside the app";
      pre.textContent = json(s.msg);
      st.set(at, all.length);
    }
    c.body.appendChild(picker);
    c.body.appendChild(st.el);
    c.body.appendChild(actors);
    c.body.appendChild(title);
    c.body.appendChild(text);
    c.body.appendChild(dir);
    c.body.appendChild(pre);
    draw();
  });
})();
