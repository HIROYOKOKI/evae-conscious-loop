import { resolveIntent } from "./intent.js";
import { resolvePossibilities } from "./possibility.js";
import { describeBoundary, evaluateBoundary, explainDecision } from "./boundary.js";
import { applyHooks, createTraceId, TRACE_SCHEMA_VERSION } from "./trace.js";
import type { LoopOptions, RunInput, RunResult, Trace } from "./types.js";

export const VERSION = "0.1.0";

export interface ConsciousLoop {
  run(input: RunInput): Promise<RunResult>;
}

/**
 * E → V → Λ → Ǝ
 *
 * The loop decides; it does not act. Executing the decision is up to the caller.
 */
export function createLoop(options: LoopOptions = {}): ConsciousLoop {
  const now = options.now ?? (() => new Date());
  const createId = options.createId ?? createTraceId;

  return {
    async run(input: RunInput): Promise<RunResult> {
      const started = now();

      // E — Intent
      const intent = resolveIntent(input.intent);

      // V — Possibility
      const { possibilities, source } = await resolvePossibilities(input.possibilities, intent);

      // Λ — Decision Boundary
      const boundaryResult = await evaluateBoundary(input.boundary, intent, possibilities);
      const chosen = boundaryResult.within[0] ?? null;
      const reason = explainDecision(possibilities, boundaryResult, input.boundary);

      // Ǝ — Trace
      const trace: Trace = {
        trace_id: createId(),
        timestamp: started.toISOString(),
        intent: intent.text,
        ...(intent.context ? { intent_context: intent.context } : {}),
        possibilities,
        decision_boundary: describeBoundary(input.boundary, boundaryResult),
        decision: chosen?.id ?? null,
        reason,
        metadata: {
          ...input.metadata,
          schema_version: TRACE_SCHEMA_VERSION,
          library: `@evae/conscious-loop@${VERSION}`,
          possibility_source: source,
          duration_ms: now().getTime() - started.getTime(),
        },
      };
      const finalTrace = await applyHooks(trace, options.hooks);

      return {
        decision: finalTrace.decision,
        possibility: chosen,
        reason: finalTrace.reason,
        trace: finalTrace,
      };
    },
  };
}

/** Ready-to-use loop with default options. */
export const evae: ConsciousLoop = createLoop();
