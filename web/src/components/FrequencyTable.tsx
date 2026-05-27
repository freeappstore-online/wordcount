import { useMemo, useState } from "react";
import { tokenize, wordFrequency } from "../lib/analyze";
import { SectionCard } from "./SectionCard";

type SortKey = "count" | "alpha" | "length";
type SortDir = "asc" | "desc";

interface FrequencyTableProps {
  text: string;
}

export function FrequencyTable({ text }: FrequencyTableProps) {
  const [excludeStop, setExcludeStop] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo<Array<[string, number]>>(() => {
    const tokens = tokenize(text);
    const freq = wordFrequency(tokens, { excludeStopWords: excludeStop });
    const entries = Array.from(freq.entries());
    entries.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "count") cmp = a[1] - b[1];
      else if (sortKey === "alpha") cmp = a[0].localeCompare(b[0]);
      else cmp = a[0].length - b[0].length;
      if (cmp === 0) cmp = b[1] - a[1] || a[0].localeCompare(b[0]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return entries.slice(0, 20);
  }, [text, excludeStop, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "count" ? "desc" : "asc");
    }
  }

  function arrow(key: SortKey): string {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  return (
    <SectionCard
      title="Word frequency (top 20)"
      action={
        <label className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--muted)" }}>
          <input
            type="checkbox"
            checked={excludeStop}
            onChange={e => setExcludeStop(e.target.checked)}
          />
          Hide stop words
        </label>
      }
    >
      {rows.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No words yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th
                  className="text-left text-[10px] font-semibold uppercase tracking-wider pb-2 cursor-pointer select-none"
                  onClick={() => toggleSort("alpha")}
                >
                  Word{arrow("alpha")}
                </th>
                <th
                  className="text-right text-[10px] font-semibold uppercase tracking-wider pb-2 cursor-pointer select-none"
                  onClick={() => toggleSort("length")}
                >
                  Length{arrow("length")}
                </th>
                <th
                  className="text-right text-[10px] font-semibold uppercase tracking-wider pb-2 cursor-pointer select-none"
                  onClick={() => toggleSort("count")}
                >
                  Count{arrow("count")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([word, count]) => (
                <tr key={word} style={{ borderTop: "1px solid var(--line)" }}>
                  <td className="py-1.5 pr-2" style={{ color: "var(--ink)" }}>{word}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums" style={{ color: "var(--muted)" }}>
                    {Array.from(word).length}
                  </td>
                  <td className="py-1.5 text-right tabular-nums font-medium" style={{ color: "var(--ink)" }}>
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
