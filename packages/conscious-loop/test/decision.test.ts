import { test } from "node:test";
import assert from "node:assert/strict";
import { createLoop, evaluateDecision } from "../src/index.ts";

const fixed = { now: () => new Date("2026-09-30T00:00:00Z"), createId: () => "trc-v02" };
import type { DecisionPolicy, DecisionRule } from "../src/types.ts";

const policy = (rules: DecisionRule[] = [], extra: Partial<DecisionPolicy> = {}): DecisionPolicy => ({ id: "test-policy", version: "1", rules, ...extra });

test("EXECUTE only when a rule explicitly authorizes", async () => {
  const r = await evaluateDecision({
    intent: "Send invoice", possibilities: ["send invoice"],
    policy: policy([{ id:"authority", description:"authorized manager", check: ({context}) =>
      context.authority?.role === "manager" ? {decision:"EXECUTE"} : {decision:"HOLD", requirements:["manager_authority"]} }]),
    decisionContext: { authority: { role:"manager" }, evidence:{ approval_id:"A-1" } },
  }, fixed);
  assert.equal(r.decision, "EXECUTE");
  assert.equal(r.trace.decision, "send_invoice");
  assert.equal(r.trace.authorization.authority?.role, "manager");
  assert.equal(r.trace.authorization.policy.version, "1");
  assert.ok(r.trace.authorization.subject);
});

test("no applicable rule defaults to HOLD", async () => {
  const r = await evaluateDecision({ intent:"x", possibilities:["send"], policy:policy([]) }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.equal(r.trace.decision, null);
  assert.deepEqual(r.requirements, ["no_applicable_rule"]);
});

test("invalid runtime decision fails closed to BLOCK", async () => {
  const r = await evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:policy([{ id:"typo", description:"bad runtime value", check: () => ({decision:"Block"} as never) }]),
  }, fixed);
  assert.equal(r.decision, "BLOCK");
  assert.equal(r.trace.decision, null);
  assert.match(r.trace.authorization.candidates[0].evaluations[0].reason ?? "", /invalid decision/);
});

test("rule errors default to BLOCK", async () => {
  const r = await evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:policy([{ id:"sanctions", description:"must verify", check: () => { throw new Error("timeout"); } }]),
  }, fixed);
  assert.equal(r.decision, "BLOCK");
});

test("rule can explicitly choose HOLD on error", async () => {
  const r = await evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:policy([{ id:"reviewable", description:"reviewable failure", onError:"HOLD", check: () => { throw new Error("offline"); } }]),
  }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.deepEqual(r.requirements, ["rule_evaluation"]);
});

test("BLOCKed preferred candidate remains in authorization evidence", async () => {
  const r = await evaluateDecision({
    intent:"choose", possibilities:["automatic","ask human"],
    policy:policy([
      { id:"no-auto", description:"no automatic", appliesTo:["automatic"], check:()=>({decision:"BLOCK",reason:"prohibited"}) },
      { id:"human", description:"human allowed", appliesTo:["ask_human"], check:()=>({decision:"EXECUTE"}) },
    ]),
  }, fixed);
  assert.equal(r.decision, "EXECUTE");
  assert.equal(r.possibility?.id, "ask_human");
  assert.equal(r.trace.authorization.candidates[0].status, "BLOCK");
  assert.match(r.trace.authorization.candidates[0].evaluations[0].reason ?? "", /prohibited/);
});

test("HOLD preserves preference over later EXECUTE candidate", async () => {
  const r = await evaluateDecision({
    intent:"choose", possibilities:["send","stop"],
    policy:policy([
      { id:"review", description:"review", appliesTo:["send"], check:()=>({decision:"HOLD",requirements:["human_approval"]}) },
      { id:"stop", description:"stop allowed", appliesTo:["stop"], check:()=>({decision:"EXECUTE"}) },
    ]),
  }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.equal(r.possibility?.id, "send");
  assert.equal(r.trace.decision, null);
});

test("hooks preserve authorization and can add integrity", async () => {
  const r = await evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:policy([{ id:"ok", description:"ok", check:()=>({decision:"EXECUTE"}) }]),
  }, { ...fixed, hooks:[(t)=>({...t, integrity:{signed:true}, authorization:{...t.authorization!, context:{hooked:true}}})] });
  assert.equal(r.trace.integrity?.signed, true);
  assert.equal(r.trace.authorization.context?.hooked, true);
});

test("empty possibilities returns HOLD", async () => {
  const r = await evaluateDecision({ intent:"x", possibilities:[], policy:policy([]) }, fixed);
  assert.equal(r.decision, "HOLD");
  assert.deepEqual(r.requirements, ["no_possibility"]);
});

test("legacy run keeps schema 0.1", async () => {
  const r = await createLoop(fixed).run({ intent:"x", possibilities:["a"], boundary:{rules:[]} });
  assert.equal(r.trace.metadata.schema_version, "0.1");
});


test("boolean true rule explicitly authorizes EXECUTE", async () => {
  const r = await evaluateDecision({ intent:"x", possibilities:["send"], policy:policy([
    { id:"ok", description:"explicit true", check:()=>true },
  ]) }, fixed);
  assert.equal(r.decision, "EXECUTE");
});

test("unsafe fallback and error configuration is rejected at runtime", async () => {
  for (const bad of [
    { defaultDecision:"EXECUTE" },
    { defaultDecision:"ALLOW" },
    { onRuleError:"EXECUTE" },
  ]) {
    await assert.rejects(() => evaluateDecision({
      intent:"x", possibilities:["send"],
      policy:{ id:"p", version:"1", rules:[], ...bad } as unknown as DecisionPolicy,
    }, fixed), /invalid policy/);
  }
  await assert.rejects(() => evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:{ id:"p", version:"1", rules:[
      { id:"bad", description:"bad", onError:"EXECUTE", check:()=>{ throw new Error("x"); } },
    ] } as unknown as DecisionPolicy,
  }, fixed), /onError/);
});

test("invalid ttl and appliesTo configuration is rejected", async () => {
  for (const ttlMs of [0, -1, Number.NaN]) {
    await assert.rejects(() => evaluateDecision({
      intent:"x", possibilities:["send"], policy:policy([], { ttlMs }),
    }, fixed), /ttlMs/);
  }
  await assert.rejects(() => evaluateDecision({
    intent:"x", possibilities:["send"],
    policy:{ id:"p", version:"1", rules:[
      { id:"bad", description:"bad", appliesTo:"send", check:()=>true },
    ] } as unknown as DecisionPolicy,
  }, fixed), /appliesTo/);
});
