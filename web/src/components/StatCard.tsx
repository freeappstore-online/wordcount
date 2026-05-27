interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </div>
      <div className="mt-0.5 text-xl font-bold tabular-nums" style={{ color: "var(--ink)" }}>
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}
