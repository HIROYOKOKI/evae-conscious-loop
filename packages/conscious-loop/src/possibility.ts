/** V — Possibility */
import type {
  Intent,
  Possibility,
  PossibilitiesInput,
  PossibilitySource,
} from "./types.js";

/** "Send automatically" -> "send_automatically" */
export function toId(label: string): string {
  const id = label
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
  return id || "possibility";
}

export function isPossibilitySource(x: unknown): x is PossibilitySource {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as PossibilitySource).generate === "function"
  );
}

export function normalizePossibilities(
  items: ReadonlyArray<string | Possibility>,
): Possibility[] {
  const seen = new Set<string>();
  const out: Possibility[] = [];
  for (const item of items) {
    const p: Possibility =
      typeof item === "string" ? { id: toId(item), label: item } : { ...item };
    if (!p.id) p.id = toId(p.label ?? "");
    if (!p.label) p.label = p.id;
    if (seen.has(p.id)) continue; // first occurrence keeps its preference rank
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export async function resolvePossibilities(
  input: PossibilitiesInput,
  intent: Intent,
): Promise<{ possibilities: Possibility[]; source: string }> {
  if (isPossibilitySource(input)) {
    const generated = await input.generate(intent);
    return { possibilities: normalizePossibilities(generated), source: input.name };
  }
  if (!Array.isArray(input)) {
    throw new TypeError("EVΛƎ: possibilities must be an array or a PossibilitySource.");
  }
  return { possibilities: normalizePossibilities(input), source: "static" };
}
