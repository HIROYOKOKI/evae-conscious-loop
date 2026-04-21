type DemoStatusKey = "SAFE" | "BLOCK" | "TRACE";

type DemoTopBarProps = {
  traceId: string;
  timestamp: string;
  env: string;
  version: string;
  statusLabel: string;
  statusKey: DemoStatusKey;
  dark?: boolean;
};

const statusStyles: Record<
  DemoStatusKey,
  {
    badge: string;
    dot: string;
  }
> = {
  SAFE: {
    badge:
      "border border-green-200 bg-green-50 text-green-700",
    dot: "bg-green-600",
  },
  BLOCK: {
    badge:
      "border border-orange-300 bg-orange-600 text-white",
    dot: "bg-white",
  },
  TRACE: {
    badge:
      "border border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-600",
  },
};

export default function DemoTopBar({
  traceId,
  timestamp,
  env,
  version,
  statusLabel,
  statusKey,
  dark = false,
}: DemoTopBarProps) {
  const status = statusStyles[statusKey];

  return (
    <header
      className={[
        "w-full border-b",
        dark
          ? "border-slate-800 bg-[#07111f] text-white"
          : "border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-3 text-[42px] font-semibold leading-none tracking-tight">
              <span style={{ color: "#FF4500" }}>E</span>
              <span style={{ color: "#1E3A8A" }}>V</span>
              <span style={{ color: "#84CC16" }}>Λ</span>
              <span style={{ color: "#B833F5" }}>Ǝ</span>
            </div>
          </div>
          <div
            className={[
              "mt-2 text-sm",
              dark ? "text-slate-300" : "text-slate-500",
            ].join(" ")}
          >
            Design-by-Transparency
          </div>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          <MetaChip
            dark={dark}
            icon={<FingerprintIcon />}
            label="トレースID"
            value={traceId}
          />
          <MetaChip
            dark={dark}
            icon={<ClockIcon />}
            label="タイムスタンプ"
            value={timestamp}
          />
          <MetaChip
            dark={dark}
            icon={<ServerIcon />}
            label="環境"
            value={env}
          />
          <MetaChip
            dark={dark}
            icon={<TagIcon />}
            label="バージョン"
            value={version}
          />

          <div
            className={[
              "flex min-w-[160px] items-center gap-3 rounded-2xl px-5 py-4 text-lg font-semibold shadow-sm",
              status.badge,
            ].join(" ")}
          >
            <span className={["h-3 w-3 rounded-full", status.dot].join(" ")} />
            <span>{statusLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetaChip({
  label,
  value,
  icon,
  dark,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "flex min-w-[170px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
        dark
          ? "border-slate-700 bg-[#0b1728] text-white"
          : "border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      <div
        className={[
          "shrink-0",
          dark ? "text-slate-300" : "text-slate-500",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div
          className={[
            "text-xs font-medium",
            dark ? "text-slate-300" : "text-slate-500",
          ].join(" ")}
        >
          {label}
        </div>
        <div className="truncate text-[15px] font-semibold">{value}</div>
      </div>
    </div>
  );
}

function FingerprintIcon() {
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
      <path d="M12 3a7 7 0 0 0-7 7" />
      <path d="M5 10.5c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <path d="M8.2 10.8c0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8" />
      <path d="M12 10v4.5" />
      <path d="M9.4 12.8v2.7a4.6 4.6 0 0 0 9.2 0V13" />
      <path d="M6.5 13.2v2.2a7.5 7.5 0 0 0 15 0v-1.1" />
      <path d="M3.8 13.5v1.5a10.2 10.2 0 0 0 20.4 0" />
    </svg>
  );
}

function ClockIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ServerIcon() {
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
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01" />
      <path d="M8 17h.01" />
    </svg>
  );
}

function TagIcon() {
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
      <path d="M20 13l-7 7-9-9V4h7z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  );
}
