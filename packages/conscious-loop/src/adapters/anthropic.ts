import type { ModelAdapter } from "./types.js";

export interface AnthropicOptions {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
}

/** Anthropic Messages API via fetch (no SDK dependency). */
export function anthropic(options: AnthropicOptions = {}): ModelAdapter {
  const model = options.model ?? "claude-sonnet-4-6";
  return {
    name: `anthropic/${model}`,
    async complete({ system, prompt }) {
      const apiKey = options.apiKey ?? readEnv("ANTHROPIC_API_KEY");
      if (!apiKey) throw new Error("EVΛƎ: ANTHROPIC_API_KEY is not set.");
      const res = await fetch(`${options.baseUrl ?? "https://api.anthropic.com"}/v1/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: options.maxTokens ?? 1024,
          system,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`EVΛƎ: Anthropic API ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as { content?: { type: string; text?: string }[] };
      return (data.content ?? [])
        .filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("");
    },
  };
}

function readEnv(key: string): string | undefined {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.[key];
}
