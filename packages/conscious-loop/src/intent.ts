/** E — Intent */
import type { Intent, IntentInput } from "./types.js";

export function resolveIntent(input: IntentInput): Intent {
  const intent: Intent = typeof input === "string" ? { text: input } : input;
  if (!intent || typeof intent.text !== "string" || intent.text.trim() === "") {
    throw new TypeError("EVΛƎ: intent must be a non-empty string or { text }.");
  }
  return { text: intent.text.trim(), context: intent.context };
}
