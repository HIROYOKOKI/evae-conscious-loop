import DemoTabs from "@/components/demo/DemoTabs";
import DemoTopBar from "@/components/demo/DemoTopBar";
import { demoMeta, safeMock } from "@/lib/demo/mockData";

export default function DemoSafePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <DemoTopBar
        traceId={demoMeta.traceId}
        timestamp={safeMock.timestamp}
        env={demoMeta.env}
        version={demoMeta.version}
        statusLabel={safeMock.statusLabel}
        statusKey="SAFE"
      />

      <DemoTabs activeKey="safe" />

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex items-start justify-center lg:justify-start">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-green-50">
                <ShieldCheckIcon />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-5xl font-semibold tracking-tight">
                  判定: <span className="text-[#16a34a]">SAFE</span>
                </h1>

                <div className="inline-flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xl font-semibold text-green-700">
                  <BarsIcon />
                  <span>信頼度: {safeMock.confidence}</span>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-8 text-slate-700">
                <span className="font-semibold text-slate-900">理由:</span>{" "}
                {safeMock.reason}
              </p>

              <div className="mt-8 border-t border-slate-200 pt-7">
                <div className="mb-5 text-[15px] font-semibold text-slate-900">
                  {safeMock.flowTitle}
                </div>

                <div className="grid items-center gap-5 lg:grid-cols-[1fr_70px_1fr_70px_1fr]">
                  <FlowCard
                    color="#FF4500"
                    label={safeMock.flow[0].label}
                    symbol="E"
                    bgClass="bg-orange-50"
                    borderClass="border-orange-200"
                    textClass="text-[#FF4500]"
                  />

                  <ArrowRight />

                  <FlowCard
                    color="#1E3A8A"
                    label={safeMock.flow[1].label}
                    symbol="V"
                    bgClass="bg-blue-50"
                    borderClass="border-blue-200"
                    textClass="text-[#1E3A8A]"
                  />

                  <ArrowRight />

                  <FlowCard
                    color="#84CC16"
                    label={safeMock.flow[2].label}
                    symbol="Λ"
                    bgClass="bg-lime-50"
                    borderClass="border-lime-200"
                    textClass="text-[#65a30d]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-green-50">
                <CalendarIcon />
              </div>

              <div>
                <div className="text-[22px] font-semibold text-slate-900">
                  {safeMock.executionTitle}
                </div>
                <p className="mt-3 text-[15px] leading-8 text-slate-700">
                  {safeMock.executionResult}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[22px] font-semibold text-slate-900">
                {safeMock.auditTitle}
              </div>
              <div className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1E3A8A]">
                <span>{safeMock.auditLinkLabel}</span>
                <ArrowLink />
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-200">
              {safeMock.auditLogs.map((log) => (
                <div
                  key={`${log.at}-${log.text}`}
                  className="flex items-center gap-4 py-4 text-[15px] text-slate-700"
                >
                  <CheckCircleMini />
                  <span className="w-24 shrink-0 font-medium text-slate-600">
                    {log.at}
                  </span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FlowCard({
  symbol,
  label,
  color,
  bgClass,
  borderClass,
  textClass,
}: {
  symbol: string;
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}) {
  return (
    <div
      className={[
        "flex items-center gap-4 rounded-[22px] border px-6 py-5",
        bgClass,
        borderClass,
      ].join(" ")}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-2xl font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {symbol}
      </div>
      <div className={["text-xl font-semibold", textClass].join(" ")}>{label}</div>
    </div>
  );
}

function ArrowRight() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-24 w-24 text-[#16a34a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4.8-3.1 7.9-7 9-3.9-1.1-7-4.2-7-9V6l7-3z" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-green-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20V7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-12 w-12 text-[#16a34a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function CheckCircleMini() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-[#16a34a]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5" />
    </svg>
  );
}

function ArrowLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
