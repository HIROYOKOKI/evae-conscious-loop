import Link from "next/link";

const EVAE = {
  E: "#FF4500",
  V: "#1E3A8A",
  L: "#84CC16",
  TRACE: "#B833F5",
};

const pillars = [
  {
    title: "Story",
    description:
      "EVΛƎ Universe presents the narrative layer of AI, responsibility, and human sovereignty.",
    accent: EVAE.TRACE,
  },
  {
    title: "Framework",
    description:
      "EVΛƎ defines a decision architecture that structures intent, options, gates, and trace before execution.",
    accent: EVAE.V,
  },
  {
    title: "Live Demo",
    description:
      "Explore the Conscious Loop and see how AI decisions can be structured and committed as trace.",
    accent: EVAE.E,
  },
];

const loop = [
  { symbol: "E", label: "Intent", color: EVAE.E, glow: "rgba(255,69,0,0.22)" },
  { symbol: "V", label: "Options", color: EVAE.V, glow: "rgba(30,58,138,0.24)" },
  { symbol: "Λ", label: "Decision Gate", color: EVAE.L, glow: "rgba(132,204,22,0.22)" },
  { symbol: "Ǝ", label: "Trace Commit", color: EVAE.TRACE, glow: "rgba(184,51,245,0.22)" },
];

export default function EvaeTopPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050814] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 14% 16%, rgba(255,69,0,0.10), transparent 24%),
            radial-gradient(circle at 78% 18%, rgba(184,51,245,0.18), transparent 24%),
            radial-gradient(circle at 50% 76%, rgba(30,58,138,0.22), transparent 30%),
            radial-gradient(circle at 84% 72%, rgba(132,204,22,0.10), transparent 18%),
            linear-gradient(180deg, #050814 0%, #071127 42%, #050814 100%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-12">
        <header className="mb-16 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.28em] text-white/70 uppercase backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: EVAE.TRACE }} />
            EVΛƎ (Eeva)
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a href="#framework" className="transition hover:text-white">
              Framework
            </a>
            <a href="#demo" className="transition hover:text-white">
              Demo
            </a>
            <a href="#universe" className="transition hover:text-white">
              Universe
            </a>
          </nav>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.24em] text-white/65 uppercase backdrop-blur">
              Design-by-Transparency for AI
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
              EVΛƎ structures AI decisions before execution.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
              EVΛƎ is a decision architecture for AI systems. Instead of generating explanations after an action,
              it structures the decision process itself through Intent, Options, Gate, and Trace.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: EVAE.E }}
              >
                Open Live Demo
              </Link>
              <a
                href="https://github.com/HIROYOKOKI/evae-conscious-loop"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
                style={{ borderColor: "rgba(184,51,245,0.38)", backgroundColor: "rgba(184,51,245,0.08)" }}
              >
                View GitHub
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {pillars.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px ${item.accent}20` }}
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.accent }} />
                    {item.title}
                  </div>
                  <p className="text-sm leading-6 text-white/65">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#090f22] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-[0.22em] text-white/45 uppercase">Core Structure</div>
                  <div className="mt-2 text-2xl font-semibold">
                    <span style={{ color: EVAE.E }}>E</span>
                    <span className="mx-2 text-white/70">→</span>
                    <span style={{ color: EVAE.V }}>V</span>
                    <span className="mx-2 text-white/70">→</span>
                    <span style={{ color: EVAE.L }}>Λ</span>
                    <span className="mx-2 text-white/70">→</span>
                    <span style={{ color: EVAE.TRACE }}>Ǝ</span>
                  </div>
                </div>
                <div
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{ borderColor: "rgba(184,51,245,0.35)", backgroundColor: "rgba(184,51,245,0.12)", color: "#e8c8ff" }}
                >
                  Conscious Loop
                </div>
              </div>

              <div className="space-y-3">
                {loop.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between rounded-2xl border px-4 py-4"
                    style={{
                      borderColor: `${item.color}55`,
                      background: `linear-gradient(180deg, ${item.glow}, rgba(255,255,255,0.02))`,
                      boxShadow: `0 0 24px ${item.glow}`,
                    }}
                  >
                    <div className="text-3xl font-semibold" style={{ color: item.color }}>
                      {item.symbol}
                    </div>
                    <div className="text-sm text-white/72">{item.label}</div>
                  </div>
                ))}
              </div>

              <div
                className="mt-5 rounded-2xl border p-4"
                style={{ borderColor: `${EVAE.L}55`, backgroundColor: "rgba(132,204,22,0.10)" }}
              >
                <div className="mb-2 text-xs tracking-[0.2em] uppercase" style={{ color: "#d2f59e" }}>
                  Core message
                </div>
                <p className="text-sm leading-6 text-white/85">
                  Traditional AI decides. EVΛƎ structures the decision before execution and commits the reason as trace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="framework" className="mt-24 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
            <div className="text-xs tracking-[0.24em] text-white/45 uppercase">Framework</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Reason before execution.</h2>
            <p className="mt-4 text-base leading-8 text-white/70">
              EVΛƎ is not a post-hoc explanation layer. It is a decision architecture that defines how an AI system
              should hold intent, evaluate options, pass a gate, and commit a trace.
            </p>
            <div
              className="mt-6 rounded-3xl border p-5 text-sm leading-7 text-white/75"
              style={{ borderColor: `${EVAE.V}40`, backgroundColor: "rgba(30,58,138,0.10)" }}
            >
              AI Model
              <br />↓
              <br />EVΛƎ Decision Architecture
              <br />↓
              <br />Application
            </div>
          </div>

          <div id="demo" className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
            <div className="text-xs tracking-[0.24em] text-white/45 uppercase">Live Demo</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Explore the Conscious Loop.</h2>
            <p className="mt-4 text-base leading-8 text-white/70">
              The live demo visualizes a minimal EVΛƎ interface for structuring AI decisions before execution. It shows
              Intent, Options, the Decision Gate, and the committed Trace JSON.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: EVAE.E }}
              >
                Open /demo
              </Link>
              <a
                href="https://evae-conscious-loop.vercel.app/demo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
                style={{ borderColor: `${EVAE.TRACE}66`, backgroundColor: "rgba(184,51,245,0.08)" }}
              >
                Public URL
              </a>
            </div>
            <div className="mt-5 text-sm" style={{ color: "#c9b8ff" }}>
              https://evae-conscious-loop.vercel.app/demo
            </div>
          </div>
        </section>

        <section id="universe" className="mt-24 rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">
          <div className="text-xs tracking-[0.24em] text-white/45 uppercase">Universe</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">A narrative layer for AI responsibility.</h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-white/70">
            EVΛƎ Universe expands the framework into story, character, and visual language. Together, the Universe,
            Framework, and Live Demo form one connected structure: narrative, concept, and implementation.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border p-5" style={{ borderColor: `${EVAE.TRACE}44`, backgroundColor: "rgba(184,51,245,0.07)" }}>
              <div className="mb-2 text-sm font-medium text-white">Narrative</div>
              <p className="text-sm leading-6 text-white/65">A story of AI, responsibility, and human sovereignty.</p>
            </div>
            <div className="rounded-3xl border p-5" style={{ borderColor: `${EVAE.V}44`, backgroundColor: "rgba(30,58,138,0.08)" }}>
              <div className="mb-2 text-sm font-medium text-white">Concept</div>
              <p className="text-sm leading-6 text-white/65">A decision architecture built around E → V → Λ → Ǝ.</p>
            </div>
            <div className="rounded-3xl border p-5" style={{ borderColor: `${EVAE.E}44`, backgroundColor: "rgba(255,69,0,0.08)" }}>
              <div className="mb-2 text-sm font-medium text-white">Implementation</div>
              <p className="text-sm leading-6 text-white/65">A live public demo that makes the structure visible.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
