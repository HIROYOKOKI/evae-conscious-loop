import { resolveIntent } from "./intent.js";
import { resolvePossibilities } from "./possibility.js";
import { applyHooks, createTraceId, TRACE_SCHEMA_VERSION } from "./trace.js";
import type {
  AuthorizationDecision,
  DecisionRuleEvaluation,
  EvaluateDecisionInput,
  EvaluateDecisionResult,
  LoopOptions,
  Possibility,
  Trace,
} from "./types.js";

function rank(decision: AuthorizationDecision): number {
  return decision === "BLOCK" ? 2 : decision === "HOLD" ? 1 : 0;
}

function normalizeOutcome(
  outcome: boolean | { pass: boolean; reason?: string } | { decision: AuthorizationDecision; reason?: string; requirements?: string[] },
): { decision: AuthorizationDecision; reason?: string; requirements?: string[] } {
  if (typeof outcome === "boolean") return { decision: outcome ? "EXECUTE" : "BLOCK" };
  if ("decision" in outcome) return outcome;
  return { decision: outcome.pass ? "EXECUTE" : "BLOCK", ...(outcome.reason ? { reason: outcome.reason } : {}) };
}

/**
 * EVΛƎ v0.2 — evaluate authorization before execution.
 *
 * EXECUTE: requirements are satisfied.
 * HOLD:    not prohibited, but evidence/authority/review is incomplete.
 * BLOCK:   explicitly outside the permitted boundary.
 *
 * This function decides; it does not execute or enforce the action.
 */
export async function evaluateDecision(
  input: EvaluateDecisionInput,
  options: LoopOptions = {},
): Promise<EvaluateDecisionResult> {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? createTraceId;
  const started = now();
  const intent = resolveIntent(input.intent);
  const { possibilities, source } = await resolvePossibilities(input.possibilities, intent);

  if (!input.policy || !Array.isArray(input.policy.rules)) {
    throw new TypeError("EVΛƎ: policy.rules must be an array.");
  }

  let selected: Possibility | null = null;
  let selectedDecision: AuthorizationDecision = "BLOCK";
  let selectedEvaluations: DecisionRuleEvaluation[] = [];
  let selectedRequirements: string[] = [];
  const allEvaluations: DecisionRuleEvaluation[] = [];

  for (const possibility of possibilities) {
    let status: AuthorizationDecision = input.policy.defaultDecision ?? "EXECUTE";
    const evaluations: DecisionRuleEvaluation[] = [];
    const requirements = new Set<string>();

    for (const rule of input.policy.rules) {
      if (rule.appliesTo && !rule.appliesTo.includes(possibility.id)) continue;
      let normalized: { decision: AuthorizationDecision; reason?: string; requirements?: string[] };
      try {
        normalized = normalizeOutcome(await rule.check({ intent, possibility }));
      } catch (err) {
        // Evaluation failure is uncertainty, not proof of prohibition.
        normalized = {
          decision: "HOLD",
          reason: `rule error: ${err instanceof Error ? err.message : String(err)}`,
          requirements: ["rule_evaluation"],
        };
      }
      const evaluation: DecisionRuleEvaluation = {
        possibility: possibility.id,
        rule: rule.id,
        decision: normalized.decision,
        ...(normalized.reason ? { reason: normalized.reason } : {}),
        ...(normalized.requirements?.length ? { requirements: [...normalized.requirements] } : {}),
      };
      evaluations.push(evaluation);
      allEvaluations.push(evaluation);
      normalized.requirements?.forEach((r) => requirements.add(r));
      if (rank(normalized.decision) > rank(status)) status = normalized.decision;
    }

    // Preserve preference order: first non-BLOCK possibility becomes the candidate.
    if (!selected && status !== "BLOCK") {
      selected = possibility;
      selectedDecision = status;
      selectedEvaluations = evaluations;
      selectedRequirements = [...requirements];
    }
  }

  const decision = selected ? selectedDecision : "BLOCK";
  const reason = selected
    ? decision === "EXECUTE"
      ? `"${selected.id}" is authorized for execution.`
      : `"${selected.id}" is on HOLD pending: ${selectedRequirements.join(", ") || "additional authorization evidence"}.`
    : "No possibility is authorized within the decision boundary.";

  const baseTrace: Trace = {
    trace_id: createId(),
    timestamp: started.toISOString(),
    intent: intent.text,
    ...(intent.context ? { intent_context: intent.context } : {}),
    possibilities,
    decision_boundary: {
      rules: input.policy.rules.map((r) => ({
        id: r.id,
        description: r.description,
        ...(r.appliesTo ? { applies_to: [...r.appliesTo] } : {}),
      })),
      evaluations: allEvaluations.map((e) => ({
        possibility: e.possibility,
        rule: e.rule,
        pass: e.decision === "EXECUTE",
        ...(e.reason ? { reason: e.reason } : {}),
      })),
      within: selected ? [selected.id] : [],
    },
    decision: selected?.id ?? null,
    reason,
    metadata: {
      ...input.metadata,
      schema_version: "0.2",
      library: "evae-conscious-loop@0.2.0",
      possibility_source: source,
      duration_ms: now().getTime() - started.getTime(),
    },
  };

  const authorization = {
    status: decision,
    selected_possibility: selected?.id ?? null,
    ...(input.decisionContext?.authority ? { authority: input.decisionContext.authority } : {}),
    ...(input.decisionContext?.evidence ? { evidence: input.decisionContext.evidence } : {}),
    ...(input.decisionContext?.context ? { context: input.decisionContext.context } : {}),
    evaluations: selected ? selectedEvaluations : allEvaluations,
    requirements: selectedRequirements,
  };

  const hooked = await applyHooks({ ...baseTrace, authorization } as Trace, options.hooks);
  const trace = { ...hooked, authorization } as EvaluateDecisionResult["trace"];

  return { decision, possibility: selected, reason: trace.reason, requirements: selectedRequirements, trace };
}
