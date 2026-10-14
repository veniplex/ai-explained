/* Demo "Signing in without sharing a password": the authorisation-code flow with PKCE, step by step. A scripted run with made-up values; the order and
   what travels where are the real flow. (The verifier and its challenge are the pair in RFC 7636, appendix B.) */
(function () {
  "use strict";
  V3.demos.define("oauth-flow", function (c) {
    var h = c.h, at = 0;
    var VERIFIER = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk", CHALLENGE = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
    var ACTORS = [["you", "You"], ["app", "The app (the agent)"], ["auth", "Sign-in server"], ["api", "The service"]];
    var STEPS = [
      { on: ["app"], title: "The app makes a secret and a fingerprint of it", text: "Before anything is sent, the app invents a long random secret, the code verifier, and keeps it to itself. It sends only a fingerprint of it, the code challenge: the SHA-256 hash of the verifier. Nobody can get the verifier back from the fingerprint.",
        msg: "code_verifier  = " + VERIFIER + "   (kept by the app)\ncode_challenge = " + CHALLENGE + "   (= SHA-256 of the verifier, base64url)" },
      { on: ["app", "auth"], title: "The app sends you to the sign-in server", text: "It opens the sign-in server's page in your browser and says who it is (client_id), what it wants (scope), where to send you back (redirect_uri), a random state to recognise the answer, and the fingerprint.",
        msg: "GET /authorize\n  ?response_type=code\n  &client_id=agent-app\n  &redirect_uri=app.example/callback\n  &scope=calendar.read\n  &state=xyz123\n  &code_challenge=" + CHALLENGE + "\n  &code_challenge_method=S256" },
      { on: ["you", "auth"], title: "You sign in and approve", text: "You type your password into the sign-in server's own page. The app never sees it. The server shows what the app asks for (here: read your calendar) and you approve or refuse.",
        msg: "Sign-in server: \"agent-app wants to read your calendar. Allow?\"   [Allow]  [Deny]" },
      { on: ["auth", "app"], title: "The server sends you back with a one-time code", text: "The code is not a token. It is only good for one exchange, for a short time, and only together with the secret from step 1. The app checks that state is the one it sent.",
        msg: "302 -> app.example/callback\n  ?code=SplxlOBeZQQYbYS6WxSbIA\n  &state=xyz123" },
      { on: ["app", "auth"], title: "The app swaps the code for a token and proves it started the flow", text: "Now the app sends the code and the original verifier straight to the server, not through your browser. The server hashes the verifier and compares it with the fingerprint from step 2. A thief who only caught the code cannot do this.",
        msg: "POST /token\n  grant_type=authorization_code\n  code=SplxlOBeZQQYbYS6WxSbIA\n  redirect_uri=app.example/callback\n  client_id=agent-app\n  code_verifier=" + VERIFIER },
      { on: ["auth", "app"], title: "The server hands over a short-lived token", text: "The access token works only for the scope you approved and only for a short time. A refresh token lets the app ask for a new one later without bothering you again, until you revoke it.",
        msg: "{\n  \"access_token\": \"eyJhbGciOi...\",\n  \"token_type\": \"Bearer\",\n  \"expires_in\": 3600,\n  \"scope\": \"calendar.read\",\n  \"refresh_token\": \"8xLOxBtZp8\"\n}" },
      { on: ["app", "api"], title: "The app calls the service with the token", text: "The service checks the token and its scope. The token can read the calendar and nothing else, and it stops working in an hour. Your password was never part of this.",
        msg: "GET /calendar/events\nAuthorization: Bearer eyJhbGciOi..." }
    ];
    var actors = h("ol", { class: "dm-oa-actors", "aria-hidden": "true" }), title = h("h4", { class: "dm-tc-title" }), text = h("p", { class: "dm-tc-text", "aria-live": "polite" }), pre = h("pre", { class: "code dm-tc-pre" });
    var st = c.stepper(function (i) { at = i; draw(); });
    function draw() {
      var s = STEPS[at];
      c.sk.clear(actors);
      ACTORS.forEach(function (a) { actors.appendChild(h("li", { class: "dm-tc-actor" + (s.on.indexOf(a[0]) >= 0 ? " is-now" : "") }, a[1])); });
      title.textContent = (at + 1) + ". " + s.title;
      text.textContent = s.text;
      pre.textContent = s.msg;
      st.set(at, STEPS.length);
    }
    c.body.appendChild(st.el);
    c.body.appendChild(actors);
    c.body.appendChild(title);
    c.body.appendChild(text);
    c.body.appendChild(pre);
    draw();
  });
})();
