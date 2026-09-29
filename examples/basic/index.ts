/**
 * "Can the AI send this email automatically?"
 *
 *   E  Intent             send an email to an external client
 *   V  Possibility        a model proposes and ranks: send / ask_human / hold
 *   Λ  Decision Boundary  authority rules
 *   Ǝ  Trace              saved to ./traces/<trace_id>.json
 *
 * Runs offline by default. Set ANTHROPIC_API_KEY or OPENAI_API_KEY to use a real model.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { anthropic, evae, fromModel, mockModel, openai } from "evae-conscious-loop";

// V — pick a model. Any adapter works; the loop does not care which.
const model = process.env.ANTHROPIC_API_KEY
  ? anthropic()
  : process.env.OPENAI_API_KEY
    ? openai()
    : mockModel(
        JSON.stringify([
          { id: "send", label: "Send now", description: "The draft is complete and the client is waiting." },
          { id: "ask_human", label: "Ask a human", description: "An external send may need approval." },
          { id: "hold", label: "Hold", description: "Keep the draft until someone can review it." },
        ]),
        "mock",
      );
if (model.name === "mock") console.log("(offline mock model — set ANTHROPIC_API_KEY or OPENAI_API_KEY to use a real one)\n");

const result = await evae.run({
  // E — Intent
  intent: {
    text: "Send this quote email to the client automatically",
    context: {
      requested_by: "sales-assistant-bot",
      sender_role: "assistant",
      recipient_domain: "client.example.com",
      approver_on_duty: false,
    },
  },

  // V — Possibility
  possibilities: fromModel(model, {
    choices: [
      { id: "send", description: "send the email now" },
      { id: "ask_human", description: "route to a human approver" },
      { id: "hold", description: "keep as draft, send nothing" },
    ],
  }),

  // Λ — Decision Boundary
  boundary: {
    rules: [
      {
        id: "external-send-authority",
        description: "Only a human with the sender role may send to external domains",
        appliesTo: ["send"],
        check: ({ intent }) =>
          intent.context?.sender_role === "sender"
            ? true
            : { pass: false, reason: `sender_role is "${intent.context?.sender_role}", external send needs "sender"` },
      },
      {
        id: "approver-available",
        description: "Routing to a human requires an approver on duty",
        appliesTo: ["ask_human"],
        check: ({ intent }) =>
          intent.context?.approver_on_duty === true ? true : { pass: false, reason: "no approver is on duty" },
      },
    ],
  },

  metadata: { example: "basic" },
});

console.log("decision:", result.decision);
console.log("reason:  ", result.reason);

// Ǝ — Trace
mkdirSync("traces", { recursive: true });
const file = `traces/${result.trace.trace_id}.json`;
writeFileSync(file, JSON.stringify(result.trace, null, 2));
console.log("trace:   ", file);
