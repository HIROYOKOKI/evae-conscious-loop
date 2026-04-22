import Link from "next/link";

const BRAND = {
  E: "#FF4500",
  V: "#1E3A8A",
  L: "#84CC16",
  T: "#B833F5",
};

const cards = [
  {
    title: "安全に実行できる",
    text: "通常時は、入力とポリシー検証を通過した判断だけが実行されます。",
    href: "/demo/safe",
    accent: BRAND.L,
    label: "SAFE",
  },
  {
    title: "危険時に止まる",
    text: "危険条件を検知した場合、実行前に処理を停止し、人や再確認へ分岐できます。",
    href: "/demo/block",
    accent: BRAND.E,
    label: "BLOCK",
  },
  {
    title: "変更と責任が追える",
    text: "誰が、いつ、何を変えたかを追跡し、必要に応じてロールバックできます。",
    href: "/demo/trace",
    accent: BRAND.T,
    label: "TRACE",
  },
];

export default function DemoEntryPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <header className="rounded-[30px] border border-slate-200 bg-white px-8 py-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-end gap-3 text-[54px] font-semibold leading-none tracking-tight">
                <span style={{ color: BRAND.E }}>E</span>
                <span style={{ color: BRAND.V }}>V</span>
                <span style={{ color: BRAND.L }}>Λ</span>
                <span style={{ color: BRAND.T }}>Ǝ</span>
              </div>

              <div className="mt-3 text-base text-slate-500">
                Design-by-Transparency
              </div>

              <h1 className="mt-8 text-5xl font-semibold tracking-tight md:text-6xl">
                EVΛƎ Demo App
              </h1>

              <p className="mt-5 max-w-3xl text-[17px] leading-8 text-slate-600">
                AIの出力ではなく、
                <span className="font-semibold text-slate-900">
                  判断の成立条件と責任の所在
                </span>
                を見せる営業用デモです。
                <br />
                1分以内で、
                <span className="font-semibold text-slate-900">
                  安全に実行できること / 危険時に止まること / 変更と責任が追跡できること
                </span>
                を体験できます。
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[260px]">
              <Link
                href="/demo/safe"
                className="inline-flex items-center justify-center rounded-[20px] bg-[#0f172a] px-6 py-4 text-lg font-semibold text-white transition hover:opacity-95"
              >
                デモを開始
              </Link>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <Link
                  href="/demo/safe"
                  className="inline-flex items-center justify-center rounded-[18px] border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  安全を見る
                </Link>
                <Link
                  href="/demo/block"
                  className="inline-flex items-center justify-center rounded-[18px] border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  停止を見る
                </Link>
                <Link
                  href="/demo/trace"
                  className="inline-flex items-center justify-center rounded-[18px] border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  追跡を見る
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
            >
              <div
                className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  backgroundColor: `${card.accent}14`,
                  color: card.accent,
                }}
              >
                {card.label}
              </div>

              <h2 className="mt-5 text-[28px] font-semibold tracking-tight text-slate-900">
                {card.title}
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-slate-600">
                {card.text}
              </p>

              <div
                className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold"
                style={{ color: card.accent }}
              >
                <span>この画面を見る</span>
                <ArrowRight />
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-[26px] border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <div className="text-sm font-semibold text-slate-500">
                このデモで伝えること
              </div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                EVΛƎは、動く / 止まる / 戻せる / 追える を構造で実現する
              </h3>
            </div>

            <div className="space-y-3 text-[15px] leading-8 text-slate-700">
              <p>・この状態のAIは実行しない</p>
              <p>・誰かが無理に実行した場合、その判断は記録される</p>
              <p>・変更後も履歴を追跡し、必要なら前の状態へ戻せる</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ArrowRight() {
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
