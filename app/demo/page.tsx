//app/demo/page.tsx

"use client";

import { useMemo, useState } from "react";

type Decision = "allow" | "escalate" | "halt";

type Scenario = {
  intent: string;
  options: string[];
  authorityBoundary: "low" | "medium" | "high";
  reversibility: "reversible" | "limited" | "irreversible";
  injectedTool?: string;
};

type TraceRecord = {
  trace_id: string;
  intent: string;
  options: string[];
  decision: Decision;
  reason: string;
  authority_boundary: string;
  reversibility: string;
  injected_tool?: string;
  timestamp: string;
};

const baseScenario: Scenario = {
  intent: "Process vendor payment for an approved invoice",
  options: ["continue", "use_new_tool", "ask_human"],
  authorityBoundary: "medium",
  reversibility: "limited",
};

function runConsciousLoop(scenario: Scenario): Omit<TraceRecord, "trace_id" | "timestamp"> {
  if (scenario.injectedTool && scenario.authorityBoundary === "high") {
    return {
      intent: scenario.intent,
      options: scenario.options,
      decision: "escalate",
      reason:
        "A new high-authority tool was injected during runtime. Structural revalidation is required before execution.",
      authority_boundary: scenario.authorityBoundary,
      reversibility: scenario.reversibility,
      injected_tool: scenario.injectedTool,
    };
  }

  if (scenario.reversibility === "irreversible") {
    return {
      intent: scenario.intent,
      options: scenario.options,
      decision: "halt",
      reason:
        "The requested action is irreversible. Execution is halted before action until authority and reversibility conditions are clarified.",
      authority_boundary: scenario.authorityBoundary,
      reversibility: scenario.reversibility,
      injected_tool: scenario.injectedTool,
    };
  }

  return {
    intent: scenario.intent,
    options: scenario.options,
    decision: "allow",
    reason: "Execution remains within the approved scope and passes the conscious loop gate.",
    authority_boundary: scenario.authorityBoundary,
    reversibility: scenario.reversibility,
    injected_tool: scenario.injectedTool,
  };
}

function decisionTone(decision: Decision) {
  switch (decision) {
    case "allow":
      return {
        label: "ALLOW",
        border: "border-emerald-400/40",
        bg: "bg-emerald-500/10",
        text: "text-emerald-300",
        dot: "bg-emerald-400",
      };
    case "escalate":
      return {
        label: "ESCALATE",
        border: "border-amber-400/40",
        bg: "bg-amber-500/10",
        text: "text-amber-300",
        dot: "bg-amber-400",
      };
    case "halt":
      return {
        label: "HALT",
        border: "border-rose-400/40",
        bg: "bg-rose-500/10",
        text: "text-rose-300",
        dot: "bg-rose-400",
      };
  }
}

export default function EvaeConsciousLoopPage() {
  const [scenario, setScenario] = useState<Scenario>(baseScenario);
  const [trace, setTrace] = useState<TraceRecord | null>(null);

  const preview = useMemo(() => {
    const result = runConsciousLoop(scenario);
    return result;
  }, [scenario]);

  const tone = decisionTone(preview.decision);

  function injectTool() {
    setScenario((prev) => ({
      ...prev,
      injectedTool: "send_wire_transfer",
      authorityBoundary: "high",
    }));
  }

  function resetScenario() {
    setScenario(baseScenario);
    setTrace(null);
  }

  function commitTrace() {
    const result = runConsciousLoop(scenario);
    setTrace({
      trace_id: `evla-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...result,
    });
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-[0.24em] text-white/70 uppercase">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            EVΛƎ Conscious Loop
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Structure the decision <br className="hidden md:block" /> before execution.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            A minimal reference demo for EVΛƎ. Instead of explaining AI actions after execution,
            this interface visualizes how Intent, Options, Gate, and Trace are structured before action.
          </p>
        </header>

        <section className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-4">
          {[
            ["E", "Intent"],
            ["V", "Options"],
            ["Λ", "Decision Gate"],
            ["Ǝ", "Trace Commit"],
          ].map(([symbol, label]) => (
            <div key={symbol} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-white">{symbol}</div>
              <div className="mt-2 text-sm text-white/70">{label}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-medium">Scenario</h2>
              <button
                onClick={resetScenario}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Reset
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <label className="mb-2 block text-white/60">Intent</label>
                <textarea
                  value={scenario.intent}
                  onChange={(e) => setScenario((prev) => ({ ...prev, intent: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1124] px-4 py-3 text-white outline-none placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-white/60">Authority Boundary</label>
                <select
                  value={scenario.authorityBoundary}
                  onChange={(e) =>
                    setScenario((prev) => ({
                      ...prev,
                      authorityBoundary: e.target.value as Scenario["authorityBoundary"],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1124] px-4 py-3 text-white outline-none"
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-white/60">Reversibility</label>
                <select
                  value={scenario.reversibility}
                  onChange={(e) =>
                    setScenario((prev) => ({
                      ...prev,
                      reversibility: e.target.value as Scenario["reversibility"],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1124] px-4 py-3 text-white outline-none"
                >
                  <option value="reversible">reversible</option>
                  <option value="limited">limited</option>
                  <option value="irreversible">irreversible</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-white/60">Injected Tool</label>
                <div className="flex gap-2">
                  <input
                    value={scenario.injectedTool ?? ""}
                    onChange={(e) =>
                      setScenario((prev) => ({
                        ...prev,
                        injectedTool: e.target.value || undefined,
                      }))
                    }
                    placeholder="No injected tool"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1124] px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                  <button
                    onClick={injectTool}
                    className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
                  >
                    Inject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-5 text-lg font-medium">Conscious Loop</h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 text-xs tracking-[0.2em] text-white/50 uppercase">E — Intent</div>
                <p className="text-sm text-white/90">{scenario.intent}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 text-xs tracking-[0.2em] text-white/50 uppercase">V — Options</div>
                <div className="flex flex-wrap gap-2">
                  {scenario.options.map((option) => (
                    <span
                      key={option}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl border p-4 ${tone.border} ${tone.bg}`}>
                <div className="mb-2 text-xs tracking-[0.2em] text-white/50 uppercase">Λ — Decision Gate</div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  <span className={`text-sm font-semibold ${tone.text}`}>{tone.label}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/80">{preview.reason}</p>
              </div>

              <button
                onClick={commitTrace}
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
              >
                Commit Ǝ Trace
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-medium">Trace Output</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                JSON
              </span>
            </div>

            {trace ? (
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b1124] p-4 text-xs leading-6 text-white/80">
                {JSON.stringify(trace, null, 2)}
              </pre>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-white/45">
                No trace committed yet. Run the conscious loop and commit the Ǝ trace.
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 text-xs tracking-[0.2em] text-white/50 uppercase">Core Message</div>
              <p className="text-sm leading-6 text-white/85">
                Traditional AI decides. EVΛƎ structures the decision before execution and commits the reason as trace.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
