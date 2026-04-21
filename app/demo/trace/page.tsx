import DemoTabs from "@/components/demo/DemoTabs";
import DemoTopBar from "@/components/demo/DemoTopBar";
import { demoMeta, traceMock } from "@/lib/demo/mockData";

export default function DemoTracePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <DemoTopBar
        traceId={demoMeta.traceId}
        timestamp={traceMock.timestamp}
        env={demoMeta.env}
        version={demoMeta.version}
        statusLabel={traceMock.statusLabel}
        statusKey="TRACE"
      />

      <DemoTabs activeKey="trace" />

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
            <div className="flex items-start justify-center lg:justify-start">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-violet-50">
                <TraceIcon />
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-semibold tracking-tight">
                {traceMock.title}
              </h1>

              <p className="mt-3 text-[15px] leading-8 text-slate-600">
                {traceMock.subtitle}
              </p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex flex-wrap items-center gap-4 text-[15px] text-slate-600">
                  <MetaInline
                    icon={<FingerprintMini />}
                    label="トレースID"
                    value={demoMeta.traceId}
                  />
                  <DotSeparator />
                  <MetaInline
                    icon={<ClockMini />}
                    label="開始"
                    value={traceMock.startedAt}
                  />
                  <DotSeparator />
                  <MetaInline
                    icon={<UserMini />}
                    label="起案者"
                    value={traceMock.initiator}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.2fr_1.05fr]">
          <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
            <div className="text-[22px] font-semibold text-slate-900">
              {traceMock.timelineTitle}
            </div>

            <div className="mt-6 space-y-0">
              {traceMock.timeline.map((item, index) => {
                const isLast = index === traceMock.timeline.length - 1;

                return (
                  <div key={`${item.step}-${item.at}`} className="grid grid-cols-[46px_1fr] gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                        {item.step}
                      </div>
                      {!isLast ? (
                        <div className="mt-2 h-full min-h-[68px] w-[2px] bg-violet-200" />
                      ) : null}
                    </div>

                    <div className="pb-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[15px] font-medium text-slate-500">
                          {item.at}
                        </div>
                        <ChevronRight />
                      </div>

                      <div className="mt-1 text-[17px] font-semibold text-slate-900">
                        {item.title}
                      </div>

                      <p className="mt-2 text-[15px] leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <StepBadge number={1} />
                  <div className="text-[18px] font-semibold text-slate-900">
                    {traceMock.diffTitle}
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[15px] font-semibold text-slate-700"
                >
                  <span>{traceMock.diffButtonLabel}</span>
                  <ExternalIcon />
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-[20px] border border-slate-200">
                <div className="grid md:grid-cols-2">
                  <div className="border-b border-slate-200 bg-red-50 px-4 py-3 text-[15px] font-semibold text-red-600 md:border-b-0 md:border-r">
                    {traceMock.diffBeforeLabel}
                  </div>
                  <div className="bg-green-50 px-4 py-3 text-[15px] font-semibold text-green-600">
                    {traceMock.diffAfterLabel}
                  </div>
                </div>

                <div className="grid md:grid-cols-2">
                  <div className="border-t border-slate-200 px-4 py-4 text-[15px] leading-8 text-red-600 md:border-r">
                    - {traceMock.diffBefore}
                  </div>
                  <div className="border-t border-slate-200 px-4 py-4 text-[15px] leading-8 text-green-600">
                    + {traceMock.diffAfter}
                  </div>
                </div>
              </div>
            </section>

            <InfoCard
              step={2}
              title={traceMock.ruleUpdateTitle}
              value={traceMock.ruleUpdateValue}
              highlight="0.85"
            />

            <InfoCard
              step={3}
              title={traceMock.modelUpdateTitle}
              value={traceMock.modelUpdateValue}
              highlight="evae-core-1.2.7"
            />

            <InfoCard
              step={4}
              title={traceMock.commitTitle}
              value={traceMock.commitValue}
              highlight="SAFE"
              highlightColorClass="text-green-600"
            />
          </div>

          <div className="space-y-6">
            <section className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[22px] font-semibold text-slate-900">
                  {traceMock.responsibilityTitle}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-violet-600"
                >
                  <span>{traceMock.responsibilityLinkLabel}</span>
                  <ArrowLink />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_130px_1fr] gap-4 border-b border-slate-200 pb-3 text-[14px] font-semibold text-slate-500">
                <div>{traceMock.responsibilityHeaders.actor}</div>
                <div>{traceMock.responsibilityHeaders.at}</div>
                <div>{traceMock.responsibilityHeaders.action}</div>
              </div>

              <div className="divide-y divide-slate-200">
                {traceMock.responsibilityLogs.map((log) => (
                  <div
                    key={`${log.actor}-${log.at}-${log.action}`}
                    className="grid grid-cols-[1fr_130px_1fr] items-center gap-4 py-4 text-[15px] text-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      {log.actor === "system" ? <GearMini /> : <UserMini />}
                      <span>{log.actor}</span>
                    </div>
                    <div>{log.at}</div>
                    <div>{log.action}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-violet-200 bg-violet-50 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-[20px] border border-violet-300 bg-white px-6 py-5 text-[18px] font-semibold text-violet-700"
              >
                <RollbackIcon />
                <span>{traceMock.rollbackTitle}</span>
              </button>

              <p className="mt-4 text-center text-[15px] leading-7 text-slate-700">
                {traceMock.rollbackDescription}
              </p>

              <div className="mt-5 flex items-center gap-3 text-[15px] text-slate-600">
                <LockMini />
                <span>{traceMock.rollbackNote}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaInline({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-slate-500">{icon}</span>
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function DotSeparator() {
  return <span className="text-slate-300">•</span>;
}

function StepBadge({ number }: { number: number }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
      {number}
    </div>
  );
}

function InfoCard({
  step,
  title,
  value,
  highlight,
  highlightColorClass = "text-green-600",
}: {
  step: number;
  title: string;
  value: string;
  highlight: string;
  highlightColorClass?: string;
}) {
  const parts = value.split(highlight);

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <StepBadge number={step} />
        <div className="text-[18px] font-semibold text-slate-900">{title}</div>
      </div>

      <p className="mt-4 text-[15px] leading-8 text-slate-700">
        {parts[0]}
        <span className={["font-semibold", highlightColorClass].join(" ")}>
          {highlight}
        </span>
        {parts[1]}
      </p>
    </section>
  );
}

function TraceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-20 w-20 text-violet-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M8 6h3.5c2.5 0 4.5 2 4.5 4.5V12" />
      <path d="M8 18h3.5c2.5 0 4.5-2 4.5-4.5V12" />
      <path d="M6 8.3v7.4" />
    </svg>
  );
}

function FingerprintMini() {
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
      <path d="M12 3a7 7 0 0 0-7 7" />
      <path d="M5 10.5c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <path d="M8.2 10.8c0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8" />
      <path d="M12 10v4.5" />
    </svg>
  );
}

function ClockMini() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function UserMini() {
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
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function GearMini() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1A1.7 1.7 0 0 0 10 3.2V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ExternalIcon() {
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
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 14v5h-5" />
      <path d="M5 10V5h5" />
      <path d="M5 19h5" />
      <path d="M5 5l6 6" />
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

function RollbackIcon() {
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
      <path d="M3 7v6h6" />
      <path d="M21 17a8 8 0 0 0-13.7-5.7L3 13" />
    </svg>
  );
}

function LockMini() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-violet-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
