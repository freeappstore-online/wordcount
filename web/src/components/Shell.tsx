import type { ReactNode } from "react";

export type Tab = "stats" | "frequency" | "tools" | "snippets";

interface ShellProps {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  editor: ReactNode;
  side: ReactNode;
  topActions: ReactNode;
}

const TABS: ReadonlyArray<{ id: Tab; label: string; icon: string }> = [
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "frequency", label: "Frequency", icon: "🔤" },
  { id: "tools", label: "Tools", icon: "🛠" },
  { id: "snippets", label: "Snippets", icon: "📚" },
];

export function Shell({ tab, onTabChange, editor, side, topActions }: ShellProps) {
  return (
    <>
      {/* Desktop: two columns */}
      <div className="hidden md:flex h-screen">
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <header className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}
              >
                Word Counter
              </h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Live stats, frequency, transforms — all client-side.
              </p>
            </div>
            <div className="flex items-center gap-2">{topActions}</div>
          </header>
          <div className="max-w-3xl">{editor}</div>
        </main>
        <aside
          className="w-[28rem] shrink-0 overflow-auto border-l p-6"
          style={{ borderColor: "var(--line)", background: "var(--paper)" }}
        >
          <nav
            className="mb-4 flex rounded-lg p-0.5 text-xs font-medium"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className="flex-1 rounded-md px-2 py-1.5 transition-colors"
                style={{
                  background: tab === t.id ? "var(--accent)" : "transparent",
                  color: tab === t.id ? "white" : "var(--muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
          {side}
          <footer className="mt-6 text-[11px]" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </footer>
        </aside>
      </div>

      {/* Mobile: stacked + bottom tabs */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center justify-between px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="font-bold" style={{ fontFamily: "Fraunces, serif" }}>
            Word Counter
          </span>
          <div className="flex items-center gap-1.5">{topActions}</div>
        </header>
        <main className="flex-1 overflow-auto p-3 flex flex-col gap-4">
          {editor}
          {side}
        </main>
        <nav
          className="flex items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--dock)" }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors"
              style={{ color: tab === t.id ? "var(--accent)" : "var(--muted)" }}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
