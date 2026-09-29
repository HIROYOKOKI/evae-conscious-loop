import type { ModelAdapter } from "./types.js";

export interface OpenAIOptions {
  apiKey?: string;
  model?: string;
  /** Any OpenAI-compatible endpoint works, including local servers (Ollama, LM Studio, vLLM). */
  baseUrl?: string;
}

/** OpenAI-compatible Chat Completions API via fetch (no SDK dependency). */
export function openai(options: OpenAIOptions = {}): ModelAdapter {
  const model = options.model ?? "gpt-4o-mini";
  const baseUrl = options.baseUrl ?? "https://api.openai.com/v1";
  return {
    name: `openai-compatible/${model}`,
    async complete({ system, prompt }) {
      const apiKey = options.apiKey ?? readEnv("OPENAI_API_KEY");
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (apiKey) headers.authorization = `Bearer ${apiKey}`;
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(`EVΛƎ: ${baseUrl} ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return data.choices?.[0]?.message?.content ?? "";
    },
  };
}

function readEnv(key: string): string | undefined {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.[key];
}
