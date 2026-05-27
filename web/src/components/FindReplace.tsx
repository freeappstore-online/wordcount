import { useMemo, useState } from "react";
import { buildFindRegex, countMatches, replaceAll } from "../lib/transforms";
import { Button } from "./Button";
import { SectionCard } from "./SectionCard";

interface FindReplaceProps {
  text: string;
  onChange: (next: string) => void;
}

export function FindReplace({ text, onChange }: FindReplaceProps) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regex, setRegex] = useState(false);

  const opts = { caseSensitive, regex };
  const regexValid = useMemo(() => {
    if (find === "") return true;
    return buildFindRegex(find, opts) !== null;
  }, [find, caseSensitive, regex]);

  const matches = useMemo(() => {
    if (!regexValid) return 0;
    return countMatches(text, find, opts);
  }, [text, find, caseSensitive, regex, regexValid]);

  const inputStyle = {
    background: "var(--paper)",
    color: "var(--ink)",
    border: `1px solid ${regexValid ? "var(--line)" : "var(--error)"}`,
  };

  return (
    <SectionCard title="Find & replace">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={find}
          onChange={e => setFind(e.target.value)}
          placeholder="Find…"
          className="rounded-md px-2.5 py-1.5 text-sm focus:outline-none"
          style={inputStyle}
        />
        <input
          type="text"
          value={replace}
          onChange={e => setReplace(e.target.value)}
          placeholder="Replace with…"
          className="rounded-md px-2.5 py-1.5 text-sm focus:outline-none"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
        />
        <div className="flex flex-wrap items-center gap-3 text-[11px]" style={{ color: "var(--muted)" }}>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={e => setCaseSensitive(e.target.checked)}
            />
            Aa case
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={regex}
              onChange={e => setRegex(e.target.checked)}
            />
            .* regex
          </label>
          <span className="ml-auto tabular-nums">
            {find === "" ? "—" : regexValid ? `${matches} match${matches === 1 ? "" : "es"}` : "invalid regex"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            disabled={!find || !regexValid || matches === 0}
            onClick={() => onChange(replaceAll(text, find, replace, opts))}
          >
            Replace all
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
