import { SectionCard } from "./SectionCard";

export type GoalMode = "words" | "chars";

interface GoalBarProps {
  mode: GoalMode;
  target: number;
  current: number;
  onModeChange: (m: GoalMode) => void;
  onTargetChange: (n: number) => void;
}

function statusColor(ratio: number): string {
  if (ratio >= 1.1) return "var(--error)";
  if (ratio >= 0.9) return "var(--success)";
  if (ratio >= 0.6) return "var(--warning)";
  return "var(--accent)";
}

export function GoalBar({ mode, target, current, onModeChange, onTargetChange }: GoalBarProps) {
  const ratio = target > 0 ? current / target : 0;
  const pct = Math.min(100, ratio * 100);
  const color = statusColor(ratio);
  const remaining = target - current;
  const over = remaining < 0;

  return (
    <SectionCard
      title="Goal"
      action={
        <div
          className="flex rounded-md p-0.5 text-[10px] font-medium"
          style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        >
          {(["words", "chars"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => onModeChange(m)}
              className="rounded px-2 py-0.5 transition-colors capitalize"
              style={{
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "white" : "var(--muted)",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex items-center gap-2">
        <label className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
          Target
        </label>
        <input
          type="number"
          min={0}
          value={target}
          onChange={e => onTargetChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-24 rounded-md px-2 py-1 text-sm tabular-nums focus:outline-none"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
        />
        <div className="flex flex-wrap gap-1">
          {[140, 280, 500, 1000, 2000].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onTargetChange(n)}
              className="rounded px-1.5 py-0.5 text-[10px] transition-colors"
              style={{
                background: target === n ? "var(--accent)" : "transparent",
                color: target === n ? "white" : "var(--muted)",
                border: "1px solid var(--line)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-3 h-2 w-full rounded-full overflow-hidden"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
      >
        <div
          className="h-full transition-[width,background-color] duration-200"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="mt-1.5 flex items-baseline justify-between text-xs tabular-nums">
        <span style={{ color: "var(--muted)" }}>
          {current.toLocaleString()} / {target.toLocaleString()} {mode}
        </span>
        <span style={{ color }} className="font-medium">
          {over
            ? `+${Math.abs(remaining).toLocaleString()} over`
            : `${remaining.toLocaleString()} to go`}
        </span>
      </div>
    </SectionCard>
  );
}
