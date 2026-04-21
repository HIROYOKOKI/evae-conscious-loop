import Link from "next/link";
import DemoTabs from "@/components/demo/DemoTabs";
import DemoTopBar from "@/components/demo/DemoTopBar";
import { blockMock, demoMeta } from "@/lib/demo/mockData";

export default function DemoBlockPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <DemoTopBar
        traceId={demoMeta.traceId}
        timestamp={blockMock.timestamp}
        env={demoMeta.env}
        version={demoMeta.version}
        statusLabel={blockMock.statusLabel}
        statusKey="BLOCK"
        dark
      />

      <DemoTabs activeKey="block" />

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex items-start justify-center lg:justify-start">
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-orange-50">
                <ShieldAlertIcon />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-5xl font-semibold tracking-tight">
                  判定: <span className="text-[#FF4500]">BLOCK</span>
                </h1>

                <div className="inline-flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-xl font-semibold text-[#C2410C]">
                  <BarsIcon />
                  <span>信頼度: {blockMock.confidence}</span>
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl bg-[#DC2626] px-4 py-3 text-xl font-semibold text-white shadow-sm">
                  <TriangleAlertIcon className="h-6 w-6" />
                  <span>{blockMock.riskLabel}</span>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-8 text-slate-700">
                <span className="font-semibold text-slate-900">理由:</span>{" "}
                {blockMock.reason}
              </p>

              <div className="mt-8 border-t border-slate-200 pt-8">
                <div className="grid gap-8 xl:grid-cols-[1fr_1.35fr]">
                  <section>
                    <div className="text-[15px] font-semibold text-slate-900">
                      {blockMock.riskTitle}
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[290px_1fr]">
                      <div className="rounded-[22px] border border-orange-200 bg-orange-50 px-6 py-6">
                        <div className="flex items-center gap-4">
                          <TriangleAlertIcon className="h-10 w-10 text-[#DC2626]" />
                          <div className="text-[15px] font-semibold text-slate-900">
                            {blockMock.riskLevelLabel}:{" "}
                            <span className="text-[#DC2626]">
                              {blockMock.riskLevelValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-4 pt-2 text-[15px] text-slate-700">
                        {blockMock.anomalies.map((item) => (
                          <li key={item} className="flex items-center gap-4">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section className="xl:border-l xl:border-slate-200 xl:pl-8">
                    <div className="text-[15px] font-semibold text-slate-900">
                      {blockMock.actionTitle}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-4">
                      <Link
                        href="/demo/safe?resolved=1"
                        className="inline-flex min-h-[72px] min-w-[260px] items-center justify-center gap-3 rounded-[20px] bg-[#FF4500] px-6 py-4 text-xl font-semibold text-white shadow-sm transition hover:opacity-95"
                      >
                        <RefreshIcon />
                        <span>{blockMock.actions.primary}</span>
                      </Link>

                      <button
                        type="button"
                        className="inline-flex min-h-[72px] min-w-[260px] items-center justify-center gap-3 rounded-[20px] border border-orange-300 bg-white px-6 py-4 text-xl font-semibold text-[#FF4500] transition hover:bg-orange-50"
                      >
                        <UserIcon />
                        <span>{blockMock.actions.secondary}</span>
                      </button>

                      <button
                        type="button"
                        className="inline-flex min-h-[72px] min-w-[260px] items-center justify-center gap-3 rounded-[20px] border border-red-300 bg-white px-6 py-4 text-xl font-semibold text-[#DC2626] transition hover:bg-red-50"
                      >
                        <TriangleAlertIcon className="h-7 w-7" />
                        <span>{blockMock.actions.danger}</span>
                      </button>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-[15px] font-semibold text-[#DC2626]">
                      <TriangleAlertIcon className="h-5 w-5" />
                      <span>{blockMock.overrideWarning}</span>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_1.05fr]">
          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-red-50">
                <EchoIcon />
              </div>

              <div>
                <div className="text-[22px] font-semibold text-slate-900">
                  {blockMock.signatureTitle}
                </div>
                <p className="mt-3 text-[15px] leading-8 text-slate-700">
                  {blockMock.signatureBody}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-red-50">
                <BlockedCalendarIcon />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-[22px] font-semibold text-slate-900">
                    {blockMock.executionStatusTitle}
                  </div>
                  <span className="rounded-full bg-[#DC2626] px-3 py-1 text-sm font-semibold text-white">
                    {blockMock.executionStatusBadge}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-[15px] leading-8 text-slate-700">
                  {blockMock.executionStatusBody.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[22px] font-semibold text-slate-900">
                {blockMock.auditTitle}
              </div>
              <Link
                href="/demo/trace"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#FF4500]"
              >
                <span>{blockMock.auditLinkLabel}</span>
                <ArrowLink />
              </Link>
            </div>

            <div className="mt-5 divide-y divide-slate-200">
              {blockMock.auditLogs.map((log) => (
                <div
                  key={`${log.at}-${log.text}`}
                  className="flex items-center gap-4 py-4 text-[15px] text-slate-700"
                >
                  <ClockMini className="text-[#DC2626]" />
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

function ShieldAlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-24 w-24 text-[#FF4500]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 4.8-3.1 7.9-7 9-3.9-1.1-7-4.2-7-9V6l7-3z" />
      <path d="M12 8.5v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
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

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 1-15.5 6.4" />
      <path d="M3 12A9 9 0 0 1 18.5 5.6" />
      <path d="M3 16v-4h4" />
      <path d="M21 8v4h-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function TriangleAlertIcon({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function EchoIcon() {
  return (
    <div className="text-[56px] font-semibold leading-none text-[#DC2626]">Ǝ</div>
  );
}

function BlockedCalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-12 w-12 text-[#DC2626]"
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
      <circle cx="12" cy="16" r="3.5" />
      <path d="m9.5 18.5 5-5" />
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

function ClockMini({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={["h-5 w-5 shrink-0", className].join(" ")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
