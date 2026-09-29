import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalize, createLoop, fromModel, mockModel } from "../src/index.ts";

const fixed = { now: () => new Date("2026-01-01T00:00:00Z"), createId: () => "trc-test" };

test("picks the most preferred possibility within the boundary", async () => {
  const loop = createLoop(fixed);
  const r = await loop.run({
    intent: { text: "Send payment request", context: { role: "staff" } },
    possibilities: ["send automatically", "request human approval", "do not send"],
    boundary: {
      rules: [
        {
          id: "auto-send-needs-manager",
          description: "Automatic sending requires the manager role",
          appliesTo: ["send_automatically"],
          check: ({ intent }) => intent.context?.role === "manager",
        },
      ],
    },
  });
  assert.equal(r.decision, "request_human_approval");
  assert.deepEqual(r.trace.decision_boundary.within, ["request_human_approval", "do_not_send"]);
  assert.match(r.reason, /send_automatically/);
  assert.equal(r.trace.trace_id, "trc-test");
  assert.equal(r.trace.metadata.possibility_source, "static");
});

test("decision is null when nothing is within the boundary", async () => {
  const r = await createLoop(fixed).run({
    intent: "Delete production database",
    possibilities: ["delete now"],
    boundary: { rules: [{ id: "never", description: "Never delete production", check: () => false }] },
  });
  assert.equal(r.decision, null);
  assert.equal(r.possibility, null);
  assert.match(r.reason, /No possibility/);
});

test("a throwing rule does not pass", async () => {
  const r = await createLoop(fixed).run({
    intent: "x",
    possibilities: ["a", "b"],
    boundary: {
      rules: [{ id: "boom", description: "d", appliesTo: ["a"], check: () => { throw new Error("bad"); } }],
    },
  });
  assert.equal(r.decision, "b");
  assert.match(r.trace.decision_boundary.evaluations[0].reason ?? "", /rule error: bad/);
});

test("model source: keeps allowed ids, drops invented ones, records source", async () => {
  const model = mockModel(
    '```json\n[{"id":"wire_money","label":"x"},{"id":"hold","label":"Hold","description":"safe"},{"id":"send","label":"Send"}]\n```',
    "mock/test",
  );
  const r = await createLoop(fixed).run({
    intent: "Send this email?",
    possibilities: fromModel(model, { choices: ["send", "ask_human", "hold"] }),
    boundary: { rules: [] },
  });
  assert.deepEqual(r.trace.possibilities.map((p) => p.id), ["hold", "send"]);
  assert.equal(r.decision, "hold");
  assert.equal(r.trace.metadata.possibility_source, "model:mock/test");
});

test("hooks can add integrity data; canonicalize is key-order independent", async () => {
  const r = await createLoop({
    ...fixed,
    hooks: [(t) => ({ ...t, integrity: { note: canonicalize({ b: 1, a: 2 }) } })],
  }).run({ intent: "x", possibilities: ["a"], boundary: { rules: [] } });
  assert.equal(r.trace.integrity?.note, '{"a":2,"b":1}');
  assert.equal(canonicalize({ a: 1, b: [2, { d: 1, c: 0 }] }), canonicalize({ b: [2, { c: 0, d: 1 }], a: 1 }));
});
