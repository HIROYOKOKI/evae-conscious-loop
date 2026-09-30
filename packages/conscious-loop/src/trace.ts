/** Ǝ — Trace */
import type { Trace, TraceHook } from "./types.js";

/** Legacy createLoop()/run() trace schema. */
export const TRACE_SCHEMA_VERSION = "0.1";

export function createTraceId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `trc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Deterministic JSON (sorted keys, no whitespace).
 * Hash this — not JSON.stringify — when adding tamper evidence,
 * so the same trace always produces the same digest.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(",")}}`;
}

export async function applyHooks(trace: Trace, hooks: TraceHook[] = []): Promise<Trace> {
  let current = trace;
  for (const hook of hooks) current = await hook(current);
  return current;
}
