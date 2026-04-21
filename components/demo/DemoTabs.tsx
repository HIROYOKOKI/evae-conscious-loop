import Link from "next/link";
import { demoTabs, type DemoTabKey } from "@/lib/demo/mockData";

type DemoTabsProps = {
  activeKey: DemoTabKey;
};

export default function DemoTabs({ activeKey }: DemoTabsProps) {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-6">
        {demoTabs.map((tab) => {
          const isActive = tab.key === activeKey;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={[
                "relative inline-flex h-16 items-center text-[15px] font-semibold transition-colors",
                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              <span>{tab.label}</span>

              {isActive ? (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                  style={{
                    backgroundColor:
                      tab.key === "safe"
                        ? "#1E3A8A"
                        : tab.key === "block"
                        ? "#FF4500"
                        : "#B833F5",
                  }}
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
