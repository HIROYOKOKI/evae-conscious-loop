import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateDecision } from "../src/index.ts";

const fixed = { now: () => new Date("2026-09-30T00:00:00Z"), createId: () => "trc-v02" };

test("EXECUTE when authorization requirements pass", async () => {
  const r = await evaluateDecision({
    intent: "Send approved invoice",
    possibilities: ["send invoice"],
    policy: { rules: [{
      id: "authority",
      description: "Sender must be authorized",
      check: () => ({ decision: "EXECUTE", reason: "manager approved" }),
    }] },
    decisionContext: { authority: { role: "manager" }, evidence: { approval_id: "A-1" } },
  }, fixed);
  assert.equal(r.decision, "EXECUTE");
  assert.equal(r.trace.authorization.status, "EXECUTE");
  assert.equal(r.trace.authorization.authority?.role, "manager");
});

test("HOLD when evidence or human approval is missing", async () => {
  const r = await evaluateDecision({
    intent: "Send payment",
    possibilities: ["send payment"],
    policy: { rules: [{
      id: "approval",
      description: "Payment requires approval evidence",
      check: () => ({ decision: "HOLD", reason: "approval missing", requirements: ["human_approval"] }),
    }] },
  }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.deepEqual(r.requirements, ["human_approval"]);
  assert.match(r.reason, /HOLD/);
});

test("BLOCK when action is explicitly prohibited", async () => {
  const r = await evaluateDecision({
    intent: "Export restricted data",
    possibilities: ["export data"],
    policy: { rules: [{
      id: "restricted-data",
      description: "Restricted data cannot be exported",
      check: () => ({ decision: "BLOCK", reason: "policy prohibition" }),
    }] },
  }, fixed);
  assert.equal(r.decision, "BLOCK");
  assert.equal(r.possibility, null);
});

test("rule errors become HOLD, not BLOCK", async () => {
  const r = await evaluateDecision({
    intent: "Take external action",
    possibilities: ["act"],
    policy: { rules: [{
      id: "evidence-service",
      description: "Evidence service must be available",
      check: () => { throw new Error("service unavailable"); },
    }] },
  }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.deepEqual(r.requirements, ["rule_evaluation"]);
  assert.match(r.trace.authorization.evaluations[0].reason ?? "", /service unavailable/);
});

test("preference order is preserved while BLOCKed options are skipped", async () => {
  const r = await evaluateDecision({
    intent: "Choose action",
    possibilities: ["automatic", "ask human", "stop"],
    policy: { rules: [
      { id: "no-auto", description: "No automatic action", appliesTo: ["automatic"], check: () => ({ decision: "BLOCK" }) },
      { id: "review", description: "Human review required", appliesTo: ["ask_human"], check: () => ({ decision: "HOLD", requirements: ["human_approval"] }) },
    ] },
  }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.equal(r.possibility?.id, "ask_human");
});
