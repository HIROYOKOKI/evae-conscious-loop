export { createLoop, evae, VERSION } from "./loop.js";
export type { ConsciousLoop } from "./loop.js";

export { resolveIntent } from "./intent.js";
export { resolvePossibilities, normalizePossibilities, toId } from "./possibility.js";
export { evaluateBoundary } from "./boundary.js";
export { canonicalize, createTraceId, TRACE_SCHEMA_VERSION } from "./trace.js";

export { fromModel } from "./adapters/from-model.js";
export { anthropic } from "./adapters/anthropic.js";
export { openai } from "./adapters/openai.js";
export { mockModel } from "./adapters/mock.js";
export type { ModelAdapter, ModelRequest } from "./adapters/types.js";

export type * from "./types.js";
