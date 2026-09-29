# EVΛƎ Conscious Loop

Structure an AI decision **before execution**, and keep the reason as data.

```
E  Intent             what is being attempted
V  Possibility        what could be done
Λ  Decision Boundary  what is allowed, and why
Ǝ  Trace              what was decided, recorded as JSON
```

A small, model-agnostic TypeScript library. MIT licensed. No runtime dependencies.

**Playground:** https://evae-conscious-loop.vercel.app/playground · **Source:** https://github.com/HIROYOKOKI/evae-conscious-loop

---

## Quick Start

Requires Node.js 18+. Install the library in your own app:

```bash
npm install evae-conscious-loop
```

Then save the example below as `example.mjs` and run `node example.mjs`. No API key is needed for this first run. The [repository example](https://github.com/HIROYOKOKI/evae-conscious-loop/tree/main/examples/basic) can also run offline and write a trace JSON file.

---

## Use it in your app

Save this as `example.mjs` in your app, then run `node example.mjs`:

```js
import { evae } from "evae-conscious-loop";

const result = await evae.run({
  // E — Intent
  intent: {
    text: "Send payment request",
    context: { role: "staff", amount: 120000 },
  },

  // V — Possibility (most preferred first)
  possibilities: ["send automatically", "request human approval", "do not send"],

  // Λ — Decision Boundary
  boundary: {
    rules: [
      {
        id: "auto-send-limit",
        description: "Automatic sending is allowed only up to 100,000",
        appliesTo: ["send_automatically"],
        check: ({ intent }) =>
          Number(intent.context?.amount) <= 100000
            ? true
            : { pass: false, reason: "amount exceeds the automatic limit" },
      },
    ],
  },
});

console.log(result.decision); // "request_human_approval"
console.log(result.trace);    // Ǝ — JSON you can store anywhere
```

How a decision is made:

1. Possibilities are kept in preference order. String possibilities get an id (`"send automatically"` → `send_automatically`).
2. Every rule is evaluated against every possibility it applies to. A rule that throws does not pass.
3. The decision is the **most preferred possibility that passes every applicable rule**.
4. If nothing passes, `decision` is `null`.

**Default is allow:** a possibility with no applicable rules passes the boundary. Define rules for every consequential option. A decision here does not grant execution authority; your application remains responsible for what happens next.

**The loop decides; it does not act.** Executing (or not executing) the decision is up to your application.

### Let a model propose the possibilities

```ts
import { evae, fromModel, anthropic } from "evae-conscious-loop";

const result = await evae.run({
  intent: "Send this quote email to the client automatically",
  possibilities: fromModel(anthropic(), {
    choices: ["send", "ask_human", "hold"],
  }),
  boundary: { rules: [/* ... */] },
});
```

The model proposes and ranks; it may only use the ids you allow, so your boundary rules stay stable. Invented ids are dropped.

### Model adapters

The core never calls a model directly. Any model works through one interface:

```ts
interface ModelAdapter {
  name: string;
  complete(req: { system: string; prompt: string }): Promise<string>;
}
```

Included in v0.1 (`fetch`-based, no SDKs):

| Adapter | Covers |
| --- | --- |
| `anthropic()` | Anthropic Messages API |
| `openai({ baseUrl })` | OpenAI and any OpenAI-compatible server, including local models (Ollama, LM Studio, vLLM) |
| `mockModel(text)` | Offline tests and demos |

Gemini or anything else: implement `complete()` — about 20 lines.

---

## Trace schema (v0.1)

```json
{
  "trace_id": "uuid",
  "timestamp": "ISO 8601, UTC",
  "intent": "Send this quote email to the client automatically",
  "intent_context": { "sender_role": "assistant", "approver_on_duty": false },
  "possibilities": [
    { "id": "send", "label": "Send now", "description": "..." },
    { "id": "ask_human", "label": "Ask a human" },
    { "id": "hold", "label": "Hold" }
  ],
  "decision_boundary": {
    "rules": [{ "id": "external-send-authority", "description": "...", "applies_to": ["send"] }],
    "evaluations": [{ "possibility": "send", "rule": "external-send-authority", "pass": false, "reason": "..." }],
    "within": ["hold"]
  },
  "decision": "hold",
  "reason": "...",
  "metadata": {
    "schema_version": "0.1",
    "library": "evae-conscious-loop@0.1.0",
    "possibility_source": "model:anthropic/claude-sonnet-4-6",
    "duration_ms": 812
  }
}
```

### Extending the trace: hash, signature, audit chain

v0.1 does not sign or hash traces. It is designed so you can add that without changing the schema:

- `integrity` is a reserved, optional field (not set by v0.1 core).
- `canonicalize(trace)` gives deterministic JSON (sorted keys), so the same trace always hashes the same way.
- **Trace hooks** run after each trace is built and can add anything to `integrity`.

```ts
import { createHash } from "node:crypto";
import { createLoop, canonicalize } from "evae-conscious-loop";

let previous: string | null = null;

const loop = createLoop({
  hooks: [
    (trace) => {
      const hash = createHash("sha256").update(canonicalize(trace)).digest("hex");
      const chained = { ...trace, integrity: { alg: "sha256", hash, prev: previous } };
      previous = hash;
      return chained;
    },
  ],
});
```

---

## Repository layout

```
packages/conscious-loop/   the library (evae-conscious-loop)
  src/intent.ts            E  Intent
  src/possibility.ts       V  Possibility
  src/boundary.ts          Λ  Decision Boundary
  src/trace.ts             Ǝ  Trace
  src/loop.ts              E → V → Λ → Ǝ
  src/adapters/            model adapters
  test/
examples/basic/            runnable example
app/playground/            Developer Playground (uses the library)
app/demo/                  Reference Demo (concept screens, fixed data)
```

```bash
npm test          # library tests
npm run example   # run examples/basic
npm run dev       # playground + reference demo at http://localhost:3000
```

---

## Open source scope

**Included — MIT**

- Conscious Loop (Ec → Vc → Λc → Ǝc)
- E / V / Λ / Ǝ interfaces
- Trace schema
- Basic Decision Boundary interface
- Reference implementation
- Playground, demo, examples

**Not included**

- Action Loop
- Runtime enforcement
- EXECUTE / HOLD / BLOCK enforcement engine
- Enterprise approval workflow
- Production thresholds
- Enterprise policy engine
- EVΛƎ ARMOR commercial components

These are part of the commercial EVΛƎ runtime (private).

The Action Loop exists as a separate commercial runtime layer and is intentionally not disclosed in this open-source repository.

The Action Loop is the commercial runtime layer that carries an approved decision toward controlled execution, while preserving authority, enforcement, and traceability.

The Conscious Loop is complete on its own: it produces a decision and a trace you can store and audit. Enforcing that decision at runtime, across systems and teams, is where the commercial components come in.

---

## Patent pending and commercial use

**Patent pending.** The EVΛƎ Framework and related architecture are subject to pending patent applications.

The software contained in this repository — EVΛƎ Conscious Loop v0.1 — is released under the MIT License. Commercial use of this MIT-licensed code is permitted under the terms of that license.

The MIT-licensed repository does **not** include access to proprietary EVΛƎ commercial components, including:

- Action Loop
- Runtime enforcement and the EXECUTE / HOLD / BLOCK enforcement engine
- EVΛƎ ARMOR
- Enterprise approval workflows
- Production thresholds and enterprise policy engine
- Enterprise integration, support, and certification services

Use of those proprietary components or services requires a separate commercial agreement with Amuletplus G.K.

EVΛƎ is a registered trademark in Japan in Classes 16, 25, and 42. Use of the EVΛƎ name, logos, or claims of certification, endorsement, or official partnership is separate from the MIT-licensed software and may require permission from Amuletplus G.K.

This notice does not modify the terms of the MIT License.

---

## About

**EVΛƎ (Eva)** — Design-by-Transparency for AI.

Created by Hiro Yokoki, Founder, Amuletplus G.K. (Tokyo). For collaboration or commercial inquiries, connect via LinkedIn.

MIT License.
