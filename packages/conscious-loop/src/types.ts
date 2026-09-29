/**
 * EVΛƎ Conscious Loop — public types.
 *
 *   E  Intent             what is being attempted
 *   V  Possibility        what could be done
 *   Λ  Decision Boundary  what is allowed, and why
 *   Ǝ  Trace              what was decided, recorded as data
 */

/* ---------------------------------- E ---------------------------------- */

export interface Intent {
  /** Plain-language statement of what is being attempted. */
  text: string;
  /** Facts the boundary rules may need (roles, amounts, recipients, ...). */
  context?: Record<string, unknown>;
}

export type IntentInput = string | Intent;

/* ---------------------------------- V ---------------------------------- */

export interface Possibility {
  /** Stable identifier. Boundary rules refer to possibilities by id. */
  id: string;
  label: string;
  description?: string;
  attributes?: Record<string, unknown>;
}

/**
 * Something that produces possibilities for an intent — typically an LLM.
 * Order matters: the first possibility is the most preferred.
 */
export interface PossibilitySource {
  /** Recorded in the trace, e.g. "model:anthropic/claude-sonnet-4-6". */
  readonly name: string;
  generate(intent: Intent): Promise<Possibility[]>;
}

export type PossibilitiesInput =
  | ReadonlyArray<string | Possibility>
  | PossibilitySource;

/* ---------------------------------- Λ ---------------------------------- */

export interface RuleInput {
  intent: Intent;
  possibility: Possibility;
}

export type RuleOutcome = boolean | { pass: boolean; reason?: string };

export interface BoundaryRule {
  /** Stable identifier, recorded in the trace. */
  id: string;
  /** Human-readable statement of the rule, recorded in the trace. */
  description: string;
  /** Possibility ids this rule applies to. Omit to apply to all. */
  appliesTo?: string[];
  check(input: RuleInput): RuleOutcome | Promise<RuleOutcome>;
}

export interface DecisionBoundary {
  rules: BoundaryRule[];
}

export interface RuleEvaluation {
  possibility: string;
  rule: string;
  pass: boolean;
  reason?: string;
}

/* ---------------------------------- Ǝ ---------------------------------- */

export interface TraceBoundary {
  rules: { id: string; description: string; applies_to?: string[] }[];
  evaluations: RuleEvaluation[];
  /** Possibility ids that passed every applicable rule, in preference order. */
  within: string[];
}

export interface Trace {
  trace_id: string;
  /** ISO 8601, UTC. */
  timestamp: string;
  intent: string;
  intent_context?: Record<string, unknown>;
  possibilities: Possibility[];
  decision_boundary: TraceBoundary;
  /** Chosen possibility id, or null when nothing is within the boundary. */
  decision: string | null;
  reason: string;
  metadata: Record<string, unknown>;
  /**
   * Reserved for tamper evidence (hash, signature, audit chain).
   * Not populated by v0.1 core; filled by trace hooks.
   */
  integrity?: Record<string, unknown>;
}

/** Runs after a trace is built. Use to add hashes, signatures or chain links. */
export type TraceHook = (trace: Trace) => Trace | Promise<Trace>;

/* -------------------------------- Loop --------------------------------- */

export interface RunInput {
  intent: IntentInput;
  possibilities: PossibilitiesInput;
  boundary: DecisionBoundary;
  /** Copied into trace.metadata. */
  metadata?: Record<string, unknown>;
}

export interface RunResult {
  /** Chosen possibility id, or null when nothing is within the boundary. */
  decision: string | null;
  possibility: Possibility | null;
  reason: string;
  trace: Trace;
}

export interface LoopOptions {
  hooks?: TraceHook[];
  /** Override for tests / deterministic traces. */
  now?: () => Date;
  /** Override for tests / deterministic traces. */
  createId?: () => string;
}


/* ----------------------- Λ v0.2 Decision Boundary ---------------------- */

/** Final authorization state before an external action is executed. */
export type AuthorizationDecision = "EXECUTE" | "HOLD" | "BLOCK";

/**
 * A rule may explicitly distinguish a temporary/incomplete condition (HOLD)
 * from a prohibited condition (BLOCK). Boolean outcomes remain supported.
 */
export type DecisionRuleOutcome =
  | RuleOutcome
  | { decision: AuthorizationDecision; reason?: string; requirements?: string[] };

export interface DecisionRule extends Omit<BoundaryRule, "check"> {
  check(input: RuleInput): DecisionRuleOutcome | Promise<DecisionRuleOutcome>;
}

export interface DecisionPolicy {
  rules: DecisionRule[];
  /**
   * Decision when no rule blocks/holds the selected possibility.
   * Defaults to EXECUTE.
   */
  defaultDecision?: AuthorizationDecision;
}

export interface DecisionContext {
  /** Who or what has authority to authorize this action. */
  authority?: Record<string, unknown>;
  /** Evidence available at decision time. */
  evidence?: Record<string, unknown>;
  /** Additional policy/context facts used by callers or trace consumers. */
  context?: Record<string, unknown>;
}

export interface DecisionRuleEvaluation {
  possibility: string;
  rule: string;
  decision: AuthorizationDecision;
  reason?: string;
  requirements?: string[];
}

export interface DecisionTrace {
  status: AuthorizationDecision;
  selected_possibility: string | null;
  authority?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
  context?: Record<string, unknown>;
  evaluations: DecisionRuleEvaluation[];
  requirements: string[];
}

export interface EvaluateDecisionInput {
  intent: IntentInput;
  possibilities: PossibilitiesInput;
  policy: DecisionPolicy;
  decisionContext?: DecisionContext;
  metadata?: Record<string, unknown>;
}

export interface EvaluateDecisionResult {
  decision: AuthorizationDecision;
  possibility: Possibility | null;
  reason: string;
  requirements: string[];
  trace: Trace & { authorization: DecisionTrace };
}
