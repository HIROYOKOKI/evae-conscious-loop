import type { Intent, Possibility, PossibilitySource } from "../types.js";
import type { ModelAdapter } from "./types.js";

export interface FromModelOptions {
  /**
   * The possibility ids the model may choose from. The model proposes and ranks;
   * the ids stay stable so boundary rules can refer to them.
   */
  choices: Array<string | { id: string; description?: string }>;
  /** Extra instructions appended to the system prompt. */
  guidance?: string;
}

const SYSTEM = `You propose possible actions for an intent.
Return ONLY a JSON array, most preferred first. No prose, no code fences.
Each item: {"id": <one of the allowed ids>, "label": <short label>, "description": <one sentence why>}.
Use each id at most once. Include every allowed id that is a reasonable option.`;

/** V — ask a model to propose and rank possibilities. */
export function fromModel(model: ModelAdapter, options: FromModelOptions): PossibilitySource {
  const choices = options.choices.map((c) => (typeof c === "string" ? { id: c } : c));
  const allowed = new Set(choices.map((c) => c.id));
  if (allowed.size === 0) throw new TypeError("EVΛƎ: fromModel needs at least one choice.");

  return {
    name: `model:${model.name}`,
    async generate(intent: Intent): Promise<Possibility[]> {
      const prompt = [
        `Intent: ${intent.text}`,
        intent.context ? `Context: ${JSON.stringify(intent.context)}` : "",
        `Allowed ids:`,
        ...choices.map((c) => `- ${c.id}${c.description ? `: ${c.description}` : ""}`),
      ]
        .filter(Boolean)
        .join("\n");

      const raw = await model.complete({
        system: options.guidance ? `${SYSTEM}\n${options.guidance}` : SYSTEM,
        prompt,
      });
      const parsed = parseJsonArray(raw);

      const out: Possibility[] = [];
      for (const item of parsed) {
        if (!item || typeof item !== "object") continue;
        const { id, label, description } = item as Record<string, unknown>;
        if (typeof id !== "string" || !allowed.has(id)) continue; // ignore invented ids
        if (out.some((p) => p.id === id)) continue;
        out.push({
          id,
          label: typeof label === "string" && label ? label : id,
          ...(typeof description === "string" ? { description } : {}),
        });
      }
      if (out.length === 0) {
        throw new Error(`EVΛƎ: model returned no usable possibilities. Raw output: ${raw.slice(0, 200)}`);
      }
      return out;
    },
  };
}

function parseJsonArray(raw: string): unknown[] {
  const cleaned = raw.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end <= start) {
    throw new Error(`EVΛƎ: model output is not a JSON array. Raw output: ${raw.slice(0, 200)}`);
  }
  const value = JSON.parse(cleaned.slice(start, end + 1));
  if (!Array.isArray(value)) throw new Error("EVΛƎ: model output is not a JSON array.");
  return value;
}
