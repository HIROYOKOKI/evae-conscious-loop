import type { ModelAdapter } from "./types.js";

/**
 * Offline model for tests, demos and first runs without an API key.
 * Returns the given response (or the function's result) verbatim.
 */
export function mockModel(
  response: string | ((prompt: string) => string),
  name = "mock",
): ModelAdapter {
  return {
    name,
    async complete({ prompt }) {
      return typeof response === "function" ? response(prompt) : response;
    },
  };
}
