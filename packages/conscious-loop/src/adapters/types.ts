/**
 * Minimal model interface. Any LLM — hosted or local — can be used
 * by implementing this one method.
 */
export interface ModelRequest {
  system: string;
  prompt: string;
}

export interface ModelAdapter {
  /** e.g. "anthropic/claude-sonnet-4-6". Recorded in the trace. */
  readonly name: string;
  complete(request: ModelRequest): Promise<string>;
}
