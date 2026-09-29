import { resolveIntent } from "./intent.js";
import { resolvePossibilities } from "./possibility.js";
import { applyHooks, canonicalize, createTraceId } from "./trace.js";
import { VERSION } from "./loop.js";
import type {
  AuthorizationCandidate, AuthorizationDecision, DecisionRuleEvaluation,
  EvaluateDecisionInput, EvaluateDecisionResult, LoopOptions, Possibility, Trace,
} from "./types.js";

export const DECISION_SCHEMA_VERSION = "0.2";
const VALID = new Set<AuthorizationDecision>(["EXECUTE", "HOLD", "BLOCK"]);

function rank(d: AuthorizationDecision): number {
  if (!VALID.has(d)) throw new TypeError(`invalid decision: ${JSON.stringify(d)}`);
  return d === "BLOCK" ? 2 : d === "HOLD" ? 1 : 0;
}

function normalizeOutcome(outcome: unknown): { decision: AuthorizationDecision; reason?: string; requirements?: string[] } {
  if (typeof outcome === "boolean") return { decision: outcome ? "EXECUTE" : "BLOCK" };
  if (!outcome || typeof outcome !== "object") throw new TypeError("rule returned no outcome");
  if ("decision" in outcome) {
    const raw = outcome as { decision?: unknown; reason?: unknown; requirements?: unknown };
    if (typeof raw.decision !== "string" || !VALID.has(raw.decision as AuthorizationDecision)) {
      throw new TypeError(`invalid decision: ${JSON.stringify(raw.decision)}`);
    }
    return {
      decision: raw.decision as AuthorizationDecision,
      ...(typeof raw.reason === "string" ? { reason: raw.reason } : {}),
      ...(Array.isArray(raw.requirements) ? { requirements: raw.requirements.filter((x): x is string => typeof x === "string") } : {}),
    };
  }
  if ("pass" in outcome) {
    const raw = outcome as { pass?: unknown; reason?: unknown };
    if (typeof raw.pass !== "boolean") throw new TypeError("invalid pass outcome");
    return { decision: raw.pass ? "EXECUTE" : "BLOCK", ...(typeof raw.reason === "string" ? { reason: raw.reason } : {}) };
  }
  throw new TypeError("rule returned no outcome");
}

export async function evaluateDecision(input: EvaluateDecisionInput, options: LoopOptions = {}): Promise<EvaluateDecisionResult> {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? createTraceId;
  const started = now();
  const intent = resolveIntent(input.intent);
  const { possibilities, source } = await resolvePossibilities(input.possibilities, intent);
  if (!input.policy || !Array.isArray(input.policy.rules)) throw new TypeError("EVΛƎ: policy.rules must be an array.");
  if (!input.policy.id || !input.policy.version) throw new TypeError("EVΛƎ: policy.id and policy.version are required.");

  const decisionContext = input.decisionContext ?? {};
  const candidates: AuthorizationCandidate[] = [];

  for (const possibility of possibilities) {
    let status: AuthorizationDecision = input.policy.defaultDecision ?? "HOLD";
    const evaluations: DecisionRuleEvaluation[] = [];
    const requirements = new Set<string>();
    let applicable = 0;

    for (const rule of input.policy.rules) {
      if (rule.appliesTo && !rule.appliesTo.includes(possibility.id)) continue;
      applicable++;
      let normalized;
      try {
        normalized = normalizeOutcome(await rule.check({ intent, possibility, context: decisionContext }));
      } catch (err) {
        normalized = {
          decision: rule.onError ?? input.policy.onRuleError ?? "BLOCK",
          reason: `rule error: ${err instanceof Error ? err.message : String(err)}`,
          requirements: ["rule_evaluation"],
        } as const;
      }
      const ev: DecisionRuleEvaluation = {
        possibility: possibility.id, rule: rule.id, decision: normalized.decision,
        ...(normalized.reason ? { reason: normalized.reason } : {}),
        ...(normalized.requirements?.length ? { requirements: [...normalized.requirements] } : {}),
      };
      evaluations.push(ev);
      normalized.requirements?.forEach((r) => requirements.add(r));
      if (rank(normalized.decision) > rank(status)) status = normalized.decision;
    }
    if (applicable === 0 && input.policy.defaultDecision === undefined) requirements.add("no_applicable_rule");
    candidates.push({ possibility: possibility.id, status, evaluations, requirements: [...requirements] });
  }

  // Preference semantics: the first non-BLOCK candidate wins, even if HOLD.
  const selectedCandidate = candidates.find((c) => c.status !== "BLOCK") ?? null;
  const selected = selectedCandidate ? possibilities.find((p) => p.id === selectedCandidate.possibility) ?? null : null;
  const decision: AuthorizationDecision = selectedCandidate?.status ?? (possibilities.length === 0 ? "HOLD" : "BLOCK");
  const requirements = selectedCandidate?.requirements ?? (possibilities.length === 0 ? ["no_possibility"] : []);
  const reason = !selected
    ? decision === "HOLD" ? "No possibility was provided; authorization is on HOLD." : "No possibility is authorized within the decision boundary."
    : decision === "EXECUTE" ? `"${selected.id}" is authorized for execution.`
    : `"${selected.id}" is on HOLD pending: ${requirements.join(", ") || "additional authorization evidence"}.`;

  const subject = selected ? canonicalize({ intent, possibility: selected, context: decisionContext }) : null;
  const authorization = {
    status: decision,
    selected_possibility: selected?.id ?? null,
    ...(decisionContext.authority ? { authority: decisionContext.authority } : {}),
    ...(decisionContext.evidence ? { evidence: decisionContext.evidence } : {}),
    ...(decisionContext.context ? { context: decisionContext.context } : {}),
    policy: { id: input.policy.id, version: input.policy.version },
    subject,
    issued_at: started.toISOString(),
    ...(input.policy.ttlMs ? { expires_at: new Date(started.getTime() + input.policy.ttlMs).toISOString() } : {}),
    candidates,
    evaluations: candidates.flatMap((c) => c.evaluations),
    requirements,
  };

  const baseTrace: Trace = {
    trace_id: createId(), timestamp: started.toISOString(), intent: intent.text,
    ...(intent.context ? { intent_context: intent.context } : {}), possibilities,
    decision_boundary: {
      rules: input.policy.rules.map((r) => ({ id: r.id, description: r.description, ...(r.appliesTo ? { applies_to: [...r.appliesTo] } : {}) })),
      evaluations: candidates.flatMap((c) => c.evaluations).map((e) => ({ possibility: e.possibility, rule: e.rule, pass: e.decision === "EXECUTE", ...(e.reason ? { reason: e.reason } : {}) })),
      within: candidates.filter((c) => c.status === "EXECUTE").map((c) => c.possibility),
    },
    // Legacy meaning: only an executable action appears in trace.decision.
    decision: decision === "EXECUTE" ? selected?.id ?? null : null,
    reason,
    metadata: { ...input.metadata, schema_version: DECISION_SCHEMA_VERSION, library: `evae-conscious-loop@${VERSION}`, possibility_source: source, duration_ms: now().getTime() - started.getTime() },
    authorization,
  };
  const trace = await applyHooks(baseTrace, options.hooks) as EvaluateDecisionResult["trace"];
  return { decision, possibility: selected, reason: trace.reason, requirements, trace };
}
