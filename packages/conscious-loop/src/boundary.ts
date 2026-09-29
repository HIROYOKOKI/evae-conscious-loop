/** Λ — Decision Boundary */
import type {
  DecisionBoundary,
  Intent,
  Possibility,
  RuleEvaluation,
  TraceBoundary,
} from "./types.js";

export interface BoundaryResult {
  evaluations: RuleEvaluation[];
  /** Possibilities that passed every applicable rule, in preference order. */
  within: Possibility[];
}

export async function evaluateBoundary(
  boundary: DecisionBoundary,
  intent: Intent,
  possibilities: Possibility[],
): Promise<BoundaryResult> {
  if (!boundary || !Array.isArray(boundary.rules)) {
    throw new TypeError("EVΛƎ: boundary.rules must be an array.");
  }
  const evaluations: RuleEvaluation[] = [];
  const within: Possibility[] = [];

  for (const possibility of possibilities) {
    let ok = true;
    for (const rule of boundary.rules) {
      if (rule.appliesTo && !rule.appliesTo.includes(possibility.id)) continue;
      let pass: boolean;
      let reason: string | undefined;
      try {
        const outcome = await rule.check({ intent, possibility });
        if (typeof outcome === "boolean") {
          pass = outcome;
        } else {
          pass = Boolean(outcome?.pass);
          reason = outcome?.reason;
        }
      } catch (err) {
        // A rule that cannot be evaluated does not pass.
        pass = false;
        reason = `rule error: ${err instanceof Error ? err.message : String(err)}`;
      }
      evaluations.push({ possibility: possibility.id, rule: rule.id, pass, ...(reason ? { reason } : {}) });
      if (!pass) ok = false;
    }
    if (ok) within.push(possibility);
  }
  return { evaluations, within };
}

export function describeBoundary(
  boundary: DecisionBoundary,
  result: BoundaryResult,
): TraceBoundary {
  return {
    rules: boundary.rules.map((r) => ({
      id: r.id,
      description: r.description,
      ...(r.appliesTo ? { applies_to: [...r.appliesTo] } : {}),
    })),
    evaluations: result.evaluations,
    within: result.within.map((p) => p.id),
  };
}

/** Explains the outcome in one sentence, for trace.reason. */
export function explainDecision(
  possibilities: Possibility[],
  result: BoundaryResult,
  boundary: DecisionBoundary,
): string {
  const chosen = result.within[0];
  const describe = (ruleId: string) =>
    boundary.rules.find((r) => r.id === ruleId)?.description ?? ruleId;

  const blocked = possibilities
    .slice(0, chosen ? possibilities.indexOf(chosen) : possibilities.length)
    .map((p) => {
      const failed = result.evaluations.filter((e) => e.possibility === p.id && !e.pass);
      const why = failed.map((e) => e.reason ?? describe(e.rule)).join("; ");
      return `"${p.id}" is outside the boundary (${why})`;
    });

  if (!chosen) {
    return blocked.length
      ? `No possibility is within the decision boundary: ${blocked.join(". ")}.`
      : "No possibilities were provided.";
  }
  const prefix = blocked.length ? `${blocked.join(". ")}. ` : "";
  return `${prefix}"${chosen.id}" is the most preferred possibility within the decision boundary.`;
}
