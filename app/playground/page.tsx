"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { evae, type BoundaryRule, type RunResult } from "@evae/conscious-loop";

const BRAND = { E: "#FF4500", V: "#1E3A8A", L: "#84CC16", T: "#B833F5" };

const POSSIBILITIES = [
  { id: "send", label: "Send now", description: "The draft is complete and the client is waiting." },
  { id: "ask_human", label: "Ask a human", description: "An external send may need approval." },
  { id: "hold", label: "Hold", description: "Keep the draft until someone can review it." },
];

const RULES: BoundaryRule[] = [
  {
    id: "external-send-authority",
    description: "Only a human with the sender role may send to external domains",
    appliesTo: ["send"],
    check: ({ intent }) =>
      intent.context?.sender_role === "sender"
        ? true
        : { pass: false, reason: `sender_role is "${intent.context?.sender_role}", external send needs "sender"` },
  },
  {
    id: "approver-available",
    description: "Routing to a human requires an approver on duty",
    appliesTo: ["ask_human"],
    check: ({ intent }) =>
      intent.context?.approver_on_duty === true ? true : { pass: false, reason: "no approver is on duty" },
  },
];

export default function PlaygroundPage() {
  const [intentText, setIntentText] = useState("Send this quote email to the client automatically");
  const [senderRole, setSenderRole] = useState<"assistant" | "sender">("assistant");
  const [approverOnDuty, setApproverOnDuty] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    evae
      .run({
        intent: {
          text: intentText,
          context: { sender_role: senderRole, approver_on_duty: approverOnDuty },
        },
        possibilities: POSSIBILITIES,
        boundary: { rules: RULES },
        metadata: { source: "playground" },
      })
      .then((r) => {
        if (!cancelled) {
          setResult(r);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [intentText, senderRole, approverOnDuty]);

  const traceJson = useMemo(() => (result ? JSON.stringify(result.trace, null, 2) : ""), [result]);

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([traceJson], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.trace.trace_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-800">EVΛƎ</Link> / Developer Playground
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Conscious Loop Playground</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-600">
              This page runs <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">@evae/conscious-loop</code>{" "}
              in your browser. Change the intent or its context and watch the decision and trace update.
            </p>
          </div>
          <a
            href="https://github.com/HIROYOKOKI/evae-conscious-loop#quick-start"
            className="inline-flex w-fit items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Use it in your app
          </a>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ol className="flex flex-col gap-4">
            <Stage symbol="E" name="Intent" color={BRAND.E}>
              <label className="block text-sm text-slate-600" htmlFor="intent">What is the AI trying to do?</label>
              <input
                id="intent"
                value={intentText}
                onChange={(e) => setIntentText(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px] focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-600" htmlFor="role">Sender role</label>
                  <select
                    id="role"
                    value={senderRole}
                    onChange={(e) => setSenderRole(e.target.value as "assistant" | "sender")}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="assistant">assistant (AI)</option>
                    <option value="sender">sender (authorized human)</option>
                  </select>
                </div>
                <label className="flex items-center gap-2.5 self-end rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px]">
                  <input
                    type="checkbox"
                    checked={approverOnDuty}
                    onChange={(e) => setApproverOnDuty(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Approver on duty
                </label>
              </div>
            </Stage>

            <Stage symbol="V" name="Possibility" color={BRAND.V}>
              <p className="text-sm text-slate-600">Proposed options, most preferred first.</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {POSSIBILITIES.map((p, i) => {
                  const inside = result?.trace.decision_boundary.within.includes(p.id);
                  return (
                    <li key={p.id} className="flex items-baseline gap-3 text-[15px]">
                      <span className="w-4 text-right text-slate-400">{i + 1}</span>
                      <code className={inside ? "text-slate-900" : "text-slate-400 line-through"}>{p.id}</code>
                      <span className="text-slate-500">{p.description}</span>
                    </li>
                  );
                })}
              </ul>
            </Stage>

            <Stage symbol="Λ" name="Decision Boundary" color={BRAND.L}>
              <ul className="flex flex-col gap-2">
                {RULES.map((rule) => {
                  const ev = result?.trace.decision_boundary.evaluations.find((e) => e.rule === rule.id);
                  return (
                    <li key={rule.id} className="text-[15px]">
                      <span className={ev?.pass ? "text-green-700" : "text-[#c2410c]"}>{ev?.pass ? "pass" : "fail"}</span>{" "}
                      <span className="text-slate-800">{rule.description}</span>
                      {ev && !ev.pass && ev.reason ? <span className="block pl-9 text-sm text-slate-500">{ev.reason}</span> : null}
                    </li>
                  );
                })}
              </ul>
            </Stage>

            <Stage symbol="Ǝ" name="Trace" color={BRAND.T}>
              {error ? (
                <p className="text-[15px] text-[#c2410c]">{error}</p>
              ) : result ? (
                <>
                  <p className="text-[15px]">
                    Decision: <code className="text-lg font-semibold">{result.decision ?? "null"}</code>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{result.reason}</p>
                  <p className="mt-3 text-sm text-slate-500">
                    The loop decides but does not act. Executing the decision is up to your application.
                  </p>
                </>
              ) : (
                <p className="text-[15px] text-slate-500">Running…</p>
              )}
            </Stage>
          </ol>

          <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#0f172a] text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <h2 className="text-sm font-semibold">trace.json</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(traceJson)}
                  className="rounded-md border border-slate-600 px-2.5 py-1 text-xs hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  Copy
                </button>
                <button
                  onClick={download}
                  className="rounded-md border border-slate-600 px-2.5 py-1 text-xs hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-[12.5px] leading-5">{traceJson}</pre>
          </section>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Looking for the concept screens? See the <Link href="/demo" className="underline hover:text-slate-800">reference demo</Link>.
        </p>
      </div>
    </main>
  );
}

function Stage({
  symbol,
  name,
  color,
  children,
}: {
  symbol: string;
  name: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5" style={{ borderLeft: `4px solid ${color}` }}>
      <h2 className="mb-3 flex items-baseline gap-2.5">
        <span className="text-2xl font-semibold leading-none" style={{ color }}>{symbol}</span>
        <span className="text-[15px] font-semibold text-slate-800">{name}</span>
      </h2>
      {children}
    </li>
  );
}
